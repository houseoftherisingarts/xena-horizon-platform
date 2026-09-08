// Lit le coffre de Laurie (coffre/laurie) avec la clé privée d'Alex et affiche le contenu dans le terminal.
// Usage : node scripts/coffre-lire.mjs                       (lire, numéro et CVV masqués, et marquer « lu »)
//         node scripts/coffre-lire.mjs --complet              (tout en clair, à l'instant d'ouvrir les comptes)
//         node scripts/coffre-lire.mjs --specimen <chemin>    (déchiffrer aussi le spécimen de chèque, s'il y en a un, et l'écrire à ce chemin)
//         node scripts/coffre-lire.mjs --effacer              (supprimer le document et le spécimen, une fois les comptes ouverts)
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createPrivateKey, privateDecrypt, createDecipheriv, constants } from 'node:crypto';
import { homedir } from 'node:os';

const PROJET = 'xena-70977';
const BUCKET = 'xena-70977.firebasestorage.app';
const CHEMIN_SPECIMEN_STORAGE = 'coffre/laurie/specimen.bin';
const DOC = `https://firestore.googleapis.com/v1/projects/${PROJET}/databases/(default)/documents/coffre/laurie`;
const token = execSync('gcloud auth print-access-token').toString().trim();
const entetes = { Authorization: `Bearer ${token}`, 'x-goog-user-project': PROJET, 'Content-Type': 'application/json' };

/** Supprime l'objet Storage du spécimen s'il existe. 404 = déjà absent, ce n'est pas une erreur. */
async function effacerSpecimenStorage() {
  const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(CHEMIN_SPECIMEN_STORAGE)}`;
  const r = await fetch(url, { method: 'DELETE', headers: entetes });
  if (!r.ok && r.status !== 404) console.error(`Spécimen non effacé (${r.status}).`);
}

if (process.argv.includes('--effacer')) {
  await effacerSpecimenStorage();
  const r = await fetch(DOC, { method: 'DELETE', headers: entetes });
  console.log(r.ok ? 'Coffre effacé (document et spécimen).' : `Échec : ${r.status}`);
  process.exit(0);
}

const r = await fetch(DOC, { headers: entetes });
if (r.status === 404) { console.log('Le coffre est vide : Laurie n\'a rien déposé.'); process.exit(0); }
const doc = await r.json();
const champ = (n) => doc.fields?.[n]?.stringValue ?? '';
const mapChamp = (n) => doc.fields?.[n]?.mapValue?.fields ?? null;
const privee = createPrivateKey(readFileSync(`${homedir()}/.config/xena/coffre-prive.pem`));
const cleAes = privateDecrypt({ key: privee, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, Buffer.from(champ('cle'), 'base64'));
const iv = Buffer.from(champ('iv'), 'base64');
const paquet = Buffer.from(champ('donnees'), 'base64');
const corps = paquet.subarray(0, paquet.length - 16);
const etiquette = paquet.subarray(paquet.length - 16);
const dechiffreur = createDecipheriv('aes-256-gcm', cleAes, iv);
dechiffreur.setAuthTag(etiquette);
const clair = JSON.parse(Buffer.concat([dechiffreur.update(corps), dechiffreur.final()]).toString('utf8'));
console.log(`Déposé par ${champ('parCourriel')} le ${doc.fields?.deposeLe?.timestampValue ?? '?'}`);
const complet = process.argv.includes('--complet');
const masque = (k, v) => (!complet && k === 'numero' ? `•••• •••• •••• ${String(v).slice(-4)}` : !complet && (k === 'cvv' || /MotDePasse/.test(k)) ? (v ? '••••••' : '') : v);
for (const [k, v] of Object.entries(clair)) console.log(`${k.padEnd(20)} ${masque(k, v)}`);
if (!complet) console.log('\nNuméro et CVV masqués : --complet pour les voir.');

const specimenMap = mapChamp('specimen');
const idxSpecimen = process.argv.indexOf('--specimen');
if (idxSpecimen !== -1) {
  const cheminSortie = process.argv[idxSpecimen + 1];
  if (!cheminSortie) {
    console.error('\n--specimen demande un chemin de sortie, ex. --specimen ~/Desktop/cheque.pdf');
  } else if (!specimenMap) {
    console.log('\nAucun spécimen de chèque déposé.');
  } else {
    const specimen = {
      iv: specimenMap.iv?.stringValue ?? '',
      contentType: specimenMap.contentType?.stringValue ?? 'application/octet-stream',
      taille: Number(specimenMap.taille?.integerValue ?? 0),
    };
    const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(CHEMIN_SPECIMEN_STORAGE)}?alt=media`;
    const rf = await fetch(url, { headers: entetes });
    if (!rf.ok) {
      console.error(`\nTéléchargement du spécimen impossible (${rf.status}).`);
    } else {
      const chiffre = Buffer.from(await rf.arrayBuffer());
      const ivFichier = Buffer.from(specimen.iv, 'base64');
      const corpsF = chiffre.subarray(0, chiffre.length - 16);
      const etiquetteF = chiffre.subarray(chiffre.length - 16);
      const dechiffreurF = createDecipheriv('aes-256-gcm', cleAes, ivFichier);
      dechiffreurF.setAuthTag(etiquetteF);
      const clairFichier = Buffer.concat([dechiffreurF.update(corpsF), dechiffreurF.final()]);
      writeFileSync(cheminSortie, clairFichier);
      console.log(`\nSpécimen déchiffré : ${cheminSortie} (${specimen.contentType}, ${clairFichier.length} octets).`);
    }
  }
}

await fetch(`${DOC}?updateMask.fieldPaths=luLe`, { method: 'PATCH', headers: entetes, body: JSON.stringify({ fields: { luLe: { timestampValue: new Date().toISOString() } } }) });
console.log('\nMarqué comme lu. Une fois les comptes ouverts : node scripts/coffre-lire.mjs --effacer');
