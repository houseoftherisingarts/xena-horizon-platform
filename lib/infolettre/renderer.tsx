/**
 * Le moteur de l'infolettre : les types de blocs, le rendu web (édition en place dans le composeur)
 * et le rendu courriel (HTML autonome, table-in-table, sans dépendance au CSS du site).
 *
 * Port du composeur de Krystine (2e génération, 7 septembre 2026), adapté à la marque Xena Horizon :
 * Playfair Display pour les titres, Figtree pour le corps, fonds proposés dans le canon papier / encre /
 * bleu ciel. Le rendu courriel ne lit pas les jetons CSS du site : les hex ci-dessous sont documentés et
 * permis à cet endroit précis (CANON-ADMIN.md). Aucun italique nulle part (règle dure du client), aucun
 * tiret long, aucun dégradé de couleur.
 */
import React, { useEffect, useRef, useState } from 'react';

/** Seules les adresses https ou http passent dans un lien : jamais javascript:, data: ni autre schéma. */
const hrefSur = (h?: string): string => (/^https?:\/\//i.test((h || '').trim()) ? (h as string).trim() : '#');


// ─── Les blocs ──────────────────────────────────────────────────────────────
export type Police = 'serif' | 'sans';
export type Taille = 'sm' | 'md' | 'lg' | 'xl';
export type Separateur = 'ligne' | 'pleine' | 'points' | 'fleuron' | 'etoiles' | 'feuille';
export type BlockType = 'heading' | 'paragraph' | 'image' | 'button' | 'quote' | 'cta' | 'divider' | 'list' | 'spacer';

export interface HeadingContent { level?: 1 | 2 | 3; text?: string; align?: 'left' | 'center'; police?: Police }
// `text` accepte une mise en forme légère : <b>, <i>, <u>, <a href>, retours à la ligne. Le reste est
// échappé (voir richToHtml). L'italique reste accessible ici : c'est le choix de rédaction de Laurie
// pour un mot précis, pas un parti pris typographique du site.
export interface ParagraphContent { text?: string; align?: 'left' | 'center'; police?: Police; taille?: Taille }
// `taille` : « pleine » (par défaut, une photo qui prend toute la largeur de la lettre) ou « logo »
// (un petit format centré, pour un logo carré au haut d'une lettre sans qu'il domine l'écran).
export interface ImageContent { url?: string; caption?: string; alt?: string; href?: string; taille?: 'pleine' | 'logo' }
export interface ButtonContent { label?: string; href?: string; variant?: 'primaire' | 'secondaire' }
export interface QuoteContent { text?: string; attribution?: string }
export interface CTAContent { eyebrow?: string; title?: string; body?: string; href?: string; boutonTexte?: string }
export interface SpacerContent { taille?: 'sm' | 'md' | 'lg' }
export interface ListContent { text?: string; style?: 'puce' | 'numero'; police?: Police; taille?: Taille } // une ligne par puce
export interface DividerContent { style?: Separateur }

export interface NewsletterBlock { type: BlockType; content: Record<string, any> }

// ─── La marque ──────────────────────────────────────────────────────────────
export const BRAND = {
  ink: '#1A1A1E',
  paper: '#F7F4EE',
  paper2: '#EFEBE3',
  muted: 'rgba(26,26,30,0.65)',
  accent: '#A8104A',
  accentSurEncre: '#F2789F',
  filet: '#DDD7CD',
  serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans: "'Figtree', 'Avenir Next', Avenir, system-ui, sans-serif",
  site: 'https://xenahorizon.com',
  signature: 'Laurie Belhumeur · Xena Horizon',
};

export const POLICES: Record<Police, { label: string; css: string; tw: string }> = {
  serif: { label: 'Éditoriale', css: BRAND.serif, tw: 'font-serif' },
  sans: { label: 'Moderne', css: BRAND.sans, tw: 'font-sans' },
};
export const TAILLES: Record<Taille, { label: string; px: number; tw: string }> = {
  sm: { label: 'Petit', px: 14, tw: 'text-sm' },
  md: { label: 'Normal', px: 16, tw: 'text-base' },
  lg: { label: 'Grand', px: 19, tw: 'text-lg' },
  xl: { label: 'Très grand', px: 22, tw: 'text-xl' },
};
export const SEPARATEURS: Record<Separateur, { label: string; glyphe?: string }> = {
  ligne: { label: 'Trait court' },
  pleine: { label: 'Trait plein' },
  points: { label: 'Trois points', glyphe: '•  •  •' },
  fleuron: { label: 'Fleuron', glyphe: '❦' },
  etoiles: { label: 'Étoiles', glyphe: '✦  ✦  ✦' },
  feuille: { label: 'Feuille', glyphe: '❧' },
};

// Les fonds possibles pour le corps de la lettre, dans les deux palettes du canon (papier/encre et
// bleu ciel) : le HTML d'un courriel ne lit pas les jetons CSS du site, ces hex sont documentés ici.
export const FONDS_INFOLETTRE: Array<{ hex: string; label: string }> = [
  { hex: '#FFFFFF', label: 'Blanc' },
  { hex: '#F7F4EE', label: 'Papier chaud' },
  { hex: '#EFEBE3', label: 'Papier ivoire' },
  { hex: '#EAF4FC', label: 'Ciel pâle' },
  { hex: '#38B6FF', label: 'Bleu ciel' },
  { hex: '#1A1A1E', label: 'Encre' },
  { hex: '#181818', label: 'Nuit' },
];
export function estSombre(hex?: string | null): boolean {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return false;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.35;
}

// ─── Texte riche léger ──────────────────────────────────────────────────────
function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export function richToHtml(text: string): string {
  return esc(text)
    .replace(/&lt;(\/?)(b|i|u)&gt;/g, '<$1$2>')
    .replace(/&lt;a href=&quot;(https?:\/\/[^&]*?)&quot;&gt;/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#A8104A;text-decoration:underline;">')
    .replace(/&lt;\/a&gt;/g, '</a>')
    .replace(/\r?\n/g, '<br />');
}
export function stripRich(text: string): string {
  return String(text ?? '').replace(/<\/?(b|i|u)>/g, '').replace(/<a href="[^"]*">/g, '').replace(/<\/a>/g, '');
}

// Le DOM du champ modifiable redevient notre sous-ensemble : gras, italique, souligné, lien, retour à
// la ligne. Les <div> du navigateur deviennent des retours à la ligne, tout style collé disparaît.
export function domToRich(root: Node): string {
  const walk = (n: Node): string => {
    if (n.nodeType === Node.TEXT_NODE) return (n.textContent || '').replace(/ /g, ' ');
    if (n.nodeType !== Node.ELEMENT_NODE) return '';
    const el = n as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') return '\n';
    const inner = Array.from(el.childNodes).map(walk).join('');
    const bold = tag === 'b' || tag === 'strong' || /^(bold|[6-9]00)$/.test(el.style.fontWeight);
    const ital = tag === 'i' || tag === 'em' || el.style.fontStyle === 'italic';
    const under = tag === 'u' || /underline/.test(el.style.textDecoration);
    let out = inner;
    if (bold) out = `<b>${out}</b>`;
    if (ital) out = `<i>${out}</i>`;
    if (under) out = `<u>${out}</u>`;
    if (tag === 'a') {
      const href = el.getAttribute('href') || '';
      if (/^https?:\/\//.test(href)) out = `<a href="${href.replace(/"/g, '')}">${out}</a>`;
    }
    if (tag === 'div' || tag === 'p') {
      const prev = el.previousSibling;
      const needsBreak = prev && !(prev.nodeType === Node.TEXT_NODE && /\n$/.test(prev.textContent || '')) && !(prev.nodeName === 'BR');
      return (needsBreak ? '\n' : '') + out;
    }
    return out;
  };
  return Array.from(root.childNodes).map(walk).join('').replace(/\n+$/, '');
}

// ─── Édition en place (composeur de l'admin) ────────────────────────────────
export interface BlockEdit {
  set: (patch: Record<string, any>) => void;
  pickImage: () => void;
}

const Inline: React.FC<{
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  value: string;
  placeholder: string;
  multiline?: boolean;
  rich?: boolean;
  style?: React.CSSProperties;
  onCommit: (v: string) => void;
  onEnter?: (v: string) => void;
  onEmptyBackspace?: () => void;
  autoFocus?: boolean;
}> = ({ tag = 'span', className = '', value, placeholder, multiline, rich, style, onCommit, onEnter, onEmptyBackspace, autoFocus }) => {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (rich) { if (domToRich(el) !== value) el.innerHTML = richToHtml(value); }
    else if (el.innerText !== value) el.innerText = value;
  }, [value, rich]);
  const Tag = tag as any;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      className={`nl-inline ${className}`}
      style={style}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const v = rich ? domToRich(e.currentTarget) : e.currentTarget.innerText.replace(/\n+$/, '');
        if (v !== value) onCommit(v);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Escape') { e.preventDefault(); e.currentTarget.blur(); }
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault();
          if (onEnter) onEnter(rich ? domToRich(e.currentTarget) : e.currentTarget.innerText);
          else e.currentTarget.blur();
        }
        if (e.key === 'Backspace' && onEmptyBackspace && e.currentTarget.innerText.trim() === '') { e.preventDefault(); onEmptyBackspace(); }
      }}
      onPaste={(e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
      }}
    />
  );
};

