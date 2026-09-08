// Agenda de Laurie dans le back-office : demandes, rendez-vous confirmés, ajout manuel et disponibilités.
// Remplace l'ancien « Agenda Google ». Modèle de données et logique : lib/rendezvous.ts (ne pas modifier).
// Suit le canon v2 (components/admin/CANON-ADMIN.md).
import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, orderBy, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore';
import { Check, CheckCircle2, Download, Video, X } from 'lucide-react';
import { db } from '../firebase';
import { Bouton, Champ, Chargement, Chiffre, EnTete, Etiquette, Panneau, Selection, Vide, Zone } from '../components/admin/ui';
import { patchDoc, removeDoc, useCollection } from '../lib/firestore';
import { telecharger } from '../lib/dossier';
import { formatDate, formatHeure, icsRendezVous, nomSalle, rencontreOuverte, useAgendaConfig } from '../lib/rendezvous';
import { useTextes } from '../lib/textes';
import Rencontre from '../components/espace/Rencontre';
import Disponibilites from '../components/admin/agenda/Disponibilites';
import type { Dossier, Language, RendezVous, StatutRendezVous } from '../types';

interface AdminAgendaProps {
  lang: Language;
}

type Onglet = 'demande' | 'venir' | 'passes' | 'annule';

const TEXTES = {
  FR: {
    titre: 'Agenda',
    sous: 'Les demandes de rencontre, vos rendez-vous confirmés et vos disponibilités, au même endroit.',
    aConfirmer: 'À confirmer',
    cetteSemaine: 'Cette semaine',
    rendezVousTitre: 'Rendez-vous',
    ongletDemande: 'À confirmer',
    ongletVenir: 'À venir',
    ongletPasses: 'Passés',
    ongletAnnule: 'Annulés',
    chargement: 'Chargement…',
    videTitre: 'Aucun rendez-vous ici.',
    minutesMot: 'minutes',
    noteAdminLabel: 'Votre note',
    confirmer: 'Confirmer',
    annuler: 'Annuler',
    terminer: 'Terminé',
    rejoindre: 'Rejoindre la rencontre',
    ajouterCalendrier: 'Ajouter à mon calendrier',
    statutDemande: 'En attente de confirmation',
    statutConfirme: 'Confirmé',
    statutAnnule: 'Annulé',
    statutComplete: 'Terminé',
    ajouterTitre: 'Ajouter un rendez-vous',
    personneDossier: 'Une personne du dossier',
    personneLibre: 'Nom libre',
    personneLabel: 'Personne',
    choisir: 'Choisir…',
    nomLabel: 'Nom',
    courrielLabel: 'Courriel',
    dateLabel: 'Date',
    heureLabel: 'Heure',
    dureeLabel: 'Durée (minutes)',
    ajouter: 'Ajouter le rendez-vous',
    envoiEnCours: 'Ajout…',
    erreurChamps: 'Le nom et le courriel sont requis.',
    erreurAjout: "L'ajout a échoué. Réessayez.",
    succes: 'Rendez-vous ajouté.',
  },
  EN: {
    titre: 'Calendar',
    sous: 'Meeting requests, your confirmed appointments and your availability, in one place.',
    aConfirmer: 'To confirm',
    cetteSemaine: 'This week',
    rendezVousTitre: 'Appointments',
    ongletDemande: 'To confirm',
    ongletVenir: 'Upcoming',
    ongletPasses: 'Past',
    ongletAnnule: 'Cancelled',
    chargement: 'Loading…',
    videTitre: 'No appointments here.',
    minutesMot: 'minutes',
    noteAdminLabel: 'Your note',
    confirmer: 'Confirm',
    annuler: 'Cancel',
    terminer: 'Complete',
    rejoindre: 'Join the meeting',
    ajouterCalendrier: 'Add to my calendar',
    statutDemande: 'Awaiting confirmation',
    statutConfirme: 'Confirmed',
    statutAnnule: 'Cancelled',
    statutComplete: 'Completed',
    ajouterTitre: 'Add an appointment',
    personneDossier: 'A person from a file',
    personneLibre: 'Free-form name',
    personneLabel: 'Person',
    choisir: 'Choose…',
    nomLabel: 'Name',
    courrielLabel: 'Email',
    dateLabel: 'Date',
    heureLabel: 'Time',
    dureeLabel: 'Duration (minutes)',
    ajouter: 'Add the appointment',
    envoiEnCours: 'Adding…',
    erreurChamps: 'Name and email are required.',
    erreurAjout: 'Adding failed. Try again.',
    succes: 'Appointment added.',
  },
};

