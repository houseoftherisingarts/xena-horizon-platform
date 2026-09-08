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

const TEXTES = {
  FR: {
    signature: 'par Laurie Belhumeur',
  },
  EN: {
    signature: 'by Laurie Belhumeur',
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

  const hero = blocks.find((b): b is HomeHeroBlock => b.type === 'HERO');
  const services = blocks.find((b): b is HomeServicesBlock => b.type === 'SERVICES_PREVIEW');
  const stats = blocks.find((b): b is HomeStatsBlock => b.type === 'STATS');

  const tr = (blockId: string, field: string, fallback: string): string =>
    lang === 'EN' ? HOME_EN[blockId]?.[field] ?? fallback : fallback;

  return (
    <div className="relative bg-papier">
      {/* AnimatePresence tient l'intro montée le temps de son `exit` (Intro.tsx) : c'est ce
          délai qui laisse framer-motion raccorder le FLIP du layoutId « xh-marque » vers la
          barre de navigation, au lieu de la faire disparaître dans le même rendu. */}
      <AnimatePresence>
        {introVisible && (
          <Intro
            key="intro"
            marque="Xena Horizon"
            signature="par Laurie Belhumeur"
            layoutId="xh-marque"
            onComplete={() => {
              marquerIntroTerminee();
              setIntroVisible(false);
            }}
          />
        )}
      </AnimatePresence>

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

      {stats && (
        <APropos
          lang={lang}
          stat1Value={tr(stats.id, 'stat1Value', stats.stat1Value)}
          stat1Label={tr(stats.id, 'stat1Label', stats.stat1Label)}
          stat2Value={tr(stats.id, 'stat2Value', stats.stat2Value)}
          stat2Label={tr(stats.id, 'stat2Label', stats.stat2Label)}
          stat3Value={tr(stats.id, 'stat3Value', stats.stat3Value)}
          stat3Label={tr(stats.id, 'stat3Label', stats.stat3Label)}
          onChangeView={onChangeView}
        />
      )}
      <Temoignage lang={lang} />
      <Projets lang={lang} onChangeView={onChangeView} />
      <Citation lang={lang} />
      <Contact lang={lang} onChangeView={onChangeView} />
    </div>
  );
};

export default PublicHome;
