// BadgeVexel — l'autocollant « Site créé par Vexel Webstudio » du pied de page, façon sticker foil
// de collection : liseré blanc découpé, reflet holographique qui suit le pointeur, léger basculement
// 3D. Le lien porte le code partenaire de Laurie : la personne qui clique arrive chez Vexel avec
// elle comme marraine (lib/vexel.ts).
import React, { useCallback, useRef } from 'react';
import { LIEN_PARRAINAGE_VEXEL } from '../lib/vexel';
import type { Language } from '../types';

const TEXTES = {
  FR: { kicker: 'Site créé par', nom: 'Vexel Webstudio', libelle: 'Site créé par Vexel Webstudio, ouvrir le studio dans un nouvel onglet' },
  EN: { kicker: 'Site by', nom: 'Vexel Webstudio', libelle: 'Site by Vexel Webstudio, open the studio in a new tab' },
};

const BadgeVexel: React.FC<{ lang: Language; className?: string }> = ({ lang, className = '' }) => {
  const t = TEXTES[lang];
  const ref = useRef<HTMLAnchorElement>(null);

  const suivre = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 12).toFixed(2)}deg`);
  }, []);

  const relacher = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '30%');
    el.style.setProperty('--my', '30%');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }, []);

  return (
    <a
      ref={ref}
      href={LIEN_PARRAINAGE_VEXEL}
      target="_blank"
      rel="noopener"
      aria-label={t.libelle}
      onPointerMove={suivre}
      onPointerLeave={relacher}
      className={`xh-foil group relative inline-flex items-center gap-3 rounded-[15px] px-4 py-3 select-none ${className}`}
    >
      <span aria-hidden className="xh-foil-sheen" />
      <span aria-hidden className="xh-foil-grain" />
      <img src="/images/vexel-mark.png" alt="" width={36} height={33} className="relative h-8 w-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
      <span className="relative flex flex-col leading-none">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-white/70">{t.kicker}</span>
        <span className="mt-1 font-serif text-[1.05rem] text-white">{t.nom}</span>
      </span>
    </a>
  );
};

export default BadgeVexel;
