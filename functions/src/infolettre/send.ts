import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { renderEmailHtml, renderEmailText, newsletterAttachments, type NewsletterBlock, type Couverture, type Lang, type Bandeau } from './renderer';
import { MAIL_SECRETS, NEWSLETTER_POSTAL_ADDRESS, REPLY_TO, FROM_ADDR, REGION, createTransporter, unsubscribeUrl as buildUnsub, assurerJeton } from './mail';

// Port simplifié du moteur d'envoi de Krystine (functions/src/newsletter/send.ts) :
// pas de courriel de bienvenue, pas de rappels de direct, pas de boîte membre —
// juste l'infolettre, testable, reprenable, cadencée. Admin only.

const ADMIN_UID = 'O5qf5A3WdfV7daxkBKOIt0RnBUD2';
const ADMIN_EMAILS = ['houseoftherisingarts@gmail.com', 'laurie.belhumeur@gmail.com'];

export function assertAdmin(request: CallableRequest): void {
  const auth = request.auth;
  const email = auth?.token?.email;
  const emailOk = !!auth?.token?.email_verified && !!email && ADMIN_EMAILS.includes(email);
  if (!auth || (auth.uid !== ADMIN_UID && !emailOk)) {
    throw new HttpsError('permission-denied', 'Admin only.');
  }
}

interface SubscriberDoc {
  email: string;
  name?: string;
  status?: string;
  tags?: string[];
  lang?: string;
  unsubscribeToken?: string;
}

// Qui reçoit : tout le monde, des étiquettes, ou des adresses choisies une à
// une. `langue` filtre par langue de lecture de l'abonné·e (« auto » = celle
// de la lettre).
export interface NewsletterAudience {
  mode: 'tous' | 'tags' | 'choix';
  tags?: string[];
  emails?: string[];
  langue?: 'auto' | 'fr' | 'en' | 'toutes';
}

const langueAbonne = (s: { lang?: string }) => (s.lang === 'en' ? 'en' : 'fr');
function langueCible(doc: Pick<NewsletterRecord, 'audience' | 'lang'>): 'fr' | 'en' | 'toutes' {
  const l = doc.audience?.langue || 'auto';
  if (l === 'auto') return doc.lang === 'en' ? 'en' : 'fr';
  return l;
}

interface NewsletterRecord {
  subject: string;
  preheader?: string;
  blocks: NewsletterBlock[];
  status: string;
  audience?: NewsletterAudience | null;
  couverture?: Couverture;
  couvertureUrl?: string | null;
  signature?: boolean;
  lang?: Lang;
  bandeau?: Bandeau | null;
  fond?: string | null;
}

export function selectRecipients<T extends SubscriberDoc>(subs: T[], doc: Pick<NewsletterRecord, 'audience' | 'lang'>): T[] {
  const a: NewsletterAudience = doc.audience || { mode: 'tous' };
  const norm = (e: string) => e.trim().toLowerCase();
  const wanted = new Set((a.emails || []).map(norm));
  const tags = a.tags || [];
  const cible = langueCible({ audience: a, lang: doc.lang });
  return subs
    .filter(s => {
      if (a.mode === 'choix') return wanted.has(norm(s.email));
      if (cible !== 'toutes' && langueAbonne(s) !== cible) return false;
      if (a.mode === 'tags') return (s.tags || []).some(t => tags.includes(t));
      return true;
    })
    .filter(dedupeBy(s => norm(s.email)));
}

function dedupeBy<T>(key: (x: T) => string): (x: T) => boolean {
  const vus = new Set<string>();
  return (x) => { const k = key(x); if (vus.has(k)) return false; vus.add(k); return true; };
}

// ─── Envoi réel, reprenable ──────────────────────────────────────────────
// Une Cloud Function vit au plus 9 minutes : budget de 7 minutes par passage,
// CONCURRENCY courriels en vol, cadence partagée sous le débit permis. Quand
// le budget est épuisé, la fonction rend la main; un nouvel appel reprend au
// curseur `envoi.lastId`. Chaque envoi réussi est marqué dans la
// sous-collection `envois` : reprise ou pause n'envoie jamais deux fois.
const CONCURRENCY = 5;
const BUDGET_MS = 7 * 60 * 1000;
const LOCK_MS = 9.5 * 60 * 1000;
const PAUSE_QUOTA_MS = 60 * 60 * 1000; // ponytail: pause fixe d'une heure au refus de quota du fournisseur; ajuster si Resend documente un compteur exact
const INTERVALLE_MS = 125; // huit courriels par seconde

