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

/** Product + son pendant anglais, pour le panneau « Prix de départ » et les cartes d'offres. */
export interface ServiceReel extends Product {
  nameEn: string;
  descriptionEn: string;
}

export const SERVICES_REELS: ServiceReel[] = [
  {
    id: 'strategie-communication',
    name: 'Stratégie de communication',
    nameEn: 'Communication strategy',
    price: 3500,
    description:
      "Améliorer ton marketing, augmenter ta visibilité, tes ventes et le rayonnement de ta carrière ou de ton entreprise. Dès 3 500 $ + taxes.",
    descriptionEn:
      'Improve your marketing, increase your visibility, your sales and the reach of your career or your business. From $3,500 + taxes.',
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'redaction',
    name: 'Rédaction',
    nameEn: 'Writing',
    price: 1000,
    description:
      "Ta biographie, ton scénario, ton identité artistique, une demande de subvention, un dossier de presse, tes textes de vente ou tes publications, écrits avec toi. Dès 1 000 $ + taxes.",
    descriptionEn:
      'Your biography, your script, your artistic identity, a grant application, a press kit, your sales texts or your publications, written with you. From $1,000 + taxes.',
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'tu-sens-perdu',
    name: 'Tu te sens perdu',
    nameEn: 'You feel lost',
    price: 3500,
    description:
      "Ta tête déborde de projets et tu ne sais plus par où commencer. Nous mettons de l'ordre dans tout ça et nous en sortons une ligne directrice claire. Dès 3 500 $ + taxes.",
    descriptionEn:
      "Your head is overflowing with projects and you no longer know where to start. We bring order to it all and come out with a clear guideline. From $3,500 + taxes.",
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'abonnement-mensuel',
    name: 'Abonnement mensuel',
    nameEn: 'Monthly subscription',
    price: 99,
    description:
      "Trois questions par mois pour les besoins spontanés qui n'ont pas besoin d'une consultation complète. Dès 99 $ par mois, engagement minimum de trois mois.",
    descriptionEn:
      "Three questions a month for the spontaneous needs that don't require a full consultation. From $99 a month, three-month minimum commitment.",
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'formation-groupe',
    name: 'Formation de groupe',
    nameEn: 'Group training',
    price: 0,
    description:
      "Une journée pour comprendre l'identité artistique et le monde des affaires, et la mettre en pratique tout de suite. Sur demande.",
    descriptionEn: 'A day to understand artistic identity and the business world, and to put it into practice right away. On request.',
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'conferences-animation',
    name: 'Conférences et animation',
    nameEn: 'Conferences and activities',
    price: 0,
    description: "Des conférences et de l'animation d'événements, sur plusieurs sujets. Sur demande.",
    descriptionEn: 'Conferences and event hosting, on a range of topics. On request.',
    type: 'Service',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'coaching-evenementiel',
    name: 'Coaching en stratégie événementielle',
    nameEn: 'Event strategy coaching',
    price: 0,
    description:
      "Lancements, réseautage, performances, ateliers et conférences, festivals et tournées, activations de marque, spectacles : nous bâtissons ensemble un événement cohérent avec qui tu es. Sur demande.",
    descriptionEn:
      'Launches, networking, performances, workshops and conferences, festivals and tours, brand activations, shows: we build an event together that is coherent with who you are. On request.',
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'visibilite-rp',
    name: 'Stratégie de visibilité et relations publiques',
    nameEn: 'Visibility strategy and public relations',
    price: 0,
    description:
      "Être vue et entendue du bon public : une stratégie de visibilité et de relations publiques adaptée à ton projet et à ton entreprise. Sur demande.",
    descriptionEn:
      'Being seen and heard by the right audience: a visibility and public relations strategy tailored to your project and your business. On request.',
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ARCHETYPES_TOUS,
  },
  {
    id: 'identite-marque',
    name: 'Identité artistique et de marque',
    nameEn: 'Artistic and brand identity',
    price: 0,
    description:
      "Ton identité artistique ou celle de ta marque, et la gestion de ta réputation, bâties pour tenir dans le temps. Sur demande.",
    descriptionEn: 'Your artistic identity or your brand identity, and your reputation management, built to last. On request.',
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
  labelEn?: string;
  url: string;
}

export interface Projet {
  id: string;
  titre: string;
  titreEn: string;
  sousTitre: string;
  sousTitreEn: string;
  description: string[];
  descriptionEn: string[];
  image: string;
  liens: LienProjet[];
  extra?: string;
  extraEn?: string;
}

export const PROJETS: Projet[] = [
  {
    id: 'balado',
    titre: 'En quête de liberté',
    titreEn: 'En quête de liberté (In Search of Freedom)',
    sousTitre: 'Balado',
    sousTitreEn: 'Podcast',
    description: [
      "« En quête de liberté » est un balado qui traite de sujets tabous, de sujets qui font peur, car ils dérangent ou sont méconnus.",
      "Je ne suis pas une experte de tous ces sujets. Je n'ai que les yeux et les oreilles alertes, et lorsqu'un sujet m'interpelle et me tient à cœur, je ne peux faire autrement que d'en parler, éveiller la réflexion et communiquer ce que j'ai appris.",
      "Les premiers épisodes sont consacrés à la violence conjugale : deux mots qui font peur. J'ai eu envie d'aller à la rencontre de différents intervenants qui ont souvent un rôle à jouer lorsqu'une dynamique de violence existe au sein d'un couple. Ce projet se veut une porte d'entrée pour démystifier la violence conjugale et mieux comprendre la réalité de celles et ceux qui interviennent au quotidien.",
    ],
    descriptionEn: [
      '"En quête de liberté" is a podcast that tackles taboo subjects, subjects that scare people because they are unsettling or little understood.',
      "I'm not an expert on all these subjects. I only have alert eyes and ears, and when a subject speaks to me and matters to me, I can't help but talk about it, spark reflection and share what I've learned.",
      'The first episodes are devoted to domestic violence: two words that scare people. I wanted to meet the different people who often play a role when a pattern of violence exists within a couple. This project is meant as an entry point to demystify domestic violence and better understand the reality of those who work with it every day.',
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
    titreEn: 'Je ne suis pas un robot (I Am Not a Robot)',
    sousTitre: 'Créer, Ressentir, Transformer',
    sousTitreEn: 'Create, Feel, Transform',
    description: [
      "Je ne suis pas un robot est un voyage littéraire au cœur du duel incessant entre raison et émotion. À travers un recueil de nouvelles et des textes introspectifs, j'explore ce combat qui a longtemps façonné mon existence.",
      "Au fil des pages, je dévoile mon processus créatif, un cheminement qui m'a permis d'apprivoiser ces deux forces opposées et de les faire cohabiter en harmonie. De la création au ressenti, puis à la transformation, chaque texte est une étape de cette quête intérieure où l'art devient un langage, une thérapie, une révélation.",
      "Le livre compte 126 pages en format 5 x 9 pouces. Il doit son accompagnement littéraire à Jérémy Parent, sa révision à Charles DuBois, son graphisme à Sonia Lapointe et sa mise en page à Alejandro Nathan. La photo de l'auteure est signée Stéphanie Boisvert, celle de la page couverture Jean-Michel Naud.",
    ],
    descriptionEn: [
      'Je ne suis pas un robot is a literary journey at the heart of the endless duel between reason and emotion. Through a collection of short stories and introspective texts, I explore a struggle that has long shaped my existence.',
      'Page after page, I reveal my creative process, a path that let me tame these two opposing forces and let them coexist in harmony. From creation to feeling, then to transformation, each text is a step in this inner quest where art becomes a language, a therapy, a revelation.',
      "The book runs 126 pages in a 5 x 9 inch format. Its literary guidance came from Jérémy Parent, its revision from Charles DuBois, its graphic design from Sonia Lapointe and its layout from Alejandro Nathan. The author's photo is by Stéphanie Boisvert, the cover photo by Jean-Michel Naud.",
    ],
    image: '/images/livre-couverture.jpg',
    liens: [{ label: 'Acheter le livre', labelEn: 'Buy the book', url: 'https://www.laruchequebec.com/lauriebelhumeur' }],
    extra: '21,95 $ + taxes et livraison',
    extraEn: '$21.95 + taxes and shipping',
  },
  {
    id: 'modele',
    titre: 'Modèle et comédienne',
    titreEn: 'Model and actress',
    sousTitre: 'Over dramatk',
    sousTitreEn: 'Over dramatk',
    description: [
      "Je suis disponible à titre de modèle pour tes différents shootings photo créatifs.",
      "À l'été 2021, j'ai fait la rencontre de l'artiste photographe, directrice artistique et maquilleuse dramatk. Elle m'a partagé la vision de son projet « Over dramatk » qu'elle mûrissait depuis de nombreuses années : une collection de photos inspirée de l'art et de l'esthétique JPOP. J'ai eu l'honneur d'être son modèle tout au long du projet.",
    ],
    descriptionEn: [
      "I'm available as a model for your creative photo shoots.",
      'In the summer of 2021, I met photographer, art director and makeup artist dramatk. She shared with me the vision of her project "Over dramatk", which she had been developing for many years: a photo collection inspired by JPOP art and aesthetics. I had the honour of being her model throughout the project.',
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

// --- À PROPOS (page /a-propos, DIRECTION-v2 §6.4 et §8) ---
// Les deux paragraphes viennent mot pour mot de la page d'accueil de son site (lignes 110 et 114
// du scrape) et de sa version anglaise (lignes 601 et 603). La mission et la marque (tagline) sont
// aussi verbatim. Les neuf casquettes viennent de sa page About, qui n'existe qu'en anglais sur son
// site (le scrape ne la livre pas en français) : casquettesFR est une TRADUCTION, à valider par
// Laurie avant la mise en ligne, jamais une invention.
export interface AProposContenu {
  titre: string;
  titreEn: string;
  paragraphes: string[];
  paragraphesEn: string[];
  mission: string;
  missionEn: string;
  tagline: string;
  taglineEn: string;
  casquettesFR: string[];
  casquettesEN: string[];
}

export const A_PROPOS: AProposContenu = {
  titre: "Brève histoire d'un tout",
  titreEn: 'Brief story of a whole',
  paragraphes: [
    "J'ai toujours été habitée par un désir profond d'accompagner les artistes de toutes disciplines confondues (danse, écriture, théâtre, musique, chant, peinture, photo, cirque, etc.) ainsi que les créatifs à comprendre et être compris par les businessman et les businesswoman de ce monde. Je vise à apporter du changement dans le milieu artistique et culturel afin que les artistes puissent vivre de leur art.",
    "Mon approche se veut personnalisée et adaptée à chaque artiste que j'accompagne, tout en étant fondée sur mon expérience, mes analyses et mes compétences acquises au cours des quinze dernières années. Mon approche est une combinaison fondée sur les besoins communs que rencontrent les artistes ainsi que les besoins et objectifs précis de chaque artiste.",
  ],
  paragraphesEn: [
    'I have always been driven by a deep desire to support artists from all disciplines (dance, writing, theater, music, singing, painting, photography, circus, etc.) as well as creative people to understand and be understood by the businessmen and businesswomen of this world. I aim to bring change to the artistic and cultural environment so that artists can make a living from their art.',
    'My approach is personalized and tailored to each artist I work with, drawing on my experience, insights, and skills acquired over the past fifteen years. My approach is a combination of the common needs artists face and the specific needs and goals of each artist.',
  ],
  mission: 'Faire ressortir la créativité partout où elle existe est ma mission.',
  missionEn: 'Bringing out creativity wherever it exists is my mission.',
  tagline: 'Consultante en carrière artistique et en communication.',
  taglineEn: 'Artistic career and communication consultant.',
  casquettesFR: [
    'Consultante en carrière artistique, artiste des mots et de la parole',
    "Fondatrice et présidente de l'entreprise Laurie Belhumeur",
    'Créatrice du balado En quête de liberté',
    "Animatrice d'événements",
    'Autrice de nouvelles',
    'Photographe',
    'Modèle pour des séances photo',
    'Créatrice de contenu',
    'Voyageuse, avide de découvrir de nouvelles cultures',
  ],
  casquettesEN: [
    'Artistic career consultant, artist of words and speech',
    'Founder and president of the company Laurie Belhumeur',
    'Podcast creator of En quête de liberté',
    'Event host',
    'Writer of short stories',
    'Photographer',
    'Model for photo shoots',
    'Content creator',
    'Traveler, eager to discover new cultures',
  ],
};

// --- SERVICES : titre et intro de la page /services (DIRECTION-v2 §6.2 et §8) ---
// Le titre reprend mot pour mot l'ouverture de PROFILS_REELS[0].descriptionFR : sa vraie phrase
// d'accroche, pas un slogan inventé.
export const SERVICES_PAGE = {
  titreFR: "Voici avec quoi\nje peux t'aider",
  // Raccourci pour tenir sur deux lignes aux deux largeurs (règle des titres, DIRECTION-v2 §4 et §9.4) :
  // la version longue « Here's what I can help you with » déborde sur trois lignes à 1440.
  titreEN: 'What I can\nhelp you with',
};

// --- SIGNATURE : sa phrase-signature, verbatim (ligne 73 du scrape en français, ligne 564 en anglais) ---
export const SIGNATURE = {
  texteFR: "Avec moi, l'information est ressentie !",
  texteEN: 'With me, feel the information!',
};

// --- Le kicker au-dessus de la bande « Ils lui ont fait confiance » (accueil) ---
export const CLIENTS_TITRE = { FR: 'Ils lui ont fait confiance', EN: 'They trusted her' };

// --- PROJETS : titre et lede de la page /projets, sortis de PublicProjets.tsx (DIRECTION-v2 §8) ---
export const PROJETS_PAGE = {
  titre: 'Les projets\nde Laurie',
  titreEn: "Laurie's\nprojects",
  lede: 'Un balado, un livre et un projet de modèle. Les mêmes questions qui habitent son accompagnement, vécues à sa manière.',
  ledeEn: 'A podcast, a book and a modeling project: the same questions that shape her work, lived her own way.',
};

// --- Jumeaux anglais de BLOCS_ACCUEIL, par id de bloc et par champ (DIRECTION-v2 §8) ---
// Même contenu que le dictionnaire local HOME_EN de PublicHome.tsx : la traduction est déjà
// validée, elle vit ici pour que les autres chantiers la lisent depuis la source de vérité.
export const BLOCS_ACCUEIL_EN: Record<string, Record<string, string>> = {
  'hero-1': {
    headline: 'Live from your art\nand keep your voice',
    subheadline:
      'Fifteen years supporting artists of every discipline and creative people, so the business world understands them and they can finally live from their art.',
    ctaText: 'Book an appointment',
  },
  'services-1': {
    title: 'How we can\nwork together',
    subtitle: 'Three profiles, the same listening ear: artist, creative entrepreneur or organization.',
  },
  'stats-1': {
    stat1Value: '15 years',
    stat1Label: 'Of experience',
    stat2Value: 'Every discipline',
    stat2Label: 'Dance, writing, theatre, music, singing, painting, photography, circus',
    stat3Label: 'Areas served',
  },
  'contact-1': {
    title: "Let's talk about\nyour next step",
    text: "Write to me and I'll get back to you quickly. Let's see together if we're a good fit to work together.",
  },
};
