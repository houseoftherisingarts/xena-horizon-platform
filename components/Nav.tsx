import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { Lock, Menu, X } from 'lucide-react';
import { ViewState, Language } from '../types';
import { useIntroTerminee } from '../lib/intro';
import { Portail, useLenis } from './motion';
import BasculePalette from './BasculePalette';
import BasculeNuit from './BasculeNuit';
import BasculeLangue from './BasculeLangue';
import { useTextes } from '../lib/textes';
import { allerAuRendezVous } from '../lib/rendezvous';

interface NavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onRequestAdmin: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const MARQUE = 'Xena Horizon';

const TEXTES = {
  FR: {
    home: 'Accueil',
    services: 'Services',
    projets: 'Projets',
    about: 'À propos',
    contact: 'Contact',
    admin: 'Espace admin',
    mySpace: 'Mon espace',
    appointment: 'Prendre rendez-vous',
    byline: 'par Laurie Belhumeur',
    ouvrirMenu: 'Ouvrir le menu',
    fermerMenu: 'Fermer le menu',
  },
  EN: {
    home: 'Home',
    services: 'Services',
    projets: 'Projects',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin area',
    mySpace: 'My space',
    appointment: 'Book a call',
    byline: 'by Laurie Belhumeur',
    ouvrirMenu: 'Open menu',
    fermerMenu: 'Close menu',
  },
};

const EASE_RIDEAU = [0.22, 1, 0.36, 1] as const;
const EASE_VOYAGE = [0.16, 0.8, 0.24, 1] as const;

