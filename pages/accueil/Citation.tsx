// Citation — révélée par un masque radial pendant que la feuille monte, puis les mots
// se posent. Le filet rose se trace sous la citation.

import React from 'react';
import { motion } from 'framer-motion';
import { Feuille, MasqueRadial, Reveal, TexteRevele } from '../../components/motion';
import { CITATION } from '../../lib/contenu';
import type { Language } from '../../types';

export interface CitationProps {
  lang: Language;
}

const Citation: React.FC<CitationProps> = ({ lang }) => {
  const texte = lang === 'FR' ? CITATION.texteFR : CITATION.texteEN;
  const source = lang === 'FR' ? CITATION.source : CITATION.sourceEN;

  return (
    <Feuille z={5} className="bg-papier">
      <div className="px-gut py-feuille">
        {/* arrivee dépasse largement 100 : un masque radial "closest-side" ne touche jamais
            les coins d'un bloc plus large que haut avant ~141 % (√2 × 100). Sous 141, les
            premiers et derniers mots d'un bloc de citation restent illisibles en permanence. */}
        <MasqueRadial arrivee={170} className="col-span-12 block sm:col-span-11">
          <TexteRevele
            texte={`« ${texte} »`}
            as="p"
            par="mot"
            className="max-w-[26ch] text-display font-serif text-encre sm:max-w-[38ch]"
          />
        </MasqueRadial>

        <motion.span
          aria-hidden
          className="mt-8 block h-[2px] w-40 origin-left bg-rose sm:mt-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 0.8, 0.24, 1] }}
        />

        <Reveal as="p" delay={0.1} className="kicker mt-6 max-w-mesure text-gris">
          {source}
        </Reveal>
      </div>
    </Feuille>
  );
};

export default Citation;
