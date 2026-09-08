import React, { useState, useEffect } from 'react';
import { Search, Inbox, Send, Star, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Reply, Sparkles, Bot, Loader2, Copy, Archive, Trash2, MailOpen } from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import { EnTete, Panneau, Bouton, Champ, Vide, Chargement } from '../components/admin/ui';
import { Language, Lead } from '../types';
import { useCollection, patchDoc, removeDoc } from '../lib/firestore';

interface AdminEmailProps {
  lang: Language;
}

const AdminEmail: React.FC<AdminEmailProps> = ({ lang }) => {
  const { data: leads, loading } = useCollection<Lead>('leads', [orderBy('createdAt', 'desc')]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Assistant State
  const [summary, setSummary] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedId) || null;

  const t = {
    FR: {
      newMessage: 'Nouveau message',
      inbox: 'Boîte de réception',
      important: 'Importants',
      sent: 'Envoyés',
      spam: 'Spam',
      search: 'Rechercher...',
      reply: 'Répondre',
      assistant: 'Assistant Xena',
      summary: 'Résumé & Analyse',
      actions: 'Actions Rapides',
      draft: 'Rédiger une réponse',
      drafting: 'Rédaction en cours...',
      suggested: 'Brouillon Suggéré',
      insert: 'Insérer dans la réponse',
      select: 'Sélectionnez un message pour le lire',
      analyze: 'Analyse...',
      empty: 'Aucun message pour le moment.',
      emptyTexte: 'Les messages reçus via le site apparaissent ici.',
      loading: 'Chargement...',
      defaultSubject: 'Nouveau message',
      markRead: 'Marquer comme lu',
      archive: 'Archiver',
      delete: 'Supprimer',
      to: 'À: moi',
      summaryFor: (name: string, firstLine: string) => `Demande de ${name} concernant: ${firstLine}`
    },
    EN: {
      newMessage: 'New Message',
      inbox: 'Inbox',
      important: 'Important',
      sent: 'Sent',
      spam: 'Spam',
      search: 'Search...',
      reply: 'Reply',
      assistant: 'Xena Assistant',
      summary: 'Summary & Analysis',
      actions: 'Quick Actions',
      draft: 'Draft Reply',
      drafting: 'Drafting...',
      suggested: 'Suggested Draft',
      insert: 'Insert into reply',
      select: 'Select a message to read',
      analyze: 'Analyzing...',
      empty: 'No messages yet.',
      emptyTexte: 'Messages received through the site appear here.',
      loading: 'Loading...',
      defaultSubject: 'New message',
      markRead: 'Mark as read',
      archive: 'Archive',
      delete: 'Delete',
      to: 'To: me',
      summaryFor: (name: string, firstLine: string) => `Request from ${name} about: ${firstLine}`
    }
  }[lang];

  const locale = lang === 'FR' ? 'fr-CA' : 'en-CA';

  const getDate = (lead: Lead): Date => {
    return lead.createdAt?.toDate?.() ?? new Date();
  };

  const getSubject = (lead: Lead): string => {
    const msg = (lead.message || '').trim();
    if (!msg) return t.defaultSubject;
    return msg.length > 60 ? msg.slice(0, 60) + '…' : msg;
  };

  const getFirstLine = (lead: Lead): string => {
    const first = (lead.message || '').split('\n')[0]?.trim() ?? '';
    return first.length > 80 ? first.slice(0, 80) + '…' : first;
  };

  // Visible inbox = not archived
  const inboxLeads = leads.filter(l => !l.archived);
  const unreadCount = inboxLeads.filter(l => !l.read).length;

  // Auto-summary (no real Gemini call yet, that's task #8)
  useEffect(() => {
    if (selectedLead) {
      setSummary('');
      setReplyDraft('');
      setIsAnalyzing(true);

      const timer = setTimeout(() => {
        const firstLine = getFirstLine(selectedLead) || (lang === 'FR' ? '(message vide)' : '(empty message)');
        setSummary(t.summaryFor(selectedLead.name || (lang === 'FR' ? 'Inconnu' : 'Unknown'), firstLine));
        setIsAnalyzing(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [selectedLead?.id, lang]);

  const handleDraftReply = () => {
    if (!selectedLead) return;
    setIsDrafting(true);

    setTimeout(() => {
      const firstName = (selectedLead.name || '').split(' ')[0] || (lang === 'FR' ? 'bonjour' : 'there');
      setReplyDraft(lang === 'FR'
        ? `Bonjour ${firstName},\n\nMerci pour votre message. J'ai bien pris connaissance de votre demande et je vous reviens très bientôt avec une réponse complète.\n\nCordialement,\nXena`
        : `Hi ${firstName},\n\nThanks for reaching out. I've received your message and will get back to you shortly with a full response.\n\nBest,\nXena`
      );
      setIsDrafting(false);
    }, 800);
  };

  const handleSelect = async (lead: Lead) => {
    setSelectedId(lead.id);
    if (!lead.read) {
      try { await patchDoc<Lead>('leads', lead.id, { read: true }); } catch (e) { /* ignore */ }
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

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete
        kicker={t.inbox}
        titre={t.inbox}
        actions={
          <Bouton variante="secondaire" icone={RefreshCw} petit>
            {t.newMessage}
          </Bouton>
        }
      />

      <Panneau className="!p-0 overflow-hidden">
        <div className="flex h-[70vh] min-h-[520px]">

          {/* SIDEBAR */}
          <div className="hidden md:flex w-56 bg-papier border-r border-filet p-4 flex-col gap-1 flex-shrink-0">
            <button className="flex items-center justify-between px-3 min-h-[44px] rounded-champ bg-papier-2 text-encre font-semibold text-sm">
              <span className="flex items-center gap-3"><Inbox className="w-4 h-4 text-rose" /> {t.inbox}</span>
              {unreadCount > 0 && <span className="text-xs text-rose tabular-nums">{unreadCount}</span>}
            </button>
            <button className="flex items-center gap-3 px-3 min-h-[44px] rounded-champ text-gris hover:text-encre hover:bg-papier-2 transition-colors text-sm">
              <Star className="w-4 h-4" /> {t.important}
            </button>
            <button className="flex items-center gap-3 px-3 min-h-[44px] rounded-champ text-gris hover:text-encre hover:bg-papier-2 transition-colors text-sm">
              <Send className="w-4 h-4" /> {t.sent}
            </button>
            <button className="flex items-center gap-3 px-3 min-h-[44px] rounded-champ text-gris hover:text-encre hover:bg-papier-2 transition-colors text-sm">
              <AlertCircle className="w-4 h-4" /> {t.spam}
            </button>
          </div>

          {/* LEAD LIST */}
          <div className={`${selectedLead ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-filet flex-col flex-shrink-0`}>
            <div className="p-4 border-b border-filet">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" />
                <input
                  type="text"
                  placeholder={t.search}
                  className="w-full bg-papier border border-filet rounded-champ pl-10 pr-4 py-2.5 text-sm text-encre placeholder-gris outline-none focus:border-rose transition-colors"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <Chargement texte={t.loading} />
              ) : inboxLeads.length === 0 ? (
                <Vide titre={t.empty} texte={t.emptyTexte} />
              ) : (
                inboxLeads.map(lead => {
                  const date = getDate(lead);
                  const dateLabel = date.toLocaleDateString(locale);
                  const isUnread = !lead.read;
                  const actif = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => handleSelect(lead)}
                      className={`relative p-4 border-b border-filet cursor-pointer transition-colors hover:bg-papier ${actif ? 'bg-papier border-l-2 border-l-rose' : 'border-l-2 border-l-transparent'}`}
                    >
                      {isUnread && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-pilule bg-rose" />
                      )}
                      <div className="flex justify-between items-start mb-1">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className={`text-sm truncate ${isUnread ? 'font-semibold text-encre' : 'text-gris'}`}>{lead.name || lead.email}</p>
                          <p className="text-xs text-gris truncate">{lead.email}</p>
                        </div>
                        <span className="text-xs text-gris whitespace-nowrap ml-2">{dateLabel}</span>
                      </div>
                      <p className={`text-sm mb-1 truncate ${isUnread ? 'font-semibold text-encre' : 'text-gris'}`}>{getSubject(lead)}</p>
                      <p className="text-xs text-gris line-clamp-2">{lead.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* READING PANE + ASSISTANT CONTAINER */}
          <div className={`${selectedLead ? 'flex' : 'hidden'} lg:flex flex-1 flex-col overflow-hidden`}>
            {selectedLead ? (
              <div className="flex h-full">

                {/* LEFT SIDE: LEAD CONTENT */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Toolbar */}
                  <div className="p-4 border-b border-filet flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedId(null)} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre" aria-label={t.select}><ChevronLeft className="w-5 h-5" /></button>
                      <button onClick={handleMarkRead} title={t.markRead} aria-label={t.markRead} className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre"><MailOpen className="w-5 h-5" /></button>
                      <button onClick={handleArchive} title={t.archive} aria-label={t.archive} className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre"><Archive className="w-5 h-5" /></button>
                      <button onClick={handleDelete} title={t.delete} aria-label={t.delete} className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-rose"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gris mr-2">{selectedLead.source}</span>
                      <button className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre" aria-label="Précédent"><ChevronLeft className="w-4 h-4" /></button>
                      <button className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre" aria-label="Suivant"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <h2 className="font-serif text-h3 text-encre mb-6">{getSubject(selectedLead)}</h2>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-pilule bg-encre flex items-center justify-center text-lg font-semibold text-papier flex-shrink-0">
                        {(selectedLead.name || selectedLead.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-encre">{selectedLead.name || '(sans nom)'} <span className="text-gris font-normal text-sm">&lt;{selectedLead.email}&gt;</span></p>
                        <p className="text-xs text-gris">{t.to} · {getDate(selectedLead).toLocaleDateString(locale)}</p>
                      </div>
                    </div>
                    <div className="text-encre space-y-4 leading-relaxed border-b border-filet pb-8 mb-8 whitespace-pre-line text-sm">
                      {selectedLead.message}
                    </div>
                    <Bouton variante="secondaire" icone={Reply} petit>
                      {t.reply}
                    </Bouton>
                  </div>
                </div>

                {/* RIGHT SIDE: ASSISTANT PANEL */}
                <div className="w-[30%] min-w-[280px] max-w-sm border-l border-filet bg-papier flex flex-col">
                  <div className="p-4 border-b border-filet flex items-center gap-2">
                    <Bot className="w-5 h-5 text-rose" />
                    <h3 className="font-semibold text-encre">{t.assistant}</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* SECTION 1: CONTEXT SUMMARY */}
                    <div className="space-y-2">
                      <h4 className="kicker text-gris">{t.summary}</h4>
                      <div className="bg-papier-2 border border-filet rounded-champ p-4 text-sm text-encre min-h-[100px] relative">
                        {isAnalyzing ? (
                          <div className="absolute inset-0 flex items-center justify-center text-gris gap-2 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> {t.analyze}
                          </div>
                        ) : (
                          <p className="whitespace-pre-line leading-relaxed">{summary}</p>
                        )}
                      </div>
                    </div>

                    {/* SECTION 2: ACTIONS */}
                    <div className="space-y-2">
                      <h4 className="kicker text-gris">{t.actions}</h4>
                      <Bouton
                        variante="secondaire"
                        onClick={handleDraftReply}
                        disabled={isDrafting}
                        icone={isDrafting ? undefined : Sparkles}
                        className="w-full"
                      >
                        {isDrafting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isDrafting ? t.drafting : t.draft}
                      </Bouton>
                    </div>

                    {/* SECTION 3: OUTPUT */}
                    {replyDraft && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="kicker text-gris">{t.suggested}</h4>
                          <button className="text-gris hover:text-encre" title="Copier" aria-label="Copier">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <textarea
                          className="w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre outline-none focus:border-rose transition-colors h-64 text-sm leading-relaxed resize-none"
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                        />
                        <Bouton variante="primaire" icone={Send} petit className="w-full">
                          {t.insert}
                        </Bouton>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <Vide titre={t.select} />
            )}
          </div>

        </div>
      </Panneau>
    </div>
  );
};

export default AdminEmail;
