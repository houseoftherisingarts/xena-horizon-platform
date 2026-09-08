import React, { useRef, useState } from 'react';
import { deleteField, serverTimestamp, increment } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { AlertCircle, Check, FileText, Upload, X } from 'lucide-react';
import { storage } from '../../firebase';
import { patchDoc } from '../../lib/firestore';
import { useTextes } from '../../lib/textes';
import { cheminPiece, etatPiece, EtatPiece, libellesPiece, libelleCategorie, piecesManquantes, piecesParCategorie, TAILLE_MAX, TYPES_ACCEPTES } from '../../lib/dossier';
import { Dossier, DossierConfig, Language, PieceDef, PieceDeposee } from '../../types';

const TEXTES = {
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
    nouveauDepot: 'nouveau dépôt, en attente',
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
    nouveauDepot: 'new upload, pending review',
    erreurType: 'Format not accepted. Use a PDF, image, Word, Excel or text file.',
    erreurTaille: 'File too large. The limit is 25 MB.',
    erreurEnvoi: 'The upload failed. Try again in a moment.',
    erreurRetrait: 'The removal failed. Try again in a moment.',
  },
};

interface PiecesProps {
  dossier: Dossier;
  config: DossierConfig;
  uid: string;
  lang: Language;
}

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
  nouveauDepot: string;
  erreurType: string;
  erreurTaille: string;
  erreurEnvoi: string;
  erreurRetrait: string;
}

/** Pastille d'état : déposée en gris, validée en rose, à refaire en encre sur rose-clair, nouveau dépôt en rose. */
const Pastille: React.FC<{ etat: EtatPiece; t: TexteCarte }> = ({ etat, t }) => {
  if (etat === 'manquante') return null;
  const styles: Record<Exclude<EtatPiece, 'manquante'>, string> = {
    deposee: 'bg-papier-2 text-gris border border-filet',
    valide: 'bg-rose/10 text-rose border border-rose/30',
    a_refaire: 'bg-rose-clair/25 text-encre border border-rose-clair/40',
    redeposee: 'bg-rose/10 text-rose border border-rose/30',
  };
  const label = { deposee: '', valide: t.validee, a_refaire: t.aRefaire, redeposee: t.nouveauDepot }[etat];
  if (!label) return null;
  return <span className={`text-[10px] font-sans font-semibold uppercase tracking-widest px-2 py-0.5 rounded-pilule ${styles[etat]}`}>{label}</span>;
};

const PieceCard: React.FC<{ piece: PieceDef; deposee?: PieceDeposee; etat: EtatPiece; note?: string; uid: string; t: TexteCarte; lang: Language }> = ({
  piece,
  deposee,
  etat,
  note,
  uid,
  t,
  lang,
}) => {
  const { nom, aide } = libellesPiece(piece, lang);
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

  return (
    <li
      id={`piece-${piece.id}`}
      onDragOver={(e) => {
        e.preventDefault();
        setSurvole(true);
      }}
      onDragLeave={() => setSurvole(false)}
      onDrop={onDrop}
      className={`flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b transition-colors ${
        survole ? 'border-dashed border-rose bg-rose-clair/10' : 'border-filet'
      }`}
    >
      <span
        className={`w-10 h-10 rounded-pilule flex items-center justify-center flex-shrink-0 border ${
          etat === 'valide'
            ? 'bg-rose/10 border-rose/30 text-rose'
            : etat === 'a_refaire'
            ? 'bg-rose-clair/20 border-rose-clair/40 text-encre'
            : deposee
            ? 'bg-papier-2 border-filet text-encre'
            : 'bg-papier border-filet text-gris'
        }`}
      >
        {deposee ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-encre font-semibold text-sm flex items-center gap-2 flex-wrap">
          {nom}
          {piece.option && <span className="text-gris font-normal text-xs">({t.optionLabel})</span>}
          <Pastille etat={etat} t={t} />
        </p>
        {deposee ? (
          <p className="text-gris text-xs mt-1">
            {deposee.nom} · {poids(deposee.taille)} · {t.deposeLe} {jour(deposee.deposeLe)}
          </p>
        ) : (
          <p className="text-gris text-xs mt-1">{aide || t.aideDefaut}</p>
        )}
        {etat === 'a_refaire' && note && (
          <p className="text-encre text-xs mt-2 bg-rose-clair/15 border border-rose-clair/30 rounded-champ px-3 py-2">{note}</p>
        )}
        {enCours && (
          <div className="mt-2 h-1.5 rounded-pilule bg-papier-2 overflow-hidden" role="progressbar" aria-valuenow={progres ?? 0} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-rose transition-all duration-200" style={{ width: `${progres}%` }} />
          </div>
        )}
        {erreur && (
          <p role="alert" className="flex items-center gap-1.5 text-rose text-xs mt-2">
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
          className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-pilule text-sm font-medium cursor-pointer transition-colors ${
            deposee ? 'border border-filet text-encre hover:border-encre' : 'bg-encre text-papier hover:bg-encre-2'
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
            className="w-11 h-11 flex items-center justify-center rounded-pilule border border-filet text-gris hover:border-rose hover:text-rose transition-colors"
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
      nouveauDepot: 'nouveau dépôt, en attente',
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
      nouveauDepot: 'new upload, pending review',
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
    <div className="space-y-10">
      <section className="border-t border-filet pt-8">
        <h2 className="font-serif text-h3 text-encre mb-1">{t.titre}</h2>
        <p className="text-gris text-sm mb-6 mesure">{t.sous}</p>

        <h3 className="kicker text-rose mb-3">{t.manquantesTitre}</h3>
        {manquantes.length === 0 ? (
          <p className="text-gris text-sm">{t.manquantesVide}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {manquantes.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => allerA(p.id)}
                  className="min-h-[44px] px-4 rounded-pilule border border-filet text-encre text-sm hover:border-rose hover:text-rose transition-colors"
                >
                  {libellesPiece(p, lang).nom}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {categories.map(({ cat, pieces }) => (
        <section key={cat} className="border-t border-filet pt-8">
          <h3 className="kicker text-gris mb-4">{libelleCategorie(cat, config.pieces, lang)}</h3>
          <ul>
            {pieces.map((p) => {
              const etat = etatPiece(dossier, p.id);
              const note = etat === 'a_refaire' ? dossier.revue?.[p.id]?.note : undefined;
              return (
                <PieceCard key={p.id} piece={p} deposee={dossier.pieces?.[p.id]} etat={etat} note={note} uid={uid} t={t} lang={lang} />
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default Pieces;
