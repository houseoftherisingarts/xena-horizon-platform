import type { AuthError } from 'firebase/auth';
import type { Language } from '../types';

/**
 * Traduit une erreur d'authentification Firebase en une phrase lisible par la personne devant l'écran.
 * Le message brut du kit (« Firebase: Error (auth/unauthorized-domain). ») ne sort jamais à l'écran : il
 * part dans la console pour le diagnostic et la visiteuse lit une phrase entière.
 * Une chaîne vide veut dire « ne rien afficher » : la personne a fermé la fenêtre elle-même.
 */
export const messageErreur = (err: unknown, repli: string, lang: Language = 'FR'): string => {
  const code = (err as AuthError)?.code;
  if (code) console.error('[auth]', code, (err as Error)?.message);
  const en = lang === 'EN';
  switch (code) {
    case 'auth/invalid-email':
      return en ? 'That email address does not look valid.' : 'Ce courriel ne semble pas valide.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return en ? 'Wrong email or password.' : 'Courriel ou mot de passe incorrect.';
    case 'auth/email-already-in-use':
      return en
        ? 'An account already exists with this email. Try signing in instead.'
        : 'Un compte existe déjà avec ce courriel. Essaie plutôt de te connecter.';
    case 'auth/weak-password':
      return en ? 'Choose a password of at least 8 characters.' : "Choisis un mot de passe d'au moins 8 caractères.";
    case 'auth/too-many-requests':
      return en ? 'Too many attempts. Try again in a few minutes.' : 'Trop de tentatives. Réessaie dans quelques minutes.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return '';
    case 'auth/popup-blocked':
      return en
        ? 'Your browser blocked the Google window. Allow pop-ups for this site, then try again.'
        : "Le navigateur a bloqué la fenêtre Google. Autorise les fenêtres surgissantes pour ce site, puis réessaie.";
    case 'auth/network-request-failed':
      return en
        ? 'The connection to the server failed. Check your internet access and try again.'
        : "La connexion au serveur a échoué. Vérifie ton accès à Internet, puis réessaie.";
    // Fautes de configuration : la visiteuse n'y peut rien, elle a le chemin humain.
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
    case 'auth/internal-error':
      return en
        ? 'Google sign-in is unavailable right now. Use your email and password, or write to laurie.belhumeur@gmail.com.'
        : "La connexion par Google est indisponible en ce moment. Passe par ton courriel et ton mot de passe, ou écris à laurie.belhumeur@gmail.com.";
    default:
      return repli;
  }
};
