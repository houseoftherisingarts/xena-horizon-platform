// Clients — le colophon : une seule bande défilante (le seul marquee de la page),
// dupliquée pour la boucle, en pause au survol. Sans contenant Feuille propre : ce
// composant se rend au pied de Temoignage, dans la même feuille (canon du storyboard).

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { CLIENTS_CONFIANCE } from '../../lib/contenu';
import { CLIENTS_TITRE } from './textes';
import type { Language } from '../../types';

export interface ClientsProps {
  lang: Language;
}

const Clients: React.FC<ClientsProps> = ({ lang }) => {
  const reduce = useReducedMotion();

  return (
    <div className="mt-16 border-t border-filet pb-feuille pt-10 sm:mt-20">
      <p className="kicker px-gut text-gris">{CLIENTS_TITRE[lang]}</p>

      {reduce ? (
        <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-3 px-gut">
          {CLIENTS_CONFIANCE.map((nom) => (
            <li key={nom} className="font-serif text-h3 text-encre/70">
              {nom}
            </li>
          ))}
        </ul>
      ) : (
        <div className="group mt-6 overflow-hidden">
          <div className="flex w-max items-center animate-defile group-hover:[animation-play-state:paused]">
            {[0, 1].map((copie) => (
              <ul
                key={copie}
                aria-hidden={copie === 1}
                className="flex items-center gap-16 pr-16"
              >
                {CLIENTS_CONFIANCE.map((nom, i) => (
                  <li key={`${copie}-${nom}`} className="flex items-center gap-16">
                    <span className="whitespace-nowrap font-serif text-h3 text-encre/70">{nom}</span>
                    {i < CLIENTS_CONFIANCE.length - 1 && <span className="h-6 w-px bg-filet" aria-hidden />}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
