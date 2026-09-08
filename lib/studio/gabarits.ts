// Les six gabarits : chacun une liste de calques réels (pas une image figée), dans la charte
// Xena Horizon, avec ses vraies photos et son logo. Le même moteur (components/admin/studio/Calque)
// les rend en vignette et en toile éditable.
import type { Gabarit } from './types';

const LOGO = '/images/logo-laurie.png';
const PORTRAIT_NB = '/images/laurie-portrait-nb.jpg';
const PORTRAIT_1 = '/images/laurie-portrait-1.jpg';
const PORTRAIT_2 = '/images/laurie-portrait-2.jpg';

// Le vrai témoignage de la page /a-propos (lib/contenu.ts), tronqué à une phrase qui tient dans un
// calque social sans en trahir le sens.
const EXTRAIT_TEMOIGNAGE =
  "Laurie a été d'une précieuse aide à un moment important de mon entreprise, avec son efficacité et son côté humain.";

export const GABARIT_CITATION: Gabarit = {
  id: 'citation',
  nom: 'Citation',
  nomEn: 'Quote',
  format: 'carre',
  fond: { src: PORTRAIT_NB, nb: true, luminositePct: 55 },
  calques: [
    {
      id: 'g-citation-guillemet', type: 'forme', z: 1, xPct: 12, yPct: 16, wPct: 10, hPct: 10,
      forme: 'cercle', couleur: '#38B6FF', opacitePct: 22, filet: false,
    },
    {
      id: 'g-citation-texte', type: 'texte', z: 2, xPct: 50, yPct: 46, wPct: 78, hPct: 40,
      texte: '« La clarté, avant la vitesse. »', police: 'serif', taillePct: 7.5, graisse: 500,
      couleur: '#FFFFFF', ombre: true, align: 'center',
    },
    {
      id: 'g-citation-signature', type: 'texte', z: 2, xPct: 50, yPct: 78, wPct: 60, hPct: 8,
      texte: 'Laurie Belhumeur, Xena Horizon', police: 'sans', taillePct: 3, graisse: 600,
      couleur: '#38B6FF', ombre: false, align: 'center',
    },
    {
      id: 'g-citation-logo', type: 'image', z: 2, xPct: 50, yPct: 90, wPct: 14, hPct: 8,
      src: LOGO, nb: false,
    },
  ],
};

export const GABARIT_RENDEZVOUS: Gabarit = {
  id: 'rendezvous',
  nom: 'Annonce de rendez-vous',
  nomEn: 'Appointment announcement',
  format: 'feed',
  fond: { src: PORTRAIT_1, nb: false, luminositePct: 60 },
  calques: [
    {
      id: 'g-rdv-bande', type: 'forme', z: 1, xPct: 50, yPct: 84, wPct: 100, hPct: 32,
      forme: 'rectangle', couleur: '#181818', opacitePct: 78, filet: false,
    },
    {
      id: 'g-rdv-kicker', type: 'texte', z: 2, xPct: 50, yPct: 12, wPct: 70, hPct: 8,
      texte: 'PLACES DISPONIBLES', police: 'sans', taillePct: 2.6, graisse: 700,
      couleur: '#38B6FF', ombre: false, align: 'center',
    },
    {
      id: 'g-rdv-titre', type: 'texte', z: 2, xPct: 50, yPct: 76, wPct: 80, hPct: 14,
      texte: 'Prenez rendez-vous', police: 'serif', taillePct: 6.5, graisse: 500,
      couleur: '#FFFFFF', ombre: false, align: 'center',
    },
    {
      id: 'g-rdv-sous', type: 'texte', z: 2, xPct: 50, yPct: 90, wPct: 80, hPct: 8,
      texte: 'Premier échange gratuit, xenahorizon.com', police: 'sans', taillePct: 2.4, graisse: 400,
      couleur: '#F7F4EE', ombre: false, align: 'center',
    },
  ],
};

const gabaritBaladoDefaut = (titre: string, image: string): Gabarit['calques'] => [
  {
    id: 'g-balado-couverture', type: 'image', z: 1, xPct: 50, yPct: 34, wPct: 62, hPct: 44,
    src: image, nb: false,
  },
  {
    id: 'g-balado-kicker', type: 'texte', z: 2, xPct: 50, yPct: 66, wPct: 70, hPct: 6,
    texte: 'NOUVEL ÉPISODE', police: 'sans', taillePct: 2.6, graisse: 700,
    couleur: '#38B6FF', ombre: false, align: 'center',
  },
  {
    id: 'g-balado-titre', type: 'texte', z: 2, xPct: 50, yPct: 78, wPct: 82, hPct: 18,
    texte: titre, police: 'serif', taillePct: 5, graisse: 500,
    couleur: '#181818', ombre: false, align: 'center',
  },
  {
    id: 'g-balado-podcast', type: 'texte', z: 2, xPct: 50, yPct: 92, wPct: 60, hPct: 5,
    texte: 'En quête de liberté', police: 'sans', taillePct: 2.2, graisse: 600,
    couleur: '#5E5850', ombre: false, align: 'center',
  },
];

/** La couverture réelle du balado sert de fond (public/images/balado.jpg), le titre du dernier
 * épisode se lit au chargement du studio (voir SocialCreator.tsx) : ce gabarit part avec un titre
 * générique en attendant, remplacé dès que /balado.json répond. */
