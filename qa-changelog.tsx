// Harnais de capture pour la boucle de vérification visuelle de l'onglet Journal des changements
// (scripts/qa-changelog.cjs). Jamais lié depuis le site : aucune route, aucun lien.
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AdminChangelog from './pages/AdminChangelog';
import type { Language } from './types';

const params = new URLSearchParams(window.location.search);
const lang = (params.get('lang') === 'EN' ? 'EN' : 'FR') as Language;

// Sonde de largeur, seulement dans le harnais : dit si quelque chose déborde du viewport.
setTimeout(() => {
  const d = document.createElement('div');
  d.id = 'MESURE';
  d.style.cssText = 'position:fixed;top:0;left:0;z-index:99999;background:#000;color:#0f0;font:14px monospace;padding:4px 8px';
  const large = [...document.querySelectorAll('*')].filter((e) => (e as HTMLElement).getBoundingClientRect().right > window.innerWidth + 1);
  d.textContent = `vp=${window.innerWidth} scroll=${document.documentElement.scrollWidth} debordent=${large.length} ${large.slice(0, 3).map((e) => e.tagName + '.' + (e.className || '').toString().slice(0, 40)).join(' | ')}`;
  document.body.appendChild(d);
}, 1200);

createRoot(document.getElementById('root')!).render(
  <div className="min-h-screen bg-papier text-encre font-sans">
    <AdminChangelog lang={lang} />
  </div>
);
