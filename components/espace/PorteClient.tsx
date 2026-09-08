import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthError,
} from 'firebase/auth';
import { AlertCircle, ArrowRight, CheckCircle, Lock, Mail } from 'lucide-react';
import { auth, googleProvider } from '../../firebase';
import { useDossierConfig, EtapeDefEn } from '../../lib/dossier';
import { Reveal } from '../motion';
import { EtapeDef, Language } from '../../types';
import { useTextes } from '../../lib/textes';
import { intentionRendezVous } from '../../lib/rendezvous';

/** Titre/sous-titre d'une étape selon la langue, avec repli sur le français (catalogue Firestore sans champs anglais). */
const titreEtape = (etape: EtapeDef, lang: Language): string => {
  const e = etape as EtapeDefEn;
  return lang === 'EN' && e.titreEn ? e.titreEn : etape.titre;
};
const sousEtape = (etape: EtapeDef, lang: Language): string => {
  const e = etape as EtapeDefEn;
  return lang === 'EN' && e.sousEn ? e.sousEn : etape.sous;
};

interface PorteClientProps {
  lang: Language;
}

type Mode = 'signin' | 'signup';

const TEXTES = {
  FR: {
    hLeft: 'Ta tête claire\nt\'attend.',
    pLeft:
      "Je suis Laurie. Tu déposes ici ce que tu as, même en vrac, et tu repars avec une direction et les bons mots pour la porter. Tu sais toujours où en est ton projet sans courir après un courriel, et quand une question te vient, je te réponds au même endroit.",
    etapesTitre: 'Comment ça se déroule',
    signin: 'Se connecter',
    signup: 'Créer mon compte',
    email: 'Courriel',
    password: 'Mot de passe',
    btnSignin: 'Ouvrir mon dossier',
    btnSignup: 'Créer mon dossier',
    google: 'Continuer avec Google',
    googleNote: "Ce bouton lit le compte Google déjà connecté sur cet appareil, rien d'autre.",
    or: 'ou',
    forgot: 'Mot de passe oublié ?',
    forgotSent: 'Courriel envoyé. Vérifie ta boîte de réception.',
    forgotNeedsEmail: "Écris d'abord ton courriel dans le champ ci-dessus.",
    errInconnue: "La connexion n'a pas fonctionné. Réessaie.",
    confidentialite: 'Ce que tu déposes ici vit dans un dossier privé : Laurie Belhumeur, seule, peut le lire.',
    rdvKicker: 'Prendre rendez-vous',
    rdvTexte: 'Crée ton compte en une minute : tu choisis ensuite ton moment dans l\'agenda de Laurie, et la rencontre se fait en vidéo, ici même.',
  },
  EN: {
    hLeft: 'A clear head\nis waiting.',
    pLeft:
      "I'm Laurie. Drop off what you have here, even in rough shape, and you leave with a direction and the right words to carry it. You always know where your project stands without chasing an email, and when a question comes up, I answer you in the same place.",
    etapesTitre: 'How it unfolds',
    signin: 'Sign in',
    signup: 'Create my account',
    email: 'Email',
    password: 'Password',
    btnSignin: 'Open my file',
    btnSignup: 'Create my file',
    google: 'Continue with Google',
    googleNote: 'This button reads the Google account already signed in on this device, nothing else.',
    or: 'or',
    forgot: 'Forgot your password?',
    forgotSent: 'Email sent. Check your inbox.',
    forgotNeedsEmail: 'Write your email in the field above first.',
    errInconnue: 'Sign in failed. Try again.',
    confidentialite: 'What you upload here lives in a private file: Laurie Belhumeur, and only her, can read it.',
    rdvKicker: 'Book a call',
    rdvTexte: 'Create your account in a minute: then pick your time in Laurie\'s calendar, and the call happens in video, right here.',
  },
};

const CHAMP = 'w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris transition-colors';

const messageErreur = (err: unknown, t: { errInconnue: string }): string => {
  const code = (err as AuthError)?.code;
  switch (code) {
    case 'auth/invalid-email':
      return 'Ce courriel ne semble pas valide.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Courriel ou mot de passe incorrect.';
    case 'auth/email-already-in-use':
      return 'Un compte existe déjà avec ce courriel. Essaie plutôt de te connecter.';
    case 'auth/weak-password':
      return "Choisis un mot de passe d'au moins 6 caractères.";
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessaie dans quelques minutes.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return '';
    default:
      return (err as Error)?.message || t.errInconnue;
  }
};

