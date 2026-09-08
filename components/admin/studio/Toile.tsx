// La toile : le canevas éditable (calques déplaçables et redimensionnables à la souris ou au
// doigt, guides d'alignement au centre et aux tiers avec magnétisme, raccourcis clavier) et, sans
// la prop `editable`, la même toile en lecture seule pour les vignettes de gabarits.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Calque, Fond, Format } from '../../../lib/studio/types';
import { CalqueRendu } from './Calque';

const SEUIL_MAGNETISME = 1.4; // en % du canevas
const CIBLES = [16.667, 33.333, 50, 66.667, 83.333]; // centre + tiers

const accrocher = (valeur: number): { valeur: number; accroche: boolean } => {
  for (const cible of CIBLES) {
    if (Math.abs(valeur - cible) < SEUIL_MAGNETISME) return { valeur: cible, accroche: true };
  }
  return { valeur, accroche: false };
};

type Poignee = 'nw' | 'ne' | 'sw' | 'se';

interface Props {
  format: Format;
  fond: Fond;
  calques: Calque[];
  editable: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onChange?: (calques: Calque[]) => void;
  maquetteTelephone?: boolean;
  className?: string;
}

export const Toile = React.forwardRef<HTMLDivElement, Props>(
  ({ format, fond, calques, editable, selectedId = null, onSelect, onChange, maquetteTelephone, className = '' }, refExterne) => {
    const boiteRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 0, h: 0 });
    const [guides, setGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
    const geste = useRef<{
      id: string;
      mode: 'deplacer' | Poignee;
      pointerId: number;
      startX: number;
      startY: number;
      calque: Calque;
    } | null>(null);

    // Le nœud rasterisé par l'export est celui-ci : on le remonte au parent tel quel.
    useEffect(() => {
      if (typeof refExterne === 'function') refExterne(boiteRef.current);
      else if (refExterne) (refExterne as React.MutableRefObject<HTMLDivElement | null>).current = boiteRef.current;
    });

    useEffect(() => {
      const noeud = boiteRef.current;
      if (!noeud) return;
      const observer = new ResizeObserver((entrees) => {
        const { width, height } = entrees[0].contentRect;
        setDims({ w: width, h: height });
      });
      observer.observe(noeud);
      return () => observer.disconnect();
    }, []);

    const majCalque = useCallback(
      (id: string, patch: Partial<Calque>) => {
        if (!onChange) return;
        onChange(calques.map((c) => (c.id === id ? ({ ...c, ...patch } as Calque) : c)));
      },
      [calques, onChange]
    );

    const finDeGeste = useCallback(() => {
      geste.current = null;
      setGuides({ x: null, y: null });
    }, []);

    const survolPointeur = useCallback(
      (e: PointerEvent) => {
        const g = geste.current;
        if (!g || dims.w === 0 || dims.h === 0) return;
        const dxPct = ((e.clientX - g.startX) / dims.w) * 100;
        const dyPct = ((e.clientY - g.startY) / dims.h) * 100;

        if (g.mode === 'deplacer') {
          const cible = g.calque as Calque;
          const xBrut = cible.xPct + dxPct;
          const yBrut = cible.yPct + dyPct;
          const ax = accrocher(xBrut);
          const ay = accrocher(yBrut);
          setGuides({ x: ax.accroche ? ax.valeur : null, y: ay.accroche ? ay.valeur : null });
          majCalque(g.id, {
            xPct: Math.min(100, Math.max(0, ax.valeur)),
            yPct: Math.min(100, Math.max(0, ay.valeur)),
          } as Partial<Calque>);
          return;
        }

        // Redimensionnement : le coin opposé à la poignée reste fixe.
        const c = g.calque as Calque;
        const gauche0 = c.xPct - c.wPct / 2;
        const droite0 = c.xPct + c.wPct / 2;
        const haut0 = c.yPct - c.hPct / 2;
        const bas0 = c.yPct + c.hPct / 2;
        const ancreX = g.mode.includes('w') ? droite0 : gauche0;
        const ancreY = g.mode.includes('n') ? bas0 : haut0;
        const pointX = Math.min(100, Math.max(0, (g.mode.includes('w') ? gauche0 : droite0) + dxPct));
        const pointY = Math.min(100, Math.max(0, (g.mode.includes('n') ? haut0 : bas0) + dyPct));
        const nvGauche = Math.min(ancreX, pointX);
        const nvDroite = Math.max(ancreX, pointX);
        const nvHaut = Math.min(ancreY, pointY);
        const nvBas = Math.max(ancreY, pointY);
        majCalque(g.id, {
          xPct: (nvGauche + nvDroite) / 2,
          yPct: (nvHaut + nvBas) / 2,
          wPct: Math.max(3, nvDroite - nvGauche),
          hPct: Math.max(c.type === 'forme' && c.forme === 'ligne' ? 0.3 : 3, nvBas - nvHaut),
        } as Partial<Calque>);
      },
      [dims, majCalque]
    );

    useEffect(() => {
      if (!editable) return;
      const up = () => finDeGeste();
      window.addEventListener('pointermove', survolPointeur);
      window.addEventListener('pointerup', up);
      return () => {
        window.removeEventListener('pointermove', survolPointeur);
        window.removeEventListener('pointerup', up);
      };
    }, [editable, survolPointeur, finDeGeste]);

    // Raccourcis clavier : flèches déplacent, Suppr retire, Ctrl/Cmd+D duplique.
    useEffect(() => {
      if (!editable || !onChange) return;
      const surTouche = (e: KeyboardEvent) => {
        const cible = e.target as HTMLElement | null;
        if (cible && ['INPUT', 'TEXTAREA', 'SELECT'].includes(cible.tagName)) return;
        if (!selectedId) return;
        const calque = calques.find((c) => c.id === selectedId);
        if (!calque) return;

        const pas = e.shiftKey ? 2 : 0.5;
        if (e.key === 'ArrowLeft') { e.preventDefault(); majCalque(selectedId, { xPct: Math.max(0, calque.xPct - pas) } as Partial<Calque>); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); majCalque(selectedId, { xPct: Math.min(100, calque.xPct + pas) } as Partial<Calque>); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); majCalque(selectedId, { yPct: Math.max(0, calque.yPct - pas) } as Partial<Calque>); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); majCalque(selectedId, { yPct: Math.min(100, calque.yPct + pas) } as Partial<Calque>); }
        else if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          onChange(calques.filter((c) => c.id !== selectedId));
          onSelect?.(null);
        } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          const copie: Calque = { ...calque, id: `${calque.id}-${Date.now().toString(36)}`, xPct: Math.min(96, calque.xPct + 3), yPct: Math.min(96, calque.yPct + 3) };
          onChange([...calques, copie]);
          onSelect?.(copie.id);
        }
      };
      window.addEventListener('keydown', surTouche);
      return () => window.removeEventListener('keydown', surTouche);
    }, [editable, onChange, onSelect, selectedId, calques, majCalque]);

    const amorcer = (calque: Calque, mode: 'deplacer' | Poignee) => (e: React.PointerEvent) => {
      if (!editable) return;
      e.stopPropagation();
      onSelect?.(calque.id);
      geste.current = { id: calque.id, mode, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, calque };
    };

    const calquesTries = [...calques].sort((a, b) => a.z - b.z);
    const filtreFond = fond.nb ? `grayscale(100%) brightness(${fond.luminositePct}%)` : `brightness(${fond.luminositePct}%)`;

    const contenu = (
      <div
        ref={boiteRef}
        className={`relative overflow-hidden bg-encre ${editable ? 'touch-none' : ''} ${className}`}
        style={{ aspectRatio: `${format.largeur} / ${format.hauteur}` }}
        onPointerDown={() => editable && onSelect?.(null)}
      >
        <img src={fond.src} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: filtreFond }} draggable={false} />

        {calquesTries.map((calque) => {
          const gauche = calque.xPct - calque.wPct / 2;
          const haut = calque.yPct - calque.hPct / 2;
          const selectionne = editable && selectedId === calque.id;
          return (
            <div
              key={calque.id}
              className={selectionne ? 'absolute outline outline-2 outline-rose-vif' : 'absolute'}
              style={{ left: `${gauche}%`, top: `${haut}%`, width: `${calque.wPct}%`, height: `${calque.hPct}%`, zIndex: calque.z, cursor: editable ? 'grab' : undefined }}
              onPointerDown={amorcer(calque, 'deplacer')}
            >
              <CalqueRendu calque={calque} hauteurAffichee={dims.h} />
              {selectionne &&
                (['nw', 'ne', 'sw', 'se'] as Poignee[]).map((coin) => (
                  <span
                    key={coin}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      amorcer(calque, coin)(e);
                    }}
                    className="absolute w-3 h-3 bg-papier border-2 border-rose-vif rounded-pilule"
                    style={{
                      left: coin.includes('w') ? -6 : undefined,
                      right: coin.includes('e') ? -6 : undefined,
                      top: coin.includes('n') ? -6 : undefined,
                      bottom: coin.includes('s') ? -6 : undefined,
                      cursor: coin === 'nw' || coin === 'se' ? 'nwse-resize' : 'nesw-resize',
                    }}
                  />
                ))}
            </div>
          );
        })}

        {editable && guides.x !== null && (
          <div className="absolute top-0 bottom-0 w-px bg-rose-vif pointer-events-none" style={{ left: `${guides.x}%` }} />
        )}
        {editable && guides.y !== null && (
          <div className="absolute left-0 right-0 h-px bg-rose-vif pointer-events-none" style={{ top: `${guides.y}%` }} />
        )}
      </div>
    );

    if (maquetteTelephone) {
      return (
        <div className="relative mx-auto" style={{ width: 'min(100%, 320px)' }}>
          <div className="rounded-[2.4rem] border-[10px] border-encre bg-encre shadow-panneau overflow-hidden">
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-16 h-4 bg-encre rounded-pilule z-10" />
            {contenu}
          </div>
        </div>
      );
    }

    return contenu;
  }
);
Toile.displayName = 'Toile';
