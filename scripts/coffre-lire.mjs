// Lit le coffre de Laurie (coffre/laurie) avec la clé privée d'Alex et affiche le contenu dans le terminal.
// Usage : node scripts/coffre-lire.mjs            (lire, numéro et CVV masqués, et marquer « lu »)
//         node scripts/coffre-lire.mjs --complet  (tout en clair, à l'instant d'ouvrir les comptes)
//         node scripts/coffre-lire.mjs --effacer  (supprimer le document une fois les comptes ouverts)
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createPrivateKey, privateDecrypt, createDecipheriv, constants } from 'node:crypto';
import { homedir } from 'node:os';

const PROJET = 'xena-70977';
const DOC = `https://firestore.googleapis.com/v1/projects/${PROJET}/databases/(default)/documents/coffre/laurie`;
const token = execSync('gcloud auth print-access-token').toString().trim();
const entetes = { Authorization: `Bearer ${token}`, 'x-goog-user-project': PROJET, 'Content-Type': 'application/json' };

if (process.argv.includes('--effacer')) {
  const r = await fetch(DOC, { method: 'DELETE', headers: entetes });
  console.log(r.ok ? 'Coffre effacé.' : `Échec : ${r.status}`);
  process.exit(0);
}

const r = await fetch(DOC, { headers: entetes });
if (r.status === 404) { console.log('Le coffre est vide : Laurie n\'a rien déposé.'); process.exit(0); }
const doc = await r.json();
const champ = (n) => doc.fields?.[n]?.stringValue ?? '';
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
await fetch(`${DOC}?updateMask.fieldPaths=luLe`, { method: 'PATCH', headers: entetes, body: JSON.stringify({ fields: { luLe: { timestampValue: new Date().toISOString() } } }) });
console.log('\nMarqué comme lu. Une fois les comptes ouverts : node scripts/coffre-lire.mjs --effacer');
