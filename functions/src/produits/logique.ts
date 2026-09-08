// Logique pure de la synchronisation Stripe des offres (functions/src/produits/stripe.ts) : quelle offre
// se synchronise, quel montant elle porte, et si un nouveau Price Stripe doit se créer. Aucun appel réseau
// ici : testable sans Stripe ni Firestore (functions/verif-produits-stripe.ts), même patron que
// functions/src/agenda/sync.ts.

export interface ProduitPourSync {
  isPublic: boolean;
  paiement?: 'sur_demande' | 'inscription' | 'stripe';
  prixCents?: number;
}

/** Une offre se synchronise avec Stripe quand elle est publiée, réglée en paiement en ligne et à prix fixe. */
export function doitSeSynchroniser(p: ProduitPourSync): boolean {
  return p.isPublic === true && p.paiement === 'stripe' && typeof p.prixCents === 'number' && p.prixCents > 0;
}

/** Le montant Stripe : un entier de cents, jamais de fraction. */
export function versUnitAmount(prixCents: number): number {
  return Math.round(prixCents);
}

/**
 * Un nouveau Price Stripe n'est nécessaire que si le montant a changé : Stripe ne permet pas de modifier
 * un Price existant, et en créer un identique gaspillerait un appel pour laisser un doublon inutile.
 */
export function fautNouveauPrix(prixCentsVoulu: number, prixCentsExistant: number | null): boolean {
  return prixCentsExistant === null || versUnitAmount(prixCentsExistant) !== versUnitAmount(prixCentsVoulu);
}

export interface ResultatSync {
  stripeProductId: string;
  stripePriceId: string;
  stripeEtat: 'synchronise';
}

export interface EtatProduitStripe {
  stripeProductId?: string;
  stripePriceId?: string;
  stripeEtat?: string;
  stripeErreur?: string;
}

/**
 * Idempotence : si l'offre porte déjà exactement ce résultat, sans erreur, réécrire ne changerait rien
 * d'utile et redéclencherait la fonction sur elle-même (onDocumentWritten se déclenche sur toute écriture,
 * même identique). C'est le garde-fou contre la boucle infinie autant qu'une vérification d'idempotence.
 */
export function synchronisationDejaFaite(actuel: EtatProduitStripe, resultat: ResultatSync): boolean {
  return (
    actuel.stripeProductId === resultat.stripeProductId &&
    actuel.stripePriceId === resultat.stripePriceId &&
    actuel.stripeEtat === resultat.stripeEtat &&
    !actuel.stripeErreur
  );
}

/** Même garde-fou côté erreur : ne pas réécrire le même message d'erreur en boucle. */
export function erreurDejaEcrite(actuel: EtatProduitStripe, message: string): boolean {
  return actuel.stripeEtat === 'erreur' && actuel.stripeErreur === message;
}

/** Métadonnées posées sur chaque Product/Price Stripe : retrouver l'offre Xena depuis le tableau de bord Stripe. */
export function metadonneesOffre(productId: string): { entite: string; productId: string } {
  return { entite: 'xena', productId };
}
