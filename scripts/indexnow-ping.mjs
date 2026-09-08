// Après le build : signale à IndexNow (Bing, Yandex, et les moteurs qui suivent le protocole) les
// URL du sitemap fraîchement écrit. Best-effort : toute erreur (réseau, timeout, clé absente) se
// journalise et sort en succès, jamais en échec, pour ne jamais casser `npm run build`.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const HOST = 'xenahorizon.com';
const KEY = 'ec2521ca0d8568feb54ce935a5d660bd';

async function main() {
  const sitemapPath = join(root, 'dist/sitemap.xml');
  if (!existsSync(sitemapPath)) {
    console.log('indexnow-ping: pas de dist/sitemap.xml, rien à signaler.');
    return;
  }
  const xml = readFileSync(sitemapPath, 'utf8');
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urlList.length === 0) {
    console.log('indexnow-ping: sitemap vide, rien à signaler.');
    return;
  }

  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  });

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
    signal: AbortSignal.timeout(8000),
  });
  console.log(`indexnow-ping: ${urlList.length} URL signalées, statut ${res.status}.`);
}

try {
  await main();
} catch (err) {
  console.warn('indexnow-ping: échec sans conséquence sur le build —', err?.message ?? err);
}
process.exit(0);
