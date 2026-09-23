import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { toJpeg } from 'html-to-image';
import { Download, FileText, Image as ImageIcon, QrCode } from 'lucide-react';
import { Feuille, Reveal, TexteRevele } from '../components/motion';
import { CadreEchelle, VisuelCarte } from '../components/presse/CartePresse';
import { dit, urlPhoto, usePresse, type CartePresse, type PlanchePresse } from '../lib/presse-contenu';
import { octets, octetsTexte, zipper, type FichierZip } from '../lib/zip';
import { Language } from '../types';

// La salle de presse : ce qu'un journaliste vient chercher, et rien d'autre. Les cartes se rendent
// en direct à partir du kit que Laurie publie, et le bouton Télécharger capture ce même rendu à
// 1920 × 1080. Les photos, elles, partent telles quelles, dans leur taille et leur cadrage
// d'origine : une rédaction recadre elle-même, et un portrait écrasé au format 16:9 ne lui sert à rien.

const T = {
  FR: {
    kicker: 'Salle de presse',
    titre: 'De quoi parler\nde Laurie',
    lede: "Les visuels, les photographies et les textes sont libres d'usage pour couvrir son travail, ses projets et ses événements. Le tout se télécharge d'un seul geste, ou pièce par pièce.",
    tout: 'Tout le kit',
    prepare: 'Préparation du kit…',
    cartes: 'Les cartes',
    cartesLede: 'Cinq visuels prêts à publier, en 1920 × 1080.',
    planches: 'Les photographies',
    planchesLede: 'Les fichiers d\'origine, pleine résolution, avec leur crédit.',
    textes: 'Les textes',
    textesLede: 'À reprendre tels quels ou à couper selon la place.',
    telecharger: 'Télécharger',
    avecQr: 'Version code QR',
    copier: 'Copier le texte',
    copie: 'Copié',
    credit: 'Photo',
    contact: 'Pour une entrevue',
  },
  EN: {
    kicker: 'Press room',
    titre: 'Everything\nto write about',
    lede: 'The visuals, photographs and texts are free to use when covering her work, her projects and her events. Take the whole kit in one click, or one piece at a time.',
    tout: 'The whole kit',
    prepare: 'Preparing the kit…',
    cartes: 'The cards',
    cartesLede: 'Five visuals ready to publish, at 1920 × 1080.',
    planches: 'The photographs',
    planchesLede: 'The original files, full resolution, with their credit.',
    textes: 'The texts',
    textesLede: 'Use them as they are, or cut them to fit.',
    telecharger: 'Download',
    avecQr: 'QR code version',
    copier: 'Copy the text',
    copie: 'Copied',
    credit: 'Photo',
    contact: 'For an interview',
  },
};

/** Une demande de rendu hors écran : la carte à composer, et si elle porte le code QR. */
interface Demande {
  carte: CartePresse;
  qr: boolean;
}

const enregistrer = (donnee: string | Blob, nom: string) => {
  const a = document.createElement('a');
  a.href = typeof donnee === 'string' ? donnee : URL.createObjectURL(donnee);
  a.download = nom;
  a.click();
  if (typeof donnee !== 'string') setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};

const nomPhoto = (photo: string): string => urlPhoto(photo).split('/').pop()?.split('?')[0] || 'photo.jpg';

