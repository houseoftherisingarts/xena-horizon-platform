import React, { useRef, useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { ArrowUp, ArrowDown, Trash2, Plus, Upload, Link2, Eye, EyeOff, AlertCircle, BookOpen } from 'lucide-react';
import { GLASS_INPUT_CLASSES, ACTION_BUTTON_CLASSES } from '../../../constants';
import { Language, Ressource } from '../../../types';
import { useCollection, createDoc, patchDoc, removeDoc, uploadFile, deleteFile, makeStoragePath } from '../../../lib/firestore';

interface RessourcesAdminProps {
  lang: Language;
}

const t = {
  FR: {
    title: 'Ressources partagées',
    subtitle: "Guides et gabarits visibles par les personnes accompagnées.",
    titrePlaceholder: 'Titre de la ressource',
    descPlaceholder: 'Description (facultatif)',
    modeUrl: 'Lien externe',
    modeFichier: 'Téléverser un fichier',
    urlPlaceholder: 'https://…',
    ajouter: 'Ajouter la ressource',
    visible: 'Visible',
    masquee: 'Masquée',
    aucune: 'Aucune ressource pour le moment.',
    erreurTitre: 'Le titre est requis.',
    erreurLien: 'Ajoute un lien ou choisis un fichier.',
    erreur: "L'action n'a pas fonctionné. Réessaie.",
  },
  EN: {
    title: 'Shared resources',
    subtitle: 'Guides and templates visible to the people you support.',
    titrePlaceholder: 'Resource title',
    descPlaceholder: 'Description (optional)',
    modeUrl: 'External link',
    modeFichier: 'Upload a file',
    urlPlaceholder: 'https://…',
    ajouter: 'Add resource',
    visible: 'Visible',
    masquee: 'Hidden',
    aucune: 'No resources yet.',
    erreurTitre: 'The title is required.',
    erreurLien: 'Add a link or choose a file.',
    erreur: 'That action failed. Try again.',
  },
};

const RessourcesAdmin: React.FC<RessourcesAdminProps> = ({ lang }) => {
  const tr = t[lang];
  const { data: ressources } = useCollection<Ressource>('ressources', [orderBy('ordre', 'asc')]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'url' | 'fichier'>('url');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [urlExterne, setUrlExterne] = useState('');
  const [fichier, setFichier] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const ajouter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    if (!titre.trim()) return setErreur(tr.erreurTitre);
    if (mode === 'url' && !urlExterne.trim()) return setErreur(tr.erreurLien);
    if (mode === 'fichier' && !fichier) return setErreur(tr.erreurLien);

    setBusy(true);
    try {
      let url = urlExterne.trim();
      let chemin: string | undefined;
      if (mode === 'fichier' && fichier) {
        const path = makeStoragePath('ressources', fichier.name);
        const res = await uploadFile(path, fichier);
        url = res.url;
        chemin = res.path;
      }
      await createDoc<Omit<Ressource, 'id'>>('ressources', {
        titre: titre.trim(),
        description: description.trim() || undefined,
        url,
        chemin,
        visibleClients: true,
        ordre: ressources.length,
      } as any);
      setTitre('');
      setDescription('');
      setUrlExterne('');
      setFichier(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setErreur(tr.erreur);
    } finally {
      setBusy(false);
    }
  };

  const toggleVisible = async (r: Ressource) => {
    try {
      await patchDoc('ressources', r.id, { visibleClients: !r.visibleClients });
    } catch {
      setErreur(tr.erreur);
    }
  };

  const supprimer = async (r: Ressource) => {
    try {
      await removeDoc('ressources', r.id);
      if (r.chemin) await deleteFile(r.chemin).catch(() => {});
    } catch {
      setErreur(tr.erreur);
    }
  };

  const deplacer = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= ressources.length) return;
    const a = ressources[i];
    const b = ressources[j];
    try {
      await Promise.all([patchDoc('ressources', a.id, { ordre: b.ordre }), patchDoc('ressources', b.id, { ordre: a.ordre })]);
    } catch {
      setErreur(tr.erreur);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 space-y-4">
      <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-cyan-300" /> {tr.title}
      </h2>
      <p className="text-sm text-slate-400">{tr.subtitle}</p>

      {erreur && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4" /> {erreur}
        </p>
      )}

      <div className="space-y-2">
        {ressources.length === 0 && <p className="text-sm text-slate-500">{tr.aucune}</p>}
        {ressources.map((r, i) => (
          <div key={r.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[15px] p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{r.titre}</p>
              {r.description && <p className="text-xs text-slate-500 truncate">{r.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => toggleVisible(r)}
              className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 min-h-[36px] ${
                r.visibleClients ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-white/15 text-slate-500'
              }`}
            >
              {r.visibleClients ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {r.visibleClients ? tr.visible : tr.masquee}
            </button>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => deplacer(i, -1)} className="p-2 rounded-[10px] hover:bg-white/10 text-slate-400 min-h-[36px] min-w-[36px]" aria-label="up"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => deplacer(i, 1)} className="p-2 rounded-[10px] hover:bg-white/10 text-slate-400 min-h-[36px] min-w-[36px]" aria-label="down"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => supprimer(r)} className="p-2 rounded-[10px] hover:bg-red-500/10 text-red-400 min-h-[36px] min-w-[36px]" aria-label="delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={ajouter} className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex rounded-[15px] border border-white/10 overflow-hidden w-fit">
          <button type="button" onClick={() => setMode('url')} className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 ${mode === 'url' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
            <Link2 className="w-3.5 h-3.5" /> {tr.modeUrl}
          </button>
          <button type="button" onClick={() => setMode('fichier')} className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 ${mode === 'fichier' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
            <Upload className="w-3.5 h-3.5" /> {tr.modeFichier}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={tr.titrePlaceholder} className={`${GLASS_INPUT_CLASSES} text-sm`} />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={tr.descPlaceholder} className={`${GLASS_INPUT_CLASSES} text-sm`} />
        </div>
        {mode === 'url' ? (
          <input value={urlExterne} onChange={(e) => setUrlExterne(e.target.value)} placeholder={tr.urlPlaceholder} className={`${GLASS_INPUT_CLASSES} text-sm`} />
        ) : (
          <input ref={fileRef} type="file" onChange={(e) => setFichier(e.target.files?.[0] ?? null)} className="text-sm text-slate-300 file:mr-3 file:px-4 file:py-2 file:rounded-[10px] file:border-0 file:bg-white/10 file:text-white file:text-xs" />
        )}
        <button type="submit" disabled={busy} className={`${ACTION_BUTTON_CLASSES} disabled:opacity-50`}>
          <Plus className="w-4 h-4" /> {busy ? '…' : tr.ajouter}
        </button>
      </form>
    </div>
  );
};

export default RessourcesAdmin;
