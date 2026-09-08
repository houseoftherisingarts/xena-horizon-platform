// Chaque offre publiée et réglée « paiement en ligne » se relie à Stripe (demande d'Alex, 8 septembre 2026) :
// un Product et un Price Stripe par offre, une session Checkout à l'achat, et les paiements reçus dans
// commandes/{id}. Appel direct à l'API REST de Stripe par fetch (pas la librairie stripe : évite une
// dépendance de plus pour trois appels simples), même patron que les autres fonctions de ce dossier
// (functions/src/agenda/google.ts, functions/src/infolettre/webhook.ts). Rien de tout ça n'est déployé
// (projet Spark) : ce fichier compile et sa logique se vérifie sans réseau (functions/verif-produits-stripe.ts).
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  doitSeSynchroniser,
  erreurDejaEcrite,
  fautNouveauPrix,
  synchronisationDejaFaite,
  versUnitAmount,
  type EtatProduitStripe,
} from './logique';

const REGION = 'northamerica-northeast1';
const PUBLIC_BASE_URL = 'https://xenahorizon.com';
const TOLERANCE_S = 5 * 60;

export const STRIPE_SECRET_KEY_XENA = defineSecret('STRIPE_SECRET_KEY_XENA');
export const STRIPE_WEBHOOK_SECRET_XENA = defineSecret('STRIPE_WEBHOOK_SECRET_XENA');

interface ProductDoc {
  name: string;
  description?: string;
  isPublic: boolean;
  paiement?: 'sur_demande' | 'inscription' | 'stripe';
  prixCents?: number;
  stripeProductId?: string;
  stripePriceId?: string;
  stripeEtat?: string;
  stripeErreur?: string;
}

// ─── Un petit client REST, sans la librairie stripe ─────────────────────────
function encoderFormulaire(champs: Record<string, string | number | undefined>): URLSearchParams {
  const p = new URLSearchParams();
  for (const [cle, valeur] of Object.entries(champs)) {
    if (valeur !== undefined) p.set(cle, String(valeur));
  }
  return p;
}