const PublicPresse: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = T[lang];
  const { kit } = usePresse();
  const hors = useRef<HTMLDivElement>(null);
  const [demande, setDemande] = useState<Demande | null>(null);
  const [avis, setAvis] = useState('');
  const [copie, setCopie] = useState('');

  const pied = { site: kit.site, courriel: kit.contact.courriel };

  /**
   * Compose la carte dans le conteneur hors écran, la capture, puis vide le conteneur. `flushSync`
   * force React à peindre avant la capture : sans lui, html-to-image photographierait le rendu
   * précédent, ou rien du tout.
   */
  const capturer = async (d: Demande): Promise<string> => {
    flushSync(() => setDemande(d));
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await document.fonts?.ready;
    const el = hors.current?.firstElementChild as HTMLElement | undefined;
    if (!el) throw new Error('rendu absent');
    try {
      return await toJpeg(el, { width: 1920, height: 1080, quality: 0.94, pixelRatio: 1, cacheBust: true });
    } finally {
      setDemande(null);
    }
  };

  const carteSeule = async (carte: CartePresse, qr: boolean) => {
    setAvis(t.prepare);
    try {
      enregistrer(await capturer({ carte, qr }), `${carte.n}-${carte.key}${qr ? '-qr' : ''}.jpg`);
    } finally {
      setAvis('');
    }
  };

  const planche = async (p: PlanchePresse) => {
    const r = await fetch(urlPhoto(p.photo));
    enregistrer(await r.blob(), `${p.n}-${nomPhoto(p.photo)}`);
  };

  const toutLeKit = async () => {
    setAvis(t.prepare);
    const pieces: FichierZip[] = [];
    try {
      for (const carte of kit.cartes) {
        const nu = await capturer({ carte, qr: false });
        pieces.push({ nom: `cartes/${carte.n}-${carte.key}.jpg`, data: await octets(nu) });
        const avecQr = await capturer({ carte, qr: true });
        pieces.push({ nom: `cartes/${carte.n}-${carte.key}-qr.jpg`, data: await octets(avecQr) });
      }
      for (const p of kit.planches) {
        pieces.push({ nom: `photos/${p.n}-${nomPhoto(p.photo)}`, data: await octets(urlPhoto(p.photo)) });
      }
      pieces.push({ nom: 'photos/credits.txt', data: octetsTexte(kit.planches.map((p) => `${p.n} · ${nomPhoto(p.photo)}\n${dit(p.legende, lang)}${p.credit ? `\n${t.credit} : ${p.credit}` : ''}\n`).join('\n')) });
      for (const x of kit.textes) {
        pieces.push({ nom: `textes/${x.key}.txt`, data: octetsTexte(`${dit(x.titre, lang)}\n\n${dit(x.texte, lang)}\n`) });
      }
      pieces.push({ nom: 'logo-xena-horizon.png', data: await octets('/images/logo-laurie.png') });
      enregistrer(zipper(pieces), `kit-presse-laurie-belhumeur${lang === 'EN' ? '-en' : ''}.zip`);
    } finally {
      setAvis('');
    }
  };

  const copier = async (cle: string, texte: string) => {
    await navigator.clipboard.writeText(texte);
    setCopie(cle);
    setTimeout(() => setCopie(''), 2200);
  };

  return (
    <div>
      {/* --- OUVERTURE --- */}
      <section className="px-gut pt-[calc(var(--nav)+3.5rem)] pb-16 min-h-[70svh] flex items-end">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-8 w-full">
          <div className="lg:col-span-8">
            <p className="kicker text-rose mb-5">{t.kicker}</p>
            <TexteRevele texte={t.titre} as="h1" par="mot" className="font-serif text-h1 whitespace-pre-line" />
          </div>
          <Reveal delay={0.3} className="lg:col-span-4 lg:self-end">
            <p className="text-lede text-gris">{t.lede}</p>
            <button
              type="button"
              onClick={toutLeKit}
              disabled={!!avis}
              className="mt-8 inline-flex items-center gap-3 rounded-pilule bg-bouton text-sur-bouton px-7 py-4 font-medium transition hover:bg-bouton-2 disabled:opacity-60"
            >
              <Download size={18} aria-hidden="true" />
              {avis || t.tout}
            </button>
          </Reveal>
        </div>
      </section>

      {/* --- LES CARTES --- */}
      <Feuille z={1} className="bg-papier px-gut py-feuille">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-serif text-h2">{t.cartes}</h2>
          <p className="text-gris mt-3">{t.cartesLede}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-col gap-y-14">
          {kit.cartes.map((carte, i) => (
            // Un nombre impair de cartes laissait la dernière seule à côté d'une colonne vide. Elle
            // prend maintenant toute la largeur, ce qui remplit la grille et met en valeur la carte
            // de contact, celle qu'un journaliste garde sous la main.
            <Reveal key={carte.key} as="article" className={i === kit.cartes.length - 1 && kit.cartes.length % 2 === 1 ? 'lg:col-span-2' : undefined}>
              <CadreEchelle className="border border-papier-2 shadow-panneau">
                <VisuelCarte carte={carte} lang={lang} pied={pied} />
              </CadreEchelle>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => carteSeule(carte, false)}
                  disabled={!!avis}
                  className="inline-flex items-center gap-2 rounded-pilule bg-bouton text-sur-bouton px-5 py-3 text-sm font-medium transition hover:bg-bouton-2 disabled:opacity-60"
                >
                  <Download size={16} aria-hidden="true" />
                  {t.telecharger}
                </button>
                <button
                  type="button"
                  onClick={() => carteSeule(carte, true)}
                  disabled={!!avis}
                  className="inline-flex items-center gap-2 rounded-pilule border border-trait px-5 py-3 text-sm font-medium text-rose transition hover:bg-papier-2 disabled:opacity-60"
                >
                  <QrCode size={16} aria-hidden="true" />
                  {t.avecQr}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </Feuille>

      {/* --- LES PHOTOGRAPHIES --- */}
      <Feuille z={2} className="bg-papier-2 px-gut py-feuille">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-serif text-h2">{t.planches}</h2>
          <p className="text-gris mt-3">{t.planchesLede}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-col gap-y-10">
          {kit.planches.map((p) => (
            <Reveal key={p.key} as="figure">
              <button type="button" onClick={() => planche(p)} className="group block w-full text-left">
                {/* Un visuel montré entier est plus court que sa case : il se cale en haut pour que la rangée
                    garde une ligne franche, et le reste de la case lui sert de passe-partout. */}
                <span className={`block w-full aspect-[3/4] overflow-hidden ${p.contenir ? 'bg-papier-2' : 'bg-papier'}`}>
                  <img src={urlPhoto(p.photo)} alt={dit(p.legende, lang)} loading="lazy" className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${p.contenir ? 'object-contain object-top' : 'object-cover'}`} />
                </span>
                <span className="mt-4 flex items-center gap-2 text-sm font-medium text-rose">
                  <ImageIcon size={15} aria-hidden="true" />
                  {t.telecharger}
                </span>
              </button>
              <figcaption className="mt-2 text-sm text-gris">
                {dit(p.legende, lang)}
                {p.credit && (
                  <span className="block mt-1 text-xs">
                    {t.credit} : {p.credit}
                  </span>
                )}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Feuille>

      {/* --- LES TEXTES --- */}
      <Feuille z={3} className="bg-papier px-gut py-feuille">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-serif text-h2">{t.textes}</h2>
          <p className="text-gris mt-3">{t.textesLede}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-12">
          {kit.textes.map((x) => (
            <Reveal key={x.key} as="article" className="lg:col-span-4">
              <h3 className="font-serif text-h3">{dit(x.titre, lang)}</h3>
              <p className="mt-4 whitespace-pre-line text-gris leading-relaxed">{dit(x.texte, lang)}</p>
              <button
                type="button"
                onClick={() => copier(x.key, dit(x.texte, lang))}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-rose transition hover:opacity-70"
              >
                <FileText size={15} aria-hidden="true" />
                {copie === x.key ? t.copie : t.copier}
              </button>
            </Reveal>
          ))}
        </div>
        <p className="mt-16 border-t border-papier-2 pt-8 text-gris">
          {t.contact} : <a href={`mailto:${kit.contact.courriel}`} className="text-rose hover:opacity-70">{kit.contact.courriel}</a> · {kit.contact.telephone}
        </p>
      </Feuille>

      {/* Le plateau de composition : hors de l'écran, à la vraie taille, le temps d'une capture. */}
      <div ref={hors} aria-hidden="true" style={{ position: 'fixed', left: -20000, top: 0, width: 1920, height: 1080, pointerEvents: 'none', opacity: 0 }}>
        {demande && <VisuelCarte carte={demande.carte} lang={lang} pied={pied} qr={demande.qr} />}
      </div>
    </div>
  );
};

export default PublicPresse;
