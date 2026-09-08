// Admin › Capsules : Laurie dépose les courtes vidéos verticales (mode éducatif) qui paraissent sur
// l'accueil, entre Sommaire et À propos (pages/accueil/Capsules.tsx). Même canon que Admin › Témoignages
// audio (dépôt, ordre, publier/dépublier) avec en plus une affiche générée depuis la vidéo elle-même
// (lib/videos.ts, un <video> hors écran et un <canvas>, aucune dépendance) et un aperçu qui réemploie
// la carte publique telle quelle.

import React, { useMemo, useRef, useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AlertCircle, Film, GripVertical, Trash2, UploadCloud } from 'lucide-react';
import { Bouton, Champ, Chargement, EnTete, Etiquette, Panneau, Vide, Zone } from '../components/admin/ui';
import { CapsuleCarte } from './accueil/Capsules';
import { db, storage } from '../firebase';
import { deleteFile, patchDoc, removeDoc, uploadFile, useCollection, writeDoc } from '../lib/firestore';
import { extension, genererAffiche, octetsLisibles, TAILLE_MAX_VIDEO, TYPES_VIDEO } from '../lib/videos';
import { useTextes } from '../lib/textes';
import type { Language, VideoCapsule } from '../types';

interface AdminVideosProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    titre: 'Capsules vidéo',
    lede: 'Les courtes vidéos verticales, en mode éducatif, qui paraissent sur l’accueil.',
    ajouterTitre: 'Ajouter une capsule',
    fichierLabel: 'Vidéo',
    fichierAide: 'MP4 ou WebM, format vertical, 200 Mo au plus. Glissez-la ici ou choisissez-la.',
    fichierChoisi: 'Choisi : {n} ({t})',
    deposerIci: 'Déposez la vidéo ici',
    titreLabel: 'Titre',
    titreEnLabel: 'Titre (anglais)',
    descriptionLabel: 'Description',
    descriptionEnLabel: 'Description (anglaise)',
    sousTitresLabel: 'Sous-titres (.vtt)',
    sousTitresAide: 'Facultatif. Sans fichier, la capsule joue sans sous-titres.',
    publieLabel: 'Publiée sur l’accueil',
    enregistrer: 'Ajouter la capsule',
    televersementEnCours: 'Téléversement… {p} %',
    erreurTitre: 'Le titre est requis.',
    erreurFichier: 'Choisissez un fichier vidéo.',
    erreurType: 'Le fichier doit être en MP4 ou en WebM.',
    erreurTaille: 'Ce fichier dépasse 200 Mo.',
    erreurGenerique: 'L’action n’a pas fonctionné. Réessayez.',
    listeTitre: 'Vos capsules',
    videTitre: 'Aucune capsule pour le moment.',
    videTexte: 'Ajoutez-en une ci-dessus : la section s’allumera sur l’accueil dès la première publiée.',
    publie: 'Publiée',
    brouillon: 'Brouillon',
    publier: 'Publier',
    retirer: 'Retirer',
    supprimer: 'Supprimer',
    confirmerSupprOui: 'Oui, supprimer',
    confirmerSupprNon: 'Annuler',
    apercuLabel: 'Aperçu, telle qu’elle paraît sur l’accueil',
    glisserAide: 'Glissez une capsule pour changer son ordre.',
    chargement: 'Chargement…',
  },
  EN: {
    titre: 'Video capsules',
    lede: 'The short vertical, educational videos shown on the homepage.',
    ajouterTitre: 'Add a capsule',
    fichierLabel: 'Video',
    fichierAide: 'MP4 or WebM, vertical format, 200 MB at most. Drop it here or choose it.',
    fichierChoisi: 'Chosen: {n} ({t})',
    deposerIci: 'Drop the video here',
    titreLabel: 'Title',
    titreEnLabel: 'Title (English)',
    descriptionLabel: 'Description',
    descriptionEnLabel: 'Description (English)',
    sousTitresLabel: 'Subtitles (.vtt)',
    sousTitresAide: 'Optional. Without a file, the capsule plays without subtitles.',
    publieLabel: 'Published on the homepage',
    enregistrer: 'Add the capsule',
    televersementEnCours: 'Uploading… {p}%',
    erreurTitre: 'The title is required.',
    erreurFichier: 'Choose a video file.',
    erreurType: 'The file must be MP4 or WebM.',
    erreurTaille: 'This file is over 200 MB.',
    erreurGenerique: 'That action failed. Try again.',
    listeTitre: 'Your capsules',
    videTitre: 'No capsule yet.',
    videTexte: 'Add one above: the section will turn on once the first one is published.',
    publie: 'Published',
    brouillon: 'Draft',
    publier: 'Publish',
    retirer: 'Unpublish',
    supprimer: 'Delete',
    confirmerSupprOui: 'Yes, delete',
    confirmerSupprNon: 'Cancel',
    apercuLabel: 'Preview, as it appears on the homepage',
    glisserAide: 'Drag a capsule to change its order.',
    chargement: 'Loading…',
  },
};

