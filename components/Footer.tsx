import React from 'react';
import BadgeVexel from './BadgeVexel';
import { Mail, Phone } from 'lucide-react';
import { Language, ViewState } from '../types';
import { COORDONNEES, CREDITS } from '../lib/contenu';
import { useLenis } from './motion';
import { useConsentementVisible } from './Consentement';
import { useTextes } from '../lib/textes';
import { pathFromView } from '../lib/routes';

interface FooterProps {
  onAdminLogin: () => void;
  lang: Language;
  onChangeView?: (view: ViewState) => void;
}

const TEXTES = {
  FR: {
    tagline: 'Consultante en carrière artistique et en communication.',
    nav: 'Naviguer',
    home: 'Accueil',
    services: 'Services',
    projets: 'Projets',
    about: 'À propos',
    contact: 'Contact',
    mySpace: 'Mon espace',
    coord: 'Coordonnées',
    credits: 'Crédit photo',
    rights: 'Tous droits réservés.',
    admin: 'Admin',
  },
  EN: {
    tagline: 'Artistic career and communication consultant.',
    nav: 'Navigate',
    home: 'Home',
    services: 'Services',
    projets: 'Projects',
    about: 'About',
    contact: 'Contact',
    mySpace: 'My space',
    coord: 'Contact',
    credits: 'Photo credit',
    rights: 'All rights reserved.',
    admin: 'Admin',
  },
};

const Footer: React.FC<FooterProps> = ({ onAdminLogin, lang, onChangeView }) => {
  const lenis = useLenis();
  const bandeauVisible = useConsentementVisible();
  const t = useTextes('footer', TEXTES, lang);

  const goTo = (view: ViewState, sectionId?: string) => {
    if (!onChangeView) return;
    onChangeView(view);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        // Lenis lit déjà `scroll-margin-top` sur la cible (index.css, `[id]`) : pas de second offset.
        if (lenis) lenis.scrollTo(el);
        else el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Les adresses de secours (clic du milieu, Cmd-clic, robots) portent le préfixe de la langue lue,
  // comme les liens de la barre : en anglais, elles mènent aux vraies pages /en/... et non au français.
  const navLinks: { label: string; view: ViewState; sectionId?: string; href: string }[] = [
    { label: t.home, view: 'HOME', href: pathFromView('HOME', lang) },
    { label: t.services, view: 'SERVICES', href: pathFromView('SERVICES', lang) },
    { label: t.projets, view: 'PROJETS', href: pathFromView('PROJETS', lang) },
    { label: t.about, view: 'A_PROPOS', href: pathFromView('A_PROPOS', lang) },
    { label: t.contact, view: 'HOME', sectionId: 'contact', href: `${pathFromView('HOME', lang)}#contact` },
  ];

  return (
    <footer data-tx-scope="footer" className={`w-full bg-papier-2 border-t border-filet pt-16 ${bandeauVisible ? 'pb-24 md:pb-28' : ''}`}>
      <div className="px-gut grid grid-cols-1 md:grid-cols-12 gap-x-col gap-y-10">
        <div className="md:col-span-3">
          <p className="font-serif text-h3 text-encre mb-2">Xena Horizon</p>
          <p className="text-petit text-gris mesure">{t.tagline}</p>
        </div>

        <div className="md:col-span-3">
          <p className="kicker text-gris mb-4">{t.nav}</p>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onChangeView ? (e) => { e.preventDefault(); goTo(link.view, link.sectionId); } : undefined}
                className="text-encre hover:text-rose transition-colors text-sm min-h-[32px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href={pathFromView('ESPACE_CLIENT', lang)}
              onClick={onChangeView ? (e) => { e.preventDefault(); goTo('ESPACE_CLIENT'); } : undefined}
              className="text-rose hover:text-encre transition-colors text-sm font-medium min-h-[32px] flex items-center"
            >
              {t.mySpace}
            </a>
          </nav>
        </div>

        <div className="md:col-span-3">
          <p className="kicker text-gris mb-4">{t.coord}</p>
          <div className="space-y-2 text-sm">
            <a href={COORDONNEES.telephoneHref} className="flex items-center gap-2 text-encre hover:text-rose transition-colors">
              <Phone className="w-4 h-4" /> {COORDONNEES.telephone}
            </a>
            <a href={`mailto:${COORDONNEES.courriel}`} className="flex items-center gap-2 text-encre hover:text-rose transition-colors">
              <Mail className="w-4 h-4" /> {COORDONNEES.courriel}
            </a>
            <p className="text-gris">{COORDONNEES.zones}</p>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="kicker text-gris mb-4">{t.credits}</p>
          <p className="text-petit text-gris mb-6">{CREDITS.photographes.join(' · ')}</p>
          <BadgeVexel lang={lang} className="mb-4" />
          <p className="text-xs text-gris mt-1">
            © {new Date().getFullYear()} Laurie Belhumeur · Xena Horizon. {t.rights}
          </p>
          <button type="button" onClick={onAdminLogin} className="text-xs text-gris hover:text-encre transition-colors mt-3">
            {t.admin}
          </button>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="mt-14 px-gut font-serif text-chiffre text-encre leading-none whitespace-nowrap select-none overflow-hidden"
        style={{ height: '0.6em', transform: 'translateY(18%)' }}
      >
        Xena Horizon
      </p>
    </footer>
  );
};

export default Footer;
