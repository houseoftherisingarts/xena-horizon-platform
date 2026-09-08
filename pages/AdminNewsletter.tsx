// Coquille de la page Infolettres : onglets Lettres / Composer / Abonnés. Le vrai travail vit dans
// components/admin/infolettre/ (Composer, Liste, Abonnes) et lib/infolettre/renderer.tsx.
import React, { useState } from 'react';
import { FileText, Pen, Users } from 'lucide-react';
import type { Language } from '../types';
import { EnTete } from '../components/admin/ui';
import Liste from '../components/admin/infolettre/Liste';
import Composer from '../components/admin/infolettre/Composer';
import Abonnes from '../components/admin/infolettre/Abonnes';
import { useTextes } from '../lib/textes';

interface AdminNewsletterProps { lang: Language }

const TEXTES = {
  FR: { kicker: 'Infolettres', titre: 'Infolettres', lettres: 'Lettres', composer: 'Composer', abonnes: 'Abonnés' },
  EN: { kicker: 'Newsletters', titre: 'Newsletters', lettres: 'Letters', composer: 'Composer', abonnes: 'Subscribers' },
};

type Onglet = 'lettres' | 'composer' | 'abonnes';

const AdminNewsletter: React.FC<AdminNewsletterProps> = ({ lang }) => {
  const t = useTextes('adminInfolettre', TEXTES, lang);
  const [onglet, setOnglet] = useState<Onglet>('lettres');
  const [composerId, setComposerId] = useState<string | null>(null);

  const ouvrir = (id: string | null) => { setComposerId(id); setOnglet('composer'); };

  if (onglet === 'composer') {
    return <Composer id={composerId} onBack={() => setOnglet('lettres')} lang={lang} />;
  }

  const pill = (actif: boolean) =>
    `inline-flex items-center gap-2 min-h-[36px] rounded-pilule px-4 text-xs font-semibold transition-colors ${
      actif ? 'bg-bouton text-sur-bouton' : 'border border-filet text-gris hover:text-encre'
    }`;

  return (
    <div data-tx-scope="adminInfolettre" className="px-6 md:px-10 py-10 space-y-8">
      <EnTete kicker={t.kicker} titre={t.titre} />
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setOnglet('lettres')} className={pill(true)}><FileText className="w-3.5 h-3.5" aria-hidden="true" /> {t.lettres}</button>
        <button type="button" onClick={() => ouvrir(null)} className={pill(false)}><Pen className="w-3.5 h-3.5" aria-hidden="true" /> {t.composer}</button>
        <button type="button" onClick={() => setOnglet('abonnes')} className={pill(false)}><Users className="w-3.5 h-3.5" aria-hidden="true" /> {t.abonnes}</button>
      </div>
      {onglet === 'abonnes' ? <Abonnes lang={lang} /> : <Liste onOpen={ouvrir} lang={lang} />}
    </div>
  );
};

export default AdminNewsletter;
