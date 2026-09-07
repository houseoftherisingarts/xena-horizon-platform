import React from 'react';
import { Check } from 'lucide-react';
import { indexEtape } from '../../lib/dossier';
import { Dossier, DossierConfig, Language } from '../../types';

interface ParcoursProps {
  dossier: Dossier;
  config: DossierConfig;
  lang: Language;
}

const Parcours: React.FC<ParcoursProps> = ({ dossier, config, lang }) => {
  const idx = indexEtape(config.etapes, dossier.etape);

  const t = {
    FR: { titre: 'Ton parcours', sous: 'Le chemin entre le premier contact et le suivi.' },
    EN: { titre: 'Your journey', sous: 'The road between the first contact and the follow-up.' },
  }[lang];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-xl p-6 md:p-10">
      <h2 className="text-lg font-serif font-bold text-white mb-1">{t.titre}</h2>
      <p className="text-slate-400 text-sm mb-8">{t.sous}</p>

      <ol className="relative">
        {config.etapes.map((etape, i) => {
          const faite = i < idx;
          const ici = i === idx;
          return (
            <li key={etape.id} className="relative pl-12 pb-10 last:pb-0">
              {i < config.etapes.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[15px] top-8 bottom-[-8px] w-px ${faite ? 'bg-cyan-400/50' : 'bg-white/10'}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  faite
                    ? 'bg-iridescent text-white'
                    : ici
                    ? 'bg-iridescent-soft border-2 border-cyan-400 text-cyan-200 shadow-iridescent-sm'
                    : 'bg-white/5 border border-white/15 text-slate-500'
                }`}
              >
                {faite ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <p className={`font-semibold ${ici ? 'text-white text-lg' : faite ? 'text-slate-200' : 'text-slate-400'}`}>{etape.titre}</p>
              <p className={`text-sm mt-1 ${ici ? 'text-slate-300' : 'text-slate-500'}`}>{etape.sous}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Parcours;
