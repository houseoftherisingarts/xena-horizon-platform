// TemoignagesAudio : la section « Ils en parlent » de l'accueil, entre le témoignage écrit
// d'Alexis Sénécal et le triptyque des projets. Liste asymétrique de témoignages à écouter,
// portée du site de Philippe Dufresne (signature.html, section .mur) : une rangée par voix,
// jamais trois gabarits identiques. Ne rend rien tant qu'aucun témoignage n'est publié.

import React, { useMemo } from 'react';
import { where } from 'firebase/firestore';
import { Feuille, Reveal, TexteRevele } from '../../components/motion';
import { LecteurAudio } from '../../components/LecteurAudio';
import { useCollection } from '../../lib/firestore';
import { useTextes } from '../../lib/textes';
import type { Language, TemoignageAudio as TemoignageAudioType } from '../../types';

export interface TemoignagesAudioProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    kicker: 'Ils en parlent',
    titre: "De vive voix,\ncelles et ceux qu'elle accompagne",
  },
  EN: {
    kicker: 'In their words',
    titre: 'In their own voice,\nthe people she supports',
  },
};

// Largeur du lecteur et position du texte, par rangée : de vraies proportions différentes
// d'une voix à l'autre, jamais le même gabarit répété deux fois de suite.
const GABARITS = [
  { lecteur: 'sm:col-span-4', texte: 'sm:col-span-7 sm:col-start-6' },
  { lecteur: 'sm:col-span-3', texte: 'sm:col-span-8 sm:col-start-5' },
  { lecteur: 'sm:col-span-4', texte: 'sm:col-span-6 sm:col-start-7' },
  { lecteur: 'sm:col-span-2', texte: 'sm:col-span-9 sm:col-start-4' },
];

const parOrdre = (a: TemoignageAudioType, b: TemoignageAudioType): number => {
  const oa = a.ordre ?? Number.MAX_SAFE_INTEGER;
  const ob = b.ordre ?? Number.MAX_SAFE_INTEGER;
  if (oa !== ob) return oa - ob;
  return (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0);
};

const TemoignagesAudio: React.FC<TemoignagesAudioProps> = ({ lang }) => {
  const t = useTextes('accueilTemoignagesAudio', TEXTES, lang);
  const { data } = useCollection<TemoignageAudioType>('temoignagesAudio', [where('publie', '==', true)]);
  const temoignages = useMemo(() => data.slice().sort(parOrdre), [data]);

  // Rien de publié : rien ne s'affiche, rien ne s'invente à sa place.
  if (temoignages.length === 0) return null;

  return (
    <Feuille z={4} className="bg-papier">
      <div data-tx-scope="accueilTemoignagesAudio" className="px-gut py-feuille">
        <div className="mb-14 sm:mb-16">
          <p className="kicker text-rose">{t.kicker}</p>
          <TexteRevele texte={t.titre} as="h2" par="mot" className="mt-3 max-w-[26ch] text-h2 font-serif text-encre" />
        </div>

        <div className="border-t border-filet">
          {temoignages.map((tem, i) => {
            const gabarit = GABARITS[i % GABARITS.length];
            const citation = lang === 'FR' ? `« ${tem.extrait} »` : `“${tem.extrait}”`;
            return (
              <Reveal
                key={tem.id}
                as="div"
                delay={Math.min(i * 0.06, 0.3)}
                className="grid grid-cols-12 items-start gap-x-col gap-y-6 border-b border-filet py-10 sm:items-center"
              >
                <div className={`col-span-12 ${gabarit.lecteur}`}>
                  <LecteurAudio src={tem.audioURL} nom={tem.nom} lang={lang} />
                </div>
                <div className={`col-span-12 ${gabarit.texte}`}>
                  {tem.extrait && <p className="text-h3 font-serif text-encre">{citation}</p>}
                  <p className="mt-4 font-sans font-semibold text-encre">{tem.nom}</p>
                  {tem.role && <p className="text-petit text-gris">{tem.role}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Feuille>
  );
};

export default TemoignagesAudio;
