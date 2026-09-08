import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
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

const EASE_MAISON = [0.16, 0.8, 0.24, 1] as const;

const EspaceShell: React.FC<EspaceShellProps> = ({ user, lang }) => {
  const uid = user.uid;
  const { data: dossier, loading } = useDocument<Dossier>(`dossiers/${uid}`);
  const config = useDossierConfig();
  const [onglet, setOnglet] = useState<Onglet>('dossier');
  const creationEnCours = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [ongletsDebordent, setOngletsDebordent] = useState(false);

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

  // Fondu de défilement : visible tant qu'il reste des onglets cachés à droite.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const verifier = () => setOngletsDebordent(el.scrollWidth - el.scrollLeft - el.clientWidth > 4);
    verifier();
    el.addEventListener('scroll', verifier, { passive: true });
    window.addEventListener('resize', verifier);
    return () => {
      el.removeEventListener('scroll', verifier);
      window.removeEventListener('resize', verifier);
    };
  }, [dossier]);

  // L'onglet actif défile en vue à chaque changement.
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [onglet]);

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
      ongletsCourt: {
        dossier: 'Dossier',
        pieces: 'Pièces',
        parcours: 'Parcours',
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
      ongletsCourt: {
        dossier: 'File',
        pieces: 'Documents',
        parcours: 'Journey',
        messages: 'Messages',
        ressources: 'Resources',
      },
      chargement: 'Opening your file…',
    },
  }[lang];

  if (loading || !dossier) {
    return (
      <div className="min-h-[100svh] bg-papier pt-32 flex flex-col items-center gap-4" role="status" aria-live="polite">
        <span className="w-8 h-8 rounded-pilule border-2 border-filet border-t-rose animate-spin" />
        <p className="text-gris text-sm">{t.chargement}</p>
      </div>
    );
  }

  const pct = avancement(dossier, config.pieces);
  const idxEtape = indexEtape(config.etapes, dossier.etape);
  const etapeCourante = config.etapes[idxEtape];
  const prenom = (dossier.nom || '').trim().split(' ')[0] || (dossier.courriel || '').split('@')[0];

  const onglets: { id: Onglet; label: string; labelCourt: string }[] = [
    { id: 'dossier', label: t.onglets.dossier, labelCourt: t.ongletsCourt.dossier },
    { id: 'pieces', label: t.onglets.pieces, labelCourt: t.ongletsCourt.pieces },
    { id: 'parcours', label: t.onglets.parcours, labelCourt: t.ongletsCourt.parcours },
    { id: 'messages', label: t.onglets.messages, labelCourt: t.ongletsCourt.messages },
    { id: 'ressources', label: t.onglets.ressources, labelCourt: t.ongletsCourt.ressources },
  ];

  return (
    <div className="min-h-[100svh] bg-papier pt-28 md:pt-32 pb-24 px-gut">
      {/* Bandeau d'en-tête : pleine largeur, sans carte */}
      <div className="border-b border-filet pb-6 mb-8 flex flex-col md:flex-row md:items-end gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-h2 text-encre truncate">
            {t.bonjour} {prenom}
          </h1>
          <p className="text-gris text-sm mt-1 mesure">{dossier.projet?.titre || dossier.courriel}</p>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="font-sans font-semibold tabular-nums text-encre" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
              {pct} %
            </p>
            <p className="kicker text-gris mt-1">{t.pct}</p>
          </div>
          <div className="hidden sm:block">
            <p className="font-sans font-semibold text-sm text-encre">
              {(lang === 'EN' ? (etapeCourante as { titreEn?: string } | undefined)?.titreEn : undefined) ?? etapeCourante?.titre ?? ''}
            </p>
            <p className="kicker text-gris mt-1">{t.etape}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-rose hover:text-rose transition-colors flex-shrink-0"
        >
          {t.deconnexion}
        </button>
      </div>

      {/* Onglets soulignés, jamais en pilules */}
      <div className="relative mb-8">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-proximity [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {onglets.map((o) => (
            <button
              key={o.id}
              ref={onglet === o.id ? activeTabRef : undefined}
              type="button"
              role="tab"
              aria-selected={onglet === o.id}
              onClick={() => setOnglet(o.id)}
              className={`relative min-h-[44px] pb-3 kicker whitespace-nowrap shrink-0 snap-start transition-colors ${
                onglet === o.id ? 'text-encre' : 'text-gris hover:text-encre'
              }`}
            >
              <span className="sm:hidden">{o.labelCourt}</span>
              <span className="hidden sm:inline">{o.label}</span>
              {onglet === o.id && (
                <motion.span
                  layoutId="espace-onglet"
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-rose"
                  transition={{ duration: 0.2, ease: EASE_MAISON }}
                />
              )}
            </button>
          ))}
        </div>
        {ongletsDebordent && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-papier to-transparent"
          />
        )}
      </div>

      {/* Contenu de l'onglet, en fondu croisé de 200 ms plutôt qu'un remplacement sec. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={onglet}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_MAISON }}
        >
          {onglet === 'dossier' && <Profil dossier={dossier} uid={uid} lang={lang} />}
          {onglet === 'pieces' && <Pieces dossier={dossier} config={config} uid={uid} lang={lang} />}
          {onglet === 'parcours' && <Parcours dossier={dossier} config={config} lang={lang} />}
          {onglet === 'messages' && <Messages uid={uid} lang={lang} />}
          {onglet === 'ressources' && <Ressources lang={lang} />}
        </motion.div>
      </AnimatePresence>

      <Assistant config={config} dossier={dossier} lang={lang} />
    </div>
  );
};

export default EspaceShell;
