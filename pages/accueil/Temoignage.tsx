// Temoignage : l'extrait d'Alexis Sénécal en display, révélé mot par mot, décalé d'une
// colonne pour casser l'alignement. Le texte intégral en dessous, le nom et le rôle en marge.

import React from 'react';
import { Feuille, Reveal, TexteRevele } from '../../components/motion';
import { TEMOIGNAGES } from '../../lib/contenu';
import { useTextes } from '../../lib/textes';
import Clients from './Clients';
import type { Language } from '../../types';

export interface TemoignageProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    extrait: 'créer une ligne directrice claire et précise',
    texte: TEMOIGNAGES[0]?.texteFR ?? '',
    nom: TEMOIGNAGES[0]?.nom ?? '',
    role: TEMOIGNAGES[0]?.role ?? '',
  },
  EN: {
    extrait: 'to create a clear and precise guideline',
    texte: TEMOIGNAGES[0]?.texteEN ?? '',
    nom: TEMOIGNAGES[0]?.nom ?? '',
    role: TEMOIGNAGES[0]?.role ?? '',
  },
};

const Temoignage: React.FC<TemoignageProps> = ({ lang }) => {
  const t = useTextes('accueilTemoignage', TEXTES, lang);
  const temoignage = TEMOIGNAGES[0];
  if (!temoignage) return null;

  const extrait = lang === 'FR' ? `« ${t.extrait} »` : `“${t.extrait}”`;

  return (
    <Feuille z={3} className="bg-papier" data-tx-scope="accueilTemoignage">
      <div className="grid grid-cols-12 gap-x-col gap-y-10 px-gut pt-feuille">
        <div className="col-span-12 sm:col-span-9 sm:col-start-2">
          <TexteRevele texte={extrait} as="p" par="mot" className="text-h3 font-serif text-encre sm:text-display" />
        </div>

        <Reveal as="div" className="col-span-12 sm:col-span-6 sm:col-start-2">
          <p className="max-w-mesure text-corps text-encre/85">{t.texte}</p>
        </Reveal>

        <Reveal as="div" delay={0.1} className="col-span-12 sm:col-span-3 sm:col-start-10">
          <p className="font-sans text-lede font-semibold text-encre">{t.nom}</p>
          <p className="mt-1 text-petit text-gris">{t.role}</p>
        </Reveal>
      </div>

      <Clients lang={lang} />
    </Feuille>
  );
};

export default Temoignage;
