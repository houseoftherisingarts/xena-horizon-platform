import React, { useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { FolderOpen, Settings2 } from 'lucide-react';
import { Dossier, Language } from '../types';
import { useCollection } from '../lib/firestore';
import { useDossierConfig } from '../lib/dossier';
import ListeDossiers from '../components/admin/dossiers/ListeDossiers';
import FicheDossier from '../components/admin/dossiers/FicheDossier';
import ReglagesDossier from '../components/admin/dossiers/ReglagesDossier';
import RessourcesAdmin from '../components/admin/dossiers/RessourcesAdmin';

interface AdminDossiersProps {
  lang: Language;
}

const t = {
  FR: { onglet: 'Dossiers', reglages: 'Réglages' },
  EN: { onglet: 'Client files', reglages: 'Settings' },
};

const AdminDossiers: React.FC<AdminDossiersProps> = ({ lang }) => {
  const tr = t[lang];
  const [ecran, setEcran] = useState<'dossiers' | 'reglages'>('dossiers');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  const { data: dossiers, loading } = useCollection<Dossier>('dossiers', [orderBy('derniereActiviteClient', 'desc')]);
  const config = useDossierConfig();

  const selected = selectedUid ? dossiers.find((d) => d.id === selectedUid) ?? null : null;

  return (
    <div className="w-full px-6 md:px-10 py-10 space-y-8">
      {!selected && (
        <div className="print:hidden flex gap-2 border-b border-white/5 pb-2">
          <button
            type="button"
            onClick={() => setEcran('dossiers')}
            className={`px-4 py-2 rounded-[12px] text-sm font-medium flex items-center gap-2 ${
              ecran === 'dossiers' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" /> {tr.onglet}
          </button>
          <button
            type="button"
            onClick={() => setEcran('reglages')}
            className={`px-4 py-2 rounded-[12px] text-sm font-medium flex items-center gap-2 ${
              ecran === 'reglages' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" /> {tr.reglages}
          </button>
        </div>
      )}

      {selected ? (
        <FicheDossier dossier={selected} config={config} lang={lang} onBack={() => setSelectedUid(null)} />
      ) : ecran === 'dossiers' ? (
        <ListeDossiers dossiers={dossiers} config={config} lang={lang} loading={loading} onSelect={setSelectedUid} />
      ) : (
        <div className="space-y-8">
          <ReglagesDossier lang={lang} />
          <RessourcesAdmin lang={lang} />
        </div>
      )}
    </div>
  );
};

export default AdminDossiers;
