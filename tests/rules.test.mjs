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

  await testEnv.cleanup();

  console.log(resultats.join('\n'));
  console.log(`\n${ok} passés, ${fail} échoués sur ${ok + fail}.`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error('Échec du script de test :', e);
  process.exit(1);
});
