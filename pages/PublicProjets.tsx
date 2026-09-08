import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJETS, PROJETS_PAGE } from '../lib/contenu';
import { Atmosphere, Feuille, KenBurns, Parallax, Reveal, TexteRevele } from '../components/motion';
import { Language } from '../types';
import { useTextes } from '../lib/textes';

const TEXTES = {
  FR: { ecouter: 'Balado', livre: 'Livre', titre: PROJETS_PAGE.titre, lede: PROJETS_PAGE.lede },
  EN: { ecouter: 'Podcast', livre: 'Book', titre: PROJETS_PAGE.titreEn, lede: PROJETS_PAGE.ledeEn },
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
              alt={lang === 'EN' ? balado.titreEn : balado.titre}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
          </Parallax>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="kicker text-rose mb-4">{t.ecouter}</p>
            <h2 className="font-serif text-h2">{lang === 'EN' ? titreEtGlose(balado.titreEn).nom : balado.titre}</h2>
            {lang === 'EN' && titreEtGlose(balado.titreEn).glose && (
              <p className="text-petit text-gris mt-1">{titreEtGlose(balado.titreEn).glose}</p>
            )}
            <div className="mt-6 space-y-4">
              {(lang === 'EN' ? balado.descriptionEn : balado.description).map((p, i) => (
                <Reveal key={i} delay={i * 0.08} as="p" className="text-corps text-gris mesure">
                  {p}
                </Reveal>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {balado.liens.map((lien) => (
                <a
                  key={lien.url}
                  href={lien.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pilule inline-flex items-center gap-2 rounded-pilule border border-encre px-5 py-2.5 text-petit font-medium hover:bg-encre hover:text-papier transition-colors"
                >
                  {lang === 'EN' ? lien.labelEn ?? lien.label : lien.label} <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Feuille>

      {/* --- LIVRE : la seule feuille d'encre --- */}
      <Feuille z={2} className="relative bg-encre text-papier px-gut py-feuille overflow-hidden">
        <Atmosphere light="82% 10%" strength={0.7} />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10 items-start">
          <div className="lg:col-span-6">
            <p className="kicker text-rose-clair mb-4">{t.livre}</p>
            <h2 className="font-serif text-h2">{lang === 'EN' ? titreEtGlose(livre.titreEn).nom : livre.titre}</h2>
            {lang === 'EN' && titreEtGlose(livre.titreEn).glose && (
              <p className="text-petit text-gris-clair mt-1">{titreEtGlose(livre.titreEn).glose}</p>
            )}
            <p className="font-serif text-h3 text-papier/80 mt-2">{lang === 'EN' ? livre.sousTitreEn : livre.sousTitre}</p>
            <div className="mt-6 space-y-4">
              {(lang === 'EN' ? livre.descriptionEn : livre.description).map((p, i) => (
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
            {livre.extra && (
              <p className="font-serif text-h3 mt-6">{lang === 'EN' ? livre.extraEn ?? livre.extra : livre.extra}</p>
            )}
            {livre.liens.length > 0 && (
              <a
                href={livre.liens[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="pilule inline-flex items-center gap-2 rounded-pilule bg-papier text-encre px-6 py-3 font-medium mt-6 hover:bg-papier-2 transition-colors"
              >
                {lang === 'EN' ? livre.liens[0].labelEn ?? livre.liens[0].label : livre.liens[0].label}{' '}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
          <Parallax speed={0.16} className="lg:col-span-5 lg:col-start-8">
            <img
              src="/images/livre-volume.jpg"
              alt={lang === 'EN' ? livre.titreEn : livre.titre}
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
          alt={lang === 'EN' ? modele.titreEn : modele.titre}
          position="50% 22%"
          className="absolute inset-0"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/25 to-transparent" />
        <div className="relative px-gut py-feuille min-h-[100svh] flex items-end">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col w-full">
            <div className="lg:col-span-6">
              <p className="kicker text-rose-clair mb-4">{modele.sousTitre}</p>
              <h2 className="font-serif text-h2 text-papier">{lang === 'EN' ? modele.titreEn : modele.titre}</h2>
              <div className="mt-6 space-y-4">
                {(lang === 'EN' ? modele.descriptionEn : modele.description).map((p, i) => (
                  <Reveal key={i} delay={i * 0.08} as="p" className="text-corps text-papier/90 mesure">
                    {p}
                  </Reveal>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {modele.liens.map((lien) => (
                  <a
                    key={lien.url}
                    href={lien.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pilule inline-flex items-center gap-2 rounded-pilule border border-papier text-papier px-5 py-2.5 text-petit font-medium hover:bg-papier hover:text-encre transition-colors"
                  >
                    {lien.label} <ArrowUpRight className="w-3.5 h-3.5" />
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
