// Vérifications du cœur comptable (lib/compta/) : parseur CSV sur trois formats réels de banques
// québécoises, parseur OFX, empreinte de dédoublonnage, split des taxes, idempotence de
// transactionsDepuisFactures. Assertions simples (node:assert), pas de framework.
//
// tsconfig.json n'est pas configuré pour l'exécution directe (moduleResolution: bundler, imports
// sans extension) : ce fichier se lance à travers esbuild, qui résout les imports TypeScript comme
// Vite le fait pour le reste du projet.
//   npx esbuild scripts/verif-compta.ts --bundle --platform=node --format=esm --outfile=/tmp/verif-compta.mjs && node /tmp/verif-compta.mjs
import assert from 'node:assert/strict';
import { apercuCsv, parseOfx, lignesDepuisApercu, empreinte, calculerTaxes, parseDateSouple } from '../lib/compta/import';
import { transactionsDepuisFactures } from '../lib/compta/transactions';
import type { Document as DocumentFacture } from '../types';
import type { Transaction } from '../lib/compta/types';

let ok = 0;
const echecs: string[] = [];

function verifie(nom: string, condition: boolean, detail?: string) {
  if (condition) {
    ok++;
  } else {
    echecs.push(detail ? `${nom} — ${detail}` : nom);
  }
}

// --- 1. CSV Desjardins (point-virgule, en-tête française, montants avec virgule décimale) ---
{
  const csv = [
    'Date;Description;Débit;Crédit',
    '2026-01-05;Paiement Bell Mobilité;65,00;',
    '2026-01-08;Dépôt Facture 1042 Compagnie de danse Fil Rouge;;500,00',
    '2026-01-12;Frais mensuels;6,95;',
  ].join('\n');
  const apercu = apercuCsv(csv);
  verifie('Desjardins : en-tête reconnue', apercu.colonnes.join('|') === ['Date', 'Description', 'Débit', 'Crédit'].join('|'), apercu.colonnes.join('|'));
  verifie('Desjardins : 3 lignes détectées', apercu.lignes.length === 3, `${apercu.lignes.length}`);
  verifie('Desjardins : colonne date détectée', apercu.detection.date === 0);
  verifie('Desjardins : colonne débit détectée', apercu.detection.debit === 2);
  verifie('Desjardins : colonne crédit détectée', apercu.detection.credit === 3);
  const lignes = lignesDepuisApercu(apercu, apercu.detection);
  verifie('Desjardins : 3 lignes normalisées', lignes.length === 3, `${lignes.length}`);
  verifie('Desjardins : débit devient négatif', lignes[0].montant === -65, `${lignes[0].montant}`);
  verifie('Desjardins : crédit reste positif', lignes[1].montant === 500, `${lignes[1].montant}`);
  verifie('Desjardins : virgule décimale lue', lignes[2].montant === -6.95, `${lignes[2].montant}`);
  verifie('Desjardins : date ISO conservée', lignes[0].date === '2026-01-05', lignes[0].date);
}

// --- 2. CSV RBC (virgule, en-tête anglaise, montant déjà signé dans CAD$, dates MM/JJ/AAAA) ---
{
  const csv = [
    'Account Type,Transaction Date,Description 1,CAD$',
    'Chequing,01/05/2026,ADOBE SYSTEMS,-32.99',
    'Chequing,01/08/2026,DEPOSIT CLIENT ABC,500.00',
  ].join('\n');
  const apercu = apercuCsv(csv);
  verifie('RBC : colonne montant détectée (CAD$)', apercu.detection.montant === 3, `${apercu.detection.montant}`);
  verifie('RBC : colonne description détectée', apercu.detection.description === 2);
  const lignes = lignesDepuisApercu(apercu, apercu.detection);
  verifie('RBC : 2 lignes normalisées', lignes.length === 2, `${lignes.length}`);
  verifie('RBC : montant négatif lu tel quel', lignes[0].montant === -32.99, `${lignes[0].montant}`);
  verifie('RBC : date MM/JJ/AAAA convertie', lignes[0].date === '2026-01-05', lignes[0].date);
}

