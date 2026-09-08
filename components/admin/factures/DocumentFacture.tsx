// Le document imprimé : devis ou facture, dans la charte de Laurie (papier, encre, un seul accent,
// Playfair pour le numéro et le total, Figtree pour le reste). Une seule source de vérité pour trois
// écrans : l'aperçu de l'éditeur, la prévisualisation admin et la page publique /facture/{jeton}
// (pages/FacturePublique.tsx). La feuille @page en tête donne un PDF Lettre US propre par « Imprimer »;
// tout ce qui n'a pas sa place sur le papier (signature, bouton de paiement) passe par `children`,
// masqué à l'impression.
import React from 'react';
import type { DocumentType, InvoiceItem, Language } from '../../../types';
import { calculerTotaux, type ParametresFacturation } from '../../../lib/factures';

type Vendeur = Pick<ParametresFacturation, 'nomLegal' | 'adresse' | 'neq' | 'tps' | 'tvq' | 'courriel'>;

interface DocumentFactureProps {
  lang: Language;
  numero: string;
  type: DocumentType;
  date: string;
  dueDate?: string | null;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  modalites: string;
  note: string;
  vendeur: Vendeur;
  className?: string;
  children?: React.ReactNode;
}

const T = {
  FR: {
    quote: 'Devis', invoice: 'Facture', billedTo: 'Facturé à', date: 'Date', dueDate: 'Échéance',
    description: 'Description', qty: 'Qté', price: 'Prix unitaire', lineTotal: 'Montant',
    subtotal: 'Sous-total', tps: 'TPS', tvq: 'TVQ', total: 'Total', terms: 'Modalités',
    site: 'Site créé par Vexel Webstudio',
  },
  EN: {
    quote: 'Quote', invoice: 'Invoice', billedTo: 'Billed to', date: 'Date', dueDate: 'Due date',
    description: 'Description', qty: 'Qty', price: 'Unit price', lineTotal: 'Amount',
    subtotal: 'Subtotal', tps: 'GST', tvq: 'QST', total: 'Total', terms: 'Terms',
    site: 'Site by Vexel Webstudio',
  },
};

const argent = (n: number) => `${n.toFixed(2)} $`;

const DocumentFacture: React.FC<DocumentFactureProps> = ({
  lang, numero, type, date, dueDate, clientName, clientEmail, items, modalites, note, vendeur, className = '', children,
}) => {
  const t = T[lang];
  const totaux = calculerTotaux(items, vendeur);

  return (
    <div className={`bg-papier-2 border border-filet rounded-champ shadow-panneau print:shadow-none print:border-0 print:rounded-none p-8 sm:p-12 md:p-16 print:p-8 ${className}`}>
      <style>{'@page { size: letter; margin: 0.65in; }'}</style>

      {/* En-tête : logo, type de document et numéro */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 print:pb-4 border-b border-filet">
        <img src="/images/logo-laurie.png" alt="Xena Horizon" className="h-12 w-auto object-contain" />
        <div className="sm:text-right">
          <h1 className="font-serif text-h3 text-encre">{type === 'Quote' ? t.quote : t.invoice}</h1>
          <p className="font-serif text-lg text-rose mt-1">#{numero}</p>
        </div>
      </div>

      {/* Vendeur et échéances */}
      <div className="grid sm:grid-cols-2 gap-8 mt-8 print:mt-5">
        <div>
          <p className="kicker text-gris mb-2">{vendeur.nomLegal ? vendeur.nomLegal : 'Xena Horizon'}</p>
          <div className="text-sm text-gris leading-relaxed">
            {vendeur.adresse && <p>{vendeur.adresse}</p>}
            {vendeur.courriel && <p>{vendeur.courriel}</p>}
            {vendeur.neq && <p>NEQ {vendeur.neq}</p>}
            {vendeur.tps && <p>TPS {vendeur.tps}</p>}
            {vendeur.tvq && <p>TVQ {vendeur.tvq}</p>}
          </div>
        </div>
        <div className="sm:text-right text-sm text-gris">
          <p><span className="text-encre font-medium">{t.date} :</span> {date}</p>
          {dueDate && <p className="mt-1"><span className="text-encre font-medium">{t.dueDate} :</span> {dueDate}</p>}
        </div>
      </div>

      {/* Client */}
      <div className="mt-6 print:mt-4 bg-papier p-5 print:p-4 rounded-champ border border-filet">
        <p className="kicker text-gris mb-1">{t.billedTo}</p>
        <p className="font-sans font-semibold text-encre">{clientName}</p>
        {clientEmail && <p className="text-sm text-gris">{clientEmail}</p>}
      </div>

      {/* Lignes : le prix unitaire se cache sous 640 px, la description a besoin de la place */}
      <div className="mt-10 print:mt-6">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b-2 border-encre">
              <th className="text-left py-3 kicker text-gris">{t.description}</th>
              <th className="text-center py-3 kicker text-gris w-14 sm:w-20">{t.qty}</th>
              <th className="hidden sm:table-cell text-right py-3 kicker text-gris w-28">{t.price}</th>
              <th className="text-right py-3 kicker text-gris w-24 sm:w-28">{t.lineTotal}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-filet">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-2 sm:pr-4 text-sm text-encre break-words">{item.description}</td>
                <td className="py-3 text-sm text-encre text-center">{item.quantity}</td>
                <td className="hidden sm:table-cell py-3 text-sm text-gris text-right">{argent(item.price)}</td>
                <td className="py-3 text-sm text-encre text-right font-medium tabular-nums">{argent(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mt-8 print:mt-5">
        <div className="w-full sm:w-72 space-y-2">
          <div className="flex justify-between text-gris text-sm">
            <span>{t.subtotal}</span><span className="tabular-nums">{argent(totaux.sousTotal)}</span>
          </div>
          {totaux.tps > 0 && (
            <div className="flex justify-between text-gris text-sm">
              <span>{t.tps} ({vendeur.tps})</span><span className="tabular-nums">{argent(totaux.tps)}</span>
            </div>
          )}
          {totaux.tvq > 0 && (
            <div className="flex justify-between text-gris text-sm">
              <span>{t.tvq} ({vendeur.tvq})</span><span className="tabular-nums">{argent(totaux.tvq)}</span>
            </div>
          )}
          <div className="flex justify-between font-serif text-h3 text-encre pt-3 border-t-2 border-encre">
            <span>{t.total}</span><span className="tabular-nums">{argent(totaux.total)}</span>
          </div>
        </div>
      </div>

      {/* Modalités et remerciement */}
      {modalites && (
        <div className="mt-10 pt-8 print:mt-5 print:pt-4 border-t border-filet">
          <p className="kicker text-gris mb-2">{t.terms}</p>
          <p className="text-gris text-sm whitespace-pre-line">{modalites}</p>
        </div>
      )}
      {note && <p className="mt-6 print:mt-4 text-sm text-encre">{note}</p>}

      {/* Zone d'action (signature, paiement) : jamais sur le papier */}
      {children && <div className="mt-10 print:hidden">{children}</div>}

      <p className="mt-12 pt-6 print:mt-2 print:pt-2 border-t border-filet text-xs text-gris text-center">
        <a href="https://vexelwebstudio.com" target="_blank" rel="noreferrer" className="hover:text-rose transition-colors">{t.site}</a>
      </p>
    </div>
  );
};

export default DocumentFacture;