const Nav: React.FC<NavProps> = ({ currentView, onChangeView, onRequestAdmin, lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // `useIntroTerminee` lit un store synchrone (lib/intro.ts) : la marque rend dans le MÊME
  // commit que la fin de l'intro, ce qui laisse le FLIP du layoutId « xh-marque » se produire.
  const introTerminee = useIntroTerminee();
  // Filet de sécurité : si l'intro n'a pas prévenu au bout de 1,8 s (page intérieure sans
  // intro, ou intro pas encore câblée), la marque se pose quand même — en fondu de 200 ms,
  // jamais d'un coup — plutôt qu'une barre de navigation muette.
  const [filetDeSecurite, setFiletDeSecurite] = useState(false);
  const afficherMarque = introTerminee || filetDeSecurite;
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const drawerRef = useRef<HTMLDivElement>(null);
  const boutonMenuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (introTerminee) return;
    const t = setTimeout(() => setFiletDeSecurite(true), 1800);
    return () => clearTimeout(t);
  }, [introTerminee]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Échap ferme, le focus revient au bouton qui a ouvert, et Tab reste dans le tiroir tant qu'il est ouvert.
  useEffect(() => {
    if (!isOpen) return;
    const focusables = (): HTMLElement[] =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a, button') ?? ([] as HTMLElement[]));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        boutonMenuRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const premier = items[0];
      const dernier = items[items.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    focusables()[0]?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const t = useTextes('nav', TEXTES, lang);

  const navLinks: { label: string; view: ViewState; sectionId?: string }[] = [
    { label: t.home, view: 'HOME' },
    { label: t.services, view: 'SERVICES' },
    { label: t.projets, view: 'PROJETS' },
    { label: t.about, view: 'A_PROPOS' },
    { label: t.contact, view: 'HOME', sectionId: 'contact' },
  ];

  const handleNavClick = (view: ViewState, sectionId?: string) => {
    const changeDeVue = view !== currentView;
    if (changeDeVue) onChangeView(view);
    if (sectionId) {
      const aller = () => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        // Lenis lit déjà `scroll-margin-top` sur la cible (index.css, `[id]`) : pas de second
        // offset ici, sous peine de compter la barre deux fois (mesuré : 144px au lieu de 72).
        if (lenis) lenis.scrollTo(el);
        else el.scrollIntoView({ behavior: 'smooth' });
      };
      if (changeDeVue) setTimeout(aller, 100);
      else aller();
    }
    setIsOpen(false);
  };

  const bascule = <BasculeLangue lang={lang} setLang={setLang} />;

  return (
    <nav
      data-tx-scope="nav"
      className={`fixed top-0 left-0 right-0 z-40 h-nav px-gut flex items-center justify-between transition-colors duration-300 ${
        scrolled ? 'bg-papier/85 backdrop-blur-md border-b border-filet' : 'bg-transparent'
      }`}
    >
      <button
        type="button"
        onClick={() => handleNavClick('HOME')}
        className="flex flex-col items-start leading-none min-w-[9rem] text-left"
      >
        {afficherMarque ? (
          <motion.span
            layoutId="xh-marque"
            initial={introTerminee ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ layout: { duration: 0.6, ease: EASE_VOYAGE }, opacity: { duration: 0.2 } }}
            className="font-serif text-[1.25rem] text-encre"
          >
            {MARQUE}
          </motion.span>
        ) : (
          <span className="font-serif text-[1.25rem] opacity-0" aria-hidden="true">
            {MARQUE}
          </span>
        )}
        <span className="kicker text-gris mt-0.5 hidden sm:block">{t.byline}</span>
      </button>

      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const actif = currentView === link.view && !link.sectionId;
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link.view, link.sectionId)}
              className={`relative px-4 py-2 text-sm font-medium font-sans transition-colors duration-survol ${
                actif ? 'text-encre' : 'text-gris hover:text-encre'
              }`}
            >
              {link.label}
              {actif && <span aria-hidden="true" className="absolute left-4 right-4 -bottom-1 h-[2px] bg-rose" />}
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <BasculePalette lang={lang} />
        <BasculeNuit lang={lang} />
        {bascule}
        <button
          type="button"
          onClick={onRequestAdmin}
          aria-label={t.admin}
          title={t.admin}
          className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris opacity-50 hover:opacity-100 hover:text-encre transition-opacity"
        >
          <Lock className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('ESPACE_CLIENT')}
          className="min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-encre transition-colors"
        >
          {t.mySpace}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            allerAuRendezVous();
          }}
          className="min-h-[44px] px-6 rounded-pilule bg-bouton text-sur-bouton text-sm font-medium hover:bg-bouton-2 transition-colors"
        >
          {t.appointment}
        </button>
      </div>

      <button
        ref={boutonMenuRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t.ouvrirMenu}
        aria-expanded={isOpen}
        className="md:hidden w-11 h-11 flex items-center justify-center text-encre"
      >
        <Menu className="w-6 h-6" />
      </button>

      <Portail>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.ouvrirMenu}
              initial={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
              transition={{ duration: 0.5, ease: EASE_RIDEAU }}
              className="fixed inset-0 z-[95] bg-papier flex flex-col px-gut pt-8 pb-10"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-serif text-[1.25rem] text-encre">{MARQUE}</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={t.fermerMenu}
                  className="w-11 h-11 flex items-center justify-center text-encre"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link.view, link.sectionId)}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06, ease: EASE_RIDEAU }}
                    className="min-h-[44px] flex items-center text-left font-serif text-h3 text-encre py-3 border-b border-filet"
                  >
                    {link.label}
                  </motion.button>
                ))}
                <motion.button
                  type="button"
                  onClick={() => handleNavClick('ESPACE_CLIENT')}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : navLinks.length * 0.06, ease: EASE_RIDEAU }}
                  className="min-h-[44px] flex items-center text-left font-serif text-h3 text-encre py-3 border-b border-filet"
                >
                  {t.mySpace}
                </motion.button>
              </div>

              <div className="mt-auto flex flex-col items-stretch gap-3 pt-8">
                <button
                  type="button"
                  onClick={() => {
            setIsOpen(false);
            allerAuRendezVous();
          }}
                  className="min-h-[44px] px-6 rounded-pilule bg-bouton text-sur-bouton text-sm font-medium"
                >
                  {t.appointment}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRequestAdmin();
                    setIsOpen(false);
                  }}
                  aria-label={t.admin}
                  className="flex items-center justify-center gap-2 text-xs text-gris opacity-60 hover:opacity-100 py-2"
                >
                  <Lock className="w-3 h-3" /> {t.admin}
                </button>
                <div className="flex items-center justify-center gap-6 pt-2">
                  <BasculePalette lang={lang} />
                  <BasculeNuit lang={lang} />
                  {bascule}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portail>
    </nav>
  );
};

export default Nav;
