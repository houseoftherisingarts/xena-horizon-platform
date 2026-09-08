// PublicHome : l'accueil v2 « Manchette », section par section (DIRECTION-v2.md §6.1).
// L'intro joue une fois par session puis sa marque voyage vers la barre de navigation
// (layoutId partagé) ; le hero s'allume au premier scroll ; les six feuilles suivantes
// s'empilent, la dernière d'encre.

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import { BLOCS_ACCUEIL } from '../lib/contenu';
import { useTextes } from '../lib/textes';
import type {
  HomeBlock,
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

// Les textes de l'accueil viennent du code (lib/contenu.ts, pages/accueil/textes.ts) et se modifient
// depuis la page par l'éditeur ; seul le portrait du hero se lit encore dans `blocks` (settings/homeBlocks).
const HERO = BLOCS_ACCUEIL.find((b): b is HomeHeroBlock => b.type === 'HERO')!;
const SERVICES = BLOCS_ACCUEIL.find((b): b is HomeServicesBlock => b.type === 'SERVICES_PREVIEW')!;
const STATS = BLOCS_ACCUEIL.find((b): b is HomeStatsBlock => b.type === 'STATS')!;
const EN = (id: string, champ: string, repli: string): string => HOME_EN[id]?.[champ] ?? repli;

const TEXTES = {
  FR: {
    signature: 'par Laurie Belhumeur',
    tagline: HERO.tagline,
    headline: HERO.headline,
    subheadline: HERO.subheadline,
    ctaText: HERO.ctaText,
    strophe: STROPHE_ALLUMAGE.FR,
    servicesTitle: SERVICES.title,
    servicesSubtitle: SERVICES.subtitle,
    stat1Value: STATS.stat1Value,
    stat1Label: STATS.stat1Label,
    stat2Value: STATS.stat2Value,
    stat2Label: STATS.stat2Label,
    stat3Value: STATS.stat3Value,
    stat3Label: STATS.stat3Label,
  },
  EN: {
    signature: 'by Laurie Belhumeur',
    tagline: HERO.tagline,
    headline: EN(HERO.id, 'headline', HERO.headline),
    subheadline: EN(HERO.id, 'subheadline', HERO.subheadline),
    ctaText: EN(HERO.id, 'ctaText', HERO.ctaText),
    strophe: STROPHE_ALLUMAGE.EN,
    servicesTitle: EN(SERVICES.id, 'title', SERVICES.title),
    servicesSubtitle: EN(SERVICES.id, 'subtitle', SERVICES.subtitle),
    stat1Value: EN(STATS.id, 'stat1Value', STATS.stat1Value),
    stat1Label: EN(STATS.id, 'stat1Label', STATS.stat1Label),
    stat2Value: EN(STATS.id, 'stat2Value', STATS.stat2Value),
    stat2Label: EN(STATS.id, 'stat2Label', STATS.stat2Label),
    stat3Value: EN(STATS.id, 'stat3Value', STATS.stat3Value),
    stat3Label: EN(STATS.id, 'stat3Label', STATS.stat3Label),
  },
};

const PublicHome: React.FC<PublicHomeProps> = ({ blocks, lang, onChangeView }) => {
  const t = useTextes('accueil', TEXTES, lang);
  const [introVisible, setIntroVisible] = useState(() => !introDejaJouee());

  // Rien à faire défiler derrière le voile : le défilement se rouvre dès que l'intro cède la place.
  useEffect(() => {
    if (!introVisible) return;
    const precedent = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = precedent;
    };
  }, [introVisible]);

  const imageUrl = blocks.find((b): b is HomeHeroBlock => b.type === 'HERO')?.imageUrl ?? HERO.imageUrl;

  return (
    <div className="relative bg-papier" data-tx-scope="accueil">
      {/* AnimatePresence tient l'intro montée le temps de son `exit` (Intro.tsx) : c'est ce
          délai qui laisse framer-motion raccorder le FLIP du layoutId « xh-marque » vers la
          barre de navigation, au lieu de la faire disparaître dans le même rendu. */}
      <AnimatePresence>
        {introVisible && (
          <Intro
            key="intro"
            marque="Xena Horizon"
            signature={t.signature}
            layoutId="xh-marque"
            onComplete={() => {
              marquerIntroTerminee();
              setIntroVisible(false);
            }}
          />
        )}
      </AnimatePresence>

      <Allumage
        lang={lang}
        tagline={t.tagline}
        headline={t.headline}
        subheadline={t.subheadline}
        ctaText={t.ctaText}
        imageUrl={imageUrl}
        strophe={t.strophe}
        strapline={t.stat2Label}
      />

      <Sommaire lang={lang} title={t.servicesTitle} subtitle={t.servicesSubtitle} onChangeView={onChangeView} />

      <APropos
        lang={lang}
        stat1Value={t.stat1Value}
        stat1Label={t.stat1Label}
        stat2Value={t.stat2Value}
        stat2Label={t.stat2Label}
        stat3Value={t.stat3Value}
        stat3Label={t.stat3Label}
        onChangeView={onChangeView}
      />
      <Temoignage lang={lang} />
      <Projets lang={lang} onChangeView={onChangeView} />
      <Citation lang={lang} />
      <Contact lang={lang} />
    </div>
  );
};

export default PublicHome;
