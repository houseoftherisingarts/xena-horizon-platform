// Vérification sans réseau de la logique pure de la synchronisation Google Agenda (functions/src/agenda/sync.ts).
// Aucun appel à Google, aucun Firestore : seulement les fonctions de mapping et de décision.
// Usage : npx tsx functions/verif-agenda-google.ts   (ou npm --prefix functions run verif:agenda-google)
import assert from 'node:assert/strict';
import { actionPourRendezVous, evenementDepuisRendezVous, occupationsDepuisFreebusy } from './src/agenda/sync';

// --- mapping rendez-vous vers événement ---
const rdv = {
  nom: 'Marie Tremblay',
  courriel: 'marie@example.com',
  debut: new Date('2026-10-01T13:00:00.000Z'),
  fin: new Date('2026-10-01T13:45:00.000Z'),
  salle: 'xena-abc123',
  statut: 'confirme' as const,
};
const ev = evenementDepuisRendezVous(rdv);
assert.equal(ev.summary, 'Rencontre avec Marie Tremblay');
assert.match(ev.description, /marie@example\.com/);
assert.match(ev.description, /https:\/\/meet\.jit\.si\/xena-abc123/);
assert.equal(ev.start.dateTime, '2026-10-01T13:00:00.000Z');
assert.equal(ev.end.dateTime, '2026-10-01T13:45:00.000Z');

// --- idempotence par googleEventId ---
assert.deepEqual(actionPourRendezVous({ statut: 'demande' }), { action: 'ignorer' });
assert.deepEqual(actionPourRendezVous({ statut: 'confirme' }), { action: 'creer' });
assert.deepEqual(actionPourRendezVous({ statut: 'confirme', googleEventId: 'evt_1' }), { action: 'mettreAJour', eventId: 'evt_1' });
assert.deepEqual(actionPourRendezVous({ statut: 'annule', googleEventId: 'evt_1' }), { action: 'supprimer', eventId: 'evt_1' });
assert.deepEqual(actionPourRendezVous({ statut: 'annule' }), { action: 'ignorer' });
assert.deepEqual(actionPourRendezVous({ statut: 'complete', googleEventId: 'evt_2' }), { action: 'supprimer', eventId: 'evt_2' });

// --- occupations depuis freebusy ---
const periodes = [
  { start: '2026-10-02T14:00:00Z', end: '2026-10-02T15:00:00Z' },
  { start: null, end: null },
  { start: '2026-10-03T09:00:00Z', end: undefined },
];
const occ = occupationsDepuisFreebusy(periodes);
assert.equal(occ.length, 1, 'les plages incomplètes sont ignorées');
assert.equal(occ[0].source, 'google');
assert.equal(occ[0].debut.toISOString(), '2026-10-02T14:00:00.000Z');
assert.equal(occ[0].fin.toISOString(), '2026-10-02T15:00:00.000Z');

// même plage relue deux fois = même id (un second passage écrase, ne duplique pas)
const rejoue = occupationsDepuisFreebusy([periodes[0]]);
assert.equal(rejoue[0].id, occ[0].id);

// une plage différente = un id différent
const autre = occupationsDepuisFreebusy([{ start: '2026-10-05T10:00:00Z', end: '2026-10-05T11:00:00Z' }]);
assert.notEqual(autre[0].id, occ[0].id);

console.log('verif-agenda-google : toutes les vérifications sont passées.');
