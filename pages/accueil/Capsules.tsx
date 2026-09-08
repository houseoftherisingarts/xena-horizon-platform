// Capsules : la rangée de courtes vidéos verticales en mode éducatif, portée du principe des
// témoignages audio (rien de publié = rien à l'écran) et de la même mécanique d'aperçu au clic.
//
// Placement : entre Sommaire et À propos. Les trois profils (Sommaire) disent à qui Laurie
// s'adresse; les capsules la montrent tout de suite en train d'enseigner, dans sa propre voix,
// avant même le récit de son parcours (À propos) — la preuve d'expertise précède la biographie.
// z={1.5} plutôt qu'un entier : évite de renuméroter les six feuilles suivantes de la pile pour
// une section qui reste éteinte tant qu'aucune capsule n'est publiée.
//
// CapsuleCarte est exportée pour l'aperçu de l'admin (pages/AdminVideos.tsx) : la même carte,
// telle qu'elle paraîtra sur l'accueil.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { where } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { Feuille, Reveal, TexteRevele } from '../../components/motion';
import { useCollection } from '../../lib/firestore';
import { useTextes } from '../../lib/textes';
import { sectionActive, useSections } from '../../lib/sections';
import { exemplesCapsulesVerif } from '../../lib/videos';
import type { Language, VideoCapsule } from '../../types';

export interface CapsulesProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    kicker: 'Mode éducatif',
    titre: 'Des capsules courtes,\ndes idées qui restent',
  },
  EN: {
    kicker: 'Educational',
    titre: 'Short capsules,\nideas that stay',
  },
};

// Une seule capsule joue le son à la fois : au démarrage d'une nouvelle, celle qui joue s'arrête.
let videoActive: HTMLVideoElement | null = null;

export const CapsuleCarte: React.FC<{ video: VideoCapsule; lang: Language }> = ({ video, lang }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [joue, setJoue] = useState(false);
  const [pointeurFin, setPointeurFin] = useState(false);

  // L'aperçu muet au survol ne s'active que sur souris fine (jamais sur téléphone, où le survol
  // n'existe pas vraiment et déclencherait une lecture non voulue au premier toucher).
  useEffect(() => {
    try {
      setPointeurFin(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    } catch {
      /* matchMedia absent : pas d'aperçu au survol, le clic reste la seule entrée */
    }
  }, []);

  useEffect(
    () => () => {
      if (ref.current && videoActive === ref.current) videoActive = null;
    },
    []
  );

  const survoler = (dedans: boolean) => {
    const v = ref.current;
    if (!v || !pointeurFin || joue) return;
    if (dedans) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const lire = () => {
    const v = ref.current;
    if (!v) return;
    if (videoActive && videoActive !== v) videoActive.pause();
    videoActive = v;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setJoue(true);
  };

  const titre = (lang === 'EN' ? video.titreEn : undefined) || video.titre;
  const description = (lang === 'EN' ? video.descriptionEn : undefined) || video.description;
  const libelleLire = lang === 'FR' ? `Regarder « ${titre} »` : `Watch “${titre}”`;

  return (
    <div className="w-[210px] flex-none snap-start sm:w-[240px]">
      <div
        className="group relative aspect-[9/16] w-full overflow-hidden bg-encre"
        onMouseEnter={() => survoler(true)}
        onMouseLeave={() => survoler(false)}
      >
        <video
          ref={ref}
          src={video.fichier.url}
          poster={video.affiche?.url}
          muted={!joue}
          loop={!joue}
          controls={joue}
          playsInline
          preload="metadata"
          onEnded={() => setJoue(false)}
          className="h-full w-full object-cover"
        >
          {joue && video.sousTitres && (
            <track kind="subtitles" src={video.sousTitres} srcLang={lang === 'FR' ? 'fr' : 'en'} default />
          )}
        </video>
        {!joue && (
          <button
            type="button"
            onClick={lire}
            aria-label={libelleLire}
            className="absolute inset-0 flex items-center justify-center bg-encre/10 transition-colors duration-200 group-hover:bg-encre/25"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-pilule bg-papier/90 text-encre transition-transform duration-200 group-hover:scale-105">
              <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" aria-hidden />
            </span>
          </button>
        )}
      </div>
      <p className="mt-4 font-sans font-semibold text-encre">{titre}</p>
      {description && <p className="mt-1 text-petit text-gris">{description}</p>}
    </div>
  );
};

const parOrdre = (a: VideoCapsule, b: VideoCapsule): number => (a.ordre ?? 0) - (b.ordre ?? 0);

const Capsules: React.FC<CapsulesProps> = ({ lang }) => {
  const t = useTextes('accueilCapsules', TEXTES, lang);
  const sections = useSections();
  const { data } = useCollection<VideoCapsule>('videos', [where('publie', '==', true)]);
  const capsules = useMemo(() => data.slice().sort(parOrdre), [data]);
  const railRef = useRef<HTMLDivElement>(null);

  // Éteinte dans l'admin, ou aucune capsule publiée : rien ne s'affiche, rien ne s'invente à sa place.
  if (!sectionActive(sections, 'capsules') || capsules.length === 0) return null;

  const defiler = (sens: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: sens * Math.min(el.clientWidth * 0.8, 560), behavior: 'smooth' });
  };

  return (
    <Feuille z={1.5} className="bg-papier">
      <div data-tx-scope="accueilCapsules" className="px-gut py-feuille">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <div>
            <p className="kicker text-rose">{t.kicker}</p>
            <TexteRevele texte={t.titre} as="h2" par="mot" className="mt-3 max-w-[26ch] text-h2 font-serif text-encre" />
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => defiler(-1)}
              aria-label={lang === 'FR' ? 'Capsules précédentes' : 'Previous capsules'}
              className="flex h-11 w-11 items-center justify-center rounded-pilule border border-filet text-encre transition-colors hover:border-encre"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => defiler(1)}
              aria-label={lang === 'FR' ? 'Capsules suivantes' : 'Next capsules'}
              className="flex h-11 w-11 items-center justify-center rounded-pilule border border-filet text-encre transition-colors hover:border-encre"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <Reveal as="div">
          {/* Défilement natif : flèches ci-dessus sur souris, glissement tactile ici sur téléphone. */}
          <div ref={railRef} className="xh-capsules-rail flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
            {capsules.map((v) => (
              <CapsuleCarte key={v.id} video={v} lang={lang} />
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`.xh-capsules-rail{scrollbar-width:none}.xh-capsules-rail::-webkit-scrollbar{display:none}`}</style>
    </Feuille>
  );
};

export default Capsules;
