// Admin › Témoignages audio : Laurie dépose les enregistrements qui paraissent sur l'accueil
// (canon v2, components/admin/CANON-ADMIN.md). Porté du module témoignages du site de Philippe
// Dufresne, avec le même lecteur que le public (components/LecteurAudio.tsx).

import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Mic, Trash2 } from 'lucide-react';
import { Bouton, Champ, Chargement, EnTete, Etiquette, Panneau, Vide, Zone } from '../components/admin/ui';
import { LecteurAudio } from '../components/LecteurAudio';
import { createDoc, deleteFile, patchDoc, removeDoc, uploadFile, useCollection } from '../lib/firestore';
import { useTextes } from '../lib/textes';
import type { Language, TemoignageAudio } from '../types';

interface AdminTemoignagesProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    titre: 'Témoignages audio',
    lede: 'Les voix de celles et ceux que vous accompagnez, à écouter sur l’accueil.',
    ajouterTitre: 'Ajouter un témoignage',
    nomLabel: 'Nom',
    nomAide: 'Prénom et initiale, comme il paraîtra sur le site (« Sophie L. »).',
    roleLabel: 'Rôle',
    roleAide: 'Sa discipline ou son titre, facultatif.',
    extraitLabel: 'Extrait',
    extraitAide: 'Une phrase à lire pendant l’écoute, 300 caractères au plus.',
    fichierLabel: 'Fichier audio',
    fichierAide: 'MP3, M4A ou WAV, 15 Mo au plus.',
    dureeConnue: 'Durée repérée : {d}',
    publieLabel: 'Publié sur l’accueil',
    enregistrer: 'Enregistrer',
    enregistrementEnCours: 'Enregistrement…',
    erreurNom: 'Le nom est requis.',
    erreurFichier: 'Choisissez un fichier audio.',
    erreurTaille: 'Ce fichier dépasse 15 Mo.',
    erreurExtrait: 'L’extrait tient en 300 caractères.',
    erreurGenerique: 'L’action n’a pas fonctionné. Réessayez.',
    listeTitre: 'Vos témoignages',
    videTitre: 'Aucun témoignage pour le moment.',
    videTexte: 'Ajoutez-en un ci-dessus : il paraîtra ici avant d’aller sur l’accueil.',
    publie: 'Publié',
    brouillon: 'Brouillon',
    publier: 'Publier',
    retirer: 'Retirer',
    supprimer: 'Supprimer',
    confirmerSupprOui: 'Oui, supprimer',
    confirmerSupprNon: 'Annuler',
    monter: 'Monter',
    descendre: 'Descendre',
    chargement: 'Chargement…',
  },
  EN: {
    titre: 'Audio testimonials',
    lede: 'The voices of the people you support, played on the homepage.',
    ajouterTitre: 'Add a testimonial',
    nomLabel: 'Name',
    nomAide: 'First name and initial, as it will show on the site (“Sophie L.”).',
    roleLabel: 'Role',
    roleAide: 'Their discipline or title, optional.',
    extraitLabel: 'Excerpt',
    extraitAide: 'A line to read while listening, 300 characters at most.',
    fichierLabel: 'Audio file',
    fichierAide: 'MP3, M4A or WAV, 15 MB at most.',
    dureeConnue: 'Duration found: {d}',
    publieLabel: 'Published on the homepage',
    enregistrer: 'Save',
    enregistrementEnCours: 'Saving…',
    erreurNom: 'The name is required.',
    erreurFichier: 'Choose an audio file.',
    erreurTaille: 'This file is over 15 MB.',
    erreurExtrait: 'The excerpt fits in 300 characters.',
    erreurGenerique: 'That action failed. Try again.',
    listeTitre: 'Your testimonials',
    videTitre: 'No testimonial yet.',
    videTexte: 'Add one above: it will show here before it goes on the homepage.',
    publie: 'Published',
    brouillon: 'Draft',
    publier: 'Publish',
    retirer: 'Unpublish',
    supprimer: 'Delete',
    confirmerSupprOui: 'Yes, delete',
    confirmerSupprNon: 'Cancel',
    monter: 'Move up',
    descendre: 'Move down',
    chargement: 'Loading…',
  },
};

