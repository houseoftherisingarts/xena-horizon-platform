// Synchronisation avec Google Agenda (demande d'Alex, 8 septembre 2026) : les rendez-vous confirmés
// de Laurie deviennent des événements dans SON agenda Google, et les plages qu'elle a déjà occupées
// dans Google bloquent les nouveaux créneaux côté client. Rien de tout ça n'est déployé (projet Spark) :
// ce fichier compile et se vérifie sans réseau (voir functions/verif-agenda-google.ts), en attendant Blaze.
//
// Le jeton d'accès de Laurie (refresh_token OAuth) vit seul dans prive/agenda_google, un document que
// SEULES ces fonctions lisent : aucune règle client ne l'expose, l'admin non plus (firestore.rules).
import { onCall, onRequest, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { google, type calendar_v3 } from 'googleapis';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { actionPourRendezVous, evenementDepuisRendezVous, occupationsDepuisFreebusy, type RendezVousPourEvenement } from './sync';

const REGION = 'northamerica-northeast1';
const ADMIN_UID = 'O5qf5A3WdfV7daxkBKOIt0RnBUD2';
const ADMIN_EMAILS = ['houseoftherisingarts@gmail.com', 'laurie.belhumeur@gmail.com'];
const PUBLIC_BASE_URL = 'https://xenahorizon.com';
const PRIVE_PATH = 'prive/agenda_google';
const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'];
const HORIZON_JOURS = 60;
const ETAT_TTL_MS = 10 * 60 * 1000; // 10 minutes pour compléter l'écran de consentement Google

export const GOOGLE_OAUTH_CLIENT_ID = defineSecret('GOOGLE_OAUTH_CLIENT_ID');
export const GOOGLE_OAUTH_CLIENT_SECRET = defineSecret('GOOGLE_OAUTH_CLIENT_SECRET');
export const AGENDA_STATE_SECRET = defineSecret('AGENDA_STATE_SECRET');
const AGENDA_SECRETS = [GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, AGENDA_STATE_SECRET];

function assertAdmin(request: CallableRequest): void {
  const auth = request.auth;
  const email = auth?.token?.email;
  const emailOk = !!auth?.token?.email_verified && !!email && ADMIN_EMAILS.includes(email);
  if (!auth || (auth.uid !== ADMIN_UID && !emailOk)) {
    throw new HttpsError('permission-denied', 'Admin only.');
  }
}

const projectId = (): string => process.env.GCLOUD_PROJECT || 'xena-70977';
const redirectUri = (): string => `https://${REGION}-${projectId()}.cloudfunctions.net/agendaGoogleRetour`;

function oauthClient() {
  return new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID.value(), GOOGLE_OAUTH_CLIENT_SECRET.value(), redirectUri());
}

// State signé : sans lui, n'importe qui pourrait pointer agendaGoogleRetour vers son propre compte Google.
function signerEtat(): string {
  const payload = String(Date.now());
  const sig = createHmac('sha256', AGENDA_STATE_SECRET.value()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
function etatValide(etat: string): boolean {
  const [payload, sig] = String(etat || '').split('.');
  if (!payload || !sig) return false;
  const attendu = createHmac('sha256', AGENDA_STATE_SECRET.value()).update(payload).digest('base64url');
  const recu = Buffer.from(sig);
  const voulu = Buffer.from(attendu);
  if (recu.length !== voulu.length || !timingSafeEqual(recu, voulu)) return false;
  return Date.now() - Number(payload) < ETAT_TTL_MS;
}

interface DocPrive {
  refreshToken: string;
  email: string;
  calendrierId: string;
  connectedAt: Timestamp;
  derniereSync: Timestamp | null;
}

async function chargerConnexion(): Promise<DocPrive | null> {
  const snap = await getFirestore().doc(PRIVE_PATH).get();
  return snap.exists ? (snap.data() as DocPrive) : null;
}

function calendrierClient(refreshToken: string): calendar_v3.Calendar {
  const client = oauthClient();
  client.setCredentials({ refresh_token: refreshToken });
  return google.calendar({ version: 'v3', auth: client });
}

// ─── Ouvrir la porte : l'adresse de consentement Google ─────────────────────
export const agendaGoogleConnecter = onCall({ region: REGION, secrets: AGENDA_SECRETS }, async (request) => {
  assertAdmin(request);
  const url = oauthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state: signerEtat(),
  });
  return { url };
});

