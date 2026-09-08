// Logique pure de la synchronisation Google Agenda : aucun appel réseau ni Firestore ici, seulement
// des fonctions qui prennent des données et rendent des données. Testé sans réseau par verif-agenda-google.ts.
// Le reste (jetons, appels à l'API Google, écriture Firestore) vit dans google.ts.

export interface RendezVousPourEvenement {
  nom: string;
  courriel: string;
  debut: Date;
  fin: Date;
  salle: string;
  statut: 'demande' | 'confirme' | 'annule' | 'complete';
  googleEventId?: string;
}

export interface EvenementGoogle {
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

/** Le rendez-vous confirmé, tel qu'il doit apparaître dans l'agenda Google de Laurie. */
export function evenementDepuisRendezVous(rdv: RendezVousPourEvenement): EvenementGoogle {
  return {
    summary: `Rencontre avec ${rdv.nom}`,
    description: `${rdv.courriel}\nSalle vidéo : https://meet.jit.si/${rdv.salle}`,
    start: { dateTime: rdv.debut.toISOString() },
    end: { dateTime: rdv.fin.toISOString() },
  };
}

export type ActionSync =
  | { action: 'creer' }
  | { action: 'mettreAJour'; eventId: string }
  | { action: 'supprimer'; eventId: string }
  | { action: 'ignorer' };

/**
 * Idempotence par googleEventId : un rendez-vous confirmé sans événement se crée, avec événement se
 * met à jour; un rendez-vous annulé ou terminé qui a encore un événement le retire; le reste ne bouge pas
 * (une demande en attente, ou un rendez-vous déjà réglé côté Google).
 */
export function actionPourRendezVous(rdv: Pick<RendezVousPourEvenement, 'statut' | 'googleEventId'>): ActionSync {
  const aEvenement = !!rdv.googleEventId;
  if (rdv.statut === 'confirme') return aEvenement ? { action: 'mettreAJour', eventId: rdv.googleEventId! } : { action: 'creer' };
  if ((rdv.statut === 'annule' || rdv.statut === 'complete') && aEvenement) return { action: 'supprimer', eventId: rdv.googleEventId! };
  return { action: 'ignorer' };
}

export interface PeriodeOccupee {
  start?: string | null;
  end?: string | null;
}

export interface OccupationGoogle {
  id: string;
  debut: Date;
  fin: Date;
  source: 'google';
}

/**
 * Les plages occupées de l'agenda Google (réponse freebusy) → des occupations/{id} lisibles côté
 * client, source 'google'. L'id est un hachage déterministe du début et de la fin : un même rendu
 * freebusy redonne le même id, donc un second passage écrase plutôt que de dupliquer.
 */
export function occupationsDepuisFreebusy(periodes: PeriodeOccupee[]): OccupationGoogle[] {
  return periodes
    .filter((p): p is { start: string; end: string } => !!p.start && !!p.end)
    .map((p) => ({
      id: `google-${Buffer.from(`${p.start}|${p.end}`).toString('base64url').slice(0, 40)}`,
      debut: new Date(p.start),
      fin: new Date(p.end),
      source: 'google' as const,
    }));
}
