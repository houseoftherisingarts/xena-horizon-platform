// Faq — questions fréquentes au bas de /services, avant le rendez-vous final. Porté du
// FAQ 06 de hirael (MIT, Mohammad Shehadeh) tel que fourni par Alex : badge qui s'ouvre au
// défilement, titre révélé mot à mot en deux tons, lede, cartes qui montent l'une après
// l'autre, plusieurs réponses ouvertes à la fois, révélation animée, état ouvert teinté.
// Mise en page pleine largeur à gauche (canon du client, jamais de colonne centrée).
// Contenu strictement tiré de SERVICES_REELS, PROFILS_REELS et COORDONNEES (lib/contenu.ts),
// et du parcours de rendez-vous décrit dans CLAUDE.md : aucun chiffre, aucun délai,
// aucune promesse qui n'existe pas déjà ailleurs sur le site.

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { ChevronDown } from 'lucide-react';
import { useTextes } from '../lib/textes';
import type { Language } from '../types';

export interface FaqProps {
  lang: Language;
}

const TEXTES = {
  FR: {
    kicker: 'Questions fréquentes',
    titre: 'Avant de prendre rendez-vous',
    lede: 'Les questions qui reviennent avant un premier rendez-vous.',
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
    titre: 'Before you book a call',
    lede: 'The questions that come up before a first appointment.',
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
const VUE = { once: true, amount: 0.3 } as const;

const Faq: React.FC<FaqProps> = ({ lang }) => {
  const t = useTextes('faq', TEXTES, lang);
  const reduit = useReducedMotion();
  const [ouvertes, setOuvertes] = useState<Set<number>>(() => new Set([0]));

  const basculer = (i: number) =>
    setOuvertes((prev) => {
      const suivant = new Set(prev);
      if (suivant.has(i)) suivant.delete(i);
      else suivant.add(i);
      return suivant;
    });

  const questions = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t[`q${i}` as keyof typeof t],
    a: t[`a${i}` as keyof typeof t],
  }));
  const mots = t.titre.split(/\s+/);
  const moitie = Math.floor(mots.length / 2);
  const depart = (delai: number, y = 20) =>
    reduit ? {} : { initial: { opacity: 0, y }, whileInView: { opacity: 1, y: 0 }, viewport: VUE, transition: { duration: 0.5, ease: EASE, delay: delai } };

  return (
    <div data-tx-scope="faq" className="px-gut py-feuille">
      <motion.p
        className="inline-flex rounded-pilule border border-filet bg-papier/70 px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.14em] text-gris backdrop-blur-sm"
        {...(reduit
          ? {}
          : { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, viewport: VUE, transition: { duration: 0.5, ease: EASE, delay: 0.2 } })}
      >
        {t.kicker}
      </motion.p>

      <h2 className="mt-5 max-w-3xl font-serif text-h2 leading-[1.04] tracking-tight [text-wrap:balance]">
        {mots.map((mot, i) => (
          <motion.span
            key={`${mot}-${i}`}
            className={`mr-[0.25em] inline-block ${i < moitie ? 'text-gris' : 'text-encre'}`}
            {...depart(0.2 + i * 0.08, 16)}
          >
            {mot}
          </motion.span>
        ))}
      </h2>

      <motion.p className="mesure mt-4 text-lede text-gris" {...depart(0.4)}>
        {t.lede}
      </motion.p>

      <div className="mt-10 flex flex-col gap-3">
        {questions.map((item, i) => {
          const estOuvert = ouvertes.has(i);
          return (
            <motion.div
              key={i}
              {...(reduit
                ? {}
                : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: VUE, transition: { duration: 0.45, ease: EASE, delay: i * 0.1 } })}
              className={`rounded-champ border border-filet px-4 transition-colors md:px-6 ${estOuvert ? 'bg-papier-2' : 'bg-papier'}`}
            >
              <button
                type="button"
                aria-expanded={estOuvert}
                aria-controls={`faq-reponse-${i}`}
                onClick={() => basculer(i)}
                className="flex min-h-[44px] w-full items-center justify-between gap-6 py-4 text-left"
              >
                <span className="font-sans text-base font-medium text-encre md:text-lg">{item.q}</span>
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
                    <p className="mesure pb-5 text-corps text-gris">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;
