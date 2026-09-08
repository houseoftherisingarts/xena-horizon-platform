import { ViewState } from '../types';

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

export const viewFromPath = (pathname: string): ViewState => {
  const sansPrefixe = PREFIX && pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) : pathname;
  const clean = sansPrefixe.replace(/\/+$/, '') || '/';
  return PATH_VIEWS[clean] ?? 'HOME';
};

export const pathFromView = (view: ViewState): string => {
  const chemin = VIEW_PATHS[view] ?? '/';
  return PREFIX ? `${PREFIX}${chemin === '/' ? '/' : chemin}` : chemin;
};

/**
 * La facture publique porte un jeton, pas une vue : hors du système ViewState, lue directement par
 * App.tsx avant le routage habituel. Voir lib/factures.ts (jeton, miroir) et pages/FacturePublique.tsx.
 */
export const jetonFactureDepuisChemin = (pathname: string): string | null => {
  const m = pathname.match(/^\/facture\/([\w-]+)/);
  return m ? m[1] : null;
};
