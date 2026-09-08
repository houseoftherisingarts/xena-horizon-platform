import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDocument, writeDoc } from '../../lib/firestore';
import { avancement, indexEtape, nouveauDossier, PROFILS, useDossierConfig } from '../../lib/dossier';
import { intentionRendezVous, effacerIntentionRendezVous } from '../../lib/rendezvous';
import { Dossier, Language } from '../../types';
import Avatar from './Avatar';
import Profil from './Profil';
import Pieces from './Pieces';
import Parcours from './Parcours';
import RendezVous from './RendezVous';
import Messages from './Messages';
import Ressources from './Ressources';
import MonProfil from './MonProfil';
import Assistant from './Assistant';
import { useTextes } from '../../lib/textes';

interface EspaceShellProps {
  user: User;
  lang: Language;
}

type Onglet = 'dossier' | 'pieces' | 'parcours' | 'rendezvous' | 'messages' | 'ressources' | 'profil';

const EASE_MAISON = [0.16, 0.8, 0.24, 1] as const;
const BANNIERE_DEFAUT = '/images/banniere-defaut.jpg';
const BANNIERE_DEFAUT_960 = '/images/banniere-defaut-960.jpg';

const TEXTES = {
  FR: {
    pct: 'du dossier complet',
    etape: 'Étape en cours',
    deconnexion: 'Fermer la session',
    ongletDossier: 'Mon dossier',
    ongletPieces: 'Mes pièces',
    ongletParcours: 'Mon parcours',
    ongletRendezvous: 'Rendez-vous',
    ongletMessages: 'Messages',
    ongletRessources: 'Ressources',
    ongletProfil: 'Mon profil',
    ongletCourtDossier: 'Dossier',
    ongletCourtPieces: 'Pièces',
    ongletCourtParcours: 'Parcours',
    ongletCourtRendezvous: 'Rendez-vous',
    ongletCourtMessages: 'Messages',
    ongletCourtRessources: 'Ressources',
    ongletCourtProfil: 'Profil',
    chargement: 'Ouverture de ton dossier…',
  },
  EN: {
    pct: 'of your file complete',
    etape: 'Current step',
    deconnexion: 'Sign out',
    ongletDossier: 'My file',
    ongletPieces: 'My documents',
    ongletParcours: 'My journey',
    ongletRendezvous: 'Appointments',
    ongletMessages: 'Messages',
    ongletRessources: 'Resources',
    ongletProfil: 'My profile',
    ongletCourtDossier: 'File',
    ongletCourtPieces: 'Documents',
    ongletCourtParcours: 'Journey',
    ongletCourtRendezvous: 'Appointments',
    ongletCourtMessages: 'Messages',
    ongletCourtRessources: 'Resources',
    ongletCourtProfil: 'Profile',
    chargement: 'Opening your file…',
  },
};

const EspaceShell: React.FC<EspaceShellProps> = ({ user, lang }) => {
  const uid = user.uid;
  const { data: dossier, loading } = useDocument<Dossier>(`dossiers/${uid}`);
  const config = useDossierConfig();
  const [onglet, setOnglet] = useState<Onglet>(() => (intentionRendezVous() ? 'rendezvous' : 'dossier'));
  const creationEnCours = useRef(false);

  // Une venue depuis « Prendre rendez-vous » sur le site public ouvre directement cet onglet, une seule fois.
  useEffect(() => {
    if (intentionRendezVous()) effacerIntentionRendezVous();
  }, []);

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

  const t = useTextes('espace', TEXTES, lang);

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
  const nom = (dossier.nom || '').trim() || (dossier.courriel || '').split('@')[0];
  const profilDef = PROFILS.find((p) => p.id === dossier.profil);
  const sousLigne = [lang === 'EN' ? profilDef?.nomEn : profilDef?.nom, dossier.discipline, dossier.ville].filter(Boolean).join(' · ');

  const onglets: { id: Onglet; label: string; labelCourt: string }[] = [
    { id: 'dossier', label: t.ongletDossier, labelCourt: t.ongletCourtDossier },
    { id: 'pieces', label: t.ongletPieces, labelCourt: t.ongletCourtPieces },
    { id: 'parcours', label: t.ongletParcours, labelCourt: t.ongletCourtParcours },
    { id: 'rendezvous', label: t.ongletRendezvous, labelCourt: t.ongletCourtRendezvous },
    { id: 'messages', label: t.ongletMessages, labelCourt: t.ongletCourtMessages },
    { id: 'ressources', label: t.ongletRessources, labelCourt: t.ongletCourtRessources },
    { id: 'profil', label: t.ongletProfil, labelCourt: t.ongletCourtProfil },
  ];

  return (
    <div className="min-h-[100svh] bg-papier pt-nav pb-24" data-tx-scope="espace">
      {/* Bannière pleine largeur, façon profil de réseau social : image de la personne (ou le défaut du studio), voile encre au bas pour porter le nom. */}
      <div className="relative w-full aspect-[2/1] md:aspect-[3/1] overflow-hidden bg-papier-2">
        <img
          src={dossier.banniereURL || BANNIERE_DEFAUT}
          srcSet={dossier.banniereURL ? undefined : `${BANNIERE_DEFAUT_960} 960w, ${BANNIERE_DEFAUT} 1920w`}
          sizes={dossier.banniereURL ? undefined : '100vw'}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-encre/35" aria-hidden="true" />
      </div>

      <div className="px-gut">
        {/* L'avatar chevauche le bas de la bannière, à gauche, comme dans le profil de Krystine. */}
        <div className="relative z-10 -mt-12 md:-mt-16 flex flex-col md:flex-row md:items-end gap-6 pb-6 border-b border-filet">
          <Avatar url={dossier.photoURL} nom={nom} taille="lg" />
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-1">
            <div className="min-w-0">
              <h1 className="font-serif text-h2 text-encre truncate">{nom}</h1>
              {sousLigne && <p className="text-gris text-sm mt-1 mesure">{sousLigne}</p>}
            </div>
            <div className="flex items-end gap-8 flex-shrink-0">
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
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-rose hover:text-rose transition-colors"
              >
                {t.deconnexion}
              </button>
            </div>
          </div>
        </div>

        {/* Onglets soulignés, jamais en pilules. Sous 640px : deux rangées, aucun défilement horizontal. */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 my-8" role="tablist">
          {onglets.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={onglet === o.id}
              onClick={() => setOnglet(o.id)}
              className={`relative min-h-[44px] pb-3 kicker whitespace-nowrap transition-colors ${
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
            {onglet === 'rendezvous' && <RendezVous user={user} dossier={dossier} lang={lang} />}
            {onglet === 'messages' && <Messages uid={uid} lang={lang} />}
            {onglet === 'ressources' && <Ressources lang={lang} />}
            {onglet === 'profil' && <MonProfil dossier={dossier} uid={uid} lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Assistant config={config} dossier={dossier} lang={lang} />
    </div>
  );
};

export default EspaceShell;
