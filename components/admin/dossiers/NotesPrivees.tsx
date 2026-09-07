import React, { useState } from 'react';
import { Lock, Trash2, Plus } from 'lucide-react';
import { GLASS_INPUT_CLASSES } from '../../../constants';
import { DossierNote, Language } from '../../../types';
import { dateCourte } from './util';

interface NotesPriveesProps {
  notes: DossierNote[];
  lang: Language;
  onAdd: (texte: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const t = {
  FR: {
    title: 'Notes privées',
    subtitle: 'Jamais visibles par la personne accompagnée.',
    placeholder: 'Ce que tu veux te rappeler…',
    add: 'Ajouter',
    empty: 'Aucune note pour le moment.',
    erreur: "La note n'a pas pu être enregistrée.",
  },
  EN: {
    title: 'Private notes',
    subtitle: 'Never visible to the person you support.',
    placeholder: 'What you want to remember…',
    add: 'Add',
    empty: 'No notes yet.',
    erreur: 'The note could not be saved.',
  },
};

const NotesPrivees: React.FC<NotesPriveesProps> = ({ notes, lang, onAdd, onDelete }) => {
  const tr = t[lang];
  const [texte, setTexte] = useState('');
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const ajouter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texte.trim() || busy) return;
    setBusy(true);
    setErreur(null);
    try {
      await onAdd(texte.trim());
      setTexte('');
    } catch {
      setErreur(tr.erreur);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-slate-950/50 rounded-[20px] border border-white/5 p-6">
      <h3 className="text-lg font-serif font-bold text-white mb-1 flex items-center gap-2">
        <Lock className="w-5 h-5 text-cyan-300" /> {tr.title}
      </h3>
      <p className="text-xs text-slate-500 mb-4">{tr.subtitle}</p>

      <form onSubmit={ajouter} className="space-y-2 mb-4">
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder={tr.placeholder}
          className={`${GLASS_INPUT_CLASSES} h-20 resize-none text-sm`}
        />
        {erreur && <p className="text-xs text-red-400" role="alert">{erreur}</p>}
        <button
          type="submit"
          disabled={busy || !texte.trim()}
          className="px-4 py-2 rounded-[10px] bg-white/10 hover:bg-white/15 text-white text-xs font-medium disabled:opacity-40 min-h-[44px] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {busy ? '…' : tr.add}
        </button>
      </form>

      <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
        {notes.length === 0 && <p className="text-sm text-slate-500 italic">{tr.empty}</p>}
        {notes.map((n) => (
          <div key={n.id} className="group flex items-start gap-2 bg-white/5 rounded-[12px] p-3 border border-white/5">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 whitespace-pre-wrap break-words">{n.texte}</p>
              <p className="text-[10px] text-slate-500 mt-1">{dateCourte(n.createdAt)}</p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(n.id)}
              aria-label={lang === 'FR' ? 'Supprimer la note' : 'Delete note'}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPrivees;
