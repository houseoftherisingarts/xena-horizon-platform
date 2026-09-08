import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Filter } from 'lucide-react';
import { EnTete, Panneau, Bouton, Chiffre, Vide } from '../components/admin/ui';
import { Language, Client, Document } from '../types';
import { useCollection } from '../lib/firestore';

interface AdminFinanceProps {
  lang: Language;
}

const TAX_RATE = 0.14975;
const ENCRE = '#1A1A1E';
const ROSE = '#A8104A';
const FILET = '#DDD7CD';
const GRIS = '#5E5850';
const PIE_COLORS = [ROSE, ENCRE, GRIS];

type DateRange = '30D' | '90D' | 'YTD' | 'ALL';

const computeItemsTotal = (items: { quantity: number; price: number }[] = []) =>
  items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);

const AdminFinance: React.FC<AdminFinanceProps> = ({ lang }) => {
  const [dateRange, setDateRange] = useState<DateRange>('YTD');
  const [ledgerFilter, setLedgerFilter] = useState('');

  const { data: documents, loading: loadingDocs } = useCollection<Document>('documents');
  const { data: clients, loading: loadingClients } = useCollection<Client>('clients');

  const loading = loadingDocs || loadingClients;

  const t = {
    FR: {
      title: 'Analyse financière',
      subtitle: 'Vue d\'ensemble de la santé financière et comptable.',
      export: 'Exporter le rapport',
      totalRev: 'Revenus totaux (ÉTY)',
      avgInvoice: 'Facture moyenne (ÉTY)',
      outstanding: 'Montant en attente',
      paidCount: 'Factures payées (ÉTY)',
      cashflow: 'Flux de trésorerie',
      rev: 'Revenus',
      distrib: 'Répartition des revenus',
      ledger: 'Grand livre (récent)',
      filter: 'Filtrer...',
      date: 'Date',
      desc: 'Description',
      cat: 'Catégorie',
      amount: 'Montant',
      status: 'Statut',
      viewAll: 'Voir toutes les transactions',
      paid: 'Payé',
      pending: 'En attente',
      loading: 'Chargement...',
      videTitre: 'Aucune transaction',
      videTexte: 'Aucune facture payée pour cette période.',
      videGraphTitre: 'Aucune répartition',
      videGraphTexte: 'Aucun revenu réparti par type de client pour cette période.',
    },
    EN: {
      title: 'Financial Analysis',
      subtitle: 'Overview of financial health and accounting.',
      export: 'Export report',
      totalRev: 'Total Revenue (YTD)',
      avgInvoice: 'Average Invoice (YTD)',
      outstanding: 'Outstanding Amount',
      paidCount: 'Paid Invoices (YTD)',
      cashflow: 'Cash Flow',
      rev: 'Revenue',
      distrib: 'Revenue Distribution',
      ledger: 'Ledger (Recent)',
      filter: 'Filter...',
      date: 'Date',
      desc: 'Description',
      cat: 'Category',
      amount: 'Amount',
      status: 'Status',
      viewAll: 'View all transactions',
      paid: 'Paid',
      pending: 'Pending',
      loading: 'Loading...',
      videTitre: 'No transactions',
      videTexte: 'No paid invoice for this period.',
      videGraphTitre: 'No distribution',
      videGraphTexte: 'No revenue split by client type for this period.',
    }
  }[lang];

  // --- DATE FILTER ---
  const filteredDocuments = useMemo(() => {
    const now = new Date();
    return documents.filter(d => {
      if (!d.date) return false;
      const dt = new Date(d.date);
      switch (dateRange) {
        case '30D': {
          const cutoff = new Date(now);
          cutoff.setDate(cutoff.getDate() - 30);
          return dt >= cutoff;
        }
        case '90D': {
          const cutoff = new Date(now);
          cutoff.setDate(cutoff.getDate() - 90);
          return dt >= cutoff;
        }
        case 'YTD': {
          return dt.getFullYear() === now.getFullYear();
        }
        case 'ALL':
        default:
          return true;
      }
    });
  }, [documents, dateRange]);

  // --- MONTHLY CHART (12 months back, paid invoices) ---
  const MONTHLY_DATA = useMemo(() => {
    const monthLabelsFR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const monthLabelsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = lang === 'FR' ? monthLabelsFR : monthLabelsEN;
    const now = new Date();

    const buckets: { name: string; revenus: number; key: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        name: labels[d.getMonth()],
        revenus: 0,
        key: `${d.getFullYear()}-${d.getMonth()}`,
      });
    }

    filteredDocuments.forEach(d => {
      if (d.type !== 'Invoice' || d.status !== 'Paid' || !d.date) return;
      const date = new Date(d.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = buckets.find(b => b.key === key);
      if (!bucket) return;
      bucket.revenus += computeItemsTotal(d.items) * (1 + TAX_RATE);
    });

    return buckets.map(({ name, revenus }) => ({
      name,
      revenus: Math.round(revenus),
    }));
  }, [filteredDocuments, lang]);

  // --- REVENUE BY SOURCE (by client serviceType) ---
  const REVENUE_BY_SOURCE = useMemo(() => {
    const clientMap = new Map<string, Client>(clients.map(c => [c.id, c]));
    const totals: Record<string, number> = { Artist: 0, Organism: 0, Entrepreneur: 0 };

    filteredDocuments.forEach(d => {
      if (d.type !== 'Invoice' || d.status !== 'Paid') return;
      const client = clientMap.get(d.clientId);
      const bucket = client?.serviceType;
      if (!bucket) return;
      totals[bucket] = (totals[bucket] || 0) + computeItemsTotal(d.items) * (1 + TAX_RATE);
    });

    return Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [filteredDocuments, clients]);

  // --- RECENT TRANSACTIONS (latest 10 paid documents) ---
  const RECENT_TRANSACTIONS = useMemo(() => {
    return [...filteredDocuments]
      .filter(d => d.status === 'Paid' && !!d.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(d => ({
        id: d.id,
        date: d.date,
        client: d.clientName || '–',
        desc: d.clientName || '–',
        category: 'Revenu',
        amount: Math.round(computeItemsTotal(d.items) * (1 + TAX_RATE) * 100) / 100,
        status: d.status,
      }));
  }, [filteredDocuments]);

  const LEDGER_ROWS = useMemo(() => {
    const term = ledgerFilter.trim().toLowerCase();
    if (!term) return RECENT_TRANSACTIONS;
    return RECENT_TRANSACTIONS.filter(
      (tx) => tx.desc.toLowerCase().includes(term) || tx.category.toLowerCase().includes(term)
    );
  }, [RECENT_TRANSACTIONS, ledgerFilter]);

  // --- KPI CALCS ---
  const now = new Date();
  const ytdDocs = useMemo(
    () => documents.filter(d => d.date && new Date(d.date).getFullYear() === now.getFullYear()),
    [documents]
  );

  const totalRevenue = useMemo(() => {
    return ytdDocs
      .filter(d => d.type === 'Invoice' && d.status === 'Paid')
      .reduce((sum, d) => sum + computeItemsTotal(d.items) * (1 + TAX_RATE), 0);
  }, [ytdDocs]);

  const paidInvoicesYTD = useMemo(() => {
    return ytdDocs.filter(d => d.type === 'Invoice' && d.status === 'Paid').length;
  }, [ytdDocs]);

  const averageInvoiceValue = useMemo(() => {
    const paid = ytdDocs.filter(d => d.type === 'Invoice' && d.status === 'Paid');
    if (paid.length === 0) return 0;
    const sum = paid.reduce((s, d) => s + computeItemsTotal(d.items) * (1 + TAX_RATE), 0);
    return sum / paid.length;
  }, [ytdDocs]);

  const outstandingTotal = useMemo(() => {
    return documents
      .filter(d => d.type === 'Invoice' && d.status === 'Sent')
      .reduce((sum, d) => sum + computeItemsTotal(d.items) * (1 + TAX_RATE), 0);
  }, [documents]);

  // --- EXPORT FUNCTION ---
  const handleExportLedger = () => {
    const headers = ["ID,Date,Client,Category,Amount,Status"];
    const rows = RECENT_TRANSACTIONS.map(tx =>
      `${tx.id},${tx.date},"${tx.client}",${tx.category},${tx.amount},${tx.status}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grand_livre_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="px-6 md:px-10 py-10">
        <p className="text-gris text-sm">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">

      <EnTete
        kicker="Finances"
        titre={t.title}
        lede={t.subtitle}
        actions={
          <>
            <div className="border border-filet rounded-pilule p-1 flex">
              {(['30D', '90D', 'YTD', 'ALL'] as DateRange[]).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 min-h-[36px] rounded-pilule text-sm font-medium transition-colors ${dateRange === range ? 'bg-encre text-papier' : 'text-gris hover:text-encre'}`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Bouton variante="secondaire" icone={Download} onClick={handleExportLedger}>
              {t.export}
            </Bouton>
          </>
        }
      />

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panneau>
          <Chiffre valeur={`${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`} libelle={t.totalRev} />
        </Panneau>
        <Panneau>
          <Chiffre valeur={`${averageInvoiceValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`} libelle={t.avgInvoice} />
        </Panneau>
        <Panneau>
          <Chiffre valeur={`${outstandingTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`} libelle={t.outstanding} />
        </Panneau>
        <Panneau>
          <Chiffre valeur={paidInvoicesYTD} libelle={t.paidCount} />
        </Panneau>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAIN CHART */}
        <Panneau
          className="lg:col-span-2"
          titre={t.cashflow}
          actions={
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-pilule bg-rose" />
              <span className="text-xs text-gris">{t.rev}</span>
            </div>
          }
        >
          <div className="h-[320px] w-full">
            {MONTHLY_DATA.every(m => m.revenus === 0) ? (
              <Vide titre={t.videTitre} texte={t.videTexte} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ROSE} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={ROSE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke={GRIS} tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke={GRIS} tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" stroke={FILET} vertical={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FBF9F4', borderColor: FILET, borderRadius: '6px', color: ENCRE }}
                    itemStyle={{ color: ENCRE }}
                  />
                  <Area type="monotone" dataKey="revenus" stroke={ROSE} fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panneau>

        {/* PIE CHART */}
        <Panneau titre={t.distrib}>
          <div className="flex-1 min-h-[250px] relative">
            {REVENUE_BY_SOURCE.length === 0 ? (
              <Vide titre={t.videGraphTitre} texte={t.videGraphTexte} />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={REVENUE_BY_SOURCE}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {REVENUE_BY_SOURCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FBF9F4', borderColor: FILET, borderRadius: '6px', color: ENCRE }}
                    formatter={(value: number) => `${value.toLocaleString()} $`}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panneau>
      </div>

      {/* LEDGER TABLE */}
      <Panneau
        titre={t.ledger}
        actions={
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" aria-hidden="true" />
            <input
              type="text"
              value={ledgerFilter}
              onChange={(e) => setLedgerFilter(e.target.value)}
              placeholder={t.filter}
              aria-label={t.filter}
              className="bg-papier border border-filet rounded-champ pl-10 pr-4 py-2 text-sm text-encre placeholder-gris outline-none focus:border-rose w-48"
            />
          </div>
        }
      >
        {LEDGER_ROWS.length === 0 ? (
          <Vide titre={t.videTitre} texte={t.videTexte} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="divide-y divide-filet border-b border-filet">
                  <th className="py-3 kicker text-gris">{t.date}</th>
                  <th className="py-3 kicker text-gris">{t.desc}</th>
                  <th className="py-3 kicker text-gris">{t.cat}</th>
                  <th className="py-3 kicker text-gris text-right">{t.amount}</th>
                  <th className="py-3 kicker text-gris text-center">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-filet">
                {LEDGER_ROWS.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3 text-sm text-gris">{tx.date}</td>
                    <td className="py-3 text-sm font-medium text-encre">{tx.desc}</td>
                    <td className="py-3 text-sm text-gris">{tx.category}</td>
                    <td className="py-3 text-sm text-right font-medium text-encre">
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} $
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center rounded-pilule px-2.5 py-0.5 text-xs font-medium ${
                        tx.status === 'Paid' ? 'bg-rose/10 text-rose' : 'border border-filet text-gris'
                      }`}>
                        {tx.status === 'Paid' ? t.paid : t.pending}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {LEDGER_ROWS.length > 0 && (
          <div className="mt-6 text-center">
            <button type="button" className="text-sm text-rose hover:text-encre transition-colors font-medium">{t.viewAll}</button>
          </div>
        )}
      </Panneau>

    </div>
  );
};

export default AdminFinance;
