// Seam — couture invisible entre deux fonds : un dégradé qui fait glisser
// la couleur de la section du dessus vers la transparence, posé en haut de
// la section du dessous (parent en `relative`).

import React from 'react';

export interface SeamProps {
  /** Couleur ou `var(--xh-…)` de la section au-dessus. */
  from: string;
  height?: number;
}

export const Seam: React.FC<SeamProps> = ({ from, height = 110 }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 z-0"
    style={{ height, background: `linear-gradient(180deg, ${from} 0%, transparent 100%)` }}
  />
);

export default Seam;
