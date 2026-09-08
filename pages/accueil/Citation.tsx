// Citation : composition asymétrique. La citation (colonnes 1 à 8) porte un filet
// rose à gauche qui se trace pendant que les mots se posent ; l'attribution, en
// kicker, tient les colonnes 9 à 12.

import React from 'react';
import { motion } from 'framer-motion';
import { Feuille, Reveal, TexteRevele } from '../../components/motion';
import { CITATION } from '../../lib/contenu';
import { useTextes } from '../../lib/textes';
import type { Language } from '../../types';

export interface CitationProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    texte: CITATION.texteFR,
    source: CITATION.source,
  },
  EN: {
    texte: CITATION.texteEN,
    source: CITATION.sourceEN,
  },
};

const Citation: React.FC<CitationProps> = ({ lang }) => {
  const t = useTextes('accueilCitation', TEXTES, lang);

  return (
    <Feuille z={6} className="bg-papier">
      <div data-tx-scope="accueilCitation" className="grid grid-cols-12 gap-x-col gap-y-8 px-gut py-feuille">
        <div className="col-span-12 flex gap-5 sm:col-span-8 sm:col-start-1">
          <motion.span
            aria-hidden
            className="mt-1 w-[2px] shrink-0 origin-top bg-rose"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 0.8, 0.24, 1] }}
          />
          <TexteRevele
            texte={`« ${t.texte} »`}
            as="p"
            par="mot"
            className="max-w-[28ch] text-h3 font-serif text-encre"
          />
        </div>

        <Reveal as="p" delay={0.1} className="kicker col-span-12 text-gris sm:col-span-4 sm:col-start-9">
          {t.source}
        </Reveal>
      </div>
    </Feuille>
  );
};

export default Citation;
