import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { FileText, FolderOpen, LogOut, MessageSquare, Route as RouteIcon, User as UserIcon } from 'lucide-react';
import { auth } from '../../firebase';
import { useDocument, writeDoc } from '../../lib/firestore';
import { avancement, indexEtape, nouveauDossier, useDossierConfig } from '../../lib/dossier';
import { Dossier, Language } from '../../types';
import Profil from './Profil';
import Pieces from './Pieces';
import Parcours from './Parcours';
import Messages from './Messages';
import Ressources from './Ressources';
import Assistant from './Assistant';

interface EspaceShellProps {
  user: User;
  lang: Language;
}

type Onglet = 'dossier' | 'pieces' | 'parcours' | 'messages' | 'ressources';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const EspaceShell: React.FC<EspaceShellProps> = ({ user, lang }) => {
  const uid = user.uid;
  const { data: dossier, loading } = useDocument<Dossier>(`dossiers/${uid}`);
  const config = useDossierConfig();
  const [onglet, setOnglet] = useState<Onglet>('dossier');
  const creationEnCours = useRef(false);

  // Au premier passage, le dossier n'existe pas encore : on le crée une seule fois.
  useEffect(() => {
    if (!loading && dossier === null && !creationEnCours.current) {
      creationEnCours.current = true;
      const courriel = user.email ?? '';
      const nom = user.displayName ?? (courriel ? courriel.split('@')[0] : 'Nouveau dossier');
      writeDoc('dossiers', uid, nouveauDossier(uid, courriel, nom)).catch(() => {
        creationEnCours.current = false;
      });
    }
  }, [loading, dossier, uid, user.email, user.displayName]);

  const t = {
    FR: {
      bonjour: 'Bonjour',
      pct: 'de ton dossier complet',
      etape: 'Étape en cours',
      deconnexion: 'Fermer la session',
      onglets: {
        dossier: 'Mon dossier',
        pieces: 'Mes pièces',
        parcours: 'Mon parcours',
        messages: 'Messages',
        ressources: 'Ressources',
      },
      chargement: 'Ouverture de ton dossier…',
    },
    EN: {
      bonjour: 'Hello',
      pct: 'of your file complete',
      etape: 'Current step',
      deconnexion: 'Sign out',
      onglets: {
        dossier: 'My file',
        pieces: 'My documents',
        parcours: 'My journey',
        messages: 'Messages',
        ressources: 'Resources',
      },
      chargement: 'Opening your file…',
    },
  }[lang];

  if (loading || !dossier) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center gap-4" role="status" aria-live="polite">
        <span className="w-10 h-10 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
        <p className="text-slate-400 text-sm">{t.chargement}</p>
      </div>
    );
  }

  const pct = avancement(dossier, config.pieces);
  const idxEtape = indexEtape(config.etapes, dossier.etape);
  const etapeCourante = config.etapes[idxEtape];
  const prenom = (dossier.nom || '').trim().split(' ')[0] || (dossier.courriel || '').split('@')[0];

  const onglets: { id: Onglet; label: string; icon: React.ReactNode }[] = [
    { id: 'dossier', label: t.onglets.dossier, icon: <UserIcon className="w-4 h-4" /> },
    { id: 'pieces', label: t.onglets.pieces, icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'parcours', label: t.onglets.parcours, icon: <RouteIcon className="w-4 h-4" /> },
    { id: 'messages', label: t.onglets.messages, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'ressources', label: t.onglets.ressources, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24 px-4 md:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Bandeau d'en-tête */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white truncate">
              {t.bonjour} {prenom}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{dossier.projet?.titre || dossier.courriel}</p>
          </div>
          <div className="flex items-center gap-6 md:gap-10">
            <div>
              <p className="text-2xl font-bold text-iridescent">{pct} %</p>
              <p className="text-xs text-slate-400">{t.pct}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">{etapeCourante?.titre ?? ''}</p>
              <p className="text-xs text-slate-400">{t.etape}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className={`flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-white/15 hover:border-red-400/50 hover:bg-red-500/10 text-slate-300 hover:text-red-200 text-sm font-medium transition-colors flex-shrink-0 ${FOCUS_RING}`}
          >
            <LogOut className="w-4 h-4" />
            {t.deconnexion}
          </button>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0" role="tablist">
          {onglets.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={onglet === o.id}
              onClick={() => setOnglet(o.id)}
              className={`flex items-center gap-2 min-h-[44px] px-5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${FOCUS_RING} ${
                onglet === o.id
                  ? 'bg-iridescent text-white shadow-iridescent-sm'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>

        {/* Contenu de l'onglet */}
        <div>
          {onglet === 'dossier' && <Profil dossier={dossier} uid={uid} lang={lang} />}
          {onglet === 'pieces' && <Pieces dossier={dossier} config={config} uid={uid} lang={lang} />}
          {onglet === 'parcours' && <Parcours dossier={dossier} config={config} lang={lang} />}
          {onglet === 'messages' && <Messages uid={uid} lang={lang} />}
          {onglet === 'ressources' && <Ressources lang={lang} />}
        </div>
      </div>

      <Assistant config={config} dossier={dossier} lang={lang} />
    </div>
  );
};

export default EspaceShell;
