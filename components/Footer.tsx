import React from 'react';
import { Language } from '../types';

interface FooterProps {
  onAdminLogin: () => void;
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ onAdminLogin, lang }) => {
  const t = {
    FR: {
      tagline: 'Consultante Stratégique pour le milieu culturel.',
      rights: 'Tous droits réservés.',
      platform: 'Plateforme par Vexel Webstudio'
    },
    EN: {
      tagline: 'Strategic Consultant for the cultural sector.',
      rights: 'All rights reserved.',
      platform: 'Platform by Vexel Webstudio'
    }
  }[lang];

  return (
    <footer className="w-full py-10 mt-20 border-t border-white/5 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <h3 className="text-xl font-serif font-bold text-white mb-2">
            <span className="text-iridescent">Xena Horizon</span>
          </h3>
          <p className="text-slate-400 text-sm">{t.tagline}</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Xena Horizon. {t.rights}
          </p>
          <div className="flex items-center gap-4">
             <button 
              onClick={onAdminLogin}
              className="text-xs text-slate-700 hover:text-slate-500 transition-colors"
            >
              Admin
            </button>
            <span className="text-xs text-slate-600">
              {t.platform}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;