// TexteGluant — porté du GooeyText (21st.dev) : deux calques du même texte qui se fondent
// l'un dans l'autre par flou et seuil alpha (filtre SVG feColorMatrix), dans une boucle
// requestAnimationFrame, avec le nettoyage que la source n'avait pas. Le calque le plus long
// réserve la place pour que rien ne saute. Texte fixe sous prefers-reduced-motion.

import React, { useEffect, useId, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

export interface TexteGluantProps {
  textes: string[];
  /** Durée du fondu, en secondes (source : morphTime). */
  dureeMorph?: number;
  /** Tenue entre deux fondus, en secondes (source : cooldownTime). */
  pause?: number;
  className?: string;
  classeTexte?: string;
}

export const TexteGluant: React.FC<TexteGluantProps> = ({
  textes,
  dureeMorph = 1,
  pause = 0.25,
  className = '',
  classeTexte = '',
}) => {
  const r1 = useRef<HTMLSpanElement>(null);
  const r2 = useRef<HTMLSpanElement>(null);
  const reduit = useReducedMotion();
  const idFiltre = `seuil-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (reduit || textes.length < 2) return;
    let index = textes.length - 1;
    let temps = performance.now();
    let morph = 0;
    let repos = pause;
    let trame = 0;
    const a0 = r1.current;
    const b0 = r2.current;
    if (a0 && b0) {
      // Le premier mot s'affiche tout de suite, au lieu du quart de seconde vide de la source.
      b0.textContent = textes[0];
      b0.style.opacity = '100%';
      a0.style.opacity = '0%';
    }

    const poser = (fraction: number) => {
      const a = r1.current;
      const b = r2.current;
      if (!a || !b) return;
      b.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      b.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const inverse = 1 - fraction;
      a.style.filter = `blur(${Math.min(8 / inverse - 8, 100)}px)`;
      a.style.opacity = `${Math.pow(inverse, 0.4) * 100}%`;
    };
    const auRepos = () => {
      morph = 0;
      const a = r1.current;
      const b = r2.current;
      if (!a || !b) return;
      b.style.filter = '';
      b.style.opacity = '100%';
      a.style.filter = '';
      a.style.opacity = '0%';
    };
    const fondre = () => {
      morph -= repos;
      repos = 0;
      let fraction = morph / dureeMorph;
      if (fraction > 1) {
        repos = pause;
        fraction = 1;
      }
      poser(fraction);
    };
    const boucle = (maintenant: number) => {
      trame = requestAnimationFrame(boucle);
      const doitAvancer = repos > 0;
      const dt = (maintenant - temps) / 1000;
      temps = maintenant;
      repos -= dt;
      if (repos <= 0) {
        if (doitAvancer) {
          index = (index + 1) % textes.length;
          if (r1.current && r2.current) {
            r1.current.textContent = textes[index % textes.length];
            r2.current.textContent = textes[(index + 1) % textes.length];
          }
        }
        fondre();
      } else {
        auRepos();
      }
    };
    trame = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(trame);
  }, [textes, dureeMorph, pause, reduit]);

  if (textes.length === 0) return null;
  const plusLong = textes.reduce((acc, t) => (t.length > acc.length ? t : acc), '');

  if (reduit || textes.length < 2) {
    return <span className={`${className} ${classeTexte}`}>{textes[0]}</span>;
  }

  return (
    <span className={`relative inline-block max-w-full ${className}`}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={idFiltre}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <span className="relative block" style={{ filter: `url(#${idFiltre})` }}>
        <span aria-hidden="true" className={`invisible block select-none ${classeTexte}`}>
          {plusLong}
        </span>
        <span ref={r1} aria-hidden="true" className={`absolute inset-0 block select-none ${classeTexte}`} />
        <span ref={r2} aria-hidden="true" className={`absolute inset-0 block select-none ${classeTexte}`} />
      </span>
      <span className="sr-only">{textes.join(', ')}</span>
    </span>
  );
};

export default TexteGluant;
