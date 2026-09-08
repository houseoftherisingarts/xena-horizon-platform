// Le catalogue des blocs, un bloc sur la page (rendu éditable + barre d'outils) et le « + » qui en
// insère un entre deux autres. Compagnon de Composer.tsx, pour le garder sous 500 lignes.
import React, { useState } from 'react';
import {
  ArrowUp, ArrowDown, Copy, Trash2, Bold, Italic, Underline, Link as LinkIcon, SlidersHorizontal,
  Image as ImageIcon, Plus, Heading as HeadingIcon, Type, MousePointerClick, List as ListIcon,
  Quote as QuoteIcon, Star, Minus, MoveVertical,
} from 'lucide-react';
import {
  RenderBlockWeb, POLICES, TAILLES, SEPARATEURS, BRAND,
  type NewsletterBlock, type BlockType, type Police,
} from '../../../lib/infolettre/renderer';

export const BLOCK_PALETTE: Array<{ type: BlockType; icone: typeof Type; label: string; gabarit: () => NewsletterBlock }> = [
  { type: 'heading', icone: HeadingIcon, label: 'Titre', gabarit: () => ({ type: 'heading', content: { level: 2, text: '', align: 'left' } }) },
  { type: 'paragraph', icone: Type, label: 'Paragraphe', gabarit: () => ({ type: 'paragraph', content: { text: '' } }) },
  { type: 'image', icone: ImageIcon, label: 'Image', gabarit: () => ({ type: 'image', content: { url: '', caption: '' } }) },
  { type: 'button', icone: MousePointerClick, label: 'Bouton', gabarit: () => ({ type: 'button', content: { label: 'Découvrir', href: BRAND.site, variant: 'primaire' } }) },
  { type: 'list', icone: ListIcon, label: 'Puces', gabarit: () => ({ type: 'list', content: { text: '', style: 'puce' } }) },
  { type: 'quote', icone: QuoteIcon, label: 'Citation', gabarit: () => ({ type: 'quote', content: { text: '', attribution: '' } }) },
  { type: 'cta', icone: Star, label: 'Appel fort', gabarit: () => ({ type: 'cta', content: { eyebrow: '', title: '', body: '', href: BRAND.site, boutonTexte: 'En savoir plus' } }) },
  { type: 'divider', icone: Minus, label: 'Séparateur', gabarit: () => ({ type: 'divider', content: { style: 'ligne' } }) },
  { type: 'spacer', icone: MoveVertical, label: 'Espace', gabarit: () => ({ type: 'spacer', content: { taille: 'md' } }) },
];

const selectCls = 'px-2 py-1.5 rounded-champ bg-papier border border-filet text-xs text-encre outline-none focus:border-rose';
const iconBtn = 'w-8 h-8 rounded-champ bg-papier border border-filet text-gris hover:text-encre hover:border-encre flex items-center justify-center transition-colors disabled:opacity-30';

/** Les quelques mots du composeur dont ce fichier a besoin (surtitres de blocs, actions). */
export type TexosBloc = Record<string, string>;

