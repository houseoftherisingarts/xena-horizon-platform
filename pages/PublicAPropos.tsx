import React from 'react';
import { Language } from '../types';

/** Gabarit provisoire : la page À propos v2 le remplace (chantier B). */
const PublicAPropos: React.FC<{ lang: Language }> = ({ lang }) => (
  <section className="px-gut py-feuille">
    <h1 className="font-serif text-h1">{lang === 'FR' ? 'À propos' : 'About'}</h1>
  </section>
);

export default PublicAPropos;
