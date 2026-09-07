import React, { useState, useRef } from 'react';
import { Search, Filter, MoreVertical, Plus, Download, Upload, X, Save, CheckCircle, Circle, Trash2, Calendar, FileText } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { Client, ClientStatus, Task, Language } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';

interface AdminCRMProps {
  lang: Language;
}

const AdminCRM: React.FC<AdminCRMProps> = ({ lang }) => {
  const { data: clients, loading } = useCollection<Client>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const t = {
    FR: {
      title: 'CRM Clients',
      subtitle: 'Gérez vos relations et suivis.',
      import: 'Importer CSV',
      export: 'Exporter CSV',
      newClient: 'Nouveau Client',
      search: 'Rechercher un client...',
      filters: 'Filtres',
      type: 'Type',
      lastContact: 'Dernier Contact',
      payment: 'Paiement',
      cancel: 'Annuler',
      create: 'Créer le dossier',
      fullName: 'Nom Complet',
      org: 'Organisation',
      email: 'Email',
      serviceType: 'Type de Service',
      paymentType: 'Type Paiement',
      status: 'Statut',
      date: 'Date (Prévue/Effectuée)',
      notes: 'Notes Initiales',
      billing: 'Facturation',
      clientNotes: 'Notes sur le client...',
      tasks: 'Tâches',
      noTasks: 'Aucune tâche pour le moment.',
      newTask: 'Nouvelle tâche...',
      pending: 'En attente',
      paid: 'Payé',
      overdue: 'En retard',
      once: 'Une fois',
      recurring: 'Récurrent',
      artist: 'Artiste',
      organism: 'Organisme',
      entrepreneur: 'Entrepreneur'
    },
    EN: {
      title: 'Client CRM',
      subtitle: 'Manage your relationships and follow-ups.',
      import: 'Import CSV',
      export: 'Export CSV',
      newClient: 'New Client',
      search: 'Search client...',
      filters: 'Filters',
      type: 'Type',
      lastContact: 'Last Contact',
      payment: 'Payment',
      cancel: 'Cancel',
      create: 'Create File',
      fullName: 'Full Name',
      org: 'Organization',
      email: 'Email',
      serviceType: 'Service Type',
      paymentType: 'Payment Type',
      status: 'Status',
      date: 'Date (Expected/Done)',
      notes: 'Initial Notes',
      billing: 'Billing',
      clientNotes: 'Client notes...',
      tasks: 'Tasks',
      noTasks: 'No tasks yet.',
      newTask: 'New task...',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      once: 'One-time',
      recurring: 'Recurring',
      artist: 'Artist',
      organism: 'Organism',
      entrepreneur: 'Entrepreneur'
    }
  }[lang];

  // New Client Form State
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    organization: '',
    email: '',
    status: ClientStatus.LEAD,
    serviceType: 'Artist',
    paymentType: 'Once',
    paymentStatus: 'Pending',
    notes: '',
    paymentDate: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CSV HANDLERS ---
  const handleExportCSV = () => {
    const headers = ["ID,Name,Organization,Email,Status,ServiceType,PaymentStatus,LastContact"];
    const rows = clients.map(c => 
      `${c.id},"${c.name}","${c.organization}",${c.email},${c.status},${c.serviceType},${c.paymentStatus},${c.lastContact}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "xena_clients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        // Simple CSV Parsing (Assumes standard format)
        const lines = text.split('\n');
        // Skip header row 0
        const newClients: Omit<Client, 'id'>[] = [];
        for(let i = 1; i < lines.length; i++) {
           const line = lines[i];
           if(!line) continue;
           // Regex to handle comma inside quotes
           const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
           if(matches && matches.length >= 7) {
              const clean = (s: string) => s ? s.replace(/"/g, '') : '';
              newClients.push({
                name: clean(matches[1]),
                organization: clean(matches[2]),
                email: clean(matches[3]),
                status: (clean(matches[4]) as ClientStatus) || ClientStatus.LEAD,
                serviceType: (clean(matches[5]) as any) || 'Artist',
                paymentStatus: 'Pending',
                paymentType: 'Once',
                notes: 'Imported from CSV',
                lastContact: new Date().toISOString().split('T')[0],
                tasks: []
              });
           }
        }
        if(newClients.length > 0) {
          for (const row of newClients) {
            await createDoc<Client>('clients', row as Client);
          }
          alert(`${newClients.length} clients importés avec succès.`);
        }
      };
      reader.readAsText(file);
    }
  };

  // --- CRUD HANDLERS ---
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientData: Omit<Client, 'id'> = {
      name: newClient.name || 'Nouveau Client',
      organization: newClient.organization || '',
      email: newClient.email || '',
      status: newClient.status || ClientStatus.LEAD,
      serviceType: newClient.serviceType || 'Artist',
      paymentStatus: newClient.paymentStatus || 'Pending',
      paymentType: newClient.paymentType || 'Once',
      paymentDate: newClient.paymentDate,
      notes: newClient.notes || '',
      lastContact: new Date().toISOString().split('T')[0],
      tasks: []
    };
    await createDoc<Client>('clients', clientData as Client);
    setIsAddModalOpen(false);
    setNewClient({
       name: '', organization: '', email: '', status: ClientStatus.LEAD,
       serviceType: 'Artist', paymentType: 'Once', paymentStatus: 'Pending', notes: '', paymentDate: ''
    });
  };

  const updateClient = async (updated: Client) => {
    const { id, ...rest } = updated;
    await patchDoc<Client>('clients', id, rest);
    setSelectedClient(updated);
  };

  // --- TASK HANDLERS ---
  const [newTaskText, setNewTaskText] = useState('');

  const addTaskToClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedClient || !newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };

    const nextTasks = [newTask, ...selectedClient.tasks];
    await patchDoc<Client>('clients', selectedClient.id, { tasks: nextTasks });
    setSelectedClient({ ...selectedClient, tasks: nextTasks });
    setNewTaskText('');
  };

  const toggleTask = async (taskId: string) => {
    if(!selectedClient) return;
    const nextTasks = selectedClient.tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t);
    await patchDoc<Client>('clients', selectedClient.id, { tasks: nextTasks });
    setSelectedClient({ ...selectedClient, tasks: nextTasks });
  };

  const deleteTask = async (taskId: string) => {
    if(!selectedClient) return;
    const nextTasks = selectedClient.tasks.filter(t => t.id !== taskId);
    await patchDoc<Client>('clients', selectedClient.id, { tasks: nextTasks });
    setSelectedClient({ ...selectedClient, tasks: nextTasks });
  };


  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case ClientStatus.ACTIVE: return 'bg-green-500/20 text-green-400 border-green-500/30';
      case ClientStatus.LEAD: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case ClientStatus.COMPLETED: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-slate-400">{lang === 'FR' ? 'Chargement...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto space-y-8 relative">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-3 rounded-[15px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10" title={t.import}>
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleExportCSV} className="px-4 py-3 rounded-[15px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10" title={t.export}>
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className={ACTION_BUTTON_CLASSES}>
            <Plus className="w-4 h-4" /> {t.newClient}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.search} 
            className={`${GLASS_INPUT_CLASSES} pl-10`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-[15px] bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4" /> {t.filters}
          </button>
        </div>
      </GlassCard>

      {/* CLIENT LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map((client) => (
          <GlassCard 
            key={client.id} 
            className="p-6 cursor-pointer" 
            hoverEffect 
            onClick={() => setSelectedClient(client)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{client.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
                <p className="text-blue-400 text-sm mb-1">{client.organization}</p>
                <p className="text-slate-400 text-sm line-clamp-1">{client.notes}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:items-center text-sm text-slate-400">
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wider">{t.type}</span>
                  {client.serviceType}
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wider">{t.lastContact}</span>
                  {client.lastContact}
                </div>
                <div className="min-w-[100px]">
                  <span className="block text-xs text-slate-500 uppercase tracking-wider">{t.payment}</span>
                  <div className="flex items-center gap-2">
                     <span className={client.paymentStatus === 'Paid' ? 'text-green-400' : 'text-yellow-400'}>
                      {client.paymentStatus}
                    </span>
                    {client.paymentType === 'Recurring' && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1 rounded">Recur.</span>}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* --- ADD CLIENT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-[20px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h2 className="text-xl font-serif font-bold text-white">{t.newClient}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleAddClient} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t.fullName}</label>
                    <input required type="text" className={GLASS_INPUT_CLASSES} value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t.org}</label>
                    <input type="text" className={GLASS_INPUT_CLASSES} value={newClient.organization} onChange={e => setNewClient({...newClient, organization: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t.email}</label>
                    <input required type="email" className={GLASS_INPUT_CLASSES} value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t.serviceType}</label>
                    <select className={GLASS_INPUT_CLASSES} value={newClient.serviceType} onChange={e => setNewClient({...newClient, serviceType: e.target.value as any})}>
                      <option value="Artist">{t.artist}</option>
                      <option value="Organism">{t.organism}</option>
                      <option value="Entrepreneur">{t.entrepreneur}</option>
                    </select>
                  </div>
               </div>

               <div className="border-t border-white/5 pt-4">
                  <h3 className="text-sm font-bold text-blue-300 mb-4 uppercase tracking-wider">{t.billing}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">{t.paymentType}</label>
                        <select className={GLASS_INPUT_CLASSES} value={newClient.paymentType} onChange={e => setNewClient({...newClient, paymentType: e.target.value as any})}>
                          <option value="Once">{t.once}</option>
                          <option value="Recurring">{t.recurring}</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">{t.status}</label>
                        <select className={GLASS_INPUT_CLASSES} value={newClient.paymentStatus} onChange={e => setNewClient({...newClient, paymentStatus: e.target.value as any})}>
                          <option value="Pending">{t.pending}</option>
                          <option value="Paid">{t.paid}</option>
                          <option value="Overdue">{t.overdue}</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">{t.date}</label>
                        <input type="date" className={GLASS_INPUT_CLASSES} value={newClient.paymentDate} onChange={e => setNewClient({...newClient, paymentDate: e.target.value})} />
                    </div>
                  </div>
               </div>

               <div>
                 <label className="text-sm text-slate-400 mb-1 block">{t.notes}</label>
                 <textarea className={`${GLASS_INPUT_CLASSES} h-24 resize-none`} value={newClient.notes} onChange={e => setNewClient({...newClient, notes: e.target.value})}></textarea>
               </div>

               <div className="flex justify-end gap-3 pt-4">
                 <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-[15px] hover:bg-white/5 text-slate-300 transition-colors">{t.cancel}</button>
                 <button type="submit" className={ACTION_BUTTON_CLASSES}>{t.create}</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CLIENT DETAIL MODAL --- */}
      {selectedClient && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 rounded-[20px] shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
              
              {/* Detail Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start bg-slate-900 rounded-t-[20px]">
                <div className="flex items-start gap-4">
                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {selectedClient.name.charAt(0)}
                   </div>
                   <div>
                      <h2 className="text-2xl font-serif font-bold text-white">{selectedClient.name}</h2>
                      <p className="text-blue-400">{selectedClient.organization}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedClient.status)}`}>
                            {selectedClient.status}
                        </span>
                        <span className="text-xs text-slate-500">• {selectedClient.email}</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6"/></button>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Info & Notes */}
                  <div className="lg:col-span-2 space-y-8">
                     {/* Info Cards */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-[15px] p-4 border border-white/5">
                           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.payment}</p>
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`font-bold ${selectedClient.paymentStatus === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}>{selectedClient.paymentStatus}</span>
                              <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">{selectedClient.paymentType}</span>
                           </div>
                           {selectedClient.paymentDate && <p className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> {selectedClient.paymentDate}</p>}
                        </div>
                        <div className="bg-white/5 rounded-[15px] p-4 border border-white/5">
                           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.lastContact}</p>
                           <p className="font-bold text-white">{selectedClient.lastContact}</p>
                           <p className="text-xs text-slate-400">Service: {selectedClient.serviceType}</p>
                        </div>
                     </div>

                     {/* Notes Area */}
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5"/> Notes</h3>
                        <textarea 
                           className={`${GLASS_INPUT_CLASSES} h-40 resize-none`} 
                           value={selectedClient.notes}
                           onChange={(e) => updateClient({...selectedClient, notes: e.target.value})}
                           placeholder={t.clientNotes}
                        />
                     </div>
                  </div>

                  {/* Right Column: Tasks */}
                  <div className="bg-slate-950/50 rounded-[20px] border border-white/5 p-6 flex flex-col h-full">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> {t.tasks}</h3>
                     
                     <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 custom-scrollbar">
                        {selectedClient.tasks.length === 0 && <p className="text-sm text-slate-500 text-center py-4">{t.noTasks}</p>}
                        
                        {selectedClient.tasks.map(task => (
                           <div key={task.id} className="group flex items-start gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                              <button onClick={() => toggleTask(task.id)} className={`mt-0.5 ${task.completed ? 'text-green-400' : 'text-slate-500 hover:text-blue-400'}`}>
                                 {task.completed ? <CheckCircle className="w-5 h-5"/> : <Circle className="w-5 h-5"/>}
                              </button>
                              <span className={`text-sm flex-1 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                 {task.text}
                              </span>
                              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        ))}
                     </div>

                     <form onSubmit={addTaskToClient} className="mt-auto">
                        <div className="relative">
                           <input 
                              type="text" 
                              className={`${GLASS_INPUT_CLASSES} pr-10`} 
                              placeholder={t.newTask}
                              value={newTaskText}
                              onChange={(e) => setNewTaskText(e.target.value)}
                           />
                           <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors">
                              <Plus className="w-4 h-4" />
                           </button>
                        </div>
                     </form>
                  </div>

              </div>

            </div>
         </div>
      )}

    </div>
  );
};

export default AdminCRM;