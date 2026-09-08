// Clients, le colophon : les noms de ceux qui lui ont fait confiance se fondent l'un dans
// l'autre (TexteGluant, porté du GooeyText de 21st.dev), en grand et en serif, avec la liste
// complète juste dessous pour la lecture et les moteurs. Sans contenant Feuille propre : ce
// composant se rend au pied de Temoignage, dans la même feuille (canon du storyboard).
// En reduced motion, la liste seule.

import React from 'react';
import { useReducedMotion } from '@/lib/motion';
import { CLIENTS_CONFIANCE } from '../../lib/contenu';
import { CLIENTS_TITRE } from './textes';
import { useTextes } from '../../lib/textes';
import { TexteGluant } from '../../components/motion';
import type { Language } from '../../types';

export interface ClientsProps {
  lang: Language;
}

const TEXTES = {
  FR: { titre: CLIENTS_TITRE.FR },
  EN: { titre: CLIENTS_TITRE.EN },
};

const Clients: React.FC<ClientsProps> = ({ lang }) => {
  const reduce = useReducedMotion();
  const t = useTextes('accueilCitation', TEXTES, lang);

  return (
    <div data-tx-scope="accueilCitation" className="mt-16 border-t border-filet px-gut pb-feuille pt-10 sm:mt-20">
      <p className="kicker text-gris">{t.titre}</p>

      {!reduce && (
        <div className="mt-6">
          <TexteGluant
            textes={CLIENTS_CONFIANCE}
            dureeMorph={1}
            pause={1.4}
            className="block w-full"
            classeTexte="font-serif text-encre text-[clamp(1.75rem,5vw,4.5rem)] leading-[1.08] tracking-tight break-words"
          />
        </div>
      )}

      <ul className={`flex flex-wrap gap-x-10 gap-y-3 ${reduce ? 'mt-6' : 'mt-8'}`}>
        {CLIENTS_CONFIANCE.map((nom) => (
          <li key={nom} className={`font-serif ${reduce ? 'text-h3 text-encre/70' : 'text-corps text-gris'}`}>
            {nom}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
