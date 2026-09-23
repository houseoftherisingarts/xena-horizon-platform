// Captures de la salle de presse, pour la boucle de vérification visuelle.
//   node scripts/qa-presse.cjs http://localhost:4173 captures-presse
// Sert à regarder la page en 1440 et en 390 aux hauteurs utiles, et à vérifier qu'une carte
// téléchargée sort bien à 1920 × 1080. Aucune erreur de page n'est tolérée.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const base = process.argv[2] || 'http://localhost:4173';
const sortie = path.join(process.cwd(), process.argv[3] || 'captures-presse');
fs.mkdirSync(sortie, { recursive: true });

const VUES = [
  { nom: '1440', width: 1440, height: 900, scrolls: [0, 800, 1700, 2600, 3500, 4400, 5300] },
  { nom: '390', width: 390, height: 844, scrolls: [0, 700, 1500, 2400, 3300, 4300, 5300, 6300] },
];

(async () => {
  const navigateur = await chromium.launch();
  const fautes = [];
  for (const vue of VUES) {
    const ctx = await navigateur.newContext({ viewport: { width: vue.width, height: vue.height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => fautes.push(`${vue.nom} : ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && fautes.push(`${vue.nom} console : ${m.text()}`));
    await page.goto(`${base}/presse`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    for (const [i, y] of vue.scrolls.entries()) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(sortie, `presse-${vue.nom}-${String(i).padStart(2, '0')}.jpg`), quality: 82, type: 'jpeg' });
    }
    await ctx.close();
  }

  // Le vrai bout de la chaîne : une carte téléchargée doit faire exactement 1920 × 1080.
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fautes.push(`téléchargement : ${e.message}`));
  await page.goto(`${base}/presse`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const attente = page.waitForEvent('download', { timeout: 60000 });
  await page.getByRole('button', { name: /Télécharger/ }).first().click();
  const dl = await attente;
  const fichier = path.join(sortie, dl.suggestedFilename());
  await dl.saveAs(fichier);
  const dim = await page.evaluate(
    (src) =>
      new Promise((r) => {
        const im = new Image();
        im.onload = () => r(`${im.naturalWidth} × ${im.naturalHeight}`);
        im.src = src;
      }),
    `data:image/jpeg;base64,${fs.readFileSync(fichier).toString('base64')}`
  );
  console.log(`carte téléchargée : ${dl.suggestedFilename()}, ${Math.round(fs.statSync(fichier).size / 1024)} Ko, ${dim}`);
  await ctx.close();
  await navigateur.close();

  console.log(fautes.length ? `ERREURS :\n${[...new Set(fautes)].join('\n')}` : 'aucune erreur de page');
})();
