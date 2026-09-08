/**
 * Signal partagé de l'entrée en matière : l'intro (montée par l'accueil) prévient la barre de navigation
 * quand la marque a fini de voyager, pour que la marque n'apparaisse jamais deux fois à l'écran.
 *
 * Store synchrone (useSyncExternalStore) : `marquerIntroTerminee()` notifie et la barre relit l'état
 * dans le MÊME rendu, sans le tour de useEffect qui accusait un rendu de retard sur le démontage de
 * l'intro et empêchait framer-motion de raccorder le FLIP (layoutId « xh-marque ») entre l'intro et
 * la barre de navigation.
 */
import { useSyncExternalStore } from 'react';

const CLE = 'xh.intro.terminee';
const auditeurs = new Set<() => void>();

const lireEtat = (): boolean => {
  try {
    return typeof window !== 'undefined' && window.sessionStorage.getItem(CLE) === '1';
  } catch {
    return true;
  }
};

/** L'intro doit-elle jouer ? Une seule fois par session de navigation. */
export const introDejaJouee = (): boolean => lireEtat();

/** À appeler quand l'intro se termine (ou quand elle est sautée). */
export const marquerIntroTerminee = (): void => {
  try {
    window.sessionStorage.setItem(CLE, '1');
  } catch {
    /* navigation privée : on continue sans mémoire */
  }
  auditeurs.forEach((a) => a());
};

const souscrire = (a: () => void): (() => void) => {
  auditeurs.add(a);
  return () => {
    auditeurs.delete(a);
  };
};

/** Vrai dès que l'intro est finie (ou n'a pas à jouer). */
export function useIntroTerminee(): boolean {
  return useSyncExternalStore(souscrire, lireEtat);
}
