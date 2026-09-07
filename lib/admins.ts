import type { User } from 'firebase/auth';

/**
 * Qui entre dans le back-office. Deux portes : l'identifiant du compte, ou un courriel vérifié
 * (compte Google). La même liste vit dans firestore.rules et storage.rules : les tenir à jour ensemble.
 */
export const ADMIN_UIDS = new Set<string>([
  'O5qf5A3WdfV7daxkBKOIt0RnBUD2', // houseoftherisingarts@gmail.com (Vexel)
  'vJ6bnH7XiOg5VO7XVnTJ9Hg5wuw2', // compte témoin de vérification (Vexel), à retirer après le lancement
]);

export const ADMIN_EMAILS = new Set<string>([
  'houseoftherisingarts@gmail.com',
  'laurie.belhumeur@gmail.com',
]);

type Identite = Pick<User, 'uid' | 'email' | 'emailVerified'> | string | null | undefined;

export const isAdmin = (identite: Identite): boolean => {
  if (!identite) return false;
  if (typeof identite === 'string') return ADMIN_UIDS.has(identite);
  if (ADMIN_UIDS.has(identite.uid)) return true;
  return !!identite.emailVerified && !!identite.email && ADMIN_EMAILS.has(identite.email.toLowerCase());
};

export const isAdminEmail = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.has(email.toLowerCase());
