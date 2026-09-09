// Post-build : écrit dist/<route>/index.html avec un head propre (title/description/canonical/og/
// twitter/JSON-LD) et du contenu HTML statique réel par page publique, pour que les crawlers et les
// moteurs de citation IA voient les vrais mots du site sans exécuter le JS. React remplace ce HTML au
// montage (createRoot.render dans index.tsx) : c'est voulu, il ne sert qu'aux lecteurs qui n'exécutent
// pas le JS. Écrit aussi dist/sitemap.xml, dist/robots.txt, dist/404.html, et referme le canonical de
// l'archive dist/history/v1/index.html si elle existe. Patron porté de vexel-site/scripts/prerender-
// meta.mjs et de FMM 2026/scripts/gen-sitemap.mjs, adapté aux quatre routes de Xena Horizon.
//
// Le contenu vient exclusivement de lib/contenu.ts et pages/accueil/textes.ts (source de vérité du
// site, cf CLAUDE.md) : rien n'est inventé ici. Ces fichiers sont en TypeScript ; ce script tourne en
// Node nu, donc esbuild (déjà une dépendance de Vite, aucun paquet ajouté) les transpile en mémoire
// avant un import() dynamique — plus simple et plus robuste qu'un flag Node expérimental.
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as esbuildBuild } from 'esbuild';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ORIGIN = 'https://xenahorizon.com';
const OG_IMAGE = `${ORIGIN}/images/og-1200x630.jpg`;
const BUILD_DATE = new Date().toISOString().slice(0, 10);

async function chargerModule(cheminRelatif) {
  const { outputFiles } = await esbuildBuild({
    entryPoints: [join(root, cheminRelatif)],
    bundle: false,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'node20',
  });
  const tmp = join(root, `node_modules/.tmp-${cheminRelatif.replace(/[\\/]/g, '-')}.mjs`);
  writeFileSync(tmp, outputFiles[0].text);
  try {
    return await import(`file://${tmp}?t=${Date.now()}`);
  } finally {
    try {
      unlinkSync(tmp);
    } catch {
      /* déjà nettoyé */
    }
  }
}

const { BLOCS_ACCUEIL, BLOCS_ACCUEIL_EN, PROFILS_REELS, SERVICES_REELS, SERVICES_PAGE, TEMOIGNAGES, PROJETS, PROJETS_PAGE, COORDONNEES, A_PROPOS, CLIENTS_CONFIANCE, CLIENTS_TITRE } =
  await chargerModule('lib/contenu.ts');
const { A_PROPOS_ACCUEIL } = await chargerModule('pages/accueil/textes.ts');

const HERO = BLOCS_ACCUEIL.find((b) => b.type === 'HERO');
const SERVICES_BLOC = BLOCS_ACCUEIL.find((b) => b.type === 'SERVICES_PREVIEW');
const STATS = BLOCS_ACCUEIL.find((b) => b.type === 'STATS');
const CONTACT_BLOC = BLOCS_ACCUEIL.find((b) => b.type === 'CONTACT');
const BALADO = PROJETS.find((p) => p.id === 'balado');
const LIVRE = PROJETS.find((p) => p.id === 'livre');
const SPOTIFY_URL = BALADO.liens.find((l) => l.label === 'Spotify').url;
const BALADO_QUEBEC_URL = BALADO.liens.find((l) => l.label === 'Balado Québec').url;
const INSTAGRAM_URL = 'https://www.instagram.com/belhu33';
const TELEPHONE_E164 = COORDONNEES.telephoneHref.replace('tel:', '');

