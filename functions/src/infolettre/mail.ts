import { defineSecret } from 'firebase-functions/params';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { PUBLIC_BASE_URL } from './renderer';

// ─── Transport SMTP ──────────────────────────────────────────────────────
// Resend par SMTP (domaine xenahorizon.com à vérifier chez Resend, DKIM +
// SPF). Secrets :
//   firebase functions:secrets:set RESEND_API_KEY
//   firebase functions:secrets:set RESEND_WEBHOOK_SECRET
//   firebase functions:secrets:set NEWSLETTER_POSTAL_ADDRESS   (loi anti-pourriel : jamais inventée)
export const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
export const NEWSLETTER_POSTAL_ADDRESS = defineSecret('NEWSLETTER_POSTAL_ADDRESS');
export const MAIL_SECRETS = [RESEND_API_KEY, NEWSLETTER_POSTAL_ADDRESS];

export const SENDER_EMAIL = 'infolettre@xenahorizon.com';
export const FROM_ADDR = `"Laurie Belhumeur · Xena Horizon" <${SENDER_EMAIL}>`;
export const REPLY_TO = 'laurie.belhumeur@gmail.com';
export const REGION = 'northamerica-northeast1';
const PROJECT_ID = () => process.env.GCLOUD_PROJECT || 'xena-70977';

export function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: { user: 'resend', pass: RESEND_API_KEY.value() },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
}

// Aucun courriel ne part avec un jeton vide : s'il manque sur la fiche, on le
// fabrique et on l'écrit avant d'envoyer.
export async function assurerJeton(ref: { update: (d: Record<string, unknown>) => Promise<unknown> } | null, actuel?: string | null): Promise<string> {
  if (actuel) return actuel;
  const jeton = randomBytes(18).toString('base64url');
  if (ref) { try { await ref.update({ unsubscribeToken: jeton }); } catch (e) { console.warn('[assurerJeton]', e); } }
  return jeton;
}

// La fonction desabonner elle-même sert la page de confirmation : pas de
// dépendance à une route du site public.
export function unsubscribeUrl(subscriberId: string, token: string): string {
  return `https://${REGION}-${PROJECT_ID()}.cloudfunctions.net/desabonner?s=${encodeURIComponent(subscriberId)}&t=${encodeURIComponent(token)}`;
}

export { PUBLIC_BASE_URL };
