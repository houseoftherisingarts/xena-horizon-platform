import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useCollection } from '../lib/firestore';
import { PROFILS_REELS, SERVICES_PAGE, SERVICES_REELS, SIGNATURE, ServiceReel } from '../lib/contenu';
import { ETAPES_PAR_DEFAUT } from '../lib/dossier';
import { Feuille, KenBurns, Reveal, TexteRevele, useLenis } from '../components/motion';
import { ClientArchetype, Language, Product, ViewState } from '../types';

interface PublicServicesProps {
  lang: Language;
  onChangeView?: (view: ViewState) => void;
}

const ARCHETYPES_ORDRE: ClientArchetype[] = ['Artist', 'Entrepreneur', 'NPO'];

/** Nom/description d'une offre selon la langue, avec repli sur le français (produits Firestore sans champs anglais). */
const nomOffre = (offer: Product, lang: Language): string => {
  const svc = offer as Partial<ServiceReel>;
  return lang === 'EN' && svc.nameEn ? svc.nameEn : offer.name;
};
const descriptionOffre = (offer: Product, lang: Language): string => {
  const svc = offer as Partial<ServiceReel>;
  return lang === 'EN' && svc.descriptionEn ? svc.descriptionEn : offer.description;
};

/** Dès X $ + taxes, Dès X $ / mois pour l'abonnement, ou Sur demande quand le prix n'est pas public. */
const prixAffiche = (offer: Product, lang: Language): string => {
  if (offer.price <= 0) return lang === 'FR' ? 'Sur demande' : 'On request';
  if (offer.id === 'abonnement-mensuel') {
    return lang === 'FR' ? `Dès ${offer.price} $ / mois` : `From $${offer.price} / month`;
  }
  return lang === 'FR' ? `Dès ${offer.price} $ + taxes` : `From $${offer.price} + taxes`;
};

/** Qui peut se reconnaître dans l'offre, tiré de PROFILS_REELS (jamais un archétype inventé). */
const pourQui = (offer: Product, lang: Language): string => {
  const types = offer.clientTypes && offer.clientTypes.length > 0 ? offer.clientTypes : ARCHETYPES_ORDRE;
  return types
    .map((id) => PROFILS_REELS.find((p) => p.id === id))
    .filter((p): p is (typeof PROFILS_REELS)[number] => !!p)
    .map((p) => (lang === 'EN' ? p.titleEN : p.titleFR))
    .join(' · ');
};

const OFFSET_PROFIL = ['', 'lg:mt-[6vh]', 'lg:mt-[12vh]'];
const SPAN_PROFIL = ['lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3'];

