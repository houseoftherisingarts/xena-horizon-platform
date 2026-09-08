import React, { useEffect, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Film,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  PenTool,
  Mic,
  ShieldCheck,
  PieChart,
  ShoppingBag,
  ToggleLeft,
  Users,
  X,
} from 'lucide-react';
import { Dossier, ViewState, Language } from '../types';
import { useCollection } from '../lib/firestore';

interface AdminSidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut: () => void;
  lang: Language;
  /** Sur téléphone, la barre devient un tiroir : ouvert ou fermé. */
  open?: boolean;
  onClose?: () => void;
  /** Notifie le parent d'un repli, pour libérer la largeur au contenu (App.tsx). */
  onReplieChange?: (replie: boolean) => void;
}

const CLE_MENU_REPLIE = 'xena.admin.menu';

/** La barre du back-office v2 : papier-2, encre, un filet rose sur l'entrée active. Se replie en rail d'icônes sur desktop. */
const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onSignOut, lang, open = false, onClose, onReplieChange }) => {
  const { data: dossiers } = useCollection<Dossier>('dossiers');
  const nonLusDossiers = dossiers.reduce((n, d) => n + (d.nonLusAdmin || 0), 0);

  const [replie, setReplieEtat] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(CLE_MENU_REPLIE) === 'replie';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    onReplieChange?.(replie);
    // Averti au montage aussi : App.tsx doit connaître le choix mémorisé dès le premier rendu du contenu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replie]);

  const basculerReplie = () => {
    const v = !replie;
    setReplieEtat(v);
    try {
      window.localStorage.setItem(CLE_MENU_REPLIE, v ? 'replie' : 'ouvert');
    } catch {
      /* navigation privée ou stockage bloqué : le choix ne survit simplement pas à la session */
    }
  };

  const t = {
    FR: {
      marque: 'Xena Horizon',
      sous: 'Espace admin',
      dashboard: 'Tableau de bord',
      dossiers: 'Dossiers',
      crm: 'Clients',
      products: 'Offres',
      invoices: 'Factures',
      finance: 'Finances',
      agenda: 'Agenda',
      email: 'Courriel et messagerie',
      newsletter: 'Infolettres',
      gallery: 'Galerie',
      social: 'Studio social',
      temoignages: 'Témoignages audio',
      videos: 'Capsules',
      sections: 'Sections du site',
      vexel: 'Pour Vexel',
      backToSite: 'Retour au site',
      signOut: 'Fermer la session',
      fermer: 'Fermer le menu',
      replier: 'Replier le menu',
      deplier: 'Déplier le menu',
      nonLus: 'messages non lus',
    },
    EN: {
      marque: 'Xena Horizon',
      sous: 'Admin area',
      dashboard: 'Dashboard',
      dossiers: 'Client files',
      crm: 'Clients',
      products: 'Offers',
      invoices: 'Invoices',
      finance: 'Finances',
      agenda: 'Calendar',
      email: 'Email and messages',
      newsletter: 'Newsletters',
      gallery: 'Gallery',
      social: 'Social studio',
      temoignages: 'Audio testimonials',
      videos: 'Capsules',
      sections: 'Site sections',
      vexel: 'For Vexel',
      backToSite: 'Back to site',
      signOut: 'Sign out',
      fermer: 'Close menu',
      replier: 'Collapse menu',
      deplier: 'Expand menu',
      nonLus: 'unread messages',
    },
  }[lang];

  const menuItems: { id: ViewState; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'ADMIN_DASHBOARD', label: t.dashboard, icon: LayoutDashboard },
    { id: 'ADMIN_DOSSIERS', label: t.dossiers, icon: FolderOpen, badge: nonLusDossiers },
    { id: 'ADMIN_CRM', label: t.crm, icon: Users },
    { id: 'ADMIN_PRODUCTS', label: t.products, icon: ShoppingBag },
    { id: 'ADMIN_INVOICES', label: t.invoices, icon: FileText },
    { id: 'ADMIN_FINANCE', label: t.finance, icon: PieChart },
    { id: 'ADMIN_AGENDA', label: t.agenda, icon: Calendar },
    { id: 'ADMIN_EMAIL', label: t.email, icon: Inbox },
    { id: 'ADMIN_NEWSLETTER', label: t.newsletter, icon: Mail },
    { id: 'ADMIN_GALLERY', label: t.gallery, icon: ImageIcon },
    { id: 'ADMIN_SOCIAL', label: t.social, icon: PenTool },
    { id: 'ADMIN_TEMOIGNAGES', label: t.temoignages, icon: Mic },
    { id: 'ADMIN_VIDEOS', label: t.videos, icon: Film },
    { id: 'ADMIN_SECTIONS', label: t.sections, icon: ToggleLeft },
    { id: 'ADMIN_VEXEL', label: t.vexel, icon: ShieldCheck },
  ];

  const LIEN = 'w-full flex items-center gap-3 min-h-[44px] px-3 rounded-champ text-sm font-medium transition-colors';

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={t.fermer}
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-encre/60"
        />
      )}
      <aside
        className={`print:hidden w-64 ${replie ? 'md:w-16' : 'md:w-64'} h-screen bg-papier-2 border-r border-filet flex flex-col fixed left-0 top-0 z-50 transition-[width,transform] duration-300 md:duration-[220ms] md:ease-maison md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 pt-6 pb-5 flex items-start justify-between gap-3 border-b border-filet">
          <button type="button" onClick={() => onChangeView('HOME')} className={`text-left ${replie ? 'md:hidden' : ''}`}>
            <p className="font-serif text-[1.25rem] text-encre leading-none">{t.marque}</p>
            <p className="kicker text-gris mt-2">{t.sous}</p>
          </button>
          {replie && (
            <button
              type="button"
              onClick={() => onChangeView('HOME')}
              aria-label={t.marque}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-pilule bg-encre text-papier font-serif text-sm"
            >
              X
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t.fermer}
            className="md:hidden w-11 h-11 -mr-2 -mt-2 flex items-center justify-center text-encre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const actif = currentView === item.id;
            const Icone = item.icon;
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    onChangeView(item.id);
                    onClose?.();
                  }}
                  aria-current={actif ? 'page' : undefined}
                  aria-label={replie ? item.label : undefined}
                  className={`${LIEN} relative ${replie ? 'md:justify-center md:px-0' : ''} ${actif ? 'bg-papier text-encre' : 'text-gris hover:text-encre hover:bg-papier/60'}`}
                >
                  {actif && <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[2px] bg-rose" />}
                  <Icone className={`w-4 h-4 flex-shrink-0 ${actif ? 'text-rose' : ''}`} aria-hidden="true" />
                  <span className={`flex-1 text-left ${replie ? 'md:sr-only' : ''}`}>{item.label}</span>
                  {!!item.badge && (
                    <span
                      className={`min-w-[1.25rem] h-5 px-1.5 rounded-pilule bg-rose text-papier text-xs font-semibold items-center justify-center tabular-nums ${replie ? 'md:hidden' : 'flex'}`}
                      aria-label={`${item.badge} ${t.nonLus}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {replie && !!item.badge && (
                    <span aria-hidden="true" className="hidden md:block absolute top-1.5 right-1.5 w-2 h-2 rounded-pilule bg-rose" />
                  )}
                </button>
                {replie && (
                  <span
                    role="tooltip"
                    className="hidden md:block pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-champ bg-encre text-papier text-xs px-2.5 py-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-10"
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-filet space-y-0.5">
          <button
            type="button"
            onClick={basculerReplie}
            aria-label={replie ? t.deplier : t.replier}
            className={`hidden md:flex ${LIEN} text-gris hover:text-encre hover:bg-papier/60 ${replie ? 'justify-center px-0' : ''}`}
          >
            <ChevronLeft className={`w-4 h-4 flex-shrink-0 transition-transform duration-[220ms] ease-maison ${replie ? 'rotate-180' : ''}`} aria-hidden="true" />
            {!replie && <span>{t.replier}</span>}
          </button>
          <button type="button" onClick={() => onChangeView('HOME')} className={`${LIEN} text-gris hover:text-encre hover:bg-papier/60 ${replie ? 'md:justify-center md:px-0' : ''}`}>
            <ChevronLeft className="w-4 h-4 flex-shrink-0 md:hidden" aria-hidden="true" />
            <LogOut className={`w-4 h-4 flex-shrink-0 hidden ${replie ? 'md:hidden' : ''}`} aria-hidden="true" />
            <span className={replie ? 'md:sr-only' : ''}>{t.backToSite}</span>
          </button>
          <button type="button" onClick={onSignOut} aria-label={replie ? t.signOut : undefined} className={`${LIEN} text-rose hover:bg-rose/10 ${replie ? 'md:justify-center md:px-0' : ''}`}>
            <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span className={replie ? 'md:sr-only' : ''}>{t.signOut}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
