import React, { useState } from 'react';
import { Lock, Trash2, Plus } from 'lucide-react';
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

const CHAMP =
  'w-full bg-papier-2 border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose h-20 resize-none text-sm';

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
    <div className="bg-papier border border-filet rounded-champ p-6">
      <h3 className="font-sans font-semibold text-encre mb-1 flex items-center gap-2">
        <Lock className="w-4 h-4 text-rose" aria-hidden="true" /> {tr.title}
      </h3>
      <p className="text-xs text-gris mb-4">{tr.subtitle}</p>

      <form onSubmit={ajouter} className="space-y-2 mb-4">
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder={tr.placeholder}
          className={CHAMP}
        />
        {erreur && <p className="text-xs text-rose" role="alert">{erreur}</p>}
        <button
          type="submit"
          disabled={busy || !texte.trim()}
          className="px-4 rounded-pilule border border-filet text-encre hover:border-encre text-xs font-medium disabled:opacity-40 min-h-[44px] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> {busy ? '…' : tr.add}
        </button>
      </form>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {notes.length === 0 && <p className="text-sm text-gris">{tr.empty}</p>}
        {notes.map((n) => (
          <div key={n.id} className="group flex items-start gap-2 bg-papier-2 rounded-champ p-3 border border-filet">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-encre whitespace-pre-wrap break-words">{n.texte}</p>
              <p className="text-xs text-gris mt-1">{dateCourte(n.createdAt)}</p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(n.id)}
              aria-label={lang === 'FR' ? 'Supprimer la note' : 'Delete note'}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-gris hover:text-rose transition-opacity p-1"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPrivees;
