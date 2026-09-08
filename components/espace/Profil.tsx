import React, { useState } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import { patchDoc } from '../../lib/firestore';
import { PROFILS } from '../../lib/dossier';
import { Dossier, Language, ProfilClient } from '../../types';
import { useTextes } from '../../lib/textes';

interface ProfilProps {
  dossier: Dossier;
  uid: string;
  lang: Language;
}

const CHAMP = 'w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris transition-colors';

const TEXTES = {
  FR: {
    titreQui: 'Qui tu es',
    titreProjet: 'Ton projet',
    nom: 'Nom complet',
    telephone: 'Téléphone',
    ville: 'Ville',
    profil: 'Ton profil',
    discipline: 'Discipline',
    disciplineHolder: 'Danse, théâtre, écriture, musique…',
    projetTitre: 'Titre du projet',
    projetDesc: 'Description',
    projetObjectif: 'Objectif',
    echeance: 'Échéance',
    enregistrer: 'Enregistrer',
    enregistrement: 'Enregistrement…',
    succes: 'Profil enregistré.',
    echec: "L'enregistrement a échoué. Réessaie dans un instant.",
  },
  EN: {
    titreQui: 'Who you are',
    titreProjet: 'Your project',
    nom: 'Full name',
    telephone: 'Phone',
    ville: 'City',
    profil: 'Your profile',
    discipline: 'Discipline',
    disciplineHolder: 'Dance, theatre, writing, music…',
    projetTitre: 'Project title',
    projetDesc: 'Description',
    projetObjectif: 'Goal',
    echeance: 'Deadline',
    enregistrer: 'Save',
    enregistrement: 'Saving…',
    succes: 'Profile saved.',
    echec: 'Saving failed. Try again in a moment.',
  },
};

const Profil: React.FC<ProfilProps> = ({ dossier, uid, lang }) => {
  const [nom, setNom] = useState(dossier.nom ?? '');
  const [telephone, setTelephone] = useState(dossier.telephone ?? '');
  const [ville, setVille] = useState(dossier.ville ?? '');
  const [profil, setProfil] = useState<ProfilClient>(dossier.profil ?? 'artiste');
  const [discipline, setDiscipline] = useState(dossier.discipline ?? '');
  const [titre, setTitre] = useState(dossier.projet?.titre ?? '');
  const [description, setDescription] = useState(dossier.projet?.description ?? '');
  const [objectif, setObjectif] = useState(dossier.projet?.objectif ?? '');
  const [echeance, setEcheance] = useState(dossier.projet?.echeance ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const t = useTextes('espaceProfil', TEXTES, lang);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      await patchDoc<Record<string, any>>('dossiers', uid, {
        nom: nom.trim(),
        telephone: telephone.trim(),
        ville: ville.trim(),
        profil,
        discipline: discipline.trim(),
        projet: { titre: titre.trim(), description: description.trim(), objectif: objectif.trim(), echeance },
        updatedAt: serverTimestamp(),
        derniereActiviteClient: serverTimestamp(),
      });
      setOk(true);
    } catch {
      setError(t.echec);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={soumettre} data-tx-scope="espaceProfil" className="grid grid-cols-1 lg:grid-cols-2 gap-x-col gap-y-10">
      <section className="border-t border-filet pt-8">
        <h2 className="font-serif text-h3 text-encre mb-6">{t.titreQui}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="pf-nom" className="block text-petit text-gris mb-1">
              {t.nom}
            </label>
            <input id="pf-nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
          </div>
          <div>
            <label htmlFor="pf-tel" className="block text-petit text-gris mb-1">
              {t.telephone}
            </label>
            <input id="pf-tel" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
          </div>
          <div>
            <label htmlFor="pf-ville" className="block text-petit text-gris mb-1">
              {t.ville}
            </label>
            <input id="pf-ville" type="text" value={ville} onChange={(e) => setVille(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
          </div>
          <div>
            <label htmlFor="pf-profil" className="block text-petit text-gris mb-1">
              {t.profil}
            </label>
            <select
              id="pf-profil"
              value={profil}
              onChange={(e) => setProfil(e.target.value as ProfilClient)}
              className={`${CHAMP} min-h-[44px]`}
            >
              {PROFILS.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'EN' ? p.nomEn : p.nom}
                </option>
              ))}
            </select>
            <p className="text-xs text-gris mt-2">
              {lang === 'EN' ? PROFILS.find((p) => p.id === profil)?.aideEn : PROFILS.find((p) => p.id === profil)?.aide}
            </p>
          </div>
          <div>
            <label htmlFor="pf-discipline" className="block text-petit text-gris mb-1">
              {t.discipline}
            </label>
            <input
              id="pf-discipline"
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder={t.disciplineHolder}
              className={`${CHAMP} min-h-[44px]`}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-filet pt-8">
        <h2 className="font-serif text-h3 text-encre mb-6">{t.titreProjet}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="pf-ptitre" className="block text-petit text-gris mb-1">
              {t.projetTitre}
            </label>
            <input id="pf-ptitre" type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
          </div>
          <div>
            <label htmlFor="pf-pdesc" className="block text-petit text-gris mb-1">
              {t.projetDesc}
            </label>
            <textarea
              id="pf-pdesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`${CHAMP} resize-none`}
            />
          </div>
          <div>
            <label htmlFor="pf-pobjectif" className="block text-petit text-gris mb-1">
              {t.projetObjectif}
            </label>
            <textarea
              id="pf-pobjectif"
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
              rows={2}
              className={`${CHAMP} resize-none`}
            />
          </div>
          <div>
            <label htmlFor="pf-echeance" className="block text-petit text-gris mb-1">
              {t.echeance}
            </label>
            <input
              id="pf-echeance"
              type="date"
              value={echeance}
              onChange={(e) => setEcheance(e.target.value)}
              className={`${CHAMP} min-h-[44px]`}
            />
          </div>
        </div>
      </section>

      <div className="lg:col-span-2 flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-2 min-h-[44px] px-6 rounded-pilule bg-bouton text-sur-bouton font-medium hover:bg-bouton-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {busy ? t.enregistrement : t.enregistrer}
        </button>
        {ok && (
          <span role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-encre">
            <CheckCircle className="w-4 h-4 text-rose" /> {t.succes}
          </span>
        )}
        {error && (
          <span role="alert" className="flex items-center gap-2 text-sm text-rose">
            <AlertCircle className="w-4 h-4" /> {error}
          </span>
        )}
      </div>
    </form>
  );
};

export default Profil;
