import React from 'react';
import { Check } from 'lucide-react';
import { indexEtape, EtapeDefEn } from '../../lib/dossier';
import { Dossier, DossierConfig, EtapeDef, Language } from '../../types';
import { Reveal } from '../motion';
import { useTextes } from '../../lib/textes';

interface ParcoursProps {
  dossier: Dossier;
  config: DossierConfig;
  lang: Language;
}

const TEXTES = {
  FR: { parcoursTitre: 'Ton parcours', parcoursSous: 'Le chemin entre le premier contact et le suivi.' },
  EN: { parcoursTitre: 'Your journey', parcoursSous: 'The road between the first contact and the follow-up.' },
};

/** Titre/sous-titre d'une étape selon la langue, avec repli sur le français (catalogue Firestore sans champs anglais). */
const titreEtape = (etape: EtapeDef, lang: Language): string => {
  const e = etape as EtapeDefEn;
  return lang === 'EN' && e.titreEn ? e.titreEn : etape.titre;
};
const sousEtape = (etape: EtapeDef, lang: Language): string => {
  const e = etape as EtapeDefEn;
  return lang === 'EN' && e.sousEn ? e.sousEn : etape.sous;
};

const Parcours: React.FC<ParcoursProps> = ({ dossier, config, lang }) => {
  const idx = indexEtape(config.etapes, dossier.etape);

  const t = useTextes('espaceParcours', TEXTES, lang);

  return (
    <section data-tx-scope="espaceParcours" className="border-t border-filet pt-8">
      <h2 className="font-serif text-h3 text-encre mb-1">{t.parcoursTitre}</h2>
      <p className="text-gris text-sm mb-10 mesure">{t.parcoursSous}</p>

      <ol className="relative">
        {config.etapes.map((etape, i) => {
          const faite = i < idx;
          const ici = i === idx;
          return (
            <Reveal key={etape.id} as="li" delay={0.06 * i} y={16} className="relative pl-14 pb-10 last:pb-0">
              {i < config.etapes.length - 1 && (
                <span aria-hidden="true" className={`absolute left-[19px] top-10 bottom-[-8px] w-px ${faite ? 'bg-trait' : 'bg-filet'}`} />
              )}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 w-10 h-10 rounded-pilule flex items-center justify-center font-serif text-lg border ${
                  faite
                    ? 'bg-rose border-rose text-papier'
                    : ici
                    ? 'border-2 border-rose text-rose'
                    : 'border-filet text-gris'
                }`}
              >
                {faite ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <p className={`font-sans font-semibold ${ici ? 'text-encre text-lg' : faite ? 'text-encre' : 'text-gris'}`}>
                {titreEtape(etape, lang)}
              </p>
              <p className={`text-sm mt-1 mesure ${ici ? 'text-gris' : 'text-gris/80'}`}>{sousEtape(etape, lang)}</p>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
};

export default Parcours;