type Textes = (typeof TEXTES)['FR'];

const versMillis = (ts: any): number =>
  ts?.toMillis ? ts.toMillis() : ts?.toDate ? ts.toDate().getTime() : ts instanceof Date ? ts.getTime() : 0;

const libelleStatut = (statut: StatutRendezVous, t: Textes): string =>
  ({ demande: t.statutDemande, confirme: t.statutConfirme, annule: t.statutAnnule, complete: t.statutComplete }[statut]);

const LigneRendezVous: React.FC<{
  rdv: RendezVous;
  lang: Language;
  t: Textes;
  maintenant: Date;
  onRejoindre: () => void;
}> = ({ rdv, lang, t, maintenant, onRejoindre }) => {
  const [note, setNote] = useState(rdv.noteAdmin ?? '');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => setNote(rdv.noteAdmin ?? ''), [rdv.noteAdmin]);

  const agir = async (cle: string, data: Record<string, any>) => {
    setBusy(cle);
    try {
      await patchDoc<Record<string, any>>('rendezvous', rdv.id, { ...data, updatedAt: serverTimestamp() });
      if (cle === 'annuler') await removeDoc('occupations', rdv.id);
    } finally {
      setBusy(null);
    }
  };

  const enregistrerNote = () => {
    if (note === (rdv.noteAdmin ?? '')) return;
    agir('note', { noteAdmin: note });
  };

  const rejoignable = rencontreOuverte(rdv, maintenant);
  const peutAnnuler = rdv.statut === 'demande' || rdv.statut === 'confirme';

  return (
    <li className="border border-filet rounded-champ p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans font-semibold text-encre">{rdv.nom}</p>
          <a href={`mailto:${rdv.courriel}`} className="text-rose text-sm hover:underline break-all">
            {rdv.courriel}
          </a>
          <p className="text-gris text-sm mt-1">
            {formatDate(rdv.debut, lang)} · {formatHeure(rdv.debut, lang)} · {rdv.duree} {t.minutesMot}
          </p>
        </div>
        <Etiquette tone={rdv.statut === 'confirme' ? 'accent' : 'neutre'} className="flex-shrink-0">
          {libelleStatut(rdv.statut, t)}
        </Etiquette>
      </div>

      {rdv.note && <p className="text-encre text-sm mesure whitespace-pre-line">{rdv.note}</p>}

      <Zone
        id={`note-admin-${rdv.id}`}
        label={t.noteAdminLabel}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={enregistrerNote}
      />

      <div className="flex flex-wrap items-center gap-2">
        {rejoignable && (
          <Bouton icone={Video} onClick={onRejoindre}>
            {t.rejoindre}
          </Bouton>
        )}
        {rdv.statut === 'demande' && (
          <Bouton variante="secondaire" icone={Check} onClick={() => agir('confirmer', { statut: 'confirme' })} disabled={busy === 'confirmer'}>
            {t.confirmer}
          </Bouton>
        )}
        {rdv.statut === 'confirme' && (
          <Bouton
            variante="secondaire"
            icone={CheckCircle2}
            onClick={() => agir('terminer', { statut: 'complete' })}
            disabled={busy === 'terminer'}
          >
            {t.terminer}
          </Bouton>
        )}
        {peutAnnuler && (
          <Bouton variante="danger" icone={X} onClick={() => agir('annuler', { statut: 'annule' })} disabled={busy === 'annuler'}>
            {t.annuler}
          </Bouton>
        )}
        {rdv.statut !== 'annule' && (
          <Bouton
            variante="discret"
            icone={Download}
            onClick={() => telecharger('rendez-vous.ics', icsRendezVous(rdv), 'text/calendar')}
          >
            {t.ajouterCalendrier}
          </Bouton>
        )}
      </div>
    </li>
  );
};

