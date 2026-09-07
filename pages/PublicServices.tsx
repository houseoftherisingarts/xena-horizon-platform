import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle, Sparkles, ChevronLeft, Compass } from 'lucide-react';
import {
  CLIENT_ARCHETYPES,
  ACTION_BUTTON_CLASSES,
  GHOST_BUTTON_CLASSES,
} from '../constants';
import { useCollection } from '../lib/firestore';
import { PROFILS_REELS, SERVICES_REELS, ServiceReel } from '../lib/contenu';
import { ETAPES_PAR_DEFAUT } from '../lib/dossier';
import GlassCard from '../components/GlassCard';
import { ClientArchetype, Language, Product, ViewState } from '../types';

/** Nom/description d'une offre selon la langue, avec repli sur le français (produits Firestore sans champs anglais). */
const nomOffre = (offer: Product, lang: Language): string => {
  const svc = offer as Partial<ServiceReel>;
  return lang === 'EN' && svc.nameEn ? svc.nameEn : offer.name;
};
const descriptionOffre = (offer: Product, lang: Language): string => {
  const svc = offer as Partial<ServiceReel>;
  return lang === 'EN' && svc.descriptionEn ? svc.descriptionEn : offer.description;
};

interface PublicServicesProps {
  lang: Language;
  onChangeView?: (view: ViewState) => void;
}

/** Dès X $ + taxes, Dès X $ / mois pour l'abonnement, ou Sur demande quand le prix n'est pas public. */
const prixAffiche = (offer: Product, lang: Language): string => {
  if (offer.price <= 0) return lang === 'FR' ? 'Sur demande' : 'On request';
  if (offer.id === 'abonnement-mensuel') {
    return lang === 'FR' ? `Dès ${offer.price} $ / mois` : `From $${offer.price} / month`;
  }
  return lang === 'FR' ? `Dès ${offer.price} $ + taxes` : `From $${offer.price} + taxes`;
};

