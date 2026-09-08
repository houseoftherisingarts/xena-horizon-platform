// Colonne de gauche : le format du canevas, puis les gabarits, chacun rendu par le moteur de
// calques en vignette (pas une image figée) pour montrer exactement ce que « Utiliser » applique.
import React from 'react';
import { Square, Smartphone, Image as ImageIcon, RectangleHorizontal, GalleryHorizontalEnd } from 'lucide-react';
import { Panneau } from '../ui';
import { Toile } from './Toile';
import type { Format, Gabarit, Reseau } from '../../../lib/studio/types';

const ICONES: Record<Reseau, React.ReactNode> = {
  carre: <Square className="w-4 h-4" />,
  feed: <ImageIcon className="w-4 h-4" />,
  story: <Smartphone className="w-4 h-4" />,
  linkedin: <RectangleHorizontal className="w-4 h-4" />,
  carrousel: <GalleryHorizontalEnd className="w-4 h-4" />,
};

const TUILE = 'flex flex-col items-center justify-center p-3 rounded-champ border transition-colors text-xs font-medium gap-1';
const TUILE_ACTIVE = 'border-rose text-rose bg-rose/10';
const TUILE_INACTIVE = 'border-filet text-gris hover:border-encre hover:text-encre';

interface Props {
  formats: Format[];
  format: Format;
  onFormat: (f: Format) => void;
  gabarits: Gabarit[];
  onGabarit: (g: Gabarit) => void;
  lang: 'FR' | 'EN';
  t: { format: string; gabarits: string; use: string };
}

export const FormatsPanel: React.FC<Props> = ({ formats, format, onFormat, gabarits, onGabarit, lang, t }) => (
  <div className="space-y-6">
    <Panneau titre={t.format}>
      <div className="grid grid-cols-2 gap-2">
        {formats.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFormat(f)}
            className={`${TUILE} ${format.id === f.id ? TUILE_ACTIVE : TUILE_INACTIVE}`}
          >
            {ICONES[f.id]}
            <span>{lang === 'FR' ? f.label : f.labelEn}</span>
          </button>
        ))}
      </div>
    </Panneau>

    <Panneau titre={t.gabarits}>
      <div className="grid grid-cols-2 gap-3">
        {gabarits.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onGabarit(g)}
            className="group text-left rounded-champ border border-filet hover:border-rose transition-colors overflow-hidden"
          >
            <Toile format={formats.find((f) => f.id === g.format) ?? formats[0]} fond={g.fond} calques={g.calques} editable={false} />
            <div className="px-2 py-1.5 flex items-center justify-between">
              <span className="text-xs text-encre font-medium truncate">{lang === 'FR' ? g.nom : g.nomEn}</span>
              <span className="text-xs text-rose opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">{t.use}</span>
            </div>
          </button>
        ))}
      </div>
    </Panneau>
  </div>
);
