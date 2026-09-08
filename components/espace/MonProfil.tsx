import React, { useRef, useState } from 'react';
import { deleteField, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import { auth } from '../../firebase';
import { deleteFile, patchDoc, uploadFile } from '../../lib/firestore';
import { PROFILS } from '../../lib/dossier';
import { Dossier, Language, ProfilClient } from '../../types';
import { useTextes } from '../../lib/textes';
import Avatar from './Avatar';

interface MonProfilProps {
  dossier: Dossier;
  uid: string;
  lang: Language;
}

const CHAMP = 'w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris transition-colors';
const TAILLE_MAX_IMAGE = 5 * 1024 * 1024;

type Liens = { site: string; instagram: string; facebook: string; autre: string };

/** Redimensionne une image côté client (le plus grand côté ramené à maxDim), en JPEG. */
async function redimensionnerImage(file: File, maxDim: number, qualite = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const largeur = Math.round(bitmap.width * ratio);
  const hauteur = Math.round(bitmap.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = largeur;
  canvas.height = hauteur;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas indisponible');
  ctx.drawImage(bitmap, 0, 0, largeur, hauteur);
  bitmap.close?.();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('redimensionnement échoué'))), 'image/jpeg', qualite);
  });
}

const TEXTES = {
  FR: {
    titrePhotos: 'Ta photo et ta bannière',
    banniereLabel: 'Bannière',
    photoLabel: 'Photo de profil',
    changer: 'Changer',
    retirer: 'Retirer',
    titreQui: 'Qui tu es',
    nom: 'Nom complet',
    telephone: 'Téléphone',
    ville: 'Ville',
    profilLabel: 'Ton profil',
    discipline: 'Discipline',
    disciplineHolder: 'Danse, théâtre, écriture, musique…',
    bio: 'Présentation courte',
    bioHolder: 'Quelques phrases sur toi et ton travail.',
    titreLiens: 'Tes liens',
    lienSite: 'Site web',
    lienInstagram: 'Instagram',
    lienFacebook: 'Facebook',
    lienAutre: 'Autre lien',
    titreProjet: 'Ton projet',
    projetTitre: 'Titre du projet',
    projetDesc: 'Description',
    projetObjectif: 'Objectif',
    echeance: 'Échéance',
    enregistrer: 'Enregistrer',
    enregistrement: 'Enregistrement…',
    succes: 'Profil enregistré.',
    echec: "L'enregistrement a échoué. Réessaie dans un instant.",
    erreurType: 'Choisis une image (JPG, PNG ou WebP).',
    erreurTaille: 'Image trop lourde. La limite est de 5 Mo.',
    erreurEnvoi: "L'envoi de l'image a échoué. Réessaie dans un instant.",
    erreurLien: 'Un lien doit commencer par https://.',
  },
  EN: {
    titrePhotos: 'Your photo and banner',
    banniereLabel: 'Banner',
    photoLabel: 'Profile photo',
    changer: 'Change',
    retirer: 'Remove',
    titreQui: 'Who you are',
    nom: 'Full name',
    telephone: 'Phone',
    ville: 'City',
    profilLabel: 'Your profile',
    discipline: 'Discipline',
    disciplineHolder: 'Dance, theatre, writing, music…',
    bio: 'Short bio',
    bioHolder: 'A few sentences about you and your work.',
    titreLiens: 'Your links',
    lienSite: 'Website',
    lienInstagram: 'Instagram',
    lienFacebook: 'Facebook',
    lienAutre: 'Other link',
    titreProjet: 'Your project',
    projetTitre: 'Project title',
    projetDesc: 'Description',
    projetObjectif: 'Goal',
    echeance: 'Deadline',
    enregistrer: 'Save',
    enregistrement: 'Saving…',
    succes: 'Profile saved.',
    echec: 'Saving failed. Try again in a moment.',
    erreurType: 'Choose an image (JPG, PNG or WebP).',
    erreurTaille: 'Image too large. The limit is 5 MB.',
    erreurEnvoi: 'Uploading the image failed. Try again in a moment.',
    erreurLien: 'A link must start with https://.',
  },
};

