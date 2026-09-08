// Panneau « Google Agenda » du back-office Agenda (voir pages/AdminAgenda.tsx). Parle à
// functions/src/agenda/google.ts (agendaGoogleConnecter, agendaGoogleEtat, agendaGoogleDeconnecter) :
// tant que le projet reste sur Spark, ces fonctions ne sont pas déployées, et le panneau le dit
// calmement plutôt que d'afficher une erreur technique. Suit le canon v2 (components/admin/CANON-ADMIN.md).
import React, { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Calendar, Check, Unlink } from 'lucide-react';
import { app } from '../../../firebase';
import { Bouton, Panneau, Selection } from '../ui';
import { useTextes } from '../../../lib/textes';
import { formatDate, formatHeure } from '../../../lib/rendezvous';
import type { Language } from '../../../types';

interface Props {
  lang: Language;
}

const REGION = 'northamerica-northeast1';

interface CalendrierOption {
  id: string;
  nom: string;
}

interface EtatConnexion {
  connecte: boolean;
  email?: string;
  calendrierId?: string;
  derniereSync?: number | null;
  calendriers?: CalendrierOption[];
}

const TEXTES = {
  FR: {
    titre: 'Google Agenda',
    indisponible: "La synchronisation avec Google Agenda sera activée par Vexel; en attendant, vos rendez-vous confirmés restent ici et dans le fichier iCal.",
    deconnecteSous: 'Connectez votre Google Agenda : vos rendez-vous confirmés y apparaissent, et vos disponibilités déjà prises chez Google bloquent les nouveaux créneaux sur votre site.',
    connecterBouton: 'Connecter mon Google Agenda',
    connecteA: 'Connecté à',
    derniereSyncLabel: 'Dernière synchronisation',
    jamaisSynchro: 'Pas encore synchronisé',
    calendrierLabel: 'Calendrier cible',
    deconnecterBouton: 'Déconnecter',
    connexionEnCours: 'Redirection…',
    deconnexionEnCours: 'Déconnexion…',
  },
  EN: {
    titre: 'Google Calendar',
    indisponible: 'Google Calendar sync will be activated by Vexel; in the meantime, your confirmed appointments stay here and in the iCal file.',
    deconnecteSous: 'Connect your Google Calendar: your confirmed appointments appear there, and time already taken in Google blocks new slots on your site.',
    connecterBouton: 'Connect my Google Calendar',
    connecteA: 'Connected to',
    derniereSyncLabel: 'Last sync',
    jamaisSynchro: 'Not synced yet',
    calendrierLabel: 'Target calendar',
    deconnecterBouton: 'Disconnect',
    connexionEnCours: 'Redirecting…',
    deconnexionEnCours: 'Disconnecting…',
  },
};

// États de démonstration pour la capture d'écran, actifs seulement en build --mode verif : le panneau
// n'appelle jamais de fonction distante dans ce mode-là, il rend l'état demandé par l'adresse.
const etatDemo = (): EtatConnexion | 'indisponible' | null => {
  if (import.meta.env.MODE !== 'verif') return null;
  const valeur = new URLSearchParams(window.location.search).get('etatDemo');
  if (valeur === 'connecte') {
    return { connecte: true, email: 'laurie.belhumeur@gmail.com', calendrierId: 'primary', derniereSync: Date.now() - 12 * 60000, calendriers: [{ id: 'primary', nom: 'Laurie Belhumeur' }, { id: 'travail', nom: 'Xena Horizon' }] };
  }
  if (valeur === 'deconnecte') return { connecte: false };
  if (valeur === 'indisponible') return 'indisponible';
  return null;
};

const GoogleAgenda: React.FC<Props> = ({ lang }) => {
  const t = useTextes('adminAgendaGoogle', TEXTES, lang);
  const [etat, setEtat] = useState<EtatConnexion | 'chargement' | 'indisponible'>('chargement');
  const [busy, setBusy] = useState<'connecter' | 'deconnecter' | null>(null);

  const rafraichir = async (calendrierId?: string) => {
    const demo = etatDemo();
    if (demo) {
      setEtat(demo === 'indisponible' ? 'indisponible' : demo);
      return;
    }
    try {
      const appel = httpsCallable(getFunctions(app, REGION), 'agendaGoogleEtat');
      const res: any = await appel(calendrierId ? { calendrierId } : {});
      setEtat(res.data as EtatConnexion);
    } catch (e) {
      setEtat(fonctionAbsente(e) ? 'indisponible' : 'indisponible');
    }
  };

  useEffect(() => {
    // La fonction de retour redirige vers ?google=ok ou ?google=erreur : on efface l'adresse une fois lue,
    // le résultat réel vient de toute façon de l'état rechargé juste après.
    const params = new URLSearchParams(window.location.search);
    if (params.has('google')) window.history.replaceState({}, '', window.location.pathname);
    rafraichir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connecter = async () => {
    setBusy('connecter');
    try {
      const appel = httpsCallable(getFunctions(app, REGION), 'agendaGoogleConnecter');
      const res: any = await appel({});
      const url = res.data?.url;
      if (url) window.location.href = url;
    } catch {
      setEtat('indisponible');
    } finally {
      setBusy(null);
    }
  };

  const deconnecter = async () => {
    setBusy('deconnecter');
    try {
      const appel = httpsCallable(getFunctions(app, REGION), 'agendaGoogleDeconnecter');
      await appel({});
      await rafraichir();
    } catch {
      setEtat('indisponible');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div data-tx-scope="adminAgendaGoogle">
      <Panneau titre={t.titre}>
        {etat === 'chargement' ? (
          <p className="text-gris text-sm">…</p>
        ) : etat === 'indisponible' ? (
          <p className="text-gris text-sm mesure">{t.indisponible}</p>
        ) : etat.connecte ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-encre">
              <Check className="w-4 h-4 text-rose flex-shrink-0" aria-hidden="true" />
              <span>
                {t.connecteA} <span className="font-semibold">{etat.email}</span>
              </span>
            </div>
            <p className="text-gris text-sm">
              {t.derniereSyncLabel} :{' '}
              {etat.derniereSync ? `${formatDate(new Date(etat.derniereSync), lang)} · ${formatHeure(new Date(etat.derniereSync), lang)}` : t.jamaisSynchro}
            </p>
            {(etat.calendriers?.length ?? 0) > 1 && (
              <Selection
                label={t.calendrierLabel}
                value={etat.calendrierId}
                onChange={(e) => rafraichir(e.target.value)}
                className="max-w-sm"
              >
                {etat.calendriers!.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </Selection>
            )}
            <Bouton variante="danger" icone={Unlink} onClick={deconnecter} disabled={busy === 'deconnecter'}>
              {busy === 'deconnecter' ? t.deconnexionEnCours : t.deconnecterBouton}
            </Bouton>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gris text-sm mesure">{t.deconnecteSous}</p>
            <Bouton icone={Calendar} onClick={connecter} disabled={busy === 'connecter'}>
              {busy === 'connecter' ? t.connexionEnCours : t.connecterBouton}
            </Bouton>
          </div>
        )}
      </Panneau>
    </div>
  );
};

export default GoogleAgenda;
