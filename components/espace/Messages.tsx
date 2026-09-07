import React, { useEffect, useRef, useState } from 'react';
import { increment, orderBy, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, Send } from 'lucide-react';
import { createDoc, patchDoc, useCollection } from '../../lib/firestore';
import { DossierMessage, Language } from '../../types';

interface MessagesProps {
  uid: string;
  lang: Language;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const jour = (ts: any): string => {
  try {
    const d: Date | null = ts?.toDate ? ts.toDate() : null;
    return d ? d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  } catch {
    return '';
  }
};

const Messages: React.FC<MessagesProps> = ({ uid, lang }) => {
  const { data: messages } = useCollection<DossierMessage>(`dossiers/${uid}/messages`, [orderBy('createdAt', 'asc')]);
  const [texte, setTexte] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filRef = useRef<HTMLDivElement>(null);
  const marqueEnCours = useRef(false);

  const t = {
    FR: {
      titre: 'Messages',
      sous: 'Écris directement à Laurie. Elle voit ton message dès qu\'il entre.',
      placeholder: 'Ton message',
      envoyer: 'Envoyer',
      vide: "Aucun message pour l'instant. Écris à Laurie quand tu as une question.",
      echec: "L'envoi a échoué. Réessaie dans un instant.",
      laurie: 'Laurie',
    },
    EN: {
      titre: 'Messages',
      sous: "Write directly to Laurie. She sees your message as soon as it comes in.",
      placeholder: 'Your message',
      envoyer: 'Send',
      vide: 'No messages yet. Write to Laurie whenever you have a question.',
      echec: 'Sending failed. Try again in a moment.',
      laurie: 'Laurie',
    },
  }[lang];

  useEffect(() => {
    filRef.current?.scrollTo({ top: filRef.current.scrollHeight });
  }, [messages.length]);

  // À l'ouverture, marquer les messages de Laurie comme lus et remettre nonLusClient à 0.
  useEffect(() => {
    const nonLus = messages.filter((m) => m.de === 'admin' && !m.luParClient);
    if (nonLus.length === 0 || marqueEnCours.current) return;
    marqueEnCours.current = true;
    Promise.all(nonLus.map((m) => patchDoc<Record<string, any>>(`dossiers/${uid}/messages`, m.id, { luParClient: true })))
      .then(() => patchDoc<Record<string, any>>('dossiers', uid, { nonLusClient: 0 }))
      .catch(() => {})
      .finally(() => {
        marqueEnCours.current = false;
      });
  }, [messages, uid]);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = texte.trim();
    if (!v || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createDoc(`dossiers/${uid}/messages`, {
        texte: v,
        de: 'client',
        deUid: uid,
        luParAdmin: false,
        luParClient: true,
      });
      await patchDoc<Record<string, any>>('dossiers', uid, {
        nonLusAdmin: increment(1),
        derniereActiviteClient: serverTimestamp(),
      });
      setTexte('');
    } catch {
      setError(t.echec);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-xl p-6 md:p-8 flex flex-col h-[min(70vh,640px)]">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-lg font-serif font-bold text-white">{t.titre}</h2>
        <p className="text-slate-400 text-sm">{t.sous}</p>
      </div>

      <div ref={filRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && <p className="text-slate-500 text-sm py-8 text-center">{t.vide}</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.de === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]">
              <p className={`text-xs text-slate-500 mb-1 ${m.de === 'client' ? 'text-right' : ''}`}>
                {m.de === 'client' ? '' : t.laurie} {jour(m.createdAt)}
              </p>
              <p
                className={`rounded-[16px] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  m.de === 'client'
                    ? 'bg-iridescent text-white rounded-br-[6px]'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-[6px]'
                }`}
              >
                {m.texte}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 text-sm text-red-300 mt-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={envoyer} className="flex items-center gap-2 mt-4 flex-shrink-0">
        <label htmlFor="msg-champ" className="sr-only">
          {t.placeholder}
        </label>
        <input
          id="msg-champ"
          type="text"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          className="flex-1 bg-white/5 border border-white/20 rounded-full px-5 min-h-[44px] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !texte.trim()}
          aria-label={t.envoyer}
          className={`w-11 h-11 rounded-full bg-iridescent flex items-center justify-center text-white flex-shrink-0 disabled:opacity-50 ${FOCUS_RING}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Messages;
