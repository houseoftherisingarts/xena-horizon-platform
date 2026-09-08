import { useMemo } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { useDocument } from './firestore';
import type {
  Dossier,
  DossierConfig,
  DossierMessage,
  DossierNote,
  EtapeDef,
  Language,
  PieceDef,
  ProfilClient,
} from '../types';

/**
 * Le contrat du dossier client, partagé par l'espace client (/espace) et le back-office (/admin/dossiers).
 * Patron porté du module client de Vexel : les constantes
 * PIECES et ETAPES pilotent tout, ici sauvegardées dans Firestore (settings/dossier) pour que Laurie
 * puisse les modifier depuis son admin. Les valeurs ci-dessous sont le repli tant qu'elle n'a rien changé.
 *
 * La liste des pièces est déduite des services que Laurie décrit sur son site actuel (rédaction de
 * biographie, demande de subvention, dossier de presse, textes de vente, publications, identité de marque,
 * stratégie événementielle). Elle doit être confirmée avec elle avant le lancement.
 */

export const PIECES_PAR_DEFAUT: PieceDef[] = [
  { id: 'parcours', cat: 'Qui tu es', catEn: 'Who you are', nom: 'Ton CV artistique ou ton parcours', nomEn: 'Your artistic CV or background', aide: 'Formations, réalisations, expositions, spectacles, publications : tout ce qui raconte ton chemin, même en vrac.', aideEn: 'Training, achievements, exhibitions, performances, publications: anything that tells your story, even in rough form.' },
  { id: 'bio', cat: 'Qui tu es', catEn: 'Who you are', nom: 'Ta biographie actuelle', nomEn: 'Your current biography', aide: 'Celle qui circule en ce moment, même si elle te déplaît. Elle sert de point de départ.', aideEn: 'Whatever is circulating right now, even if you do not like it. It gives us a starting point.', option: true },
  { id: 'photos', cat: 'Qui tu es', catEn: 'Who you are', nom: 'Tes photos professionnelles ou ton portfolio', nomEn: 'Your professional photos or portfolio', aide: 'Quelques images de toi et de ton travail, en bonne résolution. Un lien vers un dossier partagé fait aussi l\'affaire.', aideEn: 'A few images of you and your work, in good resolution. A link to a shared folder works too.' },
  { id: 'liens', cat: 'Qui tu es', catEn: 'Who you are', nom: 'Tes liens en ligne', nomEn: 'Your online links', aide: 'Site web, réseaux sociaux, balado, chaîne vidéo, boutique : colle les adresses dans un document.', aideEn: 'Website, social media, podcast, video channel, shop: paste the addresses into a document.' },
  { id: 'projet', cat: 'Ton projet', catEn: 'Your project', nom: 'La description de ton projet ou de ton événement', nomEn: 'The description of your project or event', aide: 'Une page qui dit ce que tu veux faire, pour qui, et ce que ça changerait pour toi.', aideEn: 'A page that says what you want to do, for whom, and what it would change for you.' },
  { id: 'budget', cat: 'Ton projet', catEn: 'Your project', nom: 'Ton budget', nomEn: 'Your budget', aide: 'Même approximatif. Il sert à choisir les bonnes actions.', aideEn: 'Even a rough one. It helps choose the right actions.', option: true },
  { id: 'echeancier', cat: 'Ton projet', catEn: 'Your project', nom: 'Ton échéancier', nomEn: 'Your timeline', aide: 'Les dates qui comptent : lancement, dépôt de subvention, tournée, exposition.', aideEn: 'The dates that matter: launch, grant deadline, tour, exhibition.', option: true },
  { id: 'subvention', cat: 'Tes textes', catEn: 'Your texts', nom: 'Ta demande de subvention en cours', nomEn: 'Your grant application in progress', aide: 'Le formulaire de l\'organisme et ce que tu as déjà écrit, même incomplet.', aideEn: 'The organization\'s form and whatever you have already written, even unfinished.', option: true },
  { id: 'presse', cat: 'Tes textes', catEn: 'Your texts', nom: 'Ton dossier de presse existant', nomEn: 'Your existing press kit', aide: 'S\'il existe. Sinon, nous le bâtirons ensemble.', aideEn: 'If it exists. If not, we will build it together.', option: true },
  { id: 'communiques', cat: 'Tes textes', catEn: 'Your texts', nom: 'Tes anciens communiqués et textes publicitaires', nomEn: 'Your past press releases and promotional texts', aide: 'Ceux qui n\'ont pas donné les résultats espérés en disent long sur ce qu\'il faut changer.', aideEn: 'The ones that did not get the results you hoped for say a lot about what needs to change.', option: true },
  { id: 'ventes', cat: 'Tes textes', catEn: 'Your texts', nom: 'Tes textes de vente et tes publications', nomEn: 'Your sales copy and your posts', aide: 'Descriptions de spectacles, fiches d\'ateliers, publications marquantes des derniers mois.', aideEn: 'Show descriptions, workshop sheets, standout posts from recent months.', option: true },
  { id: 'marque', cat: 'Ta marque', catEn: 'Your brand', nom: 'Ton logo et ton matériel de marque', nomEn: 'Your logo and brand materials', aide: 'Logo, couleurs, typographies, cartes, affiches : tout ce qui porte ton nom.', aideEn: 'Logo, colours, fonts, cards, posters: anything that carries your name.', option: true },
  { id: 'contacts', cat: 'Ta marque', catEn: 'Your brand', nom: 'Tes contacts, partenaires et commanditaires', nomEn: 'Your contacts, partners and sponsors', aide: 'Les gens et les organisations avec qui tu travailles déjà. Une liste simple suffit.', aideEn: 'The people and organizations you already work with. A simple list is enough.', option: true },
  { id: 'entente', cat: 'Ta marque', catEn: 'Your brand', nom: 'L\'entente de service signée', nomEn: 'The signed service agreement', aide: 'Laurie te la fait parvenir après le premier appel. Dépose-la ici une fois signée.', aideEn: 'Laurie sends it to you after the first call. Upload it here once signed.', option: true },
];

