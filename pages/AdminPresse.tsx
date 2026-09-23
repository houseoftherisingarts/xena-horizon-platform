import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Image as ImageIcon, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { Bouton, Champ, EnTete, Panneau, Zone } from '../components/admin/ui';
import { CadreEchelle, VisuelCarte } from '../components/presse/CartePresse';
import { readDoc, uploadFile, writeDoc } from '../lib/firestore';
import {
  CHEMIN_BROUILLON_PRESSE,
  CHEMIN_PRESSE,
  KIT_DEFAUT,
  cadrageDe,
  lire,
  urlPhoto,
  type Bilingue,
  type CartePresse,
  type KitPresse,
  type PlanchePresse,
  type TextePresse,
} from '../lib/presse-contenu';
import { Language } from '../types';

// Admin › Salle de presse : Laurie change ses photos, son cadrage et ses textes, voit le résultat à
// côté, et publie quand elle est prête. Deux documents, pour qu'une phrase à moitié récrite ne se
// retrouve jamais devant un journaliste : brouillons/presse (admin seulement) porte son travail en
// cours, settings/presse (lecture publique) porte ce que la salle de presse montre.
//
// L'aperçu est le composant même qui fabrique le fichier téléchargé, à l'échelle. Ce qu'elle voit
// ici est donc exactement ce qui partira, au pixel près.

const PHOTOS_DU_SITE = [
  '/images/laurie-portrait-1-1920.jpg',
  '/images/laurie-portrait-2-1920.jpg',
  '/images/laurie-portrait-nb-1920.jpg',
  '/images/laurie-scene-1920.jpg',
  '/images/laurie-apropos-1920.jpg',
  '/images/balado-1920.jpg',
  '/images/livre-couverture.jpg',
  '/images/livre-volume.jpg',
  '/images/modele-1920.jpg',
];

const T = {
  FR: {
    kicker: 'Site public',
    titre: 'La salle de presse',
    lede: "Les visuels, les photographies et les textes que les médias téléchargent. Rien ne change sur le site tant que vous n'avez pas publié.",
    onglets: { cartes: 'Les cartes', planches: 'Les photographies', textes: 'Les textes' },
    publier: 'Publier les changements',
    publie: 'Publié',
    origine: 'Revenir au texte d\'origine',
    garde: 'Brouillon gardé',
    apercu: 'Ce que le journaliste verra',
    ajouter: 'Ajouter',
    supprimer: 'Supprimer',
    monter: 'Monter',
    descendre: 'Descendre',
    photo: 'La photo',
    choisir: 'Choisir une photo du site',
    televerser: 'Téléverser une photo',
    cadrer: 'Le cadrage',
    cadrerAide: 'Glissez le point sur la photo pour choisir ce qui reste au centre, puis rapprochez avec le zoom.',
    zoom: 'Zoom',
    reinit: 'Cadrage de base',
    cote: 'Côté de la photo',
    gauche: 'À gauche',
    droite: 'À droite',
    largeur: 'Largeur du panneau photo',
    kickerC: 'Surtitre',
    titreC: 'Titre',
    corpsC: 'Texte',
    metaC: 'Ligne du bas',
    legende: 'Légende',
    credit: 'Crédit photo',
    titreT: 'Titre',
    texteT: 'Texte',
    fr: 'Français',
    en: 'Anglais',
    vide: 'Rien ici pour le moment.',
  },
  EN: {
    kicker: 'Public site',
    titre: 'The press room',
    lede: 'The visuals, photographs and texts the media download. Nothing changes on the site until you publish.',
    onglets: { cartes: 'Cards', planches: 'Photographs', textes: 'Texts' },
    publier: 'Publish changes',
    publie: 'Published',
    origine: 'Back to the original text',
    garde: 'Draft saved',
    apercu: 'What the journalist will see',
    ajouter: 'Add',
    supprimer: 'Delete',
    monter: 'Move up',
    descendre: 'Move down',
    photo: 'The photo',
    choisir: 'Pick a photo from the site',
    televerser: 'Upload a photo',
    cadrer: 'Framing',
    cadrerAide: 'Drag the point on the photo to choose what stays centred, then move closer with the zoom.',
    zoom: 'Zoom',
    reinit: 'Default framing',
    cote: 'Photo side',
    gauche: 'On the left',
    droite: 'On the right',
    largeur: 'Photo panel width',
    kickerC: 'Kicker',
    titreC: 'Title',
    corpsC: 'Body',
    metaC: 'Bottom line',
    legende: 'Caption',
    credit: 'Photo credit',
    titreT: 'Title',
    texteT: 'Text',
    fr: 'French',
    en: 'English',
    vide: 'Nothing here yet.',
  },
};

