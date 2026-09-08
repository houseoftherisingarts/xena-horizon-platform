import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ACTION_BUTTON_CLASSES } from '../constants';
import { Language, ViewState } from '../types';
import { VIEW_PATHS } from '../lib/routes';

interface NotFoundProps {
  lang: Language;
  onChangeView: (view: ViewState) => void;
}

/**
 * Une adresse qui ne correspond à aucune vue connue tombe ici. La session principale la branche
 * dans App.tsx : quand `viewFromPath` ne reconnaît pas `window.location.pathname`, appeler
 * `cheminInconnu(window.location.pathname)` pour savoir s'il faut rendre NotFound plutôt que HOME,
 * puisque `viewFromPath` retombe elle-même sur 'HOME' pour toute adresse non reconnue.
 */
export function cheminInconnu(pathname: string): boolean {
  const prefixe = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const sansPrefixe = prefixe && pathname.startsWith(prefixe) ? pathname.slice(prefixe.length) : pathname;
  const clean = sansPrefixe.replace(/\/+$/, '') || '/';
  return !Object.values(VIEW_PATHS).includes(clean);
}

const NotFound: React.FC<NotFoundProps> = ({ lang, onChangeView }) => {
  const t = {
    FR: {
      code: '404',
      title: 'Cette page n\'existe pas',
      text: 'L\'adresse ne mène nulle part. Retournez à l\'accueil.',
      cta: 'Retour à l\'accueil',
    },
    EN: {
      code: '404',
      title: 'This page does not exist',
      text: 'This address leads nowhere. Head back to the homepage.',
      cta: 'Back to home',
    },
  }[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-iridescent font-serif text-7xl md:text-8xl font-bold mb-4">{t.code}</span>
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">{t.title}</h1>
      <p className="text-slate-400 mb-8 max-w-md">{t.text}</p>
      <button onClick={() => onChangeView('HOME')} className={ACTION_BUTTON_CLASSES}>
        <ArrowLeft className="w-4 h-4" /> {t.cta}
      </button>
    </div>
  );
};

export default NotFound;
