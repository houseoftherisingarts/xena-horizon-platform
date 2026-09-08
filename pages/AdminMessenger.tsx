import React, { useState, useMemo } from 'react';
import { Search, MoreHorizontal, Phone, Video, Image as ImageIcon, ThumbsUp, Send, Plus, X } from 'lucide-react';
import { orderBy, serverTimestamp } from 'firebase/firestore';
import { Language, Conversation, ChatMessage } from '../types';
import { useCollection, createDoc, patchDoc } from '../lib/firestore';
import { EnTete, Bouton, Champ, Vide, Chargement } from '../components/admin/ui';

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
      titre: 'Messagerie',
      kicker: 'Communication',
      search: 'Rechercher...',
      placeholder: 'Écrivez un message...',
      select: 'Sélectionnez une conversation',
      empty: 'Aucune conversation',
      choisir: 'Choisis une conversation dans la liste.',
      loading: 'Chargement...',
      newConv: 'Nouvelle conversation',
      participantName: 'Nom du participant',
      participantEmail: 'Courriel (optionnel)',
      cancel: 'Annuler',
      create: 'Créer',
      appeler: 'Appeler',
      video: 'Appel vidéo',
      plus: 'Plus d’options',
      joindre: 'Joindre une image',
      aimer: 'Envoyer un pouce',
    },
    EN: {
      titre: 'Messenger',
      kicker: 'Communication',
      search: 'Search...',
      placeholder: 'Write a message...',
      select: 'Select a conversation',
      empty: 'No conversations yet',
      choisir: 'Pick a conversation from the list.',
      loading: 'Loading...',
      newConv: 'New conversation',
      participantName: 'Participant name',
      participantEmail: 'Email (optional)',
      cancel: 'Cancel',
      create: 'Create',
      appeler: 'Call',
      video: 'Video call',
      plus: 'More options',
      joindre: 'Attach an image',
      aimer: 'Send a thumbs up',
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
    <div className="px-6 md:px-10 py-10 md:h-screen flex flex-col">
      <EnTete
        kicker={t.kicker}
        titre={t.titre}
        actions={
          <Bouton icone={Plus} onClick={() => setShowNewModal(true)}>
            {t.newConv}
          </Bouton>
        }
      />

      <div className="flex-1 min-h-0 mt-8 bg-papier-2 border border-filet rounded-champ overflow-hidden flex flex-col md:flex-row">
        {/* LISTE DES CONVERSATIONS */}
        <div className="w-full md:w-80 flex-shrink-0 border-b md:border-b-0 md:border-r border-filet flex flex-col max-h-[50vh] md:max-h-none">
          <div className="p-4 border-b border-filet">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gris" aria-hidden="true" />
              <input
                type="text"
                placeholder={t.search}
                aria-label={t.search}
                className="w-full bg-papier border border-filet rounded-champ pl-10 pr-4 py-2 text-sm text-encre placeholder-gris outline-none transition-colors focus:border-rose"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convLoading ? (
              <Chargement texte={t.loading} />
            ) : conversations.length === 0 ? (
              <Vide titre={t.empty} />
            ) : (
              conversations.map(conv => {
                const initial = conv.participantName?.charAt(0)?.toUpperCase() || '?';
                const dateLabel = conv.lastMessageAt?.toDate?.()?.toLocaleDateString(localeStr) || '';
                const unread = !!conv.unreadByAdmin;
                return (
                  <button
                    type="button"
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-3 flex items-center gap-3 text-left border-b border-filet transition-colors hover:bg-papier ${
                      selectedId === conv.id ? 'bg-papier' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-encre flex items-center justify-center text-papier font-semibold text-lg">
                        {initial}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5 gap-2">
                        <h4 className={`text-sm truncate ${unread ? 'font-semibold text-encre' : 'text-encre'}`}>{conv.participantName}</h4>
                        <span className="text-xs text-gris flex-shrink-0">{dateLabel}</span>
                      </div>
                      <p className={`text-xs truncate ${unread ? 'font-semibold text-encre' : 'text-gris'}`}>{conv.lastMessage || ''}</p>
                    </div>
                    {unread && <div className="w-2 h-2 rounded-full bg-rose flex-shrink-0" aria-hidden="true" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ZONE DE CONVERSATION */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[18rem]">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-filet flex justify-between items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-encre flex items-center justify-center text-papier font-semibold flex-shrink-0">
                    {activeChat.participantName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-encre truncate">{activeChat.participantName}</h3>
                    <p className="text-xs text-gris truncate">{activeChat.participantEmail || ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button type="button" aria-label={t.appeler} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre">
                    <Phone className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={t.video} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre">
                    <Video className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={t.plus} className="w-11 h-11 flex items-center justify-center text-gris hover:text-encre">
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => {
                  const isMe = msg.sender === 'admin';
                  const time = msg.createdAt?.toDate?.()?.toLocaleTimeString(localeStr, { hour: '2-digit', minute: '2-digit' }) || '';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-champ ${
                          isMe ? 'bg-bouton text-sur-bouton rounded-br-none' : 'bg-papier border border-filet text-encre rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.body}</p>
                        {time && <p className={`text-xs mt-1 ${isMe ? 'text-papier/70' : 'text-gris'}`}>{time}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-filet flex items-center gap-2">
                <button type="button" aria-label={t.joindre} className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-gris hover:text-encre">
                  <ImageIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full bg-papier border border-filet rounded-champ py-2 px-4 text-sm text-encre placeholder-gris outline-none transition-colors focus:border-rose"
                    placeholder={t.placeholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />
                </div>
                {inputText ? (
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    aria-label={t.placeholder}
                    className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-rose hover:text-encre disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" aria-hidden="true" />
                  </button>
                ) : (
                  <button type="button" aria-label={t.aimer} className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-gris hover:text-encre">
                    <ThumbsUp className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              {conversations.length === 0 && !convLoading ? <Vide titre={t.choisir} /> : <p className="text-gris text-sm">{t.select}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Nouvelle conversation */}
      {showNewModal && (
        <div className="fixed inset-0 bg-encre/60 z-50 flex items-center justify-center p-4">
          <div className="bg-papier-2 border border-filet rounded-champ shadow-panneau p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-h3 text-encre">{t.newConv}</h3>
              <button type="button" onClick={() => setShowNewModal(false)} aria-label={t.cancel} className="w-11 h-11 -mr-2 -mt-1 flex items-center justify-center text-gris hover:text-encre">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4">
              <Champ
                label={t.participantName}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Champ
                label={t.participantEmail}
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Bouton variante="discret" onClick={() => setShowNewModal(false)}>
                {t.cancel}
              </Bouton>
              <Bouton onClick={handleCreateConversation} disabled={!newName.trim()}>
                {t.create}
              </Bouton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessenger;
