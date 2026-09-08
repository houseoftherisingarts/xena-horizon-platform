import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJETS, PROJETS_PAGE } from '../lib/contenu';
import { Atmosphere, Feuille, KenBurns, Parallax, Reveal, TexteRevele } from '../components/motion';
import { Language } from '../types';
import { useTextes } from '../lib/textes';

const [BALADO, LIVRE, MODELE] = PROJETS;
const para = (liste: string[] | undefined, i: number): string => liste?.[i] ?? '';
const lienFr = (projet: typeof BALADO, i: number): string => projet.liens[i]?.label ?? '';
const lienEn = (projet: typeof BALADO, i: number): string => projet.liens[i]?.labelEn ?? projet.liens[i]?.label ?? '';

const TEXTES = {
  FR: {
    ecouter: 'Balado',
    livre: 'Livre',
    titre: PROJETS_PAGE.titre,
    lede: PROJETS_PAGE.lede,
    baladoTitre: BALADO.titre,
    baladoSousTitre: BALADO.sousTitre,
    baladoP0: para(BALADO.description, 0),
    baladoP1: para(BALADO.description, 1),
    baladoP2: para(BALADO.description, 2),
    baladoLien0: lienFr(BALADO, 0),
    baladoLien1: lienFr(BALADO, 1),
    livreTitre: LIVRE.titre,
    livreSousTitre: LIVRE.sousTitre,
    livreP0: para(LIVRE.description, 0),
    livreP1: para(LIVRE.description, 1),
    livreP2: para(LIVRE.description, 2),
    livreExtra: LIVRE.extra ?? '',
    livreLien0: lienFr(LIVRE, 0),
    modeleTitre: MODELE.titre,
    modeleSousTitre: MODELE.sousTitre,
    modeleP0: para(MODELE.description, 0),
    modeleP1: para(MODELE.description, 1),
    modeleLien0: lienFr(MODELE, 0),
    modeleLien1: lienFr(MODELE, 1),
  },
  EN: {
    ecouter: 'Podcast',
    livre: 'Book',
    titre: PROJETS_PAGE.titreEn,
    lede: PROJETS_PAGE.ledeEn,
    baladoTitre: BALADO.titreEn,
    baladoSousTitre: BALADO.sousTitreEn,
    baladoP0: para(BALADO.descriptionEn, 0),
    baladoP1: para(BALADO.descriptionEn, 1),
    baladoP2: para(BALADO.descriptionEn, 2),
    baladoLien0: lienEn(BALADO, 0),
    baladoLien1: lienEn(BALADO, 1),
    livreTitre: LIVRE.titreEn,
    livreSousTitre: LIVRE.sousTitreEn,
    livreP0: para(LIVRE.descriptionEn, 0),
    livreP1: para(LIVRE.descriptionEn, 1),
    livreP2: para(LIVRE.descriptionEn, 2),
    livreExtra: LIVRE.extraEn ?? LIVRE.extra ?? '',
    livreLien0: lienEn(LIVRE, 0),
    modeleTitre: MODELE.titreEn,
    modeleSousTitre: MODELE.sousTitreEn,
    modeleP0: para(MODELE.descriptionEn, 0),
    modeleP1: para(MODELE.descriptionEn, 1),
    modeleLien0: lienEn(MODELE, 0),
    modeleLien1: lienEn(MODELE, 1),
  },
};

interface PublicProjetsProps {
  lang: Language;
}

/**
 * Le titre anglais des œuvres garde le nom propre suivi d'une traduction entre parenthèses
 * (« En quête de liberté (In Search of Freedom) »), trop long pour un h2 sur deux lignes.
 * On sépare : le nom propre reste le titre affiché, la traduction devient une légende dessous.
 */
const titreEtGlose = (titreEn: string): { nom: string; glose: string | null } => {
  const m = titreEn.match(/^(.*?)\s*\((.+)\)$/);
  return m ? { nom: m[1], glose: m[2] } : { nom: titreEn, glose: null };
};

