import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { DossierConfig, EtapeDef, Language, PieceDef } from '../../../types';
import { writeDoc } from '../../../lib/firestore';
import { CONFIG_PAR_DEFAUT, CONFIG_PATH, useDossierConfig } from '../../../lib/dossier';
import { Panneau, Champ, Bouton } from '../ui';

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
    catEn: 'Catégorie (EN)',
    nomEn: 'Nom (EN)',
    aideEn: 'Aide (EN)',
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
    catEn: 'Category (EN)',
    nomEn: 'Name (EN)',
    aideEn: 'Help text (EN)',
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

  const boutonLigne = 'p-2 rounded-champ hover:bg-papier text-gris min-h-[36px] min-w-[36px]';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-h3 text-encre">{tr.title}</h1>
        <p className="text-gris mt-1 text-sm">{tr.subtitle}</p>
      </div>

      {message && (
        <p
          className={`text-sm p-3 rounded-champ border ${
            message.type === 'ok' ? 'text-encre border-filet bg-papier-2' : 'text-rose border-rose/30 bg-rose/5'
          }`}
          role="status"
          aria-live="polite"
        >
          {message.type === 'err' && <AlertCircle className="w-4 h-4 inline mr-1.5" />}
          {message.text}
        </p>
      )}

      {/* Pièces */}
      <Panneau titre={tr.pieces}>
        <div className="space-y-4">
          {pieces.map((p, i) => (
            <div key={i} className="border border-filet rounded-champ p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Champ label={tr.id} value={p.id} onChange={(e) => majPiece(i, 'id', e.target.value)} />
                <Champ label={tr.cat} value={p.cat} onChange={(e) => majPiece(i, 'cat', e.target.value)} />
                <Champ
                  label={tr.nom}
                  value={p.nom}
                  onChange={(e) => majPiece(i, 'nom', e.target.value)}
                  className="md:col-span-2"
                />
              </div>
              <Champ label={tr.aide} value={p.aide ?? ''} onChange={(e) => majPiece(i, 'aide', e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Champ label={tr.nomEn} value={p.nomEn ?? ''} onChange={(e) => majPiece(i, 'nomEn', e.target.value)} />
                <Champ label={tr.aideEn} value={p.aideEn ?? ''} onChange={(e) => majPiece(i, 'aideEn', e.target.value)} />
                <Champ label={tr.catEn} value={p.catEn ?? ''} onChange={(e) => majPiece(i, 'catEn', e.target.value)} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-gris">
                  <input
                    type="checkbox"
                    checked={!!p.option}
                    onChange={(e) => majPiece(i, 'option', e.target.checked)}
                    className="accent-rose"
                  />
                  {tr.option}
                </label>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setPieces((l) => deplacer(l, i, -1))} className={boutonLigne} aria-label="up">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setPieces((l) => deplacer(l, i, 1))} className={boutonLigne} aria-label="down">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPieces((l) => l.filter((_, idx) => idx !== i))}
                    className={`${boutonLigne} hover:text-rose`}
                    aria-label="delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Bouton
            variante="secondaire"
            icone={Plus}
            onClick={() => setPieces((l) => [...l, { id: `piece-${Date.now()}`, cat: '', nom: '' }])}
          >
            {tr.ajouterPiece}
          </Bouton>
        </div>
      </Panneau>

      {/* Étapes */}
      <Panneau titre={tr.etapes}>
        <div className="space-y-4">
          {etapes.map((e, i) => (
            <div key={i} className="border border-filet rounded-champ p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Champ label={tr.id} value={e.id} onChange={(ev) => majEtape(i, 'id', ev.target.value)} />
                <Champ
                  label={tr.titre}
                  value={e.titre}
                  onChange={(ev) => majEtape(i, 'titre', ev.target.value)}
                  className="md:col-span-2"
                />
              </div>
              <Champ label={tr.sous} value={e.sous} onChange={(ev) => majEtape(i, 'sous', ev.target.value)} />
              <div className="flex justify-end gap-1">
                <button type="button" onClick={() => setEtapes((l) => deplacer(l, i, -1))} className={boutonLigne} aria-label="up">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setEtapes((l) => deplacer(l, i, 1))} className={boutonLigne} aria-label="down">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEtapes((l) => l.filter((_, idx) => idx !== i))}
                  className={`${boutonLigne} hover:text-rose`}
                  aria-label="delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <Bouton
            variante="secondaire"
            icone={Plus}
            onClick={() => setEtapes((l) => [...l, { id: `etape-${Date.now()}`, titre: '', sous: '' }])}
          >
            {tr.ajouterEtape}
          </Bouton>
        </div>
      </Panneau>

      <div className="flex flex-wrap gap-3">
        <Bouton variante="primaire" icone={Save} onClick={enregistrer} disabled={busy}>
          {busy ? '…' : tr.save}
        </Bouton>
        <Bouton variante="danger" icone={RotateCcw} onClick={reinitialiser} disabled={busy}>
          {tr.reset}
        </Bouton>
      </div>
    </div>
  );
};

export default ReglagesDossier;
