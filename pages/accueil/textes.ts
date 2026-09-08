/**
 * Phrases de l'accueil v2 qui ne vivent pas encore dans lib/contenu.ts (le chantier B y travaille).
 * Tout vient du scrape du site actuel de Laurie ou de la v1 quand la v1 reprenait une formule réelle
 * du site (voir DIRECTION-v2.md, §8). Rien ne s'invente : ni chiffre, ni client, ni promesse.
 */

/** Traductions anglaises des blocs de BLOCS_ACCUEIL (lib/contenu.ts), par id de bloc et par champ. */
export const HOME_EN: Record<string, Record<string, string>> = {
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

/** À propos, section de l'accueil (titre réel du site + deux premiers paragraphes de sa bio + sa mission). */
export const A_PROPOS_ACCUEIL = {
  titre: { FR: "Brève histoire\nd'un tout", EN: 'Brief story\nof a whole' },
  paragraphes: {
    FR: [
      "J'ai toujours été habitée par un désir profond d'accompagner les artistes de toutes disciplines confondues (danse, écriture, théâtre, musique, chant, peinture, photo, cirque, etc.) ainsi que les créatifs à comprendre et être compris par le monde des affaires.",
      'Je vise à apporter du changement dans le milieu artistique et culturel afin que les artistes puissent vivre de leur art.',
    ],
    EN: [
      'I have always been driven by a deep desire to support artists from all disciplines (dance, writing, theatre, music, singing, painting, photography, circus, and more) as well as creative people, to understand and be understood by the business world.',
      'I aim to bring change to the artistic and cultural world so that artists can make a living from their art.',
    ],
  },
  mission: {
    FR: 'Faire ressortir la créativité partout où elle existe est ma mission.',
    EN: 'Bringing out creativity wherever it exists is my mission.',
  },
};

/** La strophe qui prend la place du titre au sommet de l'allumage : dérivée de services-1.subtitle. */
export const STROPHE_ALLUMAGE = {
  FR: 'Trois profils, une même écoute.',
  EN: 'Three profiles, one listening ear.',
};

/** Le kicker au-dessus de la bande de clients qui défile. */
export const CLIENTS_TITRE = { FR: 'Ils lui ont fait confiance', EN: 'They trusted her' };

/** Légende fonctionnelle sous la photo de contact (Laurie sur scène, au micro). */
export const LEGENDE_SCENE = { FR: 'Sur scène', EN: 'On stage' };

/** Texte alternatif des deux photos éditoriales de l'accueil, pour les lecteurs d'écran. */
export const ALT_PHOTO_CONTACT = {
  FR: 'Laurie Belhumeur, sur scène au micro',
  EN: 'Laurie Belhumeur, on stage at the microphone',
};
export const ALT_PHOTO_APROPOS = {
  FR: 'Laurie Belhumeur, assise, en studio',
  EN: 'Laurie Belhumeur, seated, in her studio',
};
