// Une : la manchette de l'accueil. À partir de sm, le h1 traverse les douze colonnes
// et la photo déborde sur les colonnes 8 à 12, masquée sur son bord gauche comme
// imprimée sur la page. Sur mobile, la grille asymétrique retombe en une colonne :
// le texte occupe le haut, la photo une bande pleine largeur en dessous, jamais
// l'un sur l'autre (règle des deux bords, DIRECTION-v2.md §5).

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
  /** Hauteur de la bande photo mobile (`--photo-h`), pilotée par la progression de l'épinglage
   * pour qu'elle remplisse l'espace laissé par le texte qui s'efface. `sm:h-[112%]` prend le
   * relais dès le format tablette et n'en tient jamais compte. */
  hauteurPhoto?: MotionValue<string>;
}

const NAV_PAD = 'pt-[calc(var(--nav)+1.75rem)] sm:pt-[calc(var(--nav)+2.75rem)] lg:pt-[calc(var(--nav)+4rem)]';

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
  hauteurPhoto,
}) => {
  const allerAuContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-full w-full flex-col sm:block">
      {/* Le texte : plein haut sur mobile, superposé aux colonnes 1 à 7 dès sm. */}
      <div
        className={`relative z-10 min-h-0 flex-1 overflow-hidden px-gut ${NAV_PAD} pb-6 sm:absolute sm:inset-0 sm:flex-none sm:overflow-visible sm:pb-0`}
      >
        <div className="grid grid-cols-12 gap-x-col">
          <motion.div
            className="col-span-12 sm:col-span-10 lg:col-span-9"
            style={opaciteTitre || decalageTitre ? { opacity: opaciteTitre, y: decalageTitre } : undefined}
          >
            <TexteRevele texte={headline} as="h1" par="mot" className="text-h1 font-serif text-encre" />
            <motion.span
              aria-hidden
              className="mt-4 block h-[2px] w-full origin-left bg-rose sm:mt-7"
              style={{ scaleX: filet ?? 1 }}
            />
          </motion.div>

          <motion.div
            className="in col-span-12 mt-6 flex flex-col items-start gap-4 sm:col-span-7 sm:mt-10 sm:gap-5 lg:col-span-6"
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

      {/* La photo : bande pleine largeur sous le texte sur mobile (pas de masque, rien à
          protéger en dessous) ; déborde à droite et en bas, masquée à gauche, dès sm. */}
      <motion.div
        className="relative h-[var(--photo-h)] w-full shrink-0 [mask-image:none] sm:absolute sm:right-[-3%] sm:top-0 sm:h-[112%] sm:w-[42%] sm:shrink sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_100%)] sm:[mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_100%)]"
        style={{ '--photo-h': hauteurPhoto ?? '36svh' } as unknown as React.CSSProperties}
      >
        <motion.div className="h-full w-full" style={filtre ? { filter: filtre, willChange: 'filter' } : undefined}>
          <KenBurns src={imageUrl} alt="Laurie Belhumeur" position="50% 22%" className="h-full w-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default Une;
