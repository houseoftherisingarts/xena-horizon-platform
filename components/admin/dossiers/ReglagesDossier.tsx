import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, RotateCcw, AlertCircle, Settings2 } from 'lucide-react';
import { GLASS_INPUT_CLASSES, ACTION_BUTTON_CLASSES } from '../../../constants';
import { DossierConfig, EtapeDef, Language, PieceDef } from '../../../types';
import { writeDoc } from '../../../lib/firestore';
import { CONFIG_PAR_DEFAUT, CONFIG_PATH, useDossierConfig } from '../../../lib/dossier';

interface ReglagesDossierProps {
  lang: Language;
}

const t = {
  FR: {
    title: 'Le catalogue',
    subtitle: "Les pièces demandées et les étapes du parcours, telles qu'elles apparaissent chez la personne accompagnée.",
    pieces: 'Les pièces',
    etapes: 'Les étapes du parcours',
    id: 'Identifiant',
    cat: 'Catégorie',
    nom: 'Nom',
    aide: "Phrase d'aide",
    option: 'Optionnelle',
    titre: 'Titre',
    sous: 'Sous-titre',
    ajouterPiece: 'Ajouter une pièce',
    ajouterEtape: 'Ajouter une étape',
    save: 'Enregistrer',
    reset: 'Revenir aux valeurs par défaut',
    saved: 'Catalogue enregistré.',
    erreur: "L'enregistrement a échoué. Réessaie.",
  },
  EN: {
    title: 'The catalogue',
    subtitle: 'The requested files and the journey steps, exactly as the person you support sees them.',
    pieces: 'Files',
    etapes: 'Journey steps',
    id: 'ID',
    cat: 'Category',
    nom: 'Name',
    aide: 'Help text',
    option: 'Optional',
    titre: 'Title',
    sous: 'Subtitle',
    ajouterPiece: 'Add a file',
    ajouterEtape: 'Add a step',
    save: 'Save',
    reset: 'Reset to defaults',
    saved: 'Catalogue saved.',
    erreur: 'Saving failed. Try again.',
  },
};

function deplacer<T>(liste: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= liste.length) return liste;
  const next = [...liste];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