const MonProfil: React.FC<MonProfilProps> = ({ dossier, uid, lang }) => {
  const [nom, setNom] = useState(dossier.nom ?? '');
  const [telephone, setTelephone] = useState(dossier.telephone ?? '');
  const [ville, setVille] = useState(dossier.ville ?? '');
  const [profil, setProfil] = useState<ProfilClient>(dossier.profil ?? 'artiste');
  const [discipline, setDiscipline] = useState(dossier.discipline ?? '');
  const [bio, setBio] = useState(dossier.bio ?? '');
  const [liens, setLiens] = useState<Liens>({
    site: dossier.liens?.site ?? '',
    instagram: dossier.liens?.instagram ?? '',
    facebook: dossier.liens?.facebook ?? '',
    autre: dossier.liens?.autre ?? '',
  });
  const [titre, setTitre] = useState(dossier.projet?.titre ?? '');
  const [description, setDescription] = useState(dossier.projet?.description ?? '');
  const [objectif, setObjectif] = useState(dossier.projet?.objectif ?? '');
  const [echeance, setEcheance] = useState(dossier.projet?.echeance ?? '');

  const [photoURL, setPhotoURL] = useState(dossier.photoURL);
  const [photoChemin, setPhotoChemin] = useState<string | undefined>(undefined);
  const [banniereURL, setBanniereURL] = useState(dossier.banniereURL);
  const [banniereChemin, setBanniereChemin] = useState<string | undefined>(undefined);
  const [busyPhoto, setBusyPhoto] = useState(false);
  const [busyBanniere, setBusyBanniere] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const photoInput = useRef<HTMLInputElement>(null);
  const banniereInput = useRef<HTMLInputElement>(null);

  const t = useTextes('espaceProfil', TEXTES, lang);

  const choisirImage = async (
    file: File,
    maxDim: number,
    prefixe: 'avatar' | 'banniere',
    setUrl: (u: string | undefined) => void,
    setChemin: (c: string | undefined) => void,
    setBusyLocal: (b: boolean) => void,
    urlPrecedente: string | undefined
  ) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError(t.erreurType);
      return;
    }
    if (file.size > TAILLE_MAX_IMAGE) {
      setError(t.erreurTaille);
      return;
    }
    const apercu = URL.createObjectURL(file);
    setUrl(apercu);
    setBusyLocal(true);
    try {
      const blob = await redimensionnerImage(file, maxDim);
      const chemin = `profils/${uid}/${prefixe}-${Date.now()}.jpg`;
      const { url } = await uploadFile(chemin, new File([blob], 'image.jpg', { type: 'image/jpeg' }));
      setUrl(url);
      setChemin(chemin);
    } catch {
      setError(t.erreurEnvoi);
      setUrl(urlPrecedente);
    } finally {
      URL.revokeObjectURL(apercu);
      setBusyLocal(false);
    }
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    void choisirImage(file, 512, 'avatar', setPhotoURL, setPhotoChemin, setBusyPhoto, dossier.photoURL);
  };

  const onBanniere = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    void choisirImage(file, 1920, 'banniere', setBanniereURL, setBanniereChemin, setBusyBanniere, dossier.banniereURL);
  };

  const retirerPhoto = () => {
    if (photoChemin) deleteFile(photoChemin).catch(() => {});
    setPhotoURL(undefined);
    setPhotoChemin(undefined);
  };

  const retirerBanniere = () => {
    if (banniereChemin) deleteFile(banniereChemin).catch(() => {});
    setBanniereURL(undefined);
    setBanniereChemin(undefined);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || busyPhoto || busyBanniere) return;
    const lienEntries = (Object.entries(liens) as [keyof Liens, string][])
      .map(([cle, valeur]) => [cle, valeur.trim()] as const)
      .filter(([, valeur]) => valeur.length > 0);
    if (lienEntries.some(([, valeur]) => !/^https:\/\//i.test(valeur))) {
      setError(t.erreurLien);
      return;
    }
    setBusy(true);
    setError(null);
    setOk(false);
    const payload: Record<string, any> = {
      nom: nom.trim(),
      telephone: telephone.trim(),
      ville: ville.trim(),
      profil,
      discipline: discipline.trim(),
      bio: bio.trim(),
      liens: Object.fromEntries(lienEntries),
      photoURL: photoURL || deleteField(),
      banniereURL: banniereURL || deleteField(),
      projet: { titre: titre.trim(), description: description.trim(), objectif: objectif.trim(), echeance },
      updatedAt: serverTimestamp(),
      derniereActiviteClient: serverTimestamp(),
    };
    try {
      await patchDoc<Record<string, any>>('dossiers', uid, payload);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nom.trim() || null, photoURL: photoURL || null });
      }
      setOk(true);
    } catch {
      setError(t.echec);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={soumettre} data-tx-scope="espaceProfil" className="space-y-10">
      <section className="border-t border-filet pt-8">
        <h2 className="font-serif text-h3 text-encre mb-6">{t.titrePhotos}</h2>
        <div className="space-y-6">
          <div>
            <p className="text-petit text-gris mb-2">{t.banniereLabel}</p>
            <div className="relative w-full max-w-xl aspect-[3/1] rounded-champ overflow-hidden bg-papier-2 border border-filet">
              {banniereURL && <img src={banniereURL} alt="" className="w-full h-full object-cover" />}
              {busyBanniere && (
                <div className="absolute inset-0 flex items-center justify-center bg-encre/30">
                  <span className="w-6 h-6 rounded-pilule border-2 border-papier border-t-transparent animate-spin" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <button
                type="button"
                onClick={() => banniereInput.current?.click()}
                className="min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-rose hover:text-rose transition-colors"
              >
                {t.changer}
              </button>
              {banniereURL && (
                <button type="button" onClick={retirerBanniere} className="min-h-[44px] text-gris text-sm font-medium hover:text-rose transition-colors">
                  {t.retirer}
                </button>
              )}
              <input ref={banniereInput} type="file" accept="image/*" onChange={onBanniere} className="hidden" aria-label={t.banniereLabel} />
            </div>
          </div>

          <div>
            <p className="text-petit text-gris mb-2">{t.photoLabel}</p>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar url={photoURL} nom={nom || dossier.nom} taille="lg" />
                {busyPhoto && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-encre/30">
                    <span className="w-5 h-5 rounded-pilule border-2 border-papier border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={() => photoInput.current?.click()}
                  className="min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-rose hover:text-rose transition-colors"
                >
                  {t.changer}
                </button>
                {photoURL && (
                  <button type="button" onClick={retirerPhoto} className="min-h-[44px] text-gris text-sm font-medium hover:text-rose transition-colors">
                    {t.retirer}
                  </button>
                )}
                <input ref={photoInput} type="file" accept="image/*" onChange={onPhoto} className="hidden" aria-label={t.photoLabel} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-col gap-y-10">
        <section className="border-t border-filet pt-8">
          <h2 className="font-serif text-h3 text-encre mb-6">{t.titreQui}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="mp-nom" className="block text-petit text-gris mb-1">
                {t.nom}
              </label>
              <input id="mp-nom" type="text" maxLength={120} value={nom} onChange={(e) => setNom(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
            </div>
            <div>
              <label htmlFor="mp-tel" className="block text-petit text-gris mb-1">
                {t.telephone}
              </label>
              <input id="mp-tel" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
            </div>
            <div>
              <label htmlFor="mp-ville" className="block text-petit text-gris mb-1">
                {t.ville}
              </label>
              <input id="mp-ville" type="text" maxLength={80} value={ville} onChange={(e) => setVille(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
            </div>
            <div>
              <label htmlFor="mp-profil" className="block text-petit text-gris mb-1">
                {t.profilLabel}
              </label>
              <select
                id="mp-profil"
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
              <label htmlFor="mp-discipline" className="block text-petit text-gris mb-1">
                {t.discipline}
              </label>
              <input
                id="mp-discipline"
                type="text"
                maxLength={80}
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder={t.disciplineHolder}
                className={`${CHAMP} min-h-[44px]`}
              />
            </div>
            <div>
              <label htmlFor="mp-bio" className="block text-petit text-gris mb-1">
                {t.bio}
              </label>
              <textarea
                id="mp-bio"
                maxLength={1000}
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.bioHolder}
                className={`${CHAMP} resize-none`}
              />
            </div>
          </div>
        </section>

        <section className="border-t border-filet pt-8">
          <h2 className="font-serif text-h3 text-encre mb-6">{t.titreLiens}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                ['site', t.lienSite],
                ['instagram', t.lienInstagram],
                ['facebook', t.lienFacebook],
                ['autre', t.lienAutre],
              ] as [keyof Liens, string][]
            ).map(([cle, label]) => (
              <div key={cle}>
                <label htmlFor={`mp-lien-${cle}`} className="block text-petit text-gris mb-1">
                  {label}
                </label>
                <input
                  id={`mp-lien-${cle}`}
                  type="url"
                  placeholder="https://…"
                  value={liens[cle]}
                  onChange={(e) => setLiens((prev) => ({ ...prev, [cle]: e.target.value }))}
                  className={`${CHAMP} min-h-[44px]`}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="border-t border-filet pt-8">
        <h2 className="font-serif text-h3 text-encre mb-6">{t.titreProjet}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="mp-ptitre" className="block text-petit text-gris mb-1">
              {t.projetTitre}
            </label>
            <input id="mp-ptitre" type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className={`${CHAMP} min-h-[44px]`} />
          </div>
          <div>
            <label htmlFor="mp-pdesc" className="block text-petit text-gris mb-1">
              {t.projetDesc}
            </label>
            <textarea
              id="mp-pdesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`${CHAMP} resize-none`}
            />
          </div>
          <div>
            <label htmlFor="mp-pobjectif" className="block text-petit text-gris mb-1">
              {t.projetObjectif}
            </label>
            <textarea
              id="mp-pobjectif"
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
              rows={2}
              className={`${CHAMP} resize-none`}
            />
          </div>
          <div>
            <label htmlFor="mp-echeance" className="block text-petit text-gris mb-1">
              {t.echeance}
            </label>
            <input
              id="mp-echeance"
              type="date"
              value={echeance}
              onChange={(e) => setEcheance(e.target.value)}
              className={`${CHAMP} min-h-[44px]`}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={busy || busyPhoto || busyBanniere}
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

export default MonProfil;
