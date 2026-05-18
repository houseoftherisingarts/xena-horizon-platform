import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle, Sparkles, ChevronLeft } from 'lucide-react';
import {
  CLIENT_ARCHETYPES,
  MOCK_PRODUCTS,
  ACTION_BUTTON_CLASSES,
  GHOST_BUTTON_CLASSES,
  resolveProductForArchetype,
} from '../constants';
import GlassCard from '../components/GlassCard';
import { ClientArchetype, Language } from '../types';

interface PublicServicesProps {
  lang: Language;
}

const PublicServices: React.FC<PublicServicesProps> = ({ lang }) => {
  const [selected, setSelected] = useState<ClientArchetype | null>(null);

  const t = {
    FR: {
      title: 'Trouvez votre chemin.',
      subtitle: "Xena Horizon vous accompagne selon votre réalité — pas selon une grille de services rigide.",
      pillars: 'Choisissez votre profil',
      learnMore: 'Voir les services',
      available: 'Services adaptés',
      free: 'Gratuit',
      offered: 'Offert',
      service: 'Service',
      product: 'Produit',
      cantFind: "Vous ne trouvez pas exactement ce qu'il vous faut ?",
      customText: "Chaque projet est unique. Discutons d'une offre sur mesure.",
      contactMe: 'Me contacter',
      back: 'Retour aux profils',
      benefits: ['Analyse des besoins', 'Stratégie personnalisée', 'Suivi rigoureux'],
    },
    EN: {
      title: 'Find your path.',
      subtitle: 'Xena Horizon meets you where you are — not in a rigid service menu.',
      pillars: 'Choose your profile',
      learnMore: 'View services',
      available: 'Tailored services',
      free: 'Free',
      offered: 'Offered',
      service: 'Service',
      product: 'Product',
      cantFind: "Don't see exactly what you need?",
      customText: "Every project is unique. Let's talk about a custom offer.",
      contactMe: 'Contact me',
      back: 'Back to profiles',
      benefits: ['Needs analysis', 'Personalized strategy', 'Rigorous follow-through'],
    },
  }[lang];

  const visibleOffers = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (!p.isPublic) return false;
      if (!selected) return true;
      // If clientTypes is unset, treat as visible to all
      if (!p.clientTypes || p.clientTypes.length === 0) return true;
      return p.clientTypes.includes(selected);
    });
  }, [selected]);

  const selectedMeta = selected ? CLIENT_ARCHETYPES.find((a) => a.id === selected) : null;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="absolute inset-x-0 top-0 h-[600px] bg-iridescent-radial opacity-60 pointer-events-none -z-0" />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-16 text-center relative">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.05]">
          <span className="text-iridescent">{t.title}</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">{t.subtitle}</p>
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
              const title = lang === 'FR' ? a.titleFR : a.titleEN;
              const subtitle = lang === 'FR' ? a.subtitleFR : a.subtitleEN;
              const tagline = lang === 'FR' ? a.taglineFR : a.taglineEN;
              const description = lang === 'FR' ? a.descriptionFR : a.descriptionEN;
              const details = lang === 'FR' ? a.detailsFR : a.detailsEN;

              return (
                <button
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  className="group relative text-left rounded-[28px] p-[1px] transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.4), rgba(52,211,153,0.4), rgba(59,130,246,0.4))' }}
                >
                  <div className="bg-slate-900/95 rounded-[27px] h-full p-8 flex flex-col gap-5 backdrop-blur-xl">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white shadow-iridescent-sm`}>
                      {a.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">{tagline}</p>
                      <h2 className="text-3xl font-serif font-bold text-white leading-tight">{title}</h2>
                      {subtitle && <p className="text-sm italic text-emerald-300 mt-1">{subtitle}</p>}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{description}</p>
                    <p className="text-slate-400 text-sm leading-relaxed flex-1">{details}</p>
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm pt-2 group-hover:gap-3 transition-all">
                      {t.learnMore} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED ARCHETYPE — branded services + offer ladder */}
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
                  {lang === 'FR' ? selectedMeta.taglineFR : selectedMeta.taglineEN}
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                  {lang === 'FR' ? selectedMeta.titleFR : selectedMeta.titleEN}
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  {lang === 'FR' ? selectedMeta.detailsFR : selectedMeta.detailsEN}
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

          {visibleOffers.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> {t.available}
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleOffers.map((offer) => {
                  const resolved = resolveProductForArchetype(offer, selected);
                  return (
                    <div
                      key={offer.id}
                      className="bg-slate-900/80 backdrop-blur border border-white/10 rounded-[20px] p-6 hover:border-cyan-400/40 hover:shadow-iridescent-sm transition-all group flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            offer.category === 'Service'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-cyan-500/10 text-cyan-300'
                          }`}
                        >
                          {offer.category === 'Service' ? t.service : t.product}
                        </span>
                        {resolved.price === 0 && (
                          <span className="text-emerald-300 text-xs font-bold">{t.free}</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {resolved.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-6 flex-1">{resolved.description}</p>

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          {resolved.price > 0 ? `${resolved.price} $` : t.offered}
                        </span>
                        <button
                          aria-label="Open"
                          className="w-9 h-9 rounded-full bg-iridescent flex items-center justify-center text-white shadow-iridescent-sm transition-transform group-hover:scale-110"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-32 text-center bg-gradient-to-br from-slate-900 to-slate-900 rounded-[30px] p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-iridescent rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-iridescent rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">{t.cantFind}</h2>
          <p className="text-slate-300 mb-8">{t.customText}</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className={`${ACTION_BUTTON_CLASSES} mx-auto`}
          >
            {t.contactMe}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicServices;
