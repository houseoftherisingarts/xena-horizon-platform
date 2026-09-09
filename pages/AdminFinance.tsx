// Comptabilité, façon QuickBooks : une coquille à onglets qui monte les modules des bâtisseurs J
// (Transactions, Import, Conciliation, PlanComptable, Tiers), K (Taxes et impôt) et L (Aperçu, Rapports,
// Réglages). L'onglet actif vit dans `?onglet=...` (Onglets.tsx) pour ne jamais toucher lib/routes.ts.
import React, { useEffect, useState } from 'react';
import { EnTete } from '../components/admin/ui';
import { BarreOnglets, ongletDepuisRecherche, ONGLET_PAR_DEFAUT, type OngletFinance } from '../components/admin/finances/Onglets';
import Apercu from '../components/admin/finances/Apercu';
import Transactions from '../components/admin/finances/Transactions';
import Import from '../components/admin/finances/Import';
import Conciliation from '../components/admin/finances/Conciliation';
import TaxesImpot from '../components/admin/finances/TaxesImpot';
import Rapports from '../components/admin/finances/Rapports';
import PlanComptable from '../components/admin/finances/PlanComptable';
import Tiers from '../components/admin/finances/Tiers';
import Reglages from '../components/admin/finances/Reglages';
import type { Language } from '../types';

interface AdminFinanceProps {
  lang: Language;
}

const TEXTES = {
  FR: { kicker: 'Finances', titre: 'Comptabilité', lede: 'Le grand livre, les taxes, l\'impôt et les rapports, au même endroit.' },
  EN: { kicker: 'Finances', titre: 'Accounting', lede: 'The ledger, taxes, income tax and reports, all in one place.' },
};

const AdminFinance: React.FC<AdminFinanceProps> = ({ lang }) => {
  const t = TEXTES[lang];
  const [onglet, setOnglet] = useState<OngletFinance>(() =>
    typeof window !== 'undefined' ? ongletDepuisRecherche(window.location.search) : ONGLET_PAR_DEFAUT
  );

  useEffect(() => {
    const surPopState = () => setOnglet(ongletDepuisRecherche(window.location.search));
    window.addEventListener('popstate', surPopState);
    return () => window.removeEventListener('popstate', surPopState);
  }, []);

  const changerOnglet = (nouveau: OngletFinance) => {
    setOnglet(nouveau);
    const url = new URL(window.location.href);
    url.searchParams.set('onglet', nouveau);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete kicker={t.kicker} titre={t.titre} lede={t.lede} />
      <BarreOnglets actif={onglet} lang={lang} onChange={changerOnglet} />

      {onglet === 'apercu' && <Apercu lang={lang} onAllerA={changerOnglet} />}
      {onglet === 'transactions' && <Transactions lang={lang} />}
      {onglet === 'import' && <Import lang={lang} />}
      {onglet === 'conciliation' && <Conciliation lang={lang} />}
      {onglet === 'taxes' && <TaxesImpot lang={lang} />}
      {onglet === 'rapports' && <Rapports lang={lang} />}
      {onglet === 'plan-comptable' && <PlanComptable lang={lang} />}
      {onglet === 'tiers' && <Tiers lang={lang} />}
      {onglet === 'reglages' && <Reglages lang={lang} onAllerA={changerOnglet} />}
    </div>
  );
};

export default AdminFinance;
