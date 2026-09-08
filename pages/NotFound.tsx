import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language, ViewState } from '../types';
import { VIEW_PATHS } from '../lib/routes';
import { Reveal } from '../components/motion';

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
      title: "Cette page n'existe pas",
      text: "Laurie n'a rien écrit à cette adresse. Retourne à l'accueil, ou continue vers ses services.",
      cta: "Retour à l'accueil",
      services: 'Voir les services',
    },
    EN: {
      code: '404',
      title: 'This page does not exist',
      text: 'Laurie has written nothing at this address. Head back home, or carry on to her services.',
      cta: 'Back to home',
      services: 'See the services',
    },
  }[lang];

  return (
    <div className="min-h-[100svh] bg-papier relative px-gut">
      <span aria-hidden="true" className="absolute top-28 right-gut font-serif text-chiffre text-encre leading-none">
        {t.code}
      </span>
      <div className="absolute bottom-[clamp(4rem,10vh,8rem)] left-gut right-gut sm:right-auto sm:max-w-mesure">
        <Reveal as="h1" className="font-serif text-h2 text-encre mb-4">
          {t.title}
        </Reveal>
        <Reveal delay={0.1} as="p" className="text-lede text-gris mb-8 mesure">
          {t.text}
        </Reveal>
        <Reveal delay={0.2} className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onChangeView('HOME')}
            className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-pilule bg-encre text-papier text-sm font-medium hover:bg-encre-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t.cta}
          </button>
          <button
            type="button"
            onClick={() => onChangeView('SERVICES')}
            className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-encre transition-colors"
          >
            {t.services}
          </button>
        </Reveal>
      </div>
    </div>
  );
};

export default NotFound;