// --- Petits utilitaires de rendu texte → HTML sobre (aucun style, aucun script) ---
const esc = (s) =>
  String(s)
    .replace(/\n/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const p = (texte) => `<p>${esc(texte)}</p>`;
const li = (texte) => `<li>${esc(texte)}</li>`;

/** Dès X $ + taxes / Dès X $ / mois (abonnement) / Sur demande — même règle que prixAffiche() dans
    pages/PublicServices.tsx, pour que le prix statique dise exactement ce que dit la page réelle. */
const prixAffiche = (service) => {
  if (service.price <= 0) return 'Sur demande';
  const montant = service.price.toLocaleString('fr-CA');
  if (service.id === 'abonnement-mensuel') return `Dès ${montant} $ / mois`;
  return `Dès ${montant} $ + taxes`;
};

// --- Contenu HTML statique par page (h1, sous-titre, sections avec h2 et paragraphes) ---
function contenuAccueil() {
  return `
    <h1>${esc(HERO.headline)}</h1>
    ${p(HERO.subheadline)}
    <p><a href="#contact">${esc(HERO.ctaText)}</a></p>
    <section>
      <h2>${esc(SERVICES_BLOC.title)}</h2>
      ${p(SERVICES_BLOC.subtitle)}
      ${PROFILS_REELS.map(
        (profil) => `
      <article>
        <h3>${esc(profil.titleFR)}</h3>
        ${p(profil.descriptionFR)}
        ${p(profil.detailsFR)}
      </article>`
      ).join('')}
    </section>
    <section>
      <h2>${esc(A_PROPOS_ACCUEIL.titre.FR)}</h2>
      ${A_PROPOS_ACCUEIL.paragraphes.FR.map(p).join('')}
      ${p(A_PROPOS_ACCUEIL.mission.FR)}
      <ul>
        <li>${esc(STATS.stat1Value)} — ${esc(STATS.stat1Label)}</li>
        <li>${esc(STATS.stat2Value)} — ${esc(STATS.stat2Label)}</li>
        <li>${esc(STATS.stat3Value)} — ${esc(STATS.stat3Label)}</li>
      </ul>
    </section>
    <section>
      <!-- Extrait verbatim de pages/accueil/Temoignage.tsx (TEXTES.FR.extrait), pas dans lib/contenu.ts -->
      <h2>« créer une ligne directrice claire et précise »</h2>
      ${p(TEMOIGNAGES[0].texteFR)}
      <p>${esc(TEMOIGNAGES[0].nom)} — ${esc(TEMOIGNAGES[0].role)}</p>
    </section>
    <section>
      <h2>Les projets</h2>
      <ul>
        ${PROJETS.map((proj) => `<li><a href="/projets">${esc(proj.titre)}</a> — ${esc(proj.sousTitre)}</li>`).join('')}
      </ul>
    </section>
    <section id="contact">
      <h2>${esc(CONTACT_BLOC.title)}</h2>
      ${p(CONTACT_BLOC.text)}
      <p>
        <a href="mailto:${esc(COORDONNEES.courriel)}">${esc(COORDONNEES.courriel)}</a> ·
        <a href="${esc(COORDONNEES.telephoneHref)}">${esc(COORDONNEES.telephone)}</a> ·
        ${esc(COORDONNEES.zones)}
      </p>
    </section>
    <section>
      <h2>Ils lui ont fait confiance</h2>
      <ul>${CLIENTS_CONFIANCE.map(li).join('')}</ul>
    </section>`;
}

function contenuServices() {
  return `
    <h1>${esc(SERVICES_PAGE.titreFR)}</h1>
    ${p(SERVICES_BLOC.subtitle)}
    ${SERVICES_REELS.map(
      (svc) => `
    <section>
      <h2>${esc(svc.name)}</h2>
      ${p(svc.description)}
      <p><strong>Prix : </strong>${esc(prixAffiche(svc))}</p>
    </section>`
    ).join('')}`;
}

function contenuProjets() {
  return `
    <h1>${esc(PROJETS_PAGE.titre)}</h1>
    ${p(PROJETS_PAGE.lede)}
    ${PROJETS.map(
      (proj) => `
    <section>
      <h2>${esc(proj.titre)}</h2>
      <p>${esc(proj.sousTitre)}</p>
      ${proj.description.map(p).join('')}
      ${proj.extra ? p(proj.extra) : ''}
      <ul>${proj.liens.map((l) => `<li><a href="${esc(l.url)}">${esc(l.label)}</a></li>`).join('')}</ul>
    </section>`
    ).join('')}`;
}

function contenuAPropos() {
  // Le h1 réel de PublicAPropos.tsx est le nom (LAURIE / BELHUMEUR en deux lignes), pas A_PROPOS.titre
  // (qui sert de h2 plus bas, « Brève histoire d'un tout ») : même texte, même ordre qu'à l'écran.
  return `
    <h1>Laurie Belhumeur</h1>
    ${p(A_PROPOS.tagline)}
    <section>
      ${A_PROPOS.paragraphes.map(p).join('')}
      ${p(A_PROPOS.mission)}
    </section>
    <section>
      <h2>Un amalgame inusité</h2>
      <ul>${A_PROPOS.casquettesFR.map(li).join('')}</ul>
    </section>`;
}

// --- JSON-LD : @graph par page, @id partagés pour que le site se lise comme un seul graphe ---
const offerNode = (service) => ({
  '@type': 'Offer',
  name: service.name,
  description: service.description,
  url: `${ORIGIN}/services`,
  priceSpecification:
    service.price > 0
      ? { '@type': 'UnitPriceSpecification', price: service.price, priceCurrency: 'CAD' }
      : { '@type': 'UnitPriceSpecification', priceCurrency: 'CAD', description: 'Sur demande' },
});

const serviceNode = (complet) => {
  const base = { '@type': 'ProfessionalService', '@id': `${ORIGIN}/#service`, name: 'Xena Horizon', url: ORIGIN };
  if (!complet) return base;
  return {
    ...base,
    description: PAGES_DESC.home,
    telephone: TELEPHONE_E164,
    email: COORDONNEES.courriel,
    areaServed: COORDONNEES.zones.split(', '),
    image: OG_IMAGE,
    sameAs: [SPOTIFY_URL, INSTAGRAM_URL],
    dateModified: BUILD_DATE,
    founder: { '@id': `${ORIGIN}/#laurie-belhumeur` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services Xena Horizon',
      itemListElement: SERVICES_REELS.map(offerNode),
    },
  };
};

const personNode = (complet) => {
  const base = { '@type': 'Person', '@id': `${ORIGIN}/#laurie-belhumeur`, name: 'Laurie Belhumeur' };
  if (!complet) return base;
  return {
    ...base,
    jobTitle: A_PROPOS.tagline,
    description: A_PROPOS.mission,
    worksFor: { '@id': `${ORIGIN}/#service` },
    image: `${ORIGIN}/images/laurie-apropos.jpg`,
    sameAs: [SPOTIFY_URL, INSTAGRAM_URL],
    url: `${ORIGIN}/a-propos`,
  };
};

const itemListServicesNode = () => ({
  '@type': 'ItemList',
  name: 'Services Xena Horizon',
  itemListElement: SERVICES_REELS.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.name,
    url: `${ORIGIN}/services`,
    item: {
      '@type': 'Service',
      name: s.name,
      description: s.description,
      provider: { '@id': `${ORIGIN}/#service` },
      offers: offerNode(s),
    },
  })),
});

