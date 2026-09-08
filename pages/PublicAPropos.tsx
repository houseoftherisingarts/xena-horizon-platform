import React from 'react';
import { ArrowRight } from 'lucide-react';
import { A_PROPOS, BLOCS_ACCUEIL, BLOCS_ACCUEIL_EN, CREDITS } from '../lib/contenu';
import { Feuille, KenBurns, Parallax, Reveal, TexteRevele } from '../components/motion';
import { HomeStatsBlock, Language } from '../types';
import { useTextes } from '../lib/textes';

const TEXTES = {
  FR: {
    nom1: 'LAURIE',
    nom2: 'BELHUMEUR',
    tagline: A_PROPOS.tagline,
    titre: A_PROPOS.titre,
    p0: A_PROPOS.paragraphes[0],
    p1: A_PROPOS.paragraphes[1],
    chiffreKicker: 'ans à accompagner les artistes',
    amalgameKicker: 'Un amalgame inusité',
    c0: A_PROPOS.casquettesFR[0],
    c1: A_PROPOS.casquettesFR[1],
    c2: A_PROPOS.casquettesFR[2],
    c3: A_PROPOS.casquettesFR[3],
    c4: A_PROPOS.casquettesFR[4],
    c5: A_PROPOS.casquettesFR[5],
    c6: A_PROPOS.casquettesFR[6],
    c7: A_PROPOS.casquettesFR[7],
    c8: A_PROPOS.casquettesFR[8],
    mission: A_PROPOS.mission,
    surScene: 'Sur scène',
    enEvenement: 'En événement',
    credit: 'Crédit photo',
    rdvTitle: 'Discutons de\nta prochaine étape',
    rdv: 'Prendre rendez-vous',
  },
  EN: {
    nom1: 'LAURIE',
    nom2: 'BELHUMEUR',
    tagline: A_PROPOS.taglineEn,
    titre: A_PROPOS.titreEn,
    p0: A_PROPOS.paragraphesEn[0],
    p1: A_PROPOS.paragraphesEn[1],
    chiffreKicker: 'years supporting artists',
    amalgameKicker: 'An unusual amalgam',
    c0: A_PROPOS.casquettesEN[0],
    c1: A_PROPOS.casquettesEN[1],
    c2: A_PROPOS.casquettesEN[2],
    c3: A_PROPOS.casquettesEN[3],
    c4: A_PROPOS.casquettesEN[4],
    c5: A_PROPOS.casquettesEN[5],
    c6: A_PROPOS.casquettesEN[6],
    c7: A_PROPOS.casquettesEN[7],
    c8: A_PROPOS.casquettesEN[8],
    mission: A_PROPOS.missionEn,
    surScene: 'On stage',
    enEvenement: 'At an event',
    credit: 'Photo credit',
    rdvTitle: "Let's talk about\nyour next step",
    rdv: 'Book a call',
  },
};

