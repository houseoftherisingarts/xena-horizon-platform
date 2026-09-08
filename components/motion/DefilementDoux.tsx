// DefilementDoux — fournisseur Lenis pour un défilement lissé desktop.
// Désactivé si l'utilisateur préfère un mouvement réduit, ou sur un
// pointeur grossier (tactile) pour ne jamais casser le défilement natif
// mobile. `useLenis()` rend l'instance active, ou `null`.

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/motion';

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export const DefilementDoux: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduce = useReducedMotion();
  const [instance, setInstance] = useState<Lenis | null>(null);
  const rafId = useRef(0);

  useEffect(() => {
    if (reduce) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    setInstance(lenis);

    const raf = (time: number) => {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
      lenis.destroy();
      setInstance(null);
    };
  }, [reduce]);

  return <LenisContext.Provider value={instance}>{children}</LenisContext.Provider>;
};

export default DefilementDoux;
