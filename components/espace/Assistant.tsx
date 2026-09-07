import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Send, X } from 'lucide-react';
import { repondreAssistant, SUGGESTIONS_ASSISTANT } from '../../lib/assistant';
import { Dossier, DossierConfig, Language } from '../../types';

interface AssistantProps {
  config: DossierConfig;
  dossier: Dossier | null;
  lang: Language;
}

interface Bulle {
  de: 'moi' | 'lui';
  texte: string;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const Assistant: React.FC<AssistantProps> = ({ config, dossier, lang }) => {
  const [ouvert, setOuvert] = useState(false);
  const [fil, setFil] = useState<Bulle[]>([]);
  const [champ, setChamp] = useState('');
  const filRef = useRef<HTMLDivElement>(null);

  const t = {
    FR: {
      ouvrir: "Ouvrir l'assistant",
      fermer: "Fermer l'assistant",
      titre: "L'assistant",
      sous: 'Répond sur tes pièces, ton parcours et mes services',
      bonjour:
        'Bonjour. Je peux te dire quelles pièces déposer, où tu en es dans ton parcours, ce que ça coûte et comment me joindre. Pose ta question.',
      placeholder: 'Ta question',
      envoyer: 'Envoyer',
    },
    EN: {
      ouvrir: 'Open the assistant',
      fermer: 'Close the assistant',
      titre: 'The assistant',
      sous: 'Answers about your files, your journey and my services',
      bonjour:
        'Hello. I can tell you which files to send, where you stand in your journey, what things cost and how to reach me. Ask away.',
      placeholder: 'Your question',
      envoyer: 'Send',
    },
  }[lang];

  const faireDefiler = () => {
    const el = filRef.current;
    if (!el) return;
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduit ? 'auto' : 'smooth' });
  };

  const poser = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setFil((f) => [...f, { de: 'moi', texte: q }]);
    setChamp('');
    requestAnimationFrame(faireDefiler);
    window.setTimeout(() => {
      setFil((f) => [...f, { de: 'lui', texte: repondreAssistant(q, config, dossier) }]);
      requestAnimationFrame(faireDefiler);
    }, 280);
  };

  const ouvrir = () => {
    setOuvert(true);
    if (fil.length === 0) setFil([{ de: 'lui', texte: t.bonjour }]);
  };

  return createPortal(
    <>
      {!ouvert && (
        <button
          type="button"
          onClick={ouvrir}
          aria-label={t.ouvrir}
          className={`fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift shadow-iridescent flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 ${FOCUS_RING}`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {ouvert && (
        <section
          role="dialog"
          aria-label={t.titre}
          className="fixed z-[91] bottom-0 right-0 left-0 md:left-auto md:bottom-6 md:right-6 w-full md:w-[380px] h-[min(72dvh,560px)] md:h-[560px] flex flex-col rounded-t-[24px] md:rounded-[24px] overflow-hidden bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <header className="flex items-center gap-3 px-5 py-4 border-b border-white/10 flex-shrink-0">
            <span className="w-9 h-9 rounded-full bg-iridescent flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              LB
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{t.titre}</p>
              <p className="text-xs text-slate-400 truncate">{t.sous}</p>
            </div>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label={t.fermer}
              className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ${FOCUS_RING}`}
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div ref={filRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {fil.map((b, i) => (
              <p
                key={i}
                aria-live={i === fil.length - 1 ? 'polite' : undefined}
                className={`max-w-[85%] rounded-[16px] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  b.de === 'moi'
                    ? 'self-end bg-iridescent text-white rounded-br-[6px]'
                    : 'self-start bg-white/5 border border-white/10 text-slate-200 rounded-bl-[6px]'
                }`}
              >
                {b.texte}
              </p>
            ))}
          </div>

          {fil.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3 flex-shrink-0">
              {SUGGESTIONS_ASSISTANT.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => poser(s)}
                  className={`px-3 py-1.5 rounded-full border border-white/15 text-xs text-slate-300 hover:border-cyan-400/50 hover:text-white transition-colors ${FOCUS_RING}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              poser(champ);
            }}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/10 flex-shrink-0"
          >
            <label htmlFor="assistant-champ" className="sr-only">
              {t.placeholder}
            </label>
            <input
              id="assistant-champ"
              type="text"
              value={champ}
              onChange={(e) => setChamp(e.target.value)}
              placeholder={t.placeholder}
              autoComplete="off"
              className={`flex-1 bg-white/5 border border-white/20 rounded-full px-4 min-h-[44px] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors`}
            />
            <button
              type="submit"
              aria-label={t.envoyer}
              className={`w-11 h-11 rounded-full bg-iridescent flex items-center justify-center text-white flex-shrink-0 ${FOCUS_RING}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}
    </>,
    document.body
  );
};

export default Assistant;