/** Gabarit provisoire retiré (chantier B) : voici la page À propos v2. */
const PublicAPropos: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useTextes('aPropos', TEXTES, lang);
  const paragraphes = [t.p0, t.p1];
  const casquettes = [t.c0, t.c1, t.c2, t.c3, t.c4, t.c5, t.c6, t.c7, t.c8];
  const stats = BLOCS_ACCUEIL.find((b) => b.type === 'STATS') as HomeStatsBlock | undefined;
  const stat1Value = lang === 'EN' ? BLOCS_ACCUEIL_EN['stats-1'].stat1Value : stats?.stat1Value;
  const stat2Label = lang === 'EN' ? BLOCS_ACCUEIL_EN['stats-1'].stat2Label : stats?.stat2Label;

  return (
    <div data-tx-scope="aPropos">
      {/* --- OUVERTURE : le nom --- */}
      <section className="px-gut pt-[calc(var(--nav)+2.5rem)] pb-16 grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10 items-start">
        <div className="lg:col-span-8">
          <TexteRevele texte={`${t.nom1}\n${t.nom2}`} as="h1" par="lettre" className="font-serif text-h1" />
          <Reveal delay={0.5} as="p" className="kicker text-rose mt-6">
            {lang === 'EN' ? A_PROPOS.taglineEn : A_PROPOS.tagline}
          </Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9 relative aspect-[3/4] overflow-hidden">
          <KenBurns
            src="/images/laurie-apropos.jpg"
            alt="Laurie Belhumeur"
            position="50% 25%"
            className="absolute inset-0"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/5 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--papier), transparent)' }}
          />
        </Reveal>
      </section>

      {/* --- BRÈVE HISTOIRE D'UN TOUT --- */}
      <Feuille z={1} className="bg-papier px-gut py-feuille">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col">
          <div className="lg:col-span-7 lg:col-start-2">
            <TexteRevele texte={lang === 'EN' ? A_PROPOS.titreEn : A_PROPOS.titre} as="h2" par="mot" className="font-serif text-h2" />
            <div className="mt-6 space-y-4">
              {paragraphes.map((p, i) => (
                <Reveal key={i} delay={i * 0.1} as="p" className="text-corps text-gris mesure">
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
          {stat1Value && (
            <Reveal delay={0.2} className="lg:col-span-3 lg:col-start-10 text-left lg:text-right mt-10 lg:mt-0">
              <p className="font-serif text-chiffre">{String(stat1Value).replace(/\D/g, '') || stat1Value}</p>
              <p className="text-petit text-gris mt-2">{t.chiffreKicker}</p>
            </Reveal>
          )}
        </div>
      </Feuille>

      {/* --- UN AMALGAME INUSITÉ --- */}
      <Feuille z={2} className="bg-papier-2 px-gut py-feuille">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10">
          <h2 className="font-serif text-h2 lg:col-span-4">{t.amalgameKicker}</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            {casquettes.map((c, i) => (
              <Reveal key={c} delay={i * 0.06} as="p" className="group border-t border-filet py-4 font-serif text-h3">
                <span className="group-hover:text-rose transition-colors">{c}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </Feuille>

      {/* --- LA MISSION --- */}
      <Feuille z={3} className="bg-papier px-gut py-bloc">
        {/* Taille sur mesure : la phrase réelle (69 caractères) ne tient sur deux lignes ni en text-display
            ni en text-h2 à 390 ou 1440 ; on ne raccourcit pas la mission de Laurie, on ajuste le corps. */}
        <TexteRevele
          texte={lang === 'EN' ? A_PROPOS.missionEn : A_PROPOS.mission}
          as="p"
          par="mot"
          className="font-serif text-[clamp(1.15rem,0.85rem+2.4vw,2.75rem)] leading-[1.15] lg:max-w-[90%]"
        />
        {stat2Label && (
          <Reveal delay={0.2} as="p" className="kicker text-gris mt-8">
            {stat2Label}
          </Reveal>
        )}
      </Feuille>

      {/* --- PLANCHE --- */}
      <Feuille z={4} className="bg-papier-2 px-gut py-feuille">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-10">
          <Parallax speed={0.1} className="lg:col-span-7">
            <img src="/images/laurie-portrait-2.jpg" alt={t.surScene} loading="lazy" className="w-full aspect-[4/5] object-cover" />
            <p className="text-petit text-gris mt-3">{t.surScene}</p>
          </Parallax>
          <Parallax speed={0.18} className="lg:col-span-4 lg:col-start-9 lg:mt-[10vh]">
            <img src="/images/laurie-portrait-1.jpg" alt={t.enEvenement} loading="lazy" className="w-full aspect-[4/5] object-cover" />
            <p className="text-petit text-gris mt-3">{t.enEvenement}</p>
          </Parallax>
        </div>
      </Feuille>

      {/* --- CRÉDITS ET RENDEZ-VOUS --- */}
      <Feuille z={5} className="bg-papier px-gut py-bloc">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-8 items-end">
          <div className="lg:col-span-7">
            <TexteRevele texte={t.rdvTitle} as="h2" par="mot" className="font-serif text-h2" />
            <a
              href="/#contact"
              className="pilule mt-6 inline-flex items-center gap-2 rounded-pilule bg-encre text-papier px-7 py-3.5 font-medium hover:bg-encre-2 transition-colors"
            >
              {t.rdv} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <Reveal className="lg:col-span-5 text-petit text-gris">
            {t.credit} : {CREDITS.photographes.join(', ')}
          </Reveal>
        </div>
      </Feuille>
    </div>
  );
};

export default PublicAPropos;
