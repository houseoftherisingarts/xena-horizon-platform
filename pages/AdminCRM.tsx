import React, { useState, useRef } from 'react';
import { Search, Plus, Download, Upload, X, CheckCircle, Circle, Trash2, Calendar, FileText } from 'lucide-react';
import { EnTete, Panneau, Bouton, Champ, Zone, Selection, Etiquette, Vide, Chargement } from '../components/admin/ui';
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
      entrepreneur: 'Entrepreneur',
      videTitre: 'Aucun client',
      videTexte: 'Les clients ajoutés au CRM apparaissent ici.',
      service: 'Service'
    },
    EN: {
      title: 'Client CRM',
      subtitle: 'Manage your relationships and follow-ups.',
      import: 'Import CSV',
      export: 'Export CSV',
      newClient: 'New Client',
      search: 'Search client...',
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
      entrepreneur: 'Entrepreneur',
      videTitre: 'No clients yet',
      videTexte: 'Clients added to the CRM appear here.',
      service: 'Service'
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

  const statusTone = (status: ClientStatus): 'neutre' | 'accent' | 'encre' => {
    switch (status) {
      case ClientStatus.ACTIVE: return 'accent';
      case ClientStatus.COMPLETED: return 'encre';
      default: return 'neutre';
    }
  };

  if (loading) {
    return (
      <div className="px-6 md:px-10 py-10">
        <Chargement texte={lang === 'FR' ? 'Chargement...' : 'Loading...'} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">

      <EnTete
        kicker="CRM"
        titre={t.title}
        lede={t.subtitle}
        actions={
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv"
              className="hidden"
            />
            <Bouton variante="secondaire" icone={Upload} petit onClick={() => fileInputRef.current?.click()} title={t.import}>
              {t.import}
            </Bouton>
            <Bouton variante="secondaire" icone={Download} petit onClick={handleExportCSV} title={t.export}>
              {t.export}
            </Bouton>
            <Bouton variante="primaire" icone={Plus} onClick={() => setIsAddModalOpen(true)}>
              {t.newClient}
            </Bouton>
          </>
        }
      />

      {/* SEARCH */}
      <Panneau>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" aria-hidden="true" />
          <input
            type="text"
            placeholder={t.search}
            className="w-full bg-papier border border-filet rounded-champ pl-10 pr-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Panneau>

      {/* CLIENT LIST */}
      {filteredClients.length === 0 ? (
        <Panneau>
          <Vide titre={t.videTitre} texte={t.videTexte} />
        </Panneau>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredClients.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => setSelectedClient(client)}
              className="text-left bg-papier-2 border border-filet rounded-champ p-6 hover:border-encre transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-serif text-lg text-encre">{client.name}</h3>
                    <Etiquette tone={statusTone(client.status)}>{client.status}</Etiquette>
                  </div>
                  {client.organization && <p className="text-rose text-sm mb-1">{client.organization}</p>}
                  {client.notes && <p className="text-gris text-sm line-clamp-1">{client.notes}</p>}
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:items-center text-sm">
                  <div>
                    <span className="block kicker text-gris">{t.type}</span>
                    <span className="text-encre">{client.serviceType}</span>
                  </div>
                  <div>
                    <span className="block kicker text-gris">{t.lastContact}</span>
                    <span className="text-encre">{client.lastContact}</span>
                  </div>
                  <div className="min-w-[100px]">
                    <span className="block kicker text-gris">{t.payment}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-encre">{client.paymentStatus}</span>
                      {client.paymentType === 'Recurring' && <Etiquette tone="neutre">{t.recurring}</Etiquette>}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* --- ADD CLIENT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <div className="bg-papier border border-filet rounded-champ shadow-panneau w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-filet flex justify-between items-center sticky top-0 bg-papier z-10">
              <h2 className="font-serif text-h3 text-encre">{t.newClient}</h2>
              <button onClick={() => setIsAddModalOpen(false)} aria-label={t.cancel} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleAddClient} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Champ label={t.fullName} required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                  <Champ label={t.org} type="text" value={newClient.organization} onChange={e => setNewClient({...newClient, organization: e.target.value})} />
                  <Champ label={t.email} required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                  <Selection label={t.serviceType} value={newClient.serviceType} onChange={e => setNewClient({...newClient, serviceType: e.target.value as any})}>
                    <option value="Artist">{t.artist}</option>
                    <option value="Organism">{t.organism}</option>
                    <option value="Entrepreneur">{t.entrepreneur}</option>
                  </Selection>
               </div>

               <div className="border-t border-filet pt-4">
                  <h3 className="kicker text-rose mb-4">{t.billing}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Selection label={t.paymentType} value={newClient.paymentType} onChange={e => setNewClient({...newClient, paymentType: e.target.value as any})}>
                      <option value="Once">{t.once}</option>
                      <option value="Recurring">{t.recurring}</option>
                    </Selection>
                    <Selection label={t.status} value={newClient.paymentStatus} onChange={e => setNewClient({...newClient, paymentStatus: e.target.value as any})}>
                      <option value="Pending">{t.pending}</option>
                      <option value="Paid">{t.paid}</option>
                      <option value="Overdue">{t.overdue}</option>
                    </Selection>
                    <Champ label={t.date} type="date" value={newClient.paymentDate} onChange={e => setNewClient({...newClient, paymentDate: e.target.value})} />
                  </div>
               </div>

               <Zone label={t.notes} className="min-h-[6rem]" value={newClient.notes} onChange={e => setNewClient({...newClient, notes: e.target.value})} />

               <div className="flex justify-end gap-3 pt-4">
                 <Bouton variante="discret" type="button" onClick={() => setIsAddModalOpen(false)}>{t.cancel}</Bouton>
                 <Bouton variante="primaire" type="submit">{t.create}</Bouton>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CLIENT DETAIL MODAL --- */}
      {selectedClient && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
            <div className="bg-papier border border-filet rounded-champ shadow-panneau w-full max-w-4xl h-[90vh] flex flex-col">

              {/* Detail Header */}
              <div className="p-6 border-b border-filet flex justify-between items-start">
                <div className="flex items-start gap-4">
                   <div className="w-16 h-16 rounded-pilule bg-encre flex items-center justify-center text-2xl font-serif text-papier flex-shrink-0">
                      {selectedClient.name.charAt(0)}
                   </div>
                   <div>
                      <h2 className="font-serif text-h3 text-encre">{selectedClient.name}</h2>
                      {selectedClient.organization && <p className="text-rose text-sm">{selectedClient.organization}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Etiquette tone={statusTone(selectedClient.status)}>{selectedClient.status}</Etiquette>
                        <span className="text-xs text-gris">{selectedClient.email}</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelectedClient(null)} aria-label={t.cancel} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre flex-shrink-0">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Left Column: Info & Notes */}
                  <div className="lg:col-span-2 space-y-8">
                     {/* Info Cards */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-papier-2 border border-filet rounded-champ p-4">
                           <p className="kicker text-gris mb-1">{t.payment}</p>
                           <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-encre">{selectedClient.paymentStatus}</span>
                              <Etiquette tone="neutre">{selectedClient.paymentType}</Etiquette>
                           </div>
                           {selectedClient.paymentDate && <p className="text-xs text-gris flex items-center gap-1"><Calendar className="w-3 h-3"/> {selectedClient.paymentDate}</p>}
                        </div>
                        <div className="bg-papier-2 border border-filet rounded-champ p-4">
                           <p className="kicker text-gris mb-1">{t.lastContact}</p>
                           <p className="font-semibold text-encre">{selectedClient.lastContact}</p>
                           <p className="text-xs text-gris">{t.service} : {selectedClient.serviceType}</p>
                        </div>
                     </div>

                     {/* Notes Area */}
                     <div className="space-y-2">
                        <h3 className="font-sans font-semibold text-encre flex items-center gap-2"><FileText className="w-4 h-4"/> {t.notes}</h3>
                        <textarea
                           className="w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose min-h-[10rem] resize-y"
                           value={selectedClient.notes}
                           onChange={(e) => updateClient({...selectedClient, notes: e.target.value})}
                           placeholder={t.clientNotes}
                        />
                     </div>
                  </div>

                  {/* Right Column: Tasks */}
                  <div className="bg-papier-2 border border-filet rounded-champ p-6 flex flex-col h-full">
                     <h3 className="font-sans font-semibold text-encre mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> {t.tasks}</h3>

                     <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
                        {selectedClient.tasks.length === 0 && <p className="text-sm text-gris text-center py-4">{t.noTasks}</p>}

                        {selectedClient.tasks.map(task => (
                           <div key={task.id} className="group flex items-start gap-3 p-3 rounded-champ bg-papier border border-filet">
                              <button onClick={() => toggleTask(task.id)} className={`mt-0.5 ${task.completed ? 'text-rose' : 'text-gris hover:text-encre'}`} aria-label={t.status}>
                                 {task.completed ? <CheckCircle className="w-5 h-5"/> : <Circle className="w-5 h-5"/>}
                              </button>
                              <span className={`text-sm flex-1 ${task.completed ? 'text-gris line-through' : 'text-encre'}`}>
                                 {task.text}
                              </span>
                              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-gris hover:text-rose transition-opacity" aria-label={t.cancel}>
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        ))}
                     </div>

                     <form onSubmit={addTaskToClient} className="mt-auto">
                        <div className="relative">
                           <input
                              type="text"
                              className="w-full bg-papier border border-filet rounded-champ pl-4 pr-12 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose"
                              placeholder={t.newTask}
                              value={newTaskText}
                              onChange={(e) => setNewTaskText(e.target.value)}
                           />
                           <button type="submit" aria-label={t.newTask} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-pilule bg-encre text-papier hover:bg-encre-2 transition-colors">
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
