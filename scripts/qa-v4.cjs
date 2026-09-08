// Vérification des deux modules du 8 septembre soir : « Pour Vexel » (coffre chiffré) et « Témoignages audio ».
// Usage : node scripts/qa-v4.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:4173'; const OUT = process.argv[3] || 'captures-v4';
const SCRATCH = '/private/tmp/claude-501/-Users-lesalondesinconnus/58bd1e1f-7152-450f-95f0-4b5111d59e86/scratchpad/';
fs.mkdirSync(OUT, { recursive: true });
const comptes = fs.readFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', 'utf8').trim().split('\n');
const [adminEmail, adminPw] = comptes[1].split(' / ').map((s) => s.trim());
const erreurs = []; const r = {};
async function ouvrir(browser, largeur) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 } }); const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(`${largeur}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => erreurs.push(`${largeur} PAGEERROR: ${e.message.slice(0, 200)}`));
  return { ctx, page };
}
async function connecter(page) {
  await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1200);
  await page.locator('input[type="email"]').first().fill(adminEmail); await page.locator('input[type="password"]').first().fill(adminPw);
  await page.locator('form button[type="submit"]').first().click(); await page.waitForTimeout(3000);
}
const shot = (page, nom, largeur) => page.screenshot({ path: path.join(OUT, `${nom}-${largeur}.png`) });
(async () => {
  const browser = await chromium.launch();
  // 1. Pour Vexel : formulaire, dépôt chiffré, résumé.
  let a = await ouvrir(browser, 1440); await connecter(a.page);
  await a.page.goto(BASE + '/admin/vexel', { waitUntil: 'load', timeout: 60000 }); await a.page.waitForTimeout(2500);
  await shot(a.page, 'vexel-haut', 1440);
  await a.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await a.page.waitForTimeout(600);
  await shot(a.page, 'vexel-formulaire', 1440);
  try {
    const f = (label) => a.page.locator('label').filter({ hasText: label }).first().locator('xpath=following-sibling::input | following-sibling::textarea').first();
    await a.page.getByLabel(/Nom sur la carte/).fill('Témoin Vérification');
    await a.page.getByLabel(/Numéro de carte/).fill('4242424242424242');
    await a.page.getByLabel(/Expiration/).fill('04/28');
    await a.page.getByLabel(/Code de sécurité/).fill('123');
    await a.page.getByLabel(/^Adresse$/).fill('1 rue du Test');
    await a.page.getByLabel(/^Ville$/).fill('Montréal');
    await a.page.getByLabel(/Code postal/).fill('H1H 1H1');
    await a.page.getByLabel(/Notes pour Alex/).fill('Vérification du coffre.');
    await a.page.locator('input[type="checkbox"]').first().check();
    await a.page.locator('button[type="submit"]').filter({ hasText: /Sceller/ }).click();
    await a.page.waitForTimeout(3500);
    const texte = await a.page.locator('main').innerText();
    r.coffreDepose = /se terminant par 4242/.test(texte);
    await a.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await a.page.waitForTimeout(500);
    await shot(a.page, 'vexel-depose', 1440);
  } catch (e) { erreurs.push('coffre: ' + e.message.slice(0, 200)); }
  await a.page.setViewportSize({ width: 390, height: 844 }); await a.page.goto(BASE + '/admin/vexel', { waitUntil: 'load' }); await a.page.waitForTimeout(2000); await shot(a.page, 'vexel-haut', 390);
  await a.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.45)); await a.page.waitForTimeout(500); await shot(a.page, 'vexel-couts', 390);
  r.vexelDebord390 = await a.page.evaluate(() => [...document.querySelectorAll('main *')].some((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right > window.innerWidth + 1 && !el.closest('.overflow-x-auto'); }));
  // 2. Témoignages audio : ajout, publication, section publique, retrait.
  await a.page.setViewportSize({ width: 1440, height: 900 });
  await a.page.goto(BASE + '/admin/temoignages', { waitUntil: 'load' }); await a.page.waitForTimeout(2500);
  await shot(a.page, 'temoignages-vide', 1440);
  try {
    await a.page.getByLabel(/^Nom/).first().fill('Témoin A.');
    const role = a.page.getByLabel(/Rôle|Role/).first(); if (await role.count()) await role.fill('Autrice');
    const extrait = a.page.locator('textarea').first(); await extrait.fill('Un extrait de vérification pour le lecteur audio.');
    await a.page.locator('input[type="file"]').first().setInputFiles(SCRATCH + 'temoin.wav');
    await a.page.waitForTimeout(1500);
    const pub = a.page.locator('input[type="checkbox"]').first(); if (await pub.count() && !(await pub.isChecked())) await pub.check();
    await a.page.locator('button').filter({ hasText: /Enregistrer|Save/ }).first().click();
    await a.page.waitForTimeout(6000);
    const texte = await a.page.locator('main').innerText();
    r.temoignageAjoute = /Témoin A\./.test(texte);
    await shot(a.page, 'temoignages-liste', 1440);
  } catch (e) { erreurs.push('temoignage: ' + e.message.slice(0, 200)); }
  await a.ctx.close();
  // Section publique
  for (const largeur of [1440, 390]) {
    const p = await ouvrir(browser, largeur);
    await p.page.goto(BASE + '/', { waitUntil: 'load' }); await p.page.waitForTimeout(3500);
    const sec = p.page.locator('[data-tx-scope="accueilTemoignagesAudio"]').first();
    if (await sec.count()) {
      await sec.scrollIntoViewIfNeeded(); await p.page.waitForTimeout(1200); await shot(p.page, 'accueil-audio', largeur);
      if (largeur === 1440) {
        const play = sec.locator('button').first(); await play.click(); await p.page.waitForTimeout(1200); await shot(p.page, 'accueil-audio-joue', largeur);
        r.lectureTexte = await sec.innerText().then((s) => s.slice(0, 120));
      }
    } else r['sectionAbsente' + largeur] = true;
    r['debord' + largeur] = await p.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await p.ctx.close();
  }
  // Retrait du témoignage de test
  a = await ouvrir(browser, 1440); await connecter(a.page);
  await a.page.goto(BASE + '/admin/temoignages', { waitUntil: 'load' }); await a.page.waitForTimeout(2500);
  try {
    await a.page.locator('button').filter({ hasText: /Supprimer|Delete/ }).first().click(); await a.page.waitForTimeout(500);
    await a.page.locator('button').filter({ hasText: /Oui|Confirmer|Yes/ }).first().click(); await a.page.waitForTimeout(3000);
    r.temoignageRetire = !/Témoin A\./.test(await a.page.locator('main').innerText());
  } catch (e) { erreurs.push('retrait: ' + e.message.slice(0, 200)); }
  await a.ctx.close();
  await browser.close();
  console.log(JSON.stringify({ ...r, erreurs: erreurs.slice(0, 6) }, null, 1));
})();
