import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { repondreAssistant, SUGGESTIONS_ASSISTANT } from '../../lib/assistant';
import { Dossier, DossierConfig, Language } from '../../types';
import { Portail } from '../motion';

interface AssistantProps {
  config: DossierConfig;
  dossier: Dossier | null;
  lang: Language;
}

interface Bulle {
  de: 'moi' | 'lui';
  texte: string;
}

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const Assistant: React.FC<AssistantProps> = ({ config, dossier, lang }) => {
  const [ouvert, setOuvert] = useState(false);
  const [fil, setFil] = useState<Bulle[]>([]);
  const [champ, setChamp] = useState('');
  const filRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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
      setFil((f) => [...f, { de: 'lui', texte: repondreAssistant(q, config, dossier, lang) }]);
      requestAnimationFrame(faireDefiler);
    }, 280);
  };

  const ouvrir = () => {
    setOuvert(true);
    if (fil.length === 0) setFil([{ de: 'lui', texte: t.bonjour }]);
  };

  return (
    <Portail>
      <>
        {!ouvert && (
          <button
            type="button"
            onClick={ouvrir}
            aria-label={t.ouvrir}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-pilule bg-encre shadow-panneau flex items-center justify-center text-papier hover:bg-encre-2 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence>
          {ouvert && (
            <motion.section
              role="dialog"
              aria-label={t.titre}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.24, ease: EASE_EXPO }}
              style={{ transformOrigin: 'bottom right' }}
              className="fixed z-[91] bottom-0 right-0 left-0 md:left-auto md:bottom-6 md:right-6 w-full md:w-[380px] h-[min(72dvh,560px)] md:h-[560px] flex flex-col rounded-t-champ md:rounded-champ overflow-hidden bg-papier border border-filet shadow-panneau"
            >
              <header className="flex items-center gap-3 px-5 py-4 border-b border-filet flex-shrink-0">
                <span className="w-9 h-9 rounded-pilule bg-encre flex items-center justify-center text-xs font-sans font-bold text-papier flex-shrink-0">
                  LB
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-bold text-encre truncate">{t.titre}</p>
                  <p className="text-xs text-gris truncate">{t.sous}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOuvert(false)}
                  aria-label={t.fermer}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-pilule text-gris hover:text-encre hover:bg-papier-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </header>

              <div ref={filRef} data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {fil.map((b, i) => (
                  <p
                    key={i}
                    aria-live={i === fil.length - 1 ? 'polite' : undefined}
                    className={`max-w-[85%] rounded-champ px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line font-sans ${
                      b.de === 'moi' ? 'self-end bg-encre text-papier rounded-br-[4px]' : 'self-start bg-papier-2 text-encre rounded-bl-[4px]'
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
                      className="px-3 py-1.5 rounded-pilule border border-filet text-xs text-gris hover:border-rose hover:text-rose transition-colors"
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
                className="flex items-center gap-2 px-4 py-3 border-t border-filet flex-shrink-0"
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
                  className="flex-1 bg-papier-2 border border-filet rounded-pilule px-4 min-h-[44px] text-sm text-encre placeholder-gris transition-colors"
                />
                <button
                  type="submit"
                  aria-label={t.envoyer}
                  className="w-11 h-11 rounded-pilule bg-encre flex items-center justify-center text-papier flex-shrink-0 hover:bg-encre-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
      </>
    </Portail>
  );
};

export default Assistant;