const podcastNode = () => ({
  '@type': 'PodcastSeries',
  name: BALADO.titre,
  description: BALADO.description[0],
  url: BALADO_QUEBEC_URL,
  sameAs: [SPOTIFY_URL],
  image: `${ORIGIN}${BALADO.image}`,
});

const bookNode = () => ({
  '@type': 'Book',
  name: LIVRE.titre,
  description: LIVRE.description[0],
  author: { '@id': `${ORIGIN}/#laurie-belhumeur` },
  url: LIVRE.liens[0].url,
  image: `${ORIGIN}${LIVRE.image}`,
  offers: {
    '@type': 'Offer',
    url: LIVRE.liens[0].url,
    priceSpecification: { '@type': 'UnitPriceSpecification', price: 21.95, priceCurrency: 'CAD' },
  },
});

const breadcrumbNode = (nom, chemin) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${ORIGIN}/` },
    { '@type': 'ListItem', position: 2, name: nom, item: `${ORIGIN}${chemin}` },
  ],
});

// --- Titres et descriptions : ≤ 65 caractères le titre de l'accueil, ≤ 160 les descriptions de
// l'accueil, des services et de à-propos (raccourcis sans inventer, mêmes faits que le site). ---
const PAGES_DESC = {
  home: 'Xena Horizon accompagne les artistes, les créateurs et les organismes culturels : stratégie de communication, identité artistique, événements et rédaction.',
  services:
    'Stratégie de communication, rédaction, identité artistique et événements pour les artistes, les créatifs et les organisations, prix de départ affichés.',
  projets: 'Le balado En quête de liberté, le livre Je ne suis pas un robot et le projet de modèle et comédienne de Laurie Belhumeur.',
  apropos:
    'Consultante en carrière artistique et en communication depuis quinze ans, Laurie Belhumeur accompagne les artistes pour qu’ils vivent de leur art.',
  espace: 'L’espace client de Xena Horizon : suivez votre dossier d’accompagnement avec Laurie Belhumeur.',
};

const PAGES = [
  {
    path: '/',
    dir: '',
    title: 'Xena Horizon | Laurie Belhumeur, consultante en carrière',
    desc: PAGES_DESC.home,
    noindex: false,
    contenu: contenuAccueil(),
    jsonLdGraph: [serviceNode(true), personNode(true)],
  },
  {
    path: '/services',
    dir: 'services',
    title: 'Services et tarifs | Xena Horizon',
    desc: PAGES_DESC.services,
    noindex: false,
    contenu: contenuServices(),
    jsonLdGraph: [serviceNode(false), itemListServicesNode(), breadcrumbNode('Services', '/services')],
  },
  {
    path: '/projets',
    dir: 'projets',
    title: 'Projets : balado, livre, modèle | Xena Horizon',
    desc: PAGES_DESC.projets,
    noindex: false,
    contenu: contenuProjets(),
    jsonLdGraph: [podcastNode(), bookNode(), breadcrumbNode('Projets', '/projets')],
  },
  {
    path: '/a-propos',
    dir: 'a-propos',
    title: 'À propos de Laurie Belhumeur | Xena Horizon',
    desc: PAGES_DESC.apropos,
    noindex: false,
    contenu: contenuAPropos(),
    jsonLdGraph: [personNode(true), breadcrumbNode('À propos', '/a-propos')],
  },
  {
    path: '/espace',
    dir: 'espace',
    title: 'Mon espace | Xena Horizon',
    desc: PAGES_DESC.espace,
    noindex: true,
    contenu: null,
    jsonLdGraph: null,
  },
];

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const base = readFileSync(join(root, 'dist/index.html'), 'utf8');

for (const pg of PAGES) {
  const canonical = `${ORIGIN}${pg.path}`;
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(pg.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(pg.desc)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(pg.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(pg.desc)}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(canonical)}$2`)
    .replace(/(<meta\s+property="og:image"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(OG_IMAGE)}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(pg.title)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(pg.desc)}$2`)
    .replace(/(<meta\s+name="twitter:image"\s+content=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(OG_IMAGE)}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(canonical)}$2`);

  if (pg.noindex) {
    html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
  }
  if (pg.jsonLdGraph) {
    const doc = { '@context': 'https://schema.org', '@graph': pg.jsonLdGraph };
    const script = `  <script type="application/ld+json">${JSON.stringify(doc)}</script>\n`;
    html = html.replace('</head>', `${script}  </head>`);
  }
  if (pg.contenu) {
    html = html.replace('<div id="root"></div>', `<div id="root">${pg.contenu}</div>`);
  }

  const dir = pg.dir ? join(root, 'dist', pg.dir) : join(root, 'dist');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// --- Sitemap : routes publiques indexables seulement, /espace et /admin exclus. ---
