// Le moteur de calques du studio social : un format (le canevas), un fond, et des calques
// (texte, image, forme) positionnés en pourcentage du canevas. Le pourcentage rend la toile,
// les vignettes de gabarits et l'export indépendants de la taille d'affichage à l'écran : le
// même calque se dessine identique, petit dans une vignette ou plein cadre dans la toile.

export type Reseau = 'carre' | 'story' | 'feed' | 'linkedin' | 'carrousel';

export interface Format {
  id: Reseau;
  label: string;
  labelEn: string;
  largeur: number; // px d'export
  hauteur: number;
}

export const FORMATS: Format[] = [
  { id: 'carre', label: 'Publication carrée', labelEn: 'Square post', largeur: 1080, hauteur: 1080 },
  { id: 'feed', label: 'Portrait (4:5)', labelEn: 'Portrait (4:5)', largeur: 1080, hauteur: 1350 },
  { id: 'story', label: 'Story (9:16)', labelEn: 'Story (9:16)', largeur: 1080, hauteur: 1920 },
  { id: 'linkedin', label: 'LinkedIn (1.91:1)', labelEn: 'LinkedIn (1.91:1)', largeur: 1200, hauteur: 628 },
  { id: 'carrousel', label: 'Carrousel (4:5)', labelEn: 'Carousel (4:5)', largeur: 1080, hauteur: 1350 },
];

export const formatParId = (id: Reseau): Format => FORMATS.find((f) => f.id === id) ?? FORMATS[0];

/** Fond plein cadre : une photo, jamais un aplat seul (règle du client). */
export interface Fond {
  src: string;
  nb: boolean; // noir et blanc
  luminositePct: number; // 40 à 100, pour garder le texte lisible
}

interface CalqueBase {
  id: string;
  z: number;
  xPct: number; // centre du calque, % de la largeur du canevas
  yPct: number; // centre du calque, % de la hauteur du canevas
  wPct: number; // % de la largeur
  hPct: number; // % de la hauteur (texte : sert de boîte de renvoi à la ligne)
}

export type Police = 'serif' | 'sans';
export type Graisse = 400 | 500 | 600 | 700;
export type Alignement = 'left' | 'center' | 'right';

export interface CalqueTexte extends CalqueBase {
  type: 'texte';
  texte: string;
  police: Police;
  taillePct: number; // % de la hauteur du canevas
  graisse: Graisse;
  couleur: string;
  ombre: boolean;
  align: Alignement;
}

export interface CalqueImage extends CalqueBase {
  type: 'image';
  src: string;
  nb: boolean;
}

export type FormeType = 'rectangle' | 'cercle' | 'ligne';

export interface CalqueForme extends CalqueBase {
  type: 'forme';
  forme: FormeType;
  couleur: string;
  opacitePct: number;
  filet: boolean;
}

export type Calque = CalqueTexte | CalqueImage | CalqueForme;

export interface Gabarit {
  id: string;
  nom: string;
  nomEn: string;
  format: Reseau;
  fond: Fond;
  calques: Calque[];
}

/** Palette de couleurs offertes au calque texte/forme sélectionné : les deux palettes réelles du site. */
export const PALETTE_COULEURS: { nom: string; valeur: string }[] = [
  { nom: 'Blanc', valeur: '#FFFFFF' },
  { nom: 'Noir Xena', valeur: '#181818' },
  { nom: 'Azur (ciel)', valeur: '#0876B5' },
  { nom: 'Bleu ciel', valeur: '#38B6FF' },
  { nom: 'Papier chaud (encre)', valeur: '#F7F4EE' },
  { nom: 'Encre', valeur: '#1A1A1E' },
  { nom: 'Rose Xena (encre)', valeur: '#A8104A' },
];

/** Les vraies photos publiques déjà sur le site, offertes comme source de calque image. */
export const IMAGES_PUBLIQUES: string[] = [
  '/images/laurie-portrait-1.jpg',
  '/images/laurie-portrait-2.jpg',
  '/images/laurie-portrait-nb.jpg',
  '/images/laurie-apropos.jpg',
  '/images/laurie-scene.jpg',
  '/images/livre-couverture.jpg',
  '/images/banniere-defaut.jpg',
  '/images/balado.jpg',
  '/images/logo-laurie.png',
];

let compteur = 0;
export const idCalque = (): string => `c${Date.now().toString(36)}${(compteur++).toString(36)}`;

export const nouveauTexte = (partiel: Partial<CalqueTexte> = {}): CalqueTexte => ({
  id: idCalque(),
  type: 'texte',
  z: 1,
  xPct: 50,
  yPct: 50,
  wPct: 80,
  hPct: 20,
  texte: 'Nouveau texte',
  police: 'serif',
  taillePct: 6,
  graisse: 600,
  couleur: '#FFFFFF',
  ombre: true,
  align: 'center',
  ...partiel,
});

export const nouvelleImage = (src: string, partiel: Partial<CalqueImage> = {}): CalqueImage => ({
  id: idCalque(),
  type: 'image',
  z: 1,
  xPct: 50,
  yPct: 50,
  wPct: 40,
  hPct: 40,
  src,
  nb: false,
  ...partiel,
});

export const nouvelleForme = (forme: FormeType = 'rectangle', partiel: Partial<CalqueForme> = {}): CalqueForme => ({
  id: idCalque(),
  type: 'forme',
  z: 1,
  xPct: 50,
  yPct: 50,
  wPct: 30,
  hPct: forme === 'ligne' ? 0.4 : 30,
  forme,
  couleur: '#38B6FF',
  opacitePct: 100,
  filet: false,
  ...partiel,
});
