// BadgeVexel — les deux autocollants du pied de page, façon stickers foil de collection : liseré
// blanc découpé, reflet holographique qui suit le pointeur, léger basculement 3D, posés bien droits.
// Le premier dit « Site créé par Vexel Webstudio » avec le logo complet (cercle et sigil); le second,
// carré, porte le sceau « Affilié certifié » avec le crochet du badge vérifié. Un clic sur l'un ou
// l'autre ouvre d'abord une carte 16:9 qui explique l'entente (rabais de 10 % pour la personne,
// commission de 10 % pour Laurie), puis « Oui » ouvre Vexel avec le code de Laurie déjà rempli
// (lib/vexel.ts).
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, X } from 'lucide-react';
import { CODE_PARTENAIRE_LAURIE } from '../lib/vexel';
import { useDocument } from '../lib/firestore';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

/** Code venant du panneau « Devenir partenaire Vexel » (Admin › Pour Vexel), s'il a déjà été signé;
 * sinon le code déjà en place depuis l'affiliation d'origine (lib/vexel.ts). Seul un code de la forme
 * attendue passe, et l'adresse se reconstruit toujours ici plutôt que d'être lue telle quelle. */
interface ParametresVexel {
  partenaire?: { code?: string };
}
function useLienParrainage(): string {
  const { data: reglages } = useDocument<ParametresVexel>('settings/vexel');
  return useMemo(() => {
    const c = reglages?.partenaire?.code;
    const code = typeof c === 'string' && /^[A-Z0-9-]{4,24}$/.test(c) ? c : CODE_PARTENAIRE_LAURIE;
    return `https://vexelwebstudio.com/compte?parrain=${encodeURIComponent(code)}`;
  }, [reglages]);
}

const TEXTES = {
  FR: {
    kicker: 'Site créé par',
    nom: 'Vexel Webstudio',
    sousTitre: 'un projet créatif du Salon des Inconnus',
    salon: 'Le Salon des Inconnus',
    libelle: 'Site créé par Vexel Webstudio : en savoir plus sur l\'entente',
    affilie: 'Affilié',
    certifie: 'certifié',
    libelleAffilie: 'Affilié certifié Vexel Webstudio : en savoir plus sur l\'entente',
    titre: 'Un site comme celui-ci, avec un coup de pouce',
    corps: "Xena Horizon est affiliée à Vexel Webstudio pour les sites Internet. Si vous ouvrez un dossier chez Vexel à partir d'ici, vous gagnez un rabais sur ce même forfait.",
    question: '',
    oui: 'Continuer vers Vexel',
    non: 'Pas maintenant',
    fermer: 'Fermer',
  },
  EN: {
    kicker: 'Site by',
    nom: 'Vexel Webstudio',
    sousTitre: 'a creative project of Le Salon des Inconnus',
    salon: 'Le Salon des Inconnus',
    libelle: 'Site by Vexel Webstudio: learn about the partnership',
    affilie: 'Certified',
    certifie: 'affiliate',
    libelleAffilie: 'Certified Vexel Webstudio affiliate: learn about the partnership',
    titre: 'A site like this one, with a helping hand',
    corps: 'Xena Horizon is affiliated with Vexel Webstudio for websites. If you open a file with Vexel from here, you earn a discount on that same plan.',
    question: '',
    oui: 'Continue to Vexel',
    non: 'Not now',
    fermer: 'Close',
  },
};

const SALON_URL = 'https://lesalondesinconnus.com/';
const LOGO_SALON = '/salon-logo-or.png';

/** Le reflet holographique suit le pointeur (--mx, --my) et incline le sticker (--rx, --ry). */
function useFoil() {
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
  return { ref, suivre, relacher };
}

/** Le sceau du badge vérifié : le crochet blanc sur le bleu du site, à la façon du crochet bleu. */
const Sceau: React.FC<{ className?: string }> = ({ className = '' }) => (
  <BadgeCheck
    aria-hidden="true"
    className={className}
    fill="#38B6FF"
    stroke="#ffffff"
    strokeWidth={1.75}
  />
);

