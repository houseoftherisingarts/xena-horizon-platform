// APropos : brève histoire d'un tout. Photo à gauche au format 2:3, texte à droite,
// les trois statistiques empilées sous la photo. Le « 15 » compte de 0 à 15 à l'entrée,
// seul compteur du site.

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Feuille, Parallax, Reveal, TexteRevele } from '../../components/motion';
import { ALT_PHOTO_APROPOS, A_PROPOS_ACCUEIL } from './textes';
import { useTextes } from '../../lib/textes';
import type { Language, ViewState } from '../../types';

export interface AProposProps {
  lang: Language;
  /** Déjà traduites par PublicHome (tr()) : 15 ans / D'expérience, les disciplines, les zones. */
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  onChangeView?: (v: ViewState) => void;
}

const TEXTES = {
  FR: {
    lire: 'Lire son histoire',
    titre: A_PROPOS_ACCUEIL.titre.FR,
    p0: A_PROPOS_ACCUEIL.paragraphes.FR[0],
    p1: A_PROPOS_ACCUEIL.paragraphes.FR[1],
    mission: A_PROPOS_ACCUEIL.mission.FR,
  },
  EN: {
    lire: 'Read her story',
    titre: A_PROPOS_ACCUEIL.titre.EN,
    p0: A_PROPOS_ACCUEIL.paragraphes.EN[0],
    p1: A_PROPOS_ACCUEIL.paragraphes.EN[1],
    mission: A_PROPOS_ACCUEIL.mission.EN,
  },
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

const APropos: React.FC<AProposProps> = ({
  lang,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
  stat3Value,
  stat3Label,
  onChangeView,
}) => {
  const t = useTextes('accueilAPropos', TEXTES, lang);
  const paragraphes = [t.p0, t.p1];

  const chiffre1 = Number.parseInt(stat1Value, 10) || 15;
  const unite1 = stat1Value.replace(/^\d+\s*/, '');
  const kicker1 = `${unite1} ${stat1Label.replace(/^D'/, "d'").replace(/^Of /, 'of ')}`.trim();

  return (
    <Feuille z={2} className="bg-papier-2">
      <div data-tx-scope="accueilAPropos" className="grid grid-cols-12 gap-x-col gap-y-10 px-gut py-feuille">
        <div className="col-span-12 sm:col-span-5">
          <Parallax speed={0.14}>
            <img
              src="/images/laurie-apropos.jpg"
              alt={ALT_PHOTO_APROPOS[lang]}
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
              <p className="text-h3 font-serif text-encre">{stat2Value}</p>
              <p className="kicker mt-2 text-gris">{stat2Label}</p>
            </div>
            <div>
              <p className="text-h3 font-serif text-encre">{stat3Value}</p>
              <p className="kicker mt-2 text-gris">{stat3Label}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex flex-col sm:col-span-6 sm:col-start-7">
          <Reveal as="h2" className="whitespace-pre-line text-h2 font-serif text-encre">
            {t.titre}
          </Reveal>
          <div className="mt-8 flex flex-col gap-5">
            {paragraphes.map((p, i) => (
              <Reveal key={i} as="p" delay={i * 0.08} className="max-w-mesure text-corps text-encre/85">
                {p}
              </Reveal>
            ))}
          </div>
          <TexteRevele texte={t.mission} as="p" par="mot" className="mt-8 max-w-mesure text-h3 font-serif text-rose" />

          <div className="-mb-3 mt-auto pt-10 text-right">
            <a
              href="/a-propos"
              onClick={(e) => {
                if (onChangeView) {
                  e.preventDefault();
                  onChangeView('A_PROPOS');
                }
              }}
              className="inline-flex items-center gap-2 py-3 text-petit font-semibold text-encre transition-colors duration-200 hover:text-rose"
            >
              {t.lire}
            </a>
          </div>
        </div>
      </div>
    </Feuille>
  );
};

export default APropos;
