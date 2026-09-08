// Chantier chargement (8 sept 2026, soir) : mesure ce qu'un visiteur voit à froid.
// Trois volets : (A) chargement à froid des cinq pages publiques (erreurs console, LCP, CLS) ;
// (B) le flash de police, à 150 ms / 400 ms / 1 500 ms après la navigation, réseau ralenti,
// à 1440 et à 390 ; (C) résilience à un fragment de build disparu (déploiement plus récent que
// l'onglet ouvert) : le fragment /admin est bloqué pour simuler ce cas, on vérifie que la page se
// recharge d'elle-même une fois puis, si ça persiste, que ErreurRacine prend le relais au lieu
// d'une page blanche figée.
// Usage : node scripts/qa-chargement.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4183';
const OUT = process.argv[3] || 'captures-chargement';
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { nom: 'accueil', chemin: '/' },
  { nom: 'services', chemin: '/services' },
  { nom: 'projets', chemin: '/projets' },
  { nom: 'a-propos', chemin: '/a-propos' },
  { nom: 'espace', chemin: '/espace' },
];

const rapport = { volA_chargementFroid: [], volB_flashPolice: [], volC_fragmentDisparu: null };

// --- Volet A : chargement à froid, erreurs console, LCP/CLS ---
async function voletA(browser) {
  for (const p of PAGES) {
    const ctx = await browser.newContext(); // contexte neuf = cache vide, à chaque page
    const page = await ctx.newPage();
    const erreursConsole = [];
    const erreursPage = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') erreursConsole.push(msg.text());
    });
    page.on('pageerror', (err) => erreursPage.push(String(err)));

    await page.addInitScript(() => {
      window.__perf = { lcp: 0, cls: 0 };
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__perf.lcp = last.renderTime || last.loadTime || 0;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__perf.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        // PerformanceObserver absent (contexte de test) : mesures à zéro, non bloquant
      }
    });

    // 'networkidle' n'arrive jamais : Firestore garde un WebSocket ouvert en continu (useDocument/
    // useCollection). 'load' + une pause fixe suffit à laisser le LCP et l'intro se stabiliser.
    await page.goto(BASE + p.chemin, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(1500);
    const perf = await page.evaluate(() => window.__perf);
    await page.screenshot({ path: path.join(OUT, `froid-${p.nom}-1440.png`), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `froid-${p.nom}-390.png`), fullPage: false });

    rapport.volA_chargementFroid.push({
      page: p.nom,
      lcpMs: Math.round(perf.lcp),
      cls: Number(perf.cls.toFixed(4)),
      erreursConsole,
      erreursPage,
    });
    await ctx.close();
  }
}

// --- Volet B : le flash de police, réseau ralenti, trois instants ---
async function voletB(browser) {
  for (const taille of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: taille, height: taille === 1440 ? 900 : 844 } });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    // Réseau ralenti (proche d'un "Slow 4G") pour que les trois instants montrent des états distincts.
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (400 * 1024) / 8,
      uploadThroughput: (400 * 1024) / 8,
      latency: 150,
    });
    const debut = Date.now();
    page.goto(BASE + '/', { waitUntil: 'load' }).catch(() => {});
    const instants = [150, 400, 1500];
    const etats = [];
    for (const cible of instants) {
      const attendre = cible - (Date.now() - debut);
      if (attendre > 0) await page.waitForTimeout(attendre);
      const etatPolices = await page.evaluate(() => ({
        figtreeChargee: document.fonts.check('16px Figtree'),
        playfairChargee: document.fonts.check('16px "Playfair Display"'),
        pretes: document.fonts.status,
      })).catch(() => ({ figtreeChargee: false, playfairChargee: false, pretes: 'inconnu' }));
      await page.screenshot({ path: path.join(OUT, `flash-${taille}-${cible}ms.png`) }).catch(() => {});
      etats.push({ instantMs: cible, ...etatPolices });
    }
    await page.waitForTimeout(2000); // laisse le réseau ralenti finir de tout livrer avant de fermer
    rapport.volB_flashPolice.push({ taille, etats });
    await ctx.close();
  }
}

// --- Volet C : un fragment de build qui répond 404 (le cas « après un déploiement ») ---
async function voletC(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let rechargements = 0;
  page.on('framenavigated', (fr) => {
    if (fr === page.mainFrame()) rechargements += 1;
  });
  // Bloque tout fragment dont le nom commence par AdminDashboard : c'est le cas d'un fragment
  // dont le hash a changé au dernier déploiement pendant qu'un onglet restait ouvert.
  await page.route('**/assets/AdminDashboard-*.js', (route) => route.abort('failed'));

  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 20000 });
  // Force la vue admin (le crayon de démo n'est pas nécessaire : on vise seulement le fragment qui échoue).
  await page.evaluate(() => window.history.pushState({}, '', '/admin'));
  await page.evaluate(() => window.dispatchEvent(new PopStateEvent('popstate')));
  await page.waitForTimeout(3000); // le premier échec doit déclencher un rechargement automatique

  const texteApres = await page.evaluate(() => document.body.innerText).catch(() => '');
  await page.screenshot({ path: path.join(OUT, 'fragment-disparu-apres.png') }).catch(() => {});

  rapport.volC_fragmentDisparu = {
    rechargementsDetectes: rechargements,
    ecranDeRecoursVisible: /Recharger|Reload|échoué|failed/i.test(texteApres),
    extraitTexte: texteApres.slice(0, 200),
  };
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  await voletA(browser);
  await voletB(browser);
  await voletC(browser);
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  console.log(JSON.stringify(rapport, null, 2));
})();
