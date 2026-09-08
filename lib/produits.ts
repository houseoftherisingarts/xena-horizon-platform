/**
 * Aides autour du champ `paiement` d'une offre (types.ts) : formatage d'un montant en cents,
 * détermination du chemin de règlement pour le bouton de la carte publique (pages/PublicServices.tsx),
 * et ouverture d'une session Stripe Checkout par la fonction serveur (functions/src/produits/stripe.ts).
 */
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';
import type { Language, Product } from '../types';

/** Un montant en cents affiché en dollars, formaté fr-CA/en-CA (mille dès 1 000, deux décimales seulement si utiles). */
export function formatPrixCents(prixCents: number, lang: Language): string {
  const dollars = prixCents / 100;
  return dollars.toLocaleString(lang === 'FR' ? 'fr-CA' : 'en-CA', {
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export type CheminPaiement = 'sur_demande' | 'inscription' | 'stripe_checkout' | 'stripe_lien';

/**
 * Quel chemin le bouton de la carte publique doit suivre. Une offre « stripe » sans priceId synchronisé
 * ni lien de paiement retombe sur « sur demande » plutôt que d'offrir un bouton mort.
 */
export function cheminPaiement(offer: Pick<Product, 'paiement' | 'stripePriceId' | 'lienPaiement'>): CheminPaiement {
  if (offer.paiement === 'inscription') return 'inscription';
  if (offer.paiement === 'stripe') {
    if (offer.stripePriceId) return 'stripe_checkout';
    if (offer.lienPaiement) return 'stripe_lien';
  }
  return 'sur_demande';
}

/** Ouvre une session Stripe Checkout pour ce prix déjà synchronisé (creerPaiementProduit), rend l'adresse à rediriger. */
export async function demarrerCheckoutStripe(stripePriceId: string): Promise<string> {
  const fns = getFunctions(app, 'northamerica-northeast1');
  const appel = httpsCallable<{ priceId: string }, { url: string }>(fns, 'creerPaiementProduit');
  const { data } = await appel({ priceId: stripePriceId });
  return data.url;
}
