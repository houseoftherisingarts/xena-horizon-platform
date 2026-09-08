// PublicHome — l'accueil v2 « Manchette », section par section (DIRECTION-v2.md §6.1).
// L'intro joue une fois par session puis sa marque voyage vers la barre de navigation
// (layoutId partagé) ; le hero s'allume au premier scroll ; les six feuilles suivantes
// s'empilent, la dernière d'encre.

import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { Intro } from '../components/motion';
import { introDejaJouee, marquerIntroTerminee } from '../lib/intro';
import Allumage from './accueil/Allumage';
import Sommaire from './accueil/Sommaire';
import APropos from './accueil/APropos';
import Temoignage from './accueil/Temoignage';
import Projets from './accueil/Projets';
import Citation from './accueil/Citation';
import Contact from './accueil/Contact';
import { HOME_EN, STROPHE_ALLUMAGE } from './accueil/textes';
import type {
  HomeBlock,
  HomeContactBlock,
  HomeHeroBlock,
  HomeServicesBlock,
  HomeStatsBlock,
  Language,
  ViewState,
} from '../types';

interface PublicHomeProps {
  blocks: HomeBlock[];
  lang: Language;
  onChangeView?: (view: ViewState) => void;
}

/** Le canon « Manchette » en variables CSS `--xh-*`, portée aux composants palette-agnostiques
 * du kit motion (Intro, Feuille, Atmosphere) sans toucher à index.css : elles s'appliquent en
 * cascade à tout ce qui vit sous cette racine. */
const JETONS_MANCHETTE = {
  '--xh-papier': '#F7F4EE',
  '--xh-encre': '#1A1A1E',
  '--xh-encre-douce': '#5E5850',
  '--xh-filet': '#A8104A',
  '--xh-lumiere': 'rgba(224, 32, 110, 0.12)',
  '--xh-lumiere-secondaire': 'rgba(224, 32, 110, 0.07)',
  '--xh-vignette': 'rgba(26, 26, 30, 0.55)',
  '--xh-ombre': 'rgba(26, 26, 30, 0.28)',
} as CSSProperties;

const PublicHome: React.FC<PublicHomeProps> = ({ blocks, lang, onChangeView }) => {
  const [introVisible, setIntroVisible] = useState(() => !introDejaJouee());

  const hero = blocks.find((b): b is HomeHeroBlock => b.type === 'HERO');
  const services = blocks.find((b): b is HomeServicesBlock => b.type === 'SERVICES_PREVIEW');
  const stats = blocks.find((b): b is HomeStatsBlock => b.type === 'STATS');
  const contact = blocks.find((b): b is HomeContactBlock => b.type === 'CONTACT');

  const tr = (blockId: string, field: string, fallback: string): string =>
    lang === 'EN' ? HOME_EN[blockId]?.[field] ?? fallback : fallback;

  return (
    <div className="relative bg-papier" style={JETONS_MANCHETTE}>
      {introVisible && (
        <Intro
          marque="Xena Horizon"
          signature="par Laurie Belhumeur"
          layoutId="xh-marque"
          onComplete={() => {
            marquerIntroTerminee();
            setIntroVisible(false);
          }}
        />
      )}

      {hero && (
        <Allumage
          lang={lang}
          tagline={hero.tagline}
          headline={tr(hero.id, 'headline', hero.headline)}
          subheadline={tr(hero.id, 'subheadline', hero.subheadline)}
          ctaText={tr(hero.id, 'ctaText', hero.ctaText)}
          imageUrl={hero.imageUrl}
          strophe={STROPHE_ALLUMAGE[lang]}
          strapline={stats ? tr(stats.id, 'stat2Label', stats.stat2Label) : ''}
        />
      )}

      {services && (
        <Sommaire
          lang={lang}
          title={tr(services.id, 'title', services.title)}
          subtitle={tr(services.id, 'subtitle', services.subtitle)}
          onChangeView={onChangeView}
        />
      )}

      <APropos lang={lang} stats={stats} onChangeView={onChangeView} />
      <Temoignage lang={lang} />
      <Projets lang={lang} onChangeView={onChangeView} />
      <Citation lang={lang} />
      <Contact lang={lang} contact={contact} />
    </div>
  );
};

export default PublicHome;