const parOrdre = (a: VideoCapsule, b: VideoCapsule): number => (a.ordre ?? 0) - (b.ordre ?? 0);

/** Téléversement avec progression (uploadBytesResumable) : la seule raison de ne pas passer par
    lib/firestore.ts::uploadFile, qui n'expose pas d'étapes intermédiaires. */
const televerserAvecProgression = (
  chemin: string,
  fichier: File,
  onProgres: (pct: number) => void
): Promise<{ url: string; chemin: string }> =>
  new Promise((resolve, reject) => {
    const tache = uploadBytesResumable(storageRef(storage, chemin), fichier);
    tache.on(
      'state_changed',
      (snap) => onProgres(Math.round((snap.bytesTransferred / Math.max(1, snap.totalBytes)) * 100)),
      reject,
      async () => {
        try {
          const url = await getDownloadURL(tache.snapshot.ref);
          resolve({ url, chemin });
        } catch (e) {
          reject(e);
        }
      }
    );
  });

const AdminVideos: React.FC<AdminVideosProps> = ({ lang }) => {
  const t = useTextes('adminVideos', TEXTES, lang);
  const { data, loading } = useCollection<VideoCapsule>('videos');
  const videos = useMemo(() => data.slice().sort(parOrdre), [data]);
  const fileRef = useRef<HTMLInputElement>(null);
  const vttRef = useRef<HTMLInputElement>(null);

  const [titre, setTitre] = useState('');
  const [titreEn, setTitreEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [fichier, setFichier] = useState<File | null>(null);
  const [sousTitresFichier, setSousTitresFichier] = useState<File | null>(null);
  const [publie, setPublie] = useState(false);
  const [survolDepot, setSurvolDepot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progression, setProgression] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const [indexGlisse, setIndexGlisse] = useState<number | null>(null);

  const choisirFichier = (f: File | null) => {
    setFichier(f);
    setErreur(null);
  };

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    if (!titre.trim()) return setErreur(t.erreurTitre);
    if (!fichier) return setErreur(t.erreurFichier);
    if (!TYPES_VIDEO.includes(fichier.type)) return setErreur(t.erreurType);
    if (fichier.size > TAILLE_MAX_VIDEO) return setErreur(t.erreurTaille);

    setBusy(true);
    setProgression(0);
    try {
      const id = doc(collection(db, 'videos')).id;
      const ext = extension(fichier.name, fichier.type === 'video/webm' ? 'webm' : 'mp4');
      const cheminVideo = `videos/${id}/fichier.${ext}`;
      const { url: urlVideo } = await televerserAvecProgression(cheminVideo, fichier, setProgression);

      let affiche: VideoCapsule['affiche'];
      const blocAffiche = await genererAffiche(fichier);
      if (blocAffiche) {
        const cheminAffiche = `videos/${id}/affiche.jpg`;
        const { url } = await uploadFile(cheminAffiche, new File([blocAffiche], 'affiche.jpg', { type: 'image/jpeg' }));
        affiche = { chemin: cheminAffiche, url };
      }

      let sousTitres: string | undefined;
      if (sousTitresFichier) {
        const { url } = await uploadFile(`videos/${id}/sous-titres.vtt`, sousTitresFichier);
        sousTitres = url;
      }

      await writeDoc<Omit<VideoCapsule, 'id'>>('videos', id, {
        titre: titre.trim(),
        titreEn: titreEn.trim() || undefined,
        description: description.trim() || undefined,
        descriptionEn: descriptionEn.trim() || undefined,
        fichier: { chemin: cheminVideo, url: urlVideo, contentType: fichier.type, taille: fichier.size },
        affiche,
        sousTitres,
        ordre: videos.length,
        publie,
        cree: serverTimestamp(),
        modifie: serverTimestamp(),
      } as any);

      setTitre('');
      setTitreEn('');
      setDescription('');
      setDescriptionEn('');
      setFichier(null);
      setSousTitresFichier(null);
      setPublie(false);
      if (fileRef.current) fileRef.current.value = '';
      if (vttRef.current) vttRef.current.value = '';
    } catch {
      setErreur(t.erreurGenerique);
    } finally {
      setBusy(false);
      setProgression(0);
    }
  };

  const basculerPublie = async (v: VideoCapsule) => {
    try {
      await patchDoc('videos', v.id, { publie: !v.publie, modifie: serverTimestamp() });
    } catch {
      setErreur(t.erreurGenerique);
    }
  };

  const supprimer = async (v: VideoCapsule) => {
    try {
      await deleteFile(v.fichier.chemin).catch(() => {});
      if (v.affiche) await deleteFile(v.affiche.chemin).catch(() => {});
      await removeDoc('videos', v.id);
    } catch {
      setErreur(t.erreurGenerique);
    } finally {
      setASupprimer(null);
    }
  };

  // Ordre par glisser (HTML5 natif, aucune librairie) : au dépôt, les capsules déplacées reprennent
  // des index 0..n-1, seuls les index qui bougent réellement sont réécrits.
  const reordonner = async (depart: number, arrivee: number) => {
    if (depart === arrivee) return;
    const suivante = videos.slice();
    const [retiree] = suivante.splice(depart, 1);
    suivante.splice(arrivee, 0, retiree);
    try {
      await Promise.all(
        suivante.map((v, i) => (v.ordre === i ? Promise.resolve() : patchDoc('videos', v.id, { ordre: i })))
      );
    } catch {
      setErreur(t.erreurGenerique);
    }
  };

  const boutonIcone = 'flex h-11 w-11 items-center justify-center rounded-champ text-gris hover:bg-papier hover:text-encre';

  return (
    <div data-tx-scope="adminVideos" className="w-full space-y-8 px-6 py-10 md:px-10">
      <EnTete kicker="Accueil" titre={t.titre} lede={t.lede} />

      {erreur && (
        <p className="flex items-center gap-2 rounded-champ border border-rose/30 bg-rose/5 p-3 text-sm text-rose" role="alert">
          <AlertCircle className="h-4 w-4 flex-none" aria-hidden />
          {erreur}
        </p>
      )}

      <Panneau titre={t.ajouterTitre}>
        <form onSubmit={enregistrer} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="video-fichier" className="text-petit font-semibold text-encre">
              {t.fichierLabel}
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setSurvolDepot(true);
              }}
              onDragLeave={() => setSurvolDepot(false)}
              onDrop={(e) => {
                e.preventDefault();
                setSurvolDepot(false);
                choisirFichier(e.dataTransfer.files[0] ?? null);
              }}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-champ border border-dashed p-8 text-center transition-colors ${
                survolDepot ? 'border-rose bg-rose/5' : 'border-filet hover:border-encre'
              }`}
            >
              <UploadCloud className="h-6 w-6 text-gris" aria-hidden />
              <p className="text-sm text-encre">{survolDepot ? t.deposerIci : fichier ? t.fichierChoisi.replace('{n}', fichier.name).replace('{t}', octetsLisibles(fichier.size)) : t.fichierAide}</p>
              <input
                id="video-fichier"
                ref={fileRef}
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => choisirFichier(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Champ label={t.titreLabel} value={titre} onChange={(e) => setTitre(e.target.value)} />
            <Champ label={t.titreEnLabel} value={titreEn} onChange={(e) => setTitreEn(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Zone label={t.descriptionLabel} value={description} onChange={(e) => setDescription(e.target.value)} />
            <Zone label={t.descriptionEnLabel} value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="video-vtt" className="text-petit font-semibold text-encre">
              {t.sousTitresLabel}
            </label>
            <input
              id="video-vtt"
              ref={vttRef}
              type="file"
              accept=".vtt,text/vtt"
              onChange={(e) => setSousTitresFichier(e.target.files?.[0] ?? null)}
              className="text-sm text-gris file:mr-3 file:rounded-champ file:border-0 file:bg-encre file:px-4 file:py-2 file:text-xs file:text-papier"
            />
            <p className="text-xs text-gris">{t.sousTitresAide}</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-encre">
            <input type="checkbox" checked={publie} onChange={(e) => setPublie(e.target.checked)} className="accent-rose" />
            {t.publieLabel}
          </label>

          {busy && progression > 0 && (
            <div className="h-1.5 w-full overflow-hidden rounded-pilule bg-filet" role="progressbar" aria-valuenow={progression} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-pilule bg-rose transition-[width] duration-200" style={{ width: `${progression}%` }} />
            </div>
          )}

          <Bouton type="submit" variante="primaire" icone={Film} disabled={busy}>
            {busy ? t.televersementEnCours.replace('{p}', String(progression)) : t.enregistrer}
          </Bouton>
        </form>
      </Panneau>

      <Panneau titre={t.listeTitre} actions={videos.length > 1 ? <p className="text-xs text-gris">{t.glisserAide}</p> : undefined}>
        {loading ? (
          <Chargement texte={t.chargement} />
        ) : videos.length === 0 ? (
          <Vide titre={t.videTitre} texte={t.videTexte} />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => (
              <li
                key={v.id}
                draggable
                onDragStart={() => setIndexGlisse(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (indexGlisse !== null) reordonner(indexGlisse, i);
                  setIndexGlisse(null);
                }}
                className="flex flex-col gap-3 rounded-champ border border-filet p-4"
              >
                <div className="flex items-center gap-2 text-gris">
                  <GripVertical className="h-4 w-4 cursor-grab" aria-hidden />
                  <p className="kicker">{t.apercuLabel}</p>
                </div>

                <div className="mx-auto w-[180px]">
                  <CapsuleCarte video={v} lang={lang} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-filet pt-3">
                  <Etiquette tone={v.publie ? 'accent' : 'neutre'}>{v.publie ? t.publie : t.brouillon}</Etiquette>
                  <Bouton variante="discret" petit onClick={() => basculerPublie(v)}>
                    {v.publie ? t.retirer : t.publier}
                  </Bouton>

                  {aSupprimer === v.id ? (
                    <span className="ml-auto flex items-center gap-2">
                      <Bouton variante="danger" petit onClick={() => supprimer(v)}>
                        {t.confirmerSupprOui}
                      </Bouton>
                      <Bouton variante="secondaire" petit onClick={() => setASupprimer(null)}>
                        {t.confirmerSupprNon}
                      </Bouton>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setASupprimer(v.id)}
                      className={`${boutonIcone} ml-auto hover:text-rose`}
                      aria-label={t.supprimer}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panneau>
    </div>
  );
};

export default AdminVideos;
