import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Mail, Instagram, Linkedin, CheckCircle, AlertCircle, Quote as QuoteIcon } from 'lucide-react';
import { CLIENT_ARCHETYPES, ACTION_BUTTON_CLASSES, GHOST_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { createDoc } from '../lib/firestore';
import { CITATION, CLIENTS_CONFIANCE, PROFILS_REELS, PROJETS, TEMOIGNAGES } from '../lib/contenu';
import { HomeBlock, HomeHeroBlock, HomeServicesBlock, HomeStatsBlock, HomeContactBlock, HomeTextBlock, HomeImageBlock, Language } from '../types';

interface PublicHomeProps {
  blocks: HomeBlock[];
  lang: Language;
}

/**
 * Traductions anglaises des blocs par défaut de BLOCS_ACCUEIL (lib/contenu.ts), par id de bloc.
 * HomeBlock (types.ts) ne porte que le français : si Laurie personnalise un bloc depuis l'admin,
 * l'id ne change pas mais le champ manquant ici retombe simplement sur son propre texte (repli sûr).
 */
const HOME_EN: Record<string, Record<string, string>> = {
  'hero-1': {
    headline: 'Live from your art\nwithout losing your voice',
    subheadline:
      'Fifteen years supporting artists of every discipline and creative people, so the business world understands them and they can finally live from their art.',
    ctaText: 'Book an appointment',
  },
  'services-1': {
    title: 'How we can\nwork together',
    subtitle: 'Three profiles, the same listening ear: artist, creative entrepreneur or organization.',
  },
  'stats-1': {
    stat1Value: '15 years',
    stat1Label: 'Of experience',
    stat2Value: 'Every discipline',
    stat2Label: 'Dance, writing, theatre, music, singing, painting, photography, circus',
    stat3Label: 'Areas served',
  },
  'contact-1': {
    title: "Let's talk about\nyour next step",
    text: "Write to me and I'll get back to you quickly. Let's see together if we're a good fit to work together.",
  },
};

const PublicHome: React.FC<PublicHomeProps> = ({ blocks, lang }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactBusy, setContactBusy] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  /** Texte d'un champ de bloc selon la langue, avec repli sur le français du bloc lui-même. */
  const tr = (blockId: string, field: string, fallback: string): string =>
    lang === 'EN' ? HOME_EN[blockId]?.[field] ?? fallback : fallback;

  const t = {
    FR: {
      learnMore: 'En savoir plus',
      explore: 'Voir les services',
      sendMessage: 'Envoyer le message',
      sending: 'Envoi en cours…',
      name: 'Nom complet',
      message: 'Message',
      emailHolder: 'votre@email.com',
      help: 'Comment puis-je vous aider ?',
      successTitle: 'Message envoyé !',
      successText: 'Merci. Je vous reviens sous peu.',
      errorText: "Désolée, l'envoi a échoué. Réessayez ou écrivez-moi directement.",
      aboutEyebrow: 'Laurie Belhumeur, fondatrice',
      aboutTitle: 'Brève histoire\nd\'un tout',
      aboutMission: 'Faire ressortir la créativité partout où elle existe est ma mission.',
      heroCardText: 'Tu vois la vie comme un artiste ?',
      testimonialLabel: 'Un témoignage',
      trustLabel: 'Ils lui ont fait confiance',
      projectsLabel: 'Les projets',
      projectsTitle: 'En dehors de\nl\'accompagnement',
      seeProject: 'Découvrir',
      seeAllProjects: 'Voir tous les projets',
    },
    EN: {
      learnMore: 'Learn More',
      explore: 'See services',
      sendMessage: 'Send Message',
      sending: 'Sending…',
      name: 'Full Name',
      message: 'Message',
      emailHolder: 'your@email.com',
      help: 'How can I help you?',
      successTitle: 'Message sent!',
      successText: "Thanks. I'll get back to you shortly.",
      errorText: 'Sorry, the send failed. Try again or email me directly.',
      aboutEyebrow: 'Laurie Belhumeur, Founder',
      aboutTitle: 'Brief story\nof a whole',
      aboutMission: 'Bringing out creativity wherever it exists is my mission.',
      heroCardText: 'Do you see life like an artist?',
      testimonialLabel: 'A testimonial',
      trustLabel: 'They trusted her',
      projectsLabel: 'Projects',
      projectsTitle: 'Beyond the\nconsulting work',
      seeProject: 'Discover',
      seeAllProjects: 'See all projects',
    }
  }[lang];

  const aboutBodyFR = [
    "J'ai toujours été habitée par un désir profond d'accompagner les artistes de toutes disciplines confondues (danse, écriture, théâtre, musique, chant, peinture, photo, cirque, etc.) ainsi que les créatifs à comprendre et être compris par le monde des affaires.",
    "Je vise à apporter du changement dans le milieu artistique et culturel afin que les artistes puissent vivre de leur art.",
    "Mon approche se veut personnalisée et adaptée à chaque artiste que j'accompagne, fondée sur mon expérience, mes analyses et mes compétences acquises au cours des quinze dernières années.",
  ];
  const aboutBodyEN = [
    'I have always been driven by a deep desire to support artists from all disciplines (dance, writing, theater, music, singing, painting, photography, circus, and more) as well as creative people, to understand and be understood by the business world.',
    'I aim to bring change to the artistic and cultural environment so that artists can make a living from their art.',
    'My approach is personalized and tailored to each artist I work with, drawing on my experience, insights, and skills acquired over the past fifteen years.',
  ];
  const aboutBody = lang === 'FR' ? aboutBodyFR : aboutBodyEN;
  const temoignage = TEMOIGNAGES[0];
  const temoignageTexte = lang === 'FR' ? temoignage?.texteFR : temoignage?.texteEN;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactBusy) return;
    setContactBusy(true);
    setContactStatus('idle');
    try {
      await createDoc('leads', {
        name: contactName.trim(),
        email: contactEmail.trim(),
        message: contactMessage.trim(),
        source: 'public-home-contact',
        read: false,
        archived: false,
      });
      setContactStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err) {
      console.error('Contact form submit failed', err);
      setContactStatus('error');
    } finally {
      setContactBusy(false);
    }
  };

  return (
    <div className="space-y-24 lg:space-y-32 pb-24">
      {blocks.map(block => {
        
        // --- HERO ---
        if (block.type === 'HERO') {
          const b = block as HomeHeroBlock;
          return (
            <section key={b.id} className="relative min-h-[90vh] flex items-center px-6 pt-20 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/laurie-scene.webp')] bg-cover bg-center opacity-15 pointer-events-none"></div>
              <div className="absolute inset-0 bg-iridescent-radial opacity-70 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950 pointer-events-none"></div>

              <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center relative z-10">
                <div className="space-y-8 text-center lg:text-left">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iridescent-soft border border-cyan-400/30 text-cyan-200 text-sm font-bold tracking-widest uppercase">
                     <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
                     {b.tagline}
                   </div>

                   <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.05] whitespace-pre-line">
                     <span className="text-iridescent">{b.headline}</span>
                   </h1>

                   <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                     {b.subheadline}
                   </p>

                   <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                     <button className={ACTION_BUTTON_CLASSES} onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>
                       {b.ctaText}
                     </button>
                     <button className={GHOST_BUTTON_CLASSES}>
                       {t.learnMore}
                     </button>
                   </div>
                </div>

                <div className="relative h-[500px] lg:h-[600px] hidden lg:block group">
                  <div className="absolute -inset-2 bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift rounded-[44px] opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-iridescent rounded-[40px] rotate-3 opacity-30 group-hover:rotate-6 transition-transform duration-500"></div>
                  <img
                    src={b.imageUrl}
                    alt="Portrait"
                    className="absolute inset-0 w-full h-full object-cover rounded-[40px] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-8 left-8 right-8 p-6 bg-slate-900/80 backdrop-blur-md rounded-[20px] border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <p className="text-white font-serif text-lg">Tu vois la vie comme un artiste ?</p>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // --- SERVICES PREVIEW ---
        if (block.type === 'SERVICES_PREVIEW') {
          const b = block as HomeServicesBlock;
          return (
            <section key={b.id} className="px-6">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 whitespace-pre-line">{b.title}</h2>
                    <p className="text-slate-400 text-lg">{b.subtitle}</p>
                  </div>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {CLIENT_ARCHETYPES.map((a) => {
                     const profil = PROFILS_REELS.find((p) => p.id === a.id);
                     const tagline = lang === 'FR' ? profil?.taglineFR : profil?.taglineEN;
                     const title = lang === 'FR' ? profil?.titleFR : profil?.titleEN;
                     const description = lang === 'FR' ? profil?.descriptionFR : profil?.descriptionEN;
                     return (
                       <a
                         key={a.id}
                         href="/services"
                         className="group relative overflow-hidden rounded-[30px] bg-slate-900 border border-white/10 hover:border-cyan-400/40 hover:shadow-iridescent-sm transition-all duration-500 p-8 flex flex-col"
                       >
                          <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                          <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white shadow-iridescent-sm group-hover:scale-110 transition-transform duration-300 mb-5`}>
                            {a.icon}
                          </div>
                          <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">{tagline}</p>
                          <h3 className="relative z-10 text-2xl font-bold text-white mb-3">{title}</h3>
                          <p className="relative z-10 text-slate-400 group-hover:text-slate-200 transition-colors mb-6">{description}</p>
                          <span className="relative z-10 mt-auto inline-flex items-center gap-2 text-sm font-bold text-cyan-300 group-hover:gap-3 transition-all">
                            {t.explore} <ArrowRight className="w-4 h-4" />
                          </span>
                       </a>
                     );
                   })}
                </div>
              </div>
            </section>
          );
        }

        // --- STATS ---
        if (block.type === 'STATS') {
          const b = block as HomeStatsBlock;
          return (
            <section key={b.id} className="py-16 lg:py-20 relative">
               <div className="absolute inset-0 bg-iridescent-soft opacity-40 pointer-events-none border-y border-white/5"></div>
               <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                  <div className="space-y-2">
                     <h4 className="text-4xl md:text-5xl font-bold font-serif text-iridescent">{b.stat1Value}</h4>
                     <p className="text-cyan-200 uppercase tracking-widest text-sm">{b.stat1Label}</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-4xl md:text-5xl font-bold font-serif text-iridescent">{b.stat2Value}</h4>
                     <p className="text-cyan-200 uppercase tracking-widest text-sm">{b.stat2Label}</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-4xl md:text-5xl font-bold font-serif text-iridescent">{b.stat3Value}</h4>
                     <p className="text-cyan-200 uppercase tracking-widest text-sm">{b.stat3Label}</p>
                  </div>
               </div>
            </section>
          );
        }

        // --- CONTACT (précédé des sections fixes : à propos, témoignage, confiance, projets, citation) ---
        if (block.type === 'CONTACT') {
          const b = block as HomeContactBlock;
          return (
            <React.Fragment key={b.id}>
              {/* --- BRÈVE HISTOIRE D'UN TOUT (à propos) --- */}
              <section id="about" className="px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-center">
                  <div className="relative order-2 lg:order-1">
                    <div className="absolute -inset-3 bg-iridescent rounded-[32px] opacity-25 blur-2xl pointer-events-none" />
                    <img
                      src="/images/laurie-apropos.jpg"
                      alt="Laurie Belhumeur"
                      className="relative w-full h-[420px] lg:h-[520px] object-cover rounded-[24px] border border-white/10 shadow-2xl"
                    />
                  </div>
                  <div className="order-1 lg:order-2 space-y-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{t.aboutEyebrow}</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight whitespace-pre-line">
                      {t.aboutTitle}
                    </h2>
                    <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed">
                      {aboutBody.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <p className="text-lg md:text-xl font-serif text-iridescent">{t.aboutMission}</p>
                  </div>
                </div>
              </section>

              {/* --- TÉMOIGNAGE + ILS LUI ONT FAIT CONFIANCE (deux colonnes à 1440) --- */}
              {temoignage && temoignageTexte && (
                <section className="px-6">
                  <div className="max-w-[1400px] mx-auto">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
                      <div className="absolute top-0 right-0 w-72 h-72 bg-iridescent rounded-full blur-[110px] opacity-20 pointer-events-none" />
                      <div className="relative z-10 p-8 md:p-14">
                        <div className="w-12 h-12 rounded-2xl bg-iridescent flex items-center justify-center text-white shadow-iridescent-sm mb-6">
                          <QuoteIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-4">{t.testimonialLabel}</p>
                        <p className="text-xl md:text-2xl font-serif text-white leading-relaxed">{temoignageTexte}</p>
                      </div>
                      <div className="relative z-10 bg-white/5 border-t lg:border-t-0 lg:border-l border-white/10 p-8 md:p-14 flex flex-col justify-between gap-10">
                        <div>
                          <p className="text-white font-serif text-xl font-bold mb-1">{temoignage.nom}</p>
                          <p className="text-slate-400">{temoignage.role}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t.trustLabel}</p>
                          <ul className="space-y-2">
                            {CLIENTS_CONFIANCE.map((nom) => (
                              <li key={nom} className="text-slate-300 font-serif">{nom}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* --- APERÇU DES PROJETS --- */}
              <section className="px-6">
                <div className="max-w-[1400px] mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-3">{t.projectsLabel}</p>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white whitespace-pre-line">
                        {t.projectsTitle}
                      </h2>
                    </div>
                    <a href="/projets" className={`${GHOST_BUTTON_CLASSES} text-sm`}>
                      {t.seeAllProjects} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROJETS.map((p) => (
                      <a
                        key={p.id}
                        href="/projets"
                        className="group relative h-[340px] overflow-hidden rounded-[24px] bg-slate-900 border border-white/10 hover:border-cyan-400/40 hover:shadow-iridescent-sm transition-all duration-500 block focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <img
                          src={p.image}
                          alt={p.titre}
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="relative z-10 h-full p-7 flex flex-col justify-end">
                          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">{p.sousTitre}</p>
                          <h3 className="text-2xl font-serif font-bold text-white mb-3">{p.titre}</h3>
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                            {t.seeProject} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </section>

              {/* --- CITATION --- */}
              <section className="px-6">
                <div className="max-w-[1400px] mx-auto">
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-[2fr_1px_1fr] gap-8 lg:gap-10 items-center">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-white leading-snug">
                      « {lang === 'FR' ? CITATION.texteFR : CITATION.texteEN} »
                    </p>
                    <div className="hidden lg:block h-full w-px bg-iridescent opacity-40" />
                    <p className="text-slate-400 text-sm uppercase tracking-widest lg:text-right">
                      {lang === 'FR' ? CITATION.source : CITATION.sourceEN}
                    </p>
                  </div>
                </div>
              </section>

            <section id="contact" className="px-6">
              <div className="max-w-[1400px] mx-auto">
                <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-white/10 rounded-[40px] p-8 md:p-16 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-iridescent rounded-full blur-[120px] opacity-25 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-iridescent rounded-full blur-[100px] opacity-15 pointer-events-none"></div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-8">
                      <div>
                         <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                           <span className="text-iridescent">{b.title}</span>
                         </h2>
                         <p className="text-lg md:text-xl text-slate-300">{b.text}</p>
                      </div>

                      <div className="space-y-6">
                         <a href={`mailto:${b.email}`} className="flex items-center gap-4 text-white hover:text-cyan-300 transition-colors group">
                           <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-iridescent transition-colors">
                             <Mail className="w-5 h-5" />
                           </div>
                           <span className="text-lg">{b.email}</span>
                         </a>
                         <div className="flex gap-4 pt-4">
                           <button aria-label="Instagram" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-cyan-400/60 hover:bg-iridescent-soft transition-all">
                             <Instagram className="w-5 h-5" />
                           </button>
                           <button aria-label="LinkedIn" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-cyan-400/60 hover:bg-iridescent-soft transition-all">
                             <Linkedin className="w-5 h-5" />
                           </button>
                         </div>
                      </div>
                    </div>
      
                    <form className="space-y-6 bg-white/5 p-8 rounded-[30px] border border-white/5" onSubmit={handleContactSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="contact-name" className="text-sm font-medium text-slate-300 ml-2">{t.name}</label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className={`${GLASS_INPUT_CLASSES} bg-slate-900/50`}
                            placeholder={t.name}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="contact-email" className="text-sm font-medium text-slate-300 ml-2">Email</label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className={`${GLASS_INPUT_CLASSES} bg-slate-900/50`}
                            placeholder={t.emailHolder}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="contact-message" className="text-sm font-medium text-slate-300 ml-2">{t.message}</label>
                        <textarea
                          id="contact-message"
                          required
                          minLength={5}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className={`${GLASS_INPUT_CLASSES} h-32 resize-none bg-slate-900/50`}
                          placeholder={t.help}
                        />
                      </div>

                      <div aria-live="polite">
                        {contactStatus === 'success' && (
                          <div className="flex items-start gap-3 p-4 rounded-[15px] bg-emerald-500/10 border border-emerald-400/30 text-emerald-200">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">{t.successTitle}</p>
                              <p className="text-sm text-emerald-300">{t.successText}</p>
                            </div>
                          </div>
                        )}
                        {contactStatus === 'error' && (
                          <div className="flex items-start gap-3 p-4 rounded-[15px] bg-red-500/10 border border-red-400/30 text-red-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{t.errorText}</p>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={contactBusy}
                        className={`w-full ${ACTION_BUTTON_CLASSES} justify-center py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {contactBusy ? t.sending : t.sendMessage}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            </React.Fragment>
          );
        }

        // --- SIMPLE TEXT ---
        if (block.type === 'TEXT') {
          const b = block as HomeTextBlock;
          return (
             <section key={b.id} className="px-6 py-20 max-w-4xl mx-auto text-center">
                <p className="text-xl text-slate-300 leading-relaxed whitespace-pre-line">{b.content}</p>
             </section>
          );
        }

        // --- FULL IMAGE ---
        if (block.type === 'IMAGE') {
          const b = block as HomeImageBlock;
          return (
             <section key={b.id} className="w-full">
                <img src={b.url} alt="Section" className="w-full h-[400px] lg:h-[500px] object-cover" />
                {b.caption && <p className="text-center text-slate-500 mt-4">{b.caption}</p>}
             </section>
          );
        }

        return null;
      })}
    </div>
  );
};

export default PublicHome;