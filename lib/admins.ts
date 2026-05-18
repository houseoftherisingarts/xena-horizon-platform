export const ADMIN_UIDS = new Set<string>([
  'O5qf5A3WdfV7daxkBKOIt0RnBUD2', // houseoftherisingarts@gmail.com
]);

export const ADMIN_EMAILS = new Set<string>([
  'houseoftherisingarts@gmail.com',
]);

export const isAdmin = (uid?: string | null): boolean =>
  !!uid && ADMIN_UIDS.has(uid);

export const isAdminEmail = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.has(email.toLowerCase());