/** EtapeDef + son pendant anglais (titreEn, sousEn), lu par PorteClient.tsx et Parcours.tsx. */
export type EtapeDefEn = EtapeDef & { titreEn?: string; sousEn?: string };

export const ETAPES_PAR_DEFAUT: EtapeDefEn[] = [
  { id: 'contact', titre: 'Premier contact', sous: 'Tu me racontes ton projet et nous voyons si nous sommes faits pour travailler ensemble.', titreEn: 'First contact', sousEn: 'You tell me about your project and we see if we are a good fit to work together.' },
  { id: 'diagnostic', titre: 'Diagnostic', sous: 'Laurie lit ton dossier et pose les bonnes questions.', titreEn: 'Diagnostic', sousEn: 'Laurie reads your file and asks the right questions.' },
  { id: 'plan', titre: 'Plan d\'action', sous: 'Une ligne directrice claire, écrite noir sur blanc.', titreEn: 'Action plan', sousEn: 'A clear guideline, written in black and white.' },
  { id: 'action', titre: 'Mise en œuvre', sous: 'Les textes, les outils et les gestes qui font avancer ton projet.', titreEn: 'Implementation', sousEn: 'The texts, tools and actions that move your project forward.' },
  { id: 'suivi', titre: 'Suivi', sous: 'Nous mesurons ce qui a bougé et nous ajustons le tir.', titreEn: 'Follow-up', sousEn: 'We measure what has changed and adjust our approach.' },
];

export const PROFILS: { id: ProfilClient; nom: string; nomEn: string; aide: string; aideEn: string }[] = [
  { id: 'artiste', nom: 'Artiste', nomEn: 'Artist', aide: 'Danse, écriture, théâtre, musique, chant, peinture, photo, cirque et toutes les autres disciplines.', aideEn: 'Dance, writing, theatre, music, singing, painting, photography, circus and all other disciplines.' },
  { id: 'entrepreneur', nom: 'Entrepreneur créatif', nomEn: 'Creative entrepreneur', aide: 'Tu diriges un projet, un studio ou une entreprise à l\'esprit créatif.', aideEn: 'You run a project, a studio or a business with a creative spirit.' },
  { id: 'organisme', nom: 'Organisme ou entreprise', nomEn: 'Organization or business', aide: 'Un OBNL, un centre, un festival ou une entreprise qui a besoin de stratégie et de visibilité.', aideEn: 'A non-profit, a center, a festival or a business that needs strategy and visibility.' },
];

export const CONFIG_PAR_DEFAUT: DossierConfig = { pieces: PIECES_PAR_DEFAUT, etapes: ETAPES_PAR_DEFAUT };

/** Chemin du document de configuration éditable par Laurie. */
export const CONFIG_PATH = 'settings/dossier';

/** Lecture en direct du catalogue de pièces et d'étapes, avec repli sur les valeurs par défaut. */
export function useDossierConfig(): DossierConfig {
  const { data } = useDocument<Partial<DossierConfig>>(CONFIG_PATH);
  return useMemo(
    () => ({
      pieces: data?.pieces && data.pieces.length > 0 ? data.pieces : PIECES_PAR_DEFAUT,
      etapes: data?.etapes && data.etapes.length > 0 ? data.etapes : ETAPES_PAR_DEFAUT,
    }),
    [data]
  );
}

/** Types de fichiers acceptés au dépôt et plafond par fichier (25 Mo, aligné sur storage.rules). */
export const TYPES_ACCEPTES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];
export const TAILLE_MAX = 25 * 1024 * 1024;

