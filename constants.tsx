import React from 'react';
import { Client, ClientStatus, BlogPost, Product, GalleryImage, ClientArchetype } from './types';
import { Palette, Users, Zap, Sparkles } from 'lucide-react';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sophie Martineau',
    organization: 'Théâtre de la Lune',
    email: 'sophie@theatrelune.ca',
    status: ClientStatus.ACTIVE,
    paymentStatus: 'Paid',
    paymentType: 'Recurring',
    paymentDate: '2024-06-01',
    notes: 'Working on strategic grant application.',
    serviceType: 'Artist',
    lastContact: '2024-05-10',
    tasks: [
      { id: 't1', text: 'Finaliser le budget prévisionnel', completed: false },
      { id: 't2', text: 'Relire la lettre d\'intention', completed: true },
    ]
  },
  {
    id: '2',
    name: 'Centre Communautaire Espoir',
    organization: 'CC Espoir',
    email: 'contact@ccespoir.org',
    status: ClientStatus.ACTIVE,
    paymentStatus: 'Pending',
    paymentType: 'Once',
    paymentDate: '2024-05-20',
    notes: 'Revising organizational structure.',
    serviceType: 'Organism',
    lastContact: '2024-05-12',
    tasks: [
      { id: 't3', text: 'Envoyer le contrat signé', completed: false },
    ]
  },
  {
    id: '3',
    name: 'Marc Tremblay',
    organization: 'Indie Studio',
    email: 'marc@indiestudio.com',
    status: ClientStatus.LEAD,
    paymentStatus: 'Pending',
    paymentType: 'Once',
    paymentDate: '',
    notes: 'Initial consultation scheduled.',
    serviceType: 'Entrepreneur',
    lastContact: '2024-05-08',
    tasks: []
  },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'De l’Invisible à l’Iconique',
    excerpt: 'Comment structurer son image de marque pour un impact durable dans le milieu culturel.',
    date: '15 Mai 2024',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    published: true,
  },
  {
    id: '2',
    title: 'Gérer le Chaos Créatif',
    excerpt: 'Des méthodes concrètes pour passer de l’idée à l’exécution sans perdre son âme.',
    date: '28 Avril 2024',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    published: true,
  },
];

// Products. `clientTypes` filters which archetype sees the product on the public site.
// `variants` lets a single offering carry archetype-specific name/price/description.
export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Checklist "Départ Canon"', price: 0, description: 'PDF gratuit pour structurer son CA.', type: 'Digital', category: 'Product', status: 'Active', isPublic: true, clientTypes: ['Artist', 'Entrepreneur', 'NPO'] },
  { id: '2', name: 'Template Budget Simple', price: 9, description: 'Tableau Excel pré-rempli.', type: 'Digital', category: 'Product', status: 'Active', isPublic: false, clientTypes: ['Artist', 'Entrepreneur'] },
  { id: '3', name: 'Ebook: Chaos à l\'Ordre', price: 27, description: 'Le guide complet (150 pages).', type: 'Digital', category: 'Product', status: 'Active', isPublic: true, clientTypes: ['Artist', 'Entrepreneur', 'NPO'] },
  {
    id: '4', name: 'Audit Express', price: 150,
    description: 'Analyse de dossier de subvention (1h).',
    type: 'Service', category: 'Service', status: 'Active', isPublic: true,
    clientTypes: ['Artist', 'Entrepreneur', 'NPO'],
    variants: {
      Artist: { name: 'Audit Express — Artiste', description: 'Relecture stratégique de votre dossier (CALQ, CAC, SODEC).', price: 120 },
      Entrepreneur: { name: 'Audit Express — Out of the box', description: 'Audit éclair de votre pitch / plan d\'affaires créatif.', price: 180 },
      NPO: { name: 'Audit Express — OBNL', description: 'Diagnostic rapide de gouvernance ou de demande de subvention.', price: 150 },
    },
  },
  { id: '5', name: 'Atelier Stratégie', price: 450, description: 'Demi-journée en groupe.', type: 'Service', category: 'Service', status: 'Planned', isPublic: false, clientTypes: ['Artist', 'Entrepreneur', 'NPO'] },
  {
    id: '6', name: 'Mentorat "Guerrière"', price: 1500,
    description: 'Accompagnement sur 3 mois.',
    type: 'Consulting', category: 'Service', status: 'Active', isPublic: true,
    clientTypes: ['Artist', 'Entrepreneur'],
    variants: {
      Artist: { name: 'Mentorat Guerrière — Artiste', description: 'Trois mois pour structurer votre démarche, vos finances et votre voix.', price: 1500 },
      Entrepreneur: { name: 'Mentorat Out of the box', description: 'Trois mois pour bâtir un modèle d\'affaires aligné avec votre vision.', price: 1800 },
    },
  },
  {
    id: '7', name: 'Refonte Organisationnelle', price: 5000,
    description: 'Mandat complet de restructuration.',
    type: 'Consulting', category: 'Service', status: 'Concept', isPublic: false,
    clientTypes: ['NPO', 'Entrepreneur'],
    variants: {
      NPO: { name: 'Refonte OBNL', description: 'Restructuration complète : gouvernance, processus, financement.', price: 5000 },
      Entrepreneur: { name: 'Refonte Studio Créatif', description: 'Restructuration complète d\'un studio ou collectif créatif.', price: 6500 },
    },
  },
  { id: '8', name: 'Partenaire Stratégique', price: 12000, description: 'Suivi annuel illimité pour OBNL.', type: 'Consulting', category: 'Service', status: 'Inactive', isPublic: false, clientTypes: ['NPO'] },
];

