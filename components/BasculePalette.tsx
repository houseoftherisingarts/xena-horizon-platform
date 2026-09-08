import React from 'react';
import { Cloud, Feather } from 'lucide-react';
import Interrupteur from './Interrupteur';
import { useSkin } from '../lib/skin';
import type { Language } from '../types';

/**
 * L'interrupteur des deux palettes, dans le style du ThemeToggle de 21st.dev : « Ciel » (blanc,
 * noir et bleu ciel du logo, un nuage dans le bouton) à gauche, « Encre » (papier, encre, rose du
 * livre, une plume) à droite. Espace ou Entrée le bascule, l'état se lit au lecteur d'écran.
 */
const BasculePalette: React.FC<{ lang: Language; className?: string }> = ({ lang, className = '' }) => {
  const [skin, poserSkin] = useSkin();
  const encre = skin === 'encre';
  const libelle = lang === 'FR' ? 'Palette du site : bleu ciel, ou encre et rose' : 'Site palette: sky blue, or ink and pink';

  return (
    <Interrupteur
      droite={encre}
      onBascule={() => poserSkin(encre ? 'ciel' : 'encre')}
      libelle={libelle}
      className={className}
      classePilule={encre ? 'border-encre bg-encre' : 'border-filet bg-papier group-hover:border-encre'}
      classeBouton={encre ? 'bg-papier' : 'bg-bouton'}
      gaucheActif={<Cloud className="h-4 w-4 text-sur-bouton" strokeWidth={1.5} />}
      gaucheInactif={<Cloud className="h-4 w-4 text-papier/60" strokeWidth={1.5} />}
      droiteActif={<Feather className="h-4 w-4 text-encre" strokeWidth={1.5} />}
      droiteInactif={<Feather className="h-4 w-4 text-gris" strokeWidth={1.5} />}
    />
  );
};

export default BasculePalette;