export const cheminPiece = (uid: string, pieceId: string, nomFichier: string): string => {
  const propre = nomFichier.replace(/[^\w.\-]+/g, '_').slice(0, 80);
  return `dossiers/${uid}/${pieceId}/${Date.now()}-${propre}`;
};

/** Dossier neuf, au premier passage d'une personne dans son espace. */
export const nouveauDossier = (
  uid: string,
  courriel: string,
  nom: string,
  extras: Partial<Dossier> = {}
): Omit<Dossier, 'id'> => ({
  uid,
  courriel,
  nom,
  profil: 'artiste',
  projet: { titre: '', description: '', objectif: '' },
  etape: ETAPES_PAR_DEFAUT[0].id,
  pieces: {},
  nonLusAdmin: 0,
  nonLusClient: 0,
  archive: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  derniereActiviteClient: serverTimestamp(),
  ...extras,
});

/** Pourcentage de pièces obligatoires reçues (les pièces optionnelles ne comptent pas). */
export const avancement = (dossier: Pick<Dossier, 'pieces'>, pieces: PieceDef[]): number => {
  const requises = pieces.filter((p) => !p.option);
  if (requises.length === 0) return 100;
  const recues = requises.filter((p) => !!dossier.pieces?.[p.id]).length;
  return Math.round((recues / requises.length) * 100);
};

export const piecesManquantes = (dossier: Pick<Dossier, 'pieces'>, pieces: PieceDef[]): PieceDef[] =>
  pieces.filter((p) => !p.option && !dossier.pieces?.[p.id]);

export const piecesParCategorie = (pieces: PieceDef[]): { cat: string; pieces: PieceDef[] }[] => {
  const cats: Record<string, PieceDef[]> = {};
  pieces.forEach((p) => {
    (cats[p.cat] = cats[p.cat] || []).push(p);
  });
  return Object.entries(cats).map(([cat, list]) => ({ cat, pieces: list }));
};

/** Nom, aide et catégorie d'une pièce dans la langue voulue, avec repli sur le FR si les champs EN manquent (catalogue modifié par Laurie sans les remplir). */
export const libellesPiece = (piece: PieceDef, lang: Language): { nom: string; aide: string; cat: string } => ({
  nom: (lang === 'EN' && piece.nomEn) || piece.nom,
  aide: (lang === 'EN' && piece.aideEn) || piece.aide || '',
  cat: (lang === 'EN' && piece.catEn) || piece.cat,
});

/** Étiquette d'une catégorie (déduite du catEn d'une de ses pièces) dans la langue voulue, avec repli sur le FR. */
export const libelleCategorie = (cat: string, pieces: PieceDef[], lang: Language): string => {
  if (lang !== 'EN') return cat;
  return pieces.find((p) => p.cat === cat && p.catEn)?.catEn ?? cat;
};

export type EtatPiece = 'manquante' | 'deposee' | 'valide' | 'a_refaire' | 'redeposee';

const versLeMillis = (ts: any): number => {
  if (!ts) return Date.now(); // écriture en cours (serverTimestamp pas encore résolu côté client) : compte comme « maintenant »
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (typeof ts.toDate === 'function') return ts.toDate().getTime();
  if (ts instanceof Date) return ts.getTime();
  return 0;
};

/**
 * L'état affiché d'une pièce : croise le dépôt de la personne (pieces) avec le jugement de Laurie
 * (revue), jamais l'inverse — le client n'a pas le droit d'écrire `revue` (firestore.rules). Un
 * fichier redéposé après une revue « à refaire » repart en attente : Laurie doit rejuger, la
 * personne ne peut jamais s'auto-valider.
 */
export const etatPiece = (dossier: Pick<Dossier, 'pieces' | 'revue'>, pieceId: string): EtatPiece => {
  const deposee = dossier.pieces?.[pieceId];
  if (!deposee) return 'manquante';
  const revue = dossier.revue?.[pieceId];
  if (!revue) return 'deposee';
  return versLeMillis(deposee.deposeLe) > versLeMillis(revue.revueLe) ? 'redeposee' : revue.etat;
};

export const indexEtape = (etapes: EtapeDef[], etapeId: string): number =>
  Math.max(0, etapes.findIndex((e) => e.id === etapeId));

export const etapeSuivante = (etapes: EtapeDef[], etapeId: string): EtapeDef | null => {
  const i = indexEtape(etapes, etapeId);
  return i < etapes.length - 1 ? etapes[i + 1] : null;
};

const dateCourte = (ts: any): string => {
  try {
    const d: Date = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    return d ? d.toLocaleDateString('fr-CA') : '';
  } catch {
    return '';
  }
};

