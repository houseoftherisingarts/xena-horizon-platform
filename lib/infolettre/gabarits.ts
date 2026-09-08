/**
 * Les gabarits de l'infolettre : ce que Laurie voit à la création d'une nouvelle lettre. Chaque
 * gabarit pose un sujet, un pré-en-tête, un bandeau et des blocs déjà remplis dans sa charte, avec
 * ses vraies images en adresse absolue (le courriel se lit hors du site, jamais sur xenahorizon.com).
 * Bilingue FR/EN, comme le reste du composeur. Rien d'ici n'a d'équivalent chez Krystine : Xena n'a
 * pas de gabarits de départ, celui-ci est propre à ce site.
 */
import { BRAND, FONDS_INFOLETTRE, type NewsletterBlock, type BandeauInfolettre } from './renderer';
import { COORDONNEES } from '../contenu';

export interface ContenuGabarit {
  sujet: string;
  preheader: string;
  blocs: NewsletterBlock[];
  bandeau: BandeauInfolettre;
  fond: string;
}

export interface Gabarit {
  id: string;
  nom: { FR: string; EN: string };
  description: { FR: string; EN: string };
  /** Une lettre à la fois FR et EN : les deux langues du gabarit vivent côte à côte, on prend celle demandée. */
  construire: (langueLettre: 'fr' | 'en') => ContenuGabarit;
}

const img = (nom: string) => `${BRAND.site}/images/${nom}`;
const PAPIER_CHAUD = FONDS_INFOLETTRE[1].hex; // #F7F4EE

/** Le pied de la lettre lit lib/contenu.ts : jamais une adresse ou un numéro inventés. */
export const piedCourriel = `${COORDONNEES.courriel} · ${COORDONNEES.telephone}`;

const GABARIT_VIERGE: Gabarit = {
  id: 'vierge',
  nom: { FR: 'Page blanche', EN: 'Blank page' },
  description: { FR: 'Rien de posé : vous commencez du premier bloc.', EN: 'Nothing set: you start from the first block.' },
  construire: () => ({ sujet: '', preheader: '', blocs: [], bandeau: {}, fond: PAPIER_CHAUD }),
};

const GABARIT_NOUVELLE: Gabarit = {
  id: 'nouvelle',
  nom: { FR: 'Nouvelle', EN: 'News' },
  description: { FR: 'Une nouvelle à partager : logo, portrait, un mot, un rendez-vous.', EN: 'A piece of news to share: logo, portrait, a word, a booking link.' },
  construire: (l): ContenuGabarit => {
    const fr = l === 'fr';
    const blocs: NewsletterBlock[] = [
      { type: 'image', content: { url: img('logo-laurie.png'), alt: 'Xena Horizon', href: BRAND.site } },
      { type: 'heading', content: { level: 1, align: 'left', text: fr ? 'Quoi de neuf chez Xena Horizon' : "What's new at Xena Horizon" } },
      { type: 'paragraph', content: { text: fr
        ? 'Voici votre premier paragraphe : remplacez-le par la nouvelle que vous voulez partager avec votre communauté.'
        : 'This is your first paragraph: replace it with the news you want to share with your community.' } },
      { type: 'image', content: { url: img('laurie-portrait-1-1200.jpg'), alt: fr ? 'Laurie Belhumeur' : 'Laurie Belhumeur', caption: '' } },
      { type: 'button', content: { label: fr ? 'Prendre rendez-vous' : 'Book an appointment', href: BRAND.site, variant: 'primaire' } },
    ];
    return {
      sujet: fr ? 'Des nouvelles de Xena Horizon' : 'News from Xena Horizon',
      preheader: fr ? 'Ce qui se passe cette saison.' : 'What is happening this season.',
      blocs,
      bandeau: { etiquette: fr ? 'Infolettre' : 'Newsletter' },
      fond: PAPIER_CHAUD,
    };
  },
};

