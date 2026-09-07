import React from 'react';
import { orderBy, where } from 'firebase/firestore';
import { Download, FileText } from 'lucide-react';
import { useCollection } from '../../lib/firestore';
import { Language, Ressource } from '../../types';

interface RessourcesProps {
  lang: Language;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const Ressources: React.FC<RessourcesProps> = ({ lang }) => {
  const { data: ressources, loading } = useCollection<Ressource>('ressources', [
    where('visibleClients', '==', true),
    orderBy('ordre', 'asc'),
  ]);

  const t = {
    FR: {
      titre: 'Ressources',
      sous: 'Les guides et gabarits que Laurie partage avec toi.',
      vide: 'Rien de partagé pour le moment.',
      telecharger: 'Télécharger',
    },
    EN: {
      titre: 'Resources',
      sous: 'The guides and templates Laurie shares with you.',
      vide: 'Nothing shared yet.',
      telecharger: 'Download',
    },
  }[lang];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-xl p-6 md:p-10">
      <h2 className="text-lg font-serif font-bold text-white mb-1">{t.titre}</h2>
      <p className="text-slate-400 text-sm mb-8">{t.sous}</p>

      {!loading && ressources.length === 0 && <p className="text-slate-500 text-sm py-6">{t.vide}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ressources.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-start gap-4 bg-white/5 border border-white/10 rounded-[16px] p-5 hover:bg-white/10 hover:border-cyan-400/40 transition-all group ${FOCUS_RING}`}
          >
            <span className="w-10 h-10 rounded-full bg-iridescent-soft border border-cyan-400/30 text-cyan-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{r.titre}</p>
              {r.description && <p className="text-slate-400 text-xs mt-1">{r.description}</p>}
              <span className="inline-flex items-center gap-1.5 text-cyan-300 text-xs font-bold mt-2 group-hover:gap-2.5 transition-all">
                <Download className="w-3.5 h-3.5" /> {t.telecharger}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Ressources;
