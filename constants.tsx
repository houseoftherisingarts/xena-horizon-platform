
// Le contenu réel de Xena Horizon vit dans lib/contenu.ts (SERVICES_REELS, PROJETS, TEMOIGNAGES...).

export const PRICE_RANGES = [
  { label: 'Freemium', min: 0, max: 0, color: 'text-gris' },
  { label: 'Micro (1-10$)', min: 0.01, max: 10, color: 'text-gris' },
  { label: 'Entrée (11-100$)', min: 10.01, max: 100, color: 'text-encre' },
  { label: 'Milieu (101-500$)', min: 100.01, max: 500, color: 'text-encre' },
  { label: 'Haut (501-2000$)', min: 500.01, max: 2000, color: 'text-encre' },
  { label: 'Premium (2k-10k$)', min: 2000.01, max: 10000, color: 'text-rose' },
  { label: 'Elite (10k$+)', min: 10000.01, max: 9999999, color: 'text-rose' },
];
