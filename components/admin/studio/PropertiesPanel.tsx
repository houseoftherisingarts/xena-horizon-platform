// Colonne de droite : ajouter des calques, régler celui qui est sélectionné, et le kit de marque
// (logo, couleurs, polices) toujours visible en bas, qu'un calque soit sélectionné ou non.
import React from 'react';
import { Type, ImagePlus, Square, Circle, Minus, Trash2, Copy, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Panneau, Bouton, Etiquette } from '../ui';
import { PALETTE_COULEURS } from '../../../lib/studio/types';
import type { Calque, FormeType, Alignement } from '../../../lib/studio/types';

const GRAISSES: (400 | 500 | 600 | 700)[] = [400, 500, 600, 700];

interface Props {
  calque: Calque | null;
  onChange: (patch: Partial<Calque>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddTexte: () => void;
  onAddImage: (src: string) => void;
  onAddForme: (forme: FormeType) => void;
  images: string[];
  t: {
    ajouter: string;
    texte: string;
    image: string;
    forme: string;
    proprietes: string;
    contenu: string;
    police: string;
    taille: string;
    graisse: string;
    couleur: string;
    ombre: string;
    align: string;
    nb: string;
    opacite: string;
    filet: string;
    supprimer: string;
    dupliquer: string;
    kit: string;
    kitLogo: string;
    aucunCalque: string;
    choisirImage: string;
  };
}

export const PropertiesPanel: React.FC<Props> = ({ calque, onChange, onDelete, onDuplicate, onAddTexte, onAddImage, onAddForme, images, t }) => {
  const [choixImage, setChoixImage] = React.useState(false);

  return (
    <div className="space-y-6">
      <Panneau titre={t.ajouter}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button type="button" onClick={onAddTexte} className="flex flex-col items-center gap-1 p-2.5 rounded-champ border border-filet text-gris hover:border-encre hover:text-encre text-xs font-medium">
            <Type className="w-4 h-4" /> {t.texte}
          </button>
          <button type="button" onClick={() => setChoixImage((v) => !v)} className="flex flex-col items-center gap-1 p-2.5 rounded-champ border border-filet text-gris hover:border-encre hover:text-encre text-xs font-medium">
            <ImagePlus className="w-4 h-4" /> {t.image}
          </button>
        </div>
        <p className="text-xs text-gris mb-1.5">{t.forme}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => onAddForme('rectangle')} className="flex-1 flex items-center justify-center p-2 rounded-champ border border-filet text-gris hover:text-encre hover:border-encre"><Square className="w-3.5 h-3.5" /></button>
          <button type="button" onClick={() => onAddForme('cercle')} className="flex-1 flex items-center justify-center p-2 rounded-champ border border-filet text-gris hover:text-encre hover:border-encre"><Circle className="w-3.5 h-3.5" /></button>
          <button type="button" onClick={() => onAddForme('ligne')} className="flex-1 flex items-center justify-center p-2 rounded-champ border border-filet text-gris hover:text-encre hover:border-encre"><Minus className="w-3.5 h-3.5" /></button>
        </div>
        {choixImage && (
          <div className="mt-3 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
            {images.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  onAddImage(src);
                  setChoixImage(false);
                }}
                className="aspect-square rounded-champ overflow-hidden border border-filet hover:border-rose"
                title={t.choisirImage}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </Panneau>

      {calque ? (
        <Panneau
          titre={t.proprietes}
          actions={
            <>
              <button type="button" onClick={onDuplicate} className="text-gris hover:text-encre" aria-label={t.dupliquer} title={t.dupliquer}>
                <Copy className="w-4 h-4" />
              </button>
              <button type="button" onClick={onDelete} className="text-gris hover:text-rose" aria-label={t.supprimer} title={t.supprimer}>
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          }
        >
          {calque.type === 'texte' && (
            <div className="space-y-4">
              <div>
                <label className="text-petit font-semibold text-encre mb-1.5 block">{t.contenu}</label>
                <textarea
                  className="w-full bg-papier border border-filet rounded-champ px-3 py-2 text-sm text-encre outline-none focus:border-rose h-20 resize-none"
                  value={calque.texte}
                  onChange={(e) => onChange({ texte: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => onChange({ police: 'serif' })} className={`flex-1 py-2 rounded-champ border text-sm font-serif ${calque.police === 'serif' ? 'border-rose text-rose bg-rose/10' : 'border-filet text-gris'}`}>Playfair</button>
                <button type="button" onClick={() => onChange({ police: 'sans' })} className={`flex-1 py-2 rounded-champ border text-sm font-sans ${calque.police === 'sans' ? 'border-rose text-rose bg-rose/10' : 'border-filet text-gris'}`}>Figtree</button>
              </div>

              <div>
                <label className="text-petit font-semibold text-encre mb-1.5 block">{t.taille} ({calque.taillePct.toFixed(1)}%)</label>
                <input type="range" min={1.5} max={14} step={0.1} value={calque.taillePct} onChange={(e) => onChange({ taillePct: parseFloat(e.target.value) })} className="w-full accent-rose" />
              </div>

              <div>
                <label className="text-petit font-semibold text-encre mb-1.5 block">{t.graisse}</label>
                <div className="grid grid-cols-4 gap-1">
                  {GRAISSES.map((g) => (
                    <button key={g.valeur} type="button" onClick={() => onChange({ graisse: g.valeur })} className={`py-1.5 rounded-champ border text-xs ${calque.graisse === g.valeur ? 'border-rose text-rose bg-rose/10' : 'border-filet text-gris'}`}>
                      {g.valeur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-petit font-semibold text-encre">{t.align}</span>
                <div className="flex gap-1">
                  {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as [Alignement, typeof AlignLeft][]).map(([a, Icone]) => (
                    <button key={a} type="button" onClick={() => onChange({ align: a })} className={`p-1.5 rounded-champ border ${calque.align === a ? 'border-rose text-rose' : 'border-filet text-gris'}`} aria-label={a}>
                      <Icone className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <ColorField label={t.couleur} valeur={calque.couleur} onChange={(c) => onChange({ couleur: c })} />

              <label className="flex items-center justify-between bg-papier p-3 rounded-champ border border-filet cursor-pointer">
                <span className="text-sm text-encre font-medium">{t.ombre}</span>
                <input type="checkbox" checked={calque.ombre} onChange={(e) => onChange({ ombre: e.target.checked })} className="w-4 h-4 accent-rose" />
              </label>
            </div>
          )}

          {calque.type === 'image' && (
            <div className="space-y-4">
              <div className="aspect-video rounded-champ overflow-hidden border border-filet">
                <img src={calque.src} alt="" className="w-full h-full object-cover" style={{ filter: calque.nb ? 'grayscale(100%)' : 'none' }} />
              </div>
              <label className="flex items-center justify-between bg-papier p-3 rounded-champ border border-filet cursor-pointer">
                <span className="text-sm text-encre font-medium">{t.nb}</span>
                <input type="checkbox" checked={calque.nb} onChange={(e) => onChange({ nb: e.target.checked })} className="w-4 h-4 accent-rose" />
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                {images.map((src) => (
                  <button key={src} type="button" onClick={() => onChange({ src })} className={`aspect-square rounded-champ overflow-hidden border ${calque.src === src ? 'border-rose' : 'border-filet hover:border-encre'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {calque.type === 'forme' && (
            <div className="space-y-4">
              <ColorField label={t.couleur} valeur={calque.couleur} onChange={(c) => onChange({ couleur: c })} />
              <div>
                <label className="text-petit font-semibold text-encre mb-1.5 block">{t.opacite} ({calque.opacitePct}%)</label>
                <input type="range" min={10} max={100} step={5} value={calque.opacitePct} onChange={(e) => onChange({ opacitePct: parseInt(e.target.value, 10) })} className="w-full accent-rose" />
              </div>
              {calque.forme !== 'ligne' && (
                <label className="flex items-center justify-between bg-papier p-3 rounded-champ border border-filet cursor-pointer">
                  <span className="text-sm text-encre font-medium">{t.filet}</span>
                  <input type="checkbox" checked={calque.filet} onChange={(e) => onChange({ filet: e.target.checked })} className="w-4 h-4 accent-rose" />
                </label>
              )}
            </div>
          )}
        </Panneau>
      ) : (
        <Panneau titre={t.proprietes}>
          <p className="text-sm text-gris">{t.aucunCalque}</p>
        </Panneau>
      )}

      <Panneau titre={t.kit}>
        <div className="flex items-center gap-3 mb-4">
          <img src="/images/logo-laurie.png" alt="" className="w-12 h-12 object-contain rounded-champ border border-filet bg-papier p-1" />
          <Bouton variante="secondaire" petit onClick={() => onAddImage('/images/logo-laurie.png')}>{t.kitLogo}</Bouton>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {PALETTE_COULEURS.map((c) => (
            <button
              key={c.valeur}
              type="button"
              title={c.nom}
              onClick={() => calque && (calque.type === 'texte' || calque.type === 'forme') && onChange({ couleur: c.valeur })}
              className="w-7 h-7 rounded-pilule border border-filet"
              style={{ backgroundColor: c.valeur }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Etiquette tone="neutre" className="font-serif">Playfair Display</Etiquette>
          <Etiquette tone="neutre" className="font-sans">Figtree</Etiquette>
        </div>
      </Panneau>
    </div>
  );
};

const ColorField: React.FC<{ label: string; valeur: string; onChange: (v: string) => void }> = ({ label, valeur, onChange }) => (
  <div>
    <label className="text-petit font-semibold text-encre mb-1.5 block">{label}</label>
    <div className="flex flex-wrap gap-2 mb-2">
      {PALETTE_COULEURS.map((c) => (
        <button
          key={c.valeur}
          type="button"
          title={c.nom}
          onClick={() => onChange(c.valeur)}
          className={`w-7 h-7 rounded-pilule border-2 ${valeur.toLowerCase() === c.valeur.toLowerCase() ? 'border-rose' : 'border-filet'}`}
          style={{ backgroundColor: c.valeur }}
        />
      ))}
      <input type="color" value={valeur} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded-pilule border border-filet cursor-pointer overflow-hidden bg-transparent" />
    </div>
  </div>
);
