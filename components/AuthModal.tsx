import React, { useState } from 'react';
import { X, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { isAdmin } from '../lib/admins';
import { GLASS_INPUT_CLASSES, ACTION_BUTTON_CLASSES } from '../constants';
import { Language } from '../types';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAdminSignIn: (user: User) => void;
  lang: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onAdminSignIn, lang }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const t = {
    FR: {
      title: 'Espace Admin',
      subtitle: 'Connectez-vous pour accéder à votre tableau de bord.',
      email: 'Courriel',
      password: 'Mot de passe',
      signin: 'Se connecter',
      signup: "Créer un compte",
      google: 'Continuer avec Google',
      or: 'ou',
      switchToSignup: "Pas de compte ? S'inscrire",
      switchToSignin: 'Déjà un compte ? Se connecter',
      denied: "Accès refusé : ce compte n'est pas administrateur.",
      generic: 'Connexion impossible. Vérifiez vos identifiants.',
    },
    EN: {
      title: 'Admin Area',
      subtitle: 'Sign in to access your dashboard.',
      email: 'Email',
      password: 'Password',
      signin: 'Sign in',
      signup: 'Create account',
      google: 'Continue with Google',
      or: 'or',
      switchToSignup: "No account? Sign up",
      switchToSignin: 'Have an account? Sign in',
      denied: 'Access denied: this account is not an administrator.',
      generic: 'Sign in failed. Check your credentials.',
    },
  }[lang];

  const handleResult = async (user: User) => {
    if (isAdmin(user)) {
      onAdminSignIn(user);
      onClose();
      return;
    }
    await signOut(auth);
    setError(t.denied);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const cred =
        mode === 'signup'
          ? await createUserWithEmailAndPassword(auth, email.trim(), password)
          : await signInWithEmailAndPassword(auth, email.trim(), password);
      await handleResult(cred.user);
    } catch (err: any) {
      setError(err?.message || t.generic);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await handleResult(cred.user);
    } catch (err: any) {
      setError(err?.message || t.generic);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[20px] shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          aria-label="close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-iridescent bg-[length:200%_200%] motion-safe:animate-iridescent-shift flex items-center justify-center shadow-iridescent-sm">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">{t.title}</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">{t.subtitle}</p>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[12px] bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          {t.google}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">{t.or}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email}
              required
              className={`${GLASS_INPUT_CLASSES} pl-11`}
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              required
              minLength={6}
              className={`${GLASS_INPUT_CLASSES} pl-11`}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-[12px] p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className={`${ACTION_BUTTON_CLASSES} w-full justify-center disabled:opacity-50`}
          >
            <LogIn className="w-4 h-4" />
            {mode === 'signup' ? t.signup : t.signin}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
          className="w-full mt-4 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {mode === 'signup' ? t.switchToSignin : t.switchToSignup}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
