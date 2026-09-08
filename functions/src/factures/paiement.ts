// Paiement Stripe d'une facture publiée. Se compile (npm --prefix functions run build) mais ne se
// déploie pas tant que le projet reste sur le forfait Spark : activer le forfait Blaze, poser les
// secrets ci-dessous, puis `firebase deploy --only functions:creerPaiementFacture,functions:webhookStripeXena`.
//   firebase functions:secrets:set STRIPE_SECRET_KEY_XENA     (clé secrète du compte Stripe de Laurie)
//   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET_XENA (whsec_... rendu par le point de terminaison créé sur ce endpoint)
// Tant que ce n'est pas branché, la page publique (pages/FacturePublique.tsx) s'appuie sur le lien de
// paiement de settings/facturation, pas sur cette fonction : voir lib/factures.ts.
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Stripe from 'stripe';
import { REGION } from '../infolettre/mail';

export const STRIPE_SECRET_KEY_XENA = defineSecret('STRIPE_SECRET_KEY_XENA');
export const STRIPE_WEBHOOK_SECRET_XENA = defineSecret('STRIPE_WEBHOOK_SECRET_XENA');

const SITE_URL = 'https://xenahorizon.com';

interface Totaux { sousTotal: number; tps: number; tvq: number; total: number; }
interface FacturePubliqueDoc {
  documentId: string;
  numero: string;
  clientEmail?: string;
  statut: string;
  totaux: Totaux;
}

function stripeClient(): Stripe {
  return new Stripe(STRIPE_SECRET_KEY_XENA.value());
}

/** Crée une session Stripe Checkout pour le montant exact de la facture, à partir de son jeton public. */
export const creerPaiementFacture = onCall(
  { region: REGION, secrets: [STRIPE_SECRET_KEY_XENA] },
  async (request) => {
    const jeton = String(request.data?.jeton || '').trim();
    if (!jeton) throw new HttpsError('invalid-argument', 'Jeton manquant.');

    const db = getFirestore();
    const ref = db.doc(`factures_publiques/${jeton}`);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Facture introuvable.');
    const facture = snap.data() as FacturePubliqueDoc;

    if (facture.statut === 'Paid') throw new HttpsError('failed-precondition', 'Cette facture est déjà payée.');
    // ponytail: montant restant = total de la facture, pas de suivi d'acompte partiel dans ce modèle;
    // à étendre avec un champ `montantPaye` sur factures_publiques si Laurie encaisse des dépôts.
    const montantCentimes = Math.round((facture.totaux?.total ?? 0) * 100);
    if (!Number.isFinite(montantCentimes) || montantCentimes <= 0) {
      throw new HttpsError('failed-precondition', 'Montant invalide.');
    }

    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: facture.clientEmail || undefined,
      line_items: [{
        price_data: {
          currency: 'cad',
          product_data: { name: `Facture ${facture.numero} Xena Horizon` },
          unit_amount: montantCentimes,
        },
        quantity: 1,
      }],
      metadata: { jeton, documentId: facture.documentId, numero: facture.numero },
      success_url: `${SITE_URL}/facture/${jeton}?paye=1`,
      cancel_url: `${SITE_URL}/facture/${jeton}?annule=1`,
    });

    return { url: session.url };
  },
);

/** Le webhook Stripe : marque la facture payée une fois le paiement confirmé côté serveur. */
export const webhookStripeXena = onRequest(
  { region: REGION, secrets: [STRIPE_SECRET_KEY_XENA, STRIPE_WEBHOOK_SECRET_XENA], maxInstances: 5 },
  async (req, res) => {
    if (req.method !== 'POST') { res.status(405).send('POST only'); return; }
    const stripe = stripeClient();
    const corps: Buffer = (req as unknown as { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}));

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(corps, req.header('stripe-signature') || '', STRIPE_WEBHOOK_SECRET_XENA.value());
    } catch (err) {
      res.status(400).send('signature invalide');
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const jeton = session.metadata?.jeton;
      const documentId = session.metadata?.documentId;
      if (jeton && documentId) {
        const db = getFirestore();
        const payeLe = FieldValue.serverTimestamp();
        await db.doc(`factures_publiques/${jeton}`).set({ statut: 'Paid', payeLe }, { merge: true });
        await db.doc(`documents/${documentId}`).set({ status: 'Paid', payeLe }, { merge: true });
        console.log('[webhookStripeXena] facture payée', jeton, documentId);
      }
    }

    res.status(200).send('ok');
  },
);
