import React, { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { collection, doc, orderBy, where, writeBatch } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { AlertCircle, ChevronLeft, ChevronRight, Download, Video } from 'lucide-react';
import { db } from '../../firebase';
import { patchDoc, removeDoc, useCollection } from '../../lib/firestore';
import { telecharger } from '../../lib/dossier';
import {
  cleJour,
  creneauxLibres,
  type Creneau,
  formatDate,
  formatHeure,
  icsRendezVous,
  joursDisponibles,
  nouveauRendezVous,
  rencontreOuverte,
  useAgendaConfig,
} from '../../lib/rendezvous';
import { useTextes } from '../../lib/textes';
import { Dossier, Language, Occupation, RendezVous as RendezVousDoc, StatutRendezVous } from '../../types';
import Rencontre from './Rencontre';

interface RendezVousProps {
  user: User;
  dossier: Dossier;
  lang: Language;
}

const TEXTES = {
  FR: {
    titre: 'Rendez-vous',
    sous: 'Choisis un moment qui te convient pour une rencontre vidéo avec Laurie.',
    decouverte: 'Une première rencontre vidéo de {n} minutes pour voir si nous sommes faites pour travailler ensemble.',
    semaineAbrev: 'Lun,Mar,Mer,Jeu,Ven,Sam,Dim',
    moisPrecedent: 'Mois précédent',
    moisSuivant: 'Mois suivant',
    aucunCreneauMois: 'Aucun créneau ce mois-ci.',
    creneauxTitre: 'Créneaux disponibles',
    dureeMot: 'minutes',
    noteLabel: 'Ce que tu veux aborder',
    demander: 'Demander ce moment',
    envoiEnCours: 'Envoi…',
    erreurDemande: "La demande a échoué. Réessaie dans un instant.",
    tesRendezVous: 'Tes rendez-vous',
    videTitre: "Tu n'as pas encore de rendez-vous.",
    chargement: 'Chargement de tes rendez-vous…',
    statutDemande: 'En attente de confirmation',
    statutConfirme: 'Confirmé',
    statutAnnule: 'Annulé',
    statutComplete: 'Terminé',
    ajouterCalendrier: 'Ajouter à mon calendrier',
    annuler: 'Annuler',
    annulerConfirmer: "Confirmer l'annulation",
    annulerNon: 'Garder le rendez-vous',
    annulerEnCours: 'Annulation…',
    erreurAnnulation: "L'annulation a échoué. Réessaie dans un instant.",
    rejoindre: 'Rejoindre la rencontre',
  },
  EN: {
    titre: 'Appointments',
    sous: 'Pick a time that works for a video meeting with Laurie.',
    decouverte: 'A first {n}-minute video meeting to see if we are a good fit to work together.',
    semaineAbrev: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    moisPrecedent: 'Previous month',
    moisSuivant: 'Next month',
    aucunCreneauMois: 'No slots this month.',
    creneauxTitre: 'Available times',
    dureeMot: 'minutes',
    noteLabel: 'What you want to cover',
    demander: 'Request this time',
    envoiEnCours: 'Sending…',
    erreurDemande: 'The request failed. Try again in a moment.',
    tesRendezVous: 'Your appointments',
    videTitre: "You don't have any appointments yet.",
    chargement: 'Loading your appointments…',
    statutDemande: 'Awaiting confirmation',
    statutConfirme: 'Confirmed',
    statutAnnule: 'Cancelled',
    statutComplete: 'Completed',
    ajouterCalendrier: 'Add to my calendar',
    annuler: 'Cancel',
    annulerConfirmer: 'Confirm cancellation',
    annulerNon: 'Keep the appointment',
    annulerEnCours: 'Cancelling…',
    erreurAnnulation: 'Cancelling failed. Try again in a moment.',
    rejoindre: 'Join the meeting',
  },
};

const libelleStatut = (statut: StatutRendezVous, t: (typeof TEXTES)['FR']): string =>
  ({ demande: t.statutDemande, confirme: t.statutConfirme, annule: t.statutAnnule, complete: t.statutComplete }[statut]);

const RendezVous: React.FC<RendezVousProps> = ({ user, dossier, lang }) => {
  const t = useTextes('espaceRendezVous', TEXTES, lang);
  const config = useAgendaConfig();
  const { data: occupations } = useCollection<Occupation>('occupations');
  const { data: mesRendezVous, loading: chargementRdv } = useCollection<RendezVousDoc>('rendezvous', [
    where('uid', '==', user.uid),
    orderBy('debut', 'asc'),
  ]);

  const [maintenant, setMaintenant] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setMaintenant(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  const [moisAffiche, setMoisAffiche] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [jourChoisi, setJourChoisi] = useState<Date | null>(null);
  const [creneauChoisi, setCreneauChoisi] = useState<Creneau | null>(null);
  const [note, setNote] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurDemande, setErreurDemande] = useState<string | null>(null);

  const [annulationArmee, setAnnulationArmee] = useState<string | null>(null);
  const [annulationEnCours, setAnnulationEnCours] = useState<string | null>(null);
  const [erreurAnnulation, setErreurAnnulation] = useState<string | null>(null);

  const [salleActive, setSalleActive] = useState<{ salle: string; nom: string } | null>(null);

  const nomPersonne = dossier.nom || user.displayName || '';
  const courrielPersonne = dossier.courriel || user.email || '';

  const joursLibres = useMemo(() => new Set(joursDisponibles(config, occupations, maintenant)), [config, occupations, maintenant]);

  const semaine = useMemo(() => {
    const premier = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth(), 1);
    const dernier = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + 1, 0);
    const decalage = (premier.getDay() + 6) % 7; // lundi en tête
    const cellules: (Date | null)[] = [];
    for (let i = 0; i < decalage; i++) cellules.push(null);
    for (let jour = 1; jour <= dernier.getDate(); jour++) {
      cellules.push(new Date(moisAffiche.getFullYear(), moisAffiche.getMonth(), jour));
    }
    return cellules;
  }, [moisAffiche]);

  const auMoinsUnJourDispoDansMois = semaine.some((j) => j && joursLibres.has(cleJour(j)));

  const creneauxDuJour = useMemo(
    () => (jourChoisi ? creneauxLibres(config, jourChoisi, occupations, maintenant) : []),
    [config, jourChoisi, occupations, maintenant]
  );

  const clePassee = cleJour(maintenant);
  const nomMois = moisAffiche.toLocaleDateString(lang === 'FR' ? 'fr-CA' : 'en-CA', { month: 'long', year: 'numeric' });
  const premierMoisPossible = maintenant.getFullYear() === moisAffiche.getFullYear() && maintenant.getMonth() === moisAffiche.getMonth();

  const demander = async () => {
    if (!creneauChoisi || envoiEnCours) return;
    setEnvoiEnCours(true);
    setErreurDemande(null);
    try {
      const ref = doc(collection(db, 'rendezvous'));
      const { rdv, occupation } = nouveauRendezVous(ref.id, user.uid, nomPersonne, courrielPersonne, creneauChoisi, config.duree, note);
      const batch = writeBatch(db);
      batch.set(ref, rdv);
      batch.set(doc(db, 'occupations', ref.id), occupation);
      await batch.commit();
      setJourChoisi(null);
      setCreneauChoisi(null);
      setNote('');
    } catch {
      setErreurDemande(t.erreurDemande);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const annuler = async (id: string) => {
    setAnnulationEnCours(id);
    setErreurAnnulation(null);
    try {
      await patchDoc<Record<string, any>>('rendezvous', id, { statut: 'annule', updatedAt: serverTimestamp() });
      await removeDoc('occupations', id);
      setAnnulationArmee(null);
    } catch {
      setErreurAnnulation(t.erreurAnnulation);
    } finally {
      setAnnulationEnCours(null);
    }
  };

  return (
    <section data-tx-scope="espaceRendezVous" className="border-t border-filet pt-8 space-y-10">
      <div>
        <h2 className="font-serif text-h3 text-encre">{t.titre}</h2>
        <p className="text-gris text-sm mt-1 mesure">{t.sous}</p>
      </div>

      {mesRendezVous.length === 0 && !chargementRdv && (
        <p className="text-sm text-encre bg-rose/10 rounded-champ px-4 py-3 mesure">
          {t.decouverte.replace('{n}', String(config.duree))}
        </p>
      )}

      {salleActive ? (
        <Rencontre salle={salleActive.salle} nom={salleActive.nom} lang={lang} onQuitter={() => setSalleActive(null)} />
      ) : (
        <>
          {/* Calendrier */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setMoisAffiche(new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() - 1, 1))}
                disabled={premierMoisPossible}
                aria-label={t.moisPrecedent}
                className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <p className="font-sans font-semibold text-encre capitalize">{nomMois}</p>
              <button
                type="button"
                onClick={() => setMoisAffiche(new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + 1, 1))}
                aria-label={t.moisSuivant}
                className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre transition-colors"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {t.semaineAbrev.split(',').map((j) => (
                <p key={j} className="kicker text-gris text-center py-1">
                  {j}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {semaine.map((jour, i) => {
                if (!jour) return <div key={`vide-${i}`} />;
                const cle = cleJour(jour);
                const passe = cle < clePassee;
                const dispo = joursLibres.has(cle);
                const choisi = jourChoisi ? cleJour(jourChoisi) === cle : false;
                return (
                  <button
                    key={cle}
                    type="button"
                    disabled={passe || !dispo}
                    aria-pressed={choisi}
                    onClick={() => {
                      setJourChoisi(jour);
                      setCreneauChoisi(null);
                    }}
                    className={`min-h-[44px] rounded-champ text-sm font-medium transition-colors ${
                      passe || !dispo
                        ? 'text-gris/40 cursor-default'
                        : choisi
                        ? 'bg-bouton text-sur-bouton'
                        : 'bg-rose/10 text-encre hover:bg-rose/20'
                    }`}
                  >
                    {jour.getDate()}
                  </button>
                );
              })}
            </div>

            {!auMoinsUnJourDispoDansMois && <p className="text-gris text-sm mt-4">{t.aucunCreneauMois}</p>}

            {jourChoisi && creneauxDuJour.length > 0 && (
              <div className="mt-6">
                <p className="kicker text-gris mb-3">{t.creneauxTitre}</p>
                <div className="flex flex-wrap gap-2">
                  {creneauxDuJour.map((c) => {
                    const choisi = creneauChoisi && creneauChoisi.debut.getTime() === c.debut.getTime();
                    return (
                      <button
                        key={c.debut.toISOString()}
                        type="button"
                        onClick={() => setCreneauChoisi(c)}
                        aria-pressed={!!choisi}
                        className={`min-h-[44px] px-4 rounded-pilule text-sm font-medium border transition-colors ${
                          choisi ? 'bg-bouton text-sur-bouton border-bouton' : 'border-filet text-encre hover:border-rose'
                        }`}
                      >
                        {formatHeure(c.debut, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {creneauChoisi && (
              <div className="mt-6 bg-papier-2 border border-filet rounded-champ p-5 md:p-6 space-y-4">
                <div>
                  <p className="font-sans font-semibold text-encre">{formatDate(creneauChoisi.debut, lang)}</p>
                  <p className="text-gris text-sm mt-1">
                    {formatHeure(creneauChoisi.debut, lang)} · {config.duree} {t.dureeMot}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="rdv-note" className="text-petit font-semibold text-encre">
                    {t.noteLabel}
                  </label>
                  <textarea
                    id="rdv-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 1000))}
                    maxLength={1000}
                    className="w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose min-h-[7rem] resize-y"
                  />
                </div>
                {erreurDemande && (
                  <div role="alert" className="flex items-center gap-2 text-sm text-rose">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" /> {erreurDemande}
                  </div>
                )}
                <button
                  type="button"
                  onClick={demander}
                  disabled={envoiEnCours}
                  className="min-h-[44px] px-5 rounded-pilule bg-bouton text-sur-bouton hover:bg-bouton-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {envoiEnCours ? t.envoiEnCours : t.demander}
                </button>
              </div>
            )}
          </div>

          {/* Liste des rendez-vous */}
          <div>
            <p className="kicker text-gris mb-4">{t.tesRendezVous}</p>
            {chargementRdv ? (
              <div className="py-10 flex justify-center" role="status" aria-live="polite">
                <span className="w-6 h-6 rounded-pilule border-2 border-filet border-t-rose animate-spin" />
              </div>
            ) : mesRendezVous.length === 0 ? (
              <p className="text-gris text-sm py-6">{t.videTitre}</p>
            ) : (
              <ul className="space-y-3">
                {mesRendezVous.map((rdv) => {
                  const peutAnnuler = rdv.statut === 'demande' || rdv.statut === 'confirme';
                  const arme = annulationArmee === rdv.id;
                  const enCours = annulationEnCours === rdv.id;
                  const rejoindre = rencontreOuverte(rdv, maintenant);
                  return (
                    <li key={rdv.id} className="border border-filet rounded-champ p-4 md:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-sans font-semibold text-encre">{formatDate(rdv.debut, lang)}</p>
                          <p className="text-gris text-sm mt-0.5">{formatHeure(rdv.debut, lang)}</p>
                          {rdv.note && <p className="text-encre text-sm mt-2 mesure whitespace-pre-line">{rdv.note}</p>}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-pilule px-2.5 py-0.5 text-xs font-medium flex-shrink-0 ${
                            rdv.statut === 'confirme' ? 'bg-rose/10 text-rose' : 'border border-filet text-gris'
                          }`}
                        >
                          {libelleStatut(rdv.statut, t)}
                        </span>
                      </div>

                      {arme && erreurAnnulation && (
                        <div role="alert" className="flex items-center gap-2 text-sm text-rose mt-3">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" /> {erreurAnnulation}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        {rejoindre && (
                          <button
                            type="button"
                            onClick={() => setSalleActive({ salle: rdv.salle, nom: nomPersonne })}
                            className="min-h-[44px] inline-flex items-center gap-2 px-5 rounded-pilule bg-bouton text-sur-bouton hover:bg-bouton-2 text-sm font-medium transition-colors"
                          >
                            <Video className="w-4 h-4" aria-hidden="true" /> {t.rejoindre}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => telecharger('rendez-vous.ics', icsRendezVous(rdv), 'text/calendar')}
                          className="min-h-[44px] inline-flex items-center gap-2 px-5 rounded-pilule border border-filet text-encre hover:border-encre text-sm font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" aria-hidden="true" /> {t.ajouterCalendrier}
                        </button>
                        {peutAnnuler && !arme && (
                          <button
                            type="button"
                            onClick={() => setAnnulationArmee(rdv.id)}
                            className="min-h-[44px] px-5 rounded-pilule text-gris hover:text-rose text-sm font-medium transition-colors"
                          >
                            {t.annuler}
                          </button>
                        )}
                        {peutAnnuler && arme && (
                          <>
                            <button
                              type="button"
                              onClick={() => annuler(rdv.id)}
                              disabled={enCours}
                              className="min-h-[44px] px-5 rounded-pilule border border-rose/30 text-rose hover:border-rose text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {enCours ? t.annulerEnCours : t.annulerConfirmer}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAnnulationArmee(null)}
                              disabled={enCours}
                              className="min-h-[44px] px-5 rounded-pilule text-gris hover:text-encre text-sm font-medium transition-colors"
                            >
                              {t.annulerNon}
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default RendezVous;
