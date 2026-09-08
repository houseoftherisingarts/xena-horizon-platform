// Jeu d'exemple en mémoire pour la boucle de vérification visuelle de Finances (--mode verif) : une
// année glissante réaliste d'une travailleuse autonome en accompagnement de carrière artistique.
// Jamais utilisé en production (voir pages/AdminFinance.tsx, même garde que pages/FacturePublique.tsx).
// Les dates se calculent par rapport à aujourd'hui pour rester d'actualité d'une capture à l'autre.
import { PLAN_COMPTABLE_DEFAUT } from './plan-defaut';
import { REGLAGES_DEFAUT } from './types';
import type { Compte, ReglagesCompta, Transaction } from './types';
import type { Document, DocumentStatus } from '../../types';

export const EXEMPLE_COMPTES: Compte[] = PLAN_COMPTABLE_DEFAUT;

export const EXEMPLE_REGLAGES: ReglagesCompta = {
  ...REGLAGES_DEFAUT,
  numeroTPS: '123456789RT0001',
  numeroTVQ: '1234567890TQ0001',
  anneeFiscale: new Date().getUTCFullYear(),
};

const TAUX_TPS = EXEMPLE_REGLAGES.tauxTPS / 100;
const TAUX_TVQ = EXEMPLE_REGLAGES.tauxTVQ / 100;
const arrondi = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const ajouterJours = (d: Date, n: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
const ajouterMois = (d: Date, n: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()));

const AUJOURDHUI = new Date();

// PRNG déterministe (mulberry32) : le jeu d'exemple reste stable d'une capture à l'autre.
function alea(graine: number) {
  let a = graine | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = alea(20260908);
const entier = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));
const entre = (min: number, max: number) => arrondi(min + rnd() * (max - min));

let compteur = 0;
function ligne(date: string, description: string, sens: 'revenu' | 'depense', compteId: string, montant: number, options: Partial<Transaction> = {}): Transaction {
  compteur += 1;
  const tps = arrondi(montant * TAUX_TPS);
  const tvq = arrondi(montant * TAUX_TVQ);
  return {
    id: `ex-tr-${compteur}`,
    date,
    description,
    sens,
    montant,
    tps,
    tvq,
    total: arrondi(montant + tps + tvq),
    compteId,
    source: 'manuel',
    concilie: compteur % 4 !== 0,
    cree: null,
    modifie: null,
    ...options,
  };
}

const CLIENTS = [
  'Compagnie de danse Fil Rouge',
  'Maison de la culture Frontenac',
  'Collectif Angle Mort',
  'Ville de Repentigny, Service culturel',
  'École nationale de théâtre',
  'Studio Bruit Blanc',
  'Festival Traces',
  "Regroupement des artistes en arts visuels",
];

const REVENUS_MODELE = [
  { compteId: 'rev-accompagnement', libelle: 'Accompagnement stratégique', min: 600, max: 1600 },
  { compteId: 'rev-formation', libelle: 'Atelier de formation', min: 400, max: 1100 },
  { compteId: 'rev-conferences', libelle: 'Conférence et animation', min: 350, max: 900 },
  { compteId: 'rev-mentorat', libelle: 'Séance de mentorat', min: 150, max: 400 },
];

const DEPENSES_FIXES = [
  { compteId: 'dep-logiciels', libelle: 'Abonnement Adobe Creative Cloud', montant: 79.99 },
  { compteId: 'dep-telecom', libelle: 'Forfait cellulaire et internet', montant: 124.5 },
  { compteId: 'dep-cotisations', libelle: 'Cotisation, Réseau des consultants en carrière', montant: 45 },
];

const DEPENSES_VARIABLES = [
  { compteId: 'dep-deplacements', libelle: 'Essence et stationnement, rencontre client', min: 35, max: 120 },
  { compteId: 'dep-repas', libelle: "Repas d'affaires", min: 25, max: 85 },
  { compteId: 'dep-fournitures', libelle: 'Fournitures de bureau', min: 20, max: 90 },
  { compteId: 'dep-publicite', libelle: 'Promotion, réseaux sociaux', min: 50, max: 250 },
];

const DEPENSES_PONCTUELLES = [
  { moisDecalage: 2, compteId: 'dep-perfectionnement', libelle: "Formation, techniques d'entrevue de carrière", montant: 480 },
  { moisDecalage: 5, compteId: 'dep-fournitures', libelle: 'Ordinateur portable (usage professionnel)', montant: 1450 },
  { moisDecalage: 8, compteId: 'dep-assurances', libelle: 'Assurance responsabilité professionnelle', montant: 380 },
];

const MOIS_DEPART = new Date(Date.UTC(AUJOURDHUI.getUTCFullYear(), AUJOURDHUI.getUTCMonth() - 11, 1));

const transactions: Transaction[] = [];

for (let m = 0; m < 12; m++) {
  const moisDate = ajouterMois(MOIS_DEPART, m);

  const nbRevenus = entier(2, 4);
  for (let i = 0; i < nbRevenus; i++) {
    const modele = REVENUS_MODELE[entier(0, REVENUS_MODELE.length - 1)];
    const date = new Date(Date.UTC(moisDate.getUTCFullYear(), moisDate.getUTCMonth(), entier(3, 26)));
    if (date > AUJOURDHUI) continue;
    const client = CLIENTS[entier(0, CLIENTS.length - 1)];
    transactions.push(
      ligne(iso(date), `${modele.libelle}, ${client}`, 'revenu', modele.compteId, entre(modele.min, modele.max), {
        tiers: client,
        source: 'facture',
      })
    );
  }

  for (const fixe of DEPENSES_FIXES) {
    const date = new Date(Date.UTC(moisDate.getUTCFullYear(), moisDate.getUTCMonth(), 2));
    if (date > AUJOURDHUI) continue;
    transactions.push(ligne(iso(date), fixe.libelle, 'depense', fixe.compteId, fixe.montant, { concilie: true }));
  }

  const nbVariables = entier(1, 3);
  for (let i = 0; i < nbVariables; i++) {
    const modele = DEPENSES_VARIABLES[entier(0, DEPENSES_VARIABLES.length - 1)];
    const date = new Date(Date.UTC(moisDate.getUTCFullYear(), moisDate.getUTCMonth(), entier(3, 26)));
    if (date > AUJOURDHUI) continue;
    transactions.push(ligne(iso(date), modele.libelle, 'depense', modele.compteId, entre(modele.min, modele.max)));
  }
}

for (const ponctuelle of DEPENSES_PONCTUELLES) {
  const moisDate = ajouterMois(MOIS_DEPART, ponctuelle.moisDecalage);
  const date = new Date(Date.UTC(moisDate.getUTCFullYear(), moisDate.getUTCMonth(), 15));
  if (date > AUJOURDHUI) continue;
  // Au-delà de 100 $, sans reçu déposé : sert la liste « À faire » de l'aperçu.
  transactions.push(ligne(iso(date), ponctuelle.libelle, 'depense', ponctuelle.compteId, ponctuelle.montant));
}

// Une transaction sans compte assigné, pour montrer la liste « À faire ».
transactions.push(
  ligne(iso(ajouterJours(AUJOURDHUI, -2)), 'Virement reçu, à catégoriser', 'revenu', 'ex-sans-compte', 275, {
    tiers: 'Studio Bruit Blanc',
    source: 'import',
    concilie: false,
  })
);

transactions.sort((a, b) => a.date.localeCompare(b.date));
export const EXEMPLE_TRANSACTIONS: Transaction[] = transactions;

// --- Factures (collection `documents`), pour la démo de l'âge des comptes clients ---

function facture(
  id: string,
  numero: string,
  clientName: string,
  clientEmail: string,
  joursDepasses: number,
  montantItem: number,
  status: DocumentStatus = 'Sent'
): Document {
  const dueDate = ajouterJours(AUJOURDHUI, -joursDepasses);
  return {
    id,
    number: numero,
    type: 'Invoice',
    clientId: id,
    clientName,
    clientEmail,
    date: iso(ajouterJours(dueDate, -15)),
    dueDate: iso(dueDate),
    items: [{ id: '1', description: 'Accompagnement stratégique', quantity: 1, price: montantItem }],
    status,
    terms: 'Paiement dû dans les 15 jours suivant réception.',
  };
}

export const EXEMPLE_FACTURES: Document[] = [
  facture('ex-fac-1', 'FAC-2026-101', 'Studio Bruit Blanc', 'info@studiobruitblanc.example', 12, 950),
  facture('ex-fac-2', 'FAC-2026-098', 'Festival Traces', 'codirection@festivaltraces.example', 45, 1200),
  facture('ex-fac-3', 'FAC-2026-091', 'Collectif Angle Mort', 'accueil@collectifanglemort.example', 75, 680),
  facture('ex-fac-4', 'FAC-2026-084', 'École nationale de théâtre', 'administration@ecoletheatre.example', 130, 1500),
  facture('ex-fac-5', 'FAC-2026-112', 'Maison de la culture Frontenac', 'culture@frontenac.example', -5, 900),
  facture('ex-fac-6', 'FAC-2026-115', 'Ville de Repentigny, Service culturel', 'service.culturel@repentigny.example', -20, 1100, 'Paid'),
];
