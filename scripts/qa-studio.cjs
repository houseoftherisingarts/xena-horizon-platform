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
  await page.screenshot({ path: p });
  rapport.captures.push(nom);
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

    // Chaque gabarit : cliquer « Utiliser » (mobile : passer par l'onglet Gabarits d'abord).
    if (largeur === 390) {
      const ongletGabarits = page.getByRole('button', { name: /Gabarits|Templates/ }).first();
      if (await ongletGabarits.count()) await ongletGabarits.click();
      await page.waitForTimeout(300);
    }
    const boutonsGabarit = page.locator('button:has-text("Utiliser"), button:has-text("Use")');
    // Les vignettes montrent « Utiliser » seulement au survol (opacity-0 group-hover) : on clique le bouton parent directement.
    const cartes = page.locator('section:has-text("Gabarits") button, section:has-text("Templates") button').filter({ has: page.locator('canvas, div') });
    const nbGabarits = await page.locator('section >> text=/Gabarits|Templates/').count();

    const idsGabarits = ['citation', 'rendezvous', 'balado', 'temoignage', 'conseil', 'carrousel'];
    for (let i = 0; i < idsGabarits.length; i++) {
      const carte = page.locator('button').filter({ hasText: '' }).nth(0); // fallback si le sélecteur précis échoue
      try {
        const boutons = await page.locator('div.grid.grid-cols-2 > button').all();
        if (boutons[i]) {
          await boutons[i].click();
          if (largeur === 390) {
            const ongletToile = page.getByRole('button', { name: /Toile|Canvas/ }).first();
            if (await ongletToile.count()) await ongletToile.click();
          }
          await page.waitForTimeout(500);
          await shot(page, `studio-gabarit-${idsGabarits[i]}-${largeur}`);
        }
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
