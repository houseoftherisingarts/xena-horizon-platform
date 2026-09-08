/**
 * Le cadrage des photos du site, avec la couche que Laurie règle elle-même.
 *
 * Chaque photo publique déclare un identifiant par `useCadrage(id, defaut)` et pose ce que le hook
 * rend sur son <img> : `data-cadre` (repère pour le crayon) et `style` (point focal en object-position,
 * zoom en `scale` avec l'origine sur le point focal). Le crayon (components/Editeur.tsx) ouvre une
 * fenêtre où elle déplace le point focal et règle le zoom; « Enregistrer » écrit dans Firestore
 * `settings/cadrages`, forme { id: { x, y, z } } (x et y en pour cent, z de 1 à 3).
 *
 * Même logique que lib/textes.tsx : le code est la version de base, une surcharge survit aux
 * redéploiements tant que l'identifiant existe, « Photo de base » la retire.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Cadre {
  /** Point focal horizontal, en pour cent (0 = bord gauche, 100 = bord droit). */
  x: number;
  /** Point focal vertical, en pour cent. */
  y: number;
  /** Zoom, 1 = photo entière telle que cadrée par le code. */
  z: number;
}

export const CHEMIN_CADRAGES = 'settings/cadrages';
const CLE_CACHE = 'xena.cadrages';
export const ZOOM_MAX = 3;
const CADRE_DEFAUT: Cadre = { x: 50, y: 50, z: 1 };

const borne = (v: unknown, min: number, max: number, defaut: number): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : defaut;
};

const propre = (c: unknown): Cadre | undefined => {
  if (!c || typeof c !== 'object') return undefined;
  const o = c as Record<string, unknown>;
  return { x: borne(o.x, 0, 100, 50), y: borne(o.y, 0, 100, 50), z: borne(o.z, 1, ZOOM_MAX, 1) };
};

/** `'50% 22%'` → { x: 50, y: 22, z: 1 }. Les mots-clés CSS usuels sont compris. */
export const cadreDepuisPosition = (position?: string): Cadre => {
  if (!position) return CADRE_DEFAUT;
  const mots: Record<string, number> = { left: 0, top: 0, center: 50, right: 100, bottom: 100 };
  const [a = '50%', b = '50%'] = position.trim().split(/\s+/);
  const lire = (m: string) => (m in mots ? mots[m] : borne(Number.parseFloat(m), 0, 100, 50));
  return { x: lire(a), y: lire(b), z: 1 };
};

export interface CadragesCtx {
  surcharges: Record<string, Cadre>;
  brouillon: Record<string, Cadre | null>;
  effectif: (id: string) => Cadre | undefined;
  brouillonner: (id: string, cadre: Cadre | null) => void;
  abandonner: () => void;
  sauvegarder: () => Promise<void>;
  nbModifs: number;
}

const Ctx = createContext<CadragesCtx | null>(null);

const lireCache = (): Record<string, Cadre> => {
  try {
    const brut = window.localStorage.getItem(CLE_CACHE);
    return brut ? (JSON.parse(brut) as Record<string, Cadre>) : {};
  } catch {
    return {};
  }
};

export const CadragesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surcharges, setSurcharges] = useState<Record<string, Cadre>>(() => (typeof window === 'undefined' ? {} : lireCache()));
  const [brouillon, setBrouillon] = useState<Record<string, Cadre | null>>({});

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, CHEMIN_CADRAGES),
      (snap) => {
        const data = (snap.data() ?? {}) as Record<string, unknown>;
        const propres: Record<string, Cadre> = {};
        for (const [id, c] of Object.entries(data)) {
          if (id.startsWith('_')) continue;
          const cadre = propre(c);
          if (cadre) propres[id] = cadre;
        }
        setSurcharges(propres);
        try {
          window.localStorage.setItem(CLE_CACHE, JSON.stringify(propres));
        } catch {
          /* stockage bloqué */
        }
      },
      () => {
        /* hors ligne : le cache et les cadrages de base font le travail */
      }
    );
    return () => unsub();
  }, []);

  const effectif = useCallback(
    (id: string): Cadre | undefined => {
      const b = brouillon[id];
      if (b === null) return undefined;
      return b ?? surcharges[id];
    },
    [brouillon, surcharges]
  );

  const brouillonner = useCallback((id: string, cadre: Cadre | null) => {
    setBrouillon((prev) => ({ ...prev, [id]: cadre }));
  }, []);

  const abandonner = useCallback(() => setBrouillon({}), []);

  const sauvegarder = useCallback(async () => {
    if (Object.keys(brouillon).length === 0) return;
    const ref = doc(db, CHEMIN_CADRAGES);
    const patch: Record<string, unknown> = { _maj: serverTimestamp() };
    for (const [id, c] of Object.entries(brouillon)) {
      patch[id] = c === null ? deleteField() : { x: Math.round(c.x * 10) / 10, y: Math.round(c.y * 10) / 10, z: Math.round(c.z * 100) / 100 };
    }
    await setDoc(ref, { _maj: serverTimestamp() }, { merge: true });
    await updateDoc(ref, patch);
    setBrouillon({});
  }, [brouillon]);

  const nbModifs = Object.keys(brouillon).length;

  const valeur = useMemo<CadragesCtx>(
    () => ({ surcharges, brouillon, effectif, brouillonner, abandonner, sauvegarder, nbModifs }),
    [surcharges, brouillon, effectif, brouillonner, abandonner, sauvegarder, nbModifs]
  );

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
};

export const useCadragesCtx = (): CadragesCtx | null => useContext(Ctx);

export interface CadrageRendu {
  /** Le cadre effectif (surcharge, brouillon ou défaut). */
  cadre: Cadre;
  /** À poser sur le <img> : object-position, zoom et origine du zoom. */
  style: React.CSSProperties;
  /** À poser sur le <img> : le repère du crayon. */
  'data-cadre': string;
}

/**
 * Le cadrage d'une photo. `defaut` est l'`object-position` que le code lui donnait déjà.
 *
 *   const cadre = useCadrage('accueil_hero', '50% 22%');
 *   <img {...cadre} src=... className="object-cover" />
 *
 * Le parent doit rogner (`overflow-hidden`) : le zoom agrandit l'image au-delà de sa boîte.
 */
export function useCadrage(id: string, defaut?: string): CadrageRendu {
  const ctx = useContext(Ctx);
  const base = useMemo(() => cadreDepuisPosition(defaut), [defaut]);
  const cadre = ctx?.effectif(id) ?? base;
  return useMemo(
    () => ({
      cadre,
      'data-cadre': id,
      style: {
        objectPosition: `${cadre.x}% ${cadre.y}%`,
        transformOrigin: `${cadre.x}% ${cadre.y}%`,
        ...(cadre.z !== 1 ? { scale: String(cadre.z) } : {}),
      },
    }),
    [id, cadre]
  );
}
