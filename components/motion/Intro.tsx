// Intro — l'entrée en matière (GATE 0), palette-agnostique. Un filet qui
// s'étire puis se dissout, la marque qui se met au point lettre par
// lettre, une tenue, puis le rideau se lève par le haut sur le hero.
// Ne joue qu'une fois par session (`sessionStorage`). `onComplete` est
// toujours appelé, même en reduced motion, même si l'intro a déjà joué.

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Constantes de rythme — le pacing de référence (filet 700 ms, tenue
// 1 200 ms, levée 700 ms, soit 2,6 s) est mis à l'échelle sur `dureeMs` pour
// que le total réel soit toujours celui que le prop annonce. Allongé le
// 8 septembre 2026 à la demande d'Alex : la marque doit avoir le temps
// de se poser avant que le rideau ne se lève.
const FILET_MS = 700;
const TENUE_MS = 1200;
const LEVE_MS = 700;
const SOMME_REFERENCE_MS = FILET_MS + TENUE_MS + LEVE_MS;

const EASE_FILET = [0.16, 0.8, 0.24, 1] as const;
const EASE_RIDEAU = [0.22, 1, 0.36, 1] as const;
const CLE_SESSION = 'xh-intro-vue';

function phases(dureeMs: number) {
  const echelle = dureeMs / SOMME_REFERENCE_MS;
  const tenueS = (TENUE_MS * echelle) / 1000;
  return {
    filetS: (FILET_MS * echelle) / 1000,
    tenueS,
    leveS: (LEVE_MS * echelle) / 1000,
    // La marque part en fondu sur la fin de la tenue, avant que le rideau ne commence à se
    // lever : sans ça, la barre et le hero apparaissent par transparence pendant que la marque
    // est encore pleinement opaque (double exposition, chantier C).
    fonduS: tenueS * 0.3,
  };
}

export interface IntroProps {
  onComplete?: () => void;
  marque?: string;
  signature?: string;
  /** Durée totale de la séquence, en millisecondes. */
  dureeMs?: number;
  /** Identifiant de transition partagée (framer-motion) : la marque voyage vers l'élément
   * de la barre de navigation qui porte le même `layoutId`, au lieu de disparaître puis réapparaître. */
  layoutId?: string;
}

export const Intro: React.FC<IntroProps> = ({
  onComplete,
  marque = 'Xena Horizon',
  signature = 'par Laurie Belhumeur',
  dureeMs = 2600,
  layoutId,
}) => {
  const reduce = useReducedMotion();
  const [dejaVue] = useState(() => {
    try {
      return sessionStorage.getItem(CLE_SESSION) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dejaVue) {
      onComplete?.();
      return;
    }
    try {
      sessionStorage.setItem(CLE_SESSION, '1');
    } catch {
      // mode privé ou stockage bloqué : tant pis, l'intro rejouera au prochain chargement
    }
    const total = reduce ? 100 : dureeMs;
    const t = setTimeout(() => onComplete?.(), total);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dejaVue, reduce, dureeMs]);

  if (dejaVue) return null;

  if (reduce) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'var(--xh-papier, #0f172a)' }}
      >
        <span
          className="font-serif text-[clamp(1.6rem,4vw,2.6rem)]"
          style={{ color: 'var(--xh-encre, currentColor)' }}
        >
          {marque}
        </span>
      </div>
    );
  }

  const { filetS, tenueS, leveS, fonduS } = phases(dureeMs);
  const lettres = Array.from(marque);
  // Les lettres se mettent au point une à une sur la première moitié du filet.
  const staggerLettre = Math.min(0.04, filetS / Math.max(1, lettres.length) / 1.5);
  // Le voyage de la marque vers la barre de navigation (layoutId partagé) : 0,6 s, l'easing
  // maison. Posé ici pour que l'intro et Nav.tsx portent exactement la même transition.
  const TRANSITION_VOYAGE = { layout: { duration: 0.6, ease: EASE_FILET } };

  return (
    // `exit` donne à AnimatePresence (PublicHome.tsx) le temps de tenir ce sous-arbre monté
    // pendant que framer-motion raccorde le FLIP du layoutId vers la barre ; sans lui, React
    // retire l'intro du DOM dans le même rendu que `introVisible = false` et les deux marques
    // ne coexistent jamais assez longtemps pour que le voyage se produise.
    <motion.div className="fixed inset-0 z-[200] pointer-events-none" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'var(--xh-papier, #0f172a)' }}
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        transition={{ duration: leveS, ease: EASE_RIDEAU, delay: filetS + tenueS }}
      >
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: fonduS, delay: filetS + tenueS - fonduS, ease: EASE_FILET }}
        >
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-[42%] h-px -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'var(--xh-filet, linear-gradient(90deg, transparent, currentColor, transparent))',
            }}
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: ['0%', '60%', '60%'], opacity: [1, 1, 0] }}
            transition={{ duration: filetS, times: [0, 0.7, 1], ease: EASE_FILET }}
          />

          <motion.p
            layoutId={layoutId}
            className="relative font-serif text-[clamp(1.8rem,4vw,3.2rem)] tracking-wide"
            style={{ color: 'var(--xh-encre, currentColor)' }}
            initial="cache"
            animate="visible"
            transition={TRANSITION_VOYAGE}
            variants={{
              cache: {},
              visible: { transition: { staggerChildren: staggerLettre, delayChildren: filetS * 0.25 } },
            }}
          >
            {lettres.map((lettre, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{ whiteSpace: 'pre' }}
                variants={{
                  cache: { opacity: 0, filter: 'blur(8px)' },
                  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_FILET } },
                }}
              >
                {lettre}
              </motion.span>
            ))}
          </motion.p>

          <motion.p
            className="relative text-xs uppercase tracking-[0.25em]"
            style={{ color: 'var(--xh-encre-douce, currentColor)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: filetS * 0.75, ease: EASE_FILET }}
          >
            {signature}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Intro;
