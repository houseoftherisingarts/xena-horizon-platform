import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, MoreHorizontal, Phone, Video, Image as ImageIcon, ThumbsUp, Send, Plus, X } from 'lucide-react';
import { orderBy, serverTimestamp } from 'firebase/firestore';
import { GLASS_INPUT_CLASSES } from '../constants';
import { Language, Conversation, ChatMessage } from '../types';
import { useCollection, createDoc, patchDoc } from '../lib/firestore';

interface AdminMessengerProps {
  lang: Language;
}

const AdminMessenger: React.FC<AdminMessengerProps> = ({ lang }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [sending, setSending] = useState(false);

  const convConstraints = useMemo(() => [orderBy('lastMessageAt', 'desc')], []);
  const { data: conversations, loading: convLoading } = useCollection<Conversation>('conversations', convConstraints);

  const msgConstraints = useMemo(() => [orderBy('createdAt', 'asc')], []);
  const { data: messages } = useCollection<ChatMessage>(
    selectedId ? `conversations/${selectedId}/messages` : 'conversations/__none__/messages',
    msgConstraints
  );

  const activeChat = conversations.find(c => c.id === selectedId) || null;

  const t = {
    FR: {
      search: 'Rechercher...',
      online: 'En ligne',
      offline: 'Hors ligne',
      placeholder: 'Écrivez un message...',
      select: 'Sélectionnez une conversation',
      empty: 'Aucune conversation',
      loading: 'Chargement...',
      newConv: 'Nouvelle conversation',
      participantName: 'Nom du participant',
      participantEmail: 'Courriel (optionnel)',
      cancel: 'Annuler',
      create: 'Créer',
    },
    EN: {
      search: 'Search...',
      online: 'Online',
      offline: 'Offline',
      placeholder: 'Write a message...',
      select: 'Select a conversation',
      empty: 'No conversations yet',
      loading: 'Loading...',
      newConv: 'New conversation',
      participantName: 'Participant name',
      participantEmail: 'Email (optional)',
      cancel: 'Cancel',
      create: 'Create',
    }
  }[lang];

  const localeStr = lang === 'FR' ? 'fr-CA' : 'en-CA';

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedId(conv.id);
    if (conv.unreadByAdmin) {
      try {
        await patchDoc('conversations', conv.id, { unreadByAdmin: false });
      } catch (e) {
        console.error('Failed to mark as read', e);
      }
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !selectedId || sending) return;
    setSending(true);
    try {
      await createDoc(`conversations/${selectedId}/messages`, {
        body: text,
        sender: 'admin',
      });
      await patchDoc('conversations', selectedId, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadByAdmin: false,
      });
      setInputText('');
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateConversation = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const id = await createDoc('conversations', {
        participantName: name,
        participantEmail: newEmail.trim() || '',
        unreadByAdmin: false,
      });
      setSelectedId(id);
      setNewName('');
      setNewEmail('');
      setShowNewModal(false);
    } catch (e) {
      console.error('Failed to create conversation', e);
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
             <MessageCircle className="w-8 h-8 text-blue-500" />
             Messenger
          </h1>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.newConv}
        </button>
      </div>

      <div className="flex-1 bg-slate-900 border border-white/10 rounded-[20px] overflow-hidden shadow-2xl flex">

         {/* SIDEBAR LIST */}
         <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/30">
            <div className="p-4 border-b border-white/5">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder={t.search} className={`${GLASS_INPUT_CLASSES} pl-10 py-2 text-sm bg-slate-900 rounded-full border-transparent`} />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {convLoading ? (
                  <div className="p-6 text-center text-slate-500 text-sm">{t.loading}</div>
               ) : conversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">{t.empty}</div>
               ) : (
                  conversations.map(conv => {
                     const initial = conv.participantName?.charAt(0)?.toUpperCase() || '?';
                     const dateLabel = conv.lastMessageAt?.toDate?.()?.toLocaleDateString(localeStr) || '';
                     const unread = !!conv.unreadByAdmin;
                     return (
                        <div
                           key={conv.id}
                           onClick={() => handleSelectConversation(conv)}
                           className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${selectedId === conv.id ? 'bg-blue-500/10' : ''}`}
                        >
                           <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                 {initial}
                              </div>
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                 <h4 className={`text-sm truncate ${unread ? 'font-bold text-white' : 'text-slate-200'}`}>{conv.participantName}</h4>
                                 <span className="text-xs text-slate-500">{dateLabel}</span>
                              </div>
                              <p className={`text-xs truncate ${unread ? 'font-bold text-white' : 'text-slate-500'}`}>{conv.lastMessage || ''}</p>
                           </div>
                           {unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                     );
                  })
               )}
            </div>
         </div>

         {/* CHAT AREA */}
         <div className="flex-1 flex flex-col bg-slate-900">
            {activeChat ? (
               <>
                  {/* Header */}
                  <div className="p-4 border-b border-white/5 flex justify-between items-center shadow-md z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                           {activeChat.participantName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                           <h3 className="font-bold text-white">{activeChat.participantName}</h3>
                           <p className="text-xs text-slate-400">{activeChat.participantEmail || ''}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 text-blue-500">
                        <Phone className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                        <Video className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                        <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                     {messages.map(msg => {
                        const isMe = msg.sender === 'admin';
                        const time = msg.createdAt?.toDate?.()?.toLocaleTimeString(localeStr, { hour: '2-digit', minute: '2-digit' }) || '';
                        return (
                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                                 <p className="text-sm">{msg.body}</p>
                                 {time && <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>{time}</p>}
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/5 flex items-center gap-3">
                     <ImageIcon className="w-6 h-6 text-blue-500 cursor-pointer" />
                     <div className="flex-1 relative">
                        <input
                           type="text"
                           className="w-full bg-slate-800 rounded-full py-2 px-4 text-white focus:outline-none placeholder-slate-500"
                           placeholder={t.placeholder}
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           onKeyDown={handleKeyDown}
                           disabled={sending}
                        />
                     </div>
                     {inputText ? (
                        <button onClick={handleSend} disabled={sending} className="disabled:opacity-50">
                           <Send className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-400" />
                        </button>
                     ) : (
                        <ThumbsUp className="w-6 h-6 text-blue-500 cursor-pointer" />
                     )}
                  </div>
               </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-slate-500">
                  <p>{conversations.length === 0 && !convLoading ? t.empty : t.select}</p>
               </div>
            )}
         </div>

      </div>

      {/* New conversation modal */}
      {showNewModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-serif font-bold text-white">{t.newConv}</h3>
                  <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="space-y-3">
                  <div>
                     <label className="block text-xs text-slate-400 mb-1">{t.participantName}</label>
                     <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className={`${GLASS_INPUT_CLASSES} w-full`}
                        autoFocus
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-slate-400 mb-1">{t.participantEmail}</label>
                     <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className={`${GLASS_INPUT_CLASSES} w-full`}
                     />
                  </div>
               </div>
               <div className="flex justify-end gap-2 mt-6">
                  <button
                     onClick={() => setShowNewModal(false)}
                     className="px-4 py-2 text-sm text-slate-300 hover:text-white"
                  >
                     {t.cancel}
                  </button>
                  <button
                     onClick={handleCreateConversation}
                     disabled={!newName.trim()}
                     className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-full disabled:opacity-50"
                  >
                     {t.create}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminMessenger;
