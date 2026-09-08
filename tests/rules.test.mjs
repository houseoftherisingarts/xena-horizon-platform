// Tests des règles Firestore de dossiers/{uid}, messages, leads — le jugement de Laurie (revue)
// doit rester hors de portée du client. Lancé via :
//   PATH="$(brew --prefix openjdk)/bin:$PATH" npx firebase emulators:exec --only firestore --project xena-test "node tests/rules.test.mjs"
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

const UID_A = 'user-a';
const UID_B = 'user-b';
const ADMIN_UID = 'O5qf5A3WdfV7daxkBKOIt0RnBUD2'; // whitelist firestore.rules / lib/admins.ts

const dossierValide = (uid) => ({
  uid,
  courriel: 'a@example.com',
  nom: 'Personne A',
  etape: 'contact',
  archive: false,
  pieces: {},
});

let ok = 0;
let fail = 0;
const resultats = [];

async function verifie(nom, promesse) {
  try {
    await promesse;
    resultats.push(`✅ ${nom}`);
    ok++;
  } catch (e) {
    resultats.push(`❌ ${nom}\n   ${e.message.split('\n')[0]}`);
    fail++;
  }
}

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'xena-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8180,
    },
  });

  const dbA = testEnv.authenticatedContext(UID_A).firestore();
  const dbB = testEnv.authenticatedContext(UID_B).firestore();
  const dbAdmin = testEnv.authenticatedContext(ADMIN_UID).firestore();
  const dbAnon = testEnv.unauthenticatedContext().firestore();

  // 1. Client crée son dossier (ok)
  await verifie(
    'client crée son dossier',
    assertSucceeds(setDoc(doc(dbA, 'dossiers', UID_A), dossierValide(UID_A)))
  );

  // 2. Client crée avec etape 'suivi' (refus) — l'étape de départ est verrouillée à 'contact'
  await verifie(
    "client crée avec etape 'suivi' (refus attendu)",
    assertFails(setDoc(doc(dbB, 'dossiers', UID_B), { ...dossierValide(UID_B), etape: 'suivi' }))
  );

  // Bonus : le champ uid ne peut pas être usurpé à la création (authority source)
  await verifie(
    'client crée un dossier avec uid usurpé (refus attendu)',
    assertFails(setDoc(doc(dbB, 'dossiers', UID_B), { ...dossierValide(UID_B), uid: UID_A }))
  );

  // Bonus : archive doit être false à la création
  await verifie(
    'client crée un dossier déjà archivé (refus attendu)',
    assertFails(setDoc(doc(dbB, 'dossiers', UID_B), { ...dossierValide(UID_B), archive: true }))
  );

  // Seed propre du dossier B (règles désactivées) pour la suite des tests
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'dossiers', UID_B), dossierValide(UID_B));
  });

  // 3. Client écrit revue (refus) — la revue est le jugement de Laurie, jamais un champ client
  await verifie(
    'client écrit revue sur son propre dossier (refus attendu)',
    assertFails(
      updateDoc(doc(dbA, 'dossiers', UID_A), {
        'revue.parcours': { etat: 'valide', revueLe: serverTimestamp() },
      })
    )
  );

  // Bonus : bornes de taille — un téléphone trop long est refusé
  await verifie(
    'client met un téléphone trop long (refus attendu)',
    assertFails(
      updateDoc(doc(dbA, 'dossiers', UID_A), {
        telephone: '5'.repeat(41),
        updatedAt: serverTimestamp(),
      })
    )
  );

  // 4. Client lit le dossier d'un autre (refus)
  await verifie(
    "client lit le dossier d'un autre (refus attendu)",
    assertFails(getDoc(doc(dbA, 'dossiers', UID_B)))
  );

  // 5. Client liste les dossiers (refus)
  await verifie(
    'client liste la collection dossiers (refus attendu)',
    assertFails(getDocs(collection(dbA, 'dossiers')))
  );

  // 6. Admin écrit revue (ok)
  await verifie(
    'admin écrit revue (ok)',
    assertSucceeds(
      updateDoc(doc(dbAdmin, 'dossiers', UID_A), {
        'revue.parcours': { etat: 'valide', revueLe: serverTimestamp() },
        derniereActiviteAdmin: serverTimestamp(),
      })
    )
  );

  // 7. Message client avec deUid usurpé (refus)
  await verifie(
    'message client avec deUid usurpé (refus attendu)',
    assertFails(
      addDoc(collection(dbA, 'dossiers', UID_A, 'messages'), {
        texte: 'bonjour',
        de: 'client',
        deUid: UID_B,
        luParAdmin: false,
        luParClient: true,
        createdAt: serverTimestamp(),
      })
    )
  );

  // 8. Message client valide (ok)
  await verifie(
    'message client valide (ok)',
    assertSucceeds(
      addDoc(collection(dbA, 'dossiers', UID_A, 'messages'), {
        texte: 'bonjour',
        de: 'client',
        deUid: UID_A,
        luParAdmin: false,
        luParClient: true,
        createdAt: serverTimestamp(),
      })
    )
  );

  // 9. Lead public avec champ en trop (refus)
  await verifie(
    'lead public avec champ en trop (refus attendu)',
    assertFails(
      addDoc(collection(dbAnon, 'leads'), {
        name: 'Quelqu\'un',
        email: 'x@example.com',
        message: 'bonjour',
        source: 'public-home-contact',
        read: false,
        archived: false,
        role: 'admin', // champ non permis
        createdAt: serverTimestamp(),
      })
    )
  );

  // Bonus : lead public conforme (ok) — pour prouver que hasOnly n'est pas trop strict
  await verifie(
    'lead public conforme (ok)',
    assertSucceeds(
      addDoc(collection(dbAnon, 'leads'), {
        name: 'Quelqu\'un',
        email: 'x@example.com',
        message: 'bonjour',
        source: 'public-home-contact',
        read: false,
        archived: false,
        createdAt: serverTimestamp(),
      })
    )
  );

  // 10. Lead d'une personne connectée qui porte son propre uid (ok) et lead qui usurpe l'uid d'un autre (refus)
  await verifie(
    'lead connecté avec son propre uid (ok)',
    assertSucceeds(
      addDoc(collection(dbA, 'leads'), {
        name: 'Personne A',
        email: 'a@example.com',
        message: 'bonjour',
        source: 'public-home-contact',
        read: false,
        archived: false,
        uid: UID_A,
        createdAt: serverTimestamp(),
      })
    )
  );
  await verifie(
    "lead qui porte l'uid d'un autre (refus attendu)",
    assertFails(
      addDoc(collection(dbA, 'leads'), {
        name: 'Personne A',
        email: 'a@example.com',
        message: 'bonjour',
        source: 'public-home-contact',
        read: false,
        archived: false,
        uid: UID_B,
        createdAt: serverTimestamp(),
      })
    )
  );

  // 11. Rendez-vous : la personne demande un créneau à son nom (ok), au nom d'un autre (refus), confirme elle-même (refus), annule (ok)
  const dans3Jours = new Date(Date.now() + 3 * 86400000);
  const fin3Jours = new Date(dans3Jours.getTime() + 45 * 60000);
  const rdvValide = (uid) => ({
    uid, nom: 'Personne A', courriel: 'a@example.com', debut: dans3Jours, fin: fin3Jours, duree: 45, statut: 'demande', salle: 'xena-test', note: 'Mon projet', creePar: 'client', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  await verifie('rendez-vous demandé par la personne (ok)', assertSucceeds(setDoc(doc(dbA, 'rendezvous', 'rdv-a'), rdvValide(UID_A))));
  await verifie("rendez-vous au nom d'un autre (refus attendu)", assertFails(setDoc(doc(dbA, 'rendezvous', 'rdv-b'), rdvValide(UID_B))));
  await verifie('rendez-vous déjà confirmé par la personne (refus attendu)', assertFails(setDoc(doc(dbA, 'rendezvous', 'rdv-c'), { ...rdvValide(UID_A), statut: 'confirme' })));
  await verifie('la personne confirme elle-même (refus attendu)', assertFails(updateDoc(doc(dbA, 'rendezvous', 'rdv-a'), { statut: 'confirme', updatedAt: serverTimestamp() })));
  await verifie('Laurie confirme (ok)', assertSucceeds(updateDoc(doc(dbAdmin, 'rendezvous', 'rdv-a'), { statut: 'confirme', updatedAt: serverTimestamp() })));
  await verifie('un autre lit le rendez-vous (refus attendu)', assertFails(getDoc(doc(dbB, 'rendezvous', 'rdv-a'))));
  await verifie('la personne annule (ok)', assertSucceeds(updateDoc(doc(dbA, 'rendezvous', 'rdv-a'), { statut: 'annule', updatedAt: serverTimestamp() })));
  // Le miroir se crée dans le même lot que le rendez-vous (rdv-e), aux mêmes heures ; seul, il est refusé.
  const lot = writeBatch(dbA);
  lot.set(doc(dbA, 'rendezvous', 'rdv-e'), rdvValide(UID_A));
  lot.set(doc(dbA, 'occupations', 'rdv-e'), { debut: dans3Jours, fin: fin3Jours });
  await verifie('rendez-vous et occupation dans un même lot (ok)', assertSucceeds(lot.commit()));
  await verifie('occupation seule sans rendez-vous (refus attendu)', assertFails(setDoc(doc(dbA, 'occupations', 'occ-fantome'), { debut: dans3Jours, fin: fin3Jours })));
  const lotB = writeBatch(dbA);
  lotB.set(doc(dbA, 'rendezvous', 'rdv-f'), rdvValide(UID_A));
  lotB.set(doc(dbA, 'occupations', 'rdv-f'), { debut: dans3Jours, fin: new Date(fin3Jours.getTime() + 3600000) });
  await verifie('occupation aux mauvaises heures (refus attendu)', assertFails(lotB.commit()));
  await verifie("occupation lue par un autre compte (ok)", assertSucceeds(getDoc(doc(dbB, 'occupations', 'rdv-e'))));
  await verifie('occupation lue sans compte (refus attendu)', assertFails(getDoc(doc(dbAnon, 'occupations', 'rdv-e'))));
  // 12. Profil : bannière, bio et liens dans les bornes (ok), bio trop longue (refus)
  await verifie('profil : bannière, bio et liens (ok)', assertSucceeds(updateDoc(doc(dbA, 'dossiers', UID_A), { banniereURL: 'https://firebasestorage.googleapis.com/b', bio: 'Artiste.', liens: { site: 'https://a.example.com' }, updatedAt: serverTimestamp() })));
  await verifie('profil : bio trop longue (refus attendu)', assertFails(updateDoc(doc(dbA, 'dossiers', UID_A), { bio: 'x'.repeat(1200), updatedAt: serverTimestamp() })));

  // 13. Audit des règles du 8 septembre : bornes et formats
  const fin100ans = new Date(dans3Jours.getTime() + 100 * 365 * 86400000);

  await verifie('pieces avec 25 clés (refus attendu)', assertFails(updateDoc(doc(dbA, 'dossiers', UID_A), { pieces: Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`p${i}`, { nom: 'x' }])), updatedAt: serverTimestamp() })));
  await verifie('liens avec une clé inconnue (refus attendu)', assertFails(updateDoc(doc(dbA, 'dossiers', UID_A), { liens: { spam: 'https://x.example' }, updatedAt: serverTimestamp() })));
  await verifie('profil hors liste (refus attendu)', assertFails(updateDoc(doc(dbA, 'dossiers', UID_A), { profil: 'pirate', updatedAt: serverTimestamp() })));
  await verifie('derniereActiviteAdmin posé à la création (refus attendu)', assertFails(setDoc(doc(dbB, 'dossiers', UID_B), { ...dossierValide(UID_B), derniereActiviteAdmin: serverTimestamp() })));
  await verifie('rendez-vous dont la durée ne colle pas (refus attendu)', assertFails(setDoc(doc(dbA, 'rendezvous', 'rdv-d'), { ...rdvValide(UID_A), duree: 240 })));
  await verifie('lead avec un faux courriel (refus attendu)', assertFails(addDoc(collection(dbAnon, 'leads'), { name: 'X', email: 'pas-un-courriel', message: 'bonjour', source: 'public-home-contact', read: false, archived: false, createdAt: serverTimestamp() })));
  await verifie('abonné avec un faux courriel (refus attendu)', assertFails(addDoc(collection(dbAnon, 'subscribers'), { email: 'pas-un-courriel', status: 'active', createdAt: serverTimestamp() })));
  await verifie('abonné avec un vrai courriel (ok)', assertSucceeds(addDoc(collection(dbAnon, 'subscribers'), { email: 'abonne@example.com', status: 'active', source: 'site', lang: 'fr', createdAt: serverTimestamp() })));
  // Admin par courriel vérifié (compte Google de Laurie) : entre; le même courriel non vérifié : refusé.
  const dbLaurie = testEnv.authenticatedContext('laurie-test', { email: 'laurie.belhumeur@gmail.com', email_verified: true }).firestore();
  const dbLaurieNonVerifiee = testEnv.authenticatedContext('laurie-test-2', { email: 'laurie.belhumeur@gmail.com', email_verified: false }).firestore();
  await verifie('Laurie (Google, courriel vérifié) lit le coffre (ok)', assertSucceeds(getDoc(doc(dbLaurie, 'coffre', 'laurie'))));
  await verifie('même courriel non vérifié refusé au coffre (refus attendu)', assertFails(getDoc(doc(dbLaurieNonVerifiee, 'coffre', 'laurie'))));
  // Le coffre n'appartient qu'aux admins : une personne connectée ordinaire, et personne du tout, ne le lisent pas.
  await verifie('un client connecté lit le coffre (refus attendu)', assertFails(getDoc(doc(dbA, 'coffre', 'laurie'))));
  await verifie('un anonyme lit le coffre (refus attendu)', assertFails(getDoc(doc(dbAnon, 'coffre', 'laurie'))));
  await verifie('un client connecté écrit dans le coffre (refus attendu)', assertFails(setDoc(doc(dbA, 'coffre', 'laurie'), { v: 1 })));

  await testEnv.cleanup();

  console.log(resultats.join('\n'));
  console.log(`\n${ok} passés, ${fail} échoués sur ${ok + fail}.`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error('Échec du script de test :', e);
  process.exit(1);
});
