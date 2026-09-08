// TexteRevele — révèle un titre mot par mot ou lettre par lettre au
// scroll : chaque unité arrive floue et décalée, puis se pose nette.
// Respecte les retours à la ligne `\n`. Le fragment animé est masqué aux
// lecteurs d'écran ; le texte complet reste lisible via `aria-label`.

import React, { useMemo } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

const EASE = [0.16, 0.8, 0.24, 1] as const;
const DUREE = 0.75;
const STAGGER = 0.05;

type MotionDiv = React.ComponentType<HTMLMotionProps<'div'>>;
const composant = (as: string): MotionDiv =>
  (motion as unknown as Record<string, MotionDiv>)[as];

export interface TexteReveleProps {
  texte: string;
  /** Balise de rendu : 'h1', 'h2', 'p'... */
  as?: string;
  className?: string;
  /** Unité révélée : mot par mot ou lettre par lettre. */
  par?: 'mot' | 'lettre';
  delay?: number;
}

export const TexteRevele: React.FC<TexteReveleProps> = ({
  texte,
  as = 'h1',
  className,
  par = 'mot',
  delay = 0,
}) => {
  const reduce = useReducedMotion();
  const Balise = useMemo(() => composant(as), [as]);
  const lignes = useMemo(() => texte.split('\n'), [texte]);

  if (reduce) {
    return (
      <Balise className={className} aria-label={texte}>
        {lignes.map((ligne, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {ligne}
          </React.Fragment>
        ))}
      </Balise>
    );
  }

  let compte = 0;

  return (
    <Balise className={className} aria-label={texte}>
      <span aria-hidden>
        {lignes.map((ligne, li) => {
          const unites = par === 'lettre' ? Array.from(ligne) : ligne.split(' ');
          return (
            <React.Fragment key={li}>
              {li > 0 && <br />}
              {unites.map((unite, ui) => {
                const i = compte++;
                return (
                  <React.Fragment key={ui}>
                    <motion.span
                      className="inline-block"
                      style={{ whiteSpace: 'pre' }}
                      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: DUREE, delay: delay + i * STAGGER, ease: EASE }}
                    >
                      {unite}
                    </motion.span>
                    {par === 'mot' && ui < unites.length - 1 ? ' ' : ''}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </span>
    </Balise>
  );
};

export default TexteRevele;
