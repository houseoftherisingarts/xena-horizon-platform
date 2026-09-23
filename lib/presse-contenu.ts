// La salle de presse de Laurie : son contenu, et d'où il vient.
//
// Tout ce qui apparaît sur une carte de presse se modifie depuis Admin › Salle de presse, sans
// déploiement. Le kit publié vit dans Firestore, le kit de ce fichier sert de repli tant que rien
// n'a été publié et de point de retour quand Laurie veut revenir au texte d'origine.
//
//   settings/presse       le kit publié, lecture publique (règle générique settings/{key})
//   brouillons/presse     son brouillon, admin seulement, jusqu'à « Publier les changements »
//
// Le kit voyage dans un seul champ texte `json`. Firestore refuse les tableaux imbriqués, et un
// champ unique évite d'aplatir la structure en vingt sous-documents pour la rassembler ensuite.
//
// Rien ici ne s'invente : chaque phrase sort de lib/contenu.ts, donc du site que Laurie a écrit.
import { useMemo } from 'react';
import { useDocument } from './firestore';
import { A_PROPOS, COORDONNEES, CREDITS, PROJETS, SIGNATURE } from './contenu';
import type { Language } from '../types';

/** Un texte des deux côtés de la frontière : le site est bilingue, le kit de presse aussi. */
export interface Bilingue {
  FR: string;
  EN: string;
}

/** Le cadrage d'une photo dans son panneau : point focal en pourcentage, puis zoom. */
export interface Cadrage {
  focalX?: number;
  focalY?: number;
  zoom?: number;
}

export interface CartePresse extends Cadrage {
  key: string;
  n: string;
  photo: string;
  /** Le côté du panneau photo. Le texte prend l'autre moitié. */
  cote: 'gauche' | 'droite';
  /** Largeur du panneau photo en pourcentage de la carte (46 par défaut). */
  largeur?: number;
  kicker: Bilingue;
  titre: Bilingue;
  corps: Bilingue;
  meta: Bilingue;
}

/** Une photo livrée telle quelle aux médias, dans sa taille d'origine, avec son crédit. */
export interface PlanchePresse {
  key: string;
  n: string;
  photo: string;
  legende: Bilingue;
  credit: string;
}

export interface TextePresse {
  key: string;
  titre: Bilingue;
  texte: Bilingue;
}

export interface KitPresse {
  site: string;
  contact: { courriel: string; telephone: string; zones: string };
  cartes: CartePresse[];
  planches: PlanchePresse[];
  textes: TextePresse[];
}

export const CHEMIN_PRESSE = 'settings/presse';
export const CHEMIN_BROUILLON_PRESSE = 'brouillons/presse';

/** Le code QR de la salle de presse, fabriqué au build par scripts/presse/build-kit.mjs. */
export const QR_PRESSE = '/presse/qr-presse.png';

/** Le mot-symbole posé au bas de chaque carte. */
export const LOGO_PRESSE = '/images/logo-laurie.png';

export const cadrageDe = (c: Cadrage): { x: number; y: number; z: number } => ({
  x: c.focalX ?? 50,
  y: c.focalY ?? 50,
  z: c.zoom ?? 1,
});

/** Une adresse Storage se sert telle quelle, un fichier du site se ramène à la racine. */
export const urlPhoto = (photo: string): string =>
  photo.startsWith('http') || photo.startsWith('/') ? photo : `/${photo}`;

/** Le mot de la langue en cours, avec le français en filet quand la traduction manque. */
export const dit = (b: Bilingue | undefined, lang: Language): string => (b ? b[lang] || b.FR : '');

const livre = PROJETS.find((p) => p.id === 'livre');
const balado = PROJETS.find((p) => p.id === 'balado');

/**
 * Le kit d'origine. Les cartes reprennent ses mots à elle : la tagline et la mission viennent
 * d'A_PROPOS, la phrase-signature de SIGNATURE, le balado et le livre de PROJETS, les coordonnées
 * de COORDONNEES. Les photos sont celles du site, aux crédits de Stéphanie Boisvert et d'@adramatk.
 */
