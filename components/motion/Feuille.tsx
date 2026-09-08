// Feuille — les sections empilées comme des feuilles (canon L'Œuvre, porté
// pour Xena) : chaque section s'épingle et la suivante monte par-dessus,
// coins arrondis et ombre portée. Une section plus haute que l'écran
// s'épingle par le BAS (top négatif = hauteur d'écran moins sa hauteur) :
// elle se lit entièrement avant de se faire recouvrir.

import React, { useEffect, useRef, useState } from 'react';

const COINS_DEFAUT = 'rounded-t-[22px] md:rounded-t-[30px]';
const OMBRE_DEFAUT = 'shadow-[0_-30px_80px_var(--xh-ombre,rgba(0,0,0,0.35))]';

export interface FeuilleProps {
  children: React.ReactNode;
  /** Ordre d'empilement (z-index). */
  z: number;
  className?: string;
  /** Classes des coins arrondis. Ignorées si `premiere`. */
  coinsClassName?: string;
  /** Classes de l'ombre portée. Ignorées si `premiere`. */
  ombreClassName?: string;
  /** La toute première feuille : ni coins, ni ombre (rien à recouvrir en dessous). */
  premiere?: boolean;
}

export const Feuille: React.FC<FeuilleProps> = ({
  children,
  z,
  className = '',
  coinsClassName = COINS_DEFAUT,
  ombreClassName = OMBRE_DEFAUT,
  premiere = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mesurer = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    window.addEventListener('resize', mesurer);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', mesurer);
    };
  }, []);

  const habillage = premiere ? '' : `${coinsClassName} ${ombreClassName}`;

  return (
    <div
      ref={ref}
      className={`sticky overflow-hidden ${habillage} ${className}`}
      style={{ top, zIndex: z }}
    >
      {children}
    </div>
  );
};

export default Feuille;
