// Parcours du rendez-vous de bout en bout : la personne demande un créneau, Laurie le confirme, la personne
// voit « Confirmé » et son fichier .ics. Usage : node scripts/qa-rdv.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:4173'; const OUT = process.argv[3] || 'captures-v3';
const comptes = fs.readFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', 'utf8').trim().split('\n');
const [clientEmail, clientPw] = comptes[0].split(' / ').map((s) => s.trim());
const [adminEmail, adminPw] = comptes[1].split(' / ').map((s) => s.trim());
const erreurs = [];
async function ouvrir(browser, largeur) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/meet\.jit\.si/.test(m.text())) erreurs.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => erreurs.push('PAGEERROR ' + e.message.slice(0, 200)));
  return { ctx, page };
}
async function connecter(page, email, pw) {
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(pw);
  await page.locator('form button[type="submit"]').first().click();
  await page.locator('input[type="password"]').first().waitFor({ state: 'detached', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1800);
}
const onglet = (page, re) => page.locator('[role="tab"]').filter({ hasText: re }).first();
(async () => {
  const browser = await chromium.launch(); const r = {};
  // 1. La personne demande un créneau
  let c = await ouvrir(browser, 1440);
  await c.page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await c.page.waitForTimeout(1500);
  await connecter(c.page, clientEmail, clientPw);
  await onglet(c.page, /Rendez-vous/).click(); await c.page.waitForTimeout(1200);
  const sec = 'section[data-tx-scope="espaceRendezVous"]';
  const jour = c.page.locator(`${sec} .grid-cols-7 button[class*="bg-rose"]:not([disabled])`).first();
  await jour.scrollIntoViewIfNeeded(); await jour.click(); await c.page.waitForTimeout(600);
  const creneau = c.page.locator(`${sec} button.rounded-pilule.border:not([disabled])`).first();
  r.creneau = await creneau.innerText().catch(() => null);
  await creneau.click(); await c.page.waitForTimeout(500);
  await c.page.locator(`${sec} textarea`).first().fill('Vérification : demande de rendez-vous de bout en bout.');
  await c.page.screenshot({ path: path.join(OUT, 'rdv-1-panneau-1440.png') });
  await c.page.locator(`${sec} button`).filter({ hasText: /Demander ce moment|Request this time/ }).first().click();
  await c.page.waitForTimeout(3000);
  const texte1 = await c.page.locator(sec).innerText();
  r.demande = /attente/i.test(texte1);
  await c.page.locator(sec).scrollIntoViewIfNeeded();
  await c.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await c.page.waitForTimeout(600);
  await c.page.screenshot({ path: path.join(OUT, 'rdv-2-demande-1440.png') });
  await c.ctx.close();
  // 2. Laurie confirme
  let a = await ouvrir(browser, 1440);
  await a.page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await a.page.waitForTimeout(1500);
  await connecter(a.page, adminEmail, adminPw);
  await a.page.goto(BASE + '/admin/agenda', { waitUntil: 'load', timeout: 60000 }); await a.page.waitForTimeout(3000);
  await a.page.screenshot({ path: path.join(OUT, 'rdv-3-admin-a-confirmer-1440.png') });
  const confirmer = a.page.locator('button').filter({ hasText: /^Confirmer$|^Confirm$/ }).first();
  r.boutonConfirmer = await confirmer.count();
  if (r.boutonConfirmer) { await confirmer.click(); await a.page.waitForTimeout(2000); }
  const aVenir = a.page.locator('button').filter({ hasText: /À venir|Upcoming/ }).first();
  if (await aVenir.count()) { await aVenir.click(); await a.page.waitForTimeout(800); }
  await a.page.screenshot({ path: path.join(OUT, 'rdv-4-admin-confirme-1440.png') });
  r.adminConfirme = /Confirm/i.test(await a.page.locator('main').innerText());
  await a.page.setViewportSize({ width: 390, height: 844 }); await a.page.waitForTimeout(600);
  await a.page.screenshot({ path: path.join(OUT, 'rdv-4-admin-confirme-390.png') });
  await a.ctx.close();
  // 3. La personne voit « Confirmé » et son .ics
  c = await ouvrir(browser, 1440);
  await c.page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await c.page.waitForTimeout(1500);
  await connecter(c.page, clientEmail, clientPw);
  await onglet(c.page, /Rendez-vous/).click(); await c.page.waitForTimeout(1500);
  await c.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await c.page.waitForTimeout(600);
  const texte3 = await c.page.locator(sec).innerText();
  r.clientConfirme = /Confirmé|Confirmed/.test(texte3);
  r.ics = await c.page.locator(`${sec} button`).filter({ hasText: /calendrier|calendar/ }).count();
  await c.page.screenshot({ path: path.join(OUT, 'rdv-5-client-confirme-1440.png') });
  await c.ctx.close();
  await browser.close();
  console.log(JSON.stringify({ ...r, erreurs: erreurs.slice(0, 5) }));
})();
