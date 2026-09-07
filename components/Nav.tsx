import React from 'react';
import { Menu, X, Lock, ArrowRight, Globe, User } from 'lucide-react';
import { ViewState, Language } from '../types';

interface NavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onRequestAdmin: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Nav: React.FC<NavProps> = ({ currentView, onChangeView, onRequestAdmin, lang, setLang }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const t = {
    FR: {
      home: 'Accueil',
      services: 'Services',
      projets: 'Projets',
      about: 'À propos',
      contact: 'Contact',
      admin: 'Espace Admin',
      talk: 'Me parler',
      mySpace: 'Mon espace',
      byline: 'par Laurie Belhumeur',
    },
    EN: {
      home: 'Home',
      services: 'Services',
      projets: 'Projects',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin Area',
      talk: 'Let\'s Talk',
      mySpace: 'My Space',
      byline: 'by Laurie Belhumeur',
    }
  }[lang];

  const navLinks = [
    { label: t.home, view: 'HOME' as ViewState },
    { label: t.services, view: 'SERVICES' as ViewState },
    { label: t.projets, view: 'PROJETS' as ViewState },
    { label: t.about, sectionId: 'about' },
    { label: t.contact, sectionId: 'contact' },
  ];

  const handleNavClick = (view: ViewState, sectionId?: string) => {
    if (view && view !== currentView) {
      onChangeView(view);
    }
    
    if (sectionId) {
      if (currentView !== 'HOME') {
        onChangeView('HOME');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsOpen(false);
  };

  const toggleLang = () => {
    setLang(lang === 'FR' ? 'EN' : 'FR');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-6 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center justify-between shadow-2xl">
          
          {/* Logo & Lang */}
          <div className="flex items-center gap-6">
            <div
              className="cursor-pointer flex items-center gap-3"
              onClick={() => onChangeView('HOME')}
            >
              <span className="text-iridescent text-2xl leading-none">✦</span>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-serif font-bold tracking-wider text-white">XENA HORIZON</span>
                <span className="hidden md:block text-[11px] tracking-widest uppercase text-slate-400">
                  {t.byline}
                </span>
              </div>
            </div>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold tracking-wider text-slate-300"
            >
              <span className={lang === 'FR' ? 'text-white' : 'text-slate-500'}>FR</span>
              <span className="text-slate-600">/</span>
              <span className={lang === 'EN' ? 'text-white' : 'text-slate-500'}>EN</span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view || 'HOME', link.sectionId)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${currentView === link.view && !link.sectionId ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onRequestAdmin}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={t.admin}
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if(currentView !== 'HOME') onChangeView('HOME');
                setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 100);
              }}
              className="px-6 py-2.5 rounded-full bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift hover:bg-[length:300%_300%] text-white text-sm font-medium transition-all shadow-iridescent-sm hover:shadow-iridescent flex items-center gap-2"
            >
              {t.talk} <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-24 left-6 right-6 p-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl flex flex-col gap-4 md:hidden">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view || 'HOME', link.sectionId)}
                className="text-left text-lg font-medium text-slate-200 hover:text-white py-3 border-b border-white/5 last:border-0"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 flex items-center justify-between">
               <button
                  onClick={() => { onRequestAdmin(); setIsOpen(false); }}
                  className="text-sm text-slate-400 flex items-center gap-2"
                >
                  <Lock className="w-3 h-3" /> {t.admin}
                </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;