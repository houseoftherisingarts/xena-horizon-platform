import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  PenTool,
  LogOut,
  Settings,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  PieChart,
  LayoutTemplate,
  Mail,
  Globe,
  Calendar,
  MessageCircle,
  Inbox,
  FolderOpen
} from 'lucide-react';
import { Dossier, ViewState, Language } from '../types';
import { useCollection } from '../lib/firestore';

interface AdminSidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut: () => void;
  lang: Language;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onSignOut, lang }) => {
  
  const t = {
    FR: {
      dashboard: 'Tableau de bord',
      agenda: 'Agenda',
      email: 'Courriels',
      messenger: 'Messagerie',
      website: 'Éditeur Site Web',
      crm: 'Clients (CRM)',
      invoices: 'Facturation',
      finance: 'Finance & Compta',
      products: 'Offres & Produits',
      landing: 'Pages de Vente',
      newsletter: 'Infolettres',
      gallery: 'Galerie',
      social: 'Studio Social',
      settings: 'Paramètres',
      backToSite: 'Retour au site',
      signOut: 'Déconnexion'
    },
    EN: {
      dashboard: 'Dashboard',
      agenda: 'Calendar',
      email: 'Emails',
      messenger: 'Messenger',
      website: 'Website Editor',
      crm: 'Clients (CRM)',
      invoices: 'Invoicing',
      finance: 'Finance & Acc.',
      products: 'Offers & Products',
      landing: 'Landing Pages',
      newsletter: 'Newsletters',
      gallery: 'Gallery',
      social: 'Social Studio',
      settings: 'Settings',
      backToSite: 'Back to site',
      signOut: 'Sign out'
    }
  }[lang];

  const menuItems = [
    { id: 'ADMIN_DASHBOARD', label: t.dashboard, icon: LayoutDashboard },
    { id: 'ADMIN_AGENDA', label: t.agenda, icon: Calendar },
    { id: 'ADMIN_EMAIL', label: t.email, icon: Inbox },
    { id: 'ADMIN_MESSENGER', label: t.messenger, icon: MessageCircle },
    { id: 'ADMIN_WEBSITE', label: t.website, icon: Globe },
    { id: 'ADMIN_CRM', label: t.crm, icon: Users },
    { id: 'ADMIN_INVOICES', label: t.invoices, icon: FileText },
    { id: 'ADMIN_FINANCE', label: t.finance, icon: PieChart },
    { id: 'ADMIN_PRODUCTS', label: t.products, icon: ShoppingBag },
    { id: 'ADMIN_LANDING', label: t.landing, icon: LayoutTemplate },
    { id: 'ADMIN_NEWSLETTER', label: t.newsletter, icon: Mail },
    { id: 'ADMIN_GALLERY', label: t.gallery, icon: ImageIcon },
    { id: 'ADMIN_SOCIAL', label: t.social, icon: PenTool },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift flex items-center justify-center shadow-iridescent-sm">
           <span className="text-sm font-sans font-bold text-white">XH</span>
        </div>
        <div>
          <h2 className="text-white font-serif font-bold tracking-wide">Espace Xena</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Admin</p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[12px] transition-all duration-200 group ${
                isActive
                  ? 'bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift text-white shadow-iridescent-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white/90" />}
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 space-y-2 bg-slate-900">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-[12px] transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">{t.settings}</span>
        </button>
        <button
          onClick={() => onChangeView('HOME')}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-[12px] transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span className="text-sm font-medium">{t.backToSite}</span>
        </button>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-[12px] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">{t.signOut}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;