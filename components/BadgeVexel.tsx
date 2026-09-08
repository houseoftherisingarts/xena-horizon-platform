// BadgeVexel — l'autocollant « Site créé par Vexel Webstudio » du pied de page, façon sticker foil
// de collection : liseré blanc découpé, reflet holographique qui suit le pointeur, léger basculement
// 3D. Un clic ouvre d'abord une petite fenêtre qui explique l'entente (rabais de 10 % pour la
// personne, commission de 10 % pour Laurie), puis « Oui » ouvre Vexel avec le code de Laurie déjà
// rempli (lib/vexel.ts).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { LIEN_PARRAINAGE_VEXEL } from '../lib/vexel';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

const TEXTES = {
  FR: {
    kicker: 'Site créé par',
    nom: 'Vexel Webstudio',
    libelle: 'Site créé par Vexel Webstudio : en savoir plus sur l\'entente',
    titre: 'Un site comme celui-ci, avec un coup de pouce',
    corps: 'Xena Horizon est affiliée à Vexel Webstudio pour les sites Internet. Si vous ouvrez un dossier chez Vexel à partir d\'ici, vous recevez un rabais de 10 % sur votre forfait et Laurie touche une commission de 10 % sur ce même forfait. Tout le monde y gagne.',
    question: 'Voulez-vous continuer ?',
    oui: 'Oui, je continue',
    non: 'Pas maintenant',
    fermer: 'Fermer',
  },
  EN: {
    kicker: 'Site by',
    nom: 'Vexel Webstudio',
    libelle: 'Site by Vexel Webstudio: learn about the partnership',
    titre: 'A site like this one, with a helping hand',
    corps: 'Xena Horizon is affiliated with Vexel Webstudio for websites. If you open a file with Vexel from here, you get 10% off your plan and Laurie earns a 10% commission on that same plan. Everyone wins.',
    question: 'Would you like to continue?',
    oui: 'Yes, take me there',
    non: 'Not now',
    fermer: 'Close',
  },
};

const BadgeVexel: React.FC<{ lang: Language; className?: string }> = ({ lang, className = '' }) => {
  const t = useTextes('badgeVexel', TEXTES, lang);
  const ref = useRef<HTMLAnchorElement>(null);
  const ouiRef = useRef<HTMLAnchorElement>(null);
  const [ouverte, setOuverte] = useState(false);

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

  // Échap ferme, et le bouton « Oui » reçoit le focus à l'ouverture.
  useEffect(() => {
    if (!ouverte) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuverte(false);
    };
    window.addEventListener('keydown', onKey);
    const minuterie = window.setTimeout(() => ouiRef.current?.focus(), 60);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(minuterie);
    };
  }, [ouverte]);

  return (
    <>
      <a
        ref={ref}
        href={LIEN_PARRAINAGE_VEXEL}
        onClick={(e) => {
          // Le lien reste réel (lecteur d'écran, clic du milieu), mais le clic ordinaire explique d'abord.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setOuverte(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={ouverte}
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

      <AnimatePresence>
        {ouverte && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              aria-label={t.fermer}
              onClick={() => setOuverte(false)}
              className="absolute inset-0 bg-encre/55 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="badge-vexel-titre"
              className="relative w-full max-w-[520px] rounded-[15px] border border-filet bg-papier p-6 shadow-panneau sm:p-8"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 0.8, 0.24, 1] }}
            >
              <button
                type="button"
                onClick={() => setOuverte(false)}
                aria-label={t.fermer}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-pilule text-gris hover:text-encre"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-3">
                <img src="/images/vexel-mark.png" alt="" width={36} height={33} className="h-8 w-auto" />
                <span className="kicker text-rose">{t.nom}</span>
              </div>
              <h2 id="badge-vexel-titre" className="mt-4 font-serif text-h3 leading-tight text-encre">
                {t.titre}
              </h2>
              <p className="mt-4 text-corps text-encre">{t.corps}</p>
              <p className="mt-3 text-corps font-medium text-encre">{t.question}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  ref={ouiRef}
                  href={LIEN_PARRAINAGE_VEXEL}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOuverte(false)}
                  className="inline-flex min-h-[44px] items-center rounded-pilule bg-bouton px-5 text-sm font-medium text-sur-bouton hover:bg-bouton-2"
                >
                  {t.oui}
                </a>
                <button
                  type="button"
                  onClick={() => setOuverte(false)}
                  className="inline-flex min-h-[44px] items-center rounded-pilule border border-filet px-5 text-sm text-encre hover:border-encre"
                >
                  {t.non}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BadgeVexel;
