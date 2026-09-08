import React, { useRef, useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { ArrowUp, ArrowDown, Trash2, Plus, Upload, Link2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language, Ressource } from '../../../types';
import { useCollection, createDoc, patchDoc, removeDoc, uploadFile, deleteFile, makeStoragePath } from '../../../lib/firestore';
import { Panneau, Champ, Bouton, Etiquette, Vide } from '../ui';

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

  const boutonLigne = 'p-2 rounded-champ hover:bg-papier text-gris min-h-[36px] min-w-[36px]';

  return (
    <Panneau titre={tr.title}>
      <p className="text-sm text-gris -mt-3 mb-4">{tr.subtitle}</p>

      {erreur && (
        <p className="text-sm text-rose border border-rose/30 bg-rose/5 rounded-champ p-3 flex items-center gap-2 mb-4" role="alert">
          <AlertCircle className="w-4 h-4" /> {erreur}
        </p>
      )}

      <div className="space-y-2">
        {ressources.length === 0 && <Vide titre={tr.aucune} />}
        {ressources.map((r, i) => (
          <div key={r.id} className="flex items-center gap-3 border border-filet rounded-champ p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-encre truncate">{r.titre}</p>
              {r.description && <p className="text-xs text-gris truncate">{r.description}</p>}
            </div>
            <button type="button" onClick={() => toggleVisible(r)} className="min-h-[36px]">
              <Etiquette tone={r.visibleClients ? 'accent' : 'neutre'} className="gap-1">
                {r.visibleClients ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {r.visibleClients ? tr.visible : tr.masquee}
              </Etiquette>
            </button>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => deplacer(i, -1)} className={boutonLigne} aria-label="up">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => deplacer(i, 1)} className={boutonLigne} aria-label="down">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => supprimer(r)} className={`${boutonLigne} hover:text-rose`} aria-label="delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={ajouter} className="pt-4 mt-4 border-t border-filet space-y-3">
        <div className="flex rounded-champ border border-filet overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 min-h-[44px] ${
              mode === 'url' ? 'bg-papier-2 text-encre' : 'text-gris'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" /> {tr.modeUrl}
          </button>
          <button
            type="button"
            onClick={() => setMode('fichier')}
            className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 min-h-[44px] ${
              mode === 'fichier' ? 'bg-papier-2 text-encre' : 'text-gris'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> {tr.modeFichier}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Champ label={tr.titrePlaceholder} value={titre} onChange={(e) => setTitre(e.target.value)} />
          <Champ label={tr.descPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {mode === 'url' ? (
          <Champ label={tr.urlPlaceholder} value={urlExterne} onChange={(e) => setUrlExterne(e.target.value)} />
        ) : (
          <input
            ref={fileRef}
            type="file"
            onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
            className="text-sm text-gris file:mr-3 file:px-4 file:py-2 file:rounded-champ file:border-0 file:bg-encre file:text-papier file:text-xs"
          />
        )}
        <Bouton type="submit" variante="primaire" icone={Plus} disabled={busy}>
          {busy ? '…' : tr.ajouter}
        </Bouton>
      </form>
    </Panneau>
  );
};

export default RessourcesAdmin;
