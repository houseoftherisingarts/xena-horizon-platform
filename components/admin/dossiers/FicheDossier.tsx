import React, { useEffect, useState } from 'react';
import { orderBy, serverTimestamp, increment } from 'firebase/firestore';
import {
  ArrowLeft,
  Download,
  Printer,
  Archive,
  ArchiveRestore,
  Trash2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { auth } from '../../../firebase';
import { ACTION_BUTTON_CLASSES, GHOST_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../../../constants';
import { Dossier, DossierConfig, DossierMessage, DossierNote, Language } from '../../../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../../../lib/firestore';
import { PROFILS, indexEtape, etapeSuivante, dossierMarkdown, telecharger } from '../../../lib/dossier';
import { formatEcheance } from './util';
import PiecesAdmin from './PiecesAdmin';
import NotesPrivees from './NotesPrivees';
import FilAdmin from './FilAdmin';
import PortailModal from './PortailModal';

interface FicheDossierProps {
  dossier: Dossier;
  config: DossierConfig;
  lang: Language;
  onBack: () => void;
}

const t = {
  FR: {
    back: 'Retour à la liste',
    exportMd: 'Export Markdown',
    print: 'Imprimer en PDF',
    archive: 'Archiver',
    desarchiver: 'Désarchiver',
    delete: 'Supprimer',
    confirmDeleteTitle: 'Supprimer ce dossier ?',
    confirmDeleteText: 'Cette action retire le dossier, ses pièces, ses notes et ses messages. Elle est définitive.',
    confirmDeleteOui: 'Oui, supprimer',
    confirmDeleteNon: 'Annuler',
    parcours: 'Le parcours',
    suivant: "Passer à l'étape suivante",
    derniereEtape: 'Dernière étape du parcours',
    changerEtape: "Faire reculer ou avancer l'étape",
    echeance: 'Échéance',
    discipline: 'Discipline',
    erreurGenerique: "L'action n'a pas fonctionné. Réessaie.",
  },
  EN: {
    back: 'Back to list',
    exportMd: 'Export Markdown',
    print: 'Print to PDF',
    archive: 'Archive',
    desarchiver: 'Unarchive',
    delete: 'Delete',
    confirmDeleteTitle: 'Delete this file?',
    confirmDeleteText: 'This removes the file, its documents, notes and messages. It cannot be undone.',
    confirmDeleteOui: 'Yes, delete',
    confirmDeleteNon: 'Cancel',
    parcours: 'The journey',
    suivant: 'Move to next step',
    derniereEtape: 'Last step of the journey',
    changerEtape: 'Move the step back or forward',
    echeance: 'Deadline',
    discipline: 'Discipline',
    erreurGenerique: 'That action failed. Try again.',
  },
};

const FicheDossier: React.FC<FicheDossierProps> = ({ dossier, config, lang, onBack }) => {
  const tr = t[lang];
  const uid = dossier.id;

  const { data: messages } = useCollection<DossierMessage>(`dossiers/${uid}/messages`, [orderBy('createdAt', 'asc')]);
  const { data: notes } = useCollection<DossierNote>(`dossiers/${uid}/notes`, [orderBy('createdAt', 'desc')]);

  const [busyEtape, setBusyEtape] = useState(false);
  const [busyArchive, setBusyArchive] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // À l'ouverture de la fiche : les pièces/messages vus par Laurie ne comptent plus comme non-lus.
  useEffect(() => {
    if (dossier.nonLusAdmin) {
      patchDoc('dossiers', uid, { nonLusAdmin: 0 }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    messages
      .filter((m) => m.de === 'client' && !m.luParAdmin)
      .forEach((m) => {
        patchDoc(`dossiers/${uid}/messages`, m.id, { luParAdmin: true }).catch(() => {});
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, uid]);

  const changerEtape = async (etapeId: string) => {
    if (etapeId === dossier.etape || busyEtape) return;
    setBusyEtape(true);
    setErreur(null);
    try {
      await patchDoc('dossiers', uid, {
        etape: etapeId,
        derniereActiviteAdmin: serverTimestamp(),
        nonLusClient: increment(1),
      });
    } catch {
      setErreur(tr.erreurGenerique);
    } finally {
      setBusyEtape(false);
    }
  };

  const suivante = etapeSuivante(config.etapes, dossier.etape);

  const validerPiece = async (pieceId: string) => {
    setErreur(null);
    try {
      await patchDoc('dossiers', uid, {
        [`pieces.${pieceId}.etat`]: 'valide',
        derniereActiviteAdmin: serverTimestamp(),
      });
    } catch {
      setErreur(tr.erreurGenerique);
    }
  };

  const pieceARefaire = async (pieceId: string, remarque: string) => {
    setErreur(null);
    try {
      await patchDoc('dossiers', uid, {
        [`pieces.${pieceId}.etat`]: 'a_refaire',
        [`pieces.${pieceId}.note`]: remarque,
        derniereActiviteAdmin: serverTimestamp(),
        nonLusClient: increment(1),
      });
    } catch {
      setErreur(tr.erreurGenerique);
    }
  };

  const ajouterNote = async (texte: string) => {
    await createDoc(`dossiers/${uid}/notes`, { texte });
  };

  const supprimerNote = async (id: string) => {
    await removeDoc(`dossiers/${uid}/notes`, id);
  };

  const envoyerMessage = async (texte: string) => {
    const admin = auth.currentUser;
    if (!admin) throw new Error('non connecté');
    await createDoc(`dossiers/${uid}/messages`, {
      texte,
      de: 'admin',
      deUid: admin.uid,
      luParAdmin: true,
      luParClient: false,
    });
    await patchDoc('dossiers', uid, { nonLusClient: increment(1), derniereActiviteAdmin: serverTimestamp() });
  };

  const toggleArchive = async () => {
    setBusyArchive(true);
    setErreur(null);
    try {
      await patchDoc('dossiers', uid, { archive: !dossier.archive });
    } catch {
      setErreur(tr.erreurGenerique);
    } finally {
      setBusyArchive(false);
    }
  };

  const supprimer = async () => {
    setBusyDelete(true);
    setErreur(null);
    try {
      await removeDoc('dossiers', uid);
      setConfirmDelete(false);
      onBack();
    } catch {
      setErreur(tr.erreurGenerique);
      setBusyDelete(false);
    }
  };

  const exporterMarkdown = () => {
    const contenu = dossierMarkdown(dossier, config, notes, messages);
    telecharger(`dossier-${(dossier.nom || dossier.courriel).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`, contenu);
  };

  const profil = PROFILS.find((p) => p.id === dossier.profil)?.nom ?? dossier.profil;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="print:hidden flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {tr.back}
      </button>

      {erreur && (
        <div className="print:hidden flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-[15px] p-3" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {erreur}
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 print:bg-white print:border-slate-300 print:text-black">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-serif font-bold text-white print:text-black">{dossier.nom || dossier.courriel}</h1>
            <p className="text-cyan-300 print:text-black text-sm mt-1">
              {profil}
              {dossier.discipline ? ` · ${dossier.discipline}` : ''}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-slate-300 print:text-black">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {dossier.courriel}</span>
              {dossier.telephone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> {dossier.telephone}</span>}
              {dossier.ville && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {dossier.ville}</span>}
              {dossier.projet?.echeance && (
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {tr.echeance} : {formatEcheance(dossier.projet.echeance)}</span>
              )}
            </div>
            {dossier.projet?.titre && (
              <p className="mt-3 text-white font-medium">{dossier.projet.titre}</p>
            )}
            {dossier.projet?.description && (
              <p className="text-slate-400 print:text-black text-sm mt-1 max-w-2xl">{dossier.projet.description}</p>
            )}
          </div>
          <div className="print:hidden flex flex-wrap gap-2 md:justify-end">
            <button type="button" onClick={exporterMarkdown} className={GHOST_BUTTON_CLASSES}>
              <Download className="w-4 h-4" /> {tr.exportMd}
            </button>
            <button type="button" onClick={() => window.print()} className={GHOST_BUTTON_CLASSES}>
              <Printer className="w-4 h-4" /> {tr.print}
            </button>
            <button
              type="button"
              onClick={toggleArchive}
              disabled={busyArchive}
              className="px-4 py-2 rounded-[15px] border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 text-slate-300 text-sm flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
            >
              {dossier.archive ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              {dossier.archive ? tr.desarchiver : tr.archive}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 rounded-[15px] border border-red-500/25 hover:bg-red-500/10 text-red-300 text-sm flex items-center gap-2 min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" /> {tr.delete}
            </button>
          </div>
        </div>
      </div>

      {/* Parcours */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 print:bg-white print:border-slate-300 print:text-black">
        <h3 className="text-lg font-serif font-bold text-white print:text-black mb-4">{tr.parcours}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {config.etapes.map((e, i) => {
            const courant = i === indexEtape(config.etapes, dossier.etape);
            const passee = i < indexEtape(config.etapes, dossier.etape);
            return (
              <React.Fragment key={e.id}>
                {i > 0 && <ChevronRight className="w-4 h-4 text-slate-600 print:hidden" />}
                <div
                  className={`px-3 py-2 rounded-full text-xs font-medium border ${
                    courant
                      ? 'bg-iridescent text-white border-transparent shadow-iridescent-sm'
                      : passee
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                        : 'bg-white/5 text-slate-500 border-white/10'
                  }`}
                  title={e.sous}
                >
                  {e.titre}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="print:hidden flex flex-col sm:flex-row gap-3 mt-4 items-start sm:items-center">
          <button
            type="button"
            onClick={() => suivante && changerEtape(suivante.id)}
            disabled={!suivante || busyEtape}
            className={`${ACTION_BUTTON_CLASSES} disabled:opacity-40`}
          >
            {tr.suivant}
          </button>
          {!suivante && <span className="text-xs text-slate-500">{tr.derniereEtape}</span>}
          <label className="flex items-center gap-2 text-xs text-slate-400 sm:ml-auto">
            <span className="sr-only">{tr.changerEtape}</span>
            <select
              value={dossier.etape}
              onChange={(e) => changerEtape(e.target.value)}
              disabled={busyEtape}
              className={`${GLASS_INPUT_CLASSES} py-2 text-xs w-auto`}
              aria-label={tr.changerEtape}
            >
              {config.etapes.map((e) => (
                <option key={e.id} value={e.id}>{e.titre}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Pièces + colonnes latérales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6">
          <PiecesAdmin dossier={dossier} pieces={config.pieces} lang={lang} onValider={validerPiece} onARefaire={pieceARefaire} />
        </div>
        <div className="space-y-6">
          <NotesPrivees notes={notes} lang={lang} onAdd={ajouterNote} onDelete={supprimerNote} />
          <FilAdmin messages={messages} dossierNom={dossier.nom || dossier.courriel} lang={lang} onSend={envoyerMessage} />
        </div>
      </div>

      {confirmDelete && (
        <PortailModal>
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[20px] shadow-2xl p-6">
              <h2 className="text-lg font-serif font-bold text-white mb-2">{tr.confirmDeleteTitle}</h2>
              <p className="text-sm text-slate-400 mb-6">{tr.confirmDeleteText}</p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-[15px] text-slate-300 hover:bg-white/5 min-h-[44px]">
                  {tr.confirmDeleteNon}
                </button>
                <button
                  type="button"
                  onClick={supprimer}
                  disabled={busyDelete}
                  className="px-4 py-2 rounded-[15px] bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 disabled:opacity-50 min-h-[44px]"
                >
                  {busyDelete ? '…' : tr.confirmDeleteOui}
                </button>
              </div>
            </div>
          </div>
        </PortailModal>
      )}
    </div>
  );
};

export default FicheDossier;
