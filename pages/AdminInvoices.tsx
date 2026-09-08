import React, { useState } from 'react';
import { Plus, FileText, Check, Download, Trash2, ArrowLeft, PenTool, CreditCard, Eye, Edit2 } from 'lucide-react';
import { EnTete, Panneau, Bouton, Champ, Zone, Selection, Etiquette, Vide, Chargement } from '../components/admin/ui';
import { Client, Document, DocumentType, DocumentStatus, InvoiceItem, Language } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';

interface AdminInvoicesProps {
  lang: Language;
}

const DEFAULT_TERMS = "1. Paiement: Un acompte de 50% est requis à la signature. La balance est due à la livraison finale.\n2. Validité: Ce devis est valide pour une période de 30 jours.\n3. Retard: Tout retard de paiement de plus de 30 jours entraînera des frais d'intérêt de 2% par mois.\n4. Propriété: Les livrables restent la propriété de Xena Horizon jusqu'au paiement complet.";

const RANGEE_INPUT =
  'w-full bg-papier border border-filet rounded-champ px-3 py-2 text-sm text-encre placeholder-gris outline-none transition-colors focus:border-rose';

const AdminInvoices: React.FC<AdminInvoicesProps> = ({ lang }) => {
  const { data: documents, loading } = useCollection<Document>('documents');
  const { data: clients } = useCollection<Client>('clients');
  const [view, setView] = useState<'list' | 'edit' | 'preview'>('list');
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);

  const t = {
    FR: {
      title: 'Facturation',
      subtitle: 'Gérez vos devis, factures et paiements.',
      newDoc: 'Nouveau document',
      quote: 'Devis',
      invoice: 'Facture',
      editor: 'Éditeur',
      type: 'Type de document',
      client: 'Client',
      selectClient: 'Sélectionner un client...',
      date: 'Date',
      dueDate: 'Échéance',
      paymentLink: 'Lien de paiement',
      save: 'Enregistrer',
      description: 'Description',
      qty: 'Qté',
      price: 'Prix',
      addLine: 'Ajouter une ligne',
      subtotal: 'Sous-total',
      tax: 'Taxes',
      total: 'Total',
      terms: 'Conditions',
      back: 'Retour au tableau de bord',
      billedTo: 'Facturé à',
      termsTitle: 'Termes et conditions',
      signature: 'Signature',
      signed: 'Devis accepté et signé',
      clickSign: 'Cliquer ici pour signer',
      payDeposit: 'Payer le dépôt',
      payInvoice: 'Payer la facture',
      noLink: 'Aucun lien de paiement configuré.',
      status: 'Statut',
      edit: 'Modifier',
      preview: 'Prévisualiser',
      delete: 'Supprimer',
      videTitre: 'Aucun document',
      videTexte: 'Les devis et factures que vous créez apparaissent ici.',
      loading: 'Chargement...',
    },
    EN: {
      title: 'Invoicing',
      subtitle: 'Manage quotes, invoices and payments.',
      newDoc: 'New document',
      quote: 'Quote',
      invoice: 'Invoice',
      editor: 'Editor',
      type: 'Document type',
      client: 'Client',
      selectClient: 'Select a client...',
      date: 'Date',
      dueDate: 'Due date',
      paymentLink: 'Payment link',
      save: 'Save',
      description: 'Description',
      qty: 'Qty',
      price: 'Price',
      addLine: 'Add line',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      terms: 'Terms',
      back: 'Back to dashboard',
      billedTo: 'Billed to',
      termsTitle: 'Terms & conditions',
      signature: 'Signature',
      signed: 'Quote accepted and signed',
      clickSign: 'Click here to sign',
      payDeposit: 'Pay deposit',
      payInvoice: 'Pay invoice',
      noLink: 'No payment link configured.',
      status: 'Status',
      edit: 'Edit',
      preview: 'Preview',
      delete: 'Delete',
      videTitre: 'No documents',
      videTexte: 'Quotes and invoices you create appear here.',
      loading: 'Loading...',
    },
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

  const statusTone = (status: DocumentStatus): 'neutre' | 'accent' | 'encre' => {
    if (status === 'Paid' || status === 'Accepted') return 'accent';
    if (status === 'Sent') return 'encre';
    return 'neutre';
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
      <div className="px-6 md:px-10 py-10 space-y-8">
        <EnTete
          kicker="Facturation"
          titre={t.title}
          lede={t.subtitle}
          actions={
            <Bouton variante="primaire" icone={Plus} onClick={handleNew}>
              {t.newDoc}
            </Bouton>
          }
        />

        {loading && <Chargement texte={t.loading} />}

        {!loading && documents.length === 0 && (
          <Panneau>
            <Vide titre={t.videTitre} texte={t.videTexte} />
          </Panneau>
        )}

        {!loading && documents.length > 0 && (
          <Panneau>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-filet">
                    <th className="kicker text-gris text-left py-3 pr-4">{t.title}</th>
                    <th className="kicker text-gris text-left py-3 pr-4">{t.client}</th>
                    <th className="kicker text-gris text-left py-3 pr-4">{t.date}</th>
                    <th className="kicker text-gris text-left py-3 pr-4">{t.status}</th>
                    <th className="kicker text-gris text-right py-3 pr-4">{t.total}</th>
                    <th className="py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-filet">
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="py-3 pr-4 text-sm text-encre">
                        <div className="flex items-center gap-3">
                          <FileText className={`w-4 h-4 flex-shrink-0 ${doc.type === 'Quote' ? 'text-rose' : 'text-encre'}`} aria-hidden="true" />
                          <span className="font-medium">{doc.number}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-encre">{doc.clientName}</td>
                      <td className="py-3 pr-4 text-sm text-gris">{doc.date}</td>
                      <td className="py-3 pr-4 text-sm">
                        <Etiquette tone={statusTone(doc.status)}>{doc.status}</Etiquette>
                      </td>
                      <td className="py-3 pr-4 text-sm text-encre text-right tabular-nums">
                        {calculateTotal(doc).total.toFixed(2)} $
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(doc)} aria-label={t.edit} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre transition-colors">
                            <Edit2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button onClick={() => handlePreview(doc)} aria-label={t.preview} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre transition-colors">
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button onClick={() => handleDelete(doc.id)} aria-label={t.delete} className="w-11 h-11 flex items-center justify-center text-gris hover:text-rose transition-colors">
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panneau>
        )}
      </div>
    );
  }

  if (view === 'edit' && currentDoc) {
     const totals = calculateTotal(currentDoc);

     return (
       <div className="px-6 md:px-10 py-10 space-y-6">
         <div className="flex items-center justify-between">
           <button onClick={() => setView('list')} className="flex items-center gap-2 text-gris hover:text-encre transition-colors">
             <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t.back}
           </button>
           <h2 className="font-serif text-h3 text-encre">{t.editor}</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Col: Settings */}
            <Panneau className="space-y-5 h-fit">
               <div>
                 <label className="text-petit font-semibold text-encre mb-1.5 block">{t.type}</label>
                 <div className="flex bg-papier rounded-champ p-1 border border-filet">
                    <button
                      onClick={() => setCurrentDoc({...currentDoc, type: 'Quote', number: currentDoc.number.replace('FAC', 'DEV')})}
                      className={`flex-1 py-2 text-sm font-medium rounded-champ transition-colors ${currentDoc.type === 'Quote' ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}
                    >{t.quote}</button>
                    <button
                      onClick={() => setCurrentDoc({...currentDoc, type: 'Invoice', number: currentDoc.number.replace('DEV', 'FAC')})}
                      className={`flex-1 py-2 text-sm font-medium rounded-champ transition-colors ${currentDoc.type === 'Invoice' ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}
                    >{t.invoice}</button>
                 </div>
               </div>

               <Selection
                 label={t.client}
                 value={currentDoc.clientId}
                 onChange={(e) => {
                   const client = clients.find(c => c.id === e.target.value);
                   if (client) setCurrentDoc({...currentDoc, clientId: client.id, clientName: client.name, clientEmail: client.email});
                 }}
               >
                 <option value="">{t.selectClient}</option>
                 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </Selection>

               <div className="grid grid-cols-2 gap-4">
                  <Champ label={t.date} type="date" value={currentDoc.date} onChange={e => setCurrentDoc({...currentDoc, date: e.target.value})} />
                  <Champ label={t.dueDate} type="date" value={currentDoc.dueDate || ''} onChange={e => setCurrentDoc({...currentDoc, dueDate: e.target.value})} />
               </div>

               <div>
                 <label className="text-petit font-semibold text-encre mb-1.5 block">{t.paymentLink} (Square)</label>
                 <div className="relative">
                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" aria-hidden="true" />
                   <input
                      type="text"
                      className="w-full bg-papier border border-filet rounded-champ pl-10 pr-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose"
                      placeholder="https://square.link/..."
                      value={currentDoc.paymentLink || ''}
                      onChange={e => setCurrentDoc({...currentDoc, paymentLink: e.target.value})}
                   />
                 </div>
               </div>

               <Bouton variante="primaire" icone={Check} onClick={handleSave} className="w-full justify-center">
                 {t.save}
               </Bouton>
            </Panneau>

            {/* Right Col: Content */}
            <div className="lg:col-span-2">
               <Panneau className="p-8 min-h-[600px] flex flex-col">
                  <div className="flex justify-between items-start mb-8 pb-8 border-b border-filet">
                     <div>
                       <h2 className="font-serif text-h3 text-encre mb-1">{currentDoc.type === 'Quote' ? t.quote : t.invoice}</h2>
                       <p className="text-gris">#{currentDoc.number}</p>
                     </div>
                     <div className="text-right">
                       <h3 className="font-sans font-semibold text-encre">Xena Horizon</h3>
                       <p className="text-sm text-gris">Consultante stratégique</p>
                     </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-8 flex-1">
                     <div className="grid grid-cols-12 gap-4 px-2 kicker text-gris">
                       <div className="col-span-6">{t.description}</div>
                       <div className="col-span-2 text-center">{t.qty}</div>
                       <div className="col-span-3 text-right">{t.price}</div>
                       <div className="col-span-1"></div>
                     </div>
                     {currentDoc.items.map((item) => (
                       <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-papier border border-filet p-2 rounded-champ group">
                          <div className="col-span-6">
                            <input
                              type="text"
                              className={RANGEE_INPUT}
                              placeholder={t.description}
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                             <input
                              type="number"
                              className={`${RANGEE_INPUT} text-center`}
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="col-span-3">
                             <input
                              type="number"
                              className={`${RANGEE_INPUT} text-right`}
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="col-span-1 text-right">
                             <button onClick={() => removeItem(item.id)} aria-label={t.delete} className="w-9 h-9 flex items-center justify-center text-gris hover:text-rose transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 className="w-4 h-4" aria-hidden="true" />
                             </button>
                          </div>
                       </div>
                     ))}
                     <Bouton variante="discret" icone={Plus} onClick={addItem}>
                       {t.addLine}
                     </Bouton>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                     <div className="w-64 space-y-2">
                        <div className="flex justify-between text-gris text-sm">
                           <span>{t.subtotal}</span>
                           <span>{totals.subtotal.toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between text-gris text-sm">
                           <span>{t.tax} (14.975%)</span>
                           <span>{totals.tax.toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between font-serif text-h3 text-encre pt-2 border-t border-filet">
                           <span>{t.total}</span>
                           <span className="tabular-nums">{totals.total.toFixed(2)} $</span>
                        </div>
                     </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-8 border-t border-filet">
                     <Zone
                        label={t.terms}
                        value={currentDoc.terms}
                        onChange={(e) => setCurrentDoc({...currentDoc, terms: e.target.value})}
                        className="min-h-[6rem]"
                     />
                  </div>

               </Panneau>
            </div>
         </div>
       </div>
     );
  }

  // --- PREVIEW MODE ---
  if (view === 'preview' && currentDoc) {
     const totals = calculateTotal(currentDoc);

     return (
       <div className="min-h-screen bg-papier flex flex-col items-center pt-10 pb-20 px-4">

         <div className="w-full max-w-4xl flex justify-between items-center mb-6">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-gris hover:text-encre transition-colors">
               <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t.back}
            </button>
            <Bouton variante="secondaire" icone={Download} petit>
               PDF
            </Bouton>
         </div>

         {/* DOCUMENT PREVIEW (Paper Style) */}
         <div className="w-full max-w-4xl bg-papier-2 border border-filet rounded-champ shadow-panneau p-12 md:p-16 relative">

            {/* Header */}
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h1 className="font-serif text-h2 text-encre mb-2">{currentDoc.type === 'Quote' ? t.quote : t.invoice}</h1>
                  <p className="text-gris font-medium text-lg">#{currentDoc.number}</p>
                  <div className="mt-6 text-sm text-gris space-y-1">
                     <p><span className="text-encre font-medium">{t.date} :</span> {currentDoc.date}</p>
                     {currentDoc.dueDate && <p><span className="text-encre font-medium">{t.dueDate} :</span> {currentDoc.dueDate}</p>}
                  </div>
               </div>
               <div className="text-right">
                  <div className="w-16 h-16 rounded-champ bg-encre text-papier flex items-center justify-center font-serif font-medium text-xl mb-4 ml-auto">XH</div>
                  <h2 className="font-sans font-semibold text-encre text-lg">Xena Horizon</h2>
                  <p className="text-gris text-sm">Consultante stratégique</p>
                  <p className="text-gris text-sm">laurie.belhumeur@gmail.com</p>
               </div>
            </div>

            {/* Client Info */}
            <div className="mb-12 bg-papier p-6 rounded-champ border border-filet">
               <h3 className="kicker text-gris mb-2">{t.billedTo}</h3>
               <p className="font-sans font-semibold text-lg text-encre">{currentDoc.clientName}</p>
               <p className="text-gris">{currentDoc.clientEmail}</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-12">
              <table className="w-full">
                 <thead>
                    <tr className="border-b-2 border-encre">
                       <th className="text-left py-4 kicker text-gris">{t.description}</th>
                       <th className="text-center py-4 kicker text-gris w-24">{t.qty}</th>
                       <th className="text-right py-4 kicker text-gris w-32">{t.price}</th>
                       <th className="text-right py-4 kicker text-gris w-32">{t.total}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-filet">
                    {currentDoc.items.map(item => (
                       <tr key={item.id}>
                          <td className="py-4 text-sm text-encre">{item.description}</td>
                          <td className="py-4 text-sm text-encre text-center">{item.quantity}</td>
                          <td className="py-4 text-sm text-gris text-right">{item.price.toFixed(2)} $</td>
                          <td className="py-4 text-sm text-encre text-right font-medium tabular-nums">{(item.quantity * item.price).toFixed(2)} $</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-16">
               <div className="w-72 space-y-3">
                  <div className="flex justify-between text-gris text-sm">
                     <span>{t.subtotal}</span>
                     <span>{totals.subtotal.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between text-gris text-sm">
                     <span>{t.tax} (14.975%)</span>
                     <span>{totals.tax.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between font-serif text-h3 text-encre pt-4 border-t-2 border-encre">
                     <span>{t.total}</span>
                     <span className="tabular-nums">{totals.total.toFixed(2)} $</span>
                  </div>
               </div>
            </div>

            {/* Terms */}
            <div className="mb-12">
               <h4 className="font-sans font-semibold text-encre mb-2">{t.termsTitle}</h4>
               <p className="text-gris text-sm whitespace-pre-line">{currentDoc.terms}</p>
            </div>

            {/* ACTION AREA (Quote Signature or Invoice Payment) */}
            <div className="bg-papier rounded-champ p-8 border border-filet">

               {/* SIGNATURE SPOT FOR QUOTES */}
               {currentDoc.type === 'Quote' && (
                  <div className="mb-8">
                     <h4 className="font-sans font-semibold text-encre mb-4 flex items-center gap-2">
                        <PenTool className="w-5 h-5" aria-hidden="true" /> {t.signature}
                     </h4>
                     {currentDoc.signed ? (
                        <div className="border border-rose/30 bg-rose/10 rounded-champ p-6 flex items-center gap-4 text-rose">
                           <div className="w-10 h-10 rounded-pilule bg-rose/10 flex items-center justify-center">
                              <Check className="w-6 h-6" aria-hidden="true" />
                           </div>
                           <div>
                              <p className="font-medium">{t.signed}</p>
                              <p className="text-sm text-gris">Le {currentDoc.signatureDate}</p>
                           </div>
                        </div>
                     ) : (
                        <div className="border border-dashed border-filet rounded-champ p-8 text-center bg-papier-2 cursor-pointer hover:border-rose transition-colors group" onClick={handleSign}>
                           <p className="font-serif text-h3 text-gris mb-2 group-hover:text-rose transition-colors">{t.clickSign}</p>
                           <p className="kicker text-gris">Zone de signature numérique</p>
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
                        className={`inline-flex items-center gap-3 min-h-[44px] px-8 rounded-pilule text-base font-medium transition-colors ${
                           (!currentDoc.signed && currentDoc.type === 'Quote')
                              ? 'bg-papier-2 border border-filet text-gris cursor-not-allowed'
                              : 'bg-bouton text-sur-bouton hover:bg-bouton-2'
                        }`}
                        onClick={(e) => {
                           if (!currentDoc.signed && currentDoc.type === 'Quote') {
                              e.preventDefault();
                              alert('Veuillez signer le devis avant de procéder au paiement.');
                           }
                        }}
                     >
                        <CreditCard className="w-5 h-5" aria-hidden="true" />
                        {currentDoc.type === 'Quote' ? t.payDeposit : t.payInvoice}
                     </a>
                  ) : (
                     <p className="text-gris text-sm">{t.noLink}</p>
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
