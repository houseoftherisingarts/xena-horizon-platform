import React from 'react';
import { useSkin } from '../lib/skin';
import type { Language } from '../types';

/**
 * L'interrupteur des deux palettes, posé dans la barre de navigation le temps que Laurie choisisse :
 * « Encre » (papier, encre, rose du livre) ou « Ciel » (blanc, noir et bleu ciel de son logo).
 * Un vrai `role="switch"` : Espace ou Entrée le bascule, l'état se lit au lecteur d'écran.
 */
const BasculePalette: React.FC<{ lang: Language; className?: string }> = ({ lang, className = '' }) => {
  const [skin, poserSkin] = useSkin();
  const ciel = skin === 'ciel';
  const libelle = lang === 'FR' ? 'Palette du site : bleu ciel, ou encre et rose' : 'Site palette: sky blue, or ink and pink';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!ciel}
      aria-label={libelle}
      title={libelle}
      onClick={() => poserSkin(ciel ? 'encre' : 'ciel')}
      className={`group flex items-center gap-2 min-h-[44px] px-1 text-encre ${className}`}
    >
      <span className={`kicker transition-opacity ${ciel ? 'opacity-100' : 'opacity-45'}`}>
        {lang === 'FR' ? 'Ciel' : 'Sky'}
      </span>
      <span
        aria-hidden="true"
        className="relative h-[22px] w-[40px] rounded-pilule border border-filet bg-papier-2 transition-colors group-hover:border-encre"
      >
        <span
          className="absolute top-[3px] left-[3px] h-[14px] w-[14px] rounded-pilule bg-rose transition-transform duration-panneau ease-expo"
          style={{ transform: ciel ? 'translateX(0)' : 'translateX(18px)' }}
        />
      </span>
      <span className={`kicker transition-opacity ${ciel ? 'opacity-45' : 'opacity-100'}`}>
        {lang === 'FR' ? 'Encre' : 'Ink'}
      </span>
    </button>
  );
};

export default BasculePalette;
