import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
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

const CHAMP =
  'w-full bg-papier border border-filet rounded-champ px-4 py-3 pr-12 text-encre placeholder-gris outline-none transition-colors focus:border-rose';

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
    <div className="bg-papier border border-filet rounded-champ p-6 flex flex-col h-full">
      <h3 className="font-sans font-semibold text-encre mb-4 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-rose" aria-hidden="true" /> {tr.title}
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4 min-h-[160px] max-h-96">
        {messages.length === 0 && <p className="text-sm text-gris text-center py-4">{tr.empty}</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.de === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-champ px-4 py-2.5 text-sm ${
                m.de === 'admin' ? 'bg-bouton text-sur-bouton' : 'bg-papier-2 border border-filet text-encre'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.texte}</p>
              <p className={`text-xs mt-1 ${m.de === 'admin' ? 'text-papier/70' : 'text-gris'}`}>
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
            className={CHAMP}
          />
          <button
            type="submit"
            disabled={busy || !texte.trim()}
            aria-label={tr.send}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-pilule bg-bouton text-sur-bouton hover:bg-bouton-2 transition-colors disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        {erreur && <p className="text-xs text-rose" role="alert">{erreur}</p>}
        <p className="text-xs text-gris sr-only" role="status" aria-live="polite">
          {confirmation}
        </p>
      </form>
    </div>
  );
};

export default FilAdmin;
