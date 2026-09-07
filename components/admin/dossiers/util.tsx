/** Petits formateurs partagés par les composants du back-office des dossiers. */

/** Timestamp Firestore -> date courte lisible. Jamais utilisé sur une chaîne ISO (voir formatEcheance). */
export const dateCourte = (ts: any): string => {
  try {
    const d: Date | null = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    return d ? d.toLocaleDateString('fr-CA') : '';
  } catch {
    return '';
  }
};

/** Date ISO sans heure (AAAA-MM-JJ) -> JJ/MM/AAAA, lue sur la chaîne, jamais par new Date(iso). */
export const formatEcheance = (iso?: string): string => {
  if (!iso || iso.length < 10) return '';
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
};

export const formatTaille = (octets: number): string => {
  if (!octets && octets !== 0) return '';
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
};
