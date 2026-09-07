import React from 'react';
import { ArrowUpRight, Headphones, BookOpen, Camera } from 'lucide-react';
import { PROJETS } from '../lib/contenu';
import { ACTION_BUTTON_CLASSES } from '../constants';
import { Language } from '../types';

interface PublicProjetsProps {
  lang: Language;
}

const ICONES: Record<string, React.ReactNode> = {
  balado: <Headphones className="w-6 h-6" />,
  livre: <BookOpen className="w-6 h-6" />,
  modele: <Camera className="w-6 h-6" />,
};

// modele.jpg est un portrait en pied (le visage occupe le haut du cadre) : object-top
// pour garder le visage visible au lieu du recadrage buste-aux-pieds par défaut.
// balado.jpg et livre-couverture.jpg sont des visuels carrés déjà centrés, vérifiés à l'œil.
const POSITION_IMAGE: Record<string, string> = {
  balado: 'object-center',
  livre: 'object-center',
  modele: 'object-top',
};

const PublicProjets: React.FC<PublicProjetsProps> = ({ lang }) => {
  const t = {
    FR: {
      eyebrow: 'Hors de la consultation',
      title: 'Les projets\nde Laurie',
      subtitle:
        "Un balado, un livre et un projet de modèle. Les mêmes questions qui habitent son accompagnement, vécues à sa manière.",
      links: 'Écouter et lire',
    },
    EN: {
      eyebrow: 'Beyond consulting',
      title: "Laurie's\nprojects",
      subtitle: 'A podcast, a book and a modeling project: the same questions that shape her work, lived her own way.',
      links: 'Listen and read',
    },
  }[lang];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="absolute inset-x-0 top-0 h-[500px] bg-iridescent-radial opacity-50 pointer-events-none -z-0" />

      <div className="max-w-[1400px] mx-auto mb-20 relative">
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-4">{t.eyebrow}</p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.05] whitespace-pre-line mb-6">
          {t.title}
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl">{t.subtitle}</p>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-20 md:space-y-28 relative">
        {PROJETS.map((projet, i) => {
          const inverse = i % 2 === 1;
          return (
            <article
              key={projet.id}
              className={`grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center ${
                inverse ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-iridescent rounded-[32px] opacity-20 blur-2xl pointer-events-none" />
                <img
                  src={projet.image}
                  alt={projet.titre}
                  className="relative w-full h-[340px] md:h-[440px] object-cover rounded-[24px] border border-white/10 shadow-2xl"
                />
              </div>

              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-iridescent flex items-center justify-center text-white shadow-iridescent-sm">
                  {ICONES[projet.id]}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">{projet.sousTitre}</p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">{projet.titre}</h2>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  {projet.description.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
                {projet.extra && (
                  <p className="text-lg font-bold text-white">{projet.extra}</p>
                )}
                {projet.liens.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {projet.liens.map((lien) => (
                      <a
                        key={lien.url}
                        href={lien.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${ACTION_BUTTON_CLASSES} text-sm py-2.5 px-5`}
                      >
                        {lien.label} <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default PublicProjets;
