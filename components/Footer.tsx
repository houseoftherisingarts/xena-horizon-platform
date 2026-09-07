import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Language, ViewState } from '../types';
import { COORDONNEES, CREDITS } from '../lib/contenu';

interface FooterProps {
  onAdminLogin: () => void;
  lang: Language;
  onChangeView?: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminLogin, lang, onChangeView }) => {
  const t = {
    FR: {
      tagline: 'Consultante en carrière artistique et en communication.',
      nav: 'Naviguer',
      home: 'Accueil',
      services: 'Services',
      projets: 'Projets',
      about: 'À propos',
      contact: 'Contact',
      mySpace: 'Mon espace',
      credits: 'Crédit photo',
      rights: 'Tous droits réservés.',
      platform: 'Plateforme par Vexel Webstudio',
    },
    EN: {
      tagline: 'Artistic career and communication consultant.',
      nav: 'Navigate',
      home: 'Home',
      services: 'Services',
      projets: 'Projects',
      about: 'About',
      contact: 'Contact',
      mySpace: 'My Space',
      credits: 'Photo credit',
      rights: 'All rights reserved.',
      platform: 'Platform by Vexel Webstudio',
    },
  }[lang];

  const goTo = (view: ViewState, sectionId?: string) => {
    if (onChangeView) {
      onChangeView(view);
      if (sectionId) {
        setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  };

  const navLinks: { label: string; view: ViewState; sectionId?: string; href: string }[] = [
    { label: t.home, view: 'HOME', href: '/' },
    { label: t.services, view: 'SERVICES', href: '/services' },
    { label: t.projets, view: 'PROJETS', href: '/projets' },
    { label: t.about, view: 'HOME', sectionId: 'about', href: '/#about' },
    { label: t.contact, view: 'HOME', sectionId: 'contact', href: '/#contact' },
  ];

  return (
    <footer className="w-full py-14 mt-20 border-t border-white/5 bg-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-2">
            <span className="text-iridescent">Xena Horizon</span>
          </h3>
          <p className="text-slate-400 text-sm mb-6">{t.tagline}</p>
          <div className="space-y-2 text-sm">
            <a href={COORDONNEES.telephoneHref} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <Phone className="w-4 h-4" /> {COORDONNEES.telephone}
            </a>
            <a href={`mailto:${COORDONNEES.courriel}`} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> {COORDONNEES.courriel}
            </a>
            <p className="text-slate-500">{COORDONNEES.zones}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.nav}</p>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onChangeView ? (e) => { e.preventDefault(); goTo(link.view, link.sectionId); } : undefined}
                className="text-slate-300 hover:text-white transition-colors text-sm min-h-[32px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/espace"
              onClick={onChangeView ? (e) => { e.preventDefault(); goTo('ESPACE_CLIENT'); } : undefined}
              className="text-cyan-300 hover:text-cyan-200 transition-colors text-sm font-medium min-h-[32px] flex items-center"
            >
              {t.mySpace}
            </a>
          </nav>
        </div>

        <div className="md:text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.credits}</p>
          <p className="text-slate-400 text-sm mb-6">{CREDITS.photographes.join(' · ')}</p>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Laurie Belhumeur · Xena Horizon. {t.rights}
          </p>
          <div className="flex md:justify-end items-center gap-4 mt-3">
            <button onClick={onAdminLogin} className="text-xs text-slate-700 hover:text-slate-500 transition-colors">
              Admin
            </button>
            <span className="text-xs text-slate-600">{t.platform}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