const TAILLE_MAX = 15 * 1024 * 1024;

// Un nom de fichier stable et lisible : temoignages/<horodatage>-<nom-glissé>.<extension>.
const glisser = (texte: string): string =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'temoignage';

const extension = (nomFichier: string): string => {
  const m = /\.([a-zA-Z0-9]+)$/.exec(nomFichier);
  return m ? m[1].toLowerCase() : 'mp3';
};

const lireDuree = (file: File): Promise<number> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const au = new Audio(url);
    const fin = (d: number) => {
      URL.revokeObjectURL(url);
      resolve(d);
    };
    au.addEventListener('loadedmetadata', () => fin(au.duration || 0));
    au.addEventListener('error', () => fin(0));
  });

const mmss = (s: number): string => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

const parOrdre = (a: TemoignageAudio, b: TemoignageAudio): number => (a.ordre ?? 0) - (b.ordre ?? 0);

const AdminTemoignages: React.FC<AdminTemoignagesProps> = ({ lang }) => {
  const t = useTextes('adminTemoignages', TEXTES, lang);
  const { data, loading } = useCollection<TemoignageAudio>('temoignagesAudio');
  const temoignages = useMemo(() => data.slice().sort(parOrdre), [data]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState('');
  const [role, setRole] = useState('');
  const [extrait, setExtrait] = useState('');
  const [fichier, setFichier] = useState<File | null>(null);
  const [duree, setDuree] = useState(0);
  const [publie, setPublie] = useState(false);
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [aSupprimer, setASupprimer] = useState<string | null>(null);

  const choisirFichier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFichier(f);
    setDuree(f ? await lireDuree(f) : 0);
  };

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    if (!nom.trim()) return setErreur(t.erreurNom);
    if (!fichier) return setErreur(t.erreurFichier);
    if (fichier.size > TAILLE_MAX) return setErreur(t.erreurTaille);
    if (extrait.length > 300) return setErreur(t.erreurExtrait);

    setBusy(true);
    try {
      const chemin = `temoignages/${Date.now()}-${glisser(nom)}.${extension(fichier.name)}`;
      const { url } = await uploadFile(chemin, fichier);
      await createDoc<Omit<TemoignageAudio, 'id'>>('temoignagesAudio', {
        nom: nom.trim(),
        role: role.trim() || undefined,
        extrait: extrait.trim() || undefined,
        audioURL: url,
        storagePath: chemin,
        duree: duree || undefined,
        ordre: temoignages.length,
        publie,
      } as any);
      setNom('');
      setRole('');
      setExtrait('');
      setFichier(null);
      setDuree(0);
      setPublie(false);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setErreur(t.erreurGenerique);
    } finally {
      setBusy(false);
    }
  };

  const basculerPublie = async (tem: TemoignageAudio) => {
    try {
      await patchDoc('temoignagesAudio', tem.id, { publie: !tem.publie });
    } catch {
      setErreur(t.erreurGenerique);
    }
  };

  const deplacer = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= temoignages.length) return;
    const a = temoignages[i];
    const b = temoignages[j];
    try {
      await Promise.all([
        patchDoc('temoignagesAudio', a.id, { ordre: b.ordre ?? j }),
        patchDoc('temoignagesAudio', b.id, { ordre: a.ordre ?? i }),
      ]);
    } catch {
      setErreur(t.erreurGenerique);
    }
  };

  const supprimer = async (tem: TemoignageAudio) => {
    try {
      if (tem.storagePath) await deleteFile(tem.storagePath).catch(() => {});
      await removeDoc('temoignagesAudio', tem.id);
    } catch {
      setErreur(t.erreurGenerique);
    } finally {
      setASupprimer(null);
    }
  };

  const boutonIcone = 'flex h-11 w-11 items-center justify-center rounded-champ text-gris hover:bg-papier hover:text-encre';

  return (
    <div data-tx-scope="adminTemoignages" className="w-full px-6 md:px-10 py-10 space-y-8">
      <EnTete kicker="Accueil" titre={t.titre} lede={t.lede} />

      {erreur && (
        <p className="flex items-center gap-2 rounded-champ border border-rose/30 bg-rose/5 p-3 text-sm text-rose" role="alert">
          <AlertCircle className="h-4 w-4 flex-none" aria-hidden />
          {erreur}
        </p>
      )}

      <Panneau titre={t.ajouterTitre}>
        <form onSubmit={enregistrer} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Champ label={t.nomLabel} aide={t.nomAide} value={nom} onChange={(e) => setNom(e.target.value)} />
            <Champ label={t.roleLabel} aide={t.roleAide} value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <Zone
            label={t.extraitLabel}
            aide={t.extraitAide}
            value={extrait}
            maxLength={300}
            onChange={(e) => setExtrait(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="temoignage-fichier" className="text-petit font-semibold text-encre">
              {t.fichierLabel}
            </label>
            <input
              id="temoignage-fichier"
              ref={fileRef}
              type="file"
              accept="audio/*"
              onChange={choisirFichier}
              className="text-sm text-gris file:mr-3 file:rounded-champ file:border-0 file:bg-encre file:px-4 file:py-2 file:text-xs file:text-papier"
            />
            <p className="text-xs text-gris">{duree > 0 ? t.dureeConnue.replace('{d}', mmss(duree)) : t.fichierAide}</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-encre">
            <input type="checkbox" checked={publie} onChange={(e) => setPublie(e.target.checked)} className="accent-rose" />
            {t.publieLabel}
          </label>
          <Bouton type="submit" variante="primaire" icone={Mic} disabled={busy}>
            {busy ? t.enregistrementEnCours : t.enregistrer}
          </Bouton>
        </form>
      </Panneau>

      <Panneau titre={t.listeTitre}>
        {loading ? (
          <Chargement texte={t.chargement} />
        ) : temoignages.length === 0 ? (
          <Vide titre={t.videTitre} texte={t.videTexte} />
        ) : (
          <ul className="space-y-3">
            {temoignages.map((tem, i) => (
              <li key={tem.id} className="rounded-champ border border-filet p-4">
                <div className="min-w-0">
                  <LecteurAudio src={tem.audioURL} nom={tem.nom} lang={lang} />
                </div>

                <div className="mt-4">
                  <p className="font-sans font-semibold text-encre">
                    {tem.nom}
                    {tem.role && <span className="font-normal text-gris"> · {tem.role}</span>}
                  </p>
                  {tem.extrait && <p className="mt-1 text-sm text-gris">{tem.extrait}</p>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-filet pt-4">
                  <Etiquette tone={tem.publie ? 'accent' : 'neutre'}>{tem.publie ? t.publie : t.brouillon}</Etiquette>
                  <Bouton variante="discret" petit onClick={() => basculerPublie(tem)}>
                    {tem.publie ? t.retirer : t.publier}
                  </Bouton>
                  <button type="button" onClick={() => deplacer(i, -1)} className={boutonIcone} aria-label={t.monter}>
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </button>
                  <button type="button" onClick={() => deplacer(i, 1)} className={boutonIcone} aria-label={t.descendre}>
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </button>

                  {aSupprimer === tem.id ? (
                    <span className="ml-auto flex items-center gap-2">
                      <Bouton variante="danger" petit onClick={() => supprimer(tem)}>
                        {t.confirmerSupprOui}
                      </Bouton>
                      <Bouton variante="secondaire" petit onClick={() => setASupprimer(null)}>
                        {t.confirmerSupprNon}
                      </Bouton>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setASupprimer(tem.id)}
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

export default AdminTemoignages;
