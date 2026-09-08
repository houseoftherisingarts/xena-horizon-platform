// MotsTournants — « Pour les [mot qui tourne] », porté du composant animated-hero de
// tommyjepsen (21st.dev) : un motion.span par mot, empilé dans la même cellule de grille
// (largeur et hauteur réservées sur le mot le plus long, jamais de saut de ligne), entrée
// par le bas, sortie par le haut, ressort framer-motion (stiffness 50, comme la source).
// Mot fixe sous prefers-reduced-motion.

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';

export interface MotsTournantsProps {
  /** Le texte fixe avant le mot qui tourne (« Pour les », passé par useTextes côté appelant). */
  prefixe: string;
  mots: string[];
  /** Délai entre deux mots, en ms. */
  intervalle?: number;
  className?: string;
}

export const MotsTournants: React.FC<MotsTournantsProps> = ({
  prefixe,
  mots,
  intervalle = 2000,
  className = '',
}) => {
  const [index, setIndex] = useState(0);
  const reduit = useReducedMotion();

  useEffect(() => {
    if (reduit || mots.length <= 1) return;
    const id = setTimeout(() => setIndex((i) => (i === mots.length - 1 ? 0 : i + 1)), intervalle);
    return () => clearTimeout(id);
  }, [index, mots.length, reduit, intervalle]);

  if (mots.length === 0) return null;

  return (
    <p className={`flex flex-wrap items-baseline gap-x-[0.4ch] text-lede font-sans font-light text-encre/90 ${className}`}>
      <span>{prefixe}</span>
      <span className="relative inline-grid overflow-hidden text-left leading-[1.3]">
        {mots.map((mot, i) => (
          <motion.span
            key={mot}
            aria-hidden={index !== i}
            className="col-start-1 row-start-1 font-serif text-rose"
            initial={reduit ? false : { opacity: 0, y: '-100%' }}
            animate={
              index === i
                ? { y: 0, opacity: 1 }
                : { y: reduit ? 0 : index > i ? '-100%' : '100%', opacity: 0 }
            }
            transition={reduit ? { duration: 0 } : { type: 'spring', stiffness: 50 }}
          >
            {mot}
          </motion.span>
        ))}
      </span>
    </p>
  );
};

export default MotsTournants;
