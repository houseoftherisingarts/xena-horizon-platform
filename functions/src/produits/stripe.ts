// Chaque offre publiée et réglée « paiement en ligne » se relie à Stripe (demande d'Alex, 8 septembre 2026) :
// un Product et un Price Stripe par offre, une session Checkout à l'achat, et les paiements reçus dans
// commandes/{id}. Le paquet `stripe` est déjà une dépendance de functions/ (functions/src/factures/paiement.ts,
// même compte Stripe) : on le réemploie plutôt que d'en refaire un client. Rien de tout ça n'est déployé
// (projet Spark) : ce fichier compile et sa logique se vérifie sans réseau (functions/verif-produits-stripe.ts).
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';
import { REGION } from '../infolettre/mail';
import {
  doitSeSynchroniser,
  erreurDejaEcrite,
  fautNouveauPrix,
  synchronisationDejaFaite,
  versUnitAmount,
  type EtatProduitStripe,
} from './logique';

const PUBLIC_BASE_URL = 'https://xenahorizon.com';

// Même secret que functions/src/factures/paiement.ts (même compte Stripe, même clé) : defineSecret par nom
// est sans risque à répéter d'un module à l'autre, les deux se lient au même secret déployé une seule fois.
// Le secret de webhook, lui, est propre à CE point de terminaison (chaque endpoint Stripe a sa propre
// signature) : nom distinct de celui des factures pour ne pas leur faire partager la mauvaise valeur.
export const STRIPE_SECRET_KEY_XENA = defineSecret('STRIPE_SECRET_KEY_XENA');
export const STRIPE_WEBHOOK_SECRET_PRODUITS_XENA = defineSecret('STRIPE_WEBHOOK_SECRET_PRODUITS_XENA');

function stripeClient(): Stripe {
  return new Stripe(STRIPE_SECRET_KEY_XENA.value());
}

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

    const stripe = stripeClient();
    const prixCents = versUnitAmount(after.prixCents!);

    try {
      // Le Product Stripe : créé une fois, ensuite juste mis à jour (nom, description).
      let stripeProductId = after.stripeProductId;
      if (!stripeProductId) {
        const produit = await stripe.products.create({
          name: after.name,
          description: after.description ? after.description.slice(0, 500) : undefined,
          metadata: { entite: 'xena', productId: id },
        });
        stripeProductId = produit.id;
      } else {
        await stripe.products.update(stripeProductId, {
          name: after.name,
          description: after.description ? after.description.slice(0, 500) : undefined,
        });
      }

      // Le Price Stripe : immuable côté Stripe, donc un nouveau seulement si le montant a changé.
      let stripePriceId: string | undefined = after.stripePriceId;
      let prixExistant: number | null = null;
      if (stripePriceId) {
        try {
          const prix = await stripe.prices.retrieve(stripePriceId);
          prixExistant = typeof prix.unit_amount === 'number' ? prix.unit_amount : null;
        } catch {
          prixExistant = null; // le Price a disparu côté Stripe (supprimé à la main) : on en refait un
        }
      }
      if (fautNouveauPrix(prixCents, prixExistant)) {
        const prix = await stripe.prices.create({
          product: stripeProductId,
          currency: 'cad',
          unit_amount: prixCents,
          nickname: after.name ? after.name.slice(0, 250) : undefined,
          metadata: { entite: 'xena', productId: id },
        });
        stripePriceId = prix.id;
        await stripe.products.update(stripeProductId, { default_price: stripePriceId });
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

  const session = await stripeClient().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { entite: 'xena', productId: produit.id },
    success_url: `${PUBLIC_BASE_URL}/services?paiement=ok`,
    cancel_url: `${PUBLIC_BASE_URL}/services?paiement=annule`,
  });
  return { url: session.url };
});

// ─── Les paiements reçus, enregistrés depuis le webhook Stripe ──────────────
// Création du webhook côté Stripe : Développeurs > Webhooks > cet endpoint (URL de webhookStripeProduits),
// événement checkout.session.completed. `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET_PRODUITS_XENA`
// avec le secret de signature (whsec_...) rendu à la création de CET endpoint (distinct de celui des factures).
export const webhookStripeProduits = onRequest(
  { region: REGION, secrets: [STRIPE_SECRET_KEY_XENA, STRIPE_WEBHOOK_SECRET_PRODUITS_XENA], maxInstances: 5 },
  async (req, res) => {
    if (req.method !== 'POST') { res.status(405).send('POST only'); return; }
    const stripe = stripeClient();
    const corps: Buffer = (req as unknown as { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}));

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(corps, req.header('stripe-signature') || '', STRIPE_WEBHOOK_SECRET_PRODUITS_XENA.value());
    } catch {
      res.status(400).send('signature invalide');
      return;
    }

    if (event.type !== 'checkout.session.completed') { res.status(200).send('ignored'); return; }
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;
    if (productId) {
      await getFirestore()
        .doc(`commandes/${session.id}`)
        .set(
          {
            productId,
            montantCents: session.amount_total ?? null,
            devise: String(session.currency || 'cad').toUpperCase(),
            courriel: session.customer_details?.email || null,
            statut: 'paye',
            stripeSessionId: session.id,
            createdAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      console.log('[webhookStripeProduits] commande enregistrée', session.id);
    }
    res.status(200).send('ok');
  }
);
