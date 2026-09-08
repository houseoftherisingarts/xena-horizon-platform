import React, { useState } from 'react';
import { Plus, FileText, Check, Trash2, ArrowLeft, PenTool, Eye, Edit2, Send, Copy, Printer, Settings } from 'lucide-react';
import { EnTete, Panneau, Bouton, Champ, Zone, Selection, Etiquette, Vide, Chargement } from '../components/admin/ui';
import DocumentFacture from '../components/admin/factures/DocumentFacture';
import ReglagesFacturation from '../components/admin/factures/ReglagesFacturation';
import { Client, Document, DocumentStatus, InvoiceItem, Language } from '../types';
import { useCollection, useDocument, createDoc, patchDoc, removeDoc } from '../lib/firestore';
import {
  DEFAULT_TERMS, FACTURATION_PAR_DEFAUT, ParametresFacturation,
  calculerTotaux, publierFacture, synchroniserStatutPublic, lienFacturePublique,
} from '../lib/factures';

interface AdminInvoicesProps {
  lang: Language;
}

const RANGEE_INPUT =
  'w-full bg-papier border border-filet rounded-champ px-3 py-2 text-sm text-encre placeholder-gris outline-none transition-colors focus:border-rose';

const AUJOURDHUI = () => new Date().toISOString().split('T')[0];

/** Publiée ou acceptée, et l'échéance est passée : c'est le seul cas où le libellé s'écarte du statut brut. */
function enRetard(doc: Document): boolean {
  return (doc.status === 'Sent' || doc.status === 'Accepted') && !!doc.dueDate && doc.dueDate < AUJOURDHUI();
}

function libelleStatut(doc: Document, lang: Language): string {
  if (enRetard(doc)) return lang === 'FR' ? 'En retard' : 'Overdue';
  const labels: Record<DocumentStatus, { FR: string; EN: string }> = {
    Draft: { FR: 'Brouillon', EN: 'Draft' },
    Sent: { FR: 'Publiée', EN: 'Published' },
    Paid: { FR: 'Payée', EN: 'Paid' },
    Accepted: { FR: 'Acceptée', EN: 'Accepted' },
    Declined: { FR: 'Refusée', EN: 'Declined' },
  };
  return labels[doc.status][lang];
}

function statusTone(doc: Document): 'neutre' | 'accent' | 'encre' {
  if (enRetard(doc) || doc.status === 'Paid' || doc.status === 'Accepted') return 'accent';
  if (doc.status === 'Sent') return 'encre';
  return 'neutre';
}