async function appelStripe(
  cleSecrete: string,
  methode: 'GET' | 'POST',
  chemin: string,
  champs?: Record<string, string | number | undefined>
): Promise<any> {
  const res = await fetch(`https://api.stripe.com/v1/${chemin}`, {
    method: methode,
    headers: {
      Authorization: `Bearer ${cleSecrete}`,
      ...(champs ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: champs ? encoderFormulaire(champs) : undefined,
  });
  const corps: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(corps?.error?.message || `Stripe ${methode} ${chemin} a échoué (${res.status})`);
  }
  return corps;
}

// N'écrit que si l'état visé diffère de l'état actuel : le garde-fou contre la boucle infinie
// (onDocumentWritten se redéclenche sur toute écriture, y compris identique).
async function ecrireEtatSucces(id: string, actuel: EtatProduitStripe, resultat: { stripeProductId: string; stripePriceId: string }) {
  const cible = { ...resultat, stripeEtat: 'synchronise' as const };
  if (synchronisationDejaFaite(actuel, cible)) return;
  await getFirestore()
    .doc(`products/${id}`)
    .set({ ...cible, stripeErreur: FieldValue.delete() }, { merge: true });
}

async function ecrireEtatErreur(id: string, actuel: EtatProduitStripe, message: string) {
  const messageBorne = message.slice(0, 500);
  if (erreurDejaEcrite(actuel, messageBorne)) return;
  await getFirestore()
    .doc(`products/${id}`)
    .set({ stripeEtat: 'erreur', stripeErreur: messageBorne }, { merge: true });
}

// ─── Créer/mettre à jour le Product et le Price Stripe d'une offre ──────────
export const synchroniserProduitStripe = onDocumentWritten(
  { document: 'products/{id}', region: REGION, secrets: [STRIPE_SECRET_KEY_XENA] },
  async (event) => {
    const id = event.params.id;
    const after = event.data?.after?.exists ? (event.data.after.data() as ProductDoc) : null;
    if (!after || !doitSeSynchroniser(after)) return;

    const cle = STRIPE_SECRET_KEY_XENA.value();
    const prixCents = versUnitAmount(after.prixCents!);

    try {
      // Le Product Stripe : créé une fois, ensuite juste mis à jour (nom, description).
      let stripeProductId = after.stripeProductId;
      if (!stripeProductId) {
        const produit = await appelStripe(cle, 'POST', 'products', {
          name: after.name,
          description: after.description ? after.description.slice(0, 500) : undefined,
          'metadata[entite]': 'xena',
          'metadata[productId]': id,
        });
        stripeProductId = produit.id;
      } else {
        await appelStripe(cle, 'POST', `products/${stripeProductId}`, {
          name: after.name,
          description: after.description ? after.description.slice(0, 500) : undefined,
        });
      }

      // Le Price Stripe : immuable côté Stripe, donc un nouveau seulement si le montant a changé.
      let stripePriceId: string | undefined = after.stripePriceId;
      let prixExistant: number | null = null;
      if (stripePriceId) {
        try {
          const prix = await appelStripe(cle, 'GET', `prices/${stripePriceId}`);
          prixExistant = typeof prix.unit_amount === 'number' ? prix.unit_amount : null;
        } catch {
          prixExistant = null; // le Price a disparu côté Stripe (supprimé à la main) : on en refait un
        }
      }
      if (fautNouveauPrix(prixCents, prixExistant)) {
        const prix = await appelStripe(cle, 'POST', 'prices', {
          product: stripeProductId,
          currency: 'cad',
          unit_amount: prixCents,
          nickname: after.name ? after.name.slice(0, 250) : undefined,
          'metadata[entite]': 'xena',
          'metadata[productId]': id,
        });
        stripePriceId = prix.id;
        await appelStripe(cle, 'POST', `products/${stripeProductId}`, { default_price: stripePriceId });
      }

      await ecrireEtatSucces(id, after, { stripeProductId: stripeProductId!, stripePriceId: stripePriceId! });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[synchroniserProduitStripe]', id, message);
      await ecrireEtatErreur(id, after, message);
    }
  }
);

// ─── Ouvrir une session Checkout pour une offre déjà synchronisée ───────────
export const creerPaiementProduit = onCall({ region: REGION, secrets: [STRIPE_SECRET_KEY_XENA] }, async (request) => {
  const priceId = String((request.data as { priceId?: string } | undefined)?.priceId || '').trim();
  if (!priceId) throw new HttpsError('invalid-argument', 'priceId manquant.');

  const db = getFirestore();
  const trouvaille = await db
    .collection('products')
    .where('stripePriceId', '==', priceId)
    .where('isPublic', '==', true)
    .limit(1)
    .get();
  const produit = trouvaille.docs[0];
  if (!produit || (produit.data() as ProductDoc).paiement !== 'stripe') {
    throw new HttpsError('invalid-argument', 'Offre introuvable ou non réglée en paiement en ligne.');
  }

  const session = await appelStripe(STRIPE_SECRET_KEY_XENA.value(), 'POST', 'checkout/sessions', {
    mode: 'payment',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': 1,
    success_url: `${PUBLIC_BASE_URL}/services?paiement=ok`,
    cancel_url: `${PUBLIC_BASE_URL}/services?paiement=annule`,
    'metadata[productId]': produit.id,
  });
  return { url: session.url as string };
});

// ─── Les paiements reçus, enregistrés depuis le webhook Stripe ──────────────
// Création du webhook côté Stripe : Développeurs > Webhooks > cet endpoint, événement
// checkout.session.completed. `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET_XENA` avec le
// secret de signature (whsec_...) rendu à la création. Signature vérifiée à la main (doc Stripe) :
// HMAC-SHA256 de `${timestamp}.${corps brut}` avec le secret tel quel comme clé.
function signatureStripeValide(secret: string, entete: string, corpsBrut: Buffer): boolean {
  const morceaux = Object.fromEntries(
    entete.split(',').map((paire) => paire.split('=')) as [string, string][]
  );
  const timestamp = morceaux['t'];
  const signature = morceaux['v1'];
  if (!timestamp || !signature) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_S) return false;
  const attendu = createHmac('sha256', secret).update(`${timestamp}.`).update(corpsBrut).digest('hex');
  const recu = Buffer.from(signature, 'hex');
  const voulu = Buffer.from(attendu, 'hex');
  return recu.length === voulu.length && timingSafeEqual(recu, voulu);
}

export const webhookStripeProduits = onRequest(
  { region: REGION, secrets: [STRIPE_WEBHOOK_SECRET_XENA], maxInstances: 5 },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('POST only');
      return;
    }
    const corps: Buffer = (req as unknown as { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}));
    const ok = signatureStripeValide(STRIPE_WEBHOOK_SECRET_XENA.value(), String(req.header('stripe-signature') || ''), corps);
    if (!ok) {
      res.status(401).send('bad signature');
      return;
    }

    const event = (req.body || {}) as { type?: string; data?: { object?: Record<string, any> } };
    if (event.type !== 'checkout.session.completed') {
      res.status(200).send('ignored');
      return;
    }
    const session = event.data?.object || {};
    await getFirestore()
      .doc(`commandes/${session.id}`)
      .set(
        {
          productId: session.metadata?.productId || null,
          montantCents: typeof session.amount_total === 'number' ? session.amount_total : null,
          devise: String(session.currency || 'cad').toUpperCase(),
          courriel: session.customer_details?.email || null,
          statut: 'paye',
          stripeSessionId: session.id,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    console.log('[webhookStripeProduits] commande enregistrée', session.id);
    res.status(200).send('ok');
  }
);
