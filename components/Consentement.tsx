import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { activerAnalytics } from '../firebase';
import { Language } from '../types';

interface ConsentementProps {
  lang: Language;
}

const CLE = 'xena.consentement';
type Valeur = 'accepte' | 'refuse';

function lire(): Valeur | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const parsed = JSON.parse(brut);
    return parsed?.valeur === 'accepte' || parsed?.valeur === 'refuse' ? parsed.valeur : null;
  } catch {
    return null;
  }
}

function ecrire(valeur: Valeur): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify({ valeur, date: new Date().toISOString() }));
  } catch {
    /* navigation privée : la décision tient le temps de la visite */
  }
}

/** Bandeau Loi 25 : mesure d'audience Firebase Analytics seulement, rien d'autre. */
const Consentement: React.FC<ConsentementProps> = ({ lang }) => {
  const [valeur, setValeur] = useState<Valeur | null>(() => (typeof window === 'undefined' ? null : lire()));
  const [politiqueOuverte, setPolitiqueOuverte] = useState(false);

  useEffect(() => {
    if (valeur === 'accepte') activerAnalytics();
  }, [valeur]);

  const t = {
    FR: {
      texte: 'Ce site mesure sa fréquentation avec Firebase Analytics, et rien d\'autre.',
      accepter: "J'accepte",
      refuser: 'Je refuse',
      lien: 'En savoir plus',
      titrePolitique: 'Confidentialité',
      quoi: 'Ce qui est recueilli',
      quoiTexte: 'Les pièces que vous déposez dans votre dossier client, hébergées par Firebase Storage au Canada ou aux États-Unis. Les courriels envoyés par les formulaires de contact. Et, si vous acceptez ci-dessous, la mesure d\'audience du site.',
      qui: 'Qui y accède',
      quiTexte: 'Laurie Belhumeur, seule.',
      retrait: 'Comment retirer votre consentement',
      retraitTexte: 'Écrivez à laurie.belhumeur@gmail.com.',
      fermer: 'Fermer',
    },
    EN: {
      texte: 'This site measures its traffic with Firebase Analytics, and nothing else.',
      accepter: 'I accept',
      refuser: 'I decline',
      lien: 'Learn more',
      titrePolitique: 'Privacy',
      quoi: 'What is collected',
      quoiTexte: 'The files you upload to your client file, hosted by Firebase Storage in Canada or the United States. Emails sent through the contact forms. And, if you accept below, the site\'s audience measurement.',
      qui: 'Who has access',
      quiTexte: 'Laurie Belhumeur, only.',
      retrait: 'How to withdraw your consent',
      retraitTexte: 'Write to laurie.belhumeur@gmail.com.',
      fermer: 'Close',
    },
  }[lang];

  const decider = (v: Valeur) => {
    ecrire(v);
    setValeur(v);
  };

  return (
    <>
      {valeur === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={lang === 'FR' ? 'Bandeau de consentement' : 'Consent banner'}
          className="fixed bottom-0 left-0 right-0 z-[90] bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl px-4 py-3 md:px-8 flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
        >
          <p className="text-sm text-slate-300 md:flex-1">{t.texte}</p>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => decider('accepte')}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift text-white text-sm font-medium transition-all shadow-iridescent-sm hover:shadow-iridescent"
            >
              {t.accepter}
            </button>
            <button
              onClick={() => decider('refuse')}
              className="min-h-[44px] px-5 py-2.5 rounded-full border border-white/15 hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors"
            >
              {t.refuser}
            </button>
          </div>
          <button
            onClick={() => setPolitiqueOuverte(true)}
            className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
          >
            {t.lien}
          </button>
        </div>
      )}

      {politiqueOuverte &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[20px] shadow-2xl p-8 relative">
              <button
                onClick={() => setPolitiqueOuverte(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label={t.fermer}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-serif font-bold text-white mb-6">{t.titrePolitique}</h2>
              <div className="space-y-5 text-sm text-slate-300">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.quoi}</h3>
                  <p>{t.quoiTexte}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.qui}</h3>
                  <p>{t.quiTexte}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.retrait}</h3>
                  <p>{t.retraitTexte}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Consentement;