interface Progress {
  envoyes: number;
  echecs: number;
  etat: 'en_cours' | 'terminee' | 'pause';
  lastId: string | null;
  lockUntil?: Timestamp;
  startedAt?: Timestamp;
  pauseJusqua?: Timestamp;
  raisonPause?: string;
}

const delai = (ms: number) => new Promise(r => setTimeout(r, ms));

function texteErreur(err: unknown): string {
  const e = err as { response?: string; message?: string } | undefined;
  return `${e?.response || ''} ${e?.message || ''}`;
}
function estLimiteDebit(err: unknown): boolean {
  const e = err as { responseCode?: number } | undefined;
  return e?.responseCode === 429 || /too many requests|rate limit|per second/i.test(texteErreur(err));
}
function estQuota(err: unknown): boolean {
  return !estLimiteDebit(err) && /quota|daily/i.test(texteErreur(err));
}

export async function deliverNewsletter(newsletterId: string): Promise<{ recipients: number; delivered: number; failed: number; done: boolean }> {
  const db = getFirestore();
  const ref = db.doc(`newsletters/${newsletterId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Newsletter not found');
  const doc = snap.data() as NewsletterRecord & { envoi?: Progress };
  if (doc.status !== 'draft' && doc.status !== 'sending') {
    throw new HttpsError('failed-precondition', `Cannot send a newsletter in status "${doc.status}"`);
  }
  if (!doc.blocks?.length) throw new HttpsError('failed-precondition', 'Newsletter has no content');
  if (!doc.subject) throw new HttpsError('failed-precondition', 'Newsletter is missing a subject');

  const now = Date.now();
  const prog: Progress = doc.status === 'sending' && doc.envoi
    ? doc.envoi
    : { envoyes: 0, echecs: 0, etat: 'en_cours', lastId: null, startedAt: Timestamp.now() };
  if (prog.lockUntil && prog.lockUntil.toMillis() > now) {
    return { recipients: 0, delivered: prog.envoyes, failed: prog.echecs, done: false };
  }
  if (prog.pauseJusqua && prog.pauseJusqua.toMillis() > now) {
    return { recipients: 0, delivered: prog.envoyes, failed: prog.echecs, done: false };
  }
  prog.etat = 'en_cours';
  prog.lockUntil = Timestamp.fromMillis(now + LOCK_MS);
  await ref.update({ status: 'sending', envoi: prog, updatedAt: FieldValue.serverTimestamp() });

  const postalAddress = NEWSLETTER_POSTAL_ADDRESS.value();

  const subsSnap = await db.collection('subscribers').where('status', '==', 'active').get();
  const adressesVues = new Set<string>();
  const all = selectRecipients(
    subsSnap.docs.map(d => ({ id: d.id, ...(d.data() as SubscriberDoc) })),
    doc,
  ).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .filter(s => {
      const e = String(s.email || '').trim().toLowerCase();
      if (!e || adressesVues.has(e)) return false;
      adressesVues.add(e);
      return true;
    });

  const dejaSnap = await ref.collection('envois').select().get();
  const deja = new Set(dejaSnap.docs.map(d => d.id));
  const restants = (prog.lastId ? all.filter(s => s.id > (prog.lastId as string)) : all).filter(s => !deja.has(s.id));

  const transporter = createTransporter();

  let prochainCreneau = 0;
  const attendreCreneau = async () => {
    const t = Math.max(Date.now(), prochainCreneau);
    prochainCreneau = t + INTERVALLE_MS;
    if (t > Date.now()) await delai(t - Date.now());
  };

  const envoyer = async (sub: typeof all[number]) => {
    const jeton = await assurerJeton(db.doc(`subscribers/${sub.id}`), sub.unsubscribeToken);
    const unsubscribeUrl = buildUnsub(sub.id, jeton);
    const opts = {
      subject: doc.subject, preheader: doc.preheader, unsubscribeUrl, postalAddress, firstName: sub.name,
      couverture: doc.couverture, couvertureUrl: doc.couvertureUrl, signature: doc.signature, lang: doc.lang, bandeau: doc.bandeau, fond: doc.fond,
    };
    const message = {
      from: FROM_ADDR,
      replyTo: REPLY_TO,
      to: sub.email,
      subject: doc.subject,
      html: renderEmailHtml(doc.blocks, opts),
      text: renderEmailText(doc.blocks, opts),
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      attachments: newsletterAttachments(opts),
    };
    for (let essai = 0; ; essai++) {
      await attendreCreneau();
      try {
        await transporter.sendMail(message);
        break;
      } catch (e1) {
        if (estQuota(e1) || essai >= 3) throw e1;
        await delai(estLimiteDebit(e1) ? 1500 : 2000);
      }
    }
    await ref.collection('envois').doc(sub.id).set({ email: sub.email, at: FieldValue.serverTimestamp() });
  };

  let next = 0;
  let indexQuota = -1;
  const ouvrier = async () => {
    while (next < restants.length && indexQuota < 0 && Date.now() - now < BUDGET_MS) {
      const i = next++;
      const sub = restants[i];
      try {
        await envoyer(sub);
        prog.envoyes++;
      } catch (err) {
        if (estQuota(err)) {
          if (indexQuota < 0 || i < indexQuota) indexQuota = i;
          console.warn('[deliverNewsletter] quota du fournisseur atteint', sub.email, String((err as { response?: string })?.response || err));
          continue;
        }
        prog.echecs++;
        console.warn('[deliverNewsletter] delivery failed', sub.email, err);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, ouvrier));
  transporter.close();
  delete prog.lockUntil;

  if (indexQuota >= 0) {
    prog.lastId = indexQuota > 0 ? restants[indexQuota - 1].id : prog.lastId;
    prog.etat = 'pause';
    prog.pauseJusqua = Timestamp.fromMillis(Date.now() + PAUSE_QUOTA_MS);
    prog.raisonPause = 'Quota d’envoi du fournisseur atteint. Reprise dans une heure via un nouvel appel.';
    await ref.update({ envoi: prog, updatedAt: FieldValue.serverTimestamp() });
    return { recipients: all.length, delivered: prog.envoyes, failed: prog.echecs, done: false };
  }

  const fini = next >= restants.length;
  prog.lastId = next > 0 ? restants[next - 1].id : prog.lastId;
  delete prog.pauseJusqua;
  delete prog.raisonPause;
  prog.etat = fini ? 'terminee' : 'en_cours';

  if (fini) {
    await ref.update({
      status: 'sent',
      sentAt: Timestamp.now(),
      updatedAt: FieldValue.serverTimestamp(),
      envoi: FieldValue.delete(),
      'stats.recipients': all.length,
      'stats.delivered': prog.envoyes,
      'stats.failed': prog.echecs,
    });
  } else {
    await ref.update({ envoi: prog, updatedAt: FieldValue.serverTimestamp() });
    console.log('[deliverNewsletter] passage partiel', newsletterId, `${prog.envoyes + prog.echecs}/${all.length}`);
  }

  return { recipients: all.length, delivered: prog.envoyes, failed: prog.echecs, done: fini };
}

// ─── envoyerInfolettre : appel admin (test ou envoi/reprise) ────────────────
// Input : { newsletterId, testEmail? }. Avec testEmail, envoie SEULEMENT à
// cette adresse et ne touche ni au statut ni à la progression.
export const envoyerInfolettre = onCall(
  { region: REGION, secrets: MAIL_SECRETS, timeoutSeconds: 540, memory: '512MiB' },
  async (request) => {
    assertAdmin(request);
    const { newsletterId, testEmail } = (request.data || {}) as { newsletterId?: string; testEmail?: string };
    if (!newsletterId) throw new HttpsError('invalid-argument', 'newsletterId is required');

    if (testEmail) {
      const snap = await getFirestore().doc(`newsletters/${newsletterId}`).get();
      if (!snap.exists) throw new HttpsError('not-found', 'Newsletter not found');
      const doc = snap.data() as NewsletterRecord;
      if (!doc.blocks?.length || !doc.subject) throw new HttpsError('failed-precondition', 'Newsletter is missing subject or content');
      const transporter = createTransporter();
      const jetonTest = 'TEST';
      const opts = {
        subject: doc.subject, preheader: doc.preheader, unsubscribeUrl: buildUnsub('test', jetonTest), postalAddress: NEWSLETTER_POSTAL_ADDRESS.value(), firstName: 'Test',
        couverture: doc.couverture, couvertureUrl: doc.couvertureUrl, signature: doc.signature, lang: doc.lang, bandeau: doc.bandeau, fond: doc.fond,
      };
      try {
        await transporter.sendMail({
          from: FROM_ADDR,
          replyTo: REPLY_TO,
          to: testEmail,
          subject: `[TEST] ${doc.subject}`,
          html: renderEmailHtml(doc.blocks, opts),
          text: renderEmailText(doc.blocks, opts),
          attachments: newsletterAttachments(opts),
        });
      } finally {
        transporter.close();
      }
      return { ok: true, test: true };
    }

    const r = await deliverNewsletter(newsletterId);
    return { ok: true, ...r };
  },
);
