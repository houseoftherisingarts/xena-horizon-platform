// Contrat de la facturation brandée : réglages de l'entreprise, calcul des taxes, jeton public
// et miroir Firestore que lit la page /facture/{jeton}. Voir components/admin/factures/DocumentFacture.tsx
// pour le rendu et pages/FacturePublique.tsx pour la page publique.
import type { Document, DocumentType, InvoiceItem } from '../types';
import { patchDoc, writeDoc } from './firestore';
import { COORDONNEES } from './contenu';

export interface ParametresFacturation {
  nomLegal: string;
  adresse: string;
  neq: string;
  tps: string;
  tvq: string;
  modalites: string;
  note: string;
  courriel: string;
  lienPaiementStripe: string;
}

export const DEFAULT_TERMS =
  "1. Paiement : un acompte de 50 % est requis à la signature. La balance est due à la livraison finale.\n2. Validité : ce devis est valide pour une période de 30 jours.\n3. Retard : tout retard de paiement de plus de 30 jours entraîne des frais d'intérêt de 2 % par mois.\n4. Propriété : les livrables restent la propriété de Xena Horizon jusqu'au paiement complet.";

export const FACTURATION_PAR_DEFAUT: ParametresFacturation = {
  nomLegal: 'Laurie Belhumeur',
  adresse: '',
  neq: '',
  tps: '',
  tvq: '',
  modalites: DEFAULT_TERMS,
  note: 'Merci de votre confiance.',
  courriel: COORDONNEES.courriel,
  lienPaiementStripe: '',
};

export interface Totaux {
  sousTotal: number;
  tps: number;
  tvq: number;
  total: number;
}

/** Pas de numéro de taxe inscrit dans les réglages, pas de ligne de taxe : la taxe suit ce que Laurie a vraiment déclaré. */
export function calculerTotaux(items: InvoiceItem[], parametres: Pick<ParametresFacturation, 'tps' | 'tvq'>): Totaux {
  const sousTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tps = parametres.tps ? sousTotal * 0.05 : 0;
  const tvq = parametres.tvq ? sousTotal * 0.09975 : 0;
  return { sousTotal, tps, tvq, total: sousTotal + tps + tvq };
}

/** Le miroir public : tout ce qu'il faut pour afficher et payer la facture, rien de privé au-delà. */
export interface FacturePubliqueDoc {
  documentId: string;
  numero: string;
  type: DocumentType;
  date: string;
  dueDate: string | null;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  totaux: Totaux;
  statut: string;
  modalites: string;
  note: string;
  vendeur: { nomLegal: string; adresse: string; neq: string; tps: string; tvq: string; courriel: string };
  lienPaiementStripe: string;
  publieLe: string;
}

/** 32 caractères base64url tirés de l'aléatoire cryptographique du navigateur : imprévisible, jamais séquentiel. */
export function jetonAleatoire(): string {
  const octets = new Uint8Array(24);
  crypto.getRandomValues(octets);
  let binaire = '';
  octets.forEach((o) => { binaire += String.fromCharCode(o); });
  return btoa(binaire).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function lienFacturePublique(jeton: string): string {
  return `${window.location.origin}/facture/${jeton}`;
}

/**
 * Publie un document : crée le jeton s'il n'existe pas encore, écrit (ou remplace) le miroir public
 * avec les montants figés au moment de la publication, et renvoie le jeton.
 */
export async function publierFacture(doc: Document, parametres: ParametresFacturation): Promise<string> {
  const jeton = doc.jetonPublic || jetonAleatoire();
  const totaux = calculerTotaux(doc.items, parametres);
  const miroir: FacturePubliqueDoc = {
    documentId: doc.id,
    numero: doc.number,
    type: doc.type,
    date: doc.date,
    dueDate: doc.dueDate || null,
    clientName: doc.clientName,
    clientEmail: doc.clientEmail,
    items: doc.items,
    totaux,
    statut: doc.status,
    modalites: doc.terms,
    note: parametres.note,
    vendeur: {
      nomLegal: parametres.nomLegal,
      adresse: parametres.adresse,
      neq: parametres.neq,
      tps: parametres.tps,
      tvq: parametres.tvq,
      courriel: parametres.courriel,
    },
    lienPaiementStripe: parametres.lienPaiementStripe,
    publieLe: new Date().toISOString(),
  };
  await writeDoc('factures_publiques', jeton, miroir);
  if (!doc.jetonPublic) {
    await patchDoc<Document>('documents', doc.id, { jetonPublic: jeton });
  }
  return jeton;
}

/** Recopie un changement de statut (payée, envoyée...) sur le miroir public, quand la facture a déjà un jeton. */
export async function synchroniserStatutPublic(jeton: string | undefined, statut: string): Promise<void> {
  if (!jeton) return;
  await patchDoc('factures_publiques', jeton, { statut });
}

/**
 * Tente d'ajouter la référence de la facture au lien de paiement Stripe configuré. Un lien de paiement
 * Stripe à prix fixe ne permet pas de changer le montant par l'adresse : ce que ce lien accepte vraiment,
 * c'est le courriel du client et une référence de suivi. Laurie doit choisir ou créer un lien qui
 * correspond déjà au montant de cette facture; le montant exact ne sera automatique qu'avec la fonction
 * Stripe Checkout (functions/src/factures/paiement.ts), qui attend le passage au forfait Blaze.
 */
export function lienPaiementAvecReference(lien: string, facture: Pick<FacturePubliqueDoc, 'numero' | 'clientEmail'>): string {
  if (!lien) return lien;
  try {
    const url = new URL(lien);
    url.searchParams.set('client_reference_id', facture.numero);
    if (facture.clientEmail) url.searchParams.set('prefilled_email', facture.clientEmail);
    return url.toString();
  } catch {
    return lien;
  }
}
