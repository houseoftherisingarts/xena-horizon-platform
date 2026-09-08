import React from 'react';
import { Product, ClientArchetype } from './types';
import { Palette, Users, Zap } from 'lucide-react';

// Le contenu réel de Xena Horizon vit dans lib/contenu.ts (SERVICES_REELS, PROJETS, TEMOIGNAGES...).

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