// --- 3. CSV BNC (sans en-tête : la détection ne devine rien, Laurie choisit les colonnes elle-même) ---
{
  const csv = ['2026-02-13,Retrait guichet,60.00,,', '2026-02-14,Virement reçu,,220.00,'].join('\n');
  const apercu = apercuCsv(csv);
  verifie('BNC : aucune en-tête, colonnes nommées par défaut', apercu.colonnes[0] === 'Colonne 1', apercu.colonnes[0]);
  verifie('BNC : aucune ligne perdue (2 lignes de données)', apercu.lignes.length === 2, `${apercu.lignes.length}`);
  verifie('BNC : détection automatique ne devine rien sans en-tête', apercu.detection.date === -1 && apercu.detection.montant === -1);
  // Laurie choisit les colonnes à la main dans Import.tsx : on simule son choix.
  const lignes = lignesDepuisApercu(apercu, { date: 0, description: 1, debit: 2, credit: 3, montant: -1 });
  verifie('BNC : après choix manuel, débit et crédit combinés correctement', lignes[0].montant === -60 && lignes[1].montant === 220, `${lignes[0].montant} / ${lignes[1].montant}`);
}

// --- 4. Format de date ambigu : le mois > 12 révèle un JJ/MM/AAAA plutôt qu'un MM/JJ/AAAA ---
{
  verifie('Date 13/02/2026 (JJ/MM, le 13 ne peut pas être un mois)', parseDateSouple('13/02/2026') === '2026-02-13', parseDateSouple('13/02/2026') ?? 'null');
  verifie('Date 02/13/2026 (même date, ordre inverse)', parseDateSouple('02/13/2026') === '2026-02-13', parseDateSouple('02/13/2026') ?? 'null');
}

// --- 5. OFX/QFX (balises SGML sans fermeture systématique) ---
{
  const ofx = `
OFXHEADER:100
<OFX><BANKMSGSRSV1><STMTTRNRS><STMTRS><BANKTRANLIST>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260305120000[-5:EST]
<TRNAMT>-42.50
<NAME>STRIPE
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20260308
<TRNAMT>350.00
<MEMO>Facture Studio Ancrage
</STMTTRN>
</BANKTRANLIST></STMTRS></STMTRNRS></BANKMSGSRSV1></OFX>`.trim();
  const lignes = parseOfx(ofx);
  verifie('OFX : 2 transactions extraites', lignes.length === 2, `${lignes.length}`);
  verifie('OFX : date avec heure et fuseau tronquée à AAAA-MM-JJ', lignes[0].date === '2026-03-05', lignes[0].date);
  verifie('OFX : montant négatif (débit)', lignes[0].montant === -42.5, `${lignes[0].montant}`);
  verifie('OFX : NAME utilisé comme description', lignes[0].description === 'STRIPE', lignes[0].description);
  verifie('OFX : MEMO en secours si NAME absent', lignes[1].description === 'Facture Studio Ancrage', lignes[1].description);
  verifie('OFX : montant positif (crédit)', lignes[1].montant === 350, `${lignes[1].montant}`);
}

// --- 6. Empreinte de dédoublonnage : stable, insensible à la casse, tronquée à 60 caractères de description ---
{
  const a = { date: '2026-03-05', description: 'Stripe', montant: -42.5 };
  const b = { date: '2026-03-05', description: 'STRIPE  ', montant: -42.5 };
  const c = { date: '2026-03-05', description: 'Stripe', montant: -42.51 };
  verifie('Empreinte : insensible à la casse et aux espaces', empreinte(a) === empreinte(b), `${empreinte(a)} / ${empreinte(b)}`);
  verifie('Empreinte : un cent d\'écart change l\'empreinte', empreinte(a) !== empreinte(c));
}

