// Harnais de capture pour la boucle de vérification visuelle de l'onglet Journal des changements
// (scripts/qa-changelog.cjs). Jamais lié depuis le site : aucune route, aucun lien.
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AdminChangelog from './pages/AdminChangelog';
import type { Language } from './types';

const params = new URLSearchParams(window.location.search);
const lang = (params.get('lang') === 'EN' ? 'EN' : 'FR') as Language;

createRoot(document.getElementById('root')!).render(
  <div className="min-h-screen bg-papier text-encre font-sans">
    <AdminChangelog lang={lang} />
  </div>
);
