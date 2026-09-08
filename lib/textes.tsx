/**
 * Les textes du site, avec la couche que Laurie modifie elle-même.
 *
 * Chaque composant déclare ses textes de base dans le code (un objet { FR, EN } hissé au niveau du
 * module) et les lit par `useTextes(scope, TEXTES, lang)`. Le hook rend le même objet, langue choisie,
 * où chaque valeur peut être remplacée par une surcharge enregistrée dans Firestore (`settings/textes`,
 * forme { scope: { cle: { FR, EN } } }) ou par le brouillon en cours d'édition (components/Editeur.tsx).
 *
 * Les surcharges vivent hors du code : une nouvelle version du site garde les mots de Laurie tant que
 * la clé existe encore. Une clé qui disparaît du code cesse d'être lue, rien de plus. Pour ramener un
 * texte à sa version de base, la clé se retire de Firestore (bouton « Texte de base » de l'éditeur).
 *
 * Contrat des noms : scope et clé en lettres, chiffres et soulignés seulement (ils servent de chemins
 * Firestore, séparés par des points).
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Language } from '../types';

export type Bilingue = Record<Language, string>;
export type Defs = Record<Language, Record<string, string>>;
/** scope → clé → { FR?, EN? } */
export type Surcharges = Record<string, Record<string, Partial<Bilingue>>>;
/** Brouillon en cours : `null` sur une clé veut dire « revenir au texte de base ». */
export type Brouillon = Record<string, Record<string, Partial<Bilingue> | null>>;

export const CHEMIN_TEXTES = 'settings/textes';
const CLE_CACHE = 'xena.textes';
const LANGUES: Language[] = ['FR', 'EN'];
const NOM_VALIDE = /^[A-Za-z0-9_]+$/;

export type Registre = Map<string, Map<string, Bilingue>>;

export interface TextesCtx {
  surcharges: Surcharges;
  brouillon: Brouillon;
  edition: boolean;
  registre: React.RefObject<Registre>;
  versionRegistre: number;
  enregistrer: (scope: string, defs: Defs) => void;
  effectif: (scope: string, cle: string, lang: Language) => string | undefined;
  basculerEdition: (on: boolean) => void;
  brouillonner: (scope: string, cle: string, valeur: Partial<Bilingue> | null) => void;
  abandonner: () => void;
  sauvegarder: () => Promise<void>;
  nbModifs: number;
}

const Ctx = createContext<TextesCtx | null>(null);

const lireCache = (): Surcharges => {
  try {
    const brut = window.localStorage.getItem(CLE_CACHE);
    return brut ? (JSON.parse(brut) as Surcharges) : {};
  } catch {
    return {};
  }
};

const ecrireCache = (s: Surcharges): void => {
  try {
    window.localStorage.setItem(CLE_CACHE, JSON.stringify(s));
  } catch {
    /* stockage bloqué : la prochaine visite relira Firestore */
  }
};

