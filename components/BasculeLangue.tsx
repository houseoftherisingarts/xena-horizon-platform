import React from 'react';
import Interrupteur from './Interrupteur';
import type { Language } from '../types';

/** FR à gauche, EN à droite : le même interrupteur que la palette, avec les lettres dans le bouton. */
const BasculeLangue: React.FC<{ lang: Language; setLang: (lang: Language) => void; className?: string }> = ({
  lang,
  setLang,
  className = '',
}) => {
  const en = lang === 'EN';
  const lettres = 'font-sans text-[10px] font-semibold tracking-wide leading-none';
  return (
    <Interrupteur
      droite={en}
      onBascule={() => setLang(en ? 'FR' : 'EN')}
      libelle={en ? 'Language: English. Switch to French' : 'Langue : français. Passer à l’anglais'}
      className={className}
      classePilule="border-filet bg-papier group-hover:border-encre"
      classeBouton="bg-encre"
      gaucheActif={<span className={`${lettres} text-papier`}>FR</span>}
      gaucheInactif={<span className={`${lettres} text-gris`}>FR</span>}
      droiteActif={<span className={`${lettres} text-papier`}>EN</span>}
      droiteInactif={<span className={`${lettres} text-gris`}>EN</span>}
    />
  );
};

export default BasculeLangue;
