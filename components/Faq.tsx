// Faq — questions fréquentes, une réponse ouverte à la fois. Monté au bas de /services,
// avant le rendez-vous final. Contenu strictement tiré de SERVICES_REELS, PROFILS_REELS et
// COORDONNEES (lib/contenu.ts), et du parcours de rendez-vous décrit dans CLAUDE.md : aucun
// chiffre, aucun délai, aucune promesse qui n'existe pas déjà ailleurs sur le site.
// Porté du FAQ accordion (faq-06) de hirael (21st.dev) : une réponse à la fois, hauteur
// animée par framer-motion, chevron qui pivote, aria-expanded / aria-controls, cibles 44 px.

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

export interface FaqProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    kicker: 'Questions fréquentes',
    titre: 'Avant de\nprendre rendez-vous',
    q1: 'Comment se passe un rendez-vous avec Laurie ?',
    a1: 'Tu cliques sur Prendre rendez-vous, tu crées ton compte, puis tu choisis un moment parmi les disponibilités de Laurie. Elle confirme ta demande, et la rencontre vidéo se tient directement dans ton espace client, sur le site.',
    q2: "À qui s'adresse l'accompagnement de Laurie ?",
    a2: 'Aux artistes de toutes disciplines, aux créatifs et entrepreneurs, et aux organisations et entreprises. Tu trouves plus haut sur cette page ce qui te correspond, selon ton profil.',
    q3: "En quoi consiste l'abonnement mensuel ?",
    a3: "Trois questions par mois pour les besoins spontanés qui n'ont pas besoin d'une consultation complète, dès 99 $ par mois, avec un engagement minimum de trois mois.",
    q4: 'Combien coûte un accompagnement ?',
    a4: 'Ça dépend du service : la stratégie de communication part à 3 500 $ + taxes, la rédaction à 1 000 $ + taxes, et l’abonnement mensuel à 99 $ par mois. Les formations, conférences et stratégies événementielles sont sur demande, le prix se précise avec toi.',
    q5: 'Où Laurie offre-t-elle ses services ?',
    a5: 'À Montréal, en Montérégie et en Estrie. Les rendez-vous se tiennent en vidéo dans ton espace client, alors la distance n’est jamais un obstacle.',
    q6: 'Est-ce que je peux annuler ou déplacer mon rendez-vous ?',
    a6: 'Depuis ton espace client, tu peux annuler ton rendez-vous. Laurie confirme chaque nouvelle demande selon ses disponibilités.',
  },
  EN: {
    kicker: 'Frequently asked questions',
    titre: 'Before you\nbook a call',
    q1: 'How does an appointment with Laurie work?',
    a1: "You click Book an appointment, you create your account, then you choose a time among Laurie's availabilities. She confirms your request, and the video meeting takes place right in your client space, on the site.",
    q2: 'Who is this support for?',
    a2: 'Artists of every discipline, creatives and entrepreneurs, and organizations and businesses. You can find what fits your profile further up this page.',
    q3: 'What does the monthly subscription include?',
    a3: "Three questions a month for the spontaneous needs that don't require a full consultation, from $99 a month, with a three-month minimum commitment.",
    q4: 'How much does support cost?',
    a4: 'It depends on the service: communication strategy starts at $3,500 + taxes, writing at $1,000 + taxes, and the monthly subscription at $99 a month. Training, conferences and event strategy are on request, the price gets set with you.',
    q5: 'Where does Laurie offer her services?',
    a5: 'In Montreal, the Montérégie and the Eastern Townships. Appointments are held by video in your client space, so distance is never an obstacle.',
    q6: 'Can I cancel or move my appointment?',
    a6: 'From your client space, you can cancel your appointment. Laurie confirms every new request based on her availability.',
  },
};

const EASE = [0.16, 0.8, 0.24, 1] as const;

const Faq: React.FC<FaqProps> = ({ lang }) => {
  const t = useTextes('faq', TEXTES, lang);
  const [ouvert, setOuvert] = useState(0);
  const reduit = useReducedMotion();

  const questions = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t[`q${i}` as keyof typeof t],
    a: t[`a${i}` as keyof typeof t],
  }));

  return (
    <div data-tx-scope="faq" className="px-gut py-feuille">
      <p className="kicker text-rose">{t.kicker}</p>
      <h2 className="mt-4 whitespace-pre-line font-serif text-h2">{t.titre}</h2>

      <div className="mt-10 border-t border-filet">
        {questions.map((item, i) => {
          const estOuvert = ouvert === i;
          return (
            <div key={i} className="border-b border-filet">
              <button
                type="button"
                aria-expanded={estOuvert}
                aria-controls={`faq-reponse-${i}`}
                onClick={() => setOuvert((v) => (v === i ? -1 : i))}
                className="flex min-h-[44px] w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-semibold text-encre">{item.q}</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: estOuvert ? 180 : 0 }}
                  transition={{ duration: reduit ? 0 : 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-gris" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {estOuvert && (
                  <motion.div
                    id={`faq-reponse-${i}`}
                    role="region"
                    initial={reduit ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduit ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduit ? 0 : 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="mesure pb-6 text-corps text-gris">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;
