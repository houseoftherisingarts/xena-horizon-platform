
export type Language = 'FR' | 'EN';

export type ClientArchetype = 'Artist' | 'Entrepreneur' | 'NPO';

export const CLIENT_ARCHETYPE_IDS: ClientArchetype[] = ['Artist', 'Entrepreneur', 'NPO'];

export enum UserRole {
  PUBLIC = 'PUBLIC',
  ADMIN = 'ADMIN'
}

export enum ClientStatus {
  LEAD = 'Lead',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Client {
  id: string;
  name: string;
  organization: string;
  email: string;
  status: ClientStatus;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  paymentType: 'Once' | 'Recurring';
  paymentDate?: string; // Next payment date or transaction date
  notes: string;
  serviceType: 'Artist' | 'Organism' | 'Entrepreneur';
  lastContact: string;
  tasks: Task[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  published: boolean;
}

export type ProductStatus = 'Active' | 'Planned' | 'Inactive' | 'Concept';
export type ProductCategory = 'Product' | 'Service';

export interface ProductVariant {
  name?: string;
  price?: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'Digital' | 'Service' | 'Consulting'; // Sub-type
  category: ProductCategory; // Main Label
  status: ProductStatus;
  isPublic: boolean; // Published to public site
  clientTypes?: ClientArchetype[]; // empty/undefined = visible to all archetypes
  variants?: Partial<Record<ClientArchetype, ProductVariant>>; // archetype-specific overrides (name, price, description)
}

export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  date: string;
  storagePath?: string;
}

export interface SocialTemplate {
  id: string;
  text: string;
  bgImage: string;
  theme: 'dark' | 'light';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export type DocumentType = 'Invoice' | 'Quote';
export type DocumentStatus = 'Draft' | 'Sent' | 'Paid' | 'Accepted' | 'Declined';

export interface Document {
  id: string;
  number: string;
  type: DocumentType;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  status: DocumentStatus;
  terms: string;
  paymentLink?: string;
  signed?: boolean;
  signatureDate?: string;
}

// --- HOME PAGE BLOCKS ---
export type HomeBlockType = 'HERO' | 'SERVICES_PREVIEW' | 'STATS' | 'CONTACT' | 'TEXT' | 'IMAGE';

export interface HomeBaseBlock {
  id: string;
  type: HomeBlockType;
}

export interface HomeHeroBlock extends HomeBaseBlock {
  type: 'HERO';
  tagline: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  imageUrl: string; // Profile picture usually
}

export interface HomeServicesBlock extends HomeBaseBlock {
  type: 'SERVICES_PREVIEW';
  title: string;
  subtitle: string;
}

export interface HomeStatsBlock extends HomeBaseBlock {
  type: 'STATS';
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface HomeContactBlock extends HomeBaseBlock {
  type: 'CONTACT';
  title: string;
  text: string;
  email: string;
}

export interface HomeTextBlock extends HomeBaseBlock {
  type: 'TEXT';
  content: string;
}

export interface HomeImageBlock extends HomeBaseBlock {
  type: 'IMAGE';
  url: string;
  caption: string;
}

export type HomeBlock = HomeHeroBlock | HomeServicesBlock | HomeStatsBlock | HomeContactBlock | HomeTextBlock | HomeImageBlock;

export type ViewState = 'HOME' | 'SERVICES' | 'PROJETS' | 'A_PROPOS' | 'ESPACE_CLIENT' | 'ADMIN_DOSSIERS' | 'ADMIN_DASHBOARD' | 'ADMIN_CRM' | 'ADMIN_SOCIAL' | 'ADMIN_PRODUCTS' | 'ADMIN_INVOICES' | 'ADMIN_GALLERY' | 'ADMIN_FINANCE' | 'ADMIN_NEWSLETTER' | 'ADMIN_AGENDA' | 'ADMIN_EMAIL' | 'ADMIN_MESSENGER' | 'ADMIN_VEXEL' | 'ADMIN_TEMOIGNAGES';

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;        // e.g., 'public-home-contact', 'services-cta'
  createdAt?: any;       // Firestore Timestamp
  read?: boolean;
  archived?: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantEmail?: string;
  lastMessage?: string;
  lastMessageAt?: any; // Timestamp
  unreadByAdmin?: boolean;
}

export interface ChatMessage {
  id: string;
  body: string;
  sender: 'admin' | 'participant';
  createdAt?: any; // Timestamp
}

// --- NEWSLETTER ---
export type NewsletterStatus = 'draft' | 'sent';

export interface NewsletterCampaign {
  id: string;
  subject: string;
  blocks: any[]; // EmailBlock — keep flexible since the existing local type is fine
  segment?: string;
  status: NewsletterStatus;
  sentAt?: any;
  createdAt?: any;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  tags?: string[];
  status: 'active' | 'unsubscribed';
  source?: string;
  unsubscribeToken?: string;
  lang?: 'fr' | 'en';
  createdAt?: any;
}


// --- DOSSIER CLIENT (espace client et back-office) ---
export type ProfilClient = 'artiste' | 'entrepreneur' | 'organisme';

/** Une pièce demandée par Laurie, décrite dans le catalogue (settings/dossier, avec repli dans lib/dossier.ts). */
export interface PieceDef {
  id: string;
  cat: string;
  nom: string;
  aide?: string;
  option?: boolean;
  /** Pendants anglais, facultatifs : lib/dossier.ts replie sur le FR quand ils manquent (catalogue modifié par Laurie sans les remplir). */
  catEn?: string;
  nomEn?: string;
  aideEn?: string;
}

/** Un temps du parcours d'accompagnement. */
export interface EtapeDef {
  id: string;
  titre: string;
  sous: string;
}

/** Un fichier déposé par la personne accompagnée pour une pièce donnée. Ce que la personne contrôle : jamais un jugement. */
export interface PieceDeposee {
  nom: string;
  chemin: string;      // chemin Storage : dossiers/{uid}/{pieceId}/{horodatage}-{nom}
  url?: string;        // URL de téléchargement obtenue au dépôt
  taille: number;
  type: string;
  deposeLe: any;       // Timestamp
}

/** Le jugement de Laurie sur une pièce, séparé de ce que la personne dépose : seule Laurie écrit ce champ. */
export interface PieceRevue {
  etat: 'valide' | 'a_refaire';
  note?: string;       // remarque de Laurie quand la pièce est à refaire
  revueLe: any;         // Timestamp
}

export interface ProjetClient {
  titre: string;
  description: string;
  objectif: string;
  echeance?: string;   // date ISO (AAAA-MM-JJ), lue sur la chaîne, jamais par new Date(iso)
}

export interface Dossier {
  id: string;          // = uid Firebase Auth
  uid: string;
  courriel: string;
  nom: string;
  telephone?: string;
  ville?: string;
  photoURL?: string;
  /** Profil façon réseau social (onglet « Mon profil ») : bannière, présentation courte, liens. */
  banniereURL?: string;
  bio?: string;
  liens?: Record<string, string>;
  profil: ProfilClient;
  discipline?: string;
  projet: ProjetClient;
  etape: string;       // id d'une EtapeDef
  pieces: Record<string, PieceDeposee>;
  revue?: Record<string, PieceRevue>;  // jugement de Laurie par pieceId; le client ne peut jamais l'écrire (firestore.rules)
  createdAt?: any;
  updatedAt?: any;
  derniereActiviteClient?: any;
  derniereActiviteAdmin?: any;
  nonLusAdmin?: number;   // messages ou pièces que Laurie n'a pas encore vus
  nonLusClient?: number;  // messages de Laurie que la personne n'a pas encore vus
  archive?: boolean;
  tags?: string[];
}

export interface DossierMessage {
  id: string;
  texte: string;
  de: 'client' | 'admin';
  deUid: string;
  createdAt?: any;
  luParAdmin?: boolean;
  luParClient?: boolean;
}

/** Note privée de Laurie, jamais visible par la personne accompagnée. */
export interface DossierNote {
  id: string;
  texte: string;
  createdAt?: any;
}

/** Ressource partagée avec toutes les personnes accompagnées (guide, aide-mémoire, gabarit). */
export interface Ressource {
  id: string;
  titre: string;
  description?: string;
  url: string;
  chemin?: string;
  visibleClients: boolean;
  ordre: number;
  createdAt?: any;
}

export interface DossierConfig {
  pieces: PieceDef[];
  etapes: EtapeDef[];
}


// --- RENDEZ-VOUS (calendrier intégré + rencontre vidéo), contrat dans lib/rendezvous.ts ---
export type StatutRendezVous = 'demande' | 'confirme' | 'annule' | 'complete';

export interface RendezVous {
  id: string;
  uid: string;
  nom: string;
  courriel: string;
  debut: any;        // Timestamp
  fin: any;          // Timestamp
  duree: number;     // minutes
  statut: StatutRendezVous;
  salle: string;     // nom de la salle vidéo (Jitsi), dérivé de l'id
  note?: string;     // ce que la personne veut aborder
  noteAdmin?: string;
  creePar: 'client' | 'admin';
  createdAt?: any;
  updatedAt?: any;
}

/** Miroir public (personnes connectées) d'un créneau pris, sans aucune donnée personnelle. */
export interface Occupation {
  id: string;        // = id du rendez-vous
  debut: any;
  fin: any;
}

export interface PlageHoraire {
  de: string;        // "09:00"
  a: string;         // "12:00"
}

/** settings/agenda : les disponibilités de Laurie, éditées dans Admin › Agenda. */
export interface AgendaConfig {
  duree: number;             // minutes par rencontre
  tampon: number;            // minutes entre deux rencontres
  delaiMinHeures: number;    // délai minimal avant un rendez-vous
  horizonJours: number;      // jusqu'où on peut réserver
  fuseau: string;            // 'America/Toronto'
  jours: Record<'0' | '1' | '2' | '3' | '4' | '5' | '6', PlageHoraire[]>;   // 0 = dimanche
  exceptions?: Record<string, PlageHoraire[]>;   // 'AAAA-MM-JJ' → plages (vide = journée fermée)
}


// --- TÉMOIGNAGES AUDIO (accueil, porté du site de Philippe Dufresne) ---
export interface TemoignageAudio {
  id: string;
  nom: string;          // « Sophie L. »
  role?: string;        // « Autrice », « Photographe »
  audioURL: string;     // Storage temoignages/...
  storagePath?: string;
  duree?: number;       // secondes
  extrait?: string;     // une phrase à lire pendant l'écoute
  ordre?: number;
  publie: boolean;
  createdAt?: any;
}
