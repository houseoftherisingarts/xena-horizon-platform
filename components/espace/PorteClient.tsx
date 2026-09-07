import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthError,
} from 'firebase/auth';
import { AlertCircle, ArrowRight, CheckCircle, Lock, Mail } from 'lucide-react';
import { auth, googleProvider } from '../../firebase';
import { useDossierConfig } from '../../lib/dossier';
import { GLASS_INPUT_CLASSES } from '../../constants';
import { Language } from '../../types';

interface PorteClientProps {
  lang: Language;
}

type Mode = 'signin' | 'signup';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

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
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avisReset, setAvisReset] = useState<string | null>(null);

  const t = {
    FR: {
      hLeft: 'Ton dossier\nt\'attend.',
      pLeft:
        "Je suis Laurie. Ouvre ton espace pour déposer tes pièces, suivre l'avancement de ton dossier et m'écrire directement quand tu as une question. Tout reste au même endroit, et je vois chaque geste que tu fais de mon côté.",
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
    },
    EN: {
      hLeft: 'Your file\nis waiting.',
      pLeft:
        "I'm Laurie. Open your space to send your files, follow how your file is coming along, and write to me directly when you have a question. Everything stays in one place, and I see every move you make on my end.",
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
    },
  }[lang];

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
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-iridescent-radial opacity-40 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Colonne gauche : accueil de Laurie + les cinq étapes */}
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-[1.15] mb-6 whitespace-pre-line">
            {t.hLeft.split('\n').map((ligne, i) => (
              <span key={i} className={i === 1 ? 'text-iridescent' : ''}>
                {ligne}
                <br />
              </span>
            ))}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-10">{t.pLeft}</p>

          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-4">{t.etapesTitre}</h2>
          <ol className="space-y-4">
            {config.etapes.map((etape, i) => (
              <li key={etape.id} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-iridescent-soft border border-cyan-400/30 text-cyan-200 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">{etape.titre}</p>
                  <p className="text-slate-400 text-sm">{etape.sous}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Colonne droite : la porte */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-iridescent flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1 flex-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setAvisReset(null);
                }}
                className={`flex-1 min-h-[36px] rounded-full text-xs font-bold transition-colors ${FOCUS_RING} ${
                  mode === 'signin' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.signin}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setAvisReset(null);
                }}
                className={`flex-1 min-h-[36px] rounded-full text-xs font-bold transition-colors ${FOCUS_RING} ${
                  mode === 'signup' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.signup}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={avecGoogle}
            disabled={busy}
            className={`w-full flex items-center justify-center gap-3 min-h-[44px] px-4 py-3 rounded-[12px] bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 mb-2 ${FOCUS_RING}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            {t.google}
          </button>
          <p className="text-xs text-slate-500 mb-6">{t.googleNote}</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">{t.or}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={soumettre} className="space-y-3">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <label htmlFor="porte-email" className="sr-only">
                {t.email}
              </label>
              <input
                id="porte-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                required
                autoComplete="email"
                className={`${GLASS_INPUT_CLASSES} pl-11 min-h-[44px]`}
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <label htmlFor="porte-password" className="sr-only">
                {t.password}
              </label>
              <input
                id="porte-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={`${GLASS_INPUT_CLASSES} pl-11 min-h-[44px]`}
              />
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-[12px] p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
            {avisReset && (
              <div role="status" aria-live="polite" className="flex items-start gap-2 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-[12px] p-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{avisReset}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className={`w-full justify-center min-h-[44px] px-6 py-3 rounded-[15px] bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift hover:bg-[length:300%_300%] text-white font-medium transition-all shadow-iridescent-sm hover:shadow-iridescent flex items-center gap-2 disabled:opacity-50 ${FOCUS_RING}`}
            >
              {mode === 'signup' ? t.btnSignup : t.btnSignin}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <button
            type="button"
            onClick={reinitialiser}
            disabled={busy}
            className={`w-full mt-4 text-xs text-slate-400 hover:text-white transition-colors min-h-[32px] ${FOCUS_RING}`}
          >
            {t.forgot}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PorteClient;
