// L'échelle de valeur (Admin > Offres) : trois vues, un zoom et des colonnes qui se redimensionnent,
// pour qu'on voie enfin jusqu'à Elite sans deviner. Voir CANON-ADMIN.md pour les jetons de style.
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Bouton, Etiquette, Panneau, Vide } from '../ui';
import { CarteOffre } from './CarteOffre';
import type { Product, Language } from '../../../types';

export type VueOffres = 'ajustee' | 'defilement' | 'compacte';

export interface PalierOffres {
  label: string;
  min: number;
  max: number;
  color: string;
  products: Product[];
}

export interface TexteOffres {
  product: string;
  service: string;
  free: string;
  publish: string;
  unpublish: string;
  online: string;
  empty: string;
  addHere: string;
  vueLabel: string;
  vueAjustee: string;
  vueDefilement: string;
  vueCompacte: string;
  zoomLabel: string;
  toutVoir: string;
  defilerGauche: string;
  defilerDroite: string;
  redimensionner: string;
}

interface Prefs {
  vue: VueOffres;
  zoom: number;
  largeurColonne: number;
}

const CLE_PREFS = 'xena.offres.vue';
const PREFS_DEFAUT: Prefs = { vue: 'ajustee', zoom: 1, largeurColonne: 280 };
const LARGEUR_MIN = 200;
const LARGEUR_MAX = 420;
const GAP = 16; // gap-4

const lirePrefs = (): Prefs => {
  try {
    const brut = localStorage.getItem(CLE_PREFS);
    if (!brut) return PREFS_DEFAUT;
    return { ...PREFS_DEFAUT, ...JSON.parse(brut) };
  } catch {
    return PREFS_DEFAUT;
  }
};

// La poignée entre deux colonnes : elle règle la même largeur pour toutes les colonnes à la fois.
const PoigneeRedimension: React.FC<{ largeur: number; onChange: (v: number) => void; aria: string }> = ({
  largeur,
  onChange,
  aria,
}) => {
  const debut = useRef<{ x: number; largeur: number } | null>(null);

  return (
    <div
      role="separator"
      aria-label={aria}
      aria-orientation="vertical"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        debut.current = { x: e.clientX, largeur };
      }}
      onPointerMove={(e) => {
        if (!debut.current) return;
        const delta = e.clientX - debut.current.x;
        onChange(Math.min(LARGEUR_MAX, Math.max(LARGEUR_MIN, debut.current.largeur + delta)));
      }}
      onPointerUp={() => {
        debut.current = null;
      }}
      className="w-3 flex-shrink-0 cursor-col-resize touch-none flex items-center justify-center group"
    >
      <span className="w-px h-10 bg-filet group-hover:bg-rose transition-colors" />
    </div>
  );
};

const Colonne: React.FC<{
  palier: PalierOffres;
  lang: Language;
  t: TexteOffres;
  onOpen: (p: Product) => void;
  onQuickAdd: (palier: PalierOffres) => void;
  onTogglePublish: (e: React.MouseEvent, p: Product) => void;
}> = ({ palier, lang, t, onOpen, onQuickAdd, onTogglePublish }) => (
  <div className="flex flex-col gap-3 h-full">
    <div className="flex items-center justify-between px-3 py-2 bg-papier-2 border border-filet rounded-champ">
      <h3 className="kicker text-gris">{palier.label}</h3>
      <Etiquette tone="neutre">{palier.products.length}</Etiquette>
    </div>
    <div className="flex-1 bg-papier border border-filet rounded-champ p-3 space-y-3">
      {palier.products.length === 0 ? (
        <Vide titre={t.empty} />
      ) : (
        palier.products.map((p) => (
          <CarteOffre key={p.id} produit={p} lang={lang} t={t} onOpen={onOpen} onTogglePublish={onTogglePublish} />
        ))
      )}
      <Bouton variante="discret" icone={Plus} onClick={() => onQuickAdd(palier)} className="w-full">
        {t.addHere}
      </Bouton>
    </div>
  </div>
);

interface EchelleValeurProps {
  paliers: PalierOffres[];
  lang: Language;
  t: TexteOffres;
  onOpen: (p: Product) => void;
  onQuickAdd: (palier: PalierOffres) => void;
  onTogglePublish: (e: React.MouseEvent, p: Product) => void;
}

