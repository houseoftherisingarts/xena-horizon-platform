import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Download, Paperclip, AlertTriangle } from 'lucide-react';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { GLASS_INPUT_CLASSES } from '../../../constants';
import { Dossier, Language, PieceDef } from '../../../types';
import { EtatPiece, etatPiece, piecesParCategorie } from '../../../lib/dossier';
import { dateCourte, formatTaille } from './util';

interface PiecesAdminProps {
  dossier: Dossier;
  pieces: PieceDef[];
  lang: Language;
  onValider: (pieceId: string) => void;
  onARefaire: (pieceId: string, remarque: string) => void;
}

const t = {
  FR: {
    title: 'Les pièces',
    manquante: 'Manquante',
    optionnelle: 'Optionnelle, non fournie',
    valide: 'Validée',
    deposee: 'Déposée',
    a_refaire: 'À refaire',
    redeposee: 'Nouveau dépôt',
    boutonValider: 'Valider',
    boutonARefaire: 'À refaire',
    boutonTelecharger: 'Télécharger',
    placeholderRemarque: 'Ce qui doit être corrigé (obligatoire)…',
    confirmer: 'Envoyer la remarque',
    annuler: 'Annuler',
    remarqueVide: 'Écris ce qui doit être repris avant d\'envoyer.',
  },
  EN: {
    title: 'Files',
    manquante: 'Missing',
    optionnelle: 'Optional, not provided',
    valide: 'Approved',
    deposee: 'Submitted',
    a_refaire: 'Needs redo',
    redeposee: 'New upload',
    boutonValider: 'Approve',
    boutonARefaire: 'Needs redo',
    boutonTelecharger: 'Download',
    placeholderRemarque: 'What needs fixing (required)…',
    confirmer: 'Send note',
    annuler: 'Cancel',
    remarqueVide: 'Write what needs redoing before sending.',
  },
};

const etatClasses: Record<string, string> = {
  valide: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  deposee: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  redeposee: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  a_refaire: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const PiecesAdmin: React.FC<PiecesAdminProps> = ({ dossier, pieces, lang, onValider, onARefaire }) => {
  const tr = t[lang];
  const [ouvrirRefaire, setOuvrirRefaire] = useState<string | null>(null);
  const [remarque, setRemarque] = useState('');
  const [erreurRemarque, setErreurRemarque] = useState(false);

  const telecharger = async (pieceId: string) => {
    const d = dossier.pieces?.[pieceId];
    if (!d) return;
    try {
      const url = d.url || (await getDownloadURL(storageRef(storage, d.chemin)));
      window.open(url, '_blank', 'noopener');
    } catch {
      // Silencieux volontaire : un lien manquant ne bloque pas le reste de la fiche.
    }
  };

  const confirmerARefaire = (pieceId: string) => {
    if (!remarque.trim()) {
      setErreurRemarque(true);
      return;
    }
    onARefaire(pieceId, remarque.trim());
    setOuvrirRefaire(null);
    setRemarque('');
    setErreurRemarque(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
        <Paperclip className="w-5 h-5 text-cyan-300" /> {tr.title}
      </h3>
      {piecesParCategorie(pieces).map(({ cat, pieces: liste }) => (
        <div key={cat} className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-500">{cat}</p>
          <div className="space-y-2">
            {liste.map((p) => {
              const d = dossier.pieces?.[p.id];
              const etat: EtatPiece = etatPiece(dossier, p.id);
              const revueNote = etat === 'a_refaire' ? dossier.revue?.[p.id]?.note : undefined;
              return (
                <div key={p.id} className="bg-white/5 border border-white/10 rounded-[15px] p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{p.nom}</span>
                        {d ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${etatClasses[etat]}`}>
                            {tr[etat as 'valide' | 'deposee' | 'a_refaire' | 'redeposee']}
                          </span>
                        ) : p.option ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/15 text-slate-500">
                            {tr.optionnelle}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {tr.manquante}
                          </span>
                        )}
                      </div>
                      {p.aide && <p className="text-xs text-slate-500 mt-1">{p.aide}</p>}
                      {d && (
                        <p className="text-xs text-slate-400 mt-1">
                          {d.nom} · {formatTaille(d.taille)} · {dateCourte(d.deposeLe)}
                        </p>
                      )}
                      {etat === 'a_refaire' && revueNote && (
                        <p className="text-xs text-red-300 mt-1">Remarque : {revueNote}</p>
                      )}
                    </div>
                    {d && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => telecharger(p.id)}
                          className="p-2 rounded-[10px] bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={tr.boutonTelecharger}
                          title={tr.boutonTelecharger}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {etat !== 'valide' && (
                          <button
                            type="button"
                            onClick={() => onValider(p.id)}
                            className="px-3 py-2 rounded-[10px] bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-medium min-h-[44px] flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> {tr.boutonValider}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setOuvrirRefaire(ouvrirRefaire === p.id ? null : p.id);
                            setRemarque('');
                            setErreurRemarque(false);
                          }}
                          className="px-3 py-2 rounded-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 text-xs font-medium min-h-[44px] flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-4 h-4" /> {tr.boutonARefaire}
                        </button>
                      </div>
                    )}
                  </div>
                  {ouvrirRefaire === p.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <textarea
                        value={remarque}
                        onChange={(e) => {
                          setRemarque(e.target.value);
                          if (erreurRemarque) setErreurRemarque(false);
                        }}
                        placeholder={tr.placeholderRemarque}
                        className={`${GLASS_INPUT_CLASSES} h-20 resize-none text-sm`}
                      />
                      {erreurRemarque && <p className="text-xs text-red-400">{tr.remarqueVide}</p>}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => confirmerARefaire(p.id)}
                          className="px-4 py-2 rounded-[10px] bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-medium min-h-[44px]"
                        >
                          {tr.confirmer}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOuvrirRefaire(null)}
                          className="px-4 py-2 rounded-[10px] text-slate-400 hover:text-white text-xs min-h-[44px]"
                        >
                          {tr.annuler}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PiecesAdmin;
