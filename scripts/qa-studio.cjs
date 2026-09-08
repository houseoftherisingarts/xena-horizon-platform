// Boucle verdict du studio social (refonte du 8 septembre 2026) : formats, gabarits, palettes,
// mode nuit et un export PNG réel. Usage : node scripts/qa-studio.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4184';
const OUT = process.argv[3] || 'captures-studio';
fs.mkdirSync(OUT, { recursive: true });

const rapport = { erreurs: [], captures: [] };

async function shot(page, nom) {
  const p = path.join(OUT, `${nom}.png`);
  try {
    await page.screenshot({ path: p, timeout: 45000 });
    rapport.captures.push(nom);
  } catch (e) {
    rapport.erreurs.push(`capture ${nom}: ${e.message.slice(0, 200)}`);
  }
}

(async () => {
  const browser = await chromium.launch();

  for (const largeur of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width: largeur, height: largeur === 1440 ? 900 : 844 } });
    page.on('console', (m) => { if (m.type() === 'error') rapport.erreurs.push(`${largeur} console: ${m.text().slice(0, 200)}`); });
    page.on('pageerror', (e) => rapport.erreurs.push(`${largeur} pageerror: ${e.message.slice(0, 200)}`));

    await page.goto(BASE + '/admin/social', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(700);
    await shot(page, `studio-defaut-${largeur}`);

    // Chaque gabarit : cliquer sa vignette (mobile : passer par l'onglet Gabarits d'abord).
    if (largeur === 390) {
      const ongletGabarits = page.getByRole('button', { name: /Gabarits|Templates/ }).first();
      if (await ongletGabarits.count()) await ongletGabarits.click();
      await page.waitForTimeout(300);
    }
    const panneauGabarits = page.locator('h2', { hasText: /^(Gabarits|Templates)$/ }).locator('xpath=ancestor::section[1]');
    const idsGabarits = ['citation', 'rendezvous', 'balado', 'temoignage', 'conseil', 'carrousel'];
    const boutonsGabarit = await panneauGabarits.locator('div.grid > button').all();
    for (let i = 0; i < idsGabarits.length; i++) {
      try {
        if (!boutonsGabarit[i]) throw new Error('vignette introuvable');
        await boutonsGabarit[i].click();
        if (largeur === 390) {
          const ongletToile = page.getByRole('button', { name: /Toile|Canvas/ }).first();
          if (await ongletToile.count()) await ongletToile.click();
        }
        await page.waitForTimeout(500);
        await shot(page, `studio-gabarit-${idsGabarits[i]}-${largeur}`);
      } catch (e) {
        rapport.erreurs.push(`${largeur} gabarit ${idsGabarits[i]}: ${e.message.slice(0, 200)}`);
      }
    }

    // Mode nuit
    await page.evaluate(() => localStorage.setItem('xena.nuit', '1'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(600);
    await shot(page, `studio-nuit-${largeur}`);
    await page.evaluate(() => localStorage.removeItem('xena.nuit'));

    // Palette encre
    await page.evaluate(() => localStorage.setItem('xena.skin', 'encre'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(600);
    await shot(page, `studio-encre-${largeur}`);
    await page.evaluate(() => localStorage.removeItem('xena.skin'));

    await page.close();
  }

  // Export PNG réel (desktop), ouvert ensuite par l'agent avec Read.
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/admin/social', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(700);
  try {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.getByRole('button', { name: /Exporter en PNG|Export as PNG/ }).click(),
    ]);
    const cible = path.join(OUT, 'export-reel.png');
    await download.saveAs(cible);
    rapport.captures.push('export-reel.png');
  } catch (e) {
    rapport.erreurs.push(`export: ${e.message.slice(0, 300)}`);
  }
  await page.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  console.log(JSON.stringify(rapport, null, 2));
})();
