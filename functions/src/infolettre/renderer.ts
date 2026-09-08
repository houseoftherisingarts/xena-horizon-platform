// Rendu HTML des infolettres composées dans l'admin (blocs). Aucune
// dépendance React : ce fichier tourne dans une Cloud Function.
// Port du moteur de Krystine (functions/src/newsletter/renderer.ts), avec la
// marque Xena Horizon : papier chaud + encre, Playfair Display / Figtree,
// site https://xenahorizon.com. Aucune adresse postale ni aucun visuel n'est
// inventé : la charte reprend les tokens du canon v2 (index.css), rien de plus.

export const PUBLIC_BASE_URL = 'https://xenahorizon.com';

export type BlockType = 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'quote' | 'cta' | 'spacer' | 'list';

export interface NewsletterBlock {
  type: BlockType;
  content?: Record<string, any>;
}

export const CHARTE = {
  papier: '#f6f1e9',
  encre: '#211d18',
  rose: '#b3665a',
  gris: '#6e655b',
  serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

export type Couverture = 'image' | 'aucune';
export type Lang = 'fr' | 'en';

export interface Bandeau {
  etiquette?: string;
  fond?: string;
  texte?: string;
  image?: string | null;
  masque?: boolean;
}

const SEPARATEURS: Record<string, string> = { points: '&bull;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&bull;', fleuron: '&#10086;', etoiles: '&#10022;&nbsp;&nbsp;&#10022;&nbsp;&nbsp;&#10022;', feuille: '&#10087;' };

const MOTS: Record<Lang, { etiquette: string; desabonner: string; politique: string }> = {
  fr: { etiquette: 'Infolettre', desabonner: 'Se désabonner', politique: 'Politique de confidentialité' },
  en: { etiquette: 'Newsletter', desabonner: 'Unsubscribe', politique: 'Privacy policy' },
};

const POLICES: Record<string, string> = {
  serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};
const TAILLES: Record<string, number> = { sm: 14, md: 16, lg: 18, xl: 21 };

function couleur(v: unknown, defaut: string): string {
  return typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v) ? v : defaut;
}

// Fond du corps de la lettre : la palette du site (papier par défaut). Sur un
// fond sombre, texte clair et accent rose plus pâle, sans réglage de plus.
function estSombre(hex: string): boolean {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return false;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.35;
}
interface Palette { fond: string; ink: string; muted: string; accent: string; sombre: boolean }
function palette(fond?: string | null): Palette {
  const f = couleur(fond, CHARTE.papier);
  const sombre = estSombre(f);
  return sombre
    ? { fond: f, ink: '#f6f1e9', muted: 'rgba(246,241,233,0.78)', accent: '#d98d80', sombre }
    : { fond: f, ink: CHARTE.encre, muted: 'rgba(33,29,24,0.72)', accent: CHARTE.rose, sombre };
}
const PALETTE_CLAIRE = palette(CHARTE.papier);

// Pièce inline : la signature texte de Laurie n'est pas une image (aucun
// actif fourni), donc rien à joindre. Fonction gardée pour miroir du contrat.
export function newsletterAttachments(_opts: Pick<RenderEmailOptions, 'couvertureUrl'> = {}): { filename: string; href: string; cid: string }[] {
  return [];
}

export function inlineForPreview(html: string): string {
  return html;
}

