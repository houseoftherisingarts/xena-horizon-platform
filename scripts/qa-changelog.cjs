// Boucle de vérification visuelle de l'onglet Journal des changements.
// Usage : node scripts/qa-changelog.cjs <baseUrl> <dossierSortie>
// Le harnais qa-changelog.html se bâtit d'abord avec scripts/vite.qa.changelog.config.ts.
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4319';
const OUT = process.argv[3] || 'captures-journal';
fs.mkdirSync(OUT, { recursive: true });

const erreurs = [];

(async () => {
  const browser = await chromium.launch();
  for (const [nom, largeur] of [['desktop', 1440], ['mobile', 390]]) {
    for (const lang of ['FR', 'EN']) {
      const ctx = await browser.newContext({ viewport: { width: largeur, height: 900 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const console_ = [];
      page.on('console', (m) => m.type() === 'error' && console_.push(m.text()));
      page.on('pageerror', (e) => console_.push(String(e)));
      await page.goto(`${BASE}/qa-changelog.html?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const mesure = await page.evaluate(() => {
        const deborde = [...document.querySelectorAll('*')]
          .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
          .map((e) => e.tagName + '.' + String(e.className || '').slice(0, 50));
        const titres = [...document.querySelectorAll('ol h2')].map((h) => {
          const st = getComputedStyle(h);
          const lignes = Math.round(h.getBoundingClientRect().height / parseFloat(st.lineHeight));
          return { texte: h.textContent.slice(0, 40), lignes };
        });
        return {
          vp: window.innerWidth,
          scroll: document.documentElement.scrollWidth,
          deborde: deborde.slice(0, 5),
          titresTropLongs: titres.filter((t) => t.lignes > 2),
          entrees: document.querySelectorAll('ol > li').length,
        };
      });

      if (mesure.scroll > mesure.vp + 1) erreurs.push(`${nom} ${lang} : la page déborde (${mesure.scroll} > ${mesure.vp})`);
      if (mesure.deborde.length) erreurs.push(`${nom} ${lang} : ${mesure.deborde.length} éléments dépassent · ${mesure.deborde.join(' | ')}`);
      if (mesure.titresTropLongs.length) erreurs.push(`${nom} ${lang} : titres sur plus de deux lignes · ${mesure.titresTropLongs.map((t) => `${t.texte} (${t.lignes})`).join(' | ')}`);
      if (console_.length) erreurs.push(`${nom} ${lang} : erreurs console · ${console_.slice(0, 3).join(' | ')}`);
      if (!mesure.entrees) erreurs.push(`${nom} ${lang} : aucune entrée affichée`);

      await page.screenshot({ path: path.join(OUT, `${nom}-${lang}.png`), fullPage: true });
      console.log(`${nom} ${lang} · vp=${mesure.vp} scroll=${mesure.scroll} entrées=${mesure.entrees} débordent=${mesure.deborde.length}`);
      await ctx.close();
    }
  }
  await browser.close();
  if (erreurs.length) {
    console.log('\nFAUTES :');
    erreurs.forEach((e) => console.log(' · ' + e));
    process.exit(1);
  }
  console.log('\nAucune faute.');
})();
