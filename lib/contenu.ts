import type { ClientArchetype, HomeBlock, Product } from '../types';

/**
 * La source de vérité de la copie publique de Xena Horizon (Laurie Belhumeur).
 * Chaque mot ici vient de lauriebelhumeur.com, lu intégralement le 7 septembre 2026
 * (10_projects/xena-horizon/site-actuel-lauriebelhumeur-2026-09-07.txt dans le vault d'Alex).
 * Rien n'est inventé : ni chiffre, ni client, ni prix. App.tsx branche BLOCS_ACCUEIL
 * à la place de INITIAL_HOME_BLOCKS ; les pages publiques lisent le reste directement.
 */

// --- ACCUEIL : mêmes id que l'ancien INITIAL_HOME_BLOCKS, pour un remplacement direct ---
export const BLOCS_ACCUEIL: HomeBlock[] = [
  {
    id: 'hero-1',
    type: 'HERO',
    tagline: 'Xena Horizon',
    headline: 'Vivre de son art\nsans perdre sa voix',
    subheadline:
      "Quinze ans à accompagner les artistes de toutes disciplines et les créatifs pour qu'ils soient compris du monde des affaires et vivent enfin de leur art.",
    ctaText: 'Prendre rendez-vous',
    imageUrl: '/images/laurie-portrait-nb.jpg',
  },
  {
    id: 'services-1',
    type: 'SERVICES_PREVIEW',
    title: 'Comment nous pouvons\ntravailler ensemble',
    subtitle: 'Trois profils, une même écoute : artiste, entrepreneur créatif ou organisme.',
  },
  {
    id: 'stats-1',
    type: 'STATS',
    stat1Value: '15 ans',
    stat1Label: "D'expérience",
    stat2Value: 'Toutes disciplines',
    stat2Label: 'Danse, écriture, théâtre, musique, chant, peinture, photo, cirque',
    stat3Value: 'Montréal · Montérégie · Estrie',
    stat3Label: 'Zones desservies',
  },
  {
    id: 'contact-1',
    type: 'CONTACT',
    title: 'Discutons de\nta prochaine étape',
    text: "Écris-moi et je te reviens rapidement. Regardons ensemble si nous sommes faites pour travailler ensemble.",
    email: 'laurie.belhumeur@gmail.com',
  },
];

// --- PROFILS : les trois portes d'entrée du site (cartes accueil + choix de profil /services) ---
// Copie tirée de lauriebelhumeur.com (« Services aux artistes », « Services aux créatifs et aux
// entreprises », coaching en stratégie événementielle). Remplace l'ancienne copie générique de
// l'export AI Studio (« Out of the box », « OBNL & Causes Sociales », « propulser votre art »).
export interface ProfilMeta {
  id: ClientArchetype;
  taglineFR: string;
  taglineEN: string;
  titleFR: string;
  titleEN: string;
  descriptionFR: string;
  descriptionEN: string;
  detailsFR: string;
  detailsEN: string;
}

export const PROFILS_REELS: ProfilMeta[] = [
  {
    id: 'Artist',
    taglineFR: 'Toutes disciplines',
    taglineEN: 'Every discipline',
    titleFR: 'Artistes',
    titleEN: 'Artists',
    descriptionFR:
      "Tu vois la vie comme un artiste ? Voici avec quoi je peux t'aider : danse, écriture, théâtre, musique, chant, peinture, photo, cirque.",
    descriptionEN:
      "Do you see life like an artist? Here's what I can help you with: dance, writing, theatre, music, singing, painting, photography, circus.",
    detailsFR:
      "Je bâtis avec toi ta stratégie de visibilité et ton identité artistique, et je rédige ta bio, ta demande de subvention et ton dossier de presse.",
    detailsEN:
      'I build your visibility strategy and artistic identity with you, and I write your bio, your grant application and your press kit.',
  },
  {
    id: 'Entrepreneur',
    taglineFR: 'Storytelling & stratégie',
    taglineEN: 'Storytelling & strategy',
    titleFR: 'Créatifs et entrepreneurs',
    titleEN: 'Creatives and entrepreneurs',
    descriptionFR:
      "Te faire comprendre du monde des affaires, avec une ligne directrice claire pour ton entreprise.",
    descriptionEN:
      'Getting the business world to understand you, with a clear guideline for your business.',
    detailsFR:
      "Je peaufine ton storytelling et ton copywriting, et je t'accompagne dans tes événements : lancements, réseautage, festivals, activations de marque.",
    detailsEN:
      'I refine your storytelling and copywriting, and I support your events: launches, networking, festivals, brand activations.',
  },
  {
    id: 'NPO',
    taglineFR: 'Stratégie événementielle',
    taglineEN: 'Event strategy',
    titleFR: 'Organisations et entreprises',
    titleEN: 'Organizations and businesses',
    descriptionFR:
      "Stratégie événementielle pour tes lancements, ton réseautage, tes festivals et tes activations de marque.",
    descriptionEN:
      'Event strategy for your launches, networking, festivals and brand activations.',
    detailsFR:
      "Relations publiques, conférences et animation, pour que ton organisation soit vue et entendue.",
    detailsEN:
      'Public relations, conferences and hosting, so your organization is seen and heard.',
  },
];