export interface RenderEmailOptions {
  subject: string;
  preheader?: string;
  unsubscribeUrl: string;
  postalAddress: string;
  firstName?: string;
  /** En-tête : une image fournie par Laurie (couvertureUrl), ou rien (défaut). */

/** Seules les adresses https ou http passent dans un lien : jamais javascript:, data: ni autre schéma. */
const hrefSur = (h?: string): string => (/^https?:\/\//i.test((h || '').trim()) ? (h as string).trim() : '#');
  couverture?: Couverture;
  couvertureUrl?: string | null;
  /** Signature texte « Laurie Belhumeur » au bas du corps. Défaut : vrai. */
  signature?: boolean;
  lang?: Lang;
  bandeau?: Bandeau | null;
  fond?: string | null;
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function personalize(text: string, firstName?: string): string {
  return text.replace(/ ?\{\{\s*firstName\s*\}\}/g, firstName ? ` ${firstName}` : '');
}

function nl2br(s: string): string {
  return s.replace(/\r?\n/g, '<br />');
}

// Texte riche léger : <b>, <i>, <u>, <a href="https://…">. Tout est échappé
// d'abord, puis ces seules balises sont rendues.
function richToHtml(text: string, accent: string = CHARTE.rose): string {
  return esc(text)
    .replace(/&lt;(\/?)(b|i|u)&gt;/g, '<$1$2>')
    .replace(/&lt;a href=&quot;(https?:\/\/[^&]*?)&quot;&gt;/g, `<a href="$1" target="_blank" style="color:${accent};text-decoration:underline;">`)
    .replace(/&lt;\/a&gt;/g, '</a>');
}
function stripRich(text: string): string {
  return String(text ?? '').replace(/<\/?(b|i|u)>/g, '').replace(/<a href="[^"]*">/g, '').replace(/<\/a>/g, '');
}

function blockToEmail(block: NewsletterBlock, firstName?: string, pal: Palette = PALETTE_CLAIRE): string {
  const c = (block.content || {}) as any;
  switch (block.type) {
    case 'heading': {
      const level = Number(c.level) || 1;
      const align = c.align === 'center' ? 'center' : 'left';
      const fontSize = level === 1 ? '32px' : level === 2 ? '26px' : '22px';
      const text = personalize(esc(c.text || ''), firstName);
      const police = POLICES[c.police] || CHARTE.serif;
      return `<tr><td align="${align}" style="padding:18px 0 10px;font-family:${police};font-size:${fontSize};line-height:1.15;color:${pal.ink};font-weight:500;">${text}</td></tr>`;
    }
    case 'paragraph': {
      const align = c.align === 'center' ? 'center' : 'left';
      const text = nl2br(personalize(richToHtml(c.text || '', pal.accent), firstName));
      const police = POLICES[c.police] || CHARTE.sans;
      const px = TAILLES[c.taille] || 16;
      return `<tr><td align="${align}" style="padding:0 0 18px;font-family:${police};font-size:${px}px;line-height:1.75;color:${pal.ink};">${text}</td></tr>`;
    }
    case 'image': {
      if (!c.url) return '';
      const caption = c.caption
        ? `<tr><td align="center" style="padding:8px 0 4px;font-family:${CHARTE.sans};font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${pal.accent};">${esc(c.caption)}</td></tr>`
        : '';
      const lien = typeof c.href === 'string' && /^https?:\/\//.test(c.href) ? c.href : PUBLIC_BASE_URL;
      return `<tr><td style="padding:10px 0 12px;"><a href="${esc(lien)}" target="_blank" style="display:block;text-decoration:none;"><img src="${esc(c.url)}" alt="${esc(c.alt || '')}" style="display:block;width:100%;max-width:520px;height:auto;border-radius:15px;border:0;" /></a></td></tr>${caption}`;
    }
    case 'button': {
      const primary = c.variant !== 'secondary';
      const style = primary
        ? `background:${CHARTE.rose};color:#fff;`
        : `border:1px solid ${CHARTE.rose};color:${pal.accent};`;
      return `<tr><td style="padding:6px 0 22px;">
        <a href="${esc(hrefSur(c.href))}" target="_blank" style="display:inline-block;padding:15px 28px;border-radius:999px;font-family:${CHARTE.sans};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;${style}">${esc(c.label || 'En savoir plus')}</a>
      </td></tr>`;
    }
    case 'divider': {
      const st = c.style || 'ligne';
      if (st === 'pleine') return `<tr><td style="padding:10px 0 24px;"><div style="height:1px;background:linear-gradient(90deg,transparent,${CHARTE.rose},transparent);"></div></td></tr>`;
      const g = SEPARATEURS[st];
      if (!g) return `<tr><td style="padding:10px 0 24px;"><div style="height:1px;width:64px;background:${CHARTE.rose};"></div></td></tr>`;
      return `<tr><td style="padding:10px 0 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td valign="middle"><div style="height:1px;background:linear-gradient(90deg,transparent,${CHARTE.rose});"></div></td>
          <td width="120" align="center" valign="middle" style="font-family:${CHARTE.serif};font-size:22px;line-height:1;color:${CHARTE.rose};padding:0 12px;white-space:nowrap;">${g}</td>
          <td valign="middle"><div style="height:1px;background:linear-gradient(270deg,transparent,${CHARTE.rose});"></div></td>
        </tr></table>
      </td></tr>`;
    }
    case 'list': {
      const police = POLICES[c.police] || CHARTE.sans;
      const px = TAILLES[c.taille] || 16;
      const numero = c.style === 'numero';
      const items = String(c.text || '').split(/\r?\n/).filter((l: string) => l.trim());
      if (!items.length) return '';
      const rows = items.map((l: string, i: number) => `<tr>
          <td width="22" valign="top" style="padding:0 0 8px;font-family:${police};font-size:${px}px;line-height:1.6;color:${pal.accent};">${numero ? `${i + 1}.` : '&bull;'}</td>
          <td valign="top" style="padding:0 0 8px;font-family:${police};font-size:${px}px;line-height:1.6;color:${pal.ink};">${personalize(richToHtml(l, pal.accent), firstName)}</td>
        </tr>`).join('');
      return `<tr><td style="padding:0 0 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`;
    }
    case 'quote':
      return `<tr><td style="padding:6px 0 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="border-left:2px solid ${CHARTE.rose};padding-left:18px;font-family:${CHARTE.serif};font-size:20px;line-height:1.45;color:${pal.accent};">
            «&nbsp;${personalize(esc(c.text || ''), firstName)}&nbsp;»
            ${c.attribution ? `<div style="margin-top:10px;font-family:${CHARTE.sans};font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${pal.accent};">${esc(c.attribution)}</div>` : ''}
          </td>
        </tr></table>
      </td></tr>`;
    case 'cta':
      return `<tr><td style="padding:6px 0 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CHARTE.encre};border-radius:15px;border:1px solid rgba(179,102,90,${pal.sombre ? '0.45' : '0.15'});">
          <tr><td style="padding:30px 32px;">
            ${c.eyebrow ? `<div style="font-family:${CHARTE.sans};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:${CHARTE.rose};margin-bottom:12px;font-weight:600;">${esc(c.eyebrow)}</div>` : ''}
            ${c.title ? `<div style="font-family:${CHARTE.serif};font-size:28px;line-height:1.1;color:${CHARTE.papier};margin-bottom:12px;">${esc(c.title)}</div>` : ''}
            ${c.body ? `<div style="font-family:${CHARTE.sans};font-size:14px;line-height:1.7;color:rgba(246,241,233,0.7);margin-bottom:22px;">${nl2br(esc(c.body))}</div>` : ''}
            ${(c.href && c.buttonLabel) ? `<a href="${esc(c.href)}" target="_blank" style="display:inline-block;background:${CHARTE.rose};color:#fff;font-family:${CHARTE.sans};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:15px 28px;border-radius:999px;">${esc(c.buttonLabel)}</a>` : ''}
          </td></tr>
        </table>
      </td></tr>`;
    case 'spacer': {
      const h = c.size === 'lg' ? 48 : c.size === 'sm' ? 10 : 24;
      return `<tr><td style="height:${h}px;line-height:${h}px;font-size:0;">&nbsp;</td></tr>`;
    }
    default:
      return '';
  }
}

export function renderEmailHtml(blocks: NewsletterBlock[], opts: RenderEmailOptions): string {
  const pal = palette(opts.fond);
  const blockRows = blocks.map(b => blockToEmail(b, opts.firstName, pal)).join('\n');
  const couverture: Couverture = opts.couverture === 'image' && opts.couvertureUrl ? 'image' : 'aucune';
  const showCover = couverture !== 'aucune';
  const lang: Lang = opts.lang === 'en' ? 'en' : 'fr';
  const mots = MOTS[lang];
  const bandeau = opts.bandeau || {};
  const fond = couleur(bandeau.fond, CHARTE.encre);
  const texte = couleur(bandeau.texte, CHARTE.papier);
  const etiquette = (bandeau.etiquette ?? '').trim() || mots.etiquette;
  const showBandeau = !bandeau.masque;
  const image = typeof bandeau.image === 'string' && /^https?:\/\//.test(bandeau.image) ? bandeau.image : '';
  const fondBandeau = image ? `${fond} url('${esc(image)}') center / cover no-repeat` : fond;

  return `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${esc(opts.subject)}</title></head>
<body style="margin:0;padding:0;background:${CHARTE.papier};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;color:transparent;line-height:1px;">${esc(opts.preheader || '')}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CHARTE.papier};padding:36px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">

        ${showCover ? `<tr><td style="padding:0;border-radius:15px 15px 0 0;overflow:hidden;background:${fond};">
          <a href="${PUBLIC_BASE_URL}" target="_blank" style="display:block;text-decoration:none;"><img src="${esc(opts.couvertureUrl)}" width="600" alt="${esc(opts.subject)}" style="display:block;width:100%;max-width:600px;height:auto;border-radius:15px 15px 0 0;border:0;" /></a>
        </td></tr>` : ''}

        ${showBandeau ? `<tr><td background="${image}" bgcolor="${fond}" style="background:${fondBandeau};padding:0;${showCover ? '' : 'border-radius:15px 15px 0 0;'}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"${image ? ` style="background:rgba(33,29,24,0.55);"` : ''}>
            <tr><td style="padding:30px 40px 0;font-family:${CHARTE.sans};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:${CHARTE.rose};font-weight:600;">${esc(etiquette)}</td></tr>
            <tr><td style="padding:18px 40px 20px;font-family:${CHARTE.serif};font-size:34px;line-height:1.08;color:${texte};font-weight:500;">${esc(opts.subject)}</td></tr>
            <tr><td style="padding:0 40px 28px;"><div style="height:1px;width:64px;background:${CHARTE.rose};"></div></td></tr>
          </table>
        </td></tr>` : ''}

        <tr><td bgcolor="${pal.fond}" style="background:${pal.fond};padding:40px 40px 14px;${showCover || showBandeau ? '' : 'border-radius:15px 15px 0 0;border-top:1px solid rgba(33,29,24,0.08);'}border-left:1px solid rgba(33,29,24,0.08);border-right:1px solid rgba(33,29,24,0.08);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${blockRows}
            ${opts.signature !== false ? `<tr><td style="padding:16px 0 8px;font-family:${CHARTE.serif};font-size:20px;color:${pal.ink};">Laurie Belhumeur</td></tr>` : ''}
          </table>
        </td></tr>

        <tr><td style="background:${CHARTE.papier};padding:26px 40px 8px;border-radius:0 0 15px 15px;border:1px solid rgba(33,29,24,0.08);border-top:0;font-family:${CHARTE.sans};font-size:11px;line-height:1.6;color:rgba(33,29,24,0.6);">
          <div style="margin-bottom:8px;">${esc(opts.postalAddress)}</div>
          <div style="padding-bottom:18px;"><a href="${esc(opts.unsubscribeUrl)}" style="color:${CHARTE.rose};text-decoration:underline;">${mots.desabonner}</a> · <a href="${PUBLIC_BASE_URL}" style="color:${CHARTE.rose};text-decoration:underline;">${mots.politique}</a></div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderEmailText(blocks: NewsletterBlock[], opts: RenderEmailOptions): string {
  const lines: string[] = [];
  for (const b of blocks) {
    const c = (b.content || {}) as any;
    switch (b.type) {
      case 'heading':
      case 'paragraph':
      case 'quote':
        if (c.text) lines.push(personalize(stripRich(c.text), opts.firstName));
        break;
      case 'button':
        if (c.label && c.href) lines.push(`${c.label} : ${c.href}`);
        break;
      case 'cta':
        if (c.title) lines.push(c.title);
        if (c.body) lines.push(c.body);
        if (c.href && c.buttonLabel) lines.push(`${c.buttonLabel} : ${c.href}`);
        break;
      case 'divider':
        lines.push('---');
        break;
      case 'list':
        lines.push(String(c.text || '').split(/\r?\n/).filter((l: string) => l.trim()).map((l: string, i: number) => `${c.style === 'numero' ? `${i + 1}.` : '-'} ${stripRich(l)}`).join('\n'));
        break;
    }
  }
  if (opts.signature !== false) lines.push('Laurie Belhumeur');
  lines.push('', opts.postalAddress, `${MOTS[opts.lang === 'en' ? 'en' : 'fr'].desabonner} : ${opts.unsubscribeUrl}`);
  return lines.join('\n\n');
}
