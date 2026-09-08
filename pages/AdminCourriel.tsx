// Courriel et messagerie : les leads du formulaire public (Courriels) et les fils de dossier
// (Messagerie), reliés aux comptes clients et à leur profil. Canon : components/admin/CANON-ADMIN.md.
import React, { useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { Inbox, MessageCircle, Search, Reply, Archive, Trash2, MailOpen, ChevronLeft, FolderOpen } from 'lucide-react';
import { EnTete, Panneau, Bouton, Vide, Chargement } from '../components/admin/ui';
import { Language, Lead, Dossier, ViewState } from '../types';
import { useCollection, patchDoc, removeDoc } from '../lib/firestore';
import { useTextes } from '../lib/textes';
import Messagerie from '../components/admin/courriel/Messagerie';

const TEXTES = {
  FR: {
    titre: 'Courriel et messagerie',
    kicker: 'Communication',
    ongletCourriels: 'Courriels',
    ongletMessagerie: 'Messagerie',
    search: 'Rechercher…',
    select: 'Sélectionne un message pour le lire',
    empty: 'Aucun message pour le moment.',
    emptyTexte: 'Les messages reçus via le site apparaissent ici.',
    loading: 'Chargement…',
    defaultSubject: 'Nouveau message',
    markRead: 'Marquer comme lu',
    archive: 'Archiver',
    delete: 'Supprimer',
    reply: 'Répondre par courriel',
    voirDossier: 'Voir son dossier',
    to: 'À : moi',
    retour: 'Retour à la liste',
  },
  EN: {
    titre: 'Email and messaging',
    kicker: 'Communication',
    ongletCourriels: 'Emails',
    ongletMessagerie: 'Messaging',
    search: 'Search…',
    select: 'Select a message to read',
    empty: 'No messages yet.',
    emptyTexte: 'Messages received through the site appear here.',
    loading: 'Loading…',
    defaultSubject: 'New message',
    markRead: 'Mark as read',
    archive: 'Archive',
    delete: 'Delete',
    reply: 'Reply by email',
    voirDossier: "View their file",
    to: 'To: me',
    retour: 'Back to list',
  },
};

interface AdminCourrielProps {
  lang: Language;
  onglet?: 'courriels' | 'messagerie';
  onChangeView: (view: ViewState) => void;
}

const AdminCourriel: React.FC<AdminCourrielProps> = ({ lang, onglet = 'courriels', onChangeView }) => {
  const t = useTextes('adminCourriel', TEXTES, lang);
  const [actif, setActif] = useState<'courriels' | 'messagerie'>(onglet);

  const { data: leads, loading: loadingLeads } = useCollection<Lead>('leads', [orderBy('createdAt', 'desc')]);
  const { data: dossiers, loading: loadingDossiers } = useCollection<Dossier>('dossiers', [
    orderBy('derniereActiviteClient', 'desc'),
  ]);

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete kicker={t.kicker} titre={t.titre} />

      <div className="flex gap-2 border-b border-filet pb-2">
        <button
          type="button"
          onClick={() => setActif('courriels')}
          className={`min-h-[44px] px-4 rounded-champ text-sm font-medium flex items-center gap-2 ${
            actif === 'courriels' ? 'bg-papier-2 text-encre' : 'text-gris hover:text-encre'
          }`}
        >
          <Inbox className="w-4 h-4" aria-hidden="true" /> {t.ongletCourriels}
        </button>
        <button
          type="button"
          onClick={() => setActif('messagerie')}
          className={`min-h-[44px] px-4 rounded-champ text-sm font-medium flex items-center gap-2 ${
            actif === 'messagerie' ? 'bg-papier-2 text-encre' : 'text-gris hover:text-encre'
          }`}
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" /> {t.ongletMessagerie}
        </button>
      </div>

      {actif === 'courriels' ? (
        <Courriels leads={leads} loading={loadingLeads} dossiers={dossiers} lang={lang} t={t} onChangeView={onChangeView} />
      ) : (
        <Messagerie dossiers={dossiers} loading={loadingDossiers} lang={lang} onChangeView={onChangeView} />
      )}
    </div>
  );
};

interface CourrielsProps {
  leads: Lead[];
  loading: boolean;
  dossiers: Dossier[];
  lang: Language;
  t: (typeof TEXTES)['FR'];
  onChangeView: (view: ViewState) => void;
}