const PublicServices: React.FC<PublicServicesProps> = ({ lang, onChangeView }) => {
  const { data: produitsFirestore } = useCollection<Product>('products');
  const lenis = useLenis();

  const allerA = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Lenis lit déjà `scroll-margin-top` sur la cible (index.css, `[id]`) : pas de second offset.
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  const t = {
    FR: {
      pricesLabel: 'Prix de départ',
      book: 'Prendre rendez-vous',
      pillA: "À partir d'un prix de départ",
      pillB: 'Sur demande',
      howTitle: 'Comment ça\nse passe',
      howSubtitle: 'Le même parcours pour chaque personne accompagnée, du premier appel au suivi.',
      spaceTitle: 'Un dossier déjà commencé ?',
      spaceText: 'Retrouve ton parcours, tes pièces et tes échanges avec Laurie dans ton espace client.',
      spaceCta: 'Ouvrir mon espace',
      rdvText: "Écris-moi et je te reviens rapidement. Regardons ensemble si nous sommes faites pour travailler ensemble.",
      voirOffres: 'Voir les offres',
      subheadline: 'Trois profils, une même écoute : artiste, entrepreneur créatif ou organisme.',
    },
    EN: {
      pricesLabel: 'Starting price',
      book: 'Book a call',
      pillA: 'From a starting price',
      pillB: 'On request',
      howTitle: 'How it\nworks',
      howSubtitle: 'The same path for every person, from the first call to the follow-up.',
      spaceTitle: 'Already have a file open?',
      spaceText: 'Find your path, your documents and your exchanges with Laurie in your client space.',
      spaceCta: 'Open my space',
      rdvText: "Write to me and I'll get back to you quickly. Let's see together if we're a good fit to work together.",
      voirOffres: 'View services',
      subheadline: 'Three profiles, the same listening ear: artist, creative entrepreneur or organization.',
    },
  }[lang];

  const book = t.book;
  const titre = lang === 'EN' ? SERVICES_PAGE.titreEN : SERVICES_PAGE.titreFR;
  const email = 'laurie.belhumeur@gmail.com';

  const catalogue: Product[] = useMemo(() => {
    const publics = (produitsFirestore ?? []).filter((p) => p.isPublic && p.status === 'Active');
    return publics.length > 0 ? publics : SERVICES_REELS;
  }, [produitsFirestore]);

  const prixVedettes = SERVICES_REELS.filter((s) =>
    ['strategie-communication', 'redaction', 'abonnement-mensuel'].includes(s.id)
  );

  const chapitreA = catalogue.filter((p) => p.price > 0);
  const chapitreB = catalogue.filter((p) => p.price <= 0);

  const goToContact = () => {
    if (onChangeView) {
      onChangeView('HOME');
      setTimeout(() => allerA('contact'), 100);
    } else {
      window.location.href = '/#contact';
    }
  };

  const RangeeOffre: React.FC<{ offer: Product; delay: number }> = ({ offer, delay }) => (
    <Reveal
      delay={delay}
      className="border-b border-filet py-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:gap-6 items-baseline"
    >
      <div>
        <h3 className="font-serif text-h3">{nomOffre(offer, lang)}</h3>
        <p className="text-petit text-gris mt-1">{pourQui(offer, lang)}</p>
        <p className="text-corps text-gris mesure mt-2">{descriptionOffre(offer, lang)}</p>
      </div>
      <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 justify-between md:justify-start">
        <span className="font-sans font-semibold tabular-nums whitespace-nowrap">{prixAffiche(offer, lang)}</span>
        <button
          onClick={goToContact}
          className="pilule inline-flex items-center gap-2 rounded-pilule border border-encre px-5 py-2.5 text-petit font-medium transition-colors hover:bg-encre hover:text-papier"
        >
          {book} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Reveal>
  );

  return (
    <div>
      {/* --- OUVERTURE : manchette + prix de départ --- */}
      <section className="px-gut pt-[calc(var(--nav)+3.5rem)] pb-bloc grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10">
        <div className="lg:col-span-7">
          <TexteRevele key={lang} texte={titre} as="h1" par="mot" className="font-serif text-h1" />
          <Reveal delay={0.3} as="p" className="text-lede text-gris mesure mt-6">
            {t.subheadline}
          </Reveal>
          <Reveal delay={0.45}>
            <button
              onClick={goToContact}
              className="pilule mt-8 inline-flex items-center gap-2 rounded-pilule bg-encre text-papier px-7 py-3.5 font-medium hover:bg-encre-2 transition-colors"
            >
              {book} <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-5 lg:col-start-9">
          <p className="kicker text-rose mb-4">{t.pricesLabel}</p>
          <div className="border-t border-filet">
            {prixVedettes.map((s) => (
              <div key={s.id} className="flex items-baseline justify-between gap-4 border-b border-filet py-4">
                <span className="text-corps">{nomOffre(s, lang)}</span>
                <span className="font-sans font-semibold tabular-nums whitespace-nowrap">{prixAffiche(s, lang)}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* --- BANDE PHOTO --- */}
      <div className="relative h-[46vh] md:h-[58svh] overflow-hidden">
        <KenBurns
          src="/images/laurie-portrait-2.jpg"
          alt="Laurie Belhumeur sur scène"
          position="45% 25%"
          className="absolute inset-0"
          loading="lazy"
        />
      </div>

      {/* --- TROIS PROFILS --- */}
      <Feuille z={1} className="bg-papier px-gut py-feuille">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-12">
          {PROFILS_REELS.map((profil, i) => (
            <Reveal
              key={profil.id}
              delay={i * 0.1}
              className={`border-t border-filet pt-6 ${SPAN_PROFIL[i]} ${OFFSET_PROFIL[i]}`}
            >
              <p className="text-petit text-gris mb-2">{lang === 'EN' ? profil.taglineEN : profil.taglineFR}</p>
              {/* La colonne étroite (3/12, « Organisations et entreprises ») déborde en 3 lignes à text-h2 : h3 pour elle. */}
              <h2 className={`font-serif ${i === 2 ? 'text-h3' : 'text-h2'}`}>
                {lang === 'EN' ? profil.titleEN : profil.titleFR}
              </h2>
              <p className="text-lede text-gris mt-4">{lang === 'EN' ? profil.descriptionEN : profil.descriptionFR}</p>
              <p className="text-corps text-gris mt-3">{lang === 'EN' ? profil.detailsEN : profil.detailsFR}</p>
              <a
                href="#offres"
                onClick={(e) => {
                  e.preventDefault();
                  allerA('offres');
                }}
                className="inline-flex items-center gap-2 mt-5 text-petit font-medium hover:text-rose transition-colors"
              >
                {t.voirOffres} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Reveal>
          ))}
        </div>
      </Feuille>

      {/* --- LA CARTE DES OFFRES --- */}
      <div id="offres">
        <Feuille z={2} className="bg-papier-2 px-gut py-feuille">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col">
            <Reveal as="h2" className="font-serif text-h2 lg:col-span-4">
              {t.pillA}
            </Reveal>
            <div className="lg:col-span-8 lg:col-start-5 mt-8 lg:mt-0">
              {chapitreA.map((offer, i) => (
                <RangeeOffre key={offer.id} offer={offer} delay={i * 0.08} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col mt-16">
            <Reveal as="h2" className="font-serif text-h2 lg:col-span-4">
              {t.pillB}
            </Reveal>
            <div className="lg:col-span-8 lg:col-start-5 mt-8 lg:mt-0">
              {chapitreB.map((offer, i) => (
                <RangeeOffre key={offer.id} offer={offer} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </Feuille>
      </div>

      {/* --- INTERLUDE : la signature --- */}
      <Feuille z={3} className="bg-papier px-gut py-bloc">
        <TexteRevele
          texte={lang === 'EN' ? SIGNATURE.texteEN : SIGNATURE.texteFR}
          as="p"
          par="mot"
          className="font-serif text-display lg:max-w-[85%]"
        />
        <div className="h-[2px] bg-rose w-24 mt-8" />
      </Feuille>

      {/* --- COMMENT ÇA SE PASSE --- */}
      <Feuille z={4} className="bg-papier-2 px-gut py-feuille">
        <Reveal as="p" className="text-lede text-gris mb-3">
          {t.howSubtitle}
        </Reveal>
        <TexteRevele key={lang} texte={t.howTitle} as="h2" par="mot" className="font-serif text-h2 mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-col gap-y-10">
          {ETAPES_PAR_DEFAUT.map((etape, i) => (
            <Reveal key={etape.id} delay={i * 0.08} className="border-t border-filet pt-5">
              <p className="font-serif text-h3 text-rose">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-serif text-[1.1rem] mt-2">
                {lang === 'EN' ? etape.titreEn ?? etape.titre : etape.titre}
              </h3>
              <p className="text-petit text-gris mt-2">{lang === 'EN' ? etape.sousEn ?? etape.sous : etape.sous}</p>
            </Reveal>
          ))}
        </div>
      </Feuille>

      {/* --- OUVRIR SON ESPACE --- */}
      <Feuille z={5} className="bg-papier px-gut py-bloc">
        <Reveal className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-serif text-h3">{t.spaceTitle}</h2>
            <p className="text-corps text-gris mt-2 mesure">{t.spaceText}</p>
          </div>
          {onChangeView ? (
            <button
              onClick={() => onChangeView('ESPACE_CLIENT')}
              className="pilule inline-flex items-center gap-2 rounded-pilule border border-encre px-6 py-3 font-medium hover:bg-encre hover:text-papier transition-colors flex-shrink-0"
            >
              {t.spaceCta} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <a
              href="/espace"
              className="pilule inline-flex items-center gap-2 rounded-pilule border border-encre px-6 py-3 font-medium hover:bg-encre hover:text-papier transition-colors flex-shrink-0"
            >
              {t.spaceCta} <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </Reveal>
      </Feuille>

      {/* --- PRENDRE RENDEZ-VOUS --- */}
      <Feuille z={6} className="bg-papier-2 px-gut py-bloc min-h-[60svh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-8 w-full">
          <div className="lg:col-span-6">
            <Reveal as="h2" className="font-serif text-h2">
              {book}
            </Reveal>
            <Reveal delay={0.15}>
              <button
                onClick={goToContact}
                className="pilule mt-6 inline-flex items-center gap-2 rounded-pilule bg-encre text-papier px-7 py-3.5 font-medium hover:bg-encre-2 transition-colors"
              >
                {book} <ArrowRight className="w-4 h-4" />
              </button>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6">
            <p className="text-corps text-gris mesure">{t.rdvText}</p>
            <a href={`mailto:${email}`} className="font-serif text-h3 break-all block mt-4 hover:text-rose transition-colors">
              {email}
            </a>
          </Reveal>
        </div>
      </Feuille>
    </div>
  );
};

export default PublicServices;
