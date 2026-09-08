/**
 * Contrat commun de la comptabilité (vague « Finances », septembre 2026) : les types que les trois
 * bâtisseurs (transactions/plan comptable, taxes/impôt, rapports) importent tous. Écrit en premier,
 * ne change pas sans repasser par les trois.
 */

export type Sens = 'revenu' | 'depense';

export interface Compte {
  id: string;
  code: string;
  nom: string;
  nomEn: string;
  sens: Sens;
  /** Part déductible du montant, 1 par défaut (100 %), 0.5 pour les repas et la représentation. */
  deductible?: number;
  ordre: number;
  actif: boolean;
}

export interface Transaction {
  id: string;
  date: string; // AAAA-MM-JJ
  description: string;
  sens: Sens;
  montant: number; // avant taxes, en dollars
  tps: number;
  tvq: number;
  total: number;
  compteId: string;
  tiers?: string; // client ou fournisseur
  source: 'manuel' | 'facture' | 'import';
  factureId?: string;
  importId?: string; // pour dédoublonner un import
  empreinte?: string;
  recu?: {
    chemin: string;
    url: string;
    nom: string;
    contentType: string;
    taille: number;
  };
  concilie: boolean;
  notes?: string;
  cree: unknown;
  modifie: unknown;
}

export interface ReglagesCompta {
  exerciceDebut: string; // 'MM-JJ', '01-01' par défaut
  frequenceTaxes: 'annuelle' | 'trimestrielle' | 'mensuelle';
  inscritTaxes: boolean;
  tauxTPS: number; // 5
  tauxTVQ: number; // 9.975
  numeroTPS?: string;
  numeroTVQ?: string;
  methode: 'caisse' | 'exercice';
  anneeFiscale: number;
}

export interface Periode {
  debut: string;
  fin: string;
  libelle: string;
}
