import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Language, Client, Document, Lead, ClientStatus } from '../types';
import { useCollection } from '../lib/firestore';
import { EnTete, Panneau, Chiffre, Vide, Chargement } from '../components/admin/ui';

interface AdminDashboardProps {
  lang: Language;
}

const TAX_RATE = 0.14975;

const computeItemsTotal = (items: { quantity: number; price: number }[] = []) =>
  items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const { data: clients, loading: loadingClients } = useCollection<Client>('clients');
  const { data: documents, loading: loadingDocs } = useCollection<Document>('documents');
  const { data: leads, loading: loadingLeads } = useCollection<Lead>('leads');

  const loading = loadingClients || loadingDocs || loadingLeads;

  const t = {
    FR: {
      hello: 'Tableau de bord',
      subtitle: 'Ce qui bouge aujourd\'hui.',
      sales: 'Ventes (ce mois)',
      orders: 'Factures à recevoir',
      leadsLabel: 'Demandes en attente',
      clients: 'Clients actifs',
      performance: 'Performance des ventes',
      recent: 'Dernières commandes',
      revenus: 'Revenus',
      taxes: 'Taxes',
      toShip: 'À encaisser',
      currentQ: 'Total actuel',
      items: 'article(s)',
      loading: 'Chargement...',
      videCommandes: 'Aucune commande pour le moment',
    },
    EN: {
      hello: 'Dashboard',
      subtitle: 'What is moving today.',
      sales: 'Sales (this month)',
      orders: 'Invoices outstanding',
      leadsLabel: 'Pending requests',
      clients: 'Active clients',
      performance: 'Sales performance',
      recent: 'Recent orders',
      revenus: 'Revenue',
      taxes: 'Taxes',
      toShip: 'To collect',
      currentQ: 'Current total',
      items: 'item(s)',
      loading: 'Loading...',
      videCommandes: 'No orders yet',
    },
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
      .map((d) => {
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
          status: d.status,
        };
      });
  }, [documents, t.items]);

  if (loading) {
    return (
      <div className="px-6 md:px-10 py-10">
        <Chargement texte={t.loading} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete titre={t.hello} lede={t.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panneau>
          <Chiffre
            valeur={`${revenueMTD.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`}
            libelle={t.sales}
          />
        </Panneau>
        <Panneau>
          <Chiffre
            valeur={`${outstandingTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} $`}
            libelle={t.orders}
            note={t.toShip}
          />
        </Panneau>
        <Panneau>
          <Chiffre valeur={String(pendingLeadsCount)} libelle={t.leadsLabel} />
        </Panneau>
        <Panneau>
          <Chiffre valeur={String(activeClientsCount)} libelle={t.clients} note={t.currentQ} />
        </Panneau>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Panneau titre={t.performance} className="lg:col-span-2">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD7CD" vertical={false} />
                <XAxis dataKey="name" stroke="#5E5850" tick={{ fontSize: 13 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#5E5850" tick={{ fontSize: 13 }} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}$`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF7F0', borderColor: '#DDD7CD', borderRadius: '6px', color: '#1A1A1E' }}
                  cursor={{ fill: 'rgba(26,26,30,0.04)' }}
                />
                <Bar dataKey="revenus" fill="#A8104A" radius={[6, 6, 0, 0]} barSize={20} name={t.revenus} />
                <Bar dataKey="taxes" fill="#1A1A1E" radius={[6, 6, 0, 0]} barSize={20} name={t.taxes} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-pilule bg-rose" />
              <span className="text-sm text-gris">{t.revenus}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-pilule bg-encre" />
              <span className="text-sm text-gris">{t.taxes}</span>
            </div>
          </div>
        </Panneau>

        <Panneau titre={t.recent}>
          {recentOrders.length === 0 ? (
            <Vide titre={t.videCommandes} />
          ) : (
            <div className="space-y-5">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-pilule bg-encre text-papier flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {order.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-encre truncate">{order.name}</p>
                      <p className="text-xs text-gris">{order.item}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-rose flex-shrink-0">{order.price}</span>
                </div>
              ))}
            </div>
          )}
        </Panneau>
      </div>
    </div>
  );
};

export default AdminDashboard;
