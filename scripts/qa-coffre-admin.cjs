// Boucle de vérification visuelle du coffre « Pour Vexel » (bâtisseur E) et de la barre d'admin repliable.
// Capture Admin › Pour Vexel (encadré chiffrement, tableau des coûts, section « Pour te payer », état déjà
// déposé) et la barre latérale ouverte puis repliée, dans les deux palettes et le mode nuit, à 1440 et 390.
// Usage : node scripts/qa-coffre-admin.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');

const BASE = process.argv[2] || 'http://127.0.0.1:4190';
const OUT = process.argv[3] || 'captures-verif/xena2-E-coffre-admin';
fs.mkdirSync(OUT, { recursive: true });

const TAILLES = [
  { nom: '1440', width: 1440, height: 900 },
  { nom: '390', width: 390, height: 844 },
];

const COMBOS = [
  { suffixe: 'ciel', skin: 'ciel', nuit: false },
  { suffixe: 'encre', skin: 'encre', nuit: false },
  { suffixe: 'nuit', skin: 'ciel', nuit: true },
];

async function poserPalette(page, skin, nuit) {
  await page.evaluate(({ skin, nuit }) => {
    try {
      if (skin === 'encre') localStorage.setItem('xena.skin', 'encre'); else localStorage.removeItem('xena.skin');
      if (nuit) localStorage.setItem('xena.nuit', '1'); else localStorage.removeItem('xena.nuit');
    } catch (e) {}
  }, { skin, nuit });
}

async function capturerVexel(browser) {
  for (const { nom, width, height } of TAILLES) {
    for (const { suffixe, skin, nuit } of COMBOS) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(`${BASE}/admin/vexel`, { waitUntil: 'load', timeout: 60000 });
      await poserPalette(page, skin, nuit);
      await page.reload({ waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(900);
      // Haut de page : encadré « à quoi ça sert, qui peut voir quoi » + tableau des coûts.
      await page.screenshot({ path: `${OUT}/vexel-haut-${suffixe}-${nom}.png` });
      // Le reste de la page : état « déjà déposé » (exemple verif) et section « Pour te payer ».
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/vexel-bas-${suffixe}-${nom}.png` });
      await page.close();
    }
  }
}

async function capturerFormulaireRemplacer(browser) {
  // Force le formulaire (bouton « Remplacer ») pour capturer la section bancaire et le dépôt de spécimen.
  for (const { nom, width, height } of TAILLES) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${BASE}/admin/vexel`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(900);
    const boutonRemplacer = page.getByRole('button', { name: /remplacer|replace/i });
    if (await boutonRemplacer.count()) {
      await boutonRemplacer.first().click();
      await page.waitForTimeout(300);
      await page.evaluate(() => {
        const label = [...document.querySelectorAll('label')].find((l) => /Spécimen de chèque|Void cheque/.test(l.textContent || ''));
        label?.scrollIntoView({ block: 'center' });
      });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/vexel-formulaire-banque-${nom}.png` });
    }
    await page.close();
  }
}

async function capturerMenu(browser) {
  for (const { nom, width, height } of TAILLES) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${BASE}/admin/vexel`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/menu-ouvert-${nom}.png` });

    if (width >= 768) {
      // Desktop seulement : la flèche de repli vit en bas de la barre (bouton « Replier le menu »).
      const boutonReplier = page.getByRole('button', { name: /replier le menu|collapse menu/i });
      if (await boutonReplier.count()) {
        await boutonReplier.first().click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}/menu-replie-${nom}.png` });
        // Survol d'une icône pour vérifier l'info-bulle.
        const icone = page.locator('aside nav button').nth(2);
        await icone.hover();
        await page.waitForTimeout(250);
        await page.screenshot({ path: `${OUT}/menu-replie-infobulle-${nom}.png` });
      }
    } else {
      // Mobile : la barre reste le tiroir plein, ouvert par le bouton hamburger du haut.
      const boutonMenu = page.getByRole('button', { name: /ouvrir le menu|open menu/i });
      if (await boutonMenu.count()) {
        await boutonMenu.first().click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}/menu-mobile-tiroir-${nom}.png` });
      }
    }
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  await capturerVexel(browser);
  await capturerFormulaireRemplacer(browser);
  await capturerMenu(browser);
  await browser.close();
  console.log('Captures écrites dans', OUT);
})();
