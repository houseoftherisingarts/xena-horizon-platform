// Projets : la seule feuille d'encre de l'accueil (la rupture Von Restorff). Triptyque
// décalé : le livre, le balado, la photo de modèle, chacun à sa propre profondeur de
// parallaxe pour que l'encre ne soit jamais un panneau plat.

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Atmosphere, Feuille, Parallax, Reveal } from '../../components/motion';
import { PROJETS, type Projet } from '../../lib/contenu';
import type { Language, ViewState } from '../../types';

export interface ProjetsProps {
  lang: Language;
  onChangeView?: (v: ViewState) => void;
}

const t = {
  FR: { titre: 'Les projets', lien: 'Voir les projets' },
  EN: { titre: 'Projects', lien: 'See the projects' },
};

const parId = (id: string) => PROJETS.find((p) => p.id === id);

const Piece: React.FC<{
  projet?: Projet;
  lang: Language;
  speed: number;
  delay: number;
  ratio: string;
  className?: string;
  onNaviguer: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ projet, lang, speed, delay, ratio, className, onNaviguer }) => {
  if (!projet) return null;
  const sousTitre = lang === 'FR' ? projet.sousTitre : projet.sousTitreEn;
  const titre = lang === 'FR' ? projet.titre : projet.titreEn;

  return (
    <Reveal as="div" delay={delay} className={className}>
      <Parallax speed={speed}>
        <a href="/projets" onClick={onNaviguer} className="group block focus:outline-none">
          <div className={`overflow-hidden ${ratio}`}>
            <img
              src={projet.image}
              alt={titre}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
            />
          </div>
          <p className="kicker mt-5 text-rose-clair">{sousTitre}</p>
          <h3 className="relative mt-2 inline-block text-h3 font-serif text-papier">
            {titre}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-rose-clair transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </h3>
        </a>
      </Parallax>
    </Reveal>
  );
};

const Projets: React.FC<ProjetsProps> = ({ lang, onChangeView }) => {
  const L = t[lang];

  const aller = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onChangeView) return;
    e.preventDefault();
    onChangeView('PROJETS');
  };

  return (
    <Feuille z={4} className="encre grain relative bg-encre text-papier">
      <Atmosphere light="80% 10%" strength={0.7} />
      <div className="relative px-gut py-feuille">
        <div className="mb-16 flex items-end justify-between gap-6 sm:mb-20">
          <h2 className="text-h2 font-serif text-papier">{L.titre}</h2>
          <a
            href="/projets"
            onClick={aller}
            className="-my-3 inline-flex items-center gap-2 py-3 text-petit font-semibold text-papier/80 transition-colors duration-200 hover:text-rose-clair"
          >
            {L.lien}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="grid grid-cols-12 gap-x-col gap-y-14">
          <Piece
            projet={parId('livre')}
            lang={lang}
            speed={0.08}
            delay={0}
            ratio="aspect-[4/5]"
            className="col-span-12 sm:col-span-5"
            onNaviguer={aller}
          />
          <Piece
            projet={parId('balado')}
            lang={lang}
            speed={0.14}
            delay={0.12}
            ratio="aspect-square"
            className="col-span-12 sm:col-span-4 sm:mt-[12vh]"
            onNaviguer={aller}
          />
          <Piece
            projet={parId('modele')}
            lang={lang}
            speed={0.2}
            delay={0.24}
            ratio="aspect-[3/4]"
            className="col-span-12 sm:col-span-3 sm:mt-[24vh]"
            onNaviguer={aller}
          />
        </div>
      </div>
    </Feuille>
  );
};

export default Projets;
