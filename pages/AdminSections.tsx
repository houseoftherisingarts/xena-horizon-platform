// Admin › Sections du site : Laurie allume ou éteint chaque section de l'accueil, notamment les
// capsules vidéo tant qu'elle n'en a pas de prêtes. Une ligne par section, un interrupteur (la même
// pilule que palette/langue/nuit, components/Interrupteur.tsx), l'état en clair.

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { EnTete, Panneau } from '../components/admin/ui';
import Interrupteur from '../components/Interrupteur';
import { patchDoc, writeDoc } from '../lib/firestore';
import { SECTIONS_ACCUEIL, sectionActive, useSections } from '../lib/sections';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

interface AdminSectionsProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    titre: 'Sections du site',
    lede: 'Allumez ou éteignez chaque section de l’accueil, une à la fois.',
    on: 'Allumée',
    off: 'Éteinte',
  },
  EN: {
    titre: 'Site sections',
    lede: 'Turn each homepage section on or off, one at a time.',
    on: 'On',
    off: 'Off',
  },
};

const AdminSections: React.FC<AdminSectionsProps> = ({ lang }) => {
  const t = useTextes('adminSections', TEXTES, lang);
  const surcharges = useSections();
  const [enCours, setEnCours] = useState<string | null>(null);

  const basculer = async (id: string) => {
    const valeur = !sectionActive(surcharges, id);
    setEnCours(id);
    try {
      // Garantit l'existence du document avant l'updateMask ciblé (settings/sections peut ne pas
      // encore exister au tout premier basculement).
      await writeDoc('settings', 'sections', {}, { merge: true });
      await patchDoc('settings', 'sections', { [id]: valeur });
    } finally {
      setEnCours(null);
    }
  };

  return (
    <div data-tx-scope="adminSections" className="w-full space-y-8 px-6 py-10 md:px-10">
      <EnTete kicker="Accueil" titre={t.titre} lede={t.lede} />

      <Panneau>
        <ul className="divide-y divide-filet">
          {SECTIONS_ACCUEIL.map((s) => {
            const active = sectionActive(surcharges, s.id);
            return (
              <li key={s.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-sans font-semibold text-encre">{s.libelle[lang]}</p>
                  {s.note && <p className="mt-1 text-xs text-gris">{s.note[lang]}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-petit text-gris">
                    {active ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                    {active ? t.on : t.off}
                  </span>
                  <Interrupteur
                    droite={active}
                    onBascule={() => basculer(s.id)}
                    libelle={s.libelle[lang]}
                    className={enCours === s.id ? 'pointer-events-none opacity-60' : ''}
                    classePilule={active ? 'border-encre bg-encre' : 'border-filet bg-papier group-hover:border-encre'}
                    classeBouton={active ? 'bg-rose' : 'bg-bouton'}
                    gaucheActif={<EyeOff className="h-3.5 w-3.5 text-sur-bouton" strokeWidth={1.5} />}
                    gaucheInactif={<EyeOff className="h-3.5 w-3.5 text-papier/60" strokeWidth={1.5} />}
                    droiteActif={<Eye className="h-3.5 w-3.5 text-papier" strokeWidth={1.5} />}
                    droiteInactif={<Eye className="h-3.5 w-3.5 text-gris" strokeWidth={1.5} />}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Panneau>
    </div>
  );
};

export default AdminSections;
