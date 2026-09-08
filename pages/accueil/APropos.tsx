// APropos — brève histoire d'un tout. Photo à gauche au format 2:3, texte à droite,
// les trois statistiques empilées sous la photo. Le « 15 » compte de 0 à 15 à l'entrée,
// seul compteur du site.

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Feuille, Parallax, Reveal, TexteRevele } from '../../components/motion';
import { A_PROPOS_ACCUEIL } from './textes';
import type { HomeStatsBlock, Language, ViewState } from '../../types';

export interface AProposProps {
  lang: Language;
  stats?: HomeStatsBlock;
  onChangeView?: (v: ViewState) => void;
}

const t = {
  FR: { lire: "Lire son histoire" },
  EN: { lire: 'Read her story' },
};

const Compteur: React.FC<{ valeur: number; className?: string }> = ({ valeur, className }) => {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  const joue = useRef(false);

  const demarrer = () => {
    if (joue.current) return;
    joue.current = true;
    if (reduce) {
      setN(valeur);
      return;
    }
    const debut = performance.now();
    const duree = 900;
    const pas = (temps: number) => {
      const p = Math.min(1, (temps - debut) / duree);
      setN(Math.round(valeur * p));
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };

  return (
    <motion.span
      onViewportEnter={demarrer}
      viewport={{ once: true, amount: 0.6 }}
      className={className}
    >
      {n}
    </motion.span>
  );
};

const APropos: React.FC<AProposProps> = ({ lang, stats, onChangeView }) => {
  const L = t[lang];
  const titre = A_PROPOS_ACCUEIL.titre[lang];
  const paragraphes = A_PROPOS_ACCUEIL.paragraphes[lang];
  const mission = A_PROPOS_ACCUEIL.mission[lang];

  const chiffre1 = stats ? Number.parseInt(stats.stat1Value, 10) || 15 : 15;
  const unite1FR = stats?.stat1Value.replace(/^\d+\s*/, '') || 'ans';
  const unite1 = lang === 'FR' ? unite1FR : 'years';
  const label1 = lang === 'FR' ? stats?.stat1Label ?? "D'expérience" : 'Of experience';
  const val2 = stats?.stat2Value ?? 'Toutes disciplines';
  const label2 = stats?.stat2Label ?? '';
  const val3 = stats?.stat3Value ?? 'Montréal · Montérégie · Estrie';
  const label3 = stats?.stat3Label ?? '';

  const kicker1 = lang === 'FR' ? `${unite1} d'expérience` : `${unite1} of experience`;

  return (
    <Feuille z={2} className="bg-papier-2">
      <div className="grid grid-cols-12 gap-x-col gap-y-10 px-gut py-feuille">
        <div className="col-span-12 sm:col-span-5">
          <Parallax speed={0.14}>
            <img
              src="/images/laurie-apropos.jpg"
              alt="Laurie Belhumeur, assise, en studio"
              loading="lazy"
              decoding="async"
              className="aspect-[2/3] w-full object-cover"
            />
          </Parallax>

          <div className="mt-10 flex flex-col gap-8">
            <div>
              <p className="text-chiffre font-serif leading-none text-encre">
                <Compteur valeur={chiffre1} />
              </p>
              <p className="kicker mt-2 text-gris">{kicker1}</p>
            </div>
            <div>
              <p className="text-h3 font-serif text-encre">{val2}</p>
              <p className="kicker mt-2 text-gris">{label2}</p>
            </div>
            <div>
              <p className="text-h3 font-serif text-encre">{val3}</p>
              <p className="kicker mt-2 text-gris">{label3}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex flex-col sm:col-span-6 sm:col-start-7">
          <Reveal as="h2" className="whitespace-pre-line text-h2 font-serif text-encre">
            {titre}
          </Reveal>
          <div className="mt-8 flex flex-col gap-5">
            {paragraphes.map((p, i) => (
              <Reveal key={i} as="p" delay={i * 0.08} className="max-w-mesure text-corps text-encre/85">
                {p}
              </Reveal>
            ))}
          </div>
          <TexteRevele texte={mission} as="p" par="mot" className="mt-8 max-w-mesure text-display font-serif text-rose" />

          <div className="mt-auto pt-10 text-right">
            <a
              href="/a-propos"
              onClick={(e) => {
                if (onChangeView) {
                  e.preventDefault();
                  onChangeView('A_PROPOS');
                }
              }}
              className="inline-flex items-center gap-2 text-petit font-semibold text-encre transition-colors duration-200 hover:text-rose"
            >
              {L.lire}
            </a>
          </div>
        </div>
      </div>
    </Feuille>
  );
};

export default APropos;