const Courriels: React.FC<CourrielsProps> = ({ leads, loading, dossiers, lang, t, onChangeView }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');

  const locale = lang === 'FR' ? 'fr-CA' : 'en-CA';
  const inboxLeads = leads.filter((l) => !l.archived);
  const unreadCount = inboxLeads.filter((l) => !l.read).length;

  const q = recherche.trim().toLowerCase();
  const filtres = !q
    ? inboxLeads
    : inboxLeads.filter(
        (l) => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.message?.toLowerCase().includes(q)
      );

  const selectedLead = leads.find((l) => l.id === selectedId) || null;

  const getDate = (lead: Lead): Date => lead.createdAt?.toDate?.() ?? new Date();
  const getSubject = (lead: Lead): string => {
    const msg = (lead.message || '').trim();
    if (!msg) return t.defaultSubject;
    return msg.length > 60 ? msg.slice(0, 60) + '…' : msg;
  };

  // Un lead se relie à un dossier par uid déjà connu, sinon par le même courriel.
  const leadUid = (selectedLead as unknown as { uid?: string } | null)?.uid;
  const dossierLie = selectedLead
    ? dossiers.find((d) => (leadUid && d.id === leadUid) || d.courriel?.toLowerCase() === selectedLead.email?.toLowerCase())
    : undefined;

  const handleSelect = async (lead: Lead) => {
    setSelectedId(lead.id);
    if (!lead.read) {
      try {
        await patchDoc<Lead>('leads', lead.id, { read: true });
      } catch {
        /* pas grave, l'état visuel reste correct */
      }
    }
  };

  const handleMarkRead = async () => {
    if (!selectedLead) return;
    await patchDoc<Lead>('leads', selectedLead.id, { read: true });
  };

  const handleArchive = async () => {
    if (!selectedLead) return;
    await patchDoc<Lead>('leads', selectedLead.id, { archived: true });
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    await removeDoc('leads', selectedLead.id);
    setSelectedId(null);
  };

  const handleReply = () => {
    if (!selectedLead) return;
    const sujet = encodeURIComponent(`Re: ${getSubject(selectedLead)}`);
    window.location.href = `mailto:${selectedLead.email}?subject=${sujet}`;
  };

  const CHAMP =
    'w-full bg-papier border border-filet rounded-champ pl-10 pr-4 py-2.5 text-sm text-encre placeholder-gris outline-none focus:border-rose transition-colors';

  return (
    <Panneau className="!p-0 overflow-hidden">
      <div className="flex h-[70vh] min-h-[520px]">
        {/* LISTE */}
        <div className={`${selectedLead ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-filet flex-col flex-shrink-0`}>
          <div className="p-4 border-b border-filet">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" aria-hidden="true" />
              <input
                type="text"
                placeholder={t.search}
                aria-label={t.search}
                className={CHAMP}
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            {unreadCount > 0 && <p className="text-xs text-rose mt-2">{unreadCount}</p>}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <Chargement texte={t.loading} />
            ) : filtres.length === 0 ? (
              <Vide titre={t.empty} texte={t.emptyTexte} />
            ) : (
              filtres.map((lead) => {
                const date = getDate(lead);
                const isUnread = !lead.read;
                const actifRow = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelect(lead)}
                    className={`relative p-4 border-b border-filet cursor-pointer transition-colors hover:bg-papier ${
                      actifRow ? 'bg-papier border-l-2 border-l-rose' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    {isUnread && <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-pilule bg-rose" />}
                    <div className="flex justify-between items-start mb-1">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className={`text-sm truncate ${isUnread ? 'font-semibold text-encre' : 'text-gris'}`}>
                          {lead.name || lead.email}
                        </p>
                        <p className="text-xs text-gris truncate">{lead.email}</p>
                      </div>
                      <span className="text-xs text-gris whitespace-nowrap ml-2">{date.toLocaleDateString(locale)}</span>
                    </div>
                    <p className={`text-sm mb-1 truncate ${isUnread ? 'font-semibold text-encre' : 'text-gris'}`}>{getSubject(lead)}</p>
                    <p className="text-xs text-gris line-clamp-2">{lead.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* LECTURE */}
        <div className={`${selectedLead ? 'flex' : 'hidden'} lg:flex flex-1 flex-col overflow-hidden`}>
          {selectedLead ? (
            <>
              <div className="p-4 border-b border-filet flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre"
                    aria-label={t.retour}
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={handleMarkRead}
                    title={t.markRead}
                    aria-label={t.markRead}
                    className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre"
                  >
                    <MailOpen className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={handleArchive}
                    title={t.archive}
                    aria-label={t.archive}
                    className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre"
                  >
                    <Archive className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={handleDelete}
                    title={t.delete}
                    aria-label={t.delete}
                    className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-rose"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <span className="text-xs text-gris">{selectedLead.source}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <h2 className="font-serif text-h3 text-encre mb-6">{getSubject(selectedLead)}</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-pilule bg-encre flex items-center justify-center text-lg font-semibold text-papier flex-shrink-0">
                    {(selectedLead.name || selectedLead.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-encre">
                      {selectedLead.name || (lang === 'FR' ? '(sans nom)' : '(no name)')}{' '}
                      <span className="text-gris font-normal text-sm">&lt;{selectedLead.email}&gt;</span>
                    </p>
                    <p className="text-xs text-gris">
                      {t.to} · {getDate(selectedLead).toLocaleDateString(locale)}
                    </p>
                  </div>
                </div>
                <div className="text-encre leading-relaxed border-b border-filet pb-8 mb-8 whitespace-pre-line text-sm">
                  {selectedLead.message}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Bouton variante="secondaire" icone={Reply} petit onClick={handleReply}>
                    {t.reply}
                  </Bouton>
                  {dossierLie && (
                    <Bouton variante="secondaire" icone={FolderOpen} petit onClick={() => onChangeView('ADMIN_DOSSIERS')}>
                      {t.voirDossier}
                    </Bouton>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Vide titre={t.select} />
            </div>
          )}
        </div>
      </div>
    </Panneau>
  );
};

export default AdminCourriel;