const AdminInvoices: React.FC<AdminInvoicesProps> = ({ lang }) => {
  const { data: documents, loading } = useCollection<Document>('documents');
  const { data: clients } = useCollection<Client>('clients');
  const { data: facturationDoc } = useDocument<ParametresFacturation>('settings/facturation');
  const parametres: ParametresFacturation = { ...FACTURATION_PAR_DEFAUT, ...(facturationDoc || {}) };

  const [view, setView] = useState<'list' | 'edit' | 'preview'>('list');
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [reglagesOuverts, setReglagesOuverts] = useState(false);
  const [lienCopie, setLienCopie] = useState(false);

  const t = {
    FR: {
      title: 'Facturation',
      subtitle: 'Gérez vos devis, factures et paiements.',
      newDoc: 'Nouveau document',
      reglages: 'Réglages',
      quote: 'Devis',
      invoice: 'Facture',
      editor: 'Éditeur',
      type: 'Type de document',
      client: 'Client',
      selectClient: 'Sélectionner un client...',
      date: 'Date',
      dueDate: 'Échéance',
      save: 'Enregistrer',
      lines: 'Lignes',
      description: 'Description',
      qty: 'Qté',
      price: 'Prix',
      addLine: 'Ajouter une ligne',
      terms: 'Conditions',
      back: 'Retour au tableau de bord',
      apercu: 'Aperçu du document',
      signature: 'Signature',
      signed: 'Devis accepté et signé',
      clickSign: 'Cliquer ici pour signer',
      status: 'Statut',
      edit: 'Modifier',
      preview: 'Prévisualiser',
      delete: 'Supprimer',
      publier: 'Publier',
      republier: 'Mettre le lien à jour',
      copierLien: 'Copier le lien',
      lienCopie: 'Lien copié',
      marquerPayee: 'Marquer payée',
      total: 'Total',
      videTitre: 'Aucun document',
      videTexte: 'Les devis et factures que vous créez apparaissent ici.',
      loading: 'Chargement...',
      publierAvant: 'Enregistrez le document avant de le publier.',
      encadreAvecLien: "La personne facturée paie par le lien de paiement des réglages. Vérifiez que son montant correspond avant d'envoyer.",
      encadreSansLien: 'Aucun moyen de paiement configuré. Ajoutez un lien de paiement dans les réglages, ou laissez les modalités du document porter le mode de paiement.',
    },
    EN: {
      title: 'Invoicing',
      subtitle: 'Manage quotes, invoices and payments.',
      newDoc: 'New document',
      reglages: 'Settings',
      quote: 'Quote',
      invoice: 'Invoice',
      editor: 'Editor',
      type: 'Document type',
      client: 'Client',
      selectClient: 'Select a client...',
      date: 'Date',
      dueDate: 'Due date',
      save: 'Save',
      lines: 'Line items',
      description: 'Description',
      qty: 'Qty',
      price: 'Price',
      addLine: 'Add line',
      terms: 'Terms',
      back: 'Back to dashboard',
      apercu: 'Document preview',
      signature: 'Signature',
      signed: 'Quote accepted and signed',
      clickSign: 'Click here to sign',
      status: 'Status',
      edit: 'Edit',
      preview: 'Preview',
      delete: 'Delete',
      publier: 'Publish',
      republier: 'Update the link',
      copierLien: 'Copy the link',
      lienCopie: 'Link copied',
      marquerPayee: 'Mark as paid',
      total: 'Total',
      videTitre: 'No documents',
      videTexte: 'Quotes and invoices you create appear here.',
      loading: 'Loading...',
      publierAvant: 'Save the document before publishing it.',
      encadreAvecLien: "The billed person pays through the payment link set in settings. Check its amount matches before you send it.",
      encadreSansLien: 'No payment method configured. Add a payment link in settings, or let the terms on the document carry the payment method.',
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
    date: AUJOURDHUI(),
    dueDate: '',
    items: [{ id: Date.now().toString(), description: '', quantity: 1, price: 0 }],
    status: 'Draft',
    terms: parametres.modalites || DEFAULT_TERMS,
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
    setCurrentDoc({ ...currentDoc, items: currentDoc.items.filter(i => i.id !== id) });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    if (!currentDoc) return;
    setCurrentDoc({ ...currentDoc, items: currentDoc.items.map(i => i.id === id ? { ...i, [field]: value } : i) });
  };

  // --- SIGNATURE (devis) ---
  const handleSign = async () => {
    if (!currentDoc || !currentDoc.id) return;
    const signatureDate = AUJOURDHUI();
    const partial: Partial<Document> = { signed: true, signatureDate, status: 'Accepted' as DocumentStatus };
    await patchDoc<Document>('documents', currentDoc.id, partial);
    setCurrentDoc({ ...currentDoc, ...partial });
  };

  // --- PUBLICATION ET PAIEMENT ---
  const handlePublier = async () => {
    if (!currentDoc?.id) return;
    const jeton = await publierFacture(currentDoc, parametres);
    const nextStatus: DocumentStatus = currentDoc.status === 'Draft' ? 'Sent' : currentDoc.status;
    if (nextStatus !== currentDoc.status) await patchDoc<Document>('documents', currentDoc.id, { status: nextStatus });
    setCurrentDoc({ ...currentDoc, jetonPublic: jeton, status: nextStatus });
  };

  const handleCopierLien = async () => {
    if (!currentDoc?.jetonPublic) return;
    const lien = lienFacturePublique(currentDoc.jetonPublic);
    try {
      await navigator.clipboard.writeText(lien);
    } catch {
      // Le lien reste affiché à l'écran : Laurie le copie à la main si le presse-papier est bloqué.
    }
    setLienCopie(true);
    setTimeout(() => setLienCopie(false), 2000);
  };

  const handleMarquerPayee = async () => {
    if (!currentDoc?.id) return;
    await patchDoc<Document>('documents', currentDoc.id, { status: 'Paid' as DocumentStatus });
    await synchroniserStatutPublic(currentDoc.jetonPublic, 'Paid');
    setCurrentDoc({ ...currentDoc, status: 'Paid' });
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
            <div className="flex flex-wrap items-center gap-2">
              <Bouton variante="secondaire" icone={Settings} onClick={() => setReglagesOuverts(v => !v)}>
                {t.reglages}
              </Bouton>
              <Bouton variante="primaire" icone={Plus} onClick={handleNew}>
                {t.newDoc}
              </Bouton>
            </div>
          }
        />

        {reglagesOuverts && <ReglagesFacturation lang={lang} parametres={parametres} onClose={() => setReglagesOuverts(false)} />}

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
                        <Etiquette tone={statusTone(doc)}>{libelleStatut(doc, lang)}</Etiquette>
                      </td>
                      <td className="py-3 pr-4 text-sm text-encre text-right tabular-nums">
                        {calculerTotaux(doc.items, parametres).total.toFixed(2)} $
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
     return (
       <div className="px-6 md:px-10 py-10 space-y-6">
         <div className="flex items-center justify-between">
           <button onClick={() => setView('list')} className="flex items-center gap-2 text-gris hover:text-encre transition-colors">
             <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t.back}
           </button>
           <h2 className="font-serif text-h3 text-encre">{t.editor}</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Colonne gauche : saisie */}
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
                 <label className="text-petit font-semibold text-encre mb-1.5 block">{t.lines}</label>
                 <div className="space-y-2">
                   {currentDoc.items.map((item) => (
                     <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-papier border border-filet p-2 rounded-champ group">
                        <div className="col-span-6">
                          <input type="text" className={RANGEE_INPUT} placeholder={t.description} value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                          <input type="number" className={`${RANGEE_INPUT} text-center`} value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-3">
                          <input type="number" className={`${RANGEE_INPUT} text-right`} value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-1 text-right">
                          <button onClick={() => removeItem(item.id)} aria-label={t.delete} className="w-9 h-9 flex items-center justify-center text-gris hover:text-rose transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                     </div>
                   ))}
                   <Bouton variante="discret" icone={Plus} petit onClick={addItem}>{t.addLine}</Bouton>
                 </div>
               </div>

               <Zone label={t.terms} value={currentDoc.terms} onChange={(e) => setCurrentDoc({...currentDoc, terms: e.target.value})} className="min-h-[6rem]" />

               <Bouton variante="primaire" icone={Check} onClick={handleSave} className="w-full justify-center">
                 {t.save}
               </Bouton>
            </Panneau>

            {/* Colonne droite : aperçu du document réel, mis à jour à mesure de la saisie */}
            <div className="lg:col-span-2">
               <p className="kicker text-gris mb-3">{t.apercu}</p>
               <DocumentFacture
                 lang={lang}
                 numero={currentDoc.number}
                 type={currentDoc.type}
                 date={currentDoc.date}
                 dueDate={currentDoc.dueDate}
                 clientName={currentDoc.clientName || t.selectClient}
                 clientEmail={currentDoc.clientEmail}
                 items={currentDoc.items}
                 modalites={currentDoc.terms}
                 note={parametres.note}
                 vendeur={parametres}
               />
            </div>
         </div>
       </div>
     );
  }

  // --- PRÉVISUALISATION ---
  if (view === 'preview' && currentDoc) {
     const lien = currentDoc.jetonPublic ? lienFacturePublique(currentDoc.jetonPublic) : '';

     return (
       <div className="min-h-screen bg-papier flex flex-col items-center pt-10 pb-20 px-4 print:p-0 print:min-h-0">

         <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-gris hover:text-encre transition-colors">
               <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t.back}
            </button>
            <div className="flex flex-wrap items-center gap-2">
               <Etiquette tone={statusTone(currentDoc)}>{libelleStatut(currentDoc, lang)}</Etiquette>
               <Bouton variante="secondaire" icone={Send} petit onClick={handlePublier} disabled={!currentDoc.id} title={!currentDoc.id ? t.publierAvant : undefined}>
                 {currentDoc.jetonPublic ? t.republier : t.publier}
               </Bouton>
               {currentDoc.jetonPublic && (
                 <Bouton variante="secondaire" icone={Copy} petit onClick={handleCopierLien}>
                   {lienCopie ? t.lienCopie : t.copierLien}
                 </Bouton>
               )}
               <Bouton variante="secondaire" icone={Printer} petit onClick={() => window.print()}>PDF</Bouton>
               {currentDoc.status !== 'Paid' && (
                 <Bouton variante="primaire" icone={Check} petit onClick={handleMarquerPayee}>{t.marquerPayee}</Bouton>
               )}
            </div>
         </div>

         {currentDoc.jetonPublic && (
           <div className="w-full max-w-4xl mb-6 bg-papier-2 border border-filet rounded-champ p-4 text-sm text-gris print:hidden">
             <p>{parametres.lienPaiementStripe ? t.encadreAvecLien : t.encadreSansLien}</p>
             <a href={lien} target="_blank" rel="noreferrer" className="block mt-2 text-rose break-all">{lien}</a>
           </div>
         )}

         <div className="w-full max-w-4xl print:max-w-none">
           <DocumentFacture
             lang={lang}
             numero={currentDoc.number}
             type={currentDoc.type}
             date={currentDoc.date}
             dueDate={currentDoc.dueDate}
             clientName={currentDoc.clientName}
             clientEmail={currentDoc.clientEmail}
             items={currentDoc.items}
             modalites={currentDoc.terms}
             note={parametres.note}
             vendeur={parametres}
           >
             {currentDoc.type === 'Quote' && (
               <div>
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
                   <div className="border border-dashed border-filet rounded-champ p-8 text-center bg-papier cursor-pointer hover:border-rose transition-colors group" onClick={handleSign}>
                     <p className="font-serif text-h3 text-gris mb-2 group-hover:text-rose transition-colors">{t.clickSign}</p>
                   </div>
                 )}
               </div>
             )}
           </DocumentFacture>
         </div>
       </div>
     );
  }

  return null;
};

export default AdminInvoices;
