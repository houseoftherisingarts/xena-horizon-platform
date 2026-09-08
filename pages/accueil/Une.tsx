// Une — la manchette de l'accueil : le h1 sur les douze colonnes, la photo qui déborde
// sur les colonnes 8 à 12, masquée sur son bord gauche comme imprimée sur la page.
// Rendue à l'intérieur d'Allumage, qui lui fournit la progression de l'allumage
// (filtre noir et blanc vers couleur, filet qui s'étire, sortie du titre et du sous-titre).
// Sans ces valeurs (reduced motion), la photo reste en couleur et le texte reste plein.

import React from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { KenBurns, TexteRevele } from '../../components/motion';
import type { Language } from '../../types';

export interface UneProps {
  lang: Language;
  tagline: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  imageUrl: string;
  filtre?: MotionValue<string>;
  filet?: MotionValue<number>;
  opaciteTitre?: MotionValue<number>;
  decalageTitre?: MotionValue<number>;
  opaciteSousTitre?: MotionValue<number>;
}

const NAV_PAD = 'pt-[calc(var(--nav)+2.75rem)] sm:pt-[calc(var(--nav)+4rem)]';

const Une: React.FC<UneProps> = ({
  tagline,
  headline,
  subheadline,
  ctaText,
  imageUrl,
  filtre,
  filet,
  opaciteTitre,
  decalageTitre,
  opaciteSousTitre,
}) => {
  const allerAuContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-full w-full">
      {/* La photo, colonnes 8 à 12, part du haut derrière la barre et déborde à droite et en bas. */}
      <div
        className="absolute right-[-3%] top-0 h-[112%] w-[56%] sm:w-[42%]"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 100%)',
        }}
      >
        <motion.div
          className="h-full w-full"
          style={filtre ? { filter: filtre, willChange: 'filter' } : undefined}
        >
          <KenBurns src={imageUrl} alt="Laurie Belhumeur" position="50% 20%" className="h-full w-full" />
        </motion.div>
      </div>

      {/* Le texte, sur la grille, sous la barre de navigation transparente. */}
      <div className={`relative z-10 grid grid-cols-12 gap-x-col px-gut ${NAV_PAD}`}>
        <motion.div
          className="col-span-12 sm:col-span-10 lg:col-span-9"
          style={opaciteTitre || decalageTitre ? { opacity: opaciteTitre, y: decalageTitre } : undefined}
        >
          <TexteRevele texte={headline} as="h1" par="mot" className="text-h1 font-serif text-encre" />
          <motion.span
            aria-hidden
            className="mt-5 block h-[2px] w-full origin-left bg-rose sm:mt-7"
            style={{ scaleX: filet ?? 1 }}
          />
        </motion.div>

        <motion.div
          className="in col-span-12 mt-8 flex flex-col items-start gap-5 sm:col-span-7 sm:mt-10 lg:col-span-6"
          style={opaciteSousTitre ? { opacity: opaciteSousTitre } : undefined}
        >
          <p className="kicker text-rose">{tagline}</p>
          <p className="max-w-mesure text-lede font-sans font-light text-encre/90">{subheadline}</p>
          <button
            type="button"
            onClick={allerAuContact}
            className="pilule inline-flex items-center rounded-pilule bg-encre px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-papier"
          >
            {ctaText}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Une;
