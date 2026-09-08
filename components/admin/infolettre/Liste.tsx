// La liste des infolettres : brouillons et lettres envoyées, la plus récente en premier.
import React from 'react';
import { orderBy } from 'firebase/firestore';
import { Plus, Trash2, Pen, Eye } from 'lucide-react';
import type { Language } from '../../../types';
import { useCollection, removeDoc } from '../../../lib/firestore';
import type { NewsletterDoc } from '../../../lib/infolettre/renderer';
import { Bouton, Etiquette, Vide, Chargement } from '../ui';
import { useTextes } from '../../../lib/textes';

const TEXTES = {
  FR: {
    titre: 'Lettres',
    nouvelle: 'Nouvelle infolettre',
    vide: 'Aucune infolettre pour l’instant. Créez-en une pour commencer.',
    chargement: 'Chargement…',
    sujet: 'Sujet',
    statut: 'Statut',
    langue: 'Langue',
    envois: 'Envois',
    maj: 'Mise à jour',
    brouillon: 'Brouillon',
    envoyee: 'Envoyée',
    modifier: 'Modifier',
    voir: 'Voir',
    supprimer: 'Supprimer',
    confirmSupprimer: 'Supprimer cette infolettre ?',
    interditSupprimer: 'Une infolettre déjà envoyée ne peut pas être supprimée.',
  },
  EN: {
    titre: 'Letters',
    nouvelle: 'New newsletter',
    vide: 'No newsletter yet. Create one to start.',
    chargement: 'Loading…',
    sujet: 'Subject',
    statut: 'Status',
    langue: 'Language',
    envois: 'Sent',
    maj: 'Updated',
    brouillon: 'Draft',
    envoyee: 'Sent',
    modifier: 'Edit',
    voir: 'View',
    supprimer: 'Delete',
    confirmSupprimer: 'Delete this newsletter?',
    interditSupprimer: 'A newsletter already sent cannot be deleted.',
  },
};

const Liste: React.FC<{ onOpen: (id: string | null) => void; lang: Language }> = ({ onOpen, lang }) => {
  const t = useTextes('adminInfolettre_liste', TEXTES, lang);
  const { data: items, loading } = useCollection<NewsletterDoc>('newsletters', [orderBy('createdAt', 'desc')]);

  const del = async (n: NewsletterDoc) => {
    if (n.statut === 'envoyee') { window.alert(t.interditSupprimer); return; }
    if (!window.confirm(t.confirmSupprimer)) return;
    await removeDoc('newsletters', n.id);
  };

  return (
    <div data-tx-scope="adminInfolettre_liste" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gris">{loading ? t.chargement : `${items.length}`}</p>
        <Bouton icone={Plus} onClick={() => onOpen(null)}>{t.nouvelle}</Bouton>
      </div>

      {loading ? (
        <Chargement texte={t.chargement} />
      ) : items.length === 0 ? (
        <Vide titre={t.vide} action={<Bouton icone={Plus} onClick={() => onOpen(null)}>{t.nouvelle}</Bouton>} />
      ) : (
        <div className="border border-filet rounded-champ overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left kicker text-gris border-b border-filet">
                <th className="py-3 px-4">{t.sujet}</th>
                <th className="py-3 px-4 hidden sm:table-cell">{t.statut}</th>
                <th className="py-3 px-4 hidden md:table-cell">{t.langue}</th>
                <th className="py-3 px-4 hidden lg:table-cell">{t.envois}</th>
                <th className="py-3 px-4 hidden md:table-cell">{t.maj}</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-filet">
              {items.map((n) => (
                <tr key={n.id} className="hover:bg-papier-2 transition-colors">
                  <td className="py-3 px-4 text-encre font-serif truncate max-w-[24ch]">{n.sujet || '·'}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <Etiquette tone={n.statut === 'envoyee' ? 'accent' : 'neutre'}>{n.statut === 'envoyee' ? t.envoyee : t.brouillon}</Etiquette>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-gris text-xs uppercase">{n.lang}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-gris text-xs">{n.updatedAt?.toDate?.().toLocaleDateString('fr-CA') || '·'}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Bouton variante="discret" petit icone={n.statut === 'envoyee' ? Eye : Pen} onClick={() => onOpen(n.id)}>
                      {n.statut === 'envoyee' ? t.voir : t.modifier}
                    </Bouton>
                    {n.statut !== 'envoyee' && (
                      <button type="button" onClick={() => del(n)} aria-label={t.supprimer} className="ml-1 p-2 rounded-champ text-gris hover:text-rose transition-colors">
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Liste;
