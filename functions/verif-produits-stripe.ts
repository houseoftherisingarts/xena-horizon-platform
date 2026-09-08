// Vérification sans réseau de la logique pure de la synchronisation Stripe des offres
// (functions/src/produits/logique.ts). Aucun appel à Stripe, aucun Firestore : seulement les fonctions
// de décision. Usage : npx tsx functions/verif-produits-stripe.ts (ou npm --prefix functions run verif:produits-stripe)
import assert from 'node:assert/strict';
import {
  doitSeSynchroniser,
  erreurDejaEcrite,
  fautNouveauPrix,
  synchronisationDejaFaite,
  versUnitAmount,
} from './src/produits/logique';

// --- quel produit se synchronise ---
assert.equal(doitSeSynchroniser({ isPublic: true, paiement: 'stripe', prixCents: 9900 }), true);
assert.equal(doitSeSynchroniser({ isPublic: false, paiement: 'stripe', prixCents: 9900 }), false, 'pas publiée');
assert.equal(doitSeSynchroniser({ isPublic: true, paiement: 'sur_demande', prixCents: 9900 }), false, 'pas en paiement Stripe');
assert.equal(doitSeSynchroniser({ isPublic: true, paiement: 'inscription', prixCents: 9900 }), false, 'inscription, pas Stripe');
assert.equal(doitSeSynchroniser({ isPublic: true, paiement: 'stripe', prixCents: 0 }), false, 'prix nul');
assert.equal(doitSeSynchroniser({ isPublic: true, paiement: 'stripe' }), false, 'prix absent');

// --- montant en cents ---
assert.equal(versUnitAmount(9900), 9900);
assert.equal(versUnitAmount(9900.4), 9900, 'arrondi au centime');
assert.equal(versUnitAmount(9900.6), 9901, 'arrondi au centime');

// --- un nouveau Price seulement si le montant a changé ---
assert.equal(fautNouveauPrix(9900, null), true, 'aucun Price existant');
assert.equal(fautNouveauPrix(9900, 9900), false, 'même montant : rien à refaire');
assert.equal(fautNouveauPrix(9900, 8000), true, 'montant différent');
assert.equal(fautNouveauPrix(9900.4, 9900), false, 'même montant une fois arrondi');

// --- idempotence par stripePriceId : pas de réécriture (donc pas de boucle) une fois synchronisé ---
const resultat = { stripeProductId: 'prod_1', stripePriceId: 'price_1', stripeEtat: 'synchronise' as const };
assert.equal(synchronisationDejaFaite({ stripeProductId: 'prod_1', stripePriceId: 'price_1', stripeEtat: 'synchronise' }, resultat), true);
assert.equal(synchronisationDejaFaite({ stripeProductId: 'prod_1', stripePriceId: 'price_2', stripeEtat: 'synchronise' }, resultat), false, 'priceId différent');
assert.equal(synchronisationDejaFaite({ stripeProductId: 'prod_1', stripePriceId: 'price_1', stripeEtat: 'synchronise', stripeErreur: 'ancienne erreur' }, resultat), false, 'une erreur traîne encore');
assert.equal(synchronisationDejaFaite({}, resultat), false, 'rien de synchronisé encore');

// --- idempotence côté erreur : même message, pas de réécriture ---
assert.equal(erreurDejaEcrite({ stripeEtat: 'erreur', stripeErreur: 'carte refusée' }, 'carte refusée'), true);
assert.equal(erreurDejaEcrite({ stripeEtat: 'erreur', stripeErreur: 'carte refusée' }, 'autre erreur'), false);
assert.equal(erreurDejaEcrite({ stripeEtat: 'synchronise' }, 'carte refusée'), false);

console.log('verif-produits-stripe : toutes les vérifications sont passées.');