const GABARIT_RENDEZVOUS: Gabarit = {
  id: 'rendezvous',
  nom: { FR: 'Rendez-vous', EN: 'Appointment' },
  description: { FR: 'Un appel fort vers la prise de rendez-vous.', EN: 'A strong call toward booking a session.' },
  construire: (l): ContenuGabarit => {
    const fr = l === 'fr';
    const blocs: NewsletterBlock[] = [
      { type: 'image', content: { url: img('logo-laurie.png'), alt: 'Xena Horizon', href: BRAND.site } },
      { type: 'heading', content: { level: 1, align: 'left', text: fr ? 'Réservons un moment' : "Let's book a moment" } },
      { type: 'paragraph', content: { text: fr
        ? 'Un mot d’invitation : dites ici pourquoi ce moment vaut la peine d’être pris, puis remplacez ce texte par le vôtre.'
        : 'A word of invitation: say here why this moment is worth taking, then replace this text with yours.' } },
      { type: 'image', content: { url: img('laurie-scene-1200.jpg'), alt: fr ? 'Laurie Belhumeur en scène' : 'Laurie Belhumeur on stage', caption: '' } },
      { type: 'cta', content: {
        eyebrow: fr ? 'Disponibilités ouvertes' : 'Open availability',
        title: fr ? 'Prenez rendez-vous avec Laurie' : 'Book a session with Laurie',
        body: fr ? 'Un premier échange pour voir ensemble où vous en êtes et ce qui vous aiderait.' : 'A first conversation to see together where you stand and what would help.',
        href: BRAND.site,
        boutonTexte: fr ? 'Prendre rendez-vous' : 'Book now',
      } },
    ];
    return {
      sujet: fr ? 'Réservez votre rendez-vous' : 'Book your appointment',
      preheader: fr ? 'Quelques places sont ouvertes cette semaine.' : 'A few slots are open this week.',
      blocs,
      bandeau: { etiquette: fr ? 'Infolettre' : 'Newsletter' },
      fond: PAPIER_CHAUD,
    };
  },
};

/** Le premier épisode du flux, tel que public/balado.json le donne (voir scripts/balado.mjs). */
export interface EpisodeBalado { titre: string; image?: string }

function gabaritBalado(episode: EpisodeBalado, couverture: string): Gabarit {
  return {
    id: 'balado',
    nom: { FR: 'Balado', EN: 'Podcast' },
    description: { FR: 'Le dernier épisode, mis de l’avant.', EN: 'The latest episode, put forward.' },
    construire: (l): ContenuGabarit => {
      const fr = l === 'fr';
      const blocs: NewsletterBlock[] = [
        { type: 'image', content: { url: img('logo-laurie.png'), alt: 'Xena Horizon', href: BRAND.site } },
        { type: 'heading', content: { level: 1, align: 'left', text: fr ? 'Un nouvel épisode à écouter' : 'A new episode to listen to' } },
        { type: 'image', content: { url: couverture, alt: episode.titre, caption: episode.titre } },
        { type: 'paragraph', content: { text: fr
          ? `« ${episode.titre} » : remplacez ce paragraphe par ce que vous voulez en dire.`
          : `“${episode.titre}”: replace this paragraph with what you want to say about it.` } },
        { type: 'button', content: { label: fr ? 'Écouter l’épisode' : 'Listen to the episode', href: `${BRAND.site}/projets`, variant: 'primaire' } },
      ];
      return {
        sujet: fr ? 'Un nouvel épisode du balado' : 'A new podcast episode',
        preheader: episode.titre,
        blocs,
        bandeau: { etiquette: fr ? 'Balado' : 'Podcast' },
        fond: PAPIER_CHAUD,
      };
    },
  };
}

/**
 * Les gabarits offerts à la création d'une lettre. Le balado ne s'ajoute que si public/balado.json
 * porte au moins un épisode (le fichier est écrit au build par scripts/balado.mjs, donc absent en
 * développement tant qu'un `npm run build` n'a pas tourné une fois) : ponytail, un fetch simple,
 * pas de génération statique séparée pour cette seule vignette.
 */
export async function chargerGabarits(): Promise<Gabarit[]> {
  const base: Gabarit[] = [GABARIT_VIERGE, GABARIT_NOUVELLE, GABARIT_RENDEZVOUS];
  try {
    const res = await fetch('/balado.json');
    if (!res.ok) return base;
    const data = await res.json();
    const premier = Array.isArray(data?.episodes) ? data.episodes[0] : null;
    if (!premier?.titre) return base;
    return [...base, gabaritBalado(premier, data.image || '')];
  } catch {
    return base;
  }
}