// Le fond n'est jamais la couverture elle-même (elle porte déjà son propre titre imprimé) :
// un fond dupliqué en plein cadre entrait en collision avec le titre du calque et le rendait
// illisible. Un portrait de Laurie, sombre, sert d'écrin neutre à la vraie couverture au centre.
export const GABARIT_BALADO: Gabarit = {
  id: 'balado',
  nom: 'Nouvel épisode de balado',
  nomEn: 'New podcast episode',
  format: 'carre',
  fond: { src: PORTRAIT_NB, nb: true, luminositePct: 42 },
  calques: gabaritBaladoDefaut('Le dernier épisode', '/images/balado.jpg'),
};

export const gabaritBaladoAvecEpisode = (titre: string): Gabarit => ({
  ...GABARIT_BALADO,
  calques: gabaritBaladoDefaut(titre, '/images/balado.jpg'),
});

export const GABARIT_TEMOIGNAGE: Gabarit = {
  id: 'temoignage',
  nom: 'Témoignage',
  nomEn: 'Testimonial',
  format: 'carre',
  fond: { src: PORTRAIT_2, nb: true, luminositePct: 50 },
  calques: [
    {
      id: 'g-temoin-forme', type: 'forme', z: 1, xPct: 50, yPct: 50, wPct: 90, hPct: 60,
      forme: 'rectangle', couleur: '#181818', opacitePct: 35, filet: false,
    },
    {
      id: 'g-temoin-texte', type: 'texte', z: 2, xPct: 50, yPct: 42, wPct: 76, hPct: 36,
      texte: EXTRAIT_TEMOIGNAGE, police: 'serif', taillePct: 5, graisse: 500,
      couleur: '#FFFFFF', ombre: true, align: 'center',
    },
    {
      id: 'g-temoin-nom', type: 'texte', z: 2, xPct: 50, yPct: 68, wPct: 70, hPct: 6,
      texte: 'Alexis Sénécal, photographe boudoir', police: 'sans', taillePct: 2.4, graisse: 600,
      couleur: '#38B6FF', ombre: false, align: 'center',
    },
  ],
};

export const GABARIT_CONSEIL: Gabarit = {
  id: 'conseil',
  nom: 'Conseil en trois lignes',
  nomEn: 'Three-line tip',
  format: 'feed',
  fond: { src: PORTRAIT_NB, nb: true, luminositePct: 42 },
  calques: [
    {
      id: 'g-conseil-kicker', type: 'texte', z: 2, xPct: 50, yPct: 20, wPct: 70, hPct: 6,
      texte: 'UN CONSEIL', police: 'sans', taillePct: 2.6, graisse: 700,
      couleur: '#38B6FF', ombre: false, align: 'center',
    },
    {
      id: 'g-conseil-l1', type: 'texte', z: 2, xPct: 50, yPct: 42, wPct: 80, hPct: 10,
      texte: 'Un message par plateforme.', police: 'serif', taillePct: 5, graisse: 500,
      couleur: '#FFFFFF', ombre: false, align: 'center',
    },
    {
      id: 'g-conseil-l2', type: 'texte', z: 2, xPct: 50, yPct: 54, wPct: 80, hPct: 10,
      texte: 'Un ton par public.', police: 'serif', taillePct: 5, graisse: 500,
      couleur: '#FFFFFF', ombre: false, align: 'center',
    },
    {
      id: 'g-conseil-l3', type: 'texte', z: 2, xPct: 50, yPct: 66, wPct: 80, hPct: 10,
      texte: 'Une même personne derrière les deux.', police: 'serif', taillePct: 5, graisse: 500,
      couleur: '#FFFFFF', ombre: false, align: 'center',
    },
  ],
};

export const GABARIT_CARROUSEL: Gabarit = {
  id: 'carrousel',
  nom: 'Couverture de carrousel',
  nomEn: 'Carousel cover',
  format: 'carrousel',
  fond: { src: PORTRAIT_1, nb: false, luminositePct: 58 },
  calques: [
    {
      id: 'g-carr-indic', type: 'forme', z: 2, xPct: 88, yPct: 10, wPct: 10, hPct: 5,
      forme: 'rectangle', couleur: '#181818', opacitePct: 75, filet: false,
    },
    {
      id: 'g-carr-indic-texte', type: 'texte', z: 3, xPct: 88, yPct: 10, wPct: 10, hPct: 5,
      texte: '1/5', police: 'sans', taillePct: 2.4, graisse: 700,
      couleur: '#FFFFFF', ombre: false, align: 'center',
    },
    {
      id: 'g-carr-titre', type: 'texte', z: 2, xPct: 50, yPct: 68, wPct: 82, hPct: 22,
      texte: 'Cinq idées pour clarifier votre image de marque', police: 'serif', taillePct: 6, graisse: 500,
      couleur: '#FFFFFF', ombre: true, align: 'center',
    },
    {
      id: 'g-carr-fleche', type: 'texte', z: 2, xPct: 50, yPct: 90, wPct: 60, hPct: 6,
      texte: 'Glissez →', police: 'sans', taillePct: 2.6, graisse: 600,
      couleur: '#38B6FF', ombre: false, align: 'center',
    },
  ],
};

export const GABARITS: Gabarit[] = [
  GABARIT_CITATION,
  GABARIT_RENDEZVOUS,
  GABARIT_BALADO,
  GABARIT_TEMOIGNAGE,
  GABARIT_CONSEIL,
  GABARIT_CARROUSEL,
];