export const EchelleValeur: React.FC<EchelleValeurProps> = ({ paliers, lang, t, onOpen, onQuickAdd, onTogglePublish }) => {
  const [prefs, setPrefs] = useState<Prefs>(lirePrefs);
  const [scrollPct, setScrollPct] = useState(0);
  const [tierActif, setTierActif] = useState(0);
  const refCadre = useRef<HTMLDivElement>(null);
  const refDefilement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CLE_PREFS, JSON.stringify(prefs));
    } catch {
      // stockage indisponible (navigation privée) : les préférences ne survivent pas à la session
    }
  }, [prefs]);

  const zoomActif = prefs.vue !== 'compacte';
  const palierActif = paliers[Math.min(tierActif, paliers.length - 1)] ?? paliers[0];

  const toutVoir = () => {
    if (!refCadre.current) return;
    const disponible = refCadre.current.clientWidth;
    const naturel = paliers.length * prefs.largeurColonne + (paliers.length - 1) * GAP;
    if (naturel <= 0) return;
    const prochain = Math.min(1.2, Math.max(0.6, disponible / naturel));
    setPrefs((p) => ({ ...p, zoom: Math.round(prochain * 100) / 100 }));
  };

  const defiler = (sens: 1 | -1) => {
    refDefilement.current?.scrollBy({ left: sens * (prefs.largeurColonne + GAP), behavior: 'smooth' });
  };

  const surDefilement = () => {
    const el = refDefilement.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPct(max <= 0 ? 0 : el.scrollLeft / max);
  };

  return (
    <div className="space-y-4">
      {/* Desktop : barre d'outils + vue choisie */}
      <div className="hidden md:block space-y-4">
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-papier-2 border border-filet rounded-champ">
          <div className="flex items-center gap-1" role="tablist" aria-label={t.vueLabel}>
            {([
              ['ajustee', t.vueAjustee],
              ['defilement', t.vueDefilement],
              ['compacte', t.vueCompacte],
            ] as [VueOffres, string][]).map(([id, label]) => (
              <Bouton
                key={id}
                petit
                variante={prefs.vue === id ? 'primaire' : 'secondaire'}
                onClick={() => setPrefs((p) => ({ ...p, vue: id }))}
                aria-pressed={prefs.vue === id}
              >
                {label}
              </Bouton>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-xs">
            <label htmlFor="offres-zoom" className="text-petit font-semibold text-encre flex-shrink-0">
              {t.zoomLabel}
            </label>
            <input
              id="offres-zoom"
              type="range"
              min={0.6}
              max={1.2}
              step={0.05}
              value={prefs.zoom}
              disabled={!zoomActif}
              onChange={(e) => setPrefs((p) => ({ ...p, zoom: parseFloat(e.target.value) }))}
              className="flex-1 accent-rose disabled:opacity-40"
            />
            <span className="text-xs text-gris tabular-nums w-10 flex-shrink-0">{Math.round(prefs.zoom * 100)}%</span>
          </div>

          <Bouton petit variante="secondaire" onClick={toutVoir} disabled={!zoomActif}>
            {t.toutVoir}
          </Bouton>
        </div>

        {prefs.vue === 'ajustee' && (
          <div ref={refCadre} className="overflow-hidden">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${prefs.largeurColonne}px, 1fr))`, zoom: prefs.zoom }}
            >
              {paliers.map((palier, idx) => (
                <Colonne
                  key={idx}
                  palier={palier}
                  lang={lang}
                  t={t}
                  onOpen={onOpen}
                  onQuickAdd={onQuickAdd}
                  onTogglePublish={onTogglePublish}
                />
              ))}
            </div>
          </div>
        )}

        {prefs.vue === 'defilement' && (
          <div ref={refCadre} className="space-y-2">
            <div ref={refDefilement} onScroll={surDefilement} className="overflow-x-auto pb-2">
              <div className="flex" style={{ zoom: prefs.zoom }}>
                {paliers.map((palier, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <PoigneeRedimension
                        largeur={prefs.largeurColonne}
                        onChange={(v) => setPrefs((p) => ({ ...p, largeurColonne: v }))}
                        aria={t.redimensionner}
                      />
                    )}
                    <div style={{ width: prefs.largeurColonne }} className="flex-shrink-0">
                      <Colonne
                        palier={palier}
                        lang={lang}
                        t={t}
                        onOpen={onOpen}
                        onQuickAdd={onQuickAdd}
                        onTogglePublish={onTogglePublish}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => defiler(-1)}
                disabled={scrollPct <= 0.01}
                aria-label={t.defilerGauche}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-pilule border border-filet text-gris hover:text-encre disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 h-1 bg-filet rounded-pilule overflow-hidden">
                <div
                  className="h-full bg-rose rounded-pilule transition-[width]"
                  style={{ width: `${Math.max(8, scrollPct * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => defiler(1)}
                disabled={scrollPct >= 0.99}
                aria-label={t.defilerDroite}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-pilule border border-filet text-gris hover:text-encre disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {prefs.vue === 'compacte' && (
          <div className="space-y-4">
            {paliers.map((palier, idx) => (
              <Panneau key={idx} titre={`${palier.label} · ${palier.products.length}`}>
                {palier.products.length === 0 ? (
                  <Vide titre={t.empty} />
                ) : (
                  <div className="divide-y divide-filet">
                    {palier.products.map((p) => (
                      <CarteOffre key={p.id} produit={p} lang={lang} t={t} compact onOpen={onOpen} onTogglePublish={onTogglePublish} />
                    ))}
                  </div>
                )}
              </Panneau>
            ))}
          </div>
        )}
      </div>

      {/* Mobile : un onglet par palier, une colonne à la fois */}
      <div className="md:hidden space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6">
          {paliers.map((palier, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTierActif(idx)}
              className={`flex-shrink-0 rounded-pilule px-4 py-2 text-sm font-medium transition-colors ${
                tierActif === idx ? 'bg-encre text-papier' : 'border border-filet text-gris'
              }`}
            >
              {palier.label} <span className="opacity-70">({palier.products.length})</span>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {palierActif.products.length === 0 ? (
            <Vide titre={t.empty} />
          ) : (
            palierActif.products.map((p) => (
              <CarteOffre key={p.id} produit={p} lang={lang} t={t} onOpen={onOpen} onTogglePublish={onTogglePublish} />
            ))
          )}
          <Bouton variante="discret" icone={Plus} onClick={() => onQuickAdd(palierActif)} className="w-full">
            {t.addHere}
          </Bouton>
        </div>
      </div>
    </div>
  );
};
