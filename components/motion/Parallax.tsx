// Parallax — translate son enfant en Y à mesure que la section défile.
// Le ref de mesure et l'élément transformé sont deux nœuds distincts : mesurer
// et transformer le même élément crée une boucle (le transform déplace le
// rect que useScroll vient de lire).
//
// CLS au chargement à froid (mesuré 0,3 sur /projets et /a-propos, corrigé 8-9 sept 2026) :
// useScroll de framer-motion démarre TOUJOURS scrollYProgress à 0 (donc y à son extrémité,
// -speed*50%) et ne mesure la vraie position qu'un cadre plus tard (sa mesure passe par son
// propre ordonnanceur interne, jamais avant le premier peignage). Pour toute section déjà
// partiellement visible au chargement (proche du pli, comme les premiers Parallax de ces deux
// pages), ce défaut est faux : le vrai progrès n'est pas 0, et l'écart se peint puis saute. On
// pose donc le progrès réel nous-mêmes, calculé de la même façon que useScroll (offset
// ['start end', 'end start']), dans un effet de mise en page qui tourne avant le peignage du
// navigateur — la scène s'ouvre déjà à la bonne position, rien ne saute.
import React, { useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';

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

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parcours = window.innerHeight + rect.height;
    const progresReel = parcours > 0 ? Math.min(1, Math.max(0, (window.innerHeight - rect.top) / parcours)) : 0;
    scrollYProgress.jump(progresReel);
  }, [scrollYProgress]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
};

export default Parallax;
