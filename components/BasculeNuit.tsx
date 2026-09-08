import React from 'react';
import { Moon, Sun } from 'lucide-react';
import Interrupteur from './Interrupteur';
import { useNuit } from '../lib/skin';
import type { Language } from '../types';

/**
 * L'interrupteur jour / nuit, même pilule que la palette et la langue (ThemeToggle de 21st.dev) :
 * un soleil à gauche, une lune à droite. La nuit renverse papier et encre en gardant l'accent de la
 * palette choisie (lib/skin.ts, index.css).
 */
const BasculeNuit: React.FC<{ lang: Language; className?: string }> = ({ lang, className = '' }) => {
  const [nuit, poserNuit] = useNuit();
  const libelle = lang === 'FR' ? 'Mode du site : jour ou nuit' : 'Site mode: day or night';

  return (
    <Interrupteur
      droite={nuit}
      onBascule={() => poserNuit(!nuit)}
      libelle={libelle}
      className={className}
      classePilule={nuit ? 'border-encre bg-encre' : 'border-filet bg-papier group-hover:border-encre'}
      classeBouton={nuit ? 'bg-papier' : 'bg-bouton'}
      gaucheActif={<Sun className="h-4 w-4 text-sur-bouton" strokeWidth={1.5} />}
      gaucheInactif={<Sun className="h-4 w-4 text-papier/60" strokeWidth={1.5} />}
      droiteActif={<Moon className="h-4 w-4 text-encre" strokeWidth={1.5} />}
      droiteInactif={<Moon className="h-4 w-4 text-gris" strokeWidth={1.5} />}
    />
  );
};

export default BasculeNuit;
