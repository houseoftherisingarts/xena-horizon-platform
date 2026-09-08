// Contact — dernière feuille. Le courriel en display, cliquable, puis le formulaire
// à filets. Le seul morceau de logique porté depuis la v1 : l'écriture dans `leads`
// avec ses champs exacts, l'état d'attente et l'erreur visible.

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Feuille, Reveal } from '../../components/motion';
import { createDoc } from '../../lib/firestore';
import { COORDONNEES } from '../../lib/contenu';
import { LEGENDE_SCENE } from './textes';
import type { HomeContactBlock, Language } from '../../types';

export interface ContactProps {
  lang: Language;
  contact?: HomeContactBlock;
}

const t = {
  FR: {
    nom: 'Nom complet',
    courriel: 'Courriel',
    message: 'Message',
    aidePlaceholder: 'Comment puis-je vous aider ?',
    envoyer: 'Envoyer le message',
    envoi: 'Envoi en cours…',
    succesTitre: 'Message envoyé !',
    succesTexte: 'Merci. Je vous reviens sous peu.',
    erreur: "Désolée, l'envoi a échoué. Réessayez ou écrivez-moi directement.",
  },
  EN: {
    nom: 'Full name',
    courriel: 'Email',
    message: 'Message',
    aidePlaceholder: 'How can I help you?',
    envoyer: 'Send the message',
    envoi: 'Sending…',
    succesTitre: 'Message sent!',
    succesTexte: "Thanks. I'll get back to you shortly.",
    erreur: 'Sorry, the send failed. Try again or email me directly.',
  },
};

const Contact: React.FC<ContactProps> = ({ lang, contact }) => {
  const L = t[lang];
  const [nom, setNom] = useState('');
  const [courriel, setCourriel] = useState('');
  const [message, setMessage] = useState('');
  const [attente, setAttente] = useState(false);
  const [etat, setEtat] = useState<'idle' | 'success' | 'error'>('idle');

  const titre = contact?.title ?? (lang === 'FR' ? 'Discutons de\nta prochaine étape' : "Let's talk about\nyour next step");
  const texte =
    contact?.text ??
    (lang === 'FR'
      ? 'Écris-moi et je te reviens rapidement. Regardons ensemble si nous sommes faites pour travailler ensemble.'
      : "Write to me and I'll get back to you quickly. Let's see together if we're a good fit to work together.");

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attente) return;
    setAttente(true);
    setEtat('idle');
    try {
      await createDoc('leads', {
        name: nom.trim(),
        email: courriel.trim(),
        message: message.trim(),
        source: 'public-home-contact',
        read: false,
        archived: false,
      });
      setEtat('success');
      setNom('');
      setCourriel('');
      setMessage('');
    } catch (err) {
      console.error('Contact form submit failed', err);
      setEtat('error');
    } finally {
      setAttente(false);
    }
  };

  return (
    <Feuille z={6} className="bg-papier-2">
      <div id="contact" className="grid grid-cols-12 gap-x-col gap-y-10 px-gut py-feuille">
        <div className="col-span-12 sm:col-span-6">
          <Reveal as="h2" className="whitespace-pre-line text-h2 font-serif text-encre">
            {titre}
          </Reveal>
          <Reveal as="p" delay={0.06} className="mt-6 max-w-mesure text-lede font-sans font-light text-encre/80">
            {texte}
          </Reveal>

          <Reveal as="div" delay={0.12} className="mt-10">
            <a
              href={`mailto:${COORDONNEES.courriel}`}
              className="block break-words text-display font-serif text-encre transition-colors duration-200 hover:text-rose"
            >
              {COORDONNEES.courriel}
            </a>
            <p className="mt-4 text-lede font-sans font-light text-encre/80">
              <a href={COORDONNEES.telephoneHref} className="hover:text-rose">
                {COORDONNEES.telephone}
              </a>
            </p>
            <p className="mt-1 text-petit text-gris">{COORDONNEES.zones}</p>
          </Reveal>

          <Reveal as="form" delay={0.16} onSubmit={soumettre} className="mt-12 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className="text-petit font-semibold text-encre">
                {L.nom}
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="rounded-champ border border-filet bg-papier px-4 py-3 text-encre outline-none transition-colors duration-200 focus:border-rose"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className="text-petit font-semibold text-encre">
                {L.courriel}
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={courriel}
                onChange={(e) => setCourriel(e.target.value)}
                className="rounded-champ border border-filet bg-papier px-4 py-3 text-encre outline-none transition-colors duration-200 focus:border-rose"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className="text-petit font-semibold text-encre">
                {L.message}
              </label>
              <textarea
                id="contact-message"
                required
                minLength={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={L.aidePlaceholder}
                className="h-32 resize-none rounded-champ border border-filet bg-papier px-4 py-3 text-encre outline-none transition-colors duration-200 focus:border-rose"
              />
            </div>

            <div aria-live="polite">
              {etat === 'success' && (
                <div className="flex items-start gap-3 rounded-champ border border-rose/30 bg-rose/5 p-4 text-encre">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose" aria-hidden />
                  <div>
                    <p className="font-semibold">{L.succesTitre}</p>
                    <p className="text-petit text-encre/70">{L.succesTexte}</p>
                  </div>
                </div>
              )}
              {etat === 'error' && (
                <div className="flex items-start gap-3 rounded-champ border border-rose/30 bg-rose/5 p-4 text-encre">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose" aria-hidden />
                  <p className="text-petit">{L.erreur}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={attente}
              className="pilule inline-flex w-fit items-center justify-center rounded-pilule bg-encre px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-papier disabled:cursor-not-allowed disabled:opacity-60"
            >
              {attente ? L.envoi : L.envoyer}
            </button>
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
