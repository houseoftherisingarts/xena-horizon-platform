import { Language, ViewState } from '../types';

/** Chaque vue porte une vraie adresse, pour les liens directs, le bouton Précédent et le référencement. */
export const VIEW_PATHS: Record<ViewState, string> = {
  HOME: '/',
  SERVICES: '/services',
  PROJETS: '/projets',
  A_PROPOS: '/a-propos',
  ESPACE_CLIENT: '/espace',
  ADMIN_DOSSIERS: '/admin/dossiers',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_AGENDA: '/admin/agenda',
  ADMIN_EMAIL: '/admin/courriel',
  ADMIN_MESSENGER: '/admin/messages',
  ADMIN_CRM: '/admin/clients',
  ADMIN_INVOICES: '/admin/factures',
  ADMIN_FINANCE: '/admin/finances',
  ADMIN_PRODUCTS: '/admin/offres',
  ADMIN_NEWSLETTER: '/admin/infolettre',
  ADMIN_GALLERY: '/admin/galerie',
  ADMIN_SOCIAL: '/admin/social',
  ADMIN_VEXEL: '/admin/vexel',
  ADMIN_TEMOIGNAGES: '/admin/temoignages',
  ADMIN_VIDEOS: '/admin/capsules',
  ADMIN_SECTIONS: '/admin/sections',
} as Record<ViewState, string>;

const PATH_VIEWS: Record<string, ViewState> = Object.fromEntries(
  Object.entries(VIEW_PATHS).map(([view, path]) => [path, view as ViewState])
);

/** Préfixe de déploiement (vide en production, `/history/v1` pour une version archivée). */
const PREFIX = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

/** Préfixe d'adresse anglais (GEO, trouvaille 3 de l'audit du 8 sept) : `/en/services`, jamais un état sans adresse propre. */
const LANG_PREFIX = '/en';

/** Les seules vues qui portent une adresse anglaise distincte : les quatre pages publiques prérendues. */
const VIEWS_BILINGUES: ViewState[] = ['HOME', 'SERVICES', 'PROJETS', 'A_PROPOS'];

/** Retire le préfixe de déploiement puis le préfixe de langue, pour retomber sur le chemin de VIEW_PATHS. */
const sansPrefixes = (pathname: string): string => {
  const sansDeploiement = PREFIX && pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) : pathname;
  const enAnglais = sansDeploiement === LANG_PREFIX || sansDeploiement.startsWith(`${LANG_PREFIX}/`);
  const reste = enAnglais ? sansDeploiement.slice(LANG_PREFIX.length) || '/' : sansDeploiement;
  return reste.replace(/\/+$/, '') || '/';
};

export const viewFromPath = (pathname: string): ViewState => {
  return PATH_VIEWS[sansPrefixes(pathname)] ?? 'HOME';
};

/** Le chemin nettoyé (préfixes de déploiement et de langue retirés), pour reconnaître une adresse connue. */
export const cheminNettoye = (pathname: string): string => sansPrefixes(pathname);

/**
 * La langue portée par l'adresse elle-même, pour les quatre pages bilingues seulement — `null` pour
 * toute autre adresse (espace, admin, facture), où la langue reste celle de `localStorage`. Quand
 * l'adresse et `localStorage` se contredisent, c'est TOUJOURS l'adresse qui gagne (App.tsx s'en sert
 * à l'état initial ET au retour du bouton Précédent) : c'est ce qui garantit qu'un lien /en/... ouvre
 * bien en anglais, sans clignoter en français le temps qu'un effet lise le stockage.
 */
export const langFromPath = (pathname: string): Language | null => {
  const sansDeploiement = PREFIX && pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) : pathname;
  const enAnglais = sansDeploiement === LANG_PREFIX || sansDeploiement.startsWith(`${LANG_PREFIX}/`);
  const view = PATH_VIEWS[sansPrefixes(pathname)];
  if (!view || !VIEWS_BILINGUES.includes(view)) return null;
  return enAnglais ? 'EN' : 'FR';
};

export const pathFromView = (view: ViewState, lang: Language = 'FR'): string => {
  const chemin = VIEW_PATHS[view] ?? '/';
  const avecLangue =
    lang === 'EN' && VIEWS_BILINGUES.includes(view) ? (chemin === '/' ? LANG_PREFIX : `${LANG_PREFIX}${chemin}`) : chemin;
  return PREFIX ? `${PREFIX}${avecLangue}` : avecLangue;
};

/**
 * La facture publique porte un jeton, pas une vue : hors du système ViewState, lue directement par
 * App.tsx avant le routage habituel. Voir lib/factures.ts (jeton, miroir) et pages/FacturePublique.tsx.
 */
export const jetonFactureDepuisChemin = (pathname: string): string | null => {
  const m = pathname.match(/^\/facture\/([\w-]+)/);
  return m ? m[1] : null;
};
