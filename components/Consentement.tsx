import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { activerAnalytics } from '../firebase';
import { Language } from '../types';
import { useIntroTerminee } from '../lib/intro';
import { Portail, Reveal } from './motion';
import { useTextes } from '../lib/textes';

interface ConsentementProps {
  lang: Language;
}

const TEXTES = {
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
    ariaBandeau: 'Bandeau de consentement',
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
    ariaBandeau: 'Consent banner',
  },
};

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

// Petit registre partagé : Footer.tsx lit la visibilité du bandeau via useConsentementVisible()
// sans avoir à faire descendre l'état par les props.
type VisibiliteListener = (visible: boolean) => void;
let bandeauVisible = false;
const visibiliteListeners = new Set<VisibiliteListener>();

function definirVisibilite(visible: boolean): void {
  if (bandeauVisible === visible) return;
  bandeauVisible = visible;
  visibiliteListeners.forEach((fn) => fn(visible));
}

/** Vrai tant que le bandeau de consentement occupe le bas de l'écran. */
export function useConsentementVisible(): boolean {
  const [visible, setVisible] = useState(bandeauVisible);
  useEffect(() => {
    visibiliteListeners.add(setVisible);
    return () => {
      visibiliteListeners.delete(setVisible);
    };
  }, []);
  return visible;
}

/** Bandeau Loi 25 : mesure d'audience Firebase Analytics seulement, rien d'autre. */
const Consentement: React.FC<ConsentementProps> = ({ lang }) => {
  const [valeur, setValeur] = useState<Valeur | null>(() => (typeof window === 'undefined' ? null : lire()));
  const [politiqueOuverte, setPolitiqueOuverte] = useState(false);
  const introTerminee = useIntroTerminee();
  // Le bandeau se pose après l'intro (page intérieure : pas d'intro, il se pose tout de suite).
  const [pretAAfficher, setPretAAfficher] = useState(introTerminee);

  useEffect(() => {
    if (introTerminee) {
      setPretAAfficher(true);
      return;
    }
    const t = setTimeout(() => setPretAAfficher(true), 1800);
    return () => clearTimeout(t);
  }, [introTerminee]);

  useEffect(() => {
    if (valeur === 'accepte') activerAnalytics();
  }, [valeur]);

  useEffect(() => {
    definirVisibilite(valeur === null && pretAAfficher);
  }, [valeur, pretAAfficher]);

  useEffect(() => () => definirVisibilite(false), []);
  const t = useTextes('consentement', TEXTES, lang);

  const decider = (v: Valeur) => {
    ecrire(v);
    setValeur(v);
  };

  return (
    <>
      {valeur === null && pretAAfficher && (
        <div data-tx-scope="consentement" className="fixed z-[90] inset-x-4 bottom-4 sm:inset-x-auto sm:left-auto sm:right-6 sm:bottom-6 sm:w-[min(420px,calc(100vw-3rem))]">
          <Reveal delay={0.3} y={20} amount={0.1}>
            <div
              role="dialog"
              aria-live="polite"
              aria-label={t.ariaBandeau}
              className="bg-papier border border-filet rounded-champ shadow-panneau px-5 py-3.5"
            >
              <p className="text-petit text-encre">{t.texte}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => decider('accepte')}
                  className="min-h-[44px] px-4 rounded-pilule bg-bouton text-sur-bouton text-sm font-medium hover:bg-bouton-2 transition-colors"
                >
                  {t.accepter}
                </button>
                <button
                  type="button"
                  onClick={() => decider('refuse')}
                  className="min-h-[44px] px-4 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-encre transition-colors"
                >
                  {t.refuser}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPolitiqueOuverte(true)}
                className="mt-1.5 text-xs text-gris hover:text-rose underline transition-colors"
              >
                {t.lien}
              </button>
            </div>
          </Reveal>
        </div>
      )}

      {politiqueOuverte && (
        <Portail>
          <div className="fixed inset-0 z-[100] bg-encre/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-papier border border-filet rounded-champ shadow-panneau p-8 relative">
              <button
                type="button"
                onClick={() => setPolitiqueOuverte(false)}
                aria-label={t.fermer}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gris hover:text-encre transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-serif text-h3 text-encre mb-6">{t.titrePolitique}</h2>
              <div className="space-y-5 text-sm text-encre">
                <div>
                  <h3 className="kicker text-gris mb-1">{t.quoi}</h3>
                  <p>{t.quoiTexte}</p>
                </div>
                <div>
                  <h3 className="kicker text-gris mb-1">{t.qui}</h3>
                  <p>{t.quiTexte}</p>
                </div>
                <div>
                  <h3 className="kicker text-gris mb-1">{t.retrait}</h3>
                  <p>{t.retraitTexte}</p>
                </div>
              </div>
            </div>
          </div>
        </Portail>
      )}
    </>
  );
};

export default Consentement;
