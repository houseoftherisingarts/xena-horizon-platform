import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language, ViewState } from '../types';
import { VIEW_PATHS, cheminNettoye } from '../lib/routes';
import { Atmosphere, KenBurns, MotsTournants, Reveal, TexteRevele } from '../components/motion';
import { useTextes } from '../lib/textes';

interface NotFoundProps {
  lang: Language;
  onChangeView: (view: ViewState) => void;
}

const TEXTES = {
  FR: {
    eyebrow: 'Page 404',
    title: "Cette scène\nn'existe pas",
    quote: 'Toutes les scènes ne sont pas encore écrites.',
    ligne1: 'Vous avez suivi un lien rompu, ou une adresse qui a changé depuis votre dernière visite.',
    ligne2: "Le reste du site est resté à sa place, à commencer par l'accueil.",
    cherche: 'Peut-être cherchiez-vous',
    mots: ['les services', 'les projets', 'le balado', "l'accompagnement"],
    cta: "Retour à l'accueil",
    photoAlt: 'Laurie Belhumeur sur scène',
  },
  EN: {
    eyebrow: 'Page 404',
    title: 'This scene\ndoes not exist',
    quote: 'Not every scene has been written yet.',
    ligne1: 'You followed a broken link, or an address that has changed since your last visit.',
    ligne2: 'The rest of the site is right where it belongs, starting with the homepage.',
    cherche: 'You might have been looking for',
    mots: ['the services', 'the projects', 'the podcast', 'the coaching'],
    cta: 'Back to home',
    photoAlt: 'Laurie Belhumeur on stage',
  },
};

/**
 * Une adresse qui ne correspond à aucune vue connue tombe ici. La session principale la branche
 * dans App.tsx : quand `viewFromPath` ne reconnaît pas `window.location.pathname`, appeler
 * `cheminInconnu(window.location.pathname)` pour savoir s'il faut rendre NotFound plutôt que HOME,
 * puisque `viewFromPath` retombe elle-même sur 'HOME' pour toute adresse non reconnue.
 */
export function cheminInconnu(pathname: string): boolean {
  return !Object.values(VIEW_PATHS).includes(cheminNettoye(pathname));
}

const NotFound: React.FC<NotFoundProps> = ({ lang, onChangeView }) => {
  const t = useTextes('introuvable', TEXTES, lang);

  return (
    <div data-tx-scope="introuvable" className="min-h-[100svh] bg-papier">
      <div className="grid min-h-[100svh] grid-cols-1 lg:grid-cols-12">
        {/* --- LA SCÈNE : photo réelle, plein cadre --- */}
        <div className="relative order-1 min-h-[38vh] overflow-hidden lg:order-2 lg:col-span-5 lg:min-h-[100svh]">
          <KenBurns
            src="/images/laurie-scene.jpg"
            alt={t.photoAlt}
            position="50% 20%"
            cadre="404_scene"
            className="absolute inset-0"
          />
          <Atmosphere grain vignette light="50% 15%" />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 hidden w-1/4 lg:block"
            style={{ background: 'linear-gradient(to right, var(--papier), transparent)' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/4 lg:hidden"
            style={{ background: 'linear-gradient(to bottom, var(--papier), transparent)' }}
          />
        </div>

        {/* --- LE MOT --- */}
        <div className="order-2 flex flex-col justify-center px-gut py-[calc(var(--nav)+2.5rem)] lg:order-1 lg:col-span-7 lg:py-0">
          <Reveal as="p" className="kicker text-rose mb-4">
            {t.eyebrow}
          </Reveal>
          <TexteRevele texte={t.title} as="h1" par="mot" className="font-serif text-h2 text-encre mb-6" />
          <Reveal delay={0.12} as="p" className="font-serif text-lede text-encre mb-6 mesure">
            {t.quote}
          </Reveal>
          <Reveal delay={0.22} className="mb-8 space-y-3 mesure">
            <p className="text-corps text-gris">{t.ligne1}</p>
            <p className="text-corps text-gris">{t.ligne2}</p>
          </Reveal>
          <Reveal delay={0.32} className="mb-9">
            <MotsTournants prefixe={t.cherche} mots={t.mots} />
          </Reveal>
          <Reveal delay={0.42}>
            <button
              type="button"
              onClick={() => onChangeView('HOME')}
              className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-pilule bg-bouton px-6 text-sm font-medium text-sur-bouton transition-colors hover:bg-bouton-2"
            >
              <ArrowLeft className="h-4 w-4" /> {t.cta}
            </button>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
