// Admin › Journal des changements : ce qui a été fait sur le site de Laurie, jour par jour, dans
// ses mots à elle. Les entrées vivent dans lib/changelog.ts, donc elles partent avec le
// déploiement et rien ne peut les effacer depuis l'admin.

import React from 'react';
import { EnTete, Panneau } from '../components/admin/ui';
import { JOURNAL, nombreEtapes } from '../lib/changelog';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

interface AdminChangelogProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    kicker: 'Vexel Webstudio',
    titre: 'Journal des changements',
    lede: 'Chaque journée de travail sur votre site, la plus récente en premier, avec ce qui a changé pour vous.',
    depuis: 'Première journée',
    journees: 'Journées de travail',
    livre: 'Choses livrées',
    aujourdhui: "Aujourd'hui",
    hier: 'Hier',
  },
  EN: {
    kicker: 'Vexel Webstudio',
    titre: 'Change log',
    lede: 'Every day of work on your site, the most recent first, with what changed for you.',
    depuis: 'First day',
    journees: 'Working days',
    livre: 'Things delivered',
    aujourdhui: 'Today',
    hier: 'Yesterday',
  },
};

const MOIS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const MOIS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2026-09-10' devient '10 septembre 2026', sans passer par Date pour éviter le décalage horaire. */
const enClair = (iso: string, lang: Language): string => {
  const [a, m, j] = iso.split('-').map(Number);
  if (!a || !m || !j) return iso;
  const mois = (lang === 'EN' ? MOIS_EN : MOIS_FR)[m - 1];
  return lang === 'EN' ? `${mois} ${j}, ${a}` : `${j} ${mois} ${a}`;
};

const AdminChangelog: React.FC<AdminChangelogProps> = ({ lang }) => {
  const t = useTextes('adminChangelog', TEXTES, lang);
  const premiere = JOURNAL.length ? JOURNAL[JOURNAL.length - 1].date : '';

  return (
    <div className="px-6 md:px-10 py-10 space-y-8" data-tx-scope="adminChangelog">
      <EnTete kicker={t.kicker} titre={t.titre} lede={t.lede} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panneau className="!p-5">
          <p className="kicker text-gris mb-2">{t.journees}</p>
          <p className="font-serif text-h3 text-encre">{JOURNAL.length}</p>
        </Panneau>
        <Panneau className="!p-5">
          <p className="kicker text-gris mb-2">{t.livre}</p>
          <p className="font-serif text-h3 text-encre">{nombreEtapes()}</p>
        </Panneau>
        <Panneau className="!p-5">
          <p className="kicker text-gris mb-2">{t.depuis}</p>
          <p className="font-serif text-h3 text-encre">{enClair(premiere, lang)}</p>
        </Panneau>
      </div>

      <ol className="relative border-l border-filet ml-2 space-y-10 pl-6 md:pl-8">
        {JOURNAL.map((entree, i) => (
          <li
            key={entree.date}
            className="relative grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
          >
            <span
              aria-hidden="true"
              className={`absolute -left-[calc(1.5rem+5px)] md:-left-[calc(2rem+5px)] top-[0.45rem] w-[9px] h-[9px] rounded-full ${
                i === 0 ? 'bg-rose' : 'bg-filet'
              }`}
            />
            <div>
              <p className="kicker text-rose mb-1">{enClair(entree.date, lang)}</p>
              <h2 className="font-serif text-h3 text-encre leading-tight">{entree.titre}</h2>
              <p className="mt-2 text-gris text-sm">{entree.intro}</p>
            </div>
            <ul className="space-y-2 md:pt-1">
              {entree.etapes.map((etape, k) => (
                <li key={k} className="flex gap-3 text-sm text-encre">
                  <span aria-hidden="true" className="mt-[0.55rem] w-1 h-1 rounded-full bg-rose flex-shrink-0" />
                  <span>{etape}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default AdminChangelog;
