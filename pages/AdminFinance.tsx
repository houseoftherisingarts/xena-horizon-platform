import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Download, Calendar, TrendingUp, TrendingDown, DollarSign,
  FileSpreadsheet, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { Language, Client, Document } from '../types';
import { useCollection } from '../lib/firestore';

interface AdminFinanceProps {
  lang: Language;
}

const TAX_RATE = 0.14975;
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

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
      title: 'Analyse Financière',
      subtitle: 'Vue d\'ensemble de la santé financière et comptable.',
      export: 'Exporter Rapport',
      totalRev: 'Revenus Totaux (YTD)',
      totalExp: 'Dépenses Totales (YTD)',
      netProfit: 'Bénéfice Net',
      margin: 'Marge',
      taxes: 'Taxes à Remettre (Est.)',
      cashflow: 'Flux de Trésorerie',
      rev: 'Revenus',
      exp: 'Dépenses',
      distrib: 'Répartition des Revenus',
      ledger: 'Grand Livre (Récent)',
      filter: 'Filtrer...',
      date: 'Date',
      desc: 'Description',
      cat: 'Catégorie',
      amount: 'Montant',
      status: 'Statut',
      viewAll: 'Voir toutes les transactions',
      paid: 'Payé',
      pending: 'En attente',
      loading: 'Chargement...'
    },
    EN: {
      title: 'Financial Analysis',
      subtitle: 'Overview of financial health and accounting.',
      export: 'Export Report',
      totalRev: 'Total Revenue (YTD)',
      totalExp: 'Total Expenses (YTD)',
      netProfit: 'Net Profit',
      margin: 'Margin',
      taxes: 'Taxes to Remit (Est.)',
      cashflow: 'Cash Flow',
      rev: 'Revenue',
      exp: 'Expenses',
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
      loading: 'Loading...'
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

    const buckets: { name: string; revenus: number; depenses: number; key: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        name: labels[d.getMonth()],
        revenus: 0,
        depenses: 0,
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

    return buckets.map(({ name, revenus, depenses }) => ({
      name,
      revenus: Math.round(revenus),
      depenses: Math.round(depenses),
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
        client: d.clientName || '—',
        desc: d.clientName || '—',
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

  const netProfit = totalRevenue - outstandingTotal;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

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
      <div className="pt-24 px-6 pb-12 max-w-[1600px] mx-auto">
        <p className="text-slate-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-12 max-w-[1600px] mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-slate-900 border border-white/10 rounded-[15px] p-1 flex">
              {(['30D', '90D', 'YTD', 'ALL'] as DateRange[]).map(range => (
                 <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${dateRange === range ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                 >
                    {range}
                 </button>
              ))}
           </div>
           <button onClick={handleExportLedger} className={ACTION_BUTTON_CLASSES}>
              <Download className="w-4 h-4" /> {t.export}
           </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <ArrowUpRight className="w-24 h-24 text-emerald-500" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.totalRev}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</h3>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
               <TrendingUp className="w-3 h-3" /> +12.5% vs N-1
            </span>
         </GlassCard>

         <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <ArrowDownRight className="w-24 h-24 text-red-500" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.totalExp}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{averageInvoiceValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</h3>
            <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
               <TrendingDown className="w-3 h-3" /> +5.2% vs N-1
            </span>
         </GlassCard>

         <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <DollarSign className="w-24 h-24 text-blue-500" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.netProfit}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{outstandingTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 w-fit ${margin > 0 ? 'text-blue-400 bg-blue-400/10' : 'text-red-400 bg-red-400/10'}`}>
               {t.margin}: {margin.toFixed(1)}%
            </span>
         </GlassCard>

         <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <FileSpreadsheet className="w-24 h-24 text-purple-500" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.taxes}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{paidInvoicesYTD}</h3>
            <span className="text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
               TPS/TVQ
            </span>
         </GlassCard>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

         {/* MAIN CHART */}
         <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-[24px] p-8">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">{t.cashflow}</h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                     <span className="text-xs text-slate-400">{t.rev}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-red-500"></span>
                     <span className="text-xs text-slate-400">{t.exp}</span>
                  </div>
               </div>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_DATA}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Area type="monotone" dataKey="revenus" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                     <Area type="monotone" dataKey="depenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorDep)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* PIE CHART */}
         <div className="bg-slate-900 border border-white/10 rounded-[24px] p-8 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">{t.distrib}</h3>
            <div className="flex-1 min-h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
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
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        formatter={(value: number) => `${value.toLocaleString()} $`}
                     />
                     <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
               </ResponsiveContainer>
               {/* Center Text */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] text-center pointer-events-none">
                  <p className="text-2xl font-bold text-white">100%</p>
               </div>
            </div>
         </div>
      </div>

      {/* LEDGER TABLE */}
      <GlassCard className="p-8">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">{t.ledger}</h3>
            <div className="relative">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                  type="text"
                  value={ledgerFilter}
                  onChange={(e) => setLedgerFilter(e.target.value)}
                  placeholder={t.filter}
                  aria-label={t.filter}
                  className={`${GLASS_INPUT_CLASSES} pl-10 py-1.5 h-auto text-sm w-48`}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                     <th className="py-4 font-bold">{t.date}</th>
                     <th className="py-4 font-bold">{t.desc}</th>
                     <th className="py-4 font-bold">{t.cat}</th>
                     <th className="py-4 font-bold text-right">{t.amount}</th>
                     <th className="py-4 font-bold text-center">{t.status}</th>
                  </tr>
               </thead>
               <tbody className="text-sm text-slate-300">
                  {RECENT_TRANSACTIONS.map((tx) => (
                     <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono text-slate-500">{tx.date}</td>
                        <td className="py-4 font-medium text-white">{tx.desc}</td>
                        <td className="py-4">
                           <span className={`px-2 py-1 rounded text-xs ${tx.category === 'Revenu' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {tx.category}
                           </span>
                        </td>
                        <td className={`py-4 text-right font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                           {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} $
                        </td>
                        <td className="py-4 text-center">
                           <span className={`px-2 py-0.5 rounded-full text-xs border ${
                              tx.status === 'Paid' ? 'border-emerald-500/30 text-emerald-400' : 'border-yellow-500/30 text-yellow-400'
                           }`}>
                              {tx.status === 'Paid' ? t.paid : t.pending}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="mt-6 text-center">
            <button className="text-sm text-blue-400 hover:text-white transition-colors font-medium">{t.viewAll}</button>
         </div>
      </GlassCard>

    </div>
  );
};

export default AdminFinance;