export const TextesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Le cache local évite l'éclair du texte de base avant que Firestore réponde.
  const [surcharges, setSurcharges] = useState<Surcharges>(() => (typeof window === 'undefined' ? {} : lireCache()));
  const [brouillon, setBrouillon] = useState<Brouillon>({});
  const [edition, setEdition] = useState(false);
  const registre = useRef<Registre>(new Map());
  const [versionRegistre, setVersionRegistre] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, CHEMIN_TEXTES),
      (snap) => {
        const data = (snap.data() ?? {}) as Record<string, unknown>;
        const propres: Surcharges = {};
        for (const [scope, cles] of Object.entries(data)) {
          if (scope.startsWith('_') || !cles || typeof cles !== 'object') continue;
          propres[scope] = cles as Record<string, Partial<Bilingue>>;
        }
        setSurcharges(propres);
        ecrireCache(propres);
      },
      () => {
        /* hors ligne ou règles fermées : le cache et les textes de base font le travail */
      }
    );
    return () => unsub();
  }, []);

  const enregistrer = useCallback((scope: string, defs: Defs) => {
    if (import.meta.env.DEV && !NOM_VALIDE.test(scope)) {
      throw new Error(`useTextes : scope « ${scope} » invalide (lettres, chiffres, soulignés seulement)`);
    }
    let bouge = false;
    let carte = registre.current.get(scope);
    if (!carte) {
      carte = new Map();
      registre.current.set(scope, carte);
      bouge = true;
    }
    for (const cle of Object.keys(defs.FR)) {
      if (import.meta.env.DEV && !NOM_VALIDE.test(cle)) {
        throw new Error(`useTextes : clé « ${scope}.${cle} » invalide (lettres, chiffres, soulignés seulement)`);
      }
      const val: Bilingue = { FR: defs.FR[cle] ?? '', EN: defs.EN[cle] ?? defs.FR[cle] ?? '' };
      const ancien = carte.get(cle);
      if (!ancien || ancien.FR !== val.FR || ancien.EN !== val.EN) {
        carte.set(cle, val);
        bouge = true;
      }
    }
    if (bouge) setVersionRegistre((v) => v + 1);
  }, []);

  const effectif = useCallback(
    (scope: string, cle: string, lang: Language): string | undefined => {
      const b = brouillon[scope]?.[cle];
      if (b === null) return undefined;
      if (b && b[lang] !== undefined) return b[lang];
      const s = surcharges[scope]?.[cle]?.[lang];
      return typeof s === 'string' ? s : undefined;
    },
    [brouillon, surcharges]
  );

  const brouillonner = useCallback((scope: string, cle: string, valeur: Partial<Bilingue> | null) => {
    setBrouillon((prev) => {
      const scopePrev = prev[scope] ?? {};
      const courant = scopePrev[cle];
      const suivant = valeur === null ? null : { ...(courant ?? {}), ...valeur };
      return { ...prev, [scope]: { ...scopePrev, [cle]: suivant } };
    });
  }, []);

  const abandonner = useCallback(() => setBrouillon({}), []);

  const sauvegarder = useCallback(async () => {
    const ref = doc(db, CHEMIN_TEXTES);
    const patch: Record<string, unknown> = { _maj: serverTimestamp() };
    for (const [scope, cles] of Object.entries(brouillon)) {
      for (const [cle, val] of Object.entries(cles)) {
        if (val === null) {
          patch[`${scope}.${cle}`] = deleteField();
          continue;
        }
        const base = registre.current.get(scope)?.get(cle);
        for (const lang of LANGUES) {
          const v = val[lang];
          if (v === undefined) continue;
          // Un texte ramené à sa version de base ne laisse pas de surcharge derrière lui.
          patch[`${scope}.${cle}.${lang}`] = base && v === base[lang] ? deleteField() : v;
        }
      }
    }
    // Le document doit exister pour recevoir un updateDoc à chemins pointés.
    await setDoc(ref, { _maj: serverTimestamp() }, { merge: true });
    await updateDoc(ref, patch);
    setBrouillon({});
  }, [brouillon]);

  const nbModifs = useMemo(
    () => Object.values(brouillon).reduce((n: number, cles) => n + Object.keys(cles).length, 0),
    [brouillon]
  );

  const valeur = useMemo<TextesCtx>(
    () => ({
      surcharges,
      brouillon,
      edition,
      registre,
      versionRegistre,
      enregistrer,
      effectif,
      basculerEdition: setEdition,
      brouillonner,
      abandonner,
      sauvegarder,
      nbModifs,
    }),
    [surcharges, brouillon, edition, versionRegistre, enregistrer, effectif, brouillonner, abandonner, sauvegarder, nbModifs]
  );

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
};

export const useTextesCtx = (): TextesCtx | null => useContext(Ctx);

/**
 * Les textes d'un composant, dans la langue voulue, surcharges comprises.
 *
 *   const TEXTES = { FR: { titre: 'Bonjour' }, EN: { titre: 'Hello' } };   // hissé au niveau du module
 *   const t = useTextes('porte', TEXTES, lang);   // t.titre
 *
 * Poser `data-tx-scope="porte"` sur la racine du composant : l'éditeur s'en sert pour retrouver la
 * bonne clé quand le même mot apparaît dans deux blocs (« Contact » dans la barre et le pied de page).
 */
export function useTextes<D extends Defs>(scope: string, defs: D, lang: Language): D[Language] {
  const ctx = useContext(Ctx);
  const enregistrer = ctx?.enregistrer;
  useEffect(() => {
    enregistrer?.(scope, defs);
  }, [enregistrer, scope, defs]);

  return useMemo(() => {
    const base = defs[lang] as Record<string, string>;
    if (!ctx) return base as D[Language];
    const out: Record<string, string> = { ...base };
    for (const cle of Object.keys(base)) {
      const v = ctx.effectif(scope, cle, lang);
      if (v !== undefined) out[cle] = v;
    }
    return out as D[Language];
  }, [ctx, scope, defs, lang]);
}

/** Un seul texte bilingue, même mécanique. */
export function useTexte(scope: string, cle: string, valeurs: Bilingue, lang: Language): string {
  const defs = useMemo<Defs>(() => ({ FR: { [cle]: valeurs.FR }, EN: { [cle]: valeurs.EN } }), [cle, valeurs.FR, valeurs.EN]);
  return useTextes(scope, defs, lang)[cle];
}
