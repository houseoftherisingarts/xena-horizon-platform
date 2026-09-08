// CarteProjecteur — porté du Spotlight card de jahed (21st.dev) : un seul écouteur
// pointermove partagé (posé une fois pour toute la page) pousse la position du curseur
// dans deux variables CSS sur la racine ; chaque carte peint un radial-gradient de 200 px
// en `background-attachment: fixed`, si bien qu'il suit le pointeur sans recalcul par
// carte. Trois calques comme la source : fond (200 px), bordure (150 px) et reflet blanc (100 px).
// Enrobe ses enfants sans toucher leur mise en page ni leurs coins. Rien au toucher,
// rien en reduced motion (souris fine seulement, `pointer: fine`).

import React, { useEffect, useRef } from 'react';

let ecouteurPose = false;
function poserEcouteur(): void {
  if (ecouteurPose || typeof window === 'undefined') return;
  ecouteurPose = true;
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      document.documentElement.style.setProperty('--proj-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--proj-y', `${e.clientY}px`);
    },
    { passive: true }
  );
}

const supportePointeurFin = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface CarteProjecteurProps {
  children: React.ReactNode;
  className?: string;
  /** true : coins doux (rounded-champ). false (défaut) : coins vifs, comme la carte hôte. */
  arrondi?: boolean;
}

export const CarteProjecteur: React.FC<CarteProjecteurProps> = ({ children, className = '', arrondi = false }) => {
  const actif = useRef(supportePointeurFin()).current;

  useEffect(() => {
    if (actif) poserEcouteur();
  }, [actif]);

  if (!actif) {
    return <div className={className}>{children}</div>;
  }

  const coins = arrondi ? 'rounded-champ' : '';

  return (
    <div className={`relative overflow-hidden ${coins} ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(200px circle at var(--proj-x, -9999px) var(--proj-y, -9999px), rgb(var(--c-bouton) / 0.1), transparent 80%)',
          backgroundAttachment: 'fixed',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          padding: 1,
          background:
            'radial-gradient(150px circle at var(--proj-x, -9999px) var(--proj-y, -9999px), rgb(var(--c-bouton) / 0.55), transparent 100%)',
          backgroundAttachment: 'fixed',
          WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {/* Le reflet blanc de la source (::after) : un point plus petit, blanc, dans la même bordure. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          padding: 1,
          background:
            'radial-gradient(100px circle at var(--proj-x, -9999px) var(--proj-y, -9999px), rgb(255 255 255 / 0.9), transparent 100%)',
          backgroundAttachment: 'fixed',
          WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CarteProjecteur;
