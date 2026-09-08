/**
 * Les sections de l'accueil que Laurie peut allumer ou éteindre depuis l'admin (Admin › Sections du
 * site). Même mécanique de cache que lib/textes.tsx : Firestore `settings/sections` (`{ [id]: boolean }`)
 * avec un repli localStorage pour éviter l'éclair d'une section à son état par défaut le temps que
 * Firestore réponde. L'intro de l'accueil (components/motion/Intro.tsx) n'y figure pas : c'est le
 * seul « hero » qui ne s'éteint jamais, tout le reste est une feuille de la pile qui peut se retirer.
 */
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { Language } from '../types';

export interface SectionDef {
  id: string;
  libelle: Record<Language, string>;
  /** false seulement pour une section qui doit rester éteinte tant que rien ne l'alimente (capsules). */
  defautOn: boolean;
  /** Note affichée sous l'interrupteur dans l'admin, pour une section qui attend du contenu. */
  note?: Record<Language, string>;
}

export const CHEMIN_SECTIONS = 'settings/sections';
const CLE_CACHE = 'xena.sections';

export const SECTIONS_ACCUEIL: SectionDef[] = [
  { id: 'allumage', libelle: { FR: 'Allumage (la une)', EN: 'Hero (the headline)' }, defautOn: true },
  { id: 'sommaire', libelle: { FR: 'Sommaire (les trois profils)', EN: 'Overview (the three profiles)' }, defautOn: true },
  {
    id: 'capsules',
    libelle: { FR: 'Capsules vidéo', EN: 'Video capsules' },
    defautOn: false,
    note: {
      FR: 'S’allume dès qu’une première capsule est publiée dans Admin › Capsules.',
      EN: 'Turns on as soon as a first capsule is published in Admin › Capsules.',
    },
  },
  { id: 'apropos', libelle: { FR: 'À propos', EN: 'About' }, defautOn: true },
  { id: 'temoignage', libelle: { FR: 'Témoignage écrit', EN: 'Written testimonial' }, defautOn: true },
  { id: 'temoignagesAudio', libelle: { FR: 'Témoignages audio', EN: 'Audio testimonials' }, defautOn: true },
  { id: 'projets', libelle: { FR: 'Les projets', EN: 'The projects' }, defautOn: true },
  { id: 'citation', libelle: { FR: 'Citation', EN: 'Quote' }, defautOn: true },
  { id: 'contact', libelle: { FR: 'Contact', EN: 'Contact' }, defautOn: true },
];

const lireCache = (): Record<string, boolean> => {
  try {
    const brut = window.localStorage.getItem(CLE_CACHE);
    return brut ? (JSON.parse(brut) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

const ecrireCache = (v: Record<string, boolean>): void => {
  try {
    window.localStorage.setItem(CLE_CACHE, JSON.stringify(v));
  } catch {
    /* stockage bloqué : la prochaine visite relira Firestore */
  }
};

/** Les surcharges d'état, telles qu'écrites dans Firestore (une clé absente vaut le défaut de la section). */
export function useSections(): Record<string, boolean> {
  const [surcharges, setSurcharges] = useState<Record<string, boolean>>(() =>
    typeof window === 'undefined' ? {} : lireCache()
  );

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, CHEMIN_SECTIONS),
      (snap) => {
        const data = (snap.data() ?? {}) as Record<string, boolean>;
        setSurcharges(data);
        ecrireCache(data);
      },
      () => {
        /* hors ligne ou règles fermées : le cache et les défauts font le travail */
      }
    );
    return () => unsub();
  }, []);

  return surcharges;
}

/** true si la section doit se rendre, surcharge Firestore comprise. */
export function sectionActive(surcharges: Record<string, boolean>, id: string): boolean {
  if (id in surcharges) return surcharges[id] !== false;
  return SECTIONS_ACCUEIL.find((s) => s.id === id)?.defautOn ?? true;
}
