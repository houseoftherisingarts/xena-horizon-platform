// Plan comptable par défaut d'une travailleuse autonome québécoise en communication et accompagnement
// de carrière. Les comptes de revenus reprennent les familles de services réelles de Laurie (voir
// lib/contenu.ts, SERVICES_REELS); les comptes de dépenses suivent les catégories déductibles usuelles
// de l'ARC et de Revenu Québec pour un travailleur autonome. Surchargeable dans Firestore
// settings/plan_comptable (PlanComptable.tsx) : ce fichier ne sert que de valeur de départ.
import type { Compte } from './types';

export const PLAN_COMPTABLE_DEFAUT: Compte[] = [
  // --- Revenus ---
  { id: 'rev-accompagnement', code: '4000', nom: 'Accompagnement et consultation', nomEn: 'Coaching and consulting', sens: 'revenu', ordre: 10, actif: true },
  { id: 'rev-formation', code: '4100', nom: 'Formation', nomEn: 'Training', sens: 'revenu', ordre: 20, actif: true },
  { id: 'rev-conferences', code: '4200', nom: 'Conférences et animation', nomEn: 'Conferences and hosting', sens: 'revenu', ordre: 30, actif: true },
  { id: 'rev-mentorat', code: '4300', nom: 'Mentorat', nomEn: 'Mentoring', sens: 'revenu', ordre: 40, actif: true },
  { id: 'rev-autres', code: '4900', nom: 'Autres revenus', nomEn: 'Other revenue', sens: 'revenu', ordre: 50, actif: true },

  // --- Dépenses déductibles ---
  { id: 'dep-bureau-domicile', code: '6000', nom: 'Bureau à domicile', nomEn: 'Home office', sens: 'depense', deductible: 1, ordre: 100, actif: true },
  { id: 'dep-telecom', code: '6010', nom: 'Télécommunications', nomEn: 'Telecommunications', sens: 'depense', deductible: 1, ordre: 110, actif: true },
  { id: 'dep-logiciels', code: '6020', nom: 'Logiciels et abonnements', nomEn: 'Software and subscriptions', sens: 'depense', deductible: 1, ordre: 120, actif: true },
  { id: 'dep-publicite', code: '6030', nom: 'Publicité et site web', nomEn: 'Advertising and website', sens: 'depense', deductible: 1, ordre: 130, actif: true },
  { id: 'dep-fournitures', code: '6040', nom: 'Fournitures', nomEn: 'Supplies', sens: 'depense', deductible: 1, ordre: 140, actif: true },
  { id: 'dep-honoraires', code: '6050', nom: 'Honoraires professionnels', nomEn: 'Professional fees', sens: 'depense', deductible: 1, ordre: 150, actif: true },
  { id: 'dep-perfectionnement', code: '6060', nom: 'Perfectionnement professionnel', nomEn: 'Professional development', sens: 'depense', deductible: 1, ordre: 160, actif: true },
  { id: 'dep-deplacements', code: '6070', nom: 'Déplacements', nomEn: 'Travel', sens: 'depense', deductible: 1, ordre: 170, actif: true },
  { id: 'dep-repas', code: '6080', nom: 'Repas et représentation', nomEn: 'Meals and entertainment', sens: 'depense', deductible: 0.5, ordre: 180, actif: true },
  { id: 'dep-assurances', code: '6090', nom: 'Assurances', nomEn: 'Insurance', sens: 'depense', deductible: 1, ordre: 190, actif: true },
  { id: 'dep-frais-bancaires', code: '6100', nom: 'Frais bancaires et Stripe', nomEn: 'Bank and Stripe fees', sens: 'depense', deductible: 1, ordre: 200, actif: true },
  { id: 'dep-cotisations', code: '6110', nom: 'Cotisations professionnelles', nomEn: 'Professional dues', sens: 'depense', deductible: 1, ordre: 210, actif: true },
  { id: 'dep-amortissement', code: '6120', nom: 'Amortissement', nomEn: 'Depreciation', sens: 'depense', deductible: 1, ordre: 220, actif: true },
  { id: 'dep-taxes-permis', code: '6130', nom: 'Taxes et permis', nomEn: 'Taxes and licenses', sens: 'depense', deductible: 1, ordre: 230, actif: true },
  { id: 'dep-autres', code: '6900', nom: 'Autres dépenses', nomEn: 'Other expenses', sens: 'depense', deductible: 1, ordre: 240, actif: true },
];

export function compteParId(comptes: Compte[], id: string): Compte | undefined {
  return comptes.find((c) => c.id === id);
}

export function nomCompte(compte: Compte | undefined, lang: 'FR' | 'EN'): string {
  if (!compte) return lang === 'FR' ? 'Sans catégorie' : 'Uncategorized';
  return lang === 'FR' ? compte.nom : compte.nomEn;
}
