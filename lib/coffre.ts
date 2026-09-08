/**
 * Le coffre pour Vexel : les informations que Laurie dépose pour Alex (carte, facturation, accès) afin qu'il
 * ouvre à son nom les abonnements dont le site a besoin (Google Cloud pour Blaze, Resend, Stripe).
 *
 * Chiffrement de bout en bout, dans le navigateur, avant tout envoi : une clé AES-256-GCM tirée au hasard
 * chiffre le contenu, puis cette clé est scellée (RSA-OAEP, SHA-256) avec la clé publique de Vexel ci-dessous.
 * La moitié privée vit uniquement sur l'ordinateur d'Alex (~/.config/xena/coffre-prive.pem) : ni le site,
 * ni Firestore, ni Google ne peuvent lire le contenu. Firestore ne garde que le texte chiffré et un résumé
 * (nom sur la carte, quatre derniers chiffres, expiration) pour que Laurie voie ce qu'elle a déposé.
 * Lecture côté Alex : scripts/coffre-lire.mjs.
 */
import { serverTimestamp } from 'firebase/firestore';

export const CHEMIN_COFFRE = 'coffre/laurie';

/** Clé publique de Vexel (RSA 4096, générée le 8 septembre 2026). Publique par nature : elle ne sert qu'à sceller. */
export const CLE_PUBLIQUE_VEXEL: JsonWebKey = {"kty":"RSA","n":"nL1ux6JRtftu6v_jdyhah8jLKr5axnSr6AmVaiZ61HTK80Ls5ovy_FjQu4QfBYOgYjCeIFEmB6UBiuzIM_gfNjc-bcUUzbryxxj27LpZlrjxATwS0gqvxik8E5qVVum1hJ_D3Dn50QLZaxrrJPrVGfE4TCYYs2YZcXEb4wV1sFe16XNjvdSU4i_SNsiR7l8rZ51j0xYMPjgfO0-BFo6azXhUKphInXF0Ie6T108BHIffh3DZC_jeC1A4rRjlqv3ga-EZN0IHNVpncADaYOAyL_aFUg7ndBXReA4gRlh6Zje9LUP9hFB3Ng05uonZfCLMaC7T-iiuUxAk8zrvUz4qyJXAS4B8RB3FXUwAWAgQ2m_O4S0SvxPF9k9wrIaGb47EC1Mv9Q24ge3eIe6X4MgQP1f0LmyBdGJAZQb6FrT5TbjMZfT_igg2eu1tR8-F-nbDEhdUZqEDSXHeqd6uWaOvPFD1k8ikac_IoAGtDklvKtdvqlRHr3Cv_uU9DnXsPuLhNaHE182e9TMDTsLBaLmL4_HogC3neswnpS_nDZaIzjQwh6nmP5q5_GKxNW6ym19LpFgGtSet61ua8z7YsvSNVMWJlDXiXr4PkqxEes9ocCGRiLE8WBP4SUXhhXvNgvLAmaS9hfOzC-kvdw25eRdiBSRfKTPxE92k9yhbRBgKdwk","e":"AQAB"};

export interface ContenuCoffre {
  nomCarte: string;
  numero: string;
  expiration: string;      // MM/AA
  cvv: string;
  adresse: string;
  ville: string;
  province: string;
  codePostal: string;
  telephone: string;
  courrielFacturation: string;
  notes: string;
}

export interface CoffreScelle {
  v: 1;
  cle: string;       // clé AES scellée par RSA-OAEP, base64
  iv: string;        // 12 octets, base64
  donnees: string;   // AES-GCM (texte chiffré + étiquette), base64
  resume: { nomCarte: string; derniers4: string; expiration: string };
  deposeLe: unknown;
  parCourriel: string;
  luLe?: unknown;
}

const b64 = (buf: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buf)));

export const numeroPropre = (numero: string): string => numero.replace(/[^0-9]/g, '');

/** Chiffre le contenu dans le navigateur. Rien ne part en clair. */
export async function sceller(contenu: ContenuCoffre, parCourriel: string): Promise<CoffreScelle> {
  const subtle = window.crypto.subtle;
  const clePublique = await subtle.importKey('jwk', CLE_PUBLIQUE_VEXEL, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['wrapKey']);
  const cleAes = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const clair = new TextEncoder().encode(JSON.stringify({ ...contenu, numero: numeroPropre(contenu.numero) }));
  const donnees = await subtle.encrypt({ name: 'AES-GCM', iv }, cleAes, clair);
  const cleScellee = await subtle.wrapKey('raw', cleAes, clePublique, { name: 'RSA-OAEP' });
  const chiffres = numeroPropre(contenu.numero);
  return {
    v: 1,
    cle: b64(cleScellee),
    iv: b64(iv.buffer),
    donnees: b64(donnees),
    resume: { nomCarte: contenu.nomCarte.trim(), derniers4: chiffres.slice(-4), expiration: contenu.expiration.trim() },
    deposeLe: serverTimestamp(),
    parCourriel,
  };
}

/** Vérification de Luhn : attrape une faute de frappe avant de sceller. */
export function luhnValide(numero: string): boolean {
  const n = numeroPropre(numero);
  if (n.length < 13 || n.length > 19) return false;
  let somme = 0;
  let double = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let c = Number(n[i]);
    if (double) {
      c *= 2;
      if (c > 9) c -= 9;
    }
    somme += c;
    double = !double;
  }
  return somme % 10 === 0;
}