const etiquetteEtat = (etat: EtatPiece): string =>
  etat === 'valide' ? 'validée' : etat === 'a_refaire' ? 'à refaire' : etat === 'redeposee' ? 'nouveau dépôt, en attente de Laurie' : 'déposée';

/**
 * Fiche complète en Markdown, taillée pour être collée dans un assistant IA
 * (porté du module client de Vexel).
 */
export function dossierMarkdown(
  dossier: Dossier,
  config: DossierConfig,
  notes: DossierNote[] = [],
  messages: DossierMessage[] = []
): string {
  const { pieces, etapes } = config;
  const etape = etapes.find((e) => e.id === dossier.etape);
  const profil = PROFILS.find((p) => p.id === dossier.profil)?.nom ?? dossier.profil;
  const lignes: string[] = [];
  lignes.push(`# Dossier de ${dossier.nom || dossier.courriel}`);
  lignes.push('');
  lignes.push(`- Courriel : ${dossier.courriel}`);
  if (dossier.telephone) lignes.push(`- Téléphone : ${dossier.telephone}`);
  if (dossier.ville) lignes.push(`- Ville : ${dossier.ville}`);
  lignes.push(`- Profil : ${profil}${dossier.discipline ? ` (${dossier.discipline})` : ''}`);
  lignes.push(`- Étape du parcours : ${etape ? `${indexEtape(etapes, dossier.etape) + 1}. ${etape.titre}` : dossier.etape}`);
  lignes.push(`- Avancement des pièces : ${avancement(dossier, pieces)} %`);
  if (dossier.createdAt) lignes.push(`- Dossier ouvert le ${dateCourte(dossier.createdAt)}`);
  lignes.push('');
  lignes.push('## Le projet');
  lignes.push('');
  lignes.push(`**${dossier.projet?.titre || 'Sans titre'}**`);
  if (dossier.projet?.description) lignes.push('', dossier.projet.description);
  if (dossier.projet?.objectif) lignes.push('', `Objectif : ${dossier.projet.objectif}`);
  if (dossier.projet?.echeance) lignes.push('', `Échéance : ${dossier.projet.echeance}`);
  lignes.push('');
  lignes.push('## Les pièces');
  lignes.push('');
  piecesParCategorie(pieces).forEach(({ cat, pieces: list }) => {
    lignes.push(`### ${cat}`);
    list.forEach((p) => {
      const d = dossier.pieces?.[p.id];
      const etat = etatPiece(dossier, p.id);
      const note = etat === 'a_refaire' ? dossier.revue?.[p.id]?.note : undefined;
      const statut = d ? `${etiquetteEtat(etat)} le ${dateCourte(d.deposeLe)} (${d.nom})` : p.option ? 'non fournie (optionnelle)' : 'MANQUANTE';
      lignes.push(`- ${p.nom} : ${statut}${note ? ` — remarque : ${note}` : ''}`);
    });
    lignes.push('');
  });
  const manque = piecesManquantes(dossier, pieces);
  lignes.push('## Ce qui manque');
  lignes.push('');
  lignes.push(manque.length ? manque.map((p) => `- ${p.nom}`).join('\n') : 'Rien : toutes les pièces obligatoires sont reçues.');
  lignes.push('');
  if (notes.length) {
    lignes.push('## Notes de Laurie (privées)');
    lignes.push('');
    notes.forEach((n) => lignes.push(`- ${dateCourte(n.createdAt)} : ${n.texte}`));
    lignes.push('');
  }
  if (messages.length) {
    lignes.push('## Fil de messages');
    lignes.push('');
    messages.forEach((m) => lignes.push(`- ${dateCourte(m.createdAt)} · ${m.de === 'admin' ? 'Laurie' : dossier.nom || 'Client'} : ${m.texte}`));
    lignes.push('');
  }
  return lignes.join('\n');
}

/** Déclenche le téléchargement d'un texte (Markdown, CSV) depuis le navigateur. */
export function telecharger(nom: string, contenu: string, type = 'text/markdown;charset=utf-8'): void {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Export CSV de la liste des dossiers (BOM UTF-8 pour Excel), porté du back-office du module client de Vexel. */
export function dossiersCsv(dossiers: Dossier[], config: DossierConfig): string {
  const entete = ['Nom', 'Courriel', 'Téléphone', 'Profil', 'Projet', 'Étape', 'Avancement', 'Ouvert le'];
  const lignes = dossiers.map((d) => [
    d.nom,
    d.courriel,
    d.telephone ?? '',
    PROFILS.find((p) => p.id === d.profil)?.nom ?? d.profil,
    d.projet?.titre ?? '',
    config.etapes.find((e) => e.id === d.etape)?.titre ?? d.etape,
    `${avancement(d, config.pieces)} %`,
    dateCourte(d.createdAt),
  ]);
  const cellule = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [entete, ...lignes].map((l) => l.map(cellule).join(';')).join('\n');
}