// --- 7. Split des taxes : l'exemple exact de la mission (100 $ total, TPS 5 %, TVQ 9,975 %) ---
{
  const split = calculerTaxes(100, { depuisTotal: true });
  // Convention d'arrondi : chaque composante est arrondie indépendamment au cent (voir format.ts,
  // arrondiSous) ; leur somme peut s'écarter d'un cent du total d'origine, qui reste la valeur de
  // référence (celle du relevé bancaire). Ici : 86,98 + 4,35 + 8,68 = 100,01, un cent au-dessus des
  // 100 $ d'origine — écart attendu et sans conséquence, le total inscrit prime.
  verifie('Split 100 $ : montant avant taxes = 86,98 $', split.montant === 86.98, `${split.montant}`);
  verifie('Split 100 $ : TPS = 4,35 $', split.tps === 4.35, `${split.tps}`);
  verifie('Split 100 $ : TVQ = 8,68 $', split.tvq === 8.68, `${split.tvq}`);
  verifie('Split 100 $ : total conservé = 100 $', split.total === 100, `${split.total}`);

  const sansTaxes = calculerTaxes(50, { sansTaxes: true });
  verifie('Split « sans taxes » : TPS et TVQ à zéro', sansTaxes.tps === 0 && sansTaxes.tvq === 0 && sansTaxes.montant === 50);

  const depuisAvantTaxes = calculerTaxes(86.98);
  verifie('Split depuis un montant déjà avant taxes : total ≈ 100 $', Math.abs(depuisAvantTaxes.total - 100) < 0.02, `${depuisAvantTaxes.total}`);
}

// --- 8. Idempotence de transactionsDepuisFactures : deux passes sur les mêmes factures ne dupliquent rien ---
{
  const documents: DocumentFacture[] = [
    { id: 'fact-1', type: 'Invoice', status: 'Paid', date: '2026-02-01', number: 'F-001', clientName: 'Studio Ancrage', items: [{ quantity: 1, price: 500 }] } as DocumentFacture,
    { id: 'fact-2', type: 'Invoice', status: 'Pending', date: '2026-02-05', number: 'F-002', clientName: 'Marie-Ève Boutin', items: [{ quantity: 2, price: 100 }] } as DocumentFacture,
    { id: 'fact-3', type: 'Invoice', status: 'Paid', date: '2026-02-10', number: 'F-003', clientName: 'Festival des Cimes', items: [{ quantity: 1, price: 900 }] } as DocumentFacture,
  ];
  const premierePasse = transactionsDepuisFactures(documents);
  verifie('Idempotence : seules les factures payées sont dérivées (2 sur 3)', premierePasse.length === 2, `${premierePasse.length}`);
  verifie('Idempotence : identifiant stable facture_<id>', premierePasse[0].id === 'facture_fact-1', premierePasse[0].id);

  const transactionsExistantes = premierePasse.map((p) => ({ ...p, cree: null, modifie: null }) as Transaction);
  const deuxiemePasse = transactionsDepuisFactures(documents);
  verifie('Idempotence : la deuxième passe reproduit les mêmes identifiants (rien de nouveau à écrire)', deuxiemePasse.every((d) => transactionsExistantes.some((t) => t.id === d.id)));
  verifie('Idempotence : toujours 2 candidates, jamais plus (pas de doublon créé)', deuxiemePasse.length === 2, `${deuxiemePasse.length}`);
  verifie('Idempotence : le montant avant taxes vient des items (500 $)', premierePasse[0].montant === 500, `${premierePasse[0].montant}`);
}

console.log(`${ok} vérifications passées.`);
if (echecs.length) {
  console.log(`${echecs.length} échec(s) :`);
  for (const e of echecs) console.log(`  ❌ ${e}`);
  process.exit(1);
} else {
  console.log('Tout passe.');
}
