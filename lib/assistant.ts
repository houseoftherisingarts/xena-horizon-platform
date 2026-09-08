import type { Dossier, DossierConfig, Language } from '../types';
import { avancement, indexEtape, libellesPiece, libelleCategorie, piecesManquantes, piecesParCategorie, type EtapeDefEn } from './dossier';

/**
 * Le moteur de l'assistant flottant de l'espace client, porté du patron d'assistant à sujets
 * du module client de Vexel : des sujets par expressions régulières, aucune
 * clé d'API, aucune requête réseau. Il répond en français ou en anglais sur ce que la page sait
 * vraiment (le catalogue de pièces, le dossier de la personne connectée, les prix
 * affichés sur le site actuel de Laurie) et refuse d'inventer un prix ou une promesse.
 */

interface SujetAssistant {
  motif: RegExp;
  reponse: (config: DossierConfig, dossier: Dossier | null, lang: Language) => string;
}

const SUJETS: SujetAssistant[] = [
  // Le catalogue : quelles pièces sont demandées.
  {
    motif: /pi[eè]ce|document|papier|fournir|files?\b|upload|provide|send.*(file|document)/i,
    reponse: (config, _dossier, lang) => {
      const parCat = piecesParCategorie(config.pieces)
        .map(({ cat, pieces }) => `${libelleCategorie(cat, config.pieces, lang)} : ${pieces.map((p) => libellesPiece(p, lang).nom).join(', ')}.`)
        .join('\n');
      return lang === 'EN'
        ? `Here is what I need from you, organized by category.\n\n${parCat}\n\nYou can upload everything in the My Documents tab, one at a time or several at once. I see them arrive on my end as soon as they come in.`
        : `Voici ce que je te demande, classé par catégorie.\n\n${parCat}\n\nTu peux tout déposer dans l'onglet Mes pièces, une à la fois ou plusieurs d'un coup. Je les vois arriver de mon côté dès qu'elles entrent.`;
    },
  },
  // Ce qui manque dans LE dossier de la personne connectée.
  {
    motif: /manque|reste|il me manque|mon dossier|complet|missing|left|incomplete|my (file|dossier)/i,
    reponse: (config, dossier, lang) => {
      if (!dossier) return lang === 'EN' ? "Open your file first so I can tell you what's missing." : "Ouvre d'abord ton dossier pour que je puisse te dire ce qu'il te manque.";
      const manquantes = piecesManquantes(dossier, config.pieces);
      const pct = avancement(dossier, config.pieces);
      if (manquantes.length === 0) {
        return lang === 'EN'
          ? `Your file is ${pct}% complete. All required documents are in, I take it from here.`
          : `Ton dossier est complet à ${pct} %. Toutes les pièces obligatoires sont reçues, je prends le relais à partir d'ici.`;
      }
      const noms = manquantes.map((p) => libellesPiece(p, lang).nom).join(', ');
      return lang === 'EN'
        ? `Your file is ${pct}% complete. Still missing: ${noms}. Everything else can wait, these are the only documents holding things up.`
        : `Ton dossier est complet à ${pct} %. Il te manque encore : ${noms}. Le reste peut attendre, ce sont les seules pièces qui bloquent la suite.`;
    },
  },
  // Le parcours et l'étape courante.
  {
    motif: /[ée]tape|parcours|avancement|combien de temps|d[ée]lai|prochaine|steps?\b|journey|progress|how long|timeline|next stage/i,
    reponse: (config, dossier, lang) => {
      const etapes = config.etapes as EtapeDefEn[];
      const texteEtape = (e: EtapeDefEn, i: number) =>
        lang === 'EN' ? `${i + 1}. ${e.titreEn ?? e.titre} : ${e.sousEn ?? e.sous}` : `${i + 1}. ${e.titre} : ${e.sous}`;
      const suite = etapes.map(texteEtape).join(' ');
      if (!dossier) return lang === 'EN' ? `The journey has ${etapes.length} steps. ${suite}` : `Le parcours tient en ${etapes.length} temps. ${suite}`;
      const idx = indexEtape(config.etapes, dossier.etape);
      const courante = etapes[idx];
      const nomEtape = courante ? (lang === 'EN' ? courante.titreEn ?? courante.titre : courante.titre).toLowerCase() : '';
      return lang === 'EN'
        ? `The journey has ${etapes.length} steps. ${suite} You are at step ${idx + 1}, ${nomEtape}.`
        : `Le parcours tient en ${etapes.length} temps. ${suite} Tu es rendue à l'étape ${idx + 1}, ${nomEtape}.`;
    },
  },
  // Comment déposer un fichier, mécanique du geste.
  {
    motif: /comment.*(d[ée]pos|envoi|t[ée]l[ée]vers|glisse)|glisser.?d[ée]poser|how.*(upload|send)|drag.?(and.?)?drop/i,
    reponse: (_config, _dossier, lang) =>
      lang === 'EN'
        ? "It's simple. In the My Documents tab, click Upload next to the file you need, or drag your file straight onto the card. Choose a PDF, a photo, a Word or an Excel file, up to 25 MB per file. A bar shows you the upload, and the file switches to uploaded as soon as it's done."
        : "C'est simple. Dans l'onglet Mes pièces, clique sur Déposer à côté de la pièce concernée, ou glisse ton fichier directement sur la carte. Choisis un PDF, une photo, un Word ou un Excel, jusqu'à 25 Mo par fichier. Une barre te montre l'envoi, et la pièce passe à déposée dès que c'est fini.",
  },
  // Services et prix de départ, tels qu'affichés sur le site actuel de Laurie.
  {
    motif: /prix|tarif|co[uû]t|combien.*(coûte|charge)|service|offre|abonnement|mentorat|forfait|price|cost|rate|fee|package|subscription|mentorship|how much/i,
    reponse: (_config, _dossier, lang) =>
      lang === 'EN'
        ? 'My starting rates: communication strategy from $3,500 plus tax, writing from $1,000 plus tax, and a monthly subscription from $99 per month for a minimum of three months. The exact price always depends on your project, I confirm it with you directly.'
        : "Mes services de départ : stratégie de communication à partir de 3 500 $ plus taxes, rédaction à partir de 1 000 $ plus taxes, et un abonnement mensuel à partir de 99 $ par mois pour un minimum de trois mois. Le prix exact dépend toujours de ton projet, je le confirme avec toi de vive voix.",
  },
  // Comment joindre Laurie.
  {
    motif: /joindre|contact|t[ée]l[ée]phone|appeler|courriel|rendez.?vous|parler [àa] laurie|phone|call|email|reach|get in touch/i,
    reponse: (_config, _dossier, lang) =>
      lang === 'EN'
        ? 'The most direct way is by phone: 514 821-8755. By email, it\'s laurie.belhumeur@gmail.com. You can also write to me directly in the Messages tab, I answer from there.'
        : "Le plus direct reste le téléphone : 514 821-8755. Par courriel, c'est laurie.belhumeur@gmail.com. Tu peux aussi m'écrire directement dans l'onglet Messages, je réponds de là.",
  },
];

/** Réponse de repli, honnête : jamais de prix ni de promesse inventés. */
const REPLI: Record<Language, string> = {
  FR: "Je ne veux pas te lancer un prix ou une promesse au hasard. Sur celle-là, écris-moi directement dans l'onglet Messages, je réponds vraiment, pas un robot qui devine.",
  EN: "I don't want to throw out a price or a promise at random. On that one, write to me directly in the Messages tab, I really answer, not a robot guessing.",
};

export function repondreAssistant(question: string, config: DossierConfig, dossier: Dossier | null, lang: Language): string {
  const q = question.trim();
  if (!q) return REPLI[lang];
  const sujet = SUJETS.find((s) => s.motif.test(q));
  return sujet ? sujet.reponse(config, dossier, lang) : REPLI[lang];
}

export const SUGGESTIONS_ASSISTANT: Record<Language, string[]> = {
  FR: ['Quelles pièces dois-je fournir ?', "Qu'est-ce qu'il manque dans mon dossier ?", "C'est quoi la prochaine étape ?", 'Comment je te joins ?'],
  EN: ['Which files should I send?', "What's missing in my file?", "What's the next step?", 'How do I reach you?'],
};
