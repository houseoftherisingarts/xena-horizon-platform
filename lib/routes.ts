import { ViewState } from '../types';

/** Chaque vue porte une vraie adresse, pour les liens directs, le bouton Précédent et le référencement. */
export const VIEW_PATHS: Record<ViewState, string> = {
  HOME: '/',
  SERVICES: '/services',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_AGENDA: '/admin/agenda',
  ADMIN_EMAIL: '/admin/courriel',
  ADMIN_MESSENGER: '/admin/messages',
  ADMIN_WEBSITE: '/admin/site',
  ADMIN_CRM: '/admin/clients',
  ADMIN_INVOICES: '/admin/factures',
  ADMIN_FINANCE: '/admin/finances',
  ADMIN_PRODUCTS: '/admin/offres',
  ADMIN_LANDING: '/admin/pages',
  ADMIN_NEWSLETTER: '/admin/infolettre',
  ADMIN_GALLERY: '/admin/galerie',
  ADMIN_SOCIAL: '/admin/social',
} as Record<ViewState, string>;

const PATH_VIEWS: Record<string, ViewState> = Object.fromEntries(
  Object.entries(VIEW_PATHS).map(([view, path]) => [path, view as ViewState])
);

export const viewFromPath = (pathname: string): ViewState => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return PATH_VIEWS[clean] ?? 'HOME';
};

export const pathFromView = (view: ViewState): string => VIEW_PATHS[view] ?? '/';
