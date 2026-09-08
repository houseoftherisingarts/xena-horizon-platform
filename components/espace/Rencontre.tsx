import React, { useEffect, useRef, useState } from 'react';
import { salleUrl } from '../../lib/rendezvous';
import { useTextes } from '../../lib/textes';
import { Language } from '../../types';

interface RencontreProps {
  salle: string;
  nom: string;
  lang: Language;
  onQuitter: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => JitsiMeetAPI;
  }
}

interface JitsiMeetAPI {
  on: (evenement: string, gestionnaire: () => void) => void;
  dispose: () => void;
}

const SCRIPT_JITSI = 'https://meet.jit.si/external_api.js';
let chargementScript: Promise<void> | null = null;

/** Injecte le script Jitsi une seule fois pour toute la session, promesse partagée entre les montages. */
function chargerScriptJitsi(): Promise<void> {
  if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) return Promise.resolve();
  if (!chargementScript) {
    chargementScript = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_JITSI;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        chargementScript = null;
        reject(new Error('jitsi-script'));
      };
      document.head.appendChild(script);
    });
  }
  return chargementScript;
}

const TEXTES = {
  FR: {
    chargement: 'Ouverture de la salle…',
    secours: 'Ouvrir la rencontre dans un nouvel onglet',
    quitter: 'Quitter la rencontre',
  },
  EN: {
    chargement: 'Opening the room…',
    secours: 'Open the meeting in a new tab',
    quitter: 'Leave the meeting',
  },
};

/** La rencontre vidéo : salle Jitsi Meet nommée d'après le rendez-vous, aucune clé d'API. */
const Rencontre: React.FC<RencontreProps> = ({ salle, nom, lang, onQuitter }) => {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetAPI | null>(null);
  const [pret, setPret] = useState(false);
  const [echec, setEchec] = useState(false);
  const t = useTextes('espaceRencontre', TEXTES, lang);

  useEffect(() => {
    let annule = false;
    const delaiSecours = window.setTimeout(() => {
      if (!annule) setEchec(true);
    }, 8000);

    chargerScriptJitsi()
      .then(() => {
        if (annule || !conteneurRef.current || !window.JitsiMeetExternalAPI) return;
        const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: salle,
          parentNode: conteneurRef.current,
          width: '100%',
          height: '100%',
          userInfo: { displayName: nom },
          configOverwrite: { prejoinPageEnabled: true, disableDeepLinking: true },
          interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false },
        });
        apiRef.current = api;
        api.on('videoConferenceLeft', onQuitter);
        api.on('readyToClose', onQuitter);
        window.clearTimeout(delaiSecours);
        setPret(true);
      })
      .catch(() => {
        if (!annule) setEchec(true);
      });

    return () => {
      annule = true;
      window.clearTimeout(delaiSecours);
      apiRef.current?.dispose();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salle, nom]);

  return (
    <div data-tx-scope="espaceRencontre" className="space-y-4">
      <div className="relative w-full h-[70vh] md:h-auto md:aspect-video md:min-h-[480px] bg-papier-2 border border-filet rounded-champ overflow-hidden">
        <div ref={conteneurRef} className="absolute inset-0" />
        {!pret && !echec && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
            <span className="w-8 h-8 rounded-pilule border-2 border-filet border-t-rose animate-spin" />
            <p className="text-gris text-sm">{t.chargement}</p>
          </div>
        )}
        {echec && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <a
              href={salleUrl(salle)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center rounded-pilule bg-bouton text-sur-bouton hover:bg-bouton-2 px-5 text-sm font-medium transition-colors"
            >
              {t.secours}
            </a>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onQuitter}
        className="min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-rose hover:text-rose transition-colors"
      >
        {t.quitter}
      </button>
    </div>
  );
};

export default Rencontre;
