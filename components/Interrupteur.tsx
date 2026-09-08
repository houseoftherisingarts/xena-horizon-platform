// Interrupteur — porté du ThemeToggle (21st.dev) : une pilule de 64 × 32 avec un bouton rond
// qui glisse de 32 px d'un côté à l'autre en 300 ms; le contenu de l'état actif voyage dans le
// bouton, celui de l'autre état reste en retrait de l'autre côté. Un vrai `role="switch"`,
// zone de toucher de 44 px, couleurs passées par l'appelant (palette, langue).

import React from 'react';

export interface InterrupteurProps {
  /** true : bouton à droite (deuxième état). */
  droite: boolean;
  onBascule: () => void;
  libelle: string;
  /** Contenu de l'état gauche, dans le bouton (actif) et en retrait (inactif). */
  gaucheActif: React.ReactNode;
  gaucheInactif: React.ReactNode;
  droiteActif: React.ReactNode;
  droiteInactif: React.ReactNode;
  /** Classes de la pilule et du bouton selon l'état courant. */
  classePilule: string;
  classeBouton: string;
  className?: string;
}

export const Interrupteur: React.FC<InterrupteurProps> = ({
  droite,
  onBascule,
  libelle,
  gaucheActif,
  gaucheInactif,
  droiteActif,
  droiteInactif,
  classePilule,
  classeBouton,
  className = '',
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={droite}
    aria-label={libelle}
    title={libelle}
    onClick={onBascule}
    className={`group inline-flex min-h-[44px] items-center ${className}`}
  >
    <span
      aria-hidden="true"
      className={`relative block h-8 w-16 cursor-pointer rounded-pilule border p-1 transition-colors duration-300 ${classePilule}`}
    >
      <span
        className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-pilule transition-transform duration-300 ease-expo ${classeBouton}`}
        style={{ transform: droite ? 'translateX(32px)' : 'translateX(0)' }}
      >
        {droite ? droiteActif : gaucheActif}
      </span>
      <span
        className="absolute top-1 flex h-6 w-6 items-center justify-center transition-opacity duration-300"
        style={{ left: droite ? 4 : 36 }}
      >
        {droite ? gaucheInactif : droiteInactif}
      </span>
    </span>
  </button>
);

export default Interrupteur;
