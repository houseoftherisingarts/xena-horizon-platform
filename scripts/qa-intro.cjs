// Capture l'intro de l'accueil à quatre instants pour juger son rythme (2,4 s). Usage : node scripts/qa-intro.cjs <baseUrl> <dossier>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:4173'; const OUT = process.argv[3] || 'captures-v5';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch(); const r = {};
  for (const largeur of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 } });
    const page = await ctx.newPage();
    const t0 = Date.now();
    await page.goto(BASE + '/', { waitUntil: 'commit', timeout: 60000 });
    const instants = [500, 1200, 1800, 2400, 3000, 3700];
    for (const ms of instants) {
      const attente = ms - (Date.now() - t0); if (attente > 0) await page.waitForTimeout(attente);
      await page.screenshot({ path: path.join(OUT, `intro-${ms}ms-${largeur}.png`) });
      r[`${largeur}-${ms}`] = await page.evaluate(() => { const el = document.querySelector('.fixed.inset-0.z-\\[200\\]'); return el ? 'intro' : 'hero'; });
    }
    await ctx.close();
  }
  await browser.close(); console.log(JSON.stringify(r));
})();
