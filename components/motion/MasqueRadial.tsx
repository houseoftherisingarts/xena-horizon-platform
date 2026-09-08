// MasqueRadial — révèle une image ou un bloc par un masque radial qui
// s'ouvre avec le scroll (porté de `Tache`, BodySections.tsx de Krystine).
// Accepte le contenu via `enfant` ou via `children`.

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useProgression } from '../../lib/useProgression';

export interface MasqueRadialProps {
  enfant?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Fraction d'écran (0-1) où le masque atteint son ouverture maximale. */
  fin?: number;
  /** Rayon du masque au départ, en %. */
  depart?: number;
  /** Rayon du masque à l'arrivée, en %. */
  arrivee?: number;
}

export const MasqueRadial: React.FC<MasqueRadialProps> = ({
  enfant,
  children,
  className,
  fin = 0.42,
  depart = 8,
  arrivee = 55,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const p = useProgression(ref, fin);
  const bord = useTransform(p, [0, 1], [depart, arrivee]);
  const masque = useMotionTemplate`radial-gradient(closest-side, black ${bord}%, transparent 100%)`;
  const contenu = enfant ?? children;

  const masqueStatique = `radial-gradient(closest-side, black ${arrivee}%, transparent 100%)`;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        reduce
          ? { maskImage: masqueStatique, WebkitMaskImage: masqueStatique }
          : { maskImage: masque, WebkitMaskImage: masque }
      }
    >
      {contenu}
    </motion.div>
  );
};

export default MasqueRadial;
