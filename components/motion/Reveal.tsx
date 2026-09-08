// Reveal — fait entrer un bloc au scroll (fade-up), une fois. RevealStagger
// fait la même chose en cascade sur ses enfants directs. Easing et durée du
// canon L'Œuvre : cubic-bezier(0.16, 0.8, 0.24, 1), 1,05 s, jamais de rebond.

import React, { Children, useMemo } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';

const EASE = [0.16, 0.8, 0.24, 1] as const;
const DUREE = 1.05;

type MotionDiv = React.ComponentType<HTMLMotionProps<'div'>>;
const composant = (as: string): MotionDiv =>
  (motion as unknown as Record<string, MotionDiv>)[as];

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  /** Décalage vertical de départ, en pixels. */
  y?: number;
  /** Fraction visible du bloc qui déclenche l'entrée. */
  amount?: number;
  /** Ne joue qu'une fois (par défaut) ou à chaque passage. */
  once?: boolean;
  /** Balise de rendu : 'div', 'section', 'h1'... */
  as?: string;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 36,
  amount = 0.25,
  once = true,
  as = 'div',
  className,
}) => {
  const reduce = useReducedMotion();
  const Balise = useMemo(() => composant(as), [as]);

  if (reduce) {
    return <Balise className={className}>{children}</Balise>;
  }

  return (
    <Balise
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: DUREE, delay, ease: EASE }}
    >
      {children}
    </Balise>
  );
};

const item: Variants = {
  cache: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: DUREE, ease: EASE } },
};

export interface RevealStaggerProps {
  children: React.ReactNode;
  /** Intervalle entre l'entrée de chaque enfant, en secondes. */
  stagger?: number;
}

export const RevealStagger: React.FC<RevealStaggerProps> = ({ children, stagger = 0.09 }) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="cache"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={{ ...conteneur, visible: { transition: { staggerChildren: stagger } } }}
    >
      {Children.map(children, (enfant, i) => (
        <motion.div key={i} variants={item}>
          {enfant}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Reveal;