const today = BUILD_DATE;
const sitemapPages = PAGES.filter((pg) => !pg.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (pg) => `  <url>
    <loc>${ORIGIN}${pg.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${pg.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${pg.path === '/' ? '1.0' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(root, 'dist/sitemap.xml'), sitemap, 'utf8');

// --- Robots : tout ouvert sauf /admin, /espace et l'archive /history, avec des blocs nommés pour les
// robots des moteurs génératifs (GEO) en plus du bloc générique. ---
const DISALLOW = ['/admin', '/espace', '/history'];
const blocRobots = (agent) => `User-agent: ${agent}\nAllow: /\n${DISALLOW.map((d) => `Disallow: ${d}`).join('\n')}\n`;
const AGENTS = ['*', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
const robots = `${AGENTS.map(blocRobots).join('\n')}\nSitemap: ${ORIGIN}/sitemap.xml\n`;
writeFileSync(join(root, 'dist/robots.txt'), robots, 'utf8');

// --- 404 : copie du gabarit (l'app complète, pour que /admin/* reste utilisable) avec titre propre,
// noindex, et sans canonical (aucune adresse canonique pour une page qui n'existe pas). ---
const html404 = base
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Page introuvable | Xena Horizon</title>')
  .replace(/\s*<link\s+rel="canonical"[^>]*\/?>\n?/, '\n')
  .replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
writeFileSync(join(root, 'dist/404.html'), html404, 'utf8');

// --- Archive /history/v1 : ne jamais toucher public/history (la source), seulement son double dans
// dist/ une fois construit — canonical sur lui-même, noindex, pour ne jamais concurrencer le site actuel. ---
const historyPath = join(root, 'dist/history/v1/index.html');
if (existsSync(historyPath)) {
  let historyHtml = readFileSync(historyPath, 'utf8');
  const historyUrl = `${ORIGIN}/history/v1/`;
  historyHtml = historyHtml
    .replace(/(<link\s+rel="canonical"\s+href=")[\s\S]*?("\s*\/?>)/, `$1${escAttr(historyUrl)}$2`)
    .replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
  writeFileSync(historyPath, historyHtml, 'utf8');
}

console.log(
  `prerender-meta: ${PAGES.length} pages écrites (contenu statique sur /, /services, /projets, /a-propos), sitemap.xml (${sitemapPages.length} urls), robots.txt (${AGENTS.length} agents), 404.html${
    existsSync(historyPath) ? ', history/v1 refermée' : ''
  }.`
);
