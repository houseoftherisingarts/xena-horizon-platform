// Post-build : écrit dist/<route>/index.html avec title/description/canonical/og propres à chaque
// page publique, pour que les partages et les moteurs voient le bon head sans exécuter le JS.
// Écrit aussi dist/sitemap.xml et dist/robots.txt. Patron porté de vexel-site/scripts/prerender-meta.mjs
// et de FMM 2026/scripts/gen-sitemap.mjs, adapté aux quatre routes de Xena Horizon.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ORIGIN = 'https://xenahorizon.com';
const OG_IMAGE = `${ORIGIN}/images/laurie-portrait-nb.jpg`;

const PAGES = [
  {
    path: '/',
    dir: '',
    title: 'Xena Horizon | Laurie Belhumeur, consultante en carrière artistique et communication',
    desc: 'Xena Horizon accompagne les artistes, les créateurs et les organismes culturels : stratégie de communication, identité artistique, événements et rédaction, avec Laurie Belhumeur.',
    noindex: false,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Xena Horizon',
      founder: { '@type': 'Person', name: 'Laurie Belhumeur' },
      telephone: '+1-514-821-8755',
      email: 'laurie.belhumeur@gmail.com',
      areaServed: ['Montréal', 'Montérégie', 'Estrie'],
      url: ORIGIN,
      image: OG_IMAGE,
      sameAs: [
        'https://open.spotify.com/show/xena-horizon',
        'https://www.instagram.com/belhu33',
      ],
    },
  },
  {
    path: '/services',
    dir: 'services',
    title: 'Services et tarifs | Xena Horizon',
    desc: 'Stratégie de communication, rédaction, identité artistique et événements pour les artistes, les créatifs et les organisations, avec les prix de départ de Laurie Belhumeur.',
    noindex: false,
  },
  {
    path: '/projets',
    dir: 'projets',
    title: 'Projets : balado, livre, modèle | Xena Horizon',
    desc: 'Le balado En quête de liberté, le livre Je ne suis pas un robot et le projet de modèle et comédienne de Laurie Belhumeur.',
    noindex: false,
  },
  {
    path: '/a-propos',
    dir: 'a-propos',
    title: 'À propos de Laurie Belhumeur | Xena Horizon',
    desc: 'Consultante en carrière artistique et en communication depuis quinze ans, Laurie Belhumeur accompagne les artistes de toutes disciplines pour qu’ils vivent de leur art.',
    noindex: false,
  },
  {
    path: '/espace',
    dir: 'espace',
    title: 'Mon espace | Xena Horizon',
    desc: 'L’espace client de Xena Horizon : suivez votre dossier d’accompagnement avec Laurie Belhumeur.',
    noindex: true,
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const base = readFileSync(join(root, 'dist/index.html'), 'utf8');

for (const p of PAGES) {
  const canonical = `${ORIGIN}${p.path}`;
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${esc(p.desc)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${esc(p.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${esc(p.desc)}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${esc(canonical)}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[\s\S]*?("\s*\/?>)/, `$1${esc(canonical)}$2`);

  if (p.noindex) {
    html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
  }
  if (p.jsonLd) {
    const script = `  <script type="application/ld+json">${JSON.stringify(p.jsonLd)}</script>\n`;
    html = html.replace('</head>', `${script}  </head>`);
  }

  const dir = p.dir ? join(root, 'dist', p.dir) : join(root, 'dist');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// --- Sitemap : routes publiques indexables seulement, /espace et /admin exclus. ---
const today = new Date().toISOString().slice(0, 10);
const sitemapPages = PAGES.filter((p) => !p.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (p) => `  <url>
    <loc>${ORIGIN}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(root, 'dist/sitemap.xml'), sitemap, 'utf8');

// --- Robots : tout ouvert sauf /admin et /espace. ---
const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /espace

Sitemap: ${ORIGIN}/sitemap.xml
`;
writeFileSync(join(root, 'dist/robots.txt'), robots, 'utf8');

console.log(`prerender-meta: ${PAGES.length} pages écrites, sitemap.xml (${sitemapPages.length} urls), robots.txt`);