const ReglagesDossier: React.FC<ReglagesDossierProps> = ({ lang }) => {
  const tr = t[lang];
  const config = useDossierConfig();
  const [pieces, setPieces] = useState<PieceDef[]>(config.pieces);
  const [etapes, setEtapes] = useState<EtapeDef[]>(config.etapes);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!hydrated) {
      setPieces(config.pieces);
      setEtapes(config.etapes);
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, hydrated]);

  const majPiece = (i: number, champ: keyof PieceDef, valeur: any) => {
    setPieces((p) => p.map((x, idx) => (idx === i ? { ...x, [champ]: valeur } : x)));
  };
  const majEtape = (i: number, champ: keyof EtapeDef, valeur: any) => {
    setEtapes((e) => e.map((x, idx) => (idx === i ? { ...x, [champ]: valeur } : x)));
  };

  const enregistrer = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await writeDoc(CONFIG_PATH, { pieces, etapes }, { merge: true });
      setMessage({ type: 'ok', text: tr.saved });
    } catch {
      setMessage({ type: 'err', text: tr.erreur });
    } finally {
      setBusy(false);
    }
  };

  const reinitialiser = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await writeDoc(CONFIG_PATH, CONFIG_PAR_DEFAUT, { merge: true });
      setPieces(CONFIG_PAR_DEFAUT.pieces);
      setEtapes(CONFIG_PAR_DEFAUT.etapes);
      setMessage({ type: 'ok', text: tr.saved });
    } catch {
      setMessage({ type: 'err', text: tr.erreur });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
          <Settings2 className="w-7 h-7 text-cyan-300" /> {tr.title}
        </h1>
        <p className="text-slate-400 mt-1">{tr.subtitle}</p>
      </div>

      {message && (
        <p className={`text-sm p-3 rounded-[15px] border ${message.type === 'ok' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-red-300 bg-red-500/10 border-red-500/20'}`} role="status" aria-live="polite">
          {message.type === 'err' && <AlertCircle className="w-4 h-4 inline mr-1.5" />}
          {message.text}
        </p>
      )}

      {/* Pièces */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 space-y-4">
        <h2 className="text-lg font-serif font-bold text-white">{tr.pieces}</h2>
        {pieces.map((p, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[15px] p-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={p.id} onChange={(e) => majPiece(i, 'id', e.target.value)} placeholder={tr.id} className={`${GLASS_INPUT_CLASSES} text-sm py-2`} />
              <input value={p.cat} onChange={(e) => majPiece(i, 'cat', e.target.value)} placeholder={tr.cat} className={`${GLASS_INPUT_CLASSES} text-sm py-2`} />
              <input value={p.nom} onChange={(e) => majPiece(i, 'nom', e.target.value)} placeholder={tr.nom} className={`${GLASS_INPUT_CLASSES} text-sm py-2 md:col-span-2`} />
            </div>
            <input value={p.aide ?? ''} onChange={(e) => majPiece(i, 'aide', e.target.value)} placeholder={tr.aide} className={`${GLASS_INPUT_CLASSES} text-sm py-2`} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={!!p.option} onChange={(e) => majPiece(i, 'option', e.target.checked)} className="accent-cyan-400" />
                {tr.option}
              </label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPieces((l) => deplacer(l, i, -1))} className="p-2 rounded-[10px] hover:bg-white/10 text-slate-400 min-h-[36px] min-w-[36px]" aria-label="up"><ArrowUp className="w-4 h-4" /></button>
                <button type="button" onClick={() => setPieces((l) => deplacer(l, i, 1))} className="p-2 rounded-[10px] hover:bg-white/10 text-slate-400 min-h-[36px] min-w-[36px]" aria-label="down"><ArrowDown className="w-4 h-4" /></button>
                <button type="button" onClick={() => setPieces((l) => l.filter((_, idx) => idx !== i))} className="p-2 rounded-[10px] hover:bg-red-500/10 text-red-400 min-h-[36px] min-w-[36px]" aria-label="delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPieces((l) => [...l, { id: `piece-${Date.now()}`, cat: '', nom: '' }])}
          className="px-4 py-2 rounded-[12px] bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-sm flex items-center gap-2 min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> {tr.ajouterPiece}
        </button>
      </div>

      {/* Étapes */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 space-y-4">
        <h2 className="text-lg font-serif font-bold text-white">{tr.etapes}</h2>
        {etapes.map((e, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[15px] p-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={e.id} onChange={(ev) => majEtape(i, 'id', ev.target.value)} placeholder={tr.id} className={`${GLASS_INPUT_CLASSES} text-sm py-2`} />
              <input value={e.titre} onChange={(ev) => majEtape(i, 'titre', ev.target.value)} placeholder={tr.titre} className={`${GLASS_INPUT_CLASSES} text-sm py-2 md:col-span-2`} />
            </div>
            <input value={e.sous} onChange={(ev) => majEtape(i, 'sous', ev.target.value)} placeholder={tr.sous} className={`${GLASS_INPUT_CLASSES} text-sm py-2`} />
            <div className="flex justify-end gap-1">
              <button type="button" onClick={() => setEtapes((l) => deplacer(l, i, -1))} className="p-2 rounded-[10px] hover:bg-white/10 text-slate-400 min-h-[36px] min-w-[36px]" aria-label="up"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => setEtapes((l) => deplacer(l, i, 1))} className="p-2 rounded-[10px] hover:bg-white/10 text-slate-400 min-h-[36px] min-w-[36px]" aria-label="down"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => setEtapes((l) => l.filter((_, idx) => idx !== i))} className="p-2 rounded-[10px] hover:bg-red-500/10 text-red-400 min-h-[36px] min-w-[36px]" aria-label="delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setEtapes((l) => [...l, { id: `etape-${Date.now()}`, titre: '', sous: '' }])}
          className="px-4 py-2 rounded-[12px] bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-sm flex items-center gap-2 min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> {tr.ajouterEtape}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={enregistrer} disabled={busy} className={`${ACTION_BUTTON_CLASSES} disabled:opacity-50`}>
          <Save className="w-4 h-4" /> {busy ? '…' : tr.save}
        </button>
        <button
          type="button"
          onClick={reinitialiser}
          disabled={busy}
          className="px-6 py-3 rounded-[15px] border border-white/15 hover:border-red-400/50 hover:bg-red-500/5 text-slate-300 hover:text-red-300 text-sm flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" /> {tr.reset}
        </button>
      </div>
    </div>
  );
};

export default ReglagesDossier;
