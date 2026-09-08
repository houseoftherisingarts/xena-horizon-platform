/**
 * Le rendu courriel de l'infolettre : HTML autonome, table-in-table, sans dépendance au CSS du site.
 * Compagnon de lib/infolettre/renderer.tsx (rendu web) : mêmes blocs, deux sorties. Les messageries
 * (Gmail en tête) retirent le <style>, ignorent le flexbox et rejettent le CSS non attaché : tout
 * ci-dessous est en style en ligne. Sans JS. Les hex sont documentés dans BRAND (renderer.tsx) et
 * permis ici : le HTML d'un courriel ne lit pas les jetons CSS du site.
 */
import { BRAND, richToHtml, stripRich, type BandeauInfolettre, type NewsletterBlock } from './renderer';

/** Seules les adresses https ou http passent dans un lien : jamais javascript:, data: ni autre schéma. */
const hrefSur = (h?: string): string => (/^https?:\/\//i.test((h || '').trim()) ? (h as string).trim() : '#');


export interface RenderEmailOptions {
  subject: string;
  preheader?: string;
  unsubscribeUrl: string;
  postalAddress: string; // vide tant qu'elle n'est pas connue : jamais une adresse inventée
  fond?: string;
  bandeau?: BandeauInfolettre | null;
}

function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function blockToEmail(block: NewsletterBlock): string {
  const c = (block.content || {}) as any;
  switch (block.type) {
    case 'heading': {
      const level = Number(c.level) || 1;
      const align = c.align === 'center' ? 'center' : 'left';
      const fontSize = level === 1 ? '32px' : level === 2 ? '26px' : '22px';
      return `<tr><td align="${align}" style="padding:18px 0;font-family:${BRAND.serif};font-size:${fontSize};line-height:1.15;color:${BRAND.ink};font-weight:500;">${richToHtml(c.text || '')}</td></tr>`;
    }
    case 'paragraph': {
      const align = c.align === 'center' ? 'center' : 'left';
      return `<tr><td align="${align}" style="padding:8px 0;font-family:${BRAND.sans};font-size:15px;line-height:1.65;color:${BRAND.muted};">${richToHtml(c.text || '')}</td></tr>`;
    }
    case 'image': {
      if (!c.url) return '';
      const caption = c.caption
        ? `<tr><td align="center" style="padding:8px 0;font-family:${BRAND.sans};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.muted};">${esc(c.caption)}</td></tr>`
        : '';
      return `<tr><td style="padding:16px 0;"><img src="${esc(c.url)}" alt="${esc(c.alt || '')}" style="display:block;width:100%;max-width:560px;" /></td></tr>${caption}`;
    }
    case 'button': {
      const primaire = c.variant !== 'secondaire';
      const bg = primaire ? BRAND.ink : 'transparent';
      const fg = primaire ? '#FFFFFF' : BRAND.ink;
      const border = primaire ? BRAND.ink : 'rgba(26,26,30,0.2)';
      return `<tr><td align="center" style="padding:20px 0;">
        <a href="${esc(hrefSur(c.href))}" target="_blank"
           style="display:inline-block;background:${bg};color:${fg};border:1px solid ${border};
                  font-family:${BRAND.sans};font-size:11px;font-weight:700;letter-spacing:0.25em;
                  text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:999px;">
          ${esc(c.label || 'En savoir plus')}
        </a>
      </td></tr>`;
    }
    case 'divider':
      return `<tr><td style="padding:16px 0;"><div style="height:1px;background:${BRAND.accent};"></div></td></tr>`;
    case 'list': {
      const numero = c.style === 'numero';
      const items = String(c.text || '').split('\n').filter((l) => l.trim());
      const rows = items.map((l) => `<li style="margin-bottom:6px;">${richToHtml(l)}</li>`).join('');
      const Tag = numero ? 'ol' : 'ul';
      return `<tr><td style="padding:8px 0;font-family:${BRAND.sans};font-size:15px;line-height:1.5;color:${BRAND.muted};"><${Tag} style="margin:0;padding-left:22px;">${rows}</${Tag}></td></tr>`;
    }
    case 'quote':
      return `<tr><td style="padding:20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="border-left:2px solid ${BRAND.accent};padding-left:18px;font-family:${BRAND.serif};font-size:18px;line-height:1.5;color:${BRAND.ink};">
            «&nbsp;${richToHtml(c.text || '')}&nbsp;»
            ${c.attribution ? `<div style="margin-top:10px;font-family:${BRAND.sans};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.accent};">· ${esc(c.attribution)}</div>` : ''}
          </td>
        </tr></table>
      </td></tr>`;
    case 'cta':
      return `<tr><td style="padding:20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.ink};">
          <tr><td align="center" style="padding:32px 24px;color:#F7F4EE;">
            ${c.eyebrow ? `<div style="font-family:${BRAND.sans};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${BRAND.accentSurEncre};margin-bottom:10px;font-weight:700;">${esc(c.eyebrow)}</div>` : ''}
            ${c.title ? `<div style="font-family:${BRAND.serif};font-size:26px;line-height:1.2;margin-bottom:10px;">${esc(c.title)}</div>` : ''}
            ${c.body ? `<div style="font-family:${BRAND.sans};font-size:14px;line-height:1.6;color:rgba(247,244,238,0.75);margin-bottom:22px;">${esc(c.body)}</div>` : ''}
            ${c.href && c.boutonTexte ? `<a href="${esc(c.href)}" target="_blank" style="display:inline-block;background:${BRAND.accent};color:#FFFFFF;font-family:${BRAND.sans};font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:999px;">${esc(c.boutonTexte)}</a>` : ''}
          </td></tr>
        </table>
      </td></tr>`;
    case 'spacer': {
      const h = c.taille === 'lg' ? 48 : c.taille === 'sm' ? 10 : 24;
      return `<tr><td style="height:${h}px;line-height:${h}px;font-size:0;">&nbsp;</td></tr>`;
    }
    default:
      return '';
  }
}

export function renderEmailHtml(blocks: NewsletterBlock[], opts: RenderEmailOptions): string {
  const blockRows = blocks.map(blockToEmail).join('\n');
  const fond = opts.fond || BRAND.paper;
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;color:transparent;line-height:1px;">${esc(opts.preheader)}</div>`
    : '';
  const b = opts.bandeau;
  const bandeau = !b?.masque
    ? `<tr><td style="padding:28px 36px 26px;background:${esc(b?.fond || BRAND.ink)};">
        ${b?.etiquette ? `<div style="font-family:${BRAND.sans};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;color:${esc(b?.texte || '#F2789F')};margin-bottom:12px;">${esc(b.etiquette)}</div>` : ''}
        <div style="font-family:${BRAND.serif};font-size:28px;line-height:1.15;color:${esc(b?.texte || '#F7F4EE')};">${esc(opts.subject)}</div>
        <div style="margin-top:16px;height:1px;width:48px;background:${esc(b?.texte || '#F2789F')};"></div>
      </td></tr>`
    : '';
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${fond};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${fond};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${fond};">
        ${bandeau}
        <tr><td style="padding:32px 36px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${blockRows}
          </table>
        </td></tr>
        <tr><td style="padding:24px 36px;border-top:1px solid ${BRAND.filet};font-family:${BRAND.sans};font-size:12px;line-height:1.6;color:${BRAND.muted};">
          <div style="margin-bottom:8px;">${esc(BRAND.signature)} · <a href="${BRAND.site}" style="color:${BRAND.accent};text-decoration:underline;">${BRAND.site.replace('https://', '')}</a></div>
          ${opts.postalAddress ? `<div style="margin-bottom:8px;">${esc(opts.postalAddress)}</div>` : ''}
          <div><a href="${esc(opts.unsubscribeUrl)}" style="color:${BRAND.accent};text-decoration:underline;">Se désabonner</a></div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Une version texte pour Resend (aide au placement en boîte de réception). */
export function renderEmailText(blocks: NewsletterBlock[], opts: RenderEmailOptions): string {
  const lines: string[] = [];
  for (const b of blocks) {
    const c = (b.content || {}) as any;
    switch (b.type) {
      case 'heading':
      case 'paragraph':
      case 'quote':
        if (c.text) lines.push(stripRich(c.text));
        break;
      case 'list':
        String(c.text || '').split('\n').filter((l: string) => l.trim()).forEach((l: string) => lines.push(`- ${stripRich(l)}`));
        break;
      case 'button':
        if (c.label && c.href) lines.push(`${c.label} : ${c.href}`);
        break;
      case 'cta':
        if (c.title) lines.push(c.title);
        if (c.body) lines.push(c.body);
        if (c.href && c.boutonTexte) lines.push(`${c.boutonTexte} : ${c.href}`);
        break;
      case 'divider':
        lines.push('---');
        break;
    }
  }
  lines.push('', BRAND.signature, opts.postalAddress, `Se désabonner : ${opts.unsubscribeUrl}`);
  return lines.filter(Boolean).join('\n\n');
}
