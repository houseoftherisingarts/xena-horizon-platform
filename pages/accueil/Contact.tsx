// Contact : dernière feuille. Le courriel en display, cliquable, puis le formulaire à filets.
// Prendre rendez-vous ouvre en même temps l'espace de la personne : le message devient la première
// ligne de son dossier, un courriel lui arrive pour choisir son mot de passe, et le formulaire
// l'invite à entrer tout de suite. Si un compte existe déjà, le message part quand même (`leads`).

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, type AuthError } from 'firebase/auth';
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { auth } from '../../firebase';
import { Feuille, Reveal } from '../../components/motion';
import { createDoc, writeDoc } from '../../lib/firestore';
import { nouveauDossier } from '../../lib/dossier';
import { COORDONNEES } from '../../lib/contenu';
import { useTextes } from '../../lib/textes';
import { LEGENDE_SCENE } from './textes';
import type { Language, ViewState } from '../../types';

export interface ContactProps {
  lang: Language;
  onChangeView?: (view: ViewState) => void;
}

const TEXTES = {
  FR: {
    titre: 'Discutons de\nta prochaine étape',
    texte: 'Écris-moi et je te reviens rapidement. Regardons ensemble si nous sommes faites pour travailler ensemble.',
    nom: 'Nom complet',
    courriel: 'Courriel',
    message: 'Message',
    aidePlaceholder: 'Comment puis-je vous aider ?',
    envoyer: 'Prendre rendez-vous',
    envoi: 'Envoi en cours…',
    noteTitre: "C'est noté.",
    compteTexte:
      "Laurie te revient sous peu. Ton espace est déjà ouvert avec ton message dedans, et un courriel t'attend pour choisir ton mot de passe : il te ramène dans ton dossier depuis n'importe quel appareil.",
    existantTexte: 'Laurie te revient sous peu. Tu as déjà un espace ici : connecte-toi pour suivre ton dossier et lui écrire au même endroit.',
    connecteTexte: 'Laurie te revient sous peu, et tu peux lui écrire directement depuis ton espace.',
    leadTexte: 'Merci. Laurie te revient sous peu.',
    ouvrirEspace: 'Ouvrir mon espace',
    erreur: "Désolée, l'envoi a échoué. Réessaie ou écris-moi directement.",
  },
  EN: {
    titre: "Let's talk about\nyour next step",
    texte: "Write to me and I'll get back to you quickly. Let's see together if we're a good fit to work together.",
    nom: 'Full name',
    courriel: 'Email',
    message: 'Message',
    aidePlaceholder: 'How can I help you?',
    envoyer: 'Book a call',
    envoi: 'Sending…',
    noteTitre: 'Noted.',
    compteTexte:
      'Laurie will get back to you shortly. Your space is already open with your message in it, and an email is waiting for you to choose your password: it brings you back to your file from any device.',
    existantTexte: 'Laurie will get back to you shortly. You already have a space here: sign in to follow your file and write to her in the same place.',
    connecteTexte: 'Laurie will get back to you shortly, and you can write to her directly from your space.',
    leadTexte: 'Thanks. Laurie will get back to you shortly.',
    ouvrirEspace: 'Open my space',
    erreur: 'Sorry, the send failed. Try again or email me directly.',
  },
};

type Etat = 'idle' | 'compte' | 'existant' | 'connecte' | 'lead' | 'error';

/** Un mot de passe de 48 caractères que personne ne connaît : la personne choisit le sien par le courriel. */
const motDePasseAleatoire = (): string => {
  const octets = new Uint8Array(24);
  crypto.getRandomValues(octets);
  return Array.from(octets, (o) => o.toString(16).padStart(2, '0')).join('');
};

