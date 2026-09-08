// Contact : dernière feuille. Le courriel en display, cliquable, le téléphone, les zones, et le seul
// geste qui compte : « Prendre rendez-vous », qui ouvre le compte de la personne (la porte de l'espace)
// puis son onglet Rendez-vous, où elle choisit son moment dans l'agenda de Laurie. Plus de formulaire :
// le compte, le dossier et la rencontre vivent au même endroit (décision d'Alex, 8 septembre 2026).

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Feuille, Reveal } from '../../components/motion';
import { COORDONNEES } from '../../lib/contenu';
import { useTextes } from '../../lib/textes';
import { allerAuRendezVous } from '../../lib/rendezvous';
import { ALT_PHOTO_CONTACT, LEGENDE_SCENE } from './textes';
import type { Language } from '../../types';

export interface ContactProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    titre: 'Discutons de\nta prochaine étape',
    texte: "Prends rendez-vous : ton espace s'ouvre en une minute et tu choisis toi-même ton moment dans mon agenda. Regardons ensemble si nous sommes faites pour travailler ensemble.",
    rdv: 'Prendre rendez-vous',
    rdvNote: 'Rencontre vidéo de 45 minutes, sans engagement.',
  },
  EN: {
    titre: "Let's talk about\nyour next step",
    texte: 'Book a call: your space opens in a minute and you pick your own time in my calendar. Let us see together if we are a good fit to work together.',
    rdv: 'Book a call',
    rdvNote: 'A 45-minute video call, no strings attached.',
  },
};

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const L = useTextes('contact', TEXTES, lang);

  return (
    <Feuille z={7} className="bg-papier-2">
      <div id="contact" data-tx-scope="contact" className="grid grid-cols-12 gap-x-col gap-y-10 px-gut py-feuille">
        <div className="col-span-12 sm:col-span-6">
          <Reveal as="h2" className="whitespace-pre-line text-h2 font-serif text-encre">
            {L.titre}
          </Reveal>
          <Reveal as="p" delay={0.06} className="mt-6 max-w-mesure text-lede font-sans font-light text-encre/80">
            {L.texte}
          </Reveal>

          <Reveal as="div" delay={0.12} className="mt-10">
            <button
              type="button"
              onClick={allerAuRendezVous}
              className="pilule inline-flex items-center gap-3 rounded-pilule bg-bouton px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-sur-bouton hover:bg-bouton-2"
            >
              {L.rdv}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p className="mt-3 text-petit text-gris">{L.rdvNote}</p>
          </Reveal>

          <Reveal as="div" delay={0.16} className="mt-12">
            <a
              href={`mailto:${COORDONNEES.courriel}`}
              className="block break-all text-h3 font-serif text-encre transition-colors duration-200 hover:text-rose hover:underline"
            >
              {COORDONNEES.courriel}
            </a>
            <p className="-mt-3 text-lede font-sans font-light text-encre/80">
              <a href={COORDONNEES.telephoneHref} className="inline-block py-3 pt-7 hover:text-rose">
                {COORDONNEES.telephone}
              </a>
            </p>
            <p className="mt-1 text-petit text-gris">{COORDONNEES.zones}</p>
          </Reveal>
        </div>

        <Reveal as="div" delay={0.1} className="col-span-12 sm:col-span-5 sm:col-start-8">
          <img
            src="/images/laurie-portrait-2.jpg"
            alt="Laurie Belhumeur, sur scène au micro"
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover"
          />
          <p className="mt-3 text-petit text-gris">{LEGENDE_SCENE[lang]}</p>
        </Reveal>
      </div>
    </Feuille>
  );
};

export default Contact;
