import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { GLASS_INPUT_CLASSES } from '../../../constants';
import { DossierMessage, Language } from '../../../types';
import { dateCourte } from './util';

interface FilAdminProps {
  messages: DossierMessage[];
  dossierNom: string;
  lang: Language;
  onSend: (texte: string) => Promise<void>;
}

const t = {
  FR: {
    title: 'Fil de messages',
    placeholder: 'Écrire un message…',
    send: 'Envoyer',
    empty: 'Aucun message pour le moment.',
    erreur: "Le message n'a pas pu être envoyé.",
    envoye: 'Message envoyé.',
  },
  EN: {
    title: 'Messages',
    placeholder: 'Write a message…',
    send: 'Send',
    empty: 'No messages yet.',
    erreur: 'The message could not be sent.',
    envoye: 'Message sent.',
  },
};

const FilAdmin: React.FC<FilAdminProps> = ({ messages, dossierNom, lang, onSend }) => {
  const tr = t[lang];
  const [texte, setTexte] = useState('');
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texte.trim() || busy) return;
    setBusy(true);
    setErreur(null);
    try {
      await onSend(texte.trim());
      setTexte('');
      setConfirmation(tr.envoye);
    } catch {
      setErreur(tr.erreur);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-slate-950/50 rounded-[20px] border border-white/5 p-6 flex flex-col h-full">
      <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-cyan-300" /> {tr.title}
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4 custom-scrollbar min-h-[160px] max-h-96">
        {messages.length === 0 && <p className="text-sm text-slate-500 text-center py-4">{tr.empty}</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.de === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-[15px] px-4 py-2.5 text-sm ${
                m.de === 'admin' ? 'bg-iridescent-soft border border-cyan-400/20 text-white' : 'bg-white/5 border border-white/10 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.texte}</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {m.de === 'admin' ? (lang === 'FR' ? 'Toi' : 'You') : dossierNom} · {dateCourte(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={envoyer} className="mt-auto space-y-2">
        <div className="relative">
          <input
            type="text"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder={tr.placeholder}
            className={`${GLASS_INPUT_CLASSES} pr-12`}
          />
          <button
            type="submit"
            disabled={busy || !texte.trim()}
            aria-label={tr.send}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 rounded-[10px] text-white hover:bg-cyan-400 transition-colors disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {erreur && <p className="text-xs text-red-400" role="alert">{erreur}</p>}
        <p className="text-xs text-emerald-400 sr-only" role="status" aria-live="polite">
          {confirmation}
        </p>
      </form>
    </div>
  );
};

export default FilAdmin;
