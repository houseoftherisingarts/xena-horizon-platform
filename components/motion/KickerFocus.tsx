// KickerFocus — un kicker qui se met au point pendant le scroll : il entre
// flou et se précise à mesure que le bloc atteint son point d'ancrage,
// jamais sur minuterie (porté de BodySections.tsx de Krystine).

import React, { useRef } from 'react';
import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { useProgression } from '../../lib/useProgression';

export interface KickerFocusProps {
  texte: string;
  className?: string;
  /** Fraction d'écran (0-1) où le kicker atteint son point net. */
  fin?: number;
}

export const KickerFocus: React.FC<KickerFocusProps> = ({ texte, className, fin = 0.45 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const p = useProgression(ref, fin);
  const blur = useTransform(p, [0, 1], [18, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const opacity = useTransform(p, [0, 1], [0.12, 1]);
  const scale = useTransform(p, [0, 1], [1.06, 1]);

  return (
    <div ref={ref}>
      <motion.p className={className} style={reduce ? undefined : { filter, opacity, scale }}>
        {texte}
      </motion.p>
    </div>
  );
};

export default KickerFocus;
