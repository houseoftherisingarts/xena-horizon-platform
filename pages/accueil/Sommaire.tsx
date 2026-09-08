// Sommaire : les trois profils, en rangées à filet plutôt qu'en cartes de verre.
// Au survol, au focus ou au toucher, la rangée s'ouvre et révèle son détail.
// Première feuille du pile (aucun coin, aucune ombre : rien à recouvrir en dessous).

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Feuille, Reveal } from '../../components/motion';
import { PROFILS_REELS } from '../../lib/contenu';
import type { Language, ViewState } from '../../types';
import { useTextes } from '../../lib/textes';

export interface SommaireProps {
  lang: Language;
  title: string;
  subtitle: string;
  onChangeView?: (v: ViewState) => void;
}

const TEXTES = {
  FR: {
    lien: 'Voir les offres',
    artistTagline: PROFILS_REELS[0].taglineFR,
    artistTitre: PROFILS_REELS[0].titleFR,
    artistDescription: PROFILS_REELS[0].descriptionFR,
    artistDetails: PROFILS_REELS[0].detailsFR,
    entrepreneurTagline: PROFILS_REELS[1].taglineFR,
    entrepreneurTitre: PROFILS_REELS[1].titleFR,
    entrepreneurDescription: PROFILS_REELS[1].descriptionFR,
    entrepreneurDetails: PROFILS_REELS[1].detailsFR,
    npoTagline: PROFILS_REELS[2].taglineFR,
    npoTitre: PROFILS_REELS[2].titleFR,
    npoDescription: PROFILS_REELS[2].descriptionFR,
    npoDetails: PROFILS_REELS[2].detailsFR,
  },
  EN: {
    lien: 'See the services',
    artistTagline: PROFILS_REELS[0].taglineEN,
    artistTitre: PROFILS_REELS[0].titleEN,
    artistDescription: PROFILS_REELS[0].descriptionEN,
    artistDetails: PROFILS_REELS[0].detailsEN,
    entrepreneurTagline: PROFILS_REELS[1].taglineEN,
    entrepreneurTitre: PROFILS_REELS[1].titleEN,
    entrepreneurDescription: PROFILS_REELS[1].descriptionEN,
    entrepreneurDetails: PROFILS_REELS[1].detailsEN,
    npoTagline: PROFILS_REELS[2].taglineEN,
    npoTitre: PROFILS_REELS[2].titleEN,
    npoDescription: PROFILS_REELS[2].descriptionEN,
    npoDetails: PROFILS_REELS[2].detailsEN,
  },
};

const PREFIXES = ['artist', 'entrepreneur', 'npo'] as const;

const Sommaire: React.FC<SommaireProps> = ({ lang, title, subtitle, onChangeView }) => {
  const [ouvert, setOuvert] = useState<number | null>(null);
  const t = useTextes('accueilSommaire', TEXTES, lang);

  return (
    <Feuille z={1} premiere className="bg-papier">
      <div className="py-feuille" data-tx-scope="accueilSommaire">
        <div className="grid grid-cols-12 items-end gap-x-col gap-y-6 px-gut">
          <Reveal as="div" className="col-span-12 sm:col-span-7">
            <h2 className="whitespace-pre-line text-h2 font-serif text-encre">{title}</h2>
          </Reveal>
          <Reveal as="div" delay={0.08} className="col-span-12 sm:col-span-5">
            <p className="max-w-mesure text-lede font-sans font-light text-encre/80">{subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-12 sm:mt-16">
          {PROFILS_REELS.map((profil, i) => {
            const p = PREFIXES[i];
            const tagline = t[`${p}Tagline` as keyof typeof t];
            const titre = t[`${p}Titre` as keyof typeof t];
            const description = t[`${p}Description` as keyof typeof t];
            const details = t[`${p}Details` as keyof typeof t];
            const estOuvert = ouvert === i;

            return (
              <Reveal key={profil.id} as="div" delay={i * 0.1}>
                <div
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setOuvert(i)}
                  onMouseLeave={() => setOuvert((v) => (v === i ? null : v))}
                  onFocus={() => setOuvert(i)}
                  onBlur={() => setOuvert((v) => (v === i ? null : v))}
                  onClick={() => setOuvert((v) => (v === i ? null : i))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOuvert((v) => (v === i ? null : i));
                    }
                  }}
                  className="relative cursor-pointer border-t border-filet px-gut py-7 sm:py-8"
                >
                  <div className="grid grid-cols-12 items-baseline gap-x-col gap-y-3">
                    <p className="col-span-4 text-petit text-gris sm:col-span-1">{tagline}</p>
                    <h3
                      className="col-span-8 text-h2 font-serif text-encre transition-transform duration-200 ease-out sm:col-span-4"
                      style={{ transform: estOuvert ? 'translateX(8px)' : 'none' }}
                    >
                      {titre}
                    </h3>
                    <p className="col-span-12 max-w-mesure text-lede font-sans font-light text-encre/85 sm:col-span-5">
                      {description}
                    </p>
                    <a
                      href="/services"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onChangeView) {
                          e.preventDefault();
                          onChangeView('SERVICES');
                        }
                      }}
                      className="col-span-12 -my-3 inline-flex items-center gap-2 whitespace-nowrap py-3 text-petit font-semibold text-encre transition-colors duration-200 hover:text-rose sm:col-span-2 sm:justify-self-end"
                    >
                      {t.lien}
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>

                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: estOuvert ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-mesure pt-4 text-corps text-encre/75 sm:ml-[41.667%]">
                        {details}
                      </p>
                    </div>
                  </div>

                  <span
                    aria-hidden
                    className="absolute inset-x-gut bottom-0 h-[2px] bg-rose transition-[clip-path] duration-300 ease-out"
                    style={{ clipPath: estOuvert ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Feuille>
  );
};

export default Sommaire;
