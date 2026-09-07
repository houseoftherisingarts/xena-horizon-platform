import type { Dossier, DossierConfig } from '../types';
import { avancement, indexEtape, piecesManquantes, piecesParCategorie } from './dossier';

/**
 * Le moteur de l'assistant flottant de l'espace client, porté du patron PD.repondre
 * de courtier-dufresne/app/pd-app.js : des sujets par expressions régulières, aucune
 * clé d'API, aucune requête réseau. Il répond en français sur ce que la page sait
 * vraiment (le catalogue de pièces, le dossier de la personne connectée, les prix
 * affichés sur le site actuel de Laurie) et refuse d'inventer un prix ou une promesse.
 */

interface SujetAssistant {
  motif: RegExp;
  reponse: (config: DossierConfig, dossier: Dossier | null) => string;
}

const SUJETS: SujetAssistant[] = [
  // Le catalogue : quelles pièces sont demandées.
  {
    motif: /pi[eè]ce|document|papier|fournir/i,
    reponse: (config) => {
      const parCat = piecesParCategorie(config.pieces)
        .map(({ cat, pieces }) => `${cat} : ${pieces.map((p) => p.nom).join(', ')}.`)
        .join('\n');
      return `Voici ce que je te demande, classé par catégorie.\n\n${parCat}\n\nTu peux tout déposer dans l'onglet Mes pièces, une à la fois ou plusieurs d'un coup. Je les vois arriver de mon côté dès qu'elles entrent.`;
    },
  },
  // Ce qui manque dans LE dossier de la personne connectée.
  {
    motif: /manque|reste|il me manque|mon dossier|complet/i,
    reponse: (config, dossier) => {
      if (!dossier) return "Ouvre d'abord ton dossier pour que je puisse te dire ce qu'il te manque.";
      const manquantes = piecesManquantes(dossier, config.pieces);
      const pct = avancement(dossier, config.pieces);
      if (manquantes.length === 0) {
        return `Ton dossier est complet à ${pct} %. Toutes les pièces obligatoires sont reçues, je prends le relais à partir d'ici.`;
      }
      return `Ton dossier est complet à ${pct} %. Il te manque encore : ${manquantes.map((p) => p.nom).join(', ')}. Le reste peut attendre, ce sont les seules pièces qui bloquent la suite.`;
    },
  },
  // Le parcours et l'étape courante.
  {
    motif: /[ée]tape|parcours|avancement|combien de temps|d[ée]lai|prochaine/i,
    reponse: (config, dossier) => {
      const suite = config.etapes.map((e, i) => `${i + 1}. ${e.titre} : ${e.sous}`).join(' ');
      if (!dossier) return `Le parcours tient en ${config.etapes.length} temps. ${suite}`;
      const idx = indexEtape(config.etapes, dossier.etape);
      const courante = config.etapes[idx];
      return `Le parcours tient en ${config.etapes.length} temps. ${suite} Tu es rendue à l'étape ${idx + 1}, ${courante ? courante.titre.toLowerCase() : ''}.`;
    },
  },
  // Comment déposer un fichier, mécanique du geste.
  {
    motif: /comment.*(d[ée]pos|envoi|t[ée]l[ée]vers|glisse)|glisser.?d[ée]poser/i,
    reponse: () =>
      "C'est simple. Dans l'onglet Mes pièces, clique sur Déposer à côté de la pièce concernée, ou glisse ton fichier directement sur la carte. Choisis un PDF, une photo, un Word ou un Excel, jusqu'à 25 Mo par fichier. Une barre te montre l'envoi, et la pièce passe à déposée dès que c'est fini.",
  },
  // Services et prix de départ, tels qu'affichés sur le site actuel de Laurie.
  {
    motif: /prix|tarif|co[uû]t|combien.*(coûte|charge)|service|offre|abonnement|mentorat|forfait/i,
    reponse: () =>
      "Mes services de départ : stratégie de communication à partir de 3 500 $ plus taxes, rédaction à partir de 1 000 $ plus taxes, et un abonnement mensuel à partir de 99 $ par mois pour un minimum de trois mois. Le prix exact dépend toujours de ton projet, je le confirme avec toi de vive voix.",
  },
  // Comment joindre Laurie.
  {
    motif: /joindre|contact|t[ée]l[ée]phone|appeler|courriel|rendez.?vous|parler [àa] laurie/i,
    reponse: () =>
      "Le plus direct reste le téléphone : 514 821-8755. Par courriel, c'est laurie.belhumeur@gmail.com. Tu peux aussi m'écrire directement dans l'onglet Messages, je réponds de là.",
  },
];

/** Réponse de repli, honnête : jamais de prix ni de promesse inventés. */
const REPLI =
  "Je ne veux pas te lancer un prix ou une promesse au hasard. Sur celle-là, écris-moi directement dans l'onglet Messages, je réponds vraiment, pas un robot qui devine.";

export function repondreAssistant(question: string, config: DossierConfig, dossier: Dossier | null): string {
  const q = question.trim();
  if (!q) return REPLI;
  const sujet = SUJETS.find((s) => s.motif.test(q));
  return sujet ? sujet.reponse(config, dossier) : REPLI;
}

export const SUGGESTIONS_ASSISTANT = [
  'Quelles pièces dois-je fournir ?',
  "Qu'est-ce qu'il manque dans mon dossier ?",
  "C'est quoi la prochaine étape ?",
  'Comment je te joins ?',
];
