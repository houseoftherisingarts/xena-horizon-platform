import { useSyncExternalStore } from 'react';

/**
 * La palette du site : « encre » (papier, encre, rose du livre, canon v2) ou « ciel » (les couleurs du
 * site actuel de Laurie : blanc, noir, bleu ciel du logo). Les deux vivent dans index.css sous
 * :root (ciel, par défaut) et :root[data-skin='encre'] ; le choix tient dans localStorage et un script d'index.html
 * le pose avant le premier rendu, pour éviter tout éclair de l'autre palette.
 */
export type Skin = 'encre' | 'ciel';

const CLE = 'xena.skin';
const listeners = new Set<() => void>();

const lireDocument = (): Skin =>
  typeof document !== 'undefined' && document.documentElement.getAttribute('data-skin') === 'encre' ? 'encre' : 'ciel';

let courante: Skin = lireDocument();

export const lireSkin = (): Skin => courante;

export function poserSkin(skin: Skin): void {
  courante = skin;
  if (skin === 'encre') document.documentElement.setAttribute('data-skin', 'encre');
  else document.documentElement.removeAttribute('data-skin');
  try {
    window.localStorage.setItem(CLE, skin);
  } catch {
    /* navigation privée : le choix tient le temps de la visite */
  }
  listeners.forEach((fn) => fn());
}

const abonner = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export function useSkin(): [Skin, (skin: Skin) => void] {
  const skin = useSyncExternalStore(abonner, lireSkin, () => 'ciel' as Skin);
  return [skin, poserSkin];
}
