// Le bloc « Paiement » du formulaire d'offre (pages/AdminProducts.tsx) : comment l'offre se règle, son
// prix Stripe, l'état de la liaison automatique (functions/src/produits/stripe.ts) et le lien de paiement
// de repli, actif sans attendre le forfait Blaze.
import React from 'react';
import { CalendarCheck, CreditCard, HelpCircle } from 'lucide-react';
import { Champ } from '../ui';
import type { Language, Product } from '../../../types';

type ModePaiement = NonNullable<Product['paiement']>;

interface PaiementProps {
  lang: Language;
  value: Pick<Product, 'paiement' | 'prixCents' | 'lienPaiement' | 'stripeProductId' | 'stripePriceId' | 'stripeEtat' | 'stripeErreur'>;
  onChange: (patch: Partial<Product>) => void;
}

const T = {
  FR: {
    titre: 'Paiement',
    surDemande: 'Sur demande',
    surDemandeAide: 'Vous en discutez avec la personne avant de convenir d’un prix.',
    inscription: 'Inscription',
    inscriptionAide: 'La personne réserve un rendez-vous, comme pour une consultation.',
    stripe: 'Paiement en ligne',
    stripeAide: 'La personne paie directement sur le site, par Stripe.',
    prixLabel: 'Prix ($, taxes en sus)',
    lienLabel: 'Lien de paiement Stripe (Payment Link)',
    lienAide: 'Collez ici un lien créé dans votre tableau de bord Stripe : il fonctionne tout de suite, sans attendre le paiement automatique.',
    etatSynchronise: 'Reliée à Stripe',
    etatASynchroniser: 'Pas encore reliée',
    etatErreur: 'Erreur de liaison',
    cheminActifAutomatique: 'Le paiement automatique est actif : le bouton « Acheter » ouvre Stripe directement.',
    cheminActifLien: 'Le lien de paiement est actif en attendant le paiement automatique.',
    cheminAucun: 'Aucun paiement actif pour l’instant : ajoutez un lien de paiement, ou attendez la liaison automatique.',
  },
  EN: {
    titre: 'Payment',
    surDemande: 'On request',
    surDemandeAide: 'You discuss it with the person before agreeing on a price.',
    inscription: 'Registration',
    inscriptionAide: 'The person books a time, like a consultation.',
    stripe: 'Online payment',
    stripeAide: 'The person pays directly on the site, through Stripe.',
    prixLabel: 'Price ($, before taxes)',
    lienLabel: 'Stripe payment link',
    lienAide: 'Paste a link created in your Stripe dashboard: it works right away, without waiting for automatic payment.',
    etatSynchronise: 'Linked to Stripe',
    etatASynchroniser: 'Not linked yet',
    etatErreur: 'Linking error',
    cheminActifAutomatique: 'Automatic payment is active: the "Buy" button opens Stripe directly.',
    cheminActifLien: 'The payment link is active while automatic payment is not.',
    cheminAucun: 'No active payment yet: add a payment link, or wait for the automatic link.',
  },
} as const;

export const Paiement: React.FC<PaiementProps> = ({ lang, value, onChange }) => {
  const t = T[lang];
  const paiement: ModePaiement = value.paiement ?? 'sur_demande';
  const options: { id: ModePaiement; Icone: typeof CalendarCheck; label: string; aide: string }[] = [
    { id: 'sur_demande', Icone: HelpCircle, label: t.surDemande, aide: t.surDemandeAide },
    { id: 'inscription', Icone: CalendarCheck, label: t.inscription, aide: t.inscriptionAide },
    { id: 'stripe', Icone: CreditCard, label: t.stripe, aide: t.stripeAide },
  ];

  const prixDollars = typeof value.prixCents === 'number' ? String(value.prixCents / 100) : '';
  const cheminActif = value.stripePriceId ? 'auto' : value.lienPaiement ? 'lien' : null;

  return (
    <div className="space-y-3">
      <p className="text-petit font-semibold text-encre">{t.titre}</p>
      <div className="grid grid-cols-1 gap-2">
        {options.map(({ id, Icone, label, aide }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange({ paiement: id })}
            className={`flex items-start gap-3 rounded-champ border px-4 py-3 text-left transition-colors ${
              paiement === id ? 'border-rose bg-papier' : 'border-filet hover:border-encre'
            }`}
          >
            <Icone className={`w-4 h-4 mt-0.5 flex-shrink-0 ${paiement === id ? 'text-rose' : 'text-gris'}`} aria-hidden="true" />
            <span>
              <span className="block text-sm font-medium text-encre">{label}</span>
              <span className="block text-xs text-gris mt-0.5">{aide}</span>
            </span>
          </button>
        ))}
      </div>

      {paiement === 'stripe' && (
        <div className="space-y-3 pt-1">
          <Champ
            label={t.prixLabel}
            type="number"
            min="0"
            step="0.01"
            value={prixDollars}
            onChange={(e) => onChange({ prixCents: Math.round(parseFloat(e.target.value) * 100), devise: 'CAD' })}
          />

          <div
            className={`flex items-start gap-2 rounded-champ border px-4 py-3 text-petit ${
              value.stripeEtat === 'erreur' ? 'border-rose/40 text-rose' : 'border-filet text-encre'
            }`}
          >
            <span
              className={`w-2 h-2 mt-1.5 rounded-pilule flex-shrink-0 ${
                value.stripeEtat === 'erreur' ? 'bg-rose' : value.stripeEtat === 'synchronise' ? 'bg-encre' : 'bg-gris'
              }`}
              aria-hidden="true"
            />
            <span>
              {value.stripeEtat === 'erreur' ? t.etatErreur : value.stripeEtat === 'synchronise' ? t.etatSynchronise : t.etatASynchroniser}
              {value.stripeEtat === 'erreur' && value.stripeErreur && <span className="block text-xs text-gris mt-0.5">{value.stripeErreur}</span>}
            </span>
          </div>

          <Champ
            label={t.lienLabel}
            aide={t.lienAide}
            type="url"
            value={value.lienPaiement || ''}
            onChange={(e) => onChange({ lienPaiement: e.target.value })}
            placeholder="https://buy.stripe.com/..."
          />

          <p className="text-xs text-gris bg-papier border border-filet rounded-champ px-4 py-3">
            {cheminActif === 'auto' ? t.cheminActifAutomatique : cheminActif === 'lien' ? t.cheminActifLien : t.cheminAucun}
          </p>
        </div>
      )}
    </div>
  );
};
