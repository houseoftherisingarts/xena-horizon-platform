import React from 'react';
import { Client, BlogPost, Product, GalleryImage, ClientArchetype } from './types';
import { Palette, Users, Zap, Sparkles } from 'lucide-react';

// Le contenu réel de Xena Horizon vit dans lib/contenu.ts (SERVICES_REELS, PROJETS, TEMOIGNAGES...).
// Les tableaux ci-dessous restent exportés vides, avec leurs noms d'origine, pour ne pas casser les
// pages admin qui les importent encore (AdminInvoices, AdminLanding, AdminNewsletter, SocialCreator).
// Le chantier D les rebranche sur Firestore (`clients`, `gallery`).
export const MOCK_CLIENTS: Client[] = [];

export const MOCK_BLOG_POSTS: BlogPost[] = [];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_GALLERY: GalleryImage[] = [];

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
    detailsFR: "Structurez votre démarche artistique et atteignez vos objectifs de carrière avec une approche humaine : subventions, contrats, plan de match, sans jamais perdre votre voix.",
    detailsEN: 'Structure your artistic practice and reach your career goals with a human-centered approach: grants, contracts, a game plan, without ever losing your voice.',
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
    detailsFR: "De la confusion à la clarté, pour celles et ceux qui sortent du cadre (studios, collectifs, créateurs hybrides) et qui veulent un modèle d'affaires durable.",
    detailsEN: 'From confusion to clarity, for those who break the mold (studios, collectives, hybrid creators) and want a durable business model.',
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