const FormulaireAjout: React.FC<{ lang: Language; t: Textes; dossiers: Dossier[]; dureeParDefaut: number }> = ({
  t,
  dossiers,
  dureeParDefaut,
}) => {
  const [mode, setMode] = useState<'dossier' | 'libre'>('dossier');
  const [uidChoisi, setUidChoisi] = useState('');
  const [nomLibre, setNomLibre] = useState('');
  const [courrielLibre, setCourrielLibre] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [duree, setDuree] = useState(dureeParDefaut);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  useEffect(() => setDuree(dureeParDefaut), [dureeParDefaut]);

  const dossierChoisi = dossiers.find((d) => d.id === uidChoisi);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !heure || enCours) return;
    const nom = mode === 'dossier' ? dossierChoisi?.nom ?? '' : nomLibre.trim();
    const courriel = mode === 'dossier' ? dossierChoisi?.courriel ?? '' : courrielLibre.trim();
    if (!nom || !courriel) {
      setErreur(t.erreurChamps);
      return;
    }
    setEnCours(true);
    setErreur(null);
    setSucces(false);
    try {
      const debut = new Date(`${date}T${heure}:00`);
      const fin = new Date(debut.getTime() + duree * 60000);
      const ref = doc(collection(db, 'rendezvous'));
      const uid = mode === 'dossier' && dossierChoisi ? dossierChoisi.uid : `admin-${ref.id}`;
      const debutTs = Timestamp.fromDate(debut);
      const finTs = Timestamp.fromDate(fin);
      const batch = writeBatch(db);
      batch.set(ref, {
        uid,
        nom,
        courriel,
        debut: debutTs,
        fin: finTs,
        duree,
        statut: 'confirme',
        salle: nomSalle(ref.id),
        creePar: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      batch.set(doc(db, 'occupations', ref.id), { debut: debutTs, fin: finTs });
      await batch.commit();
      setDate('');
      setHeure('');
      setNomLibre('');
      setCourrielLibre('');
      setUidChoisi('');
      setSucces(true);
    } catch {
      setErreur(t.erreurAjout);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <form onSubmit={soumettre} className="space-y-4">
      <div className="flex rounded-champ border border-filet overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => setMode('dossier')}
          className={`px-4 min-h-[44px] text-sm font-medium ${mode === 'dossier' ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}
        >
          {t.personneDossier}
        </button>
        <button
          type="button"
          onClick={() => setMode('libre')}
          className={`px-4 min-h-[44px] text-sm font-medium ${mode === 'libre' ? 'bg-bouton text-sur-bouton' : 'text-gris hover:text-encre'}`}
        >
          {t.personneLibre}
        </button>
      </div>

      {mode === 'dossier' ? (
        <Selection label={t.personneLabel} value={uidChoisi} onChange={(e) => setUidChoisi(e.target.value)} required>
          <option value="">{t.choisir}</option>
          {dossiers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nom || d.courriel}
            </option>
          ))}
        </Selection>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label={t.nomLabel} value={nomLibre} onChange={(e) => setNomLibre(e.target.value)} required />
          <Champ label={t.courrielLabel} type="email" value={courrielLibre} onChange={(e) => setCourrielLibre(e.target.value)} required />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Champ label={t.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Champ label={t.heureLabel} type="time" value={heure} onChange={(e) => setHeure(e.target.value)} required />
        <Champ
          label={t.dureeLabel}
          type="number"
          min={5}
          step={5}
          value={duree}
          onChange={(e) => setDuree(Number(e.target.value))}
        />
      </div>

      {erreur && <p className="text-rose text-sm">{erreur}</p>}
      {succes && <p className="text-rose text-sm">{t.succes}</p>}

      <Bouton type="submit" disabled={enCours}>
        {enCours ? t.envoiEnCours : t.ajouter}
      </Bouton>
    </form>
  );
};

const AdminAgenda: React.FC<AdminAgendaProps> = ({ lang }) => {
  const t = useTextes('adminAgenda', TEXTES, lang);
  const config = useAgendaConfig();
  const { data: rdvs, loading } = useCollection<RendezVous>('rendezvous', [orderBy('debut', 'asc')]);
  const { data: dossiers } = useCollection<Dossier>('dossiers');

  const [onglet, setOnglet] = useState<Onglet>('demande');
  const [salleActive, setSalleActive] = useState<{ salle: string; nom: string } | null>(null);

  const [maintenant, setMaintenant] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setMaintenant(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  const dossiersActifs = useMemo(() => dossiers.filter((d) => !d.archive), [dossiers]);

  const aConfirmerListe = useMemo(() => rdvs.filter((r) => r.statut === 'demande'), [rdvs]);
  const cetteSemaine = useMemo(() => {
    const dansSeptJours = maintenant.getTime() + 7 * 86400000;
    return rdvs.filter((r) => r.statut === 'confirme' && versMillis(r.debut) >= maintenant.getTime() && versMillis(r.debut) <= dansSeptJours)
      .length;
  }, [rdvs, maintenant]);

  const listeOnglet = useMemo(() => {
    switch (onglet) {
      case 'demande':
        return aConfirmerListe;
      case 'annule':
        return rdvs.filter((r) => r.statut === 'annule');
      case 'passes':
        return rdvs.filter((r) => r.statut === 'complete' || (r.statut === 'confirme' && versMillis(r.fin) < maintenant.getTime()));
      case 'venir':
      default:
        return rdvs.filter((r) => r.statut === 'confirme' && versMillis(r.fin) >= maintenant.getTime());
    }
  }, [rdvs, onglet, aConfirmerListe, maintenant]);

  const ONGLETS: { id: Onglet; libelle: string }[] = [
    { id: 'demande', libelle: t.ongletDemande },
    { id: 'venir', libelle: t.ongletVenir },
    { id: 'passes', libelle: t.ongletPasses },
    { id: 'annule', libelle: t.ongletAnnule },
  ];

  return (
    <div data-tx-scope="adminAgenda" className="w-full px-6 md:px-10 py-10 space-y-8">
      <EnTete kicker="Agenda" titre={t.titre} lede={t.sous} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panneau>
          <Chiffre valeur={aConfirmerListe.length} libelle={t.aConfirmer} />
        </Panneau>
        <Panneau>
          <Chiffre valeur={cetteSemaine} libelle={t.cetteSemaine} />
        </Panneau>
      </div>

      <Panneau titre={t.rendezVousTitre}>
        {salleActive && (
          <div className="mb-6">
            <Rencontre salle={salleActive.salle} nom={salleActive.nom} lang={lang} onQuitter={() => setSalleActive(null)} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-b border-filet pb-2 mb-6">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnglet(o.id)}
              className={`min-h-[44px] px-4 rounded-champ text-sm font-medium flex items-center gap-2 flex-shrink-0 ${
                onglet === o.id ? 'bg-papier text-encre' : 'text-gris hover:text-encre'
              }`}
            >
              {o.libelle}
              {o.id === 'demande' && aConfirmerListe.length > 0 && <Etiquette tone="accent">{aConfirmerListe.length}</Etiquette>}
            </button>
          ))}
        </div>

        {loading ? (
          <Chargement texte={t.chargement} />
        ) : listeOnglet.length === 0 ? (
          <Vide titre={t.videTitre} />
        ) : (
          <ul className="space-y-4">
            {listeOnglet.map((rdv) => (
              <LigneRendezVous
                key={rdv.id}
                rdv={rdv}
                lang={lang}
                t={t}
                maintenant={maintenant}
                onRejoindre={() => setSalleActive({ salle: rdv.salle, nom: 'Laurie Belhumeur' })}
              />
            ))}
          </ul>
        )}
      </Panneau>

      <Panneau titre={t.ajouterTitre}>
        <FormulaireAjout lang={lang} t={t} dossiers={dossiersActifs} dureeParDefaut={config.duree} />
      </Panneau>

      <Disponibilites lang={lang} />
    </div>
  );
};

export default AdminAgenda;
