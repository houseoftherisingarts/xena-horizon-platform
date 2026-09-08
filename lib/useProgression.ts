// useProgression — la lecture de position maison du kit motion Xena, portée
// telle quelle depuis Krystine (src/pages/foyer/BodySections.tsx). `useScroll({
// target })` de framer-motion mesure mal dans les pages à sections épinglées ;
// on lit le rect nous-mêmes par rAF, sans dépendance au scroll container.

import { type RefObject, useEffect } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

/**
 * Progression d'un bloc à mesure qu'il traverse l'écran : 0 quand son haut
 * entre par le bas, 1 quand son centre atteint `fin` (fraction de la
 * hauteur d'écran, 0.45 par défaut). Drop-in pour `useTransform`.
 */
export function useProgression(ref: RefObject<HTMLElement | null>, fin = 0.45): MotionValue<number> {
  const p = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      const depart = h * 0.96;
      const arrivee = h * fin - r.height / 2;
      const v = (depart - r.top) / Math.max(1, depart - arrivee);
      p.set(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, fin, p]);
  return p;
}

/**
 * Progression d'un conteneur épinglé (sticky, plus haut que l'écran) :
 * 0 quand son haut touche le haut de l'écran (l'épinglage commence),
 * 1 quand son bas touche le bas de l'écran (l'épinglage se termine).
 */
export function usePinProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const p = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      const distance = Math.max(1, r.height - h);
      const v = -r.top / distance;
      p.set(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, p]);
  return p;
}
