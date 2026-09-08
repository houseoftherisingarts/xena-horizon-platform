import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Download, Paperclip, AlertTriangle } from 'lucide-react';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { Dossier, Language, PieceDef } from '../../../types';
import { EtatPiece, etatPiece, piecesParCategorie } from '../../../lib/dossier';
import { dateCourte, formatTaille } from './util';
import { Etiquette, Bouton } from '../ui';

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

const etatTone: Record<string, 'neutre' | 'accent' | 'encre'> = {
  valide: 'encre',
  deposee: 'accent',
  redeposee: 'accent',
  a_refaire: 'accent',
};

const CHAMP =
  'w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose h-20 resize-none text-sm';

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
      <h3 className="font-sans font-semibold text-encre flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-rose" aria-hidden="true" /> {tr.title}
      </h3>
      {piecesParCategorie(pieces).map(({ cat, pieces: liste }) => (
        <div key={cat} className="space-y-3">
          <p className="kicker text-gris">{cat}</p>
          <div className="space-y-2">
            {liste.map((p) => {
              const d = dossier.pieces?.[p.id];
              const etat: EtatPiece = etatPiece(dossier, p.id);
              const revueNote = etat === 'a_refaire' ? dossier.revue?.[p.id]?.note : undefined;
              return (
                <div key={p.id} className="bg-papier border border-filet rounded-champ p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-encre">{p.nom}</span>
                        {d ? (
                          <Etiquette tone={etatTone[etat]}>{tr[etat as 'valide' | 'deposee' | 'a_refaire' | 'redeposee']}</Etiquette>
                        ) : p.option ? (
                          <Etiquette tone="neutre">{tr.optionnelle}</Etiquette>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-pilule px-2.5 py-0.5 text-xs font-medium border border-rose/30 text-rose">
                            <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {tr.manquante}
                          </span>
                        )}
                      </div>
                      {p.aide && <p className="text-xs text-gris mt-1">{p.aide}</p>}
                      {d && (
                        <p className="text-xs text-gris mt-1">
                          {d.nom} · {formatTaille(d.taille)} · {dateCourte(d.deposeLe)}
                        </p>
                      )}
                      {etat === 'a_refaire' && revueNote && (
                        <p className="text-xs text-rose mt-1">Remarque : {revueNote}</p>
                      )}
                    </div>
                    {d && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => telecharger(p.id)}
                          className="rounded-champ border border-filet text-gris hover:text-encre hover:border-encre min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={tr.boutonTelecharger}
                          title={tr.boutonTelecharger}
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                        </button>
                        {etat !== 'valide' && (
                          <Bouton variante="secondaire" petit icone={CheckCircle2} onClick={() => onValider(p.id)}>
                            {tr.boutonValider}
                          </Bouton>
                        )}
                        <Bouton
                          variante="danger"
                          petit
                          icone={RotateCcw}
                          onClick={() => {
                            setOuvrirRefaire(ouvrirRefaire === p.id ? null : p.id);
                            setRemarque('');
                            setErreurRemarque(false);
                          }}
                        >
                          {tr.boutonARefaire}
                        </Bouton>
                      </div>
                    )}
                  </div>
                  {ouvrirRefaire === p.id && (
                    <div className="mt-3 pt-3 border-t border-filet space-y-2">
                      <textarea
                        value={remarque}
                        onChange={(e) => {
                          setRemarque(e.target.value);
                          if (erreurRemarque) setErreurRemarque(false);
                        }}
                        placeholder={tr.placeholderRemarque}
                        className={CHAMP}
                      />
                      {erreurRemarque && <p className="text-xs text-rose">{tr.remarqueVide}</p>}
                      <div className="flex gap-2">
                        <Bouton variante="primaire" petit onClick={() => confirmerARefaire(p.id)}>
                          {tr.confirmer}
                        </Bouton>
                        <Bouton variante="discret" petit onClick={() => setOuvrirRefaire(null)}>
                          {tr.annuler}
                        </Bouton>
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
