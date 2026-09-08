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
import { Dossier, DossierConfig, DossierMessage, DossierNote, Language } from '../../../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../../../lib/firestore';
import { PROFILS, indexEtape, etapeSuivante, dossierMarkdown, telecharger } from '../../../lib/dossier';
import { formatEcheance } from './util';
import PiecesAdmin from './PiecesAdmin';
import NotesPrivees from './NotesPrivees';
import FilAdmin from './FilAdmin';
import PortailModal from './PortailModal';
import { EnTete, Panneau, Bouton, Etiquette } from '../ui';

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
        [`revue.${pieceId}`]: { etat: 'valide', revueLe: serverTimestamp() },
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
        [`revue.${pieceId}`]: { etat: 'a_refaire', note: remarque, revueLe: serverTimestamp() },
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
    <div className="px-6 md:px-10 py-10 space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="print:hidden flex items-center gap-2 text-sm text-gris hover:text-encre transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {tr.back}
      </button>

      {erreur && (
        <div className="print:hidden flex items-center gap-2 text-sm text-rose border border-rose/30 rounded-champ p-3" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" /> {erreur}
        </div>
      )}

      {/* En-tête */}
      <EnTete
        kicker={profil + (dossier.discipline ? ` · ${dossier.discipline}` : '')}
        titre={dossier.nom || dossier.courriel}
        actions={
          <>
            <Bouton variante="secondaire" petit icone={Download} onClick={exporterMarkdown}>
              {tr.exportMd}
            </Bouton>
            <Bouton variante="secondaire" petit icone={Printer} onClick={() => window.print()}>
              {tr.print}
            </Bouton>
            <Bouton
              variante="secondaire"
              petit
              icone={dossier.archive ? ArchiveRestore : Archive}
              onClick={toggleArchive}
              disabled={busyArchive}
            >
              {dossier.archive ? tr.desarchiver : tr.archive}
            </Bouton>
            <Bouton variante="danger" petit icone={Trash2} onClick={() => setConfirmDelete(true)}>
              {tr.delete}
            </Bouton>
          </>
        }
      />
      <div className="print:text-black -mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gris">
        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" aria-hidden="true" /> {dossier.courriel}</span>
        {dossier.telephone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" aria-hidden="true" /> {dossier.telephone}</span>}
        {dossier.ville && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {dossier.ville}</span>}
        {dossier.projet?.echeance && (
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" /> {tr.echeance} : {formatEcheance(dossier.projet.echeance)}</span>
        )}
      </div>
      {dossier.projet?.titre && <p className="text-encre font-medium">{dossier.projet.titre}</p>}
      {dossier.projet?.description && (
        <p className="text-gris text-sm mesure">{dossier.projet.description}</p>
      )}

      {/* Parcours */}
      <Panneau titre={tr.parcours}>
        <div className="flex flex-wrap items-center gap-2">
          {config.etapes.map((e, i) => {
            const courant = i === indexEtape(config.etapes, dossier.etape);
            const passee = i < indexEtape(config.etapes, dossier.etape);
            return (
              <React.Fragment key={e.id}>
                {i > 0 && <ChevronRight className="w-4 h-4 text-gris print:hidden" aria-hidden="true" />}
                {courant ? (
                  <Etiquette tone="encre">{e.titre}</Etiquette>
                ) : passee ? (
                  <Etiquette tone="accent">{e.titre}</Etiquette>
                ) : (
                  <Etiquette tone="neutre">{e.titre}</Etiquette>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="print:hidden flex flex-col sm:flex-row gap-3 mt-4 items-start sm:items-center">
          <Bouton variante="primaire" petit onClick={() => suivante && changerEtape(suivante.id)} disabled={!suivante || busyEtape}>
            {tr.suivant}
          </Bouton>
          {!suivante && <span className="text-xs text-gris">{tr.derniereEtape}</span>}
          <label className="flex items-center gap-2 text-xs text-gris sm:ml-auto">
            <span className="sr-only">{tr.changerEtape}</span>
            <select
              value={dossier.etape}
              onChange={(e) => changerEtape(e.target.value)}
              disabled={busyEtape}
              className="bg-papier border border-filet rounded-champ px-3 py-2 text-xs text-encre outline-none focus:border-rose"
              aria-label={tr.changerEtape}
            >
              {config.etapes.map((e) => (
                <option key={e.id} value={e.id}>{e.titre}</option>
              ))}
            </select>
          </label>
        </div>
      </Panneau>

      {/* Pièces + colonnes latérales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panneau className="lg:col-span-2">
          <PiecesAdmin dossier={dossier} pieces={config.pieces} lang={lang} onValider={validerPiece} onARefaire={pieceARefaire} />
        </Panneau>
        <div className="space-y-6">
          <NotesPrivees notes={notes} lang={lang} onAdd={ajouterNote} onDelete={supprimerNote} />
          <FilAdmin messages={messages} dossierNom={dossier.nom || dossier.courriel} lang={lang} onSend={envoyerMessage} />
        </div>
      </div>

      {confirmDelete && (
        <PortailModal>
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-encre/60">
            <div className="w-full max-w-md bg-papier border border-filet rounded-champ shadow-panneau p-6">
              <h2 className="font-serif text-h3 text-encre mb-2">{tr.confirmDeleteTitle}</h2>
              <p className="text-sm text-gris mb-6">{tr.confirmDeleteText}</p>
              <div className="flex justify-end gap-3">
                <Bouton variante="discret" onClick={() => setConfirmDelete(false)}>
                  {tr.confirmDeleteNon}
                </Bouton>
                <Bouton variante="danger" onClick={supprimer} disabled={busyDelete}>
                  {busyDelete ? '…' : tr.confirmDeleteOui}
                </Bouton>
              </div>
            </div>
          </div>
        </PortailModal>
      )}
    </div>
  );
};

export default FicheDossier;