// ─── Le retour de Google : échange le code contre un jeton, l'écrit, referme la porte ──────────────
export const agendaGoogleRetour = onRequest({ region: REGION, secrets: AGENDA_SECRETS }, async (req, res) => {
  const code = String(req.query.code || '');
  const etat = String(req.query.state || '');
  if (!code || !etatValide(etat)) {
    res.redirect(`${PUBLIC_BASE_URL}/admin/agenda?google=erreur`);
    return;
  }
  try {
    const client = oauthClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.refresh_token) {
      // Google ne redonne un refresh_token qu'au premier consentement (prompt=consent force ce cas,
      // mais un compte déjà autorisé ailleurs peut quand même en manquer un) : sans lui, rien à garder.
      res.redirect(`${PUBLIC_BASE_URL}/admin/agenda?google=erreur`);
      return;
    }
    client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: client, version: 'v2' });
    const info = await oauth2.userinfo.get();
    await getFirestore()
      .doc(PRIVE_PATH)
      .set(
        {
          refreshToken: tokens.refresh_token,
          email: info.data.email || '',
          calendrierId: 'primary',
          connectedAt: Timestamp.now(),
          derniereSync: null,
        },
        { merge: true }
      );
    res.redirect(`${PUBLIC_BASE_URL}/admin/agenda?google=ok`);
  } catch (e) {
    console.error('[agendaGoogleRetour]', e);
    res.redirect(`${PUBLIC_BASE_URL}/admin/agenda?google=erreur`);
  }
});

// ─── L'état pour le panneau admin : connecté ou non, et le choix du calendrier cible ────────────────
interface EtatRequete {
  calendrierId?: string;
}
export const agendaGoogleEtat = onCall({ region: REGION, secrets: AGENDA_SECRETS }, async (request: CallableRequest<EtatRequete>) => {
  assertAdmin(request);
  const ref = getFirestore().doc(PRIVE_PATH);
  const snap = await ref.get();
  if (!snap.exists) return { connecte: false };
  const data = snap.data() as DocPrive;

  const calendrierId = request.data?.calendrierId;
  if (calendrierId && calendrierId !== data.calendrierId) {
    await ref.update({ calendrierId });
    data.calendrierId = calendrierId;
  }

  // La liste des calendriers sert au sélecteur; un jeton expiré ou révoqué ne bloque pas l'état,
  // il rend juste la liste vide (Laurie reverra « Connecter » si elle a retiré l'accès chez Google).
  let calendriers: { id: string; nom: string }[] = [];
  try {
    const cal = calendrierClient(data.refreshToken);
    const liste = await cal.calendarList.list();
    calendriers = (liste.data.items || []).map((c) => ({ id: c.id || '', nom: c.summary || c.id || '' }));
  } catch (e) {
    console.warn('[agendaGoogleEtat] liste des calendriers', e);
  }

  return {
    connecte: true,
    email: data.email || '',
    calendrierId: data.calendrierId || 'primary',
    derniereSync: data.derniereSync ? data.derniereSync.toMillis() : null,
    calendriers,
  };
});

// ─── Retirer l'accès ──────────────────────────────────────────────────────
export const agendaGoogleDeconnecter = onCall({ region: REGION, secrets: AGENDA_SECRETS }, async (request) => {
  assertAdmin(request);
  await getFirestore().doc(PRIVE_PATH).delete();
  return { ok: true };
});

// ─── La synchronisation elle-même ────────────────────────────────────────

const versDate = (v: any): Date => (v?.toDate ? v.toDate() : v instanceof Date ? v : new Date(v));

