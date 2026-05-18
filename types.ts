
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

export type ViewState = 'HOME' | 'SERVICES' | 'ADMIN_DASHBOARD' | 'ADMIN_CRM' | 'ADMIN_SOCIAL' | 'ADMIN_PRODUCTS' | 'ADMIN_INVOICES' | 'ADMIN_GALLERY' | 'ADMIN_FINANCE' | 'ADMIN_LANDING' | 'ADMIN_NEWSLETTER' | 'ADMIN_WEBSITE' | 'ADMIN_AGENDA' | 'ADMIN_EMAIL' | 'ADMIN_MESSENGER';

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
  createdAt?: any;
}
