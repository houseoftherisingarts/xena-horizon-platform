#!/usr/bin/env node
/**
 * Vérifie les gabarits de l'infolettre : rend chaque gabarit (les deux langues) avec le même
 * moteur que le composeur (lib/infolettre/renderer.tsx + email.ts), puis contrôle que toutes les
 * adresses d'image sont absolues (le courriel se lit hors du site) et qu'aucun tiret cadratin ne
 * traîne dans le HTML produit. esbuild transpile les .ts/.tsx à la volée : pas de librairie de
 * test, juste des `assert` (ponytail : le plus petit script qui casse si le moteur casse).
 *
 * Usage : node scripts/verif-infolettre.mjs
 */
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const racine = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Un seul point d'entrée qui réexporte tout ce dont ce script a besoin : esbuild bundle les
// modules TS du projet (renderer, email, gabarits, contenu) en un fichier ESM que node exécute.
const entree = `
export { chargerGabarits, piedCourriel } from ${JSON.stringify(path.join(racine, 'lib/infolettre/gabarits.ts'))};
export { renderEmailHtml } from ${JSON.stringify(path.join(racine, 'lib/infolettre/email.ts'))};
export { BRAND } from ${JSON.stringify(path.join(racine, 'lib/infolettre/renderer.tsx'))};
`;

const dossierTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'xena-verif-infolettre-'));
const sortie = path.join(dossierTmp, 'bundle.mjs');

await build({
  stdin: { contents: entree, resolveDir: racine, loader: 'ts' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: sortie,
  jsx: 'transform',
  // 'react' est déjà une dépendance du projet : esbuild le résout dans node_modules comme Vite le ferait.
  external: [],
  logLevel: 'silent',
});

const { chargerGabarits, piedCourriel, renderEmailHtml } = await import(sortie);

// public/balado.json n'existe qu'après un `npm run build` (scripts/balado.mjs l'écrit). Le script
// sert quand même sans lui : le gabarit balado est simplement absent du lot vérifié.
globalThis.fetch = async () => ({ ok: false });
if (fs.existsSync(path.join(racine, 'public/balado.json'))) {
  const brut = fs.readFileSync(path.join(racine, 'public/balado.json'), 'utf8');
  globalThis.fetch = async (url) => (String(url).includes('balado.json') ? { ok: true, json: async () => JSON.parse(brut) } : { ok: false });
}

const TIRET_CADRATIN = /—/;
const SITE = 'https://xenahorizon.com';

let total = 0;
let echecs = 0;

function verifier(nom, html) {
  total++;
  try {
    assert.ok(!TIRET_CADRATIN.test(html), `tiret cadratin trouvé dans « ${nom} »`);
    // Chaque src="..." doit commencer par http:// ou https:// (un chemin relatif casserait dans
    // une boîte de réception, qui ne connaît pas le site).
    const srcs = [...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
    for (const src of srcs) {
      assert.ok(/^https?:\/\//.test(src), `image relative « ${src} » dans « ${nom} » (doit être absolue)`);
    }
    assert.ok(html.includes(piedCourriel) || !piedCourriel, `pied de lettre absent dans « ${nom} »`);
    console.log(`  ok  ${nom} (${srcs.length} image${srcs.length > 1 ? 's' : ''})`);
  } catch (e) {
    echecs++;
    console.error(`  ÉCHEC  ${nom} : ${e.message}`);
  }
}

const gabarits = await chargerGabarits();
console.log(`${gabarits.length} gabarit(s) chargé(s) : ${gabarits.map((g) => g.id).join(', ')}`);

for (const g of gabarits) {
  for (const langue of ['fr', 'en']) {
    const c = g.construire(langue);
    const html = renderEmailHtml(c.blocs, {
      subject: c.sujet,
      preheader: c.preheader,
      unsubscribeUrl: `${SITE}/desabonnement?e=test`,
      postalAddress: piedCourriel,
      fond: c.fond,
      bandeau: c.bandeau,
    });
    verifier(`${g.id} · ${langue}`, html);
  }
}

fs.rmSync(dossierTmp, { recursive: true, force: true });

console.log(`\n${total - echecs}/${total} rendus valides.`);
if (echecs > 0) process.exit(1);