export const KIT_DEFAUT: KitPresse = {
  site: 'xenahorizon.com',
  contact: { courriel: COORDONNEES.courriel, telephone: COORDONNEES.telephone, zones: COORDONNEES.zones },
  cartes: [
    {
      key: 'portrait',
      n: '01',
      photo: '/images/laurie-portrait-1-1920.jpg',
      cote: 'droite',
      focalY: 40,
      kicker: { FR: 'Salle de presse · Xena Horizon', EN: 'Press room · Xena Horizon' },
      titre: { FR: 'Laurie Belhumeur', EN: 'Laurie Belhumeur' },
      corps: { FR: A_PROPOS.tagline, EN: A_PROPOS.taglineEn },
      meta: { FR: COORDONNEES.zones, EN: COORDONNEES.zones },
    },
    {
      key: 'mission',
      n: '02',
      photo: '/images/laurie-apropos-1920.jpg',
      cote: 'gauche',
      focalY: 35,
      kicker: { FR: 'Sa mission', EN: 'Her mission' },
      titre: { FR: A_PROPOS.mission, EN: A_PROPOS.missionEn },
      corps: { FR: A_PROPOS.paragraphes[0], EN: A_PROPOS.paragraphesEn[0] },
      meta: { FR: 'Quinze ans auprès des artistes', EN: 'Fifteen years alongside artists' },
    },
    {
      key: 'balado',
      n: '03',
      photo: '/images/balado-1920.jpg',
      cote: 'droite',
      focalY: 45,
      kicker: { FR: 'Balado', EN: 'Podcast' },
      titre: { FR: balado!.titre, EN: balado!.titre },
      corps: { FR: balado!.description[0], EN: balado!.descriptionEn[0] },
      meta: { FR: 'baladoquebec.ca · Spotify', EN: 'baladoquebec.ca · Spotify' },
    },
    {
      key: 'livre',
      n: '04',
      photo: '/images/livre-volume.jpg',
      cote: 'gauche',
      focalY: 45,
      kicker: { FR: 'Recueil de nouvelles', EN: 'Short story collection' },
      titre: { FR: livre!.titre, EN: livre!.titre },
      corps: { FR: livre!.description[0], EN: livre!.descriptionEn[0] },
      meta: { FR: '126 pages · 5 × 9 pouces · 21,95 $', EN: '126 pages · 5 × 9 inches · $21.95' },
    },
    {
      key: 'contact',
      n: '05',
      photo: '/images/laurie-portrait-2-1920.jpg',
      cote: 'droite',
      focalY: 38,
      kicker: { FR: 'Pour les médias', EN: 'For the media' },
      titre: { FR: SIGNATURE.texteFR, EN: SIGNATURE.texteEN },
      corps: {
        FR: "Entrevues, animation, conférences et tables rondes : les demandes passent par sa boîte, et elle répond elle-même.",
        EN: 'Interviews, hosting, talks and panels: requests reach her own inbox, and she answers them herself.',
      },
      meta: { FR: `${COORDONNEES.courriel} · ${COORDONNEES.telephone}`, EN: `${COORDONNEES.courriel} · ${COORDONNEES.telephone}` },
    },
  ],
  planches: [
    {
      key: 'portrait-1',
      n: '01',
      photo: '/images/laurie-portrait-1-1920.jpg',
      legende: { FR: 'Portrait officiel, en couleur.', EN: 'Official portrait, in colour.' },
      credit: CREDITS.photographes[0],
    },
    {
      key: 'portrait-2',
      n: '02',
      photo: '/images/laurie-portrait-2-1920.jpg',
      legende: { FR: 'Portrait officiel, seconde pose.', EN: 'Official portrait, second pose.' },
      credit: CREDITS.photographes[0],
    },
    {
      key: 'portrait-nb',
      n: '03',
      photo: '/images/laurie-portrait-nb-1920.jpg',
      legende: { FR: 'Portrait en noir et blanc, pour une une ou une pleine page.', EN: 'Black and white portrait, for a cover or a full page.' },
      credit: CREDITS.photographes[0],
    },
    {
      key: 'scene',
      n: '04',
      photo: '/images/laurie-scene-1920.jpg',
      legende: { FR: "Laurie en animation d'événement.", EN: 'Laurie hosting an event.' },
      credit: CREDITS.photographes[0],
    },
    {
      key: 'apropos',
      n: '05',
      photo: '/images/laurie-apropos-1920.jpg',
      legende: { FR: 'Portrait de travail, en atelier.', EN: 'Working portrait, in the studio.' },
      credit: CREDITS.photographes[0],
    },
    {
      key: 'balado',
      n: '06',
      photo: '/images/balado-1920.jpg',
      legende: { FR: 'Visuel du balado En quête de liberté.', EN: 'Artwork for the podcast En quête de liberté.' },
      credit: 'Xena Horizon',
    },
    {
      key: 'livre',
      n: '07',
      photo: '/images/livre-couverture.jpg',
      legende: { FR: 'Couverture du recueil Je ne suis pas un robot.', EN: 'Cover of the collection Je ne suis pas un robot.' },
      credit: 'Jean-Michel Naud · graphisme Sonia Lapointe',
    },
    {
      key: 'modele',
      n: '08',
      photo: '/images/modele-1920.jpg',
      legende: { FR: 'Séance Over dramatk, où Laurie est modèle.', EN: 'Over dramatk session, with Laurie as the model.' },
      credit: CREDITS.photographes[1],
    },
  ],
  textes: [
    {
      key: 'bio-courte',
      titre: { FR: 'Biographie courte', EN: 'Short biography' },
      texte: {
        FR: `Laurie Belhumeur est consultante en carrière artistique et en communication. Depuis quinze ans, elle accompagne les artistes de toutes disciplines et les entreprises qui veulent se faire comprendre, et elle anime événements, conférences et tables rondes. Elle est la créatrice du balado En quête de liberté et l'autrice du recueil Je ne suis pas un robot. ${A_PROPOS.mission}`,
        EN: `Laurie Belhumeur is an artistic career and communication consultant. For fifteen years she has worked alongside artists of every discipline and businesses that want to be understood, and she hosts events, talks and panels. She created the podcast En quête de liberté and wrote the short story collection Je ne suis pas un robot. ${A_PROPOS.missionEn}`,
      },
    },
    {
      key: 'bio-longue',
      titre: { FR: 'Biographie longue', EN: 'Long biography' },
      texte: {
        FR: `${A_PROPOS.paragraphes.join('\n\n')}\n\n${A_PROPOS.casquettesFR.join('\n')}`,
        EN: `${A_PROPOS.paragraphesEn.join('\n\n')}\n\n${A_PROPOS.casquettesEN.join('\n')}`,
      },
    },
    {
      key: 'faits',
      titre: { FR: 'Repères et crédits', EN: 'Facts and credits' },
      texte: {
        FR: [
          `Site : xenahorizon.com`,
          `Courriel : ${COORDONNEES.courriel}`,
          `Téléphone : ${COORDONNEES.telephone}`,
          `Territoire : ${COORDONNEES.zones}`,
          ``,
          `Balado : ${balado!.titre}, sur Balado Québec et Spotify.`,
          `Livre : ${livre!.titre}, ${livre!.sousTitre}. ${livre!.extra}.`,
          `Accompagnement littéraire Jérémy Parent, révision Charles DuBois, graphisme Sonia Lapointe, mise en page Alejandro Nathan.`,
          ``,
          `Photographies : ${CREDITS.photographes.join(', ')}. Photo de la couverture du livre : Jean-Michel Naud.`,
        ].join('\n'),
        EN: [
          `Website: xenahorizon.com`,
          `Email: ${COORDONNEES.courriel}`,
          `Phone: ${COORDONNEES.telephone}`,
          `Territory: ${COORDONNEES.zones}`,
          ``,
          `Podcast: ${balado!.titre}, on Balado Québec and Spotify.`,
          `Book: ${livre!.titre}, ${livre!.sousTitreEn}. ${livre!.extraEn}.`,
          `Literary guidance Jérémy Parent, revision Charles DuBois, graphic design Sonia Lapointe, layout Alejandro Nathan.`,
          ``,
          `Photography: ${CREDITS.photographes.join(', ')}. Book cover photo: Jean-Michel Naud.`,
        ].join('\n'),
      },
    },
  ],
};

/** Le kit publié. `pret` passe à vrai dès que Firestore a répondu, document vide compris. */
export function usePresse(): { kit: KitPresse; pret: boolean } {
  const { data, loading } = useDocument<{ json?: string }>(CHEMIN_PRESSE);
  const kit = useMemo(() => lire(data?.json), [data?.json]);
  return { kit, pret: !loading };
}

/** Relit le kit publié; un document absent, vide ou abîmé rend le kit d'origine. */
export function lire(json: string | undefined): KitPresse {
  if (!json) return KIT_DEFAUT;
  try {
    const k = JSON.parse(json) as KitPresse;
    return k && Array.isArray(k.cartes) ? k : KIT_DEFAUT;
  } catch {
    return KIT_DEFAUT;
  }
}