export const BlockFrame: React.FC<{
  block: NewsletterBlock; selected: boolean; readOnly: boolean; first: boolean; last: boolean;
  t: TexosBloc;
  onSelect: () => void; onPatch: (p: Record<string, any>) => void; onMove: (d: -1 | 1) => void;
  onRemove: () => void; onDuplicate: () => void; onPickImage: () => void;
}> = ({ block, selected, readOnly, first, last, t, onSelect, onPatch, onMove, onRemove, onDuplicate, onPickImage }) => {
  const c = (block.content || {}) as any;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const exec = (cmd: string, arg?: string) => document.execCommand(cmd, false, arg);
  const lier = () => { const url = window.prompt('https://…'); if (url && /^https?:\/\//.test(url)) exec('createLink', url); };
  const policeSelect = (defaut: Police) => (
    <select value={c.police || defaut} onChange={(e) => onPatch({ police: e.target.value })} className={selectCls}>
      {Object.entries(POLICES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
    </select>
  );
  const tailleSelect = () => (
    <select value={c.taille || 'md'} onChange={(e) => onPatch({ taille: e.target.value })} className={selectCls}>
      {Object.entries(TAILLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
    </select>
  );

  return (
    <div onClick={(e) => { e.stopPropagation(); onSelect(); }} className={`group/bloc relative rounded-champ border-2 px-3 -mx-3 my-1 transition-colors ${selected ? 'border-rose/60' : 'border-transparent hover:border-rose/25'}`}>
      {readOnly ? <RenderBlockWeb block={block} /> : <RenderBlockWeb block={block} edit={{ set: onPatch, pickImage: onPickImage }} />}
      {!readOnly && (
        <div onClick={stop} className={`${selected ? 'flex' : 'hidden group-hover/bloc:flex'} flex-wrap justify-end items-center gap-1.5 mt-2 lg:mt-0 lg:absolute lg:-top-11 lg:right-0 z-20 bg-papier rounded-pilule px-2 py-1 border border-filet w-fit ml-auto`}>
          {block.type === 'heading' && (
            <>
              <select value={c.level || 2} onChange={(e) => onPatch({ level: Number(e.target.value) })} className={selectCls}>
                <option value={1}>{t.niveauGrand}</option><option value={2}>{t.niveauTitre}</option><option value={3}>{t.niveauSousTitre}</option>
              </select>
              {policeSelect('serif')}
              <button className={iconBtn} title={t.aligner} onClick={() => onPatch({ align: c.align === 'center' ? 'left' : 'center' })}><SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" /></button>
            </>
          )}
          {block.type === 'paragraph' && (
            <>
              {policeSelect('sans')}{tailleSelect()}
              <button className={iconBtn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} title="Gras"><Bold className="w-3.5 h-3.5" aria-hidden="true" /></button>
              <button className={iconBtn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')} title="Italique"><Italic className="w-3.5 h-3.5" aria-hidden="true" /></button>
              <button className={iconBtn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')} title="Souligné"><Underline className="w-3.5 h-3.5" aria-hidden="true" /></button>
              <button className={iconBtn} onMouseDown={(e) => e.preventDefault()} onClick={lier} title={t.lien}><LinkIcon className="w-3.5 h-3.5" aria-hidden="true" /></button>
              <button className={iconBtn} title={t.aligner} onClick={() => onPatch({ align: c.align === 'center' ? 'left' : 'center' })}><SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" /></button>
            </>
          )}
          {block.type === 'image' && (
            <>
              <button className={`${iconBtn} w-auto px-3 gap-1.5 text-xs font-semibold`} onClick={onPickImage}><ImageIcon className="w-3.5 h-3.5" aria-hidden="true" /> Image</button>
              <input value={c.alt || ''} onChange={(e) => onPatch({ alt: e.target.value })} placeholder="Alt" className={`${selectCls} w-28`} />
              <input value={c.href || ''} onChange={(e) => onPatch({ href: e.target.value })} placeholder="https://…" className={`${selectCls} w-40`} />
            </>
          )}
          {(block.type === 'button' || block.type === 'cta') && (
            <input value={c.href || ''} onChange={(e) => onPatch({ href: e.target.value })} placeholder="https://…" className={`${selectCls} w-48`} />
          )}
          {block.type === 'button' && (
            <select value={c.variant || 'primaire'} onChange={(e) => onPatch({ variant: e.target.value })} className={selectCls}>
              <option value="primaire">{t.styleBouton}</option><option value="secondaire">{t.styleContour}</option>
            </select>
          )}
          {block.type === 'list' && (
            <>
              <select value={c.style || 'puce'} onChange={(e) => onPatch({ style: e.target.value })} className={selectCls}>
                <option value="puce">{t.puce}</option><option value="numero">{t.numero}</option>
              </select>
              {policeSelect('sans')}
              <button className={iconBtn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} title="Gras"><Bold className="w-3.5 h-3.5" aria-hidden="true" /></button>
              <button className={iconBtn} onMouseDown={(e) => e.preventDefault()} onClick={lier} title={t.lien}><LinkIcon className="w-3.5 h-3.5" aria-hidden="true" /></button>
            </>
          )}
          {block.type === 'divider' && (
            <select value={c.style || 'ligne'} onChange={(e) => onPatch({ style: e.target.value })} className={selectCls}>
              {Object.entries(SEPARATEURS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )}
          {block.type === 'spacer' && (
            <select value={c.taille || 'md'} onChange={(e) => onPatch({ taille: e.target.value })} className={selectCls}>
              <option value="sm">{t.petit}</option><option value="md">{t.moyen}</option><option value="lg">{t.grand}</option>
            </select>
          )}
          <span className="w-px h-5 bg-filet mx-0.5" />
          <button className={iconBtn} onClick={() => onMove(-1)} disabled={first} title={t.monter}><ArrowUp className="w-3.5 h-3.5" aria-hidden="true" /></button>
          <button className={iconBtn} onClick={() => onMove(1)} disabled={last} title={t.descendre}><ArrowDown className="w-3.5 h-3.5" aria-hidden="true" /></button>
          <button className={iconBtn} onClick={onDuplicate} title={t.dupliquer}><Copy className="w-3.5 h-3.5" aria-hidden="true" /></button>
          <button className={`${iconBtn} hover:text-rose hover:border-rose`} onClick={onRemove} title={t.supprimerBloc}><Trash2 className="w-3.5 h-3.5" aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
};

/** Le « + » entre deux blocs : un bloc s'insère là où l'on est. */
export const InsertPoint: React.FC<{ onAdd: (t: BlockType) => void }> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="group/plus relative z-10 h-5 -my-2.5 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <div className={`absolute inset-x-0 h-px transition-colors ${open ? 'bg-rose' : 'bg-transparent group-hover/plus:bg-rose/30'}`} />
      <button type="button" onClick={() => setOpen((v) => !v)} title="+"
        className={`relative z-10 w-6 h-6 rounded-pilule flex items-center justify-center border transition-all ${open ? 'bg-rose text-papier border-rose rotate-45' : 'bg-papier text-rose border-filet opacity-0 group-hover/plus:opacity-100 focus:opacity-100'}`}>
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-1.5 max-w-[480px] bg-papier rounded-champ p-2 border border-filet shadow-panneau">
          {BLOCK_PALETTE.map((b) => (
            <button key={b.type} type="button" onClick={() => { onAdd(b.type); setOpen(false); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pilule hover:bg-rose/10 border border-filet text-xs text-encre transition-colors">
              <b.icone className="w-3.5 h-3.5 text-rose" aria-hidden="true" /> {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