type Onglet = 'cartes' | 'planches' | 'textes';

/** Remet les numéros en accord avec l'ordre affiché, pour que « 03 » soit bien le troisième. */
const renumeroter = <T extends { n: string }>(liste: T[]): T[] => liste.map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0') }));

/** Échange deux voisins dans une liste; au bout, la liste ne bouge pas. */
function echanger<T>(liste: T[], i: number, pas: number): T[] {
  const j = i + pas;
  if (j < 0 || j >= liste.length) return liste;
  const copie = [...liste];
  [copie[i], copie[j]] = [copie[j], copie[i]];
  return copie;
}

/**
 * Réduit une photo avant l'envoi : 2400 px de large suffisent à une carte de 1920, et un fichier
 * d'appareil photo de 8 Mo ferait ramer l'aperçu autant que la capture.
 */
async function preparerPhoto(f: File): Promise<File> {
  const bitmap = await createImageBitmap(f);
  const k = Math.min(1, 2400 / bitmap.width);
  const c = document.createElement('canvas');
  c.width = Math.round(bitmap.width * k);
  c.height = Math.round(bitmap.height * k);
  c.getContext('2d')!.drawImage(bitmap, 0, 0, c.width, c.height);
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/webp', 0.9));
  bitmap.close();
  if (!blob) return f;
  return new File([blob], `${f.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
}

/** Un champ bilingue : les deux langues côte à côte, parce que les oublier est vite arrivé. */
const ChampBilingue: React.FC<{
  label: string;
  valeur: Bilingue;
  onChange: (v: Bilingue) => void;
  lignes?: number;
  t: (typeof T)['FR'];
}> = ({ label, valeur, onChange, lignes, t }) => {
  const Rendu = lignes ? Zone : Champ;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Rendu
        label={`${label} · ${t.fr}`}
        value={valeur.FR}
        rows={lignes}
        onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange({ ...valeur, FR: e.target.value })}
      />
      <Rendu
        label={`${label} · ${t.en}`}
        value={valeur.EN}
        rows={lignes}
        onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange({ ...valeur, EN: e.target.value })}
      />
    </div>
  );
};

/** Le choix d'une photo : celles du site, celles déjà téléversées, ou une nouvelle. */
const ChoixPhoto: React.FC<{ valeur: string; onChange: (url: string) => void; t: (typeof T)['FR'] }> = ({ valeur, onChange, t }) => {
  const [envoi, setEnvoi] = useState(false);
  const champ = useRef<HTMLInputElement>(null);

  const televerser = async (f: File) => {
    setEnvoi(true);
    try {
      const prete = await preparerPhoto(f);
      const { url } = await uploadFile(`site/presse/${Date.now()}_${prete.name}`, prete);
      onChange(url);
    } finally {
      setEnvoi(false);
    }
  };

  const connues = PHOTOS_DU_SITE.includes(valeur) ? PHOTOS_DU_SITE : [valeur, ...PHOTOS_DU_SITE];

  return (
    <div>
      <p className="kicker text-gris mb-3">{t.choisir}</p>
      <div className="grid grid-cols-4 gap-2">
        {connues.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`aspect-[3/4] overflow-hidden rounded-champ border-2 transition ${p === valeur ? 'border-rose' : 'border-transparent hover:border-filet'}`}
          >
            <img src={urlPhoto(p)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <input
        ref={champ}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void televerser(f);
          e.target.value = '';
        }}
      />
      <Bouton variante="secondaire" icone={envoi ? ImageIcon : Upload} petit className="mt-3" disabled={envoi} onClick={() => champ.current?.click()}>
        {t.televerser}
      </Bouton>
    </div>
  );
};

/**
 * Le cadrage au doigt : on glisse le point focal sur la photo et on rapproche avec le zoom. La
 * vignette est au format du panneau photo de la carte, pas au format de la photo, sans quoi le
 * réglage mentirait sur ce qui sera vraiment visible.
 */
const Cadrage: React.FC<{
  photo: string;
  cadrage: { focalX?: number; focalY?: number; zoom?: number };
  ratio: number;
  onChange: (c: { focalX: number; focalY: number; zoom: number }) => void;
  t: (typeof T)['FR'];
}> = ({ photo, cadrage, ratio, onChange, t }) => {
  const boite = useRef<HTMLDivElement>(null);
  const c = cadrageDe(cadrage);

  const placer = (e: React.PointerEvent) => {
    const r = boite.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
    onChange({ focalX: x, focalY: y, zoom: c.z });
  };

  return (
    <div>
      <p className="kicker text-gris mb-2">{t.cadrer}</p>
      <p className="text-sm text-gris mb-3">{t.cadrerAide}</p>
      <div
        ref={boite}
        className="relative w-full overflow-hidden rounded-champ bg-papier cursor-crosshair touch-none"
        style={{ aspectRatio: String(ratio) }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          placer(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && placer(e)}
      >
        <img
          src={urlPhoto(photo)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `${c.x}% ${c.y}%`, transform: `scale(${c.z})`, transformOrigin: `${c.x}% ${c.y}%` }}
        />
        <span className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: `${c.x}%`, top: `${c.y}%`, background: 'rgb(var(--c-rose-vif))' }} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <label className="text-sm text-gris flex-shrink-0">{t.zoom}</label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.02}
          value={c.z}
          onChange={(e) => onChange({ focalX: c.x, focalY: c.y, zoom: Number(e.target.value) })}
          className="w-full accent-[rgb(var(--c-rose-vif))]"
        />
        <Bouton variante="discret" icone={RotateCcw} petit onClick={() => onChange({ focalX: 50, focalY: 50, zoom: 1 })}>
          {t.reinit}
        </Bouton>
      </div>
    </div>
  );
};

const AdminPresse: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = T[lang];
  const [kit, setKit] = useState<KitPresse | null>(null);
  const [onglet, setOnglet] = useState<Onglet>('cartes');
  const [choisi, setChoisi] = useState(0);
  const [etat, setEtat] = useState('');
  const minuteur = useRef<number>();

  // Le brouillon prime au chargement : c'est là que vit le travail en cours, publié ou non.
  useEffect(() => {
    void (async () => {
      const b = await readDoc<{ json?: string }>(CHEMIN_BROUILLON_PRESSE);
      if (b?.json) return setKit(lire(b.json));
      const p = await readDoc<{ json?: string }>(CHEMIN_PRESSE);
      setKit(lire(p?.json));
    })();
  }, []);

  /** Garde le brouillon après une pause de frappe, jamais à chaque touche. */
  const garder = useCallback((k: KitPresse) => {
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => {
      void writeDoc(CHEMIN_BROUILLON_PRESSE, { json: JSON.stringify(k) }).then(() => {
        setEtat(T.FR.garde);
        window.setTimeout(() => setEtat(''), 1600);
      });
    }, 700);
  }, []);

  const changer = useCallback(
    (suite: (k: KitPresse) => KitPresse) => {
      setKit((v) => {
        if (!v) return v;
        const neuf = suite(v);
        garder(neuf);
        return neuf;
      });
    },
    [garder]
  );

  const publier = async () => {
    if (!kit) return;
    await writeDoc(CHEMIN_PRESSE, { json: JSON.stringify(kit) }, { merge: true });
    setEtat(t.publie);
    window.setTimeout(() => setEtat(''), 2400);
  };

  const origine = () => changer(() => JSON.parse(JSON.stringify(KIT_DEFAUT)) as KitPresse);

  const pied = useMemo(() => ({ site: kit?.site ?? '', courriel: kit?.contact.courriel ?? '' }), [kit]);

  if (!kit) return <div className="p-6 text-gris">…</div>;

  const cartes = kit.cartes;
  const planches = kit.planches;
  const textes = kit.textes;
  const carte: CartePresse | undefined = cartes[Math.min(choisi, cartes.length - 1)];

  const majCarte = (i: number, champs: Partial<CartePresse>) =>
    changer((k) => ({ ...k, cartes: k.cartes.map((c, j) => (j === i ? { ...c, ...champs } : c)) }));
  const majPlanche = (i: number, champs: Partial<PlanchePresse>) =>
    changer((k) => ({ ...k, planches: k.planches.map((p, j) => (j === i ? { ...p, ...champs } : p)) }));
  const majTexte = (i: number, champs: Partial<TextePresse>) =>
    changer((k) => ({ ...k, textes: k.textes.map((x, j) => (j === i ? { ...x, ...champs } : x)) }));

  const deplacer = <X extends { n: string }>(liste: X[], i: number, pas: number): X[] => renumeroter(echanger(liste, i, pas));

  return (
    <div className="p-4 md:p-8 space-y-8">
      <EnTete
        kicker={t.kicker}
        titre={t.titre}
        lede={t.lede}
        actions={
          <>
            {etat && (
              <span className="text-sm text-rose flex items-center gap-1">
                <Check className="w-4 h-4" aria-hidden="true" />
                {etat}
              </span>
            )}
            <Bouton variante="secondaire" icone={RotateCcw} onClick={origine}>
              {t.origine}
            </Bouton>
            <Bouton onClick={publier}>{t.publier}</Bouton>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {(Object.keys(t.onglets) as Onglet[]).map((o) => (
          <Bouton key={o} variante={onglet === o ? 'primaire' : 'secondaire'} petit onClick={() => setOnglet(o)}>
            {t.onglets[o]}
          </Bouton>
        ))}
      </div>

      {onglet === 'cartes' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 space-y-2">
            {cartes.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setChoisi(i)}
                className={`w-full text-left rounded-champ border px-4 py-3 transition ${i === choisi ? 'border-rose bg-papier-2' : 'border-filet hover:border-encre'}`}
              >
                <span className="kicker text-gris">{c.n}</span>
                <span className="block font-medium text-encre truncate">{c.titre.FR || '—'}</span>
              </button>
            ))}
            <Bouton
              variante="secondaire"
              icone={Plus}
              petit
              className="w-full"
              onClick={() =>
                changer((k) => ({
                  ...k,
                  cartes: renumeroter([
                    ...k.cartes,
                    {
                      key: `carte-${Date.now()}`,
                      n: '',
                      photo: PHOTOS_DU_SITE[0],
                      cote: 'droite',
                      kicker: { FR: '', EN: '' },
                      titre: { FR: '', EN: '' },
                      corps: { FR: '', EN: '' },
                      meta: { FR: '', EN: '' },
                    },
                  ]),
                }))
              }
            >
              {t.ajouter}
            </Bouton>
          </div>

          {carte && (
            <>
              <div className="xl:col-span-5 space-y-5">
                <Panneau
                  titre={`${carte.n}`}
                  actions={
                    <>
                      <Bouton variante="discret" icone={ArrowUp} petit aria-label={t.monter} onClick={() => changer((k) => ({ ...k, cartes: deplacer(k.cartes, choisi, -1) }))} />
                      <Bouton variante="discret" icone={ArrowDown} petit aria-label={t.descendre} onClick={() => changer((k) => ({ ...k, cartes: deplacer(k.cartes, choisi, 1) }))} />
                      <Bouton
                        variante="danger"
                        icone={Trash2}
                        petit
                        onClick={() => {
                          changer((k) => ({ ...k, cartes: renumeroter(k.cartes.filter((_, j) => j !== choisi)) }));
                          setChoisi((v) => Math.max(0, v - 1));
                        }}
                      >
                        {t.supprimer}
                      </Bouton>
                    </>
                  }
                >
                  <div className="space-y-4">
                    <ChampBilingue label={t.kickerC} valeur={carte.kicker} onChange={(v) => majCarte(choisi, { kicker: v })} t={t} />
                    <ChampBilingue label={t.titreC} valeur={carte.titre} onChange={(v) => majCarte(choisi, { titre: v })} t={t} />
                    <ChampBilingue label={t.corpsC} valeur={carte.corps} onChange={(v) => majCarte(choisi, { corps: v })} lignes={5} t={t} />
                    <ChampBilingue label={t.metaC} valeur={carte.meta} onChange={(v) => majCarte(choisi, { meta: v })} t={t} />
                  </div>
                </Panneau>

                <Panneau titre={t.photo}>
                  <div className="space-y-5">
                    <ChoixPhoto valeur={carte.photo} onChange={(photo) => majCarte(choisi, { photo })} t={t} />
                    <Cadrage
                      photo={carte.photo}
                      cadrage={carte}
                      ratio={(1920 * (carte.largeur ?? 46)) / 100 / 1080}
                      onChange={(c) => majCarte(choisi, c)}
                      t={t}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gris">{t.cote}</span>
                      <Bouton variante={carte.cote === 'gauche' ? 'primaire' : 'secondaire'} petit onClick={() => majCarte(choisi, { cote: 'gauche' })}>
                        {t.gauche}
                      </Bouton>
                      <Bouton variante={carte.cote === 'droite' ? 'primaire' : 'secondaire'} petit onClick={() => majCarte(choisi, { cote: 'droite' })}>
                        {t.droite}
                      </Bouton>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gris flex-shrink-0">{t.largeur}</label>
                      <input
                        type="range"
                        min={34}
                        max={58}
                        step={1}
                        value={carte.largeur ?? 46}
                        onChange={(e) => majCarte(choisi, { largeur: Number(e.target.value) })}
                        className="w-full accent-[rgb(var(--c-rose-vif))]"
                      />
                      <span className="text-sm text-gris w-12 text-right">{carte.largeur ?? 46} %</span>
                    </div>
                  </div>
                </Panneau>
              </div>

              <div className="xl:col-span-4">
                <div className="xl:sticky xl:top-6">
                  <p className="kicker text-gris mb-3">{t.apercu}</p>
                  <CadreEchelle className="border border-filet rounded-champ">
                    <VisuelCarte carte={carte} lang={lang} pied={pied} />
                  </CadreEchelle>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {onglet === 'planches' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {planches.map((p, i) => (
            <Panneau
              key={p.key}
              titre={p.n}
              actions={
                <>
                  <Bouton variante="discret" icone={ArrowUp} petit aria-label={t.monter} onClick={() => changer((k) => ({ ...k, planches: deplacer(k.planches, i, -1) }))} />
                  <Bouton variante="discret" icone={ArrowDown} petit aria-label={t.descendre} onClick={() => changer((k) => ({ ...k, planches: deplacer(k.planches, i, 1) }))} />
                  <Bouton variante="danger" icone={Trash2} petit onClick={() => changer((k) => ({ ...k, planches: renumeroter(k.planches.filter((_, j) => j !== i)) }))}>
                    {t.supprimer}
                  </Bouton>
                </>
              }
            >
              <div className="flex gap-4">
                <img src={urlPhoto(p.photo)} alt="" className="w-28 flex-shrink-0 aspect-[3/4] rounded-champ object-cover" />
                <div className="min-w-0 flex-1 space-y-3">
                  <ChampBilingue label={t.legende} valeur={p.legende} onChange={(v) => majPlanche(i, { legende: v })} t={t} />
                  <Champ label={t.credit} value={p.credit} onChange={(e) => majPlanche(i, { credit: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <ChoixPhoto valeur={p.photo} onChange={(photo) => majPlanche(i, { photo })} t={t} />
              </div>
            </Panneau>
          ))}
          <Bouton
            variante="secondaire"
            icone={Plus}
            onClick={() =>
              changer((k) => ({
                ...k,
                planches: renumeroter([...k.planches, { key: `photo-${Date.now()}`, n: '', photo: PHOTOS_DU_SITE[0], legende: { FR: '', EN: '' }, credit: '' }]),
              }))
            }
          >
            {t.ajouter}
          </Bouton>
        </div>
      )}

      {onglet === 'textes' && (
        <div className="space-y-6">
          {textes.map((x, i) => (
            <Panneau
              key={x.key}
              actions={
                <>
                  <Bouton variante="discret" icone={ArrowUp} petit aria-label={t.monter} onClick={() => changer((k) => ({ ...k, textes: echanger(k.textes, i, -1) }))} />
                  <Bouton variante="discret" icone={ArrowDown} petit aria-label={t.descendre} onClick={() => changer((k) => ({ ...k, textes: echanger(k.textes, i, 1) }))} />
                  <Bouton variante="danger" icone={Trash2} petit onClick={() => changer((k) => ({ ...k, textes: k.textes.filter((_, j) => j !== i) }))}>
                    {t.supprimer}
                  </Bouton>
                </>
              }
            >
              <div className="space-y-4">
                <ChampBilingue label={t.titreT} valeur={x.titre} onChange={(v) => majTexte(i, { titre: v })} t={t} />
                <ChampBilingue label={t.texteT} valeur={x.texte} onChange={(v) => majTexte(i, { texte: v })} lignes={10} t={t} />
              </div>
            </Panneau>
          ))}
          <Bouton
            variante="secondaire"
            icone={Plus}
            onClick={() => changer((k) => ({ ...k, textes: [...k.textes, { key: `texte-${Date.now()}`, titre: { FR: '', EN: '' }, texte: { FR: '', EN: '' } }] }))}
          >
            {t.ajouter}
          </Bouton>
        </div>
      )}
    </div>
  );
};

export default AdminPresse;