const PorteClient: React.FC<PorteClientProps> = ({ lang }) => {
  const config = useDossierConfig();
  // « Prendre rendez-vous » depuis le site : la porte s'ouvre sur la création du compte, avec le mot qui explique.
  const [rdv] = useState<boolean>(() => typeof window !== 'undefined' && intentionRendezVous());
  const [mode, setMode] = useState<Mode>(rdv ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avisReset, setAvisReset] = useState<string | null>(null);

  const t = useTextes('porte', TEXTES, lang);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setAvisReset(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      // App.tsx écoute onAuthStateChanged : la vue se met à jour toute seule.
    } catch (err) {
      const m = messageErreur(err, t);
      if (m) setError(m);
    } finally {
      setBusy(false);
    }
  };

  const avecGoogle = async () => {
    setError(null);
    setAvisReset(null);
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const m = messageErreur(err, t);
      if (m) setError(m);
    } finally {
      setBusy(false);
    }
  };

  const reinitialiser = async () => {
    setError(null);
    setAvisReset(null);
    if (!email.trim()) {
      setError(t.forgotNeedsEmail);
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAvisReset(t.forgotSent);
    } catch (err) {
      const m = messageErreur(err, t);
      if (m) setError(m);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-tx-scope="porte" className="min-h-[100svh] bg-papier pt-32 pb-20 px-gut">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-col gap-y-14 items-start">
        {/* Colonne gauche : accueil de Laurie + les cinq étapes */}
        <div className="lg:col-span-6">
          <Reveal as="h1" className="font-serif text-display text-encre mb-6">
            {t.hLeft.split('\n').map((ligne, i, arr) => (
              <span key={i} className="block">
                {ligne}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.1} as="p" className="text-lede text-gris mesure mb-10">
            {t.pLeft}
          </Reveal>

          <Reveal delay={0.2} as="h2" className="kicker text-rose mb-6">
            {t.etapesTitre}
          </Reveal>
          <ol className="relative">
            {config.etapes.map((etape, i) => (
              <Reveal key={etape.id} as="li" delay={0.1 * i} className="relative pl-12 pb-8 last:pb-0">
                {i < config.etapes.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[15px] top-9 bottom-[-4px] w-px bg-trait/30" />
                )}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 w-8 h-8 rounded-pilule border border-rose/40 text-rose font-serif text-sm flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <p className="text-encre font-semibold text-sm">{titreEtape(etape, lang)}</p>
                <p className="text-gris text-sm">{sousEtape(etape, lang)}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Colonne droite : la porte */}
        <Reveal delay={0.25} y={24} duree={0.9} className="lg:col-span-6 lg:col-start-8">
          <div className="bg-papier-2 border border-filet rounded-champ shadow-panneau p-8 md:p-10">
            {rdv && (
              <div className="mb-6 rounded-champ border border-rose/30 bg-rose/5 p-4">
                <p className="kicker text-rose">{t.rdvKicker}</p>
                <p className="mt-2 text-petit text-encre">{t.rdvTexte}</p>
              </div>
            )}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-pilule bg-encre flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-papier" />
              </div>
              <div className="relative flex flex-1 border-b border-filet">
                {(['signin', 'signup'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError(null);
                      setAvisReset(null);
                    }}
                    className={`relative flex-1 min-h-[40px] text-xs font-sans font-semibold uppercase tracking-wide transition-colors ${
                      mode === m ? 'text-encre' : 'text-gris hover:text-encre'
                    }`}
                  >
                    {m === 'signin' ? t.signin : t.signup}
                    {mode === m && (
                      <motion.span layoutId="porte-onglet" className="absolute left-0 right-0 -bottom-px h-[2px] bg-rose" transition={{ duration: 0.2 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={avecGoogle}
              disabled={busy}
              className="w-full flex items-center justify-center gap-3 min-h-[44px] px-4 py-3 rounded-champ border border-filet text-encre font-medium hover:border-encre transition-colors disabled:opacity-50 mb-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              {t.google}
            </button>
            <p className="text-xs text-gris mb-6">{t.googleNote}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-filet" />
              <span className="kicker text-gris">{t.or}</span>
              <div className="flex-1 h-px bg-filet" />
            </div>

            <form onSubmit={soumettre} className="space-y-4">
              <div>
                <label htmlFor="porte-email" className="block text-petit text-gris mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gris" aria-hidden="true" />
                  <input
                    id="porte-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={`${CHAMP} pl-11 min-h-[44px]`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="porte-password" className="block text-petit text-gris mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gris" aria-hidden="true" />
                  <input
                    id="porte-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className={`${CHAMP} pl-11 min-h-[44px]`}
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 text-sm text-rose bg-rose-clair/10 border border-rose/20 rounded-champ p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              {avisReset && (
                <div role="status" aria-live="polite" className="flex items-start gap-2 text-sm text-encre bg-papier border border-filet rounded-champ p-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{avisReset}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full justify-center min-h-[44px] px-6 rounded-pilule bg-bouton text-sur-bouton font-medium hover:bg-bouton-2 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {mode === 'signup' ? t.btnSignup : t.btnSignin}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={reinitialiser}
              disabled={busy}
              className="w-full mt-4 text-xs text-gris hover:text-encre transition-colors min-h-[32px]"
            >
              {t.forgot}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gris">{t.confidentialite}</p>
        </Reveal>
      </div>
    </div>
  );
};

export default PorteClient;
