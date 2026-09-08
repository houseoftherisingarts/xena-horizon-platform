// Temoignage — l'extrait d'Alexis Sénécal en display, révélé mot par mot, décalé d'une
// colonne pour casser l'alignement. Le texte intégral en dessous, le nom et le rôle en marge.

import React from 'react';
import { Feuille, Reveal, TexteRevele } from '../../components/motion';
import { TEMOIGNAGES } from '../../lib/contenu';
import Clients from './Clients';
import type { Language } from '../../types';

export interface TemoignageProps {
  lang: Language;
}

const EXTRAITS: Record<Language, string> = {
  FR: 'créer une ligne directrice claire et précise par rapport au futur de ma compagnie',
  EN: 'to create a clear and precise guideline for the future of my company',
};

const Temoignage: React.FC<TemoignageProps> = ({ lang }) => {
  const temoignage = TEMOIGNAGES[0];
  if (!temoignage) return null;

  const texte = lang === 'FR' ? temoignage.texteFR : temoignage.texteEN;
  const extrait = lang === 'FR' ? `« ${EXTRAITS.FR} »` : `“${EXTRAITS.EN}”`;

  return (
    <Feuille z={3} className="bg-papier">
      <div className="grid grid-cols-12 gap-x-col gap-y-10 px-gut py-feuille">
        <div className="col-span-12 sm:col-span-9 sm:col-start-2">
          <TexteRevele texte={extrait} as="p" par="mot" className="text-display font-serif text-encre" />
        </div>

        <Reveal as="div" className="col-span-12 sm:col-span-6 sm:col-start-2">
          <p className="max-w-mesure text-corps text-encre/85">{texte}</p>
        </Reveal>

        <Reveal as="div" delay={0.1} className="col-span-12 sm:col-span-3 sm:col-start-10">
          <p className="font-sans text-lede font-semibold text-encre">{temoignage.nom}</p>
          <p className="mt-1 text-petit text-gris">{temoignage.role}</p>
        </Reveal>
      </div>

      <Clients lang={lang} />
    </Feuille>
  );
};

export default Temoignage;