// --- SERVICES : les neuf offres réelles, prix de départ tels qu'écrits sur le site ---
const ARCHETYPES_TOUS: Product['clientTypes'] = ['Artist', 'Entrepreneur', 'NPO'];

export const SERVICES_REELS: Product[] = [
  {
    id: 'strategie-communication',
    name: 'Stratégie de communication',
    price: 3500,
    description:
      "Améliorer ton marketing, augmenter ta visibilité, tes ventes et le rayonnement de ta carrière ou de ton entreprise. Dès 3 500 $ + taxes.",
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'redaction',
    name: 'Rédaction',
    price: 1000,
    description:
      "Ta biographie, ton scénario, ton identité artistique, une demande de subvention, un dossier de presse, tes textes de vente ou tes publications, écrits avec toi. Dès 1 000 $ + taxes.",
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'tu-sens-perdu',
    name: 'Tu te sens perdu',
    price: 3500,
    description:
      "Ta tête déborde de projets et tu ne sais plus par où commencer. Nous mettons de l'ordre dans tout ça et nous en sortons une ligne directrice claire. Dès 3 500 $ + taxes.",
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'abonnement-mensuel',
    name: 'Abonnement mensuel',
    price: 99,
    description:
      "Trois questions par mois pour les besoins spontanés qui n'ont pas besoin d'une consultation complète. Dès 99 $ par mois, engagement minimum de trois mois.",
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'formation-groupe',
    name: 'Formation de groupe',
    price: 0,
    description:
      "Une journée pour comprendre l'identité artistique et le monde des affaires, et la mettre en pratique tout de suite. Sur demande.",
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'conferences-animation',
    name: 'Conférences et animation',
    price: 0,
    description: "Des conférences et de l'animation d'événements, sur plusieurs sujets. Sur demande.",
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'coaching-evenementiel',
    name: 'Coaching en stratégie événementielle',
    price: 0,
    description:
      "Lancements, réseautage, performances, ateliers et conférences, festivals et tournées, activations de marque, spectacles : nous bâtissons ensemble un événement cohérent avec qui tu es. Sur demande.",
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'visibilite-rp',
    name: 'Stratégie de visibilité et relations publiques',
    price: 0,
    description:
      "Être vue et entendue du bon public : une stratégie de visibilité et de relations publiques adaptée à ton projet et à ton entreprise. Sur demande.",
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'identite-marque',
    name: 'Identité artistique et de marque',
    price: 0,
    description:
      "Ton identité artistique ou celle de ta marque, et la gestion de ta réputation, bâties pour tenir dans le temps. Sur demande.",
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
];

// --- TÉMOIGNAGE ---
export interface Temoignage {
  nom: string;
  role: string;
  texteFR: string;
  texteEN: string;
}

export const TEMOIGNAGES: Temoignage[] = [
  {
    nom: 'Alexis Sénécal',
    role: 'Photographe boudoir',
    texteFR:
      "Laurie a été d'une précieuse aide à un moment important de mon entreprise. J'ai pu, grâce à son efficacité et son côté humain prendre le dessus de mes tâches et surtout, le plus important, créer une ligne directrice claire et précise par rapport au futur de ma compagnie. On dit souvent que le temps c'est de l'argent. C'est pourquoi avoir une personne comme Laurie est une des meilleures choses qui me soit arrivé dans mon entreprise côté gestion. Encore une fois, un gros merci de ton aide, ton écoute, ta douceur ainsi que ta bienveillance.",
    texteEN:
      "Laurie was a huge help at an important time in my business. I was able, thanks to her efficiency and her human side, to take over my tasks and above all, most importantly, to create a clear and precise guideline for the future of my company. It is often said that time is money. That's why having a person like Laurie is one of the best things that has happened to me in my business on the management side. Once again, a big thank you for your help, your listening, your gentleness and your kindness.",
  },
];

// --- ILS LUI ONT FAIT CONFIANCE (noms propres, invariants selon la langue) ---
export const CLIENTS_CONFIANCE: string[] = [
  'Le Salon des Inconnus',
  'Le gars fiable',
  'Ovide Academy',
  'Salon Enchanthé',
  'Centre psychologique pour artistes',
  'Happyman',
  'Alexis Sénécal',
];

// --- PROJETS ---
export interface LienProjet {
  label: string;
  url: string;
}

export interface Projet {
  id: string;
  titre: string;
  sousTitre: string;
  description: string[];
  image: string;
  liens: LienProjet[];
  extra?: string;
}

export const PROJETS: Projet[] = [
  {
    id: 'balado',
    titre: 'En quête de liberté',
    sousTitre: 'Balado',
    description: [
      "« En quête de liberté » est un balado qui traite de sujets tabous, de sujets qui font peur, car ils dérangent ou sont méconnus.",
      "Je ne suis pas une experte de tous ces sujets. Je n'ai que les yeux et les oreilles alertes, et lorsqu'un sujet m'interpelle et me tient à cœur, je ne peux faire autrement que d'en parler, éveiller la réflexion et communiquer ce que j'ai appris.",
      "Les premiers épisodes sont consacrés à la violence conjugale : deux mots qui font peur. J'ai eu envie d'aller à la rencontre de différents intervenants qui ont souvent un rôle à jouer lorsqu'une dynamique de violence existe au sein d'un couple. Ce projet se veut une porte d'entrée pour démystifier la violence conjugale et mieux comprendre la réalité de celles et ceux qui interviennent au quotidien.",
    ],
    image: '/images/balado.jpg',
    liens: [
      { label: 'Balado Québec', url: 'https://baladoquebec.ca/en-quete-de-liberte' },
      { label: 'Spotify', url: 'https://open.spotify.com/show/22laJQLlxVosw5qYq9CBSU' },
    ],
  },
  {
    id: 'livre',
    titre: 'Je ne suis pas un robot',
    sousTitre: 'Créer, Ressentir, Transformer',
    description: [
      "Je ne suis pas un robot est un voyage littéraire au cœur du duel incessant entre raison et émotion. À travers un recueil de nouvelles et des textes introspectifs, j'explore ce combat qui a longtemps façonné mon existence.",
      "Au fil des pages, je dévoile mon processus créatif, un cheminement qui m'a permis d'apprivoiser ces deux forces opposées et de les faire cohabiter en harmonie. De la création au ressenti, puis à la transformation, chaque texte est une étape de cette quête intérieure où l'art devient un langage, une thérapie, une révélation.",
      "Le livre compte 126 pages en format 5 x 9 pouces. Il doit son accompagnement littéraire à Jérémy Parent, sa révision à Charles DuBois, son graphisme à Sonia Lapointe et sa mise en page à Alejandro Nathan. La photo de l'auteure est signée Stéphanie Boisvert, celle de la page couverture Jean-Michel Naud.",
    ],
    image: '/images/livre-couverture.jpg',
    liens: [{ label: 'Acheter le livre', url: 'https://www.laruchequebec.com/lauriebelhumeur' }],
    extra: '21,95 $ + taxes et livraison',
  },
  {
    id: 'modele',
    titre: 'Modèle et comédienne',
    sousTitre: 'Over dramatk',
    description: [
      "Je suis disponible à titre de modèle pour tes différents shootings photo créatifs.",
      "À l'été 2021, j'ai fait la rencontre de l'artiste photographe, directrice artistique et maquilleuse dramatk. Elle m'a partagé la vision de son projet « Over dramatk » qu'elle mûrissait depuis de nombreuses années : une collection de photos inspirée de l'art et de l'esthétique JPOP. J'ai eu l'honneur d'être son modèle tout au long du projet.",
    ],
    image: '/images/modele.jpg',
    liens: [
      { label: 'Instagram @belhu33', url: 'https://www.instagram.com/belhu33/tagged/?hl=fr-ca' },
      { label: 'Instagram @adramatk', url: 'https://www.instagram.com/adramatk/?hl=fr-ca' },
    ],
  },
];

// --- COORDONNÉES ---
export interface Coordonnees {
  telephone: string;
  telephoneHref: string;
  courriel: string;
  zones: string;
}

export const COORDONNEES: Coordonnees = {
  telephone: '514 821-8755',
  telephoneHref: 'tel:+15148218755',
  courriel: 'laurie.belhumeur@gmail.com',
  zones: 'Montréal, Montérégie, Estrie',
};

// --- CRÉDITS ---
export const CREDITS = {
  photographes: ['Stéphanie Boisvert', '@adramatk'],
};

// --- CITATION (accueil) ---
export const CITATION = {
  texteFR:
    "La logique te mènera d'un point A à un point B, l'imagination te mènera absolument partout. Et utiliser les deux pour en faire un délicieux mélange, c'est encore mieux.",
  texteEN:
    'Logic will take you from point A to point B, imagination will take you absolutely everywhere. And using both to make a delicious blend is even better.',
  source: "Citation d'Albert Einstein revisitée par Laurie Belhumeur",
  sourceEN: 'Quote from Albert Einstein revisited by Laurie Belhumeur',
};
