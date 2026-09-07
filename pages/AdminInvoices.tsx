import React, { useState } from 'react';
import { Plus, Search, FileText, Check, Download, Trash2, ArrowLeft, PenTool, CreditCard, Eye, Edit2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { Client, Document, DocumentType, DocumentStatus, InvoiceItem, Language } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';

interface AdminInvoicesProps {
  lang: Language;
}

const DEFAULT_TERMS = "1. Paiement: Un acompte de 50% est requis à la signature. La balance est due à la livraison finale.\n2. Validité: Ce devis est valide pour une période de 30 jours.\n3. Retard: Tout retard de paiement de plus de 30 jours entraînera des frais d'intérêt de 2% par mois.\n4. Propriété: Les livrables restent la propriété de Xena Horizon jusqu'au paiement complet.";

const AdminInvoices: React.FC<AdminInvoicesProps> = ({ lang }) => {
  const { data: documents, loading } = useCollection<Document>('documents');
  const [view, setView] = useState<'list' | 'edit' | 'preview'>('list');
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);

  const t = {
    FR: {
      title: 'Facturation',
      subtitle: 'Gérez vos devis, factures et paiements.',
      newDoc: 'Nouveau Document',
      quote: 'Devis',
      invoice: 'Facture',
      editor: 'Éditeur',
      type: 'Type de document',
      client: 'Client',
      selectClient: 'Sélectionner un client...',
      date: 'Date',
      dueDate: 'Échéance',
      paymentLink: 'Lien de Paiement',
      save: 'Enregistrer',
      description: 'Description',
      qty: 'Qté',
      price: 'Prix',
      addLine: 'Ajouter une ligne',
      subtotal: 'Sous-total',
      tax: 'Taxes',
      total: 'Total',
      terms: 'Conditions',
      back: 'Retour au Dashboard',
      billedTo: 'Facturé à',
      termsTitle: 'Termes et Conditions',
      signature: 'Signature',
      signed: 'Devis accepté et signé',
      clickSign: 'Cliquer ici pour signer',
      payDeposit: 'Payer le dépôt',
      payInvoice: 'Payer la facture',
      noLink: 'Aucun lien de paiement configuré.'
    },
    EN: {
      title: 'Invoicing',
      subtitle: 'Manage quotes, invoices and payments.',
      newDoc: 'New Document',
      quote: 'Quote',
      invoice: 'Invoice',
      editor: 'Editor',
      type: 'Document Type',
      client: 'Client',
      selectClient: 'Select a client...',
      date: 'Date',
      dueDate: 'Due Date',
      paymentLink: 'Payment Link',
      save: 'Save',
      description: 'Description',
      qty: 'Qty',
      price: 'Price',
      addLine: 'Add line',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      terms: 'Terms',
      back: 'Back to Dashboard',
      billedTo: 'Billed To',
      termsTitle: 'Terms & Conditions',
      signature: 'Signature',
      signed: 'Quote accepted and signed',
      clickSign: 'Click here to sign',
      payDeposit: 'Pay Deposit',
      payInvoice: 'Pay Invoice',
      noLink: 'No payment link configured.'
    }
  }[lang];

  // --- EDITOR STATE ---
  const emptyDoc: Document = {
    id: '',
    number: `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    type: 'Quote',
    clientId: '',
    clientName: '',
    clientEmail: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ id: Date.now().toString(), description: '', quantity: 1, price: 0 }],
    status: 'Draft',
    terms: DEFAULT_TERMS,
    paymentLink: ''
  };

  // --- HANDLERS ---
  const handleNew = () => {
    setCurrentDoc({ ...emptyDoc });
    setView('edit');
  };

  const handleEdit = (doc: Document) => {
    setCurrentDoc({ ...doc });
    setView('edit');
  };

  const handlePreview = (doc: Document) => {
    setCurrentDoc({ ...doc });
    setView('preview');
  };

  const handleSave = async () => {
    if (!currentDoc) return;
    // Check if ID exists to update or create
    const exists = currentDoc.id && documents.find(d => d.id === currentDoc.id);
    const { id, ...payload } = currentDoc;
    if (exists) {
      await patchDoc<Document>('documents', id, payload);
    } else {
      await createDoc<Document>('documents', payload as Document);
    }
    setView('list');
    setCurrentDoc(null);
  };

  const handleDelete = async (id: string) => {
    await removeDoc('documents', id);
  };

  const addItem = () => {
    if (!currentDoc) return;
    setCurrentDoc({
      ...currentDoc,
      items: [...currentDoc.items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (id: string) => {
    if (!currentDoc) return;
    setCurrentDoc({
      ...currentDoc,
      items: currentDoc.items.filter(i => i.id !== id)
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    if (!currentDoc) return;
    setCurrentDoc({
      ...currentDoc,
      items: currentDoc.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    });
  };

  const calculateTotal = (doc: Document) => {
    const subtotal = doc.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const tax = subtotal * 0.14975; // Approx QC Tax
    return { subtotal, tax, total: subtotal + tax };
  };

  // --- PREVIEW SIGNATURE LOGIC ---
  const handleSign = async () => {
    if (!currentDoc || !currentDoc.id) return;
    const signatureDate = new Date().toISOString().split('T')[0];
    const partial: Partial<Document> = { signed: true, signatureDate, status: 'Accepted' as DocumentStatus };
    await patchDoc<Document>('documents', currentDoc.id, partial);
    setCurrentDoc({ ...currentDoc, ...partial });
  };

  // --- RENDERERS ---

  if (view === 'list') {
    return (
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
            <p className="text-slate-400">{t.subtitle}</p>
          </div>
          <button onClick={handleNew} className={ACTION_BUTTON_CLASSES}>
            <Plus className="w-4 h-4" /> {t.newDoc}
          </button>
        </div>

        {loading && (
          <p className="text-slate-400 text-sm">Loading...</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {documents.map(doc => (
            <GlassCard key={doc.id} className="p-6 flex items-center justify-between group">
               <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${doc.type === 'Quote' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                       <h3 className="font-bold text-white text-lg">{doc.number}</h3>
                       <span className={`text-xs px-2 py-0.5 rounded-full border ${
                         doc.status === 'Paid' || doc.status === 'Accepted' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 
                         doc.status === 'Sent' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 
                         'border-slate-500/30 bg-slate-500/10 text-slate-400'
                       }`}>{doc.status}</span>
                    </div>
                    <p className="text-slate-400">{doc.clientName} • {doc.date}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <p className="font-bold text-white text-right hidden md:block">
                    {calculateTotal(doc).total.toFixed(2)} $
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(doc)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handlePreview(doc)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"><Eye className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(doc.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
               </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'edit' && currentDoc) {
     const totals = calculateTotal(currentDoc);
     
     return (
       <div className="pt-24 px-6 pb-12 max-w-5xl mx-auto space-y-6">
         <div className="flex items-center justify-between">
           <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
             <ArrowLeft className="w-4 h-4" /> {t.back}
           </button>
           <h2 className="text-xl font-bold text-white">{t.editor}</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Settings */}
            <GlassCard className="p-6 space-y-6 h-fit">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.type}</label>
                 <div className="flex bg-slate-900 rounded-lg p-1 border border-white/10">
                    <button 
                      onClick={() => setCurrentDoc({...currentDoc, type: 'Quote', number: currentDoc.number.replace('FAC', 'DEV')})}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${currentDoc.type === 'Quote' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >{t.quote}</button>
                    <button 
                      onClick={() => setCurrentDoc({...currentDoc, type: 'Invoice', number: currentDoc.number.replace('DEV', 'FAC')})}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${currentDoc.type === 'Invoice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >{t.invoice}</button>
                 </div>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.client}</label>
                 <select 
                   className={GLASS_INPUT_CLASSES}
                   value={currentDoc.clientId}
                   onChange={(e) => {
                     const client = MOCK_CLIENTS.find(c => c.id === e.target.value);
                     if(client) setCurrentDoc({...currentDoc, clientId: client.id, clientName: client.name, clientEmail: client.email});
                   }}
                 >
                   <option value="">{t.selectClient}</option>
                   {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.date}</label>
                    <input type="date" className={GLASS_INPUT_CLASSES} value={currentDoc.date} onChange={e => setCurrentDoc({...currentDoc, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.dueDate}</label>
                    <input type="date" className={GLASS_INPUT_CLASSES} value={currentDoc.dueDate || ''} onChange={e => setCurrentDoc({...currentDoc, dueDate: e.target.value})} />
                  </div>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.paymentLink} (Square)</label>
                 <div className="relative">
                   <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                      type="text" 
                      className={`${GLASS_INPUT_CLASSES} pl-10`} 
                      placeholder="https://square.link/..."
                      value={currentDoc.paymentLink || ''}
                      onChange={e => setCurrentDoc({...currentDoc, paymentLink: e.target.value})} 
                   />
                 </div>
               </div>

               <button onClick={handleSave} className={`${ACTION_BUTTON_CLASSES} w-full justify-center`}>
                 <Check className="w-4 h-4" /> {t.save}
               </button>
            </GlassCard>

            {/* Right Col: Content */}
            <div className="lg:col-span-2 space-y-6">
               <GlassCard className="p-8 min-h-[600px] flex flex-col">
                  <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/10">
                     <div>
                       <h2 className="text-3xl font-serif font-bold text-white mb-1">{currentDoc.type === 'Quote' ? t.quote : t.invoice}</h2>
                       <p className="text-slate-400">#{currentDoc.number}</p>
                     </div>
                     <div className="text-right">
                       <h3 className="font-bold text-white">Xena Horizon</h3>
                       <p className="text-sm text-slate-400">Consultante Stratégique</p>
                     </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-4 mb-8 flex-1">
                     <div className="grid grid-cols-12 gap-4 px-2 text-xs font-bold text-slate-500 uppercase">
                       <div className="col-span-6">{t.description}</div>
                       <div className="col-span-2 text-center">{t.qty}</div>
                       <div className="col-span-3 text-right">{t.price}</div>
                       <div className="col-span-1"></div>
                     </div>
                     {currentDoc.items.map((item) => (
                       <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-2 rounded-lg group">
                          <div className="col-span-6">
                            <input 
                              type="text" 
                              className="bg-transparent text-white w-full focus:outline-none placeholder-slate-600" 
                              placeholder="Description..."
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                             <input 
                              type="number" 
                              className="bg-transparent text-white w-full text-center focus:outline-none" 
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="col-span-3">
                             <input 
                              type="number" 
                              className="bg-transparent text-white w-full text-right focus:outline-none" 
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="col-span-1 text-right">
                             <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                          </div>
                       </div>
                     ))}
                     <button onClick={addItem} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                       <Plus className="w-4 h-4" /> {t.addLine}
                     </button>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                     <div className="w-64 space-y-2">
                        <div className="flex justify-between text-slate-400">
                           <span>{t.subtotal}</span>
                           <span>{totals.subtotal.toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                           <span>{t.tax} (14.975%)</span>
                           <span>{totals.tax.toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                           <span>{t.total}</span>
                           <span>{totals.total.toFixed(2)} $</span>
                        </div>
                     </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-8 border-t border-white/10">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.terms}</label>
                     <textarea 
                        className="w-full bg-transparent text-slate-400 text-sm h-24 resize-none focus:outline-none"
                        value={currentDoc.terms}
                        onChange={(e) => setCurrentDoc({...currentDoc, terms: e.target.value})}
                     />
                  </div>

               </GlassCard>
            </div>
         </div>
       </div>
     );
  }

  // --- PREVIEW MODE ---
  if (view === 'preview' && currentDoc) {
     const totals = calculateTotal(currentDoc);
     
     return (
       <div className="min-h-screen bg-slate-950 flex flex-col items-center pt-10 pb-20 px-4">
         
         <div className="w-full max-w-4xl flex justify-between items-center mb-6">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
               <ArrowLeft className="w-4 h-4" /> {t.back}
            </button>
            <div className="flex gap-4">
               <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                  <Download className="w-4 h-4" /> PDF
               </button>
            </div>
         </div>

         {/* DOCUMENT PREVIEW (Paper Style) */}
         <div className="w-full max-w-4xl bg-white text-slate-900 rounded-sm shadow-2xl p-12 md:p-16 relative">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">{currentDoc.type === 'Quote' ? t.quote : t.invoice}</h1>
                  <p className="text-slate-500 font-medium text-lg">#{currentDoc.number}</p>
                  <div className="mt-6 text-sm text-slate-600">
                     <p><strong>{t.date}:</strong> {currentDoc.date}</p>
                     {currentDoc.dueDate && <p><strong>{t.dueDate}:</strong> {currentDoc.dueDate}</p>}
                  </div>
               </div>
               <div className="text-right">
                  <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-xl mb-4 ml-auto">XH</div>
                  <h2 className="font-bold text-xl">Xena Horizon</h2>
                  <p className="text-slate-500">Consultante Stratégique</p>
                  <p className="text-slate-500">hello@xenahorizon.com</p>
               </div>
            </div>

            {/* Client Info */}
            <div className="mb-12 bg-slate-50 p-6 rounded-lg border border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.billedTo}</h3>
               <p className="font-bold text-lg text-slate-900">{currentDoc.clientName}</p>
               <p className="text-slate-600">{currentDoc.clientEmail}</p>
            </div>

            {/* Table */}
            <table className="w-full mb-12">
               <thead>
                  <tr className="border-b-2 border-slate-900">
                     <th className="text-left py-4 font-bold text-slate-900">{t.description}</th>
                     <th className="text-center py-4 font-bold text-slate-900 w-24">{t.qty}</th>
                     <th className="text-right py-4 font-bold text-slate-900 w-32">{t.price}</th>
                     <th className="text-right py-4 font-bold text-slate-900 w-32">{t.total}</th>
                  </tr>
               </thead>
               <tbody className="text-slate-600">
                  {currentDoc.items.map(item => (
                     <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-4">{item.description}</td>
                        <td className="py-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-right">{item.price.toFixed(2)} $</td>
                        <td className="py-4 text-right font-medium">{(item.quantity * item.price).toFixed(2)} $</td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end mb-16">
               <div className="w-72 space-y-3">
                  <div className="flex justify-between text-slate-600">
                     <span>{t.subtotal}</span>
                     <span>{totals.subtotal.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                     <span>{t.tax} (14.975%)</span>
                     <span>{totals.tax.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-slate-900 pt-4 border-t-2 border-slate-900">
                     <span>{t.total}</span>
                     <span>{totals.total.toFixed(2)} $</span>
                  </div>
               </div>
            </div>

            {/* Terms */}
            <div className="mb-12">
               <h4 className="font-bold text-slate-900 mb-2">{t.termsTitle}</h4>
               <p className="text-slate-600 text-sm whitespace-pre-line">{currentDoc.terms}</p>
            </div>

            {/* ACTION AREA (Quote Signature or Invoice Payment) */}
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
               
               {/* SIGNATURE SPOT FOR QUOTES */}
               {currentDoc.type === 'Quote' && (
                  <div className="mb-8">
                     <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <PenTool className="w-5 h-5"/> {t.signature}
                     </h4>
                     {currentDoc.signed ? (
                        <div className="border-2 border-emerald-500/20 bg-emerald-50 rounded-lg p-6 flex items-center gap-4 text-emerald-700">
                           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="font-bold">{t.signed}</p>
                              <p className="text-sm opacity-80">Le {currentDoc.signatureDate}</p>
                           </div>
                        </div>
                     ) : (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group" onClick={handleSign}>
                           <p className="text-slate-400 font-serif italic text-2xl mb-2 group-hover:text-blue-500">{t.clickSign}</p>
                           <p className="text-xs text-slate-400 uppercase tracking-widest">Zone de signature numérique</p>
                        </div>
                     )}
                  </div>
               )}

               {/* PAYMENT BUTTON (Square) */}
               <div className="flex justify-end">
                  {currentDoc.paymentLink ? (
                     <a 
                        href={currentDoc.paymentLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`
                           flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-bold text-white transition-all shadow-xl
                           ${(!currentDoc.signed && currentDoc.type === 'Quote') 
                              ? 'bg-slate-300 cursor-not-allowed' 
                              : 'bg-slate-900 hover:bg-blue-600 transform hover:-translate-y-1'
                           }
                        `}
                        onClick={(e) => {
                           if (!currentDoc.signed && currentDoc.type === 'Quote') {
                              e.preventDefault();
                              alert('Veuillez signer le devis avant de procéder au paiement.');
                           }
                        }}
                     >
                        <CreditCard className="w-6 h-6" />
                        {currentDoc.type === 'Quote' ? t.payDeposit : t.payInvoice}
                     </a>
                  ) : (
                     <p className="text-slate-400 italic text-sm">{t.noLink}</p>
                  )}
               </div>

            </div>

         </div>
       </div>
     );
  }

  return null;
};

export default AdminInvoices;