// Une liste à puces qui s'écrit ligne par ligne : Entrée ajoute une puce, Retour arrière sur une puce
// vide la retire.
const ListEdit: React.FC<{ items: string[]; numero: boolean; className: string; style: React.CSSProperties; onChange: (lines: string[]) => void }> = ({ items, numero, className, style, onChange }) => {
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const lines = items.length ? items : [''];
  const setAt = (i: number, v: string) => { const n = lines.slice(); n[i] = v; onChange(n); };
  const Tag: any = numero ? 'ol' : 'ul';
  return (
    <Tag className={`my-4 pl-6 space-y-1 ${numero ? 'list-decimal' : 'list-disc'} marker:text-rose`} style={style}>
      {lines.map((l, i) => (
        <li key={i} className={className}>
          <Inline
            rich
            className="block min-h-[1.5em]"
            value={l}
            placeholder={i === 0 ? 'Première puce (Entrée pour la suivante)' : 'Une puce'}
            autoFocus={focusIdx === i}
            onCommit={(v) => setAt(i, v)}
            onEnter={(v) => { const n = lines.slice(); n[i] = v; n.splice(i + 1, 0, ''); onChange(n); setFocusIdx(i + 1); }}
            onEmptyBackspace={() => { if (lines.length <= 1) return; const n = lines.slice(); n.splice(i, 1); onChange(n); setFocusIdx(Math.max(0, i - 1)); }}
          />
        </li>
      ))}
    </Tag>
  );
};

// ─── Rendu web (composeur et aperçu) ─────────────────────────────────────────
// Utilise les jetons du canon (text-encre, bg-papier-2, border-filet…) : la bascule de palette du site
// change l'apparence sans qu'aucune classe ne bouge ici.
export const RenderBlockWeb: React.FC<{ block: NewsletterBlock; edit?: BlockEdit }> = ({ block, edit }) => {
  const c = (block.content || {}) as any;
  const set = (k: string) => (v: string) => edit?.set({ [k]: v });
  switch (block.type) {
    case 'heading': {
      const level = Number(c.level) || 1;
      const align = c.align === 'center' ? 'text-center' : 'text-left';
      const size = level === 1 ? 'text-h2' : level === 2 ? 'text-h3' : 'text-lede font-medium';
      const police = POLICES[(c.police as Police) || 'serif'];
      const style = { fontFamily: police.css };
      const className = `font-serif text-encre my-6 ${size} ${align}`;
      if (edit) return <Inline tag={level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'} className={className} style={style} value={c.text || ''} placeholder="Votre titre" onCommit={set('text')} />;
      const Tag: any = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
      return <Tag className={className} style={style}>{c.text || ''}</Tag>;
    }
    case 'paragraph': {
      const police = POLICES[(c.police as Police) || 'sans'];
      const taille = TAILLES[(c.taille as Taille) || 'md'];
      const style = { fontFamily: police.css };
      const className = `text-encre/80 leading-relaxed my-4 ${taille.tw} ${c.align === 'center' ? 'text-center' : 'text-left'}`;
      if (edit) return <Inline tag="p" className={className} style={style} value={c.text || ''} placeholder="Écrivez votre texte ici." multiline rich onCommit={set('text')} />;
      return <p className={className} style={style} dangerouslySetInnerHTML={{ __html: richToHtml(c.text || '') }} />;
    }
    case 'image': {
      const capClass = 'kicker text-gris text-center mt-3';
      if (edit) {
        return (
          <figure className="my-6">
            <button type="button" onClick={(e) => { e.stopPropagation(); edit.pickImage(); }} title="Changer l'image"
              className="group/img relative block w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose">
              {c.url
                ? <img src={c.url} alt={c.alt || ''} className="w-full block" />
                : <div className="aspect-[21/9] max-h-64 w-full border-2 border-dashed border-rose/40 bg-rose/5 flex flex-col items-center justify-center gap-2 text-rose"><span className="kicker">Choisir une image</span></div>}
              <span className="absolute inset-0 flex items-center justify-center bg-encre/0 group-hover/img:bg-encre/40 transition-colors">
                <span className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-papier text-encre px-4 py-2 rounded-pilule text-xs font-semibold shadow-panneau">Changer l'image</span>
              </span>
            </button>
            <Inline tag="figcaption" className={capClass} value={c.caption || ''} placeholder="Légende (facultative)" onCommit={set('caption')} />
          </figure>
        );
      }
      return (
        <figure className="my-6">
          {c.url && <a href={/^https?:\/\//.test(c.href || '') ? c.href : BRAND.site} target="_blank" rel="noopener noreferrer" className="block"><img src={c.url} alt={c.alt || ''} className="w-full" /></a>}
          {c.caption && <figcaption className={capClass}>{c.caption}</figcaption>}
        </figure>
      );
    }
    case 'button': {
      const primaire = c.variant !== 'secondaire';
      const className = `inline-block px-8 py-3 rounded-pilule font-semibold text-xs uppercase tracking-widest transition-colors ${
        primaire ? 'bg-bouton text-sur-bouton hover:bg-bouton-2' : 'border border-filet text-encre hover:border-encre'
      }`;
      if (edit) return <div className="my-6 text-center"><Inline className={className} value={c.label || ''} placeholder="Texte du bouton" onCommit={set('label')} /></div>;
      return (
        <div className="my-6 text-center">
          <a href={hrefSur(c.href)} target="_blank" rel="noopener noreferrer" className={className}>{c.label || 'En savoir plus'}</a>
        </div>
      );
    }
    case 'divider': {
      const st = (c.style as Separateur) || 'ligne';
      const g = SEPARATEURS[st]?.glyphe;
      if (st === 'ligne') return <div className="my-8 h-px w-16 bg-rose" />;
      if (st === 'pleine') return <hr className="my-8 border-0 h-px bg-rose/40" />;
      return (
        <div className="my-8 flex items-center gap-4 text-rose">
          <span className="flex-1 h-px bg-filet" />
          <span className="text-lg tracking-[0.3em] leading-none">{g}</span>
          <span className="flex-1 h-px bg-filet" />
        </div>
      );
    }
    case 'list': {
      const police = POLICES[(c.police as Police) || 'sans'];
      const taille = TAILLES[(c.taille as Taille) || 'md'];
      const numero = c.style === 'numero';
      const items: string[] = String(c.text || '').split('\n');
      const cls = `text-encre/80 leading-relaxed ${taille.tw}`;
      if (edit) return <ListEdit items={items} numero={numero} className={cls} style={{ fontFamily: police.css }} onChange={(lines) => edit.set({ text: lines.join('\n') })} />;
      const Tag: any = numero ? 'ol' : 'ul';
      return (
        <Tag className={`my-4 pl-6 space-y-1 ${numero ? 'list-decimal' : 'list-disc'} marker:text-rose`} style={{ fontFamily: police.css }}>
          {items.filter((l) => l.trim()).map((l, i) => <li key={i} className={cls} dangerouslySetInnerHTML={{ __html: richToHtml(l) }} />)}
        </Tag>
      );
    }
    case 'quote': {
      const citeClass = 'block mt-3 kicker text-rose';
      if (edit) {
        return (
          <blockquote className="my-8 border-l-2 border-rose pl-6 font-serif text-lede text-encre/80">
            <p>« <Inline value={c.text || ''} placeholder="La citation" multiline onCommit={set('text')} /> »</p>
            <span className={citeClass}>· <Inline value={c.attribution || ''} placeholder="Qui l'a dit" onCommit={set('attribution')} /></span>
          </blockquote>
        );
      }
      return (
        <blockquote className="my-8 border-l-2 border-rose pl-6 font-serif text-lede text-encre/80">
          <p>« {c.text || ''} »</p>
          {c.attribution && <cite className={citeClass}>· {c.attribution}</cite>}
        </blockquote>
      );
    }
    case 'cta': {
      const box = 'my-8 rounded-champ bg-encre text-papier p-8 md:p-10 text-center';
      const eyebrowClass = 'kicker text-rose-clair block mb-3';
      const titleClass = 'font-serif text-h3 mb-3';
      const bodyClass = 'text-papier/70 mb-6 mesure mx-auto';
      const btnClass = 'inline-block bg-rose text-papier px-8 py-3 rounded-pilule font-semibold text-xs uppercase tracking-widest';
      if (edit) {
        return (
          <div className={box}>
            <Inline className={eyebrowClass} value={c.eyebrow || ''} placeholder="Petit texte au-dessus" onCommit={set('eyebrow')} />
            <Inline tag="h3" className={titleClass} value={c.title || ''} placeholder="Titre fort" onCommit={set('title')} />
            <Inline tag="p" className={bodyClass} value={c.body || ''} placeholder="Un court paragraphe." multiline onCommit={set('body')} />
            <Inline className={btnClass} value={c.boutonTexte || ''} placeholder="Texte du bouton" onCommit={set('boutonTexte')} />
          </div>
        );
      }
      return (
        <div className={box}>
          {c.eyebrow && <span className={eyebrowClass}>{c.eyebrow}</span>}
          {c.title && <h3 className={titleClass}>{c.title}</h3>}
          {c.body && <p className={bodyClass}>{c.body}</p>}
          {c.href && c.boutonTexte && <a href={hrefSur(c.href)} target="_blank" rel="noopener noreferrer" className={btnClass}>{c.boutonTexte}</a>}
        </div>
      );
    }
    case 'spacer': {
      const h = c.taille === 'lg' ? 'h-16' : c.taille === 'sm' ? 'h-4' : 'h-8';
      return <div className={h} />;
    }
    default:
      return null;
  }
};

export const RenderBlocksWeb: React.FC<{ blocks: NewsletterBlock[] }> = ({ blocks }) => (
  <div className="nl-riche">{blocks.map((b, i) => <RenderBlockWeb key={i} block={b} />)}</div>
);

// ─── La lettre, telle qu'enregistrée dans Firestore ─────────────────────────
export type NewsletterStatut = 'brouillon' | 'envoyee';
export interface BandeauInfolettre { fond?: string; texte?: string; etiquette?: string; masque?: boolean }
export interface NewsletterAudience { mode: 'tous' | 'tags' | 'choix'; tags: string[]; ids: string[]; langue: 'auto' | 'fr' | 'en' | 'toutes' }
export interface NewsletterEnvoi { total: number; envoyes: number; echecs: number; etat: string }
export interface NewsletterDoc {
  id: string;
  sujet: string;
  preheader?: string;
  blocs: NewsletterBlock[];
  lang: 'fr' | 'en';
  statut: NewsletterStatut;
  audience: NewsletterAudience;
  fond: string;
  bandeau?: BandeauInfolettre;
  createdAt?: any;
  updatedAt?: any;
  sentAt?: any;
  versionAt?: any;
  envoi?: NewsletterEnvoi;
}
export interface NewsletterVersion {
  id: string;
  sujet: string;
  preheader?: string;
  blocs: NewsletterBlock[];
  lang: 'fr' | 'en';
  fond: string;
  bandeau?: BandeauInfolettre;
  savedAt?: any;
  raison?: 'heure' | 'restauration';
}

// Le rendu courriel (RenderEmailOptions, renderEmailHtml, renderEmailText) vit dans le fichier
// compagnon lib/infolettre/email.ts, pour garder celui-ci sous 500 lignes : mêmes blocs, mêmes
// helpers de texte riche (BRAND, richToHtml, stripRich, exportés ci-dessus), deux sorties.
