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

/**
 * Le mode nuit : une deuxième dimension, indépendante de la palette. `data-nuit` sur <html> renverse
 * papier et encre (index.css, blocs :root[data-nuit]). Sans choix enregistré (clé xena.nuit), le site
 * suit le réglage du système (prefers-color-scheme). Le script d'index.html pose l'attribut avant le
 * premier rendu.
 */
const CLE_NUIT = 'xena.nuit';
const listenersNuit = new Set<() => void>();

const lireNuitDocument = (): boolean => typeof document !== 'undefined' && document.documentElement.hasAttribute('data-nuit');

let nuitCourante: boolean = lireNuitDocument();

export const lireNuit = (): boolean => nuitCourante;

export function poserNuit(nuit: boolean): void {
  nuitCourante = nuit;
  if (nuit) document.documentElement.setAttribute('data-nuit', '');
  else document.documentElement.removeAttribute('data-nuit');
  try {
    window.localStorage.setItem(CLE_NUIT, nuit ? '1' : '0');
  } catch {
    /* navigation privée */
  }
  listenersNuit.forEach((fn) => fn());
}

const abonnerNuit = (fn: () => void) => {
  listenersNuit.add(fn);
  return () => {
    listenersNuit.delete(fn);
  };
};

export function useNuit(): [boolean, (nuit: boolean) => void] {
  const nuit = useSyncExternalStore(abonnerNuit, lireNuit, () => false);
  return [nuit, poserNuit];
}
