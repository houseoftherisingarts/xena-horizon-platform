import React from 'react';
import {
  Calendar,
  ChevronLeft,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  PenTool,
  PencilLine,
  PieChart,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { Dossier, ViewState, Language } from '../types';
import { useCollection } from '../lib/firestore';
import { useTextesCtx } from '../lib/textes';

interface AdminSidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut: () => void;
  lang: Language;
  /** Sur téléphone, la barre devient un tiroir : ouvert ou fermé. */
  open?: boolean;
  onClose?: () => void;
}

/** La barre du back-office v2 : papier-2, encre, un filet rose sur l'entrée active. */
const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onSignOut, lang, open = false, onClose }) => {
  const { data: dossiers } = useCollection<Dossier>('dossiers');
  const nonLusDossiers = dossiers.reduce((n, d) => n + (d.nonLusAdmin || 0), 0);
  const textes = useTextesCtx();

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
      textes: 'Textes du site',
      backToSite: 'Retour au site',
      signOut: 'Fermer la session',
      fermer: 'Fermer le menu',
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
      textes: 'Site texts',
      backToSite: 'Back to site',
      signOut: 'Sign out',
      fermer: 'Close menu',
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
  ];

  const modifierTextes = () => {
    onChangeView('HOME');
    textes?.basculerEdition(true);
    onClose?.();
  };

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
        className={`print:hidden w-64 h-screen bg-papier-2 border-r border-filet flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 pt-6 pb-5 flex items-start justify-between gap-3 border-b border-filet">
          <button type="button" onClick={() => onChangeView('HOME')} className="text-left">
            <p className="font-serif text-[1.25rem] text-encre leading-none">{t.marque}</p>
            <p className="kicker text-gris mt-2">{t.sous}</p>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.fermer}
            className="md:hidden w-11 h-11 -mr-2 -mt-2 flex items-center justify-center text-encre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const actif = currentView === item.id;
            const Icone = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChangeView(item.id);
                  onClose?.();
                }}
                aria-current={actif ? 'page' : undefined}
                className={`${LIEN} relative ${actif ? 'bg-papier text-encre' : 'text-gris hover:text-encre hover:bg-papier/60'}`}
              >
                {actif && <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[2px] bg-rose" />}
                <Icone className={`w-4 h-4 ${actif ? 'text-rose' : ''}`} aria-hidden="true" />
                <span className="flex-1 text-left">{item.label}</span>
                {!!item.badge && (
                  <span
                    className="min-w-[1.25rem] h-5 px-1.5 rounded-pilule bg-rose text-papier text-xs font-semibold flex items-center justify-center tabular-nums"
                    aria-label={`${item.badge} ${t.nonLus}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <button type="button" onClick={modifierTextes} className={`${LIEN} text-gris hover:text-encre hover:bg-papier/60 mt-3`}>
            <PencilLine className="w-4 h-4" aria-hidden="true" />
            <span className="flex-1 text-left">{t.textes}</span>
          </button>
        </nav>

        <div className="p-3 border-t border-filet space-y-0.5">
          <button type="button" onClick={() => onChangeView('HOME')} className={`${LIEN} text-gris hover:text-encre hover:bg-papier/60`}>
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.backToSite}</span>
          </button>
          <button type="button" onClick={onSignOut} className={`${LIEN} text-rose hover:bg-rose/10`}>
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>{t.signOut}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
