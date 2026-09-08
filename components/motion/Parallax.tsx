// Parallax — translate son enfant en Y à mesure que la section défile.
// Le ref de mesure et l'élément transformé sont deux nœuds distincts : mesurer
// et transformer le même élément crée une boucle (le transform déplace le
// rect que useScroll vient de lire).

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Fraction de la course parallaxe : 0.15 discret, 0.4 marqué. Négatif = sens inverse. */
  speed?: number;
}

export const Parallax: React.FC<ParallaxProps> = ({ children, className, speed = 0.18 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -50}%`, `${speed * 50}%`]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
};

export default Parallax;
