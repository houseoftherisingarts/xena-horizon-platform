import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, FileText, Search } from 'lucide-react';
import { Language, Client, Document, Lead, ClientStatus } from '../types';
import { useCollection } from '../lib/firestore';

interface AdminDashboardProps {
  lang: Language;
}

const TAX_RATE = 0.14975;

const computeItemsTotal = (items: { quantity: number; price: number }[] = []) =>
  items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);

const StatCard = ({ title, value, subValue, icon: Icon, colorClass }: any) => (
  <div className="bg-slate-900 border border-white/10 rounded-[20px] p-6 flex items-start justify-between relative overflow-hidden group hover:border-blue-500/30 transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClass}`}>
       <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-3xl font-serif font-bold text-white mb-2">{value}</h3>
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${colorClass.replace('text-', 'bg-').replace('0', '0/10')} ${colorClass}`}>
        {subValue}
      </span>
    </div>
    <div className={`p-3 rounded-xl bg-white/5 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const AVATAR_COLORS = ['bg-pink-500', 'bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-purple-500'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const { data: clients, loading: loadingClients } = useCollection<Client>('clients');
  const { data: documents, loading: loadingDocs } = useCollection<Document>('documents');
  const { data: leads, loading: loadingLeads } = useCollection<Lead>('leads');

  const loading = loadingClients || loadingDocs || loadingLeads;

  const t = {
    FR: {
      hello: 'Bonjour, Xena',
      subtitle: 'Voici ce qui se passe dans votre univers aujourd\'hui.',
      sales: 'Ventes (Octobre)',
      orders: 'Commandes à Traiter',
      visits: 'Visites du site',
      clients: 'Clients Actifs',
      performance: 'Performance des ventes',
      recent: 'Dernières commandes',
      nextEvent: 'Prochain Événement',
      forecast: 'Prévision',
      gross: 'Ventes Brutes',
      vsMonth: '+12% vs mois dernier',
      toShip: 'À expédier',
      currentQ: 'Trimestre en cours',
      items: 'article(s)',
      bookFair: 'Salon du Livre de l\'Estrie',
      fairCenter: 'Centre de foires',
      loading: 'Chargement...'
    },
    EN: {
      hello: 'Hello, Xena',
      subtitle: 'Here is what is happening in your universe today.',
      sales: 'Sales (October)',
      orders: 'Orders to Process',
      visits: 'Site Visits',
      clients: 'Active Clients',
      performance: 'Sales Performance',
      recent: 'Recent Orders',
      nextEvent: 'Next Event',
      forecast: 'Forecast',
      gross: 'Gross Sales',
      vsMonth: '+12% vs last month',
      toShip: 'To ship',
      currentQ: 'Current Quarter',
      items: 'item(s)',
      bookFair: 'Estrie Book Fair',
      fairCenter: 'Exhibition Center',
      loading: 'Loading...'
    }
  }[lang];

  // --- DERIVED VALUES ---
  const today = new Date();

  const activeClientsCount = useMemo(
    () => clients.filter(c => c.status === ClientStatus.ACTIVE || (c.status as any) === 'Active').length,
    [clients]
  );

  const pendingLeadsCount = useMemo(
    () => leads.filter(l => !l.archived && !l.read).length,
    [leads]
  );

  const revenueMTD = useMemo(() => {
    return documents
      .filter(d =>
        d.type === 'Invoice' &&
        d.status === 'Paid' &&
        d.date &&
        new Date(d.date).getMonth() === today.getMonth() &&
        new Date(d.date).getFullYear() === today.getFullYear()
      )
      .reduce((sum, d) => {
        const sub = computeItemsTotal(d.items);
        return sum + sub * (1 + TAX_RATE);
      }, 0);
  }, [documents]);

  const outstandingTotal = useMemo(() => {
    return documents
      .filter(d => d.type === 'Invoice' && d.status === 'Sent')
      .reduce((sum, d) => sum + computeItemsTotal(d.items) * (1 + TAX_RATE), 0);
  }, [documents]);

  // Monthly chart: last 6 months
  const chartData = useMemo(() => {
    const monthLabelsFR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const monthLabelsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = lang === 'FR' ? monthLabelsFR : monthLabelsEN;

    const buckets: { name: string; revenus: number; taxes: number; key: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      buckets.push({
        name: labels[d.getMonth()],
        revenus: 0,
        taxes: 0,
        key: `${d.getFullYear()}-${d.getMonth()}`
      });
    }

    documents.forEach(d => {
      if (d.type !== 'Invoice' || !d.date) return;
      const date = new Date(d.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = buckets.find(b => b.key === key);
      if (!bucket) return;
      const sub = computeItemsTotal(d.items);
      bucket.revenus += sub;
      bucket.taxes += sub * TAX_RATE;
    });

    return buckets.map(({ name, revenus, taxes }) => ({
      name,
      revenus: Math.round(revenus),
      taxes: Math.round(taxes),
    }));
  }, [documents, lang]);

  // Recent orders: latest 5 documents
  const recentOrders = useMemo(() => {
    return [...documents]
      .filter(d => !!d.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((d, idx) => {
        const total = computeItemsTotal(d.items) * (1 + TAX_RATE);
        const initials = (d.clientName || '??')
          .split(' ')
          .map(s => s[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase();
        return {
          id: d.id,
          name: d.clientName || '—',
          item: `${d.items?.length ?? 0} ${t.items}`,
          price: `${total.toFixed(2)}$`,
          initial: initials || '??',
          color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
          status: d.status,
        };
      });
  }, [documents, t.items]);

  if (loading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto">
        <p className="text-slate-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">

      {/* HEADER SECTION - Buttons removed as requested */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">{t.hello}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      {/* METRICS ROW - Adjusted grid for better laptop scaling */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title={t.sales}
          value={`${revenueMTD.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`}
          subValue={t.vsMonth}
          icon={DollarSign}
          colorClass="text-emerald-400"
        />
        <StatCard
          title={t.orders}
          value={`${outstandingTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`}
          subValue={t.toShip}
          icon={FileText}
          colorClass="text-blue-400"
        />
        <StatCard
          title={t.visits}
          value={String(pendingLeadsCount)}
          subValue="+5% vs mois dernier"
          icon={Search}
          colorClass="text-purple-400"
        />
        <StatCard
          title={t.clients}
          value={String(activeClientsCount)}
          subValue={t.currentQ}
          icon={Users}
          colorClass="text-cyan-400"
        />
      </div>

      {/* MAIN CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-[24px] p-8">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-white">{t.performance}</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}$`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                />
                <Bar dataKey="revenus" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} name="Ventes" />
                <Bar dataKey="taxes" fill="#64748b" radius={[6, 6, 0, 0]} barSize={20} name="Prévision" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-500"></div>
               <span className="text-sm text-slate-400">{t.forecast}</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <span className="text-sm text-slate-400">{t.gross}</span>
             </div>
          </div>
        </div>

        {/* RECENT ORDERS / LIST SECTION */}
        <div className="bg-slate-900 border border-white/10 rounded-[24px] p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">{t.recent}</h3>
          <div className="space-y-6 flex-1">
             {recentOrders.map((order) => (
               <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full ${order.color} flex items-center justify-center text-white font-bold text-xs`}>
                     {order.initial}
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{order.name}</h4>
                     <p className="text-xs text-slate-500">{order.item}</p>
                   </div>
                 </div>
                 <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{order.price}</span>
               </div>
             ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[20px] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <Star className="w-24 h-24 rotate-12" />
                </div>
                <h4 className="font-serif font-bold text-lg mb-1">{t.nextEvent}</h4>
                <p className="text-2xl font-bold mb-2">2023-11-15</p>
                <p className="text-sm text-blue-100 mb-4">{t.bookFair}</p>
                <span className="text-[10px] bg-black/20 px-2 py-1 rounded text-white/80">{t.fairCenter}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

function Star(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  )
}

export default AdminDashboard;
