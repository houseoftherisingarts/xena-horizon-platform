import React from 'react';
import { orderBy, where } from 'firebase/firestore';
import { Download, FileText } from 'lucide-react';
import { useCollection } from '../../lib/firestore';
import { Language, Ressource } from '../../types';
import { useTextes } from '../../lib/textes';

interface RessourcesProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    ressourcesTitre: 'Ressources',
    ressourcesSous: 'Les guides et gabarits que Laurie partage avec toi.',
    ressourcesVide: 'Rien de partagé pour le moment.',
    ressourcesTelecharger: 'Télécharger',
  },
  EN: {
    ressourcesTitre: 'Resources',
    ressourcesSous: 'The guides and templates Laurie shares with you.',
    ressourcesVide: 'Nothing shared yet.',
    ressourcesTelecharger: 'Download',
  },
};

const Ressources: React.FC<RessourcesProps> = ({ lang }) => {
  const { data: ressources, loading } = useCollection<Ressource>('ressources', [
    where('visibleClients', '==', true),
    orderBy('ordre', 'asc'),
  ]);

  const t = useTextes('espaceParcours', TEXTES, lang);

  return (
    <section data-tx-scope="espaceParcours" className="border-t border-filet pt-8">
      <h2 className="font-serif text-h3 text-encre mb-1">{t.ressourcesTitre}</h2>
      <p className="text-gris text-sm mb-8 mesure">{t.ressourcesSous}</p>

      {!loading && ressources.length === 0 && <p className="text-gris text-sm py-6">{t.ressourcesVide}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-col gap-y-3">
        {ressources.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 border-b border-filet py-4 hover:border-rose transition-colors group"
          >
            <span className="w-10 h-10 rounded-pilule border border-filet text-encre flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-encre font-semibold text-sm">{r.titre}</p>
              {r.description && <p className="text-gris text-xs mt-1">{r.description}</p>}
              <span className="inline-flex items-center gap-1.5 text-rose text-xs font-semibold mt-2 group-hover:gap-2.5 transition-all">
                <Download className="w-3.5 h-3.5" /> {t.ressourcesTelecharger}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Ressources;