const BadgeVexel: React.FC<{ lang: Language; className?: string }> = ({ lang, className = '' }) => {
  const t = useTextes('badgeVexel', TEXTES, lang);
  const lienParrainage = useLienParrainage();
  const principal = useFoil();
  const sceau = useFoil();
  const ouiRef = useRef<HTMLAnchorElement>(null);
  const [ouverte, setOuverte] = useState(false);

  // Le lien reste réel (lecteur d'écran, clic du milieu), mais le clic ordinaire explique d'abord.
  const ouvrir = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOuverte(true);
  };

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
      <div className={`inline-flex items-stretch gap-3 ${className}`}>
        <a
          ref={principal.ref}
          href={lienParrainage}
          onClick={ouvrir}
          aria-haspopup="dialog"
          aria-expanded={ouverte}
          aria-label={t.libelle}
          onPointerMove={principal.suivre}
          onPointerLeave={principal.relacher}
          className="xh-foil group relative inline-flex items-center gap-3 rounded-[15px] px-4 py-3 select-none"
        >
          <span aria-hidden className="xh-foil-sheen" />
          <span aria-hidden className="xh-foil-grain" />
          <img src="/images/vexel-logo.png" alt="" width={329} height={320} className="relative h-10 w-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          <span className="relative flex flex-col leading-none">
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-white/70">{t.kicker}</span>
            <span className="mt-1 font-serif text-[1.05rem] text-white">{t.nom}</span>
          </span>
        </a>

        <a
          ref={sceau.ref}
          href={lienParrainage}
          onClick={ouvrir}
          aria-haspopup="dialog"
          aria-expanded={ouverte}
          aria-label={t.libelleAffilie}
          onPointerMove={sceau.suivre}
          onPointerLeave={sceau.relacher}
          className="xh-foil group relative inline-flex aspect-square flex-col items-center justify-center gap-1 rounded-[15px] px-2 select-none"
        >
          <span aria-hidden className="xh-foil-sheen" />
          <span aria-hidden className="xh-foil-grain" />
          <Sceau className="relative h-7 w-7 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          <span className="relative flex flex-col items-center text-center leading-[1.15]">
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white">{t.affilie}</span>
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/70">{t.certifie}</span>
          </span>
        </a>
      </div>

      <AnimatePresence>
        {ouverte && (
          <motion.div
            className="fixed inset-0 z-[900] flex items-end justify-center p-4 sm:items-center"
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
              className="relative w-full max-w-[960px] overflow-hidden rounded-[15px] border border-filet bg-papier shadow-panneau sm:grid sm:aspect-[16/9] sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 0.8, 0.24, 1] }}
            >
              {/* Le volet de gauche reprend la surface foil des stickers, avec le logo complet en grand. */}
              <div className="xh-foil-plat relative flex min-h-[200px] flex-col items-center justify-center gap-5 p-6 text-center sm:p-8">
                <span aria-hidden className="xh-foil-sheen" />
                <span aria-hidden className="xh-foil-grain" />
                <img src="/images/vexel-logo.png" alt="" width={329} height={320} className="relative h-28 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:h-40" />
                <span className="relative flex flex-col leading-none">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-white/70">{t.kicker}</span>
                  <span className="mt-1.5 font-serif text-[1.375rem] text-white">{t.nom}</span>
                </span>
              </div>

              <div className="relative flex flex-col justify-center p-6 sm:p-10">
                <button
                  type="button"
                  onClick={() => setOuverte(false)}
                  aria-label={t.fermer}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-pilule text-gris hover:text-encre"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-2">
                  <Sceau className="h-5 w-5" />
                  <span className="kicker text-rose">{t.affilie} {t.certifie}</span>
                </div>
                <p className="mt-1 text-[13px] text-gris">{t.sousTitre}</p>
                <h2 id="badge-vexel-titre" className="mt-4 font-serif text-h3 leading-tight text-encre">
                  {t.titre}
                </h2>
                <p className="mt-4 text-corps text-encre">{t.corps}</p>
                {t.question ? <p className="mt-3 text-corps font-medium text-encre">{t.question}</p> : null}
                <div className="mt-6 flex flex-wrap items-center gap-3 pr-20 sm:pr-24">
                  <a
                    ref={ouiRef}
                    href={lienParrainage}
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
                {/* Le Salon des Inconnus, en bas à droite de la carte : Vexel est un projet du Salon (Alex, 14 septembre 2026). */}
                <a
                  href={SALON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.salon}
                  className="absolute bottom-5 right-5 md:bottom-7 md:right-7"
                >
                  <img
                    src={LOGO_SALON}
                    alt={t.salon}
                    className="h-16 w-auto object-contain drop-shadow-[0_2px_6px_rgba(197,160,89,0.35)] md:h-20"
                  />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BadgeVexel;