const Contact: React.FC<ContactProps> = ({ lang, onChangeView }) => {
  const L = useTextes('contact', TEXTES, lang);
  const [nom, setNom] = useState('');
  const [courriel, setCourriel] = useState('');
  const [message, setMessage] = useState('');
  const [attente, setAttente] = useState(false);
  const [etat, setEtat] = useState<Etat>('idle');

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attente) return;
    setAttente(true);
    setEtat('idle');
    const name = nom.trim();
    const email = courriel.trim().toLowerCase();
    const texte = message.trim();
    const dejaConnecte = auth.currentUser;
    try {
      await createDoc('leads', {
        name,
        email,
        message: texte,
        source: 'public-home-contact',
        read: false,
        archived: false,
        ...(dejaConnecte ? { uid: dejaConnecte.uid } : {}),
      });
    } catch (err) {
      console.error('Contact form submit failed', err);
      setEtat('error');
      setAttente(false);
      return;
    }

    // Le message est parti. Ensuite, l'espace : mêmes informations, un compte, un courriel.
    let suivant: Etat = 'lead';
    if (dejaConnecte) {
      suivant = 'connecte';
    } else {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, motDePasseAleatoire());
        await updateProfile(cred.user, { displayName: name }).catch(() => {});
        await writeDoc(
          'dossiers',
          cred.user.uid,
          nouveauDossier(cred.user.uid, email, name, { projet: { titre: '', description: texte, objectif: '' } })
        );
        await sendPasswordResetEmail(auth, email, { url: `${window.location.origin}/espace` }).catch((err) =>
          console.error('Courriel de mot de passe', err)
        );
        suivant = 'compte';
      } catch (err) {
        suivant = (err as AuthError)?.code === 'auth/email-already-in-use' ? 'existant' : 'lead';
        if (suivant === 'lead') console.error('Ouverture du compte', err);
      }
    }
    setEtat(suivant);
    setNom('');
    setCourriel('');
    setMessage('');
    setAttente(false);
  };

  const texteSucces = { compte: L.compteTexte, existant: L.existantTexte, connecte: L.connecteTexte, lead: L.leadTexte }[
    etat as 'compte' | 'existant' | 'connecte' | 'lead'
  ];

  return (
    <Feuille z={6} className="bg-papier-2">
      <div id="contact" data-tx-scope="contact" className="grid grid-cols-12 gap-x-col gap-y-10 px-gut py-feuille">
        <div className="col-span-12 sm:col-span-6">
          <Reveal as="h2" className="whitespace-pre-line text-h2 font-serif text-encre">
            {L.titre}
          </Reveal>
          <Reveal as="p" delay={0.06} className="mt-6 max-w-mesure text-lede font-sans font-light text-encre/80">
            {L.texte}
          </Reveal>

          <Reveal as="div" delay={0.12} className="mt-10">
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

          <Reveal as="div" delay={0.16} className="mt-12">
            {etat === 'compte' || etat === 'existant' || etat === 'connecte' || etat === 'lead' ? (
              <div aria-live="polite" className="max-w-mesure">
                <div className="flex items-start gap-3 rounded-champ border border-rose/30 bg-rose/5 p-5 text-encre">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-rose" aria-hidden />
                  <div>
                    <p className="font-serif text-h3 text-encre">{L.noteTitre}</p>
                    <p className="mt-2 text-corps text-encre/80">{texteSucces}</p>
                  </div>
                </div>
                {etat !== 'lead' && onChangeView && (
                  <button
                    type="button"
                    onClick={() => onChangeView('ESPACE_CLIENT')}
                    className="pilule mt-6 inline-flex items-center gap-2 rounded-pilule bg-encre px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-papier"
                  >
                    {L.ouvrirEspace}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={soumettre} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-petit font-semibold text-encre">
                    {L.nom}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
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
                    maxLength={190}
                    autoComplete="email"
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
                    maxLength={4900}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={L.aidePlaceholder}
                    className="h-32 resize-none rounded-champ border border-filet bg-papier px-4 py-3 text-encre outline-none transition-colors duration-200 focus:border-rose"
                  />
                </div>

                <div aria-live="polite">
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
              </form>
            )}
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
