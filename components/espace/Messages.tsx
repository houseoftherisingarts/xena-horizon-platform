import React, { useEffect, useRef, useState } from 'react';
import { increment, orderBy, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, Send } from 'lucide-react';
import { createDoc, patchDoc, useCollection } from '../../lib/firestore';
import { DossierMessage, Language } from '../../types';

interface MessagesProps {
  uid: string;
  lang: Language;
}

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
    <section className="border-t border-filet pt-8 flex flex-col h-[min(70vh,640px)]">
      <div className="mb-4 flex-shrink-0">
        <h2 className="font-serif text-h3 text-encre">{t.titre}</h2>
        <p className="text-gris text-sm mesure">{t.sous}</p>
      </div>

      <div ref={filRef} data-lenis-prevent className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && <p className="text-gris text-sm py-8 text-center">{t.vide}</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.de === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]">
              <p className={`text-xs text-gris mb-1 ${m.de === 'client' ? 'text-right' : ''}`}>
                {m.de === 'client' ? '' : t.laurie} {jour(m.createdAt)}
              </p>
              <p
                className={`rounded-champ px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line font-sans ${
                  m.de === 'client' ? 'bg-papier-2 text-encre rounded-br-[4px]' : 'bg-encre text-papier rounded-bl-[4px]'
                }`}
              >
                {m.texte}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 text-sm text-rose mt-3">
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
          className="flex-1 bg-papier border border-filet rounded-pilule px-5 min-h-[44px] text-sm text-encre placeholder-gris transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !texte.trim()}
          aria-label={t.envoyer}
          className="w-11 h-11 rounded-pilule bg-encre flex items-center justify-center text-papier flex-shrink-0 disabled:opacity-50 hover:bg-encre-2 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
};

export default Messages;
