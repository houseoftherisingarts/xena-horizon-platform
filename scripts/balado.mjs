// Avant le build : lit le flux RSS du balado « En quête de liberté » (Balado Québec) et écrit
// public/balado.json, que components/Balado.tsx lit pour faire écouter les épisodes dans le site.
// Le flux n'ouvre pas le CORS au navigateur : l'instantané se prend ici, à chaque déploiement.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FLUX = 'https://baladoquebec.ca/enquetedeliberte/rss';
const sortie = join(dirname(dirname(fileURLToPath(import.meta.url))), 'public', 'balado.json');
const texte = (bloc, balise) => {
  const m = bloc.match(new RegExp(`<${balise}[^>]*>([\\s\\S]*?)</${balise}>`, 'i'));
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
};
try {
  const xml = await (await fetch(FLUX, { headers: { 'user-agent': 'xenahorizon.com (instantané du balado)' } })).text();
  const canal = { titre: texte(xml.split('<item')[0], 'title'), image: (xml.match(/<itunes:image[^>]*href="([^"]+)"/i) || [])[1] || '' };
  const episodes = xml.split('<item').slice(1).map((bloc) => {
    const url = (bloc.match(/<enclosure[^>]*url="([^"]+)"/i) || [])[1] || '';
    const dureeBrute = texte(bloc, 'itunes:duration');
    const duree = /^\d+$/.test(dureeBrute) ? Number(dureeBrute) : dureeBrute.split(':').reduce((a, v) => a * 60 + Number(v), 0);
    return { titre: texte(bloc, 'title'), date: new Date(texte(bloc, 'pubDate')).toISOString().slice(0, 10), duree, description: texte(bloc, 'description').slice(0, 600), url, image: (bloc.match(/<itunes:image[^>]*href="([^"]+)"/i) || [])[1] || canal.image };
  }).filter((e) => e.url);
  writeFileSync(sortie, JSON.stringify({ ...canal, flux: FLUX, prisLe: new Date().toISOString().slice(0, 10), episodes }, null, 1));
  console.log(`balado.json : ${episodes.length} épisodes`);
} catch (err) {
  console.warn('balado.json : flux injoignable, instantané précédent conservé', existsSync(sortie) ? '' : '(aucun)', err.message);
  if (!existsSync(sortie)) writeFileSync(sortie, JSON.stringify({ episodes: [] }));
}
