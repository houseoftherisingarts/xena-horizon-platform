/**
 * Le crayon de Laurie. Visible seulement pour un compte admin, en haut à droite de toutes les pages.
 * Un clic ouvre le mode d'édition : chaque texte déclaré par `useTextes` reçoit un liseré, un clic
 * dessus ouvre une petite fenêtre pour le récrire (FR et EN), « Appliquer » le montre tout de suite
 * dans la page, « Enregistrer » l'écrit dans Firestore pour de bon.
 *
 * Le repérage se fait par la valeur : à l'entrée en édition (et à chaque changement du DOM ensuite),
 * les éléments dont le texte affiché, l'aria-label ou le placeholder correspond à un texte déclaré
 * reçoivent `data-tx="scope|cle"`. Aucun composant n'a à baliser ses éléments un par un.
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Check, PencilLine, RotateCcw, X } from 'lucide-react';
import { useTextesCtx } from '../lib/textes';
import type { Language } from '../types';

const norm = (s: string): string => s.replace(/\s+/g, ' ').trim();
const IGNORES = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'BR', 'IMG', 'VIDEO', 'NOSCRIPT']);

type Cle = { scope: string; cle: string };

interface Cible {
  scope: string;
  cle: string;
  el: HTMLElement;
}

const t = {
  FR: {
    ouvrir: 'Modifier les textes de la page',
    fermer: "Quitter l'édition",
    mode: 'Modification des textes',
    aucune: 'Aucun changement',
    n: (n: number) => (n === 1 ? '1 changement' : `${n} changements`),
    enregistrer: 'Enregistrer',
    enregistrement: 'Enregistrement…',
    annuler: 'Annuler',
    appliquer: 'Appliquer',
    base: 'Texte de base',
    fermerFenetre: 'Fermer',
    aide: 'Ctrl + Entrée pour appliquer',
    enregistre: 'Textes enregistrés.',
    erreur: "L'enregistrement n'a pas fonctionné. Réessaie.",
    indice: 'Clique sur un texte pour le modifier.',
  },
  EN: {
    ouvrir: 'Edit the texts on this page',
    fermer: 'Leave editing',
    mode: 'Editing texts',
    aucune: 'No changes',
    n: (n: number) => (n === 1 ? '1 change' : `${n} changes`),
    enregistrer: 'Save',
    enregistrement: 'Saving…',
    annuler: 'Cancel',
    appliquer: 'Apply',
    base: 'Base text',
    fermerFenetre: 'Close',
    aide: 'Ctrl + Enter to apply',
    enregistre: 'Texts saved.',
    erreur: 'Saving failed. Try again.',
    indice: 'Click on a text to edit it.',
  },
};

const Editeur: React.FC<{ lang: Language }> = ({ lang }) => {
  const ctx = useTextesCtx();
  const L = t[lang];
  const [cible, setCible] = useState<Cible | null>(null);
  const [langEdit, setLangEdit] = useState<Language>(lang);
  const [valeur, setValeur] = useState('');
  const [busy, setBusy] = useState(false);
  const [avis, setAvis] = useState<string | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const zoneRef = useRef<HTMLTextAreaElement>(null);

  const edition = !!ctx?.edition;

  // Index valeur affichée → clés, reconstruit quand le registre, les surcharges ou le brouillon bougent.
  const index = useMemo(() => {
    const m = new Map<string, Cle[]>();
    if (!ctx) return m;
    ctx.registre.current?.forEach((cles, scope) => {
      cles.forEach((_base, cle) => {
        const v = ctx.effectif(scope, cle, lang) ?? _base[lang];
        if (!v) return;
        for (const variante of new Set([norm(v), norm(v.replace(/\n/g, '')), norm(v.replace(/\n/g, ' '))])) {
          if (!variante) continue;
          const liste = m.get(variante) ?? [];
          liste.push({ scope, cle });
          m.set(variante, liste);
        }
      });
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, ctx?.versionRegistre, ctx?.surcharges, ctx?.brouillon, lang]);

  const etiqueter = useCallback(() => {
    const racine = document.body;
    racine.querySelectorAll('[data-tx]').forEach((el) => el.removeAttribute('data-tx'));
    if (!edition || index.size === 0) return;
    const valeurs = new WeakMap<Element, string>();
    const tous = Array.from(racine.querySelectorAll<HTMLElement>('*'));
    // Parcours à rebours : un descendant est toujours vu avant son ancêtre, donc l'élément le plus
    // profond qui porte le texte gagne, et l'ancêtre qui contient le même texte s'efface.
    for (let i = tous.length - 1; i >= 0; i--) {
      const el = tous[i];
      if (IGNORES.has(el.tagName) || el.closest('[data-editeur]')) continue;
      const candidats: string[] = [];
      const aria = el.getAttribute('aria-label');
      if (aria) candidats.push(aria);
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el.placeholder) candidats.push(el.placeholder);
      } else {
        candidats.push(el.textContent ?? '');
      }
      for (const brut of candidats) {
        const n = norm(brut);
        if (!n || n.length > 2000) continue;
        const liste = index.get(n);
        if (!liste) continue;
        let dejaPris = false;
        el.querySelectorAll('[data-tx]').forEach((d) => {
          if (valeurs.get(d) === n) dejaPris = true;
        });
        if (dejaPris) continue;
        const scopeProche = el.closest('[data-tx-scope]')?.getAttribute('data-tx-scope') ?? null;
        const choix = liste.find((k) => k.scope === scopeProche) ?? liste[0];
        el.setAttribute('data-tx', `${choix.scope}|${choix.cle}`);
        valeurs.set(el, n);
        break;
      }
    }
  }, [edition, index]);

  // Balisage à l'entrée en édition, puis à chaque mutation du DOM (textes qui changent, sections qui entrent).
  useEffect(() => {
    if (!edition) {
      document.body.classList.remove('mode-edition');
      document.body.querySelectorAll('[data-tx]').forEach((el) => el.removeAttribute('data-tx'));
      return;
    }
    document.body.classList.add('mode-edition');
    etiqueter();
    let minuterie: number | undefined;
    const obs = new MutationObserver((mutations) => {
      // Ignorer nos propres attributs pour ne pas boucler.
      if (mutations.every((m) => m.type === 'attributes' && (m.attributeName === 'data-tx' || m.attributeName === 'data-tx-actif'))) return;
      window.clearTimeout(minuterie);
      minuterie = window.setTimeout(etiqueter, 150);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder'] });
    return () => {
      obs.disconnect();
      window.clearTimeout(minuterie);
      document.body.classList.remove('mode-edition');
    };
  }, [edition, etiqueter]);

  // En édition, un clic sur un texte balisé ouvre la fenêtre au lieu de suivre le lien ou d'envoyer le formulaire.
  useEffect(() => {
    if (!edition) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('[data-editeur]')) return;
      const el = target.closest<HTMLElement>('[data-tx]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const [scope, cle] = (el.getAttribute('data-tx') ?? '|').split('|');
      if (!scope || !cle) return;
      document.querySelectorAll('[data-tx-actif]').forEach((d) => d.removeAttribute('data-tx-actif'));
      el.setAttribute('data-tx-actif', '');
      setCible({ scope, cle, el });
      setLangEdit(lang);
      setRect(el.getBoundingClientRect());
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [edition, lang]);

  // La valeur affichée dans la zone suit la cible et la langue en cours d'édition.
  useEffect(() => {
    if (!cible || !ctx) return;
    const base = ctx.registre.current?.get(cible.scope)?.get(cible.cle);
    setValeur(ctx.effectif(cible.scope, cible.cle, langEdit) ?? base?.[langEdit] ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cible, langEdit]);

  useLayoutEffect(() => {
    const z = zoneRef.current;
    if (!z) return;
    z.style.height = 'auto';
    z.style.height = `${Math.min(z.scrollHeight, 320)}px`;
  }, [valeur, cible]);

  // La fenêtre suit son élément au défilement et au redimensionnement.
  useEffect(() => {
    if (!cible) return;
    const suivre = () => setRect(cible.el.getBoundingClientRect());
    window.addEventListener('scroll', suivre, { passive: true });
    window.addEventListener('resize', suivre);
    return () => {
      window.removeEventListener('scroll', suivre);
      window.removeEventListener('resize', suivre);
    };
  }, [cible]);

  const fermerFenetre = useCallback(() => {
    document.querySelectorAll('[data-tx-actif]').forEach((d) => d.removeAttribute('data-tx-actif'));
    setCible(null);
  }, []);

  useEffect(() => {
    if (!cible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermerFenetre();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cible, fermerFenetre]);

  if (!ctx) return null;

  const appliquer = () => {
    if (!cible) return;
    ctx.brouillonner(cible.scope, cible.cle, { [langEdit]: valeur } as Partial<Record<Language, string>>);
  };

  const remettreBase = () => {
    if (!cible) return;
    ctx.brouillonner(cible.scope, cible.cle, null);
    const base = ctx.registre.current?.get(cible.scope)?.get(cible.cle);
    setValeur(base?.[langEdit] ?? '');
  };

  const enregistrer = async () => {
    if (busy) return;
    setBusy(true);
    setAvis(null);
    try {
      await ctx.sauvegarder();
      fermerFenetre();
      ctx.basculerEdition(false);
      setAvis(L.enregistre);
      window.setTimeout(() => setAvis(null), 2600);
    } catch (err) {
      console.error('Enregistrement des textes', err);
      setAvis(L.erreur);
    } finally {
      setBusy(false);
    }
  };

  const annuler = () => {
    ctx.abandonner();
    fermerFenetre();
    ctx.basculerEdition(false);
  };

  const surcharge = cible ? ctx.surcharges[cible.scope]?.[cible.cle] : undefined;
  const brouillonCle = cible ? ctx.brouillon[cible.scope]?.[cible.cle] : undefined;
  const peutRemettre = !!(surcharge && Object.keys(surcharge).length) || (brouillonCle !== undefined && brouillonCle !== null);

  // Position de la fenêtre : sous l'élément, au-dessus s'il manque de place, jamais hors de l'écran.
  const largeur = Math.min(440, (typeof window !== 'undefined' ? window.innerWidth : 440) - 24);
  let top = 0;
  let left = 12;
  if (rect && typeof window !== 'undefined') {
    const h = 300;
    top = rect.bottom + 10 + h > window.innerHeight ? Math.max(12, rect.top - 10 - h) : rect.bottom + 10;
    left = Math.min(Math.max(12, rect.left), window.innerWidth - largeur - 12);
  }

  return (
    <div data-editeur="" className="print:hidden">
      {/* Le crayon, ou la barre d'édition */}
      <div
        className="fixed z-[100] right-[max(1rem,env(safe-area-inset-right))] flex items-center gap-2"
        style={{ top: 'calc(var(--nav) + 0.75rem)' }}
      >
        {edition ? (
          <div className="flex items-center gap-2 rounded-pilule border border-filet bg-papier/95 backdrop-blur-md px-2 py-1.5 shadow-panneau">
            <span className="hidden sm:flex items-center gap-2 pl-2 text-petit text-encre">
              <PencilLine className="w-4 h-4 text-rose" aria-hidden="true" />
              {L.mode}
            </span>
            <span className="kicker text-gris px-2">{ctx.nbModifs ? L.n(ctx.nbModifs) : L.aucune}</span>
            <button
              type="button"
              onClick={enregistrer}
              disabled={busy || ctx.nbModifs === 0}
              className="min-h-[40px] px-4 rounded-pilule bg-encre text-papier text-sm font-medium hover:bg-encre-2 disabled:opacity-40 flex items-center gap-2"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              {busy ? L.enregistrement : L.enregistrer}
            </button>
            <button
              type="button"
              onClick={annuler}
              aria-label={L.fermer}
              title={L.fermer}
              className="w-10 h-10 rounded-pilule border border-filet text-encre hover:border-encre flex items-center justify-center"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => ctx.basculerEdition(true)}
            aria-label={L.ouvrir}
            title={L.ouvrir}
            className="w-11 h-11 rounded-pilule bg-encre text-papier shadow-panneau flex items-center justify-center hover:bg-rose transition-colors"
          >
            <PencilLine className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        {avis && (
          <span role="status" className="rounded-pilule border border-filet bg-papier px-3 py-2 text-petit text-encre shadow-panneau">
            {avis}
          </span>
        )}
      </div>

      {edition && !cible && (
        <p
          role="status"
          className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-6 rounded-pilule bg-encre text-papier text-petit px-4 py-2 shadow-panneau pointer-events-none"
        >
          {L.indice}
        </p>
      )}

      {/* La fenêtre de modification */}
      {edition && cible && (
        <div
          role="dialog"
          aria-label={L.mode}
          className="fixed z-[101] rounded-champ border border-filet bg-papier shadow-panneau p-4 flex flex-col gap-3"
          style={{ top, left, width: largeur }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1" role="tablist">
              {(['FR', 'EN'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={langEdit === l}
                  onClick={() => setLangEdit(l)}
                  className={`kicker min-h-[32px] px-3 rounded-pilule transition-colors ${
                    langEdit === l ? 'bg-encre text-papier' : 'text-gris hover:text-encre'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={fermerFenetre}
              aria-label={L.fermerFenetre}
              className="w-9 h-9 rounded-pilule text-gris hover:text-encre flex items-center justify-center"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <textarea
            ref={zoneRef}
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                appliquer();
              }
            }}
            autoFocus
            rows={2}
            className="w-full resize-none rounded-champ border border-filet bg-papier-2 px-3 py-2 text-encre text-corps outline-none focus:border-rose"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={appliquer}
              className="min-h-[40px] px-4 rounded-pilule bg-encre text-papier text-sm font-medium hover:bg-encre-2"
            >
              {L.appliquer}
            </button>
            {peutRemettre && (
              <button
                type="button"
                onClick={remettreBase}
                className="min-h-[40px] px-3 rounded-pilule border border-filet text-encre text-sm hover:border-encre flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                {L.base}
              </button>
            )}
            <span className="ml-auto text-xs text-gris">{L.aide}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editeur;