const PublicProjets: React.FC<PublicProjetsProps> = ({ lang }) => {
  const t = useTextes('projets', TEXTES, lang);

  const titre = t.titre;
  const lede = t.lede;
  const [balado, livre, modele] = PROJETS;

  return (
    <div data-tx-scope="projets">
      {/* --- OUVERTURE TYPOGRAPHIQUE --- */}
      <section className="px-gut pt-[calc(var(--nav)+3.5rem)] pb-16 min-h-[70svh] flex items-end">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-6 w-full">
          <TexteRevele texte={titre} as="h1" par="mot" className="font-serif text-h1 lg:col-span-8" />
          <Reveal delay={0.3} as="p" className="text-lede text-gris lg:col-span-4 lg:self-end">
            {lede}
          </Reveal>
        </div>
      </section>

      {/* --- BALADO --- */}
      <Feuille z={1} className="bg-papier px-gut py-feuille">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10 items-start">
          <Parallax speed={0.12} className="lg:col-span-5">
            <img
              src={balado.image}
              alt={t.baladoTitre}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
          </Parallax>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="kicker text-rose mb-4">{t.ecouter}</p>
            <h2 className="font-serif text-h2">{titreEtGlose(t.baladoTitre).nom}</h2>
            {titreEtGlose(t.baladoTitre).glose && (
              <p className="text-petit text-gris mt-1">{titreEtGlose(t.baladoTitre).glose}</p>
            )}
            <div className="mt-6 space-y-4">
              {[t.baladoP0, t.baladoP1, t.baladoP2].filter(Boolean).map((p, i) => (
                <Reveal key={i} delay={i * 0.08} as="p" className="text-corps text-gris mesure">
                  {p}
                </Reveal>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {balado.liens.map((lien, i) => (
                <a
                  key={lien.url}
                  href={lien.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pilule inline-flex items-center gap-2 rounded-pilule border border-encre px-5 py-2.5 text-petit font-medium hover:bg-encre hover:text-papier transition-colors"
                >
                  {[t.baladoLien0, t.baladoLien1][i] || lien.label} <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Feuille>

      {/* --- LIVRE : la seule feuille d'encre --- */}
      <Feuille z={2} className="relative bg-bouton text-sur-bouton px-gut py-feuille overflow-hidden">
        <Atmosphere light="82% 10%" strength={0.7} />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10 items-start">
          <div className="lg:col-span-6">
            <p className="kicker text-rose-clair mb-4">{t.livre}</p>
            <h2 className="font-serif text-h2">{titreEtGlose(t.livreTitre).nom}</h2>
            {titreEtGlose(t.livreTitre).glose && (
              <p className="text-petit text-gris-clair mt-1">{titreEtGlose(t.livreTitre).glose}</p>
            )}
            <p className="font-serif text-h3 text-papier/80 mt-2">{t.livreSousTitre}</p>
            <div className="mt-6 space-y-4">
              {[t.livreP0, t.livreP1, t.livreP2].filter(Boolean).map((p, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.08}
                  as="p"
                  className={i === 2 ? 'text-petit text-gris-clair mesure' : 'text-corps text-papier/90 mesure'}
                >
                  {p}
                </Reveal>
              ))}
            </div>
            {t.livreExtra && (
              <p className="font-serif text-h3 mt-6">{t.livreExtra}</p>
            )}
            {livre.liens.length > 0 && (
              <a
                href={livre.liens[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="pilule inline-flex items-center gap-2 rounded-pilule bg-papier text-encre px-6 py-3 font-medium mt-6 hover:bg-papier-2 transition-colors"
              >
                {t.livreLien0 || livre.liens[0].label}{' '}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
          <Parallax speed={0.16} className="lg:col-span-5 lg:col-start-8">
            <img
              src="/images/livre-volume.jpg"
              alt={titreEtGlose(t.livreTitre).nom}
              loading="lazy"
              className="w-full h-auto"
            />
          </Parallax>
        </div>
      </Feuille>

      {/* --- MODÈLE ET COMÉDIENNE : plein cadre --- */}
      <Feuille z={3} className="relative bg-papier min-h-[100svh] overflow-hidden">
        <KenBurns
          src={modele.image}
          alt={t.modeleTitre}
          position="50% 22%"
          className="absolute inset-0"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/25 to-transparent" />
        <div className="relative px-gut py-feuille min-h-[100svh] flex items-end">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col w-full">
            <div className="lg:col-span-6">
              <p className="kicker text-rose-clair mb-4">{t.modeleSousTitre}</p>
              <h2 className="font-serif text-h2 text-papier">{t.modeleTitre}</h2>
              <div className="mt-6 space-y-4">
                {[t.modeleP0, t.modeleP1].filter(Boolean).map((p, i) => (
                  <Reveal key={i} delay={i * 0.08} as="p" className="text-corps text-papier/90 mesure">
                    {p}
                  </Reveal>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {modele.liens.map((lien, i) => (
                  <a
                    key={lien.url}
                    href={lien.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pilule inline-flex items-center gap-2 rounded-pilule border border-papier text-papier px-5 py-2.5 text-petit font-medium hover:bg-papier hover:text-encre transition-colors"
                  >
                    {[t.modeleLien0, t.modeleLien1][i] || lien.label} <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Feuille>
    </div>
  );
};

export default PublicProjets;
