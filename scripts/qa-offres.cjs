// Boucle verdict de l'échelle de valeur (Admin > Offres, refonte du 8 septembre 2026) : trois vues,
// zoom, redimensionnement des colonnes, palette ciel et mode nuit, onglets mobiles.
// Usage : node scripts/qa-offres.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://127.0.0.1:4190';
const OUT = process.argv[3] || 'captures-offres';
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
  try {
    // --- Desktop 1440 ---
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('console', (m) => { if (m.type() === 'error') rapport.erreurs.push(`1440 console: ${m.text().slice(0, 200)}`); });
    page.on('pageerror', (e) => rapport.erreurs.push(`1440 pageerror: ${e.message.slice(0, 200)}`));

    await page.goto(BASE + '/admin/offres', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(700);
    await shot(page, '01-desktop-ajustee-ciel');

    // Vue Défilement
    await page.getByRole('tab', { name: /^(Défilement|Scroll)$/ }).click();
    await page.waitForTimeout(400);
    await shot(page, '02-desktop-defilement-ciel');

    // Défiler jusqu'à Elite
    const boutonDroite = page.getByRole('button', { name: /paliers suivants|later tiers/i });
    for (let i = 0; i < 4; i++) {
      await boutonDroite.click().catch(() => {});
      await page.waitForTimeout(250);
    }
    await shot(page, '03-desktop-defilement-scrolle-elite-ciel');

    // Zoom 60 %
    await page.locator('#offres-zoom').fill('0.6');
    await page.waitForTimeout(300);
    await shot(page, '04-desktop-defilement-zoom60-ciel');

    // Tout voir
    await page.getByRole('button', { name: /Tout voir|See all/ }).click();
    await page.waitForTimeout(400);
    await shot(page, '05-desktop-defilement-toutvoir-ciel');

    // Redimensionnement d'une colonne (poignée entre la 1re et la 2e)
    const poignee = page.locator('[role="separator"]').first();
    const boite = await poignee.boundingBox();
    if (boite) {
      await page.mouse.move(boite.x + boite.width / 2, boite.y + boite.height / 2);
      await page.mouse.down();
      await page.mouse.move(boite.x + boite.width / 2 - 60, boite.y + boite.height / 2, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(300);
    } else {
      rapport.erreurs.push('poignée de redimensionnement introuvable');
    }
    await shot(page, '06-desktop-defilement-redimensionne-ciel');

    // Vue Compacte
    await page.getByRole('tab', { name: /^(Compacte|Compact)$/ }).click();
    await page.waitForTimeout(400);
    await shot(page, '07-desktop-compacte-ciel');

    // Vue Ajustée + mode nuit
    await page.getByRole('tab', { name: /^(Ajustée|Fitted)$/ }).click();
    await page.evaluate(() => localStorage.setItem('xena.nuit', '1'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(600);
    await shot(page, '08-desktop-ajustee-nuit');
    await page.evaluate(() => localStorage.removeItem('xena.nuit'));
    await page.close();

    // --- Mobile 390 ---
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    mobile.on('console', (m) => { if (m.type() === 'error') rapport.erreurs.push(`390 console: ${m.text().slice(0, 200)}`); });
    mobile.on('pageerror', (e) => rapport.erreurs.push(`390 pageerror: ${e.message.slice(0, 200)}`));

    await mobile.goto(BASE + '/admin/offres', { waitUntil: 'load', timeout: 60000 });
    await mobile.waitForTimeout(700);
    await shot(mobile, '09-mobile-onglet-freemium-ciel');

    await mobile.getByRole('button', { name: /^Elite/ }).click();
    await mobile.waitForTimeout(300);
    await shot(mobile, '10-mobile-onglet-elite-ciel');

    await mobile.evaluate(() => localStorage.setItem('xena.nuit', '1'));
    await mobile.reload({ waitUntil: 'load' });
    await mobile.waitForTimeout(600);
    await shot(mobile, '11-mobile-onglet-freemium-nuit');
    await mobile.evaluate(() => localStorage.removeItem('xena.nuit'));
    await mobile.close();
  } catch (e) {
    rapport.erreurs.push(`global: ${e.message.slice(0, 300)}`);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  console.log(JSON.stringify(rapport, null, 2));
})();
