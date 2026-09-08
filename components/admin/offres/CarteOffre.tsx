// Une offre de l'échelle de valeur : carte complète (vues Ajustée et Défilement, mobile) ou ligne
// compacte (vue Compacte). Prix en fr-CA, espace insécable posée par Intl.NumberFormat.
import React from 'react';
import { Check, Globe, HelpCircle, CalendarCheck, CreditCard } from 'lucide-react';
import { Etiquette } from '../ui';
import { PROFILS_REELS } from '../../../lib/contenu';
import type { Product, Language } from '../../../types';
import type { TexteOffres } from './EchelleValeur';

const formatteurPrix = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const libelleProfil = (id: string, lang: Language): string => {
  const profil = PROFILS_REELS.find((p) => p.id === id);
  if (!profil) return id;
  return lang === 'EN' ? profil.titleEN : profil.titleFR;
};

// Petite pastille du mode de paiement (bloc « Paiement » ajouté par le bâtisseur H) : une icône suffit
// sur la carte, le détail se règle dans la fenêtre d'édition.
const LIBELLE_PAIEMENT = {
  FR: { sur_demande: 'Sur demande', inscription: 'Inscription', stripe: 'Paiement en ligne' },
  EN: { sur_demande: 'On request', inscription: 'Registration', stripe: 'Online payment' },
} as const;

const PastillePaiement: React.FC<{ produit: Product; lang: Language }> = ({ produit, lang }) => {
  if (!produit.paiement) return null;
  const Icone = produit.paiement === 'stripe' ? CreditCard : produit.paiement === 'inscription' ? CalendarCheck : HelpCircle;
  const titre = LIBELLE_PAIEMENT[lang][produit.paiement];
  const relie = produit.paiement === 'stripe' && (produit.stripePriceId || produit.lienPaiement);
  return (
    <span className="relative inline-flex flex-shrink-0" title={titre}>
      <Icone className="w-3.5 h-3.5 text-gris" aria-hidden="true" />
      {produit.paiement === 'stripe' && (
        <span
          className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-pilule ${
            produit.stripeEtat === 'erreur' ? 'bg-rose' : relie ? 'bg-encre' : 'bg-gris'
          }`}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

interface CarteOffreProps {
  produit: Product;
  lang: Language;
  t: TexteOffres;
  compact?: boolean;
  onOpen: (produit: Product) => void;
  onTogglePublish: (e: React.MouseEvent, produit: Product) => void;
}

export const CarteOffre: React.FC<CarteOffreProps> = ({ produit, lang, t, compact = false, onOpen, onTogglePublish }) => {
  const prixTexte = produit.price === 0 ? t.free : formatteurPrix.format(produit.price);
  // Un archétype absent ou les trois cochés veulent dire « tout le monde » : pas de badge dans ce cas.
  const profils =
    produit.clientTypes && produit.clientTypes.length > 0 && produit.clientTypes.length < 3
      ? produit.clientTypes.map((id) => libelleProfil(id, lang))
      : [];

  if (compact) {
    return (
      <div onClick={() => onOpen(produit)} className="flex items-center justify-between gap-3 py-2.5 cursor-pointer group">
        <div className="min-w-0 flex items-center gap-3 flex-1">
          {!produit.isPublic && <Globe className="w-3.5 h-3.5 text-gris flex-shrink-0" aria-hidden="true" />}
          <span className="font-sans font-medium text-encre truncate group-hover:text-rose transition-colors">{produit.name}</span>
          <Etiquette tone={produit.status === 'Active' ? 'accent' : 'neutre'} className="flex-shrink-0">
            {produit.status}
          </Etiquette>
        </div>
        <span className="flex items-center gap-2 flex-shrink-0">
          <PastillePaiement produit={produit} lang={lang} />
          <span className="font-serif text-encre tabular-nums">{prixTexte}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(produit)}
      className="bg-papier-2 border border-filet rounded-champ p-4 cursor-pointer transition-colors hover:border-encre"
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <Etiquette tone="neutre">{produit.category === 'Service' ? t.service : t.product}</Etiquette>
        <Etiquette tone={produit.status === 'Active' ? 'accent' : 'neutre'}>{produit.status}</Etiquette>
      </div>

      <h4 className="font-sans font-semibold text-encre mb-2 leading-tight">{produit.name}</h4>
      <p className="text-xs text-gris mb-3 line-clamp-3 leading-relaxed">{produit.description}</p>

      {profils.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {profils.map((label) => (
            <Etiquette key={label} tone="neutre">
              {label}
            </Etiquette>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-filet">
        <span className="font-serif text-lg text-encre tabular-nums">{prixTexte}</span>

        <button
          onClick={(e) => onTogglePublish(e, produit)}
          className={`text-xs flex items-center gap-1 px-2 py-1 rounded-pilule transition-colors ${
            produit.isPublic ? 'bg-rose/10 text-rose' : 'text-gris hover:text-encre'
          }`}
          title={produit.isPublic ? t.unpublish : t.publish}
        >
          {produit.isPublic ? (
            <>
              <Check className="w-3 h-3" /> {t.online}
            </>
          ) : (
            <>
              <Globe className="w-3 h-3" /> {t.publish}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