export const MOCK_GALLERY: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', name: 'Portrait Studio', date: '2023-10-01' },
  { id: '2', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80', name: 'Bureau Minimal', date: '2023-09-15' },
  { id: '3', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80', name: 'Meeting Team', date: '2023-09-10' },
  { id: '4', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', name: 'Planning Whiteboard', date: '2023-08-22' },
  { id: '5', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', name: 'Handshake', date: '2023-08-20' },
];

export const PRICE_RANGES = [
  { label: 'Freemium', min: 0, max: 0, color: 'text-slate-400' },
  { label: 'Micro (1-10$)', min: 0.01, max: 10, color: 'text-cyan-300' },
  { label: 'Entrée (11-100$)', min: 10.01, max: 100, color: 'text-cyan-400' },
  { label: 'Milieu (101-500$)', min: 100.01, max: 500, color: 'text-emerald-400' },
  { label: 'Haut (501-2000$)', min: 500.01, max: 2000, color: 'text-blue-400' },
  { label: 'Premium (2k-10k$)', min: 2000.01, max: 10000, color: 'text-fuchsia-400' },
  { label: 'Elite (10k$+)', min: 10000.01, max: 9999999, color: 'text-rose-400' },
];

// PUBLIC SITE STRUCTURE — by client archetype, not by service.
// Each archetype is the entry point; service variants live on Product.variants[archetype].
export interface ArchetypeMeta {
  id: ClientArchetype;
  slug: string;
  titleFR: string;
  titleEN: string;
  subtitleFR?: string;
  subtitleEN?: string;
  taglineFR: string;
  taglineEN: string;
  descriptionFR: string;
  descriptionEN: string;
  detailsFR: string;
  detailsEN: string;
  icon: React.ReactNode;
  /** tailwind gradient classes for the archetype accent (left→right) */
  gradient: string;
}

export const CLIENT_ARCHETYPES: ArchetypeMeta[] = [
  {
    id: 'Artist',
    slug: 'artistes',
    titleFR: 'Artistes',
    titleEN: 'Artists',
    taglineFR: 'Du doute à la puissance.',
    taglineEN: 'From doubt to power.',
    descriptionFR: 'Mentorat et stratégie pour propulser votre art.',
    descriptionEN: 'Mentorship and strategy to propel your art.',
    detailsFR: "Structurez votre démarche artistique et atteignez vos objectifs de carrière avec une approche humaine. Subventions, contrats, plan de match — sans perdre votre voix.",
    detailsEN: 'Structure your artistic practice and reach your career goals with a human-centered approach. Grants, contracts, game plan — without losing your voice.',
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-cyan-400 via-emerald-400 to-blue-500',
  },
  {
    id: 'Entrepreneur',
    slug: 'entrepreneurs',
    titleFR: 'Entrepreneurs Créatifs',
    titleEN: 'Creative Entrepreneurs',
    subtitleFR: 'Out of the box',
    subtitleEN: 'Out of the box',
    taglineFR: "Créateurs d'impact et visionnaires.",
    taglineEN: 'Impact creators and visionaries.',
    descriptionFR: 'Accompagnement stratégique pour bâtir un modèle aligné avec votre vision.',
    descriptionEN: 'Strategic support to build a model aligned with your vision.',
    detailsFR: "De la confusion à la clarté. Pour celles et ceux qui sortent du cadre — studios, collectifs, créateurs hybrides — et qui veulent un modèle d'affaires durable.",
    detailsEN: 'From confusion to clarity. For those who break the mold — studios, collectives, hybrid creators — who want a durable business model.',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-emerald-400 via-cyan-400 to-blue-500',
  },
  {
    id: 'NPO',
    slug: 'obnl',
    titleFR: 'OBNL & Causes Sociales',
    titleEN: 'NPOs & Social Causes',
    taglineFR: 'Soigner la structure pour mieux aider.',
    taglineEN: 'Tend the structure to better serve.',
    descriptionFR: 'Optimisation, financement et gouvernance saine.',
    descriptionEN: 'Optimization, funding, and healthy governance.',
    detailsFR: "Pour les OBNL et organismes communautaires : optimisation des processus, recherche de financement, gouvernance saine. La rigueur au service de votre mission.",
    detailsEN: 'For NPOs and community organizations: process optimization, fundraising, healthy governance. Rigor in service of your mission.',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-blue-500 via-emerald-400 to-cyan-400',
  },
];

// Backwards-compatible alias — older code paths may still import SERVICES.
// Shape: matches the old SERVICES array fields (id, title, icon, description, details).
export const SERVICES = CLIENT_ARCHETYPES.map(a => ({
  id: a.slug,
  title: a.titleFR,
  icon: a.icon,
  description: a.descriptionFR,
  details: a.detailsFR,
}));

export const ARCHETYPE_BADGE = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-iridescent-soft border border-cyan-400/30 text-cyan-200 text-xs font-bold uppercase tracking-widest">
    <Sparkles className="w-3 h-3" /> {children}
  </span>
);

// Resolve a product's archetype-specific variant (falls back to base fields)
export function resolveProductForArchetype(p: Product, archetype?: ClientArchetype | null) {
  if (!archetype) return { name: p.name, price: p.price, description: p.description };
  const v = p.variants?.[archetype];
  return {
    name: v?.name ?? p.name,
    price: v?.price ?? p.price,
    description: v?.description ?? p.description,
  };
}

// --- DESIGN TOKENS ---
export const GLASS_CLASSES = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-[15px]";
export const GLASS_INPUT_CLASSES = "w-full bg-white/5 border border-white/20 rounded-[15px] p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-iridescent-sm transition-all";
export const ACTION_BUTTON_CLASSES = "px-6 py-3 rounded-[15px] bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift hover:bg-[length:300%_300%] text-white font-medium transition-all shadow-iridescent-sm hover:shadow-iridescent flex items-center gap-2 transform active:scale-95";
export const GHOST_BUTTON_CLASSES = "px-6 py-3 rounded-[15px] border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 text-white font-medium transition-all flex items-center gap-2";
export const IRIDESCENT_TEXT = "text-iridescent";
export const IRIDESCENT_BORDER = "border border-transparent bg-iridescent bg-clip-border";
