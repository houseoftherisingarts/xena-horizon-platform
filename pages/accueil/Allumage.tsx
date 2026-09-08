// Allumage, la une épinglée dans un conteneur de 240vh : la photo passe du noir et blanc
// à la couleur, le filet rose sous le titre s'étire, le titre et le sous-titre s'effacent
// et une strophe se met au point à leur place. Progression lue par rAF (usePinProgress),
// jamais useScroll({ target }). Sous prefers-reduced-motion : pas d'épinglage, photo en
// couleur, strophe imprimée sous le hero.

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useTransform } from 'framer-motion';
import Une from './Une';
import { usePinProgress } from '../../lib/useProgression';
import { useIntroTerminee } from '../../lib/intro';
import type { Language } from '../../types';

export interface AllumageProps {
  lang: Language;
  tagline: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  imageUrl: string;
  strophe: string;
  strapline: string;
}

const NAV_PAD = 'pt-[calc(var(--nav)+1.75rem)] sm:pt-[calc(var(--nav)+2.75rem)] lg:pt-[calc(var(--nav)+4rem)]';

const Allumage: React.FC<AllumageProps> = ({
  lang,
  tagline,
  headline,
  subheadline,
  ctaText,
  imageUrl,
  strophe,
  strapline,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const p = usePinProgress(ref);
  // La cascade du hero (`.in`, TexteRevele) n'attend que la branche animée : elle démarre au
  // signal synchrone de fin d'intro, jamais avant, jamais sur un compte à zéro (chantier C).
  const introTerminee = useIntroTerminee();

  const gris = useTransform(p, [0, 0.45], [1, 0]);
  const clarte = useTransform(p, [0, 0.45], [1.06, 1]);
  const filtre = useMotionTemplate`grayscale(${gris}) brightness(${clarte})`;
  const filet = useTransform(p, [0, 0.45], [0.12, 1]);

  const opaciteSousTitre = useTransform(p, [0.35, 0.55], [1, 0]);
  const opaciteTitre = useTransform(p, [0.45, 0.7], [1, 0]);
  const decalageTitre = useTransform(p, [0.45, 0.7], [0, -40]);

  // Se pose entre 0,55 et 0,72, tient, puis s'efface tout à fait avant la sortie de l'épinglage
  // (0,97 à 1) pour qu'aucun fragment ne reste visible par-dessus la feuille Sommaire qui monte.
  const opaciteStrophe = useTransform(p, [0.55, 0.72, 0.97, 1], [0, 1, 1, 0]);
  const decalageStrophe = useTransform(p, [0.55, 0.85], [16, 0]);
  const flouStrophe = useTransform(p, [0.55, 0.85], [18, 0]);
  const filtreStrophe = useMotionTemplate`blur(${flouStrophe}px)`;

  // Sur mobile, la photo grandit une fois le titre disparu (opaciteTitre finit à 0.7) pour
  // remplir l'espace sous la strophe, qui se pose jusqu'à 0.85. sm:h-[112%] ignore cette
  // variable. ponytail: hauteur d'arrivée estimée (NAV_PAD + 2 lignes + kicker), pas mesurée
  // via ref ; à affiner avec un ResizeObserver si un écart persiste sur de très petits écrans.
  const hauteurPhotoValeur = useTransform(p, [0.7, 0.85], [36, 68]);
  const hauteurPhoto = useMotionTemplate`${hauteurPhotoValeur}svh`;

  if (reduce) {
    return (
      <section className="relative min-h-[100svh] bg-papier">
        <Une
          lang={lang}
          tagline={tagline}
          headline={headline}
          subheadline={subheadline}
          ctaText={ctaText}
          imageUrl={imageUrl}
        />
        <div className={`px-gut pb-[10vh] pt-[8vh]`}>
          <p className="max-w-[18ch] text-display font-serif text-encre">{strophe}</p>
          <p className="kicker mt-4 text-gris">{strapline}</p>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-papier">
        <Une
          lang={lang}
          tagline={tagline}
          headline={headline}
          subheadline={subheadline}
          ctaText={ctaText}
          imageUrl={imageUrl}
          filtre={filtre}
          filet={filet}
          opaciteTitre={opaciteTitre}
          decalageTitre={decalageTitre}
          opaciteSousTitre={opaciteSousTitre}
          hauteurPhoto={hauteurPhoto}
        />

        <motion.div
          style={{ opacity: opaciteStrophe, y: decalageStrophe, filter: filtreStrophe }}
          className={`pointer-events-none absolute inset-x-0 top-0 px-gut ${NAV_PAD}`}
        >
          <p className="max-w-[16ch] text-display font-serif text-encre sm:max-w-[20ch]">{strophe}</p>
          <p className="kicker mt-4 text-gris">{strapline}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Allumage;