const PublicServices: React.FC<PublicServicesProps> = ({ lang, onChangeView }) => {
  const [selected, setSelected] = useState<ClientArchetype | null>(null);
  const { data: produitsFirestore, loading } = useCollection<Product>('products');

  const t = {
    FR: {
      title: 'Trouve ton chemin.',
      subtitle: "Xena Horizon t'accompagne selon ta réalité, pas selon une grille de services rigide.",
      pillars: 'Choisis ton profil',
      pricesLabel: 'Prix de départ',
      learnMore: 'Voir les services',
      available: 'Services adaptés',
      forWho: 'Pour les artistes, les entrepreneurs créatifs et les organismes',
      book: 'Prendre rendez-vous',
      cantFind: "Tu ne trouves pas exactement ce qu'il te faut ?",
      customText: "Chaque projet est unique. Discutons d'une offre sur mesure.",
      contactMe: 'Me contacter',
      back: 'Retour aux profils',
      benefits: ['Analyse des besoins', 'Stratégie personnalisée', 'Suivi rigoureux'],
      howTitle: 'Comment ça\nse passe',
      howSubtitle: 'Le même parcours pour chaque personne accompagnée, du premier appel au suivi.',
      spaceTitle: 'Un dossier déjà commencé ?',
      spaceText: "Retrouve ton parcours, tes pièces et tes échanges avec Laurie dans ton espace client.",
      spaceCta: 'Ouvrir mon espace',
    },
    EN: {
      title: 'Find your path.',
      subtitle: 'Xena Horizon meets you where you are, not in a rigid service menu.',
      pillars: 'Choose your profile',
      pricesLabel: 'Starting price',
      learnMore: 'View services',
      available: 'Tailored services',
      forWho: 'For artists, creative entrepreneurs and organizations',
      book: 'Book an appointment',
      cantFind: "Don't see exactly what you need?",
      customText: "Every project is unique. Let's talk about a custom offer.",
      contactMe: 'Contact me',
      back: 'Back to profiles',
      benefits: ['Needs analysis', 'Personalized strategy', 'Rigorous follow-through'],
      howTitle: 'How it\nworks',
      howSubtitle: 'The same path for every person, from the first call to the follow-up.',
      spaceTitle: 'Already have a file open?',
      spaceText: 'Find your path, your documents and your exchanges with Laurie in your client space.',
      spaceCta: 'Open my space',
    },
  }[lang];

  const catalogue: Product[] = useMemo(() => {
    const publics = (produitsFirestore ?? []).filter((p) => p.isPublic && p.status === 'Active');
    return publics.length > 0 ? publics : SERVICES_REELS;
  }, [produitsFirestore]);

  const visibleOffers = useMemo(() => {
    if (!selected) return catalogue;
    return catalogue.filter((p) => !p.clientTypes || p.clientTypes.length === 0 || p.clientTypes.includes(selected));
  }, [catalogue, selected]);

  const selectedMeta = selected ? CLIENT_ARCHETYPES.find((a) => a.id === selected) : null;
  const selectedProfil = selected ? PROFILS_REELS.find((p) => p.id === selected) : null;
  const prixVedettes = SERVICES_REELS.filter((s) =>
    ['strategie-communication', 'redaction', 'abonnement-mensuel'].includes(s.id)
  );

  const goToContact = () => {
    if (onChangeView) {
      onChangeView('HOME');
      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="absolute inset-x-0 top-0 h-[600px] bg-iridescent-radial opacity-60 pointer-events-none -z-0" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-20 relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-end">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.05]">
            <span className="text-iridescent">{t.title}</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-xl">{t.subtitle}</p>
        </div>
        <div className="hidden lg:flex flex-col gap-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{t.pricesLabel}</p>
          {prixVedettes.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 border-b border-white/5 last:border-0 pb-4 last:pb-0">
              <span className="text-white font-medium text-sm">{nomOffre(s, lang)}</span>
              <span className="text-iridescent font-bold text-sm whitespace-nowrap">{prixAffiche(s, lang)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ARCHETYPE CHOOSER */}
      {!selected && (
        <div className="max-w-[1400px] mx-auto mb-24 relative">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.pillars}</span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CLIENT_ARCHETYPES.map((a) => {
              const profil = PROFILS_REELS.find((p) => p.id === a.id);
              const tagline = lang === 'FR' ? profil?.taglineFR : profil?.taglineEN;
              const title = lang === 'FR' ? profil?.titleFR : profil?.titleEN;
              const description = lang === 'FR' ? profil?.descriptionFR : profil?.descriptionEN;
              const details = lang === 'FR' ? profil?.detailsFR : profil?.detailsEN;

              return (
                <button
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  className="group relative text-left rounded-[28px] p-[1px] transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.4), rgba(52,211,153,0.4), rgba(59,130,246,0.4))' }}
                >
                  <div className="bg-slate-900/95 rounded-[27px] h-full p-8 flex flex-col gap-4 backdrop-blur-xl">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white shadow-iridescent-sm`}>
                      {a.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">{tagline}</p>
                      <h2 className="text-3xl font-serif font-bold text-white leading-tight">{title}</h2>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{description}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{details}</p>
                    <div className="mt-auto pt-2 flex items-center gap-2 text-cyan-300 font-bold text-sm group-hover:gap-3 transition-all">
                      {t.learnMore} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED ARCHETYPE: branded services + offer ladder */}
      {selectedMeta && (
        <div className="max-w-[1400px] mx-auto relative">
          <button
            onClick={() => setSelected(null)}
            className={`${GHOST_BUTTON_CLASSES} mb-12 text-sm`}
          >
            <ChevronLeft className="w-4 h-4" /> {t.back}
          </button>

          <GlassCard className="p-10 md:p-12 mb-16">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selectedMeta.gradient} flex items-center justify-center text-white shadow-iridescent flex-shrink-0`}>
                {selectedMeta.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">
                  {lang === 'FR' ? selectedProfil?.taglineFR : selectedProfil?.taglineEN}
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                  {lang === 'FR' ? selectedProfil?.titleFR : selectedProfil?.titleEN}
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {lang === 'FR' ? selectedProfil?.detailsFR : selectedProfil?.detailsEN}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {t.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {!loading && visibleOffers.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> {t.available}
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-900/80 backdrop-blur border border-white/10 rounded-[20px] p-6 hover:border-cyan-400/40 hover:shadow-iridescent-sm transition-all group flex flex-col"
                  >
                    <span className="self-start px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 mb-4">
                      {t.forWho}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {nomOffre(offer, lang)}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 flex-1">{descriptionOffre(offer, lang)}</p>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                      <span className="text-lg font-bold text-white">{prixAffiche(offer, lang)}</span>
                      <button
                        onClick={goToContact}
                        className="px-4 py-2 rounded-full bg-iridescent flex items-center gap-2 text-white text-xs font-bold shadow-iridescent-sm transition-transform hover:scale-105 min-h-[44px]"
                      >
                        {t.book} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* COMMENT ÇA SE PASSE */}
      <div className="max-w-[1400px] mx-auto mt-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.howSubtitle}</span>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-12 whitespace-pre-line">
          {t.howTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {ETAPES_PAR_DEFAUT.map((etape, i) => (
            <div key={etape.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[20px] p-6">
              <div className="w-10 h-10 rounded-full bg-iridescent flex items-center justify-center text-white font-bold text-sm shadow-iridescent-sm mb-4">
                {i + 1}
              </div>
              <h3 className="text-white font-bold mb-2">{etape.titre}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{etape.sous}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MON ESPACE */}
      <div className="max-w-[1400px] mx-auto mt-16">
        <GlassCard className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-iridescent flex items-center justify-center text-white shadow-iridescent-sm flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{t.spaceTitle}</h3>
              <p className="text-slate-400 text-sm">{t.spaceText}</p>
            </div>
          </div>
          {onChangeView ? (
            <button onClick={() => onChangeView('ESPACE_CLIENT')} className={`${ACTION_BUTTON_CLASSES} flex-shrink-0`}>
              {t.spaceCta} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <a href="/espace" className={`${ACTION_BUTTON_CLASSES} flex-shrink-0`}>
              {t.spaceCta} <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </GlassCard>
      </div>

      {/* CTA */}
      <div className="max-w-[1400px] mx-auto mt-32">
        <div className="bg-gradient-to-br from-slate-900 to-slate-900 rounded-[30px] p-10 md:p-14 border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="absolute top-0 right-0 w-72 h-72 bg-iridescent rounded-full blur-[100px] opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-iridescent rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">{t.cantFind}</h2>
            <p className="text-slate-300">{t.customText}</p>
          </div>
          <button onClick={goToContact} className={`${ACTION_BUTTON_CLASSES} relative z-10 flex-shrink-0`}>
            {t.contactMe}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicServices;
