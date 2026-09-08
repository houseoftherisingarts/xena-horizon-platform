// KenBurns — zoom continu et lent sur une image plein cadre. Boucle
// inversée (aller-retour), statique en reduced motion.

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface KenBurnsProps {
  src: string;
  alt?: string;
  className?: string;
  /** Échelle de départ. */
  from?: number;
  /** Échelle d'arrivée avant le retour. */
  to?: number;
  /** Durée d'un aller, en secondes. */
  duration?: number;
  /** `object-position` CSS (ex. '50% 20%'). */
  position?: string;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  alt = '',
  className = '',
  from = 1.06,
  to = 1.16,
  duration = 22,
  position,
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.img
      src={src}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      loading="eager"
      className={`h-full w-full object-cover ${className}`}
      style={position ? { objectPosition: position } : undefined}
      initial={reduce ? false : { scale: from }}
      animate={reduce ? undefined : { scale: to }}
      transition={{ duration, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
    />
  );
};

export default KenBurns;
