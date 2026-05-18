import React, { useState, useEffect } from 'react';
import { Search, Inbox, Send, Star, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Reply, Sparkles, Bot, Loader2, Copy, Archive, Trash2, MailOpen } from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import { GLASS_INPUT_CLASSES, ACTION_BUTTON_CLASSES } from '../constants';
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

  // Auto-summary (no real Gemini call yet — that's task #8)
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
    <div className="pt-24 px-6 pb-12 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
             <span className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center text-white text-sm font-bold tracking-tighter">M</span>
             {t.inbox}
          </h1>
        </div>
        <div className="flex gap-2">
           <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><RefreshCw className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-white/10 rounded-[20px] overflow-hidden shadow-2xl flex">

         {/* SIDEBAR */}
         <div className="w-64 bg-slate-950/50 border-r border-white/5 p-4 flex flex-col gap-2 flex-shrink-0">
            <button className={`${ACTION_BUTTON_CLASSES} w-full justify-center mb-4`}>
               {t.newMessage}
            </button>

            <button className="flex items-center justify-between px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 font-bold">
               <div className="flex items-center gap-3"><Inbox className="w-4 h-4" /> {t.inbox}</div>
               <span className="text-xs">{unreadCount}</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
               <Star className="w-4 h-4" /> {t.important}
            </button>
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
               <Send className="w-4 h-4" /> {t.sent}
            </button>
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
               <AlertCircle className="w-4 h-4" /> {t.spam}
            </button>
         </div>

         {/* LEAD LIST */}
         <div className={`${selectedLead ? 'hidden lg:block' : 'block'} w-full lg:w-80 border-r border-white/5 flex flex-col flex-shrink-0`}>
            <div className="p-4 border-b border-white/5">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder={t.search} className={`${GLASS_INPUT_CLASSES} pl-10 py-2 text-sm bg-slate-950`} />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {loading ? (
                  <div className="flex items-center justify-center text-slate-500 gap-2 p-8 text-sm">
                     <Loader2 className="w-4 h-4 animate-spin" /> {t.loading}
                  </div>
               ) : inboxLeads.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm p-8">{t.empty}</div>
               ) : (
                  inboxLeads.map(lead => {
                     const date = getDate(lead);
                     const dateLabel = date.toLocaleDateString(locale);
                     const isUnread = !lead.read;
                     return (
                        <div
                          key={lead.id}
                          onClick={() => handleSelect(lead)}
                          className={`relative p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${selectedLead?.id === lead.id ? 'bg-blue-900/10 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'} ${isUnread ? 'bg-white/[0.02]' : ''}`}
                        >
                           {isUnread && (
                              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                           )}
                           <div className="flex justify-between items-start mb-1">
                              <div className="min-w-0 flex-1 pr-2">
                                 <p className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'text-slate-300'}`}>{lead.name || lead.email}</p>
                                 <p className="text-xs text-slate-500 truncate">{lead.email}</p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{dateLabel}</span>
                           </div>
                           <p className={`text-sm mb-1 truncate ${isUnread ? 'font-semibold text-white' : 'text-slate-400'}`}>{getSubject(lead)}</p>
                           <p className="text-xs text-slate-500 line-clamp-2">{lead.message}</p>
                        </div>
                     );
                  })
               )}
            </div>
         </div>

         {/* READING PANE + ASSISTANT CONTAINER */}
         <div className={`${selectedLead ? 'block' : 'hidden'} lg:block flex-1 bg-slate-900 flex flex-col overflow-hidden`}>
            {selectedLead ? (
               <div className="flex h-full">

                  {/* LEFT SIDE: LEAD CONTENT */}
                  <div className="flex-1 flex flex-col min-w-0">
                      {/* Toolbar */}
                      <div className="p-4 border-b border-white/5 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 hover:bg-white/10 rounded-full text-slate-400"><ChevronLeft className="w-5 h-5"/></button>
                            <button onClick={handleMarkRead} title={t.markRead} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-blue-400"><MailOpen className="w-5 h-5"/></button>
                            <button onClick={handleArchive} title={t.archive} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-amber-400"><Archive className="w-5 h-5"/></button>
                            <button onClick={handleDelete} title={t.delete} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-red-400"><Trash2 className="w-5 h-5"/></button>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{selectedLead.source}</span>
                            <button className="p-2 hover:bg-white/10 rounded-full text-slate-400"><ChevronLeft className="w-4 h-4"/></button>
                            <button className="p-2 hover:bg-white/10 rounded-full text-slate-400"><ChevronRight className="w-4 h-4"/></button>
                         </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                         <h2 className="text-2xl font-bold text-white mb-6">{getSubject(selectedLead)}</h2>
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                               {(selectedLead.name || selectedLead.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <p className="font-bold text-white">{selectedLead.name || '—'} <span className="text-slate-500 font-normal text-sm">&lt;{selectedLead.email}&gt;</span></p>
                               <p className="text-xs text-slate-500">{t.to} · {getDate(selectedLead).toLocaleDateString(locale)}</p>
                            </div>
                         </div>
                         <div className="text-slate-300 space-y-4 leading-relaxed border-b border-white/5 pb-8 mb-8 whitespace-pre-line">
                            {selectedLead.message}
                         </div>
                         <button className="px-6 py-2 border border-white/10 rounded-full text-slate-400 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
                            <Reply className="w-4 h-4" /> {t.reply}
                         </button>
                      </div>
                  </div>

                  {/* RIGHT SIDE: ASSISTANT PANEL */}
                  <div className="w-[30%] min-w-[300px] max-w-sm border-l border-white/5 bg-slate-950/50 flex flex-col">
                      <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center gap-2">
                          <Bot className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">{t.assistant}</h3>
                          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse ml-auto" />
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                          {/* SECTION 1: CONTEXT SUMMARY */}
                          <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.summary}</h4>
                              <div className="bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-slate-300 min-h-[100px] relative">
                                  {isAnalyzing ? (
                                      <div className="absolute inset-0 flex items-center justify-center text-slate-500 gap-2">
                                          <Loader2 className="w-4 h-4 animate-spin" /> {t.analyze}
                                      </div>
                                  ) : (
                                      <p className="whitespace-pre-line leading-relaxed">{summary}</p>
                                  )}
                              </div>
                          </div>

                          {/* SECTION 2: ACTIONS */}
                          <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.actions}</h4>
                              <button
                                  onClick={handleDraftReply}
                                  disabled={isDrafting}
                                  className="w-full py-3 px-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                              >
                                  {isDrafting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4 group-hover:text-amber-400 transition-colors" />}
                                  {isDrafting ? t.drafting : t.draft}
                              </button>
                          </div>

                          {/* SECTION 3: OUTPUT */}
                          {replyDraft && (
                              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                  <div className="flex justify-between items-center">
                                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.suggested}</h4>
                                      <button className="text-slate-500 hover:text-white" title="Copier">
                                          <Copy className="w-3 h-3" />
                                      </button>
                                  </div>
                                  <textarea
                                      className={`${GLASS_INPUT_CLASSES} h-64 text-sm leading-relaxed p-4 resize-none`}
                                      value={replyDraft}
                                      onChange={(e) => setReplyDraft(e.target.value)}
                                  />
                                  <button className={`${ACTION_BUTTON_CLASSES} w-full justify-center text-sm py-2`}>
                                      <Send className="w-3 h-3" /> {t.insert}
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>

               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <Inbox className="w-16 h-16 mb-4 opacity-20" />
                  <p>{t.select}</p>
               </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default AdminEmail;
