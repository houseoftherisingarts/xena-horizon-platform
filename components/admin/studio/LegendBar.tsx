// Le bas de page : la légende et les mots-clics juste à côté du visuel qu'ils accompagnent, un
// compteur de signes, puis les deux gestes de sortie (export PNG, copier la légende).
import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Panneau, Bouton, Zone } from '../ui';

interface Props {
  legende: string;
  onLegende: (v: string) => void;
  motsClics: string;
  onMotsClics: (v: string) => void;
  onExporter: () => void;
  exportEnCours: boolean;
  onCopier: () => void;
  copie: boolean;
  t: { legende: string; motsClics: string; signes: string; exporter: string; exportEnCours: string; copier: string; copie: string };
}

export const LegendBar: React.FC<Props> = ({ legende, onLegende, motsClics, onMotsClics, onExporter, exportEnCours, onCopier, copie, t }) => {
  const total = legende.length + (motsClics ? motsClics.length + 1 : 0);
  return (
    <Panneau>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <Zone label={t.legende} value={legende} onChange={(e) => onLegende(e.target.value)} className="lg:mb-0" />
        <div className="flex flex-col gap-1.5">
          <Zone label={t.motsClics} value={motsClics} onChange={(e) => onMotsClics(e.target.value)} placeholder="#xenahorizon #marque" />
          <p className="text-xs text-gris">{total} {t.signes}</p>
        </div>
        <div className="flex gap-2 lg:pb-0">
          <Bouton variante="secondaire" icone={copie ? Check : Copy} onClick={onCopier}>
            {copie ? t.copie : t.copier}
          </Bouton>
          <Bouton variante="primaire" icone={Download} onClick={onExporter} disabled={exportEnCours}>
            {exportEnCours ? t.exportEnCours : t.exporter}
          </Bouton>
        </div>
      </div>
    </Panneau>
  );
};
