import React, { useRef, useState } from 'react';
import { deleteField, serverTimestamp, increment } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { AlertCircle, Check, FileText, Upload, X } from 'lucide-react';
import { storage } from '../../firebase';
import { patchDoc } from '../../lib/firestore';
import { cheminPiece, etatPiece, EtatPiece, piecesManquantes, piecesParCategorie, TAILLE_MAX, TYPES_ACCEPTES } from '../../lib/dossier';
import { Dossier, DossierConfig, Language, PieceDef, PieceDeposee } from '../../types';

interface PiecesProps {
  dossier: Dossier;
  config: DossierConfig;
  uid: string;
  lang: Language;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const poids = (o: number): string => {
  if (o < 1024) return `${o} o`;
  if (o < 1048576) return `${Math.round(o / 1024)} Ko`;
  return `${(o / 1048576).toFixed(1).replace('.', ',')} Mo`;
};

const jour = (ts: any): string => {
  try {
    const d: Date | null = ts?.toDate ? ts.toDate() : null;
    return d ? d.toLocaleDateString('fr-CA') : '';
  } catch {
    return '';
  }
};

interface TexteCarte {
  aideDefaut: string;
  optionLabel: string;
  deposer: string;
  remplacer: string;
  retirer: string;
  deposeLe: string;
  aRefaire: string;
  validee: string;
  glisser: string;
  erreurType: string;
  erreurTaille: string;
  erreurEnvoi: string;
  erreurRetrait: string;
}

const PieceCard: React.FC<{ piece: PieceDef; deposee?: PieceDeposee; uid: string; t: TexteCarte }> = ({ piece, deposee, uid, t }) => {
  const [progres, setProgres] = useState<number | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [survole, setSurvole] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const envoyer = (file: File) => {
    setErreur(null);
    if (!TYPES_ACCEPTES.includes(file.type)) {
      setErreur(t.erreurType);
      return;
    }
    if (file.size > TAILLE_MAX) {
      setErreur(t.erreurTaille);
      return;
    }
    const chemin = cheminPiece(uid, piece.id, file.name);
    const tache = uploadBytesResumable(storageRef(storage, chemin), file, { contentType: file.type });
    setProgres(0);
    tache.on(
      'state_changed',
      (snap) => setProgres(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => {
        setErreur(t.erreurEnvoi);
        setProgres(null);
      },
      async () => {
        try {
          const url = await getDownloadURL(tache.snapshot.ref);
          await patchDoc<Record<string, any>>('dossiers', uid, {
            [`pieces.${piece.id}`]: {
              nom: file.name,
              chemin,
              url,
              taille: file.size,
              type: file.type,
              deposeLe: serverTimestamp(),
              etat: 'depose',
            },
            updatedAt: serverTimestamp(),
            derniereActiviteClient: serverTimestamp(),
            nonLusAdmin: increment(1),
          });
        } catch {
          setErreur(t.erreurEnvoi);
        } finally {
          setProgres(null);
        }
      }
    );
  };

  const remplacer = async (file: File) => {
    if (deposee?.chemin) {
      try {
        await deleteObject(storageRef(storage, deposee.chemin));
      } catch {
        // Le fichier précédent est peut-être déjà parti : on n'en fait pas une erreur bloquante.
      }
    }
    envoyer(file);
  };

  const retirer = async () => {
    if (!deposee) return;
    setErreur(null);
    try {
      await deleteObject(storageRef(storage, deposee.chemin));
    } catch {
      // Idem : un fichier déjà absent du stockage ne doit pas bloquer le retrait de la fiche.
    }
    try {
      await patchDoc<Record<string, any>>('dossiers', uid, {
        [`pieces.${piece.id}`]: deleteField(),
        updatedAt: serverTimestamp(),
        derniereActiviteClient: serverTimestamp(),
      });
    } catch {
      setErreur(t.erreurRetrait);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (deposee) remplacer(file);
    else envoyer(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setSurvole(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (deposee) remplacer(file);
    else envoyer(file);
  };

  const enCours = progres !== null;
  const etatEtiquette = deposee ? (deposee.etat === 'valide' ? t.validee : deposee.etat === 'a_refaire' ? t.aRefaire : null) : null;

  return (
    <li
      id={`piece-${piece.id}`}
      onDragOver={(e) => {
        e.preventDefault();
        setSurvole(true);
      }}
      onDragLeave={() => setSurvole(false)}
      onDrop={onDrop}
      className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-[16px] border transition-colors ${
        survole
          ? 'border-cyan-400/60 bg-cyan-400/5'
          : deposee?.etat === 'valide'
          ? 'border-emerald-400/25 bg-emerald-400/5'
          : deposee?.etat === 'a_refaire'
          ? 'border-amber-400/30 bg-amber-400/5'
          : deposee
          ? 'border-white/10 bg-white/5'
          : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          deposee?.etat === 'valide'
            ? 'bg-emerald-400/15 text-emerald-300'
            : deposee?.etat === 'a_refaire'
            ? 'bg-amber-400/15 text-amber-300'
            : deposee
            ? 'bg-cyan-400/15 text-cyan-300'
            : 'bg-white/5 text-slate-500'
        }`}
      >
        {deposee ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm flex items-center gap-2 flex-wrap">
          {piece.nom}
          {piece.option && <span className="text-slate-500 font-normal text-xs">({t.optionLabel})</span>}
          {etatEtiquette && (
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                deposee?.etat === 'valide' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'
              }`}
            >
              {etatEtiquette}
            </span>
          )}
        </p>
        {deposee ? (
          <p className="text-slate-400 text-xs mt-1">
            {deposee.nom} · {poids(deposee.taille)} · {t.deposeLe} {jour(deposee.deposeLe)}
          </p>
        ) : (
          <p className="text-slate-500 text-xs mt-1">{piece.aide || t.aideDefaut}</p>
        )}
        {deposee?.etat === 'a_refaire' && deposee.note && (
          <p className="text-amber-300 text-xs mt-2 bg-amber-400/10 border border-amber-400/20 rounded-[10px] px-3 py-2">{deposee.note}</p>
        )}
        {enCours && (
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={progres ?? 0} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-iridescent transition-all duration-200" style={{ width: `${progres}%` }} />
          </div>
        )}
        {erreur && (
          <p role="alert" className="flex items-center gap-1.5 text-red-300 text-xs mt-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {erreur}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          type="file"
          accept={TYPES_ACCEPTES.join(',')}
          onChange={onChange}
          className="sr-only"
          id={`fichier-${piece.id}`}
        />
        <label
          htmlFor={`fichier-${piece.id}`}
          className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-sm font-medium cursor-pointer transition-colors ${FOCUS_RING} ${
            deposee ? 'border border-white/15 text-slate-300 hover:border-cyan-400/50 hover:text-white' : 'bg-iridescent text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          {deposee ? t.remplacer : t.deposer}
        </label>
        {deposee && (
          <button
            type="button"
            onClick={retirer}
            aria-label={t.retirer}
            title={t.retirer}
            className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/15 text-slate-400 hover:border-red-400/40 hover:text-red-300 transition-colors ${FOCUS_RING}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </li>
  );
};

const Pieces: React.FC<PiecesProps> = ({ dossier, config, uid, lang }) => {
  const t = {
    FR: {
      titre: 'Mes pièces',
      sous: 'Dépose ce que tu as, quand ça t\'adonne. Je vois chaque pièce arriver de mon côté.',
      manquantesTitre: 'Ce qui manque encore',
      manquantesVide: 'Tout est là. Je prends le relais.',
      aideDefaut: '',
      optionLabel: 'au besoin',
      deposer: 'Déposer',
      remplacer: 'Remplacer',
      retirer: 'Retirer',
      deposeLe: 'reçue le',
      aRefaire: 'à refaire',
      validee: 'validée',
      glisser: '',
      erreurType: 'Format non accepté. Utilise un PDF, une image, un Word, un Excel ou un texte.',
      erreurTaille: 'Fichier trop lourd. La limite est de 25 Mo.',
      erreurEnvoi: "L'envoi a échoué. Réessaie dans un instant.",
      erreurRetrait: 'Le retrait a échoué. Réessaie dans un instant.',
    },
    EN: {
      titre: 'My documents',
      sous: "Send what you have, whenever it suits you. I see each file as it arrives.",
      manquantesTitre: 'Still missing',
      manquantesVide: "That's everything. I take it from here.",
      aideDefaut: '',
      optionLabel: 'if applicable',
      deposer: 'Upload',
      remplacer: 'Replace',
      retirer: 'Remove',
      deposeLe: 'received on',
      aRefaire: 'to redo',
      validee: 'approved',
      glisser: '',
      erreurType: 'Format not accepted. Use a PDF, image, Word, Excel or text file.',
      erreurTaille: 'File too large. The limit is 25 MB.',
      erreurEnvoi: 'The upload failed. Try again in a moment.',
      erreurRetrait: 'The removal failed. Try again in a moment.',
    },
  }[lang];

  const manquantes = piecesManquantes(dossier, config.pieces);
  const categories = piecesParCategorie(config.pieces);

  const allerA = (id: string) => {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`piece-${id}`)?.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-xl p-6 md:p-8">
        <h2 className="text-lg font-serif font-bold text-white mb-1">{t.titre}</h2>
        <p className="text-slate-400 text-sm mb-6">{t.sous}</p>

        <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-3">{t.manquantesTitre}</h3>
        {manquantes.length === 0 ? (
          <p className="text-slate-400 text-sm">{t.manquantesVide}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {manquantes.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => allerA(p.id)}
                  className={`min-h-[44px] px-4 rounded-full border border-white/15 text-slate-300 text-sm hover:border-cyan-400/50 hover:text-white transition-colors ${FOCUS_RING}`}
                >
                  {p.nom}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {categories.map(({ cat, pieces }) => (
        <div key={cat} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-xl p-6 md:p-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{cat}</h3>
          <ul className="space-y-3">
            {pieces.map((p) => (
              <PieceCard key={p.id} piece={p} deposee={dossier.pieces?.[p.id]} uid={uid} t={t} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Pieces;