/** Un seul rendez-vous vers Google : crée, met à jour ou retire l'événement, garde googleEventId à jour. */
async function synchroniserUnRendezVous(
  cal: calendar_v3.Calendar,
  calendarId: string,
  db: FirebaseFirestore.Firestore,
  rdvId: string,
  rdv: RendezVousPourEvenement
): Promise<void> {
  const geste = actionPourRendezVous(rdv);
  const ref = db.doc(`rendezvous/${rdvId}`);
  if (geste.action === 'creer') {
    const { data } = await cal.events.insert({ calendarId, requestBody: evenementDepuisRendezVous(rdv) });
    if (data.id) await ref.update({ googleEventId: data.id });
  } else if (geste.action === 'mettreAJour') {
    try {
      await cal.events.update({ calendarId, eventId: geste.eventId, requestBody: evenementDepuisRendezVous(rdv) });
    } catch (e) {
      console.warn(`[agendaGoogleSync] mise à jour ${rdvId}`, e);
    }
  } else if (geste.action === 'supprimer') {
    try {
      await cal.events.delete({ calendarId, eventId: geste.eventId });
    } catch (e) {
      console.warn(`[agendaGoogleSync] suppression ${rdvId}`, e);
    }
    await ref.update({ googleEventId: FieldValue.delete() });
  }
}

/** Les plages occupées de Google (freebusy, HORIZON_JOURS jours) → occupations/{id} source 'google'. */
async function synchroniserOccupations(cal: calendar_v3.Calendar, calendarId: string, db: FirebaseFirestore.Firestore): Promise<void> {
  const maintenant = new Date();
  const horizon = new Date(maintenant.getTime() + HORIZON_JOURS * 86400000);
  const { data } = await cal.freebusy.query({
    requestBody: { timeMin: maintenant.toISOString(), timeMax: horizon.toISOString(), items: [{ id: calendarId }] },
  });
  const busy = data.calendars?.[calendarId]?.busy || [];
  const fraiches = occupationsDepuisFreebusy(busy);

  const existantes = await db.collection('occupations').where('source', '==', 'google').get();
  const idsFrais = new Set(fraiches.map((o) => o.id));
  const batch = db.batch();
  for (const doc of existantes.docs) if (!idsFrais.has(doc.id)) batch.delete(doc.ref);
  for (const o of fraiches) {
    batch.set(db.doc(`occupations/${o.id}`), { debut: Timestamp.fromDate(o.debut), fin: Timestamp.fromDate(o.fin), source: 'google' });
  }
  await batch.commit();
}

async function synchroniserTout(db: FirebaseFirestore.Firestore): Promise<void> {
  const connexion = await chargerConnexion();
  if (!connexion) return; // rien à faire tant que Laurie n'a pas connecté son compte
  const cal = calendrierClient(connexion.refreshToken);
  const calendarId = connexion.calendrierId || 'primary';

  const confirmes = await db.collection('rendezvous').where('statut', 'in', ['confirme', 'annule', 'complete']).get();
  for (const doc of confirmes.docs) {
    const d = doc.data() as any;
    await synchroniserUnRendezVous(cal, calendarId, db, doc.id, {
      nom: d.nom,
      courriel: d.courriel,
      debut: versDate(d.debut),
      fin: versDate(d.fin),
      salle: d.salle,
      statut: d.statut,
      googleEventId: d.googleEventId,
    });
  }

  await synchroniserOccupations(cal, calendarId, db);
  await db.doc(PRIVE_PATH).update({ derniereSync: Timestamp.now() });
}

// Toutes les 15 minutes : rattrape ce que le déclencheur par écriture aurait manqué (panne, redéploiement).
export const agendaGoogleSync = onSchedule({ schedule: 'every 15 minutes', region: REGION, secrets: AGENDA_SECRETS }, async () => {
  await synchroniserTout(getFirestore());
});

// À chaque écriture d'un rendez-vous : reflète le changement de statut dans Google sans attendre le prochain quart d'heure.
export const agendaGoogleSyncSurEcriture = onDocumentWritten(
  { document: 'rendezvous/{rdvId}', region: REGION, secrets: AGENDA_SECRETS },
  async (event) => {
    const apres = event.data?.after;
    if (!apres?.exists) return; // suppression : rien à pousser côté Google (l'occupation suit son propre miroir)
    const connexion = await chargerConnexion();
    if (!connexion) return;
    const db = getFirestore();
    const cal = calendrierClient(connexion.refreshToken);
    const calendarId = connexion.calendrierId || 'primary';
    const d = apres.data() as any;
    await synchroniserUnRendezVous(cal, calendarId, db, event.params.rdvId, {
      nom: d.nom,
      courriel: d.courriel,
      debut: versDate(d.debut),
      fin: versDate(d.fin),
      salle: d.salle,
      statut: d.statut,
      googleEventId: d.googleEventId,
    });
  }
);
