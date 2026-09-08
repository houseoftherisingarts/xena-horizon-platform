// Vérification de la vague du 8 septembre soir : bannière sombre et nom lisible, balado en page, porte admin.
// Usage : node scripts/qa-v5.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:4173'; const OUT = process.argv[3] || 'captures-v5';
const SCRATCH = '/private/tmp/claude-501/-Users-lesalondesinconnus/58bd1e1f-7152-450f-95f0-4b5111d59e86/scratchpad/';
fs.mkdirSync(OUT, { recursive: true });
const comptes = fs.readFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', 'utf8').trim().split('\n');
const [clientEmail, clientPw] = comptes[0].split(' / ').map((s) => s.trim());
const [adminEmail, adminPw] = comptes[1].split(' / ').map((s) => s.trim());
const erreurs = []; const r = {};
async function ouvrir(browser, largeur) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/meet\.jit\.si|baladoquebec|podtrac/.test(m.text())) erreurs.push(`${largeur}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => erreurs.push(`${largeur} PAGEERROR: ${e.message.slice(0, 200)}`));
  return { ctx, page };
}
async function connecter(page, email, pw) {
  await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1200);
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(pw);
  await page.locator('form button[type="submit"]').first().click();
  await page.locator('input[type="password"]').first().waitFor({ state: 'detached', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1800);
}
const shot = (page, nom, largeur) => page.screenshot({ path: path.join(OUT, `${nom}-${largeur}.png`) });
(async () => {
  const browser = await chromium.launch();
  // 1. Profil : bannière sombre, le nom reste lisible (il est sous la bannière, seul l'avatar déborde).
  for (const largeur of [1440, 390]) {
    const c = await ouvrir(browser, largeur); await connecter(c.page, clientEmail, clientPw);
    await c.page.waitForTimeout(1500); await shot(c.page, 'profil-haut', largeur);
    if (largeur === 1440) {
      await c.page.setInputFiles('input[aria-label="Bannière"]', SCRATCH + 'banniere-sombre.jpg'); await c.page.waitForTimeout(6000);
      const enregistrer = c.page.locator('button').filter({ hasText: /^Enregistrer$|^Save$/ }).first();
      if (await enregistrer.count()) { await enregistrer.click(); await c.page.waitForTimeout(3000); }
      await c.page.reload({ waitUntil: 'load' }); await c.page.waitForTimeout(3000);
    }
    await c.page.evaluate(() => window.scrollTo(0, 0)); await c.page.waitForTimeout(400);
    await shot(c.page, 'profil-banniere-sombre', largeur);
    const nom = c.page.locator('h1, h2').filter({ hasText: /Témoin|temoin|@/ }).first();
    if (await nom.count()) {
      r['nom' + largeur] = await nom.evaluate((el) => {
        const cs = getComputedStyle(el); let p = el.parentElement; let bg = 'rgba(0, 0, 0, 0)';
        while (p && /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { bg = getComputedStyle(p).backgroundColor; p = p.parentElement; }
        const b = el.getBoundingClientRect(); return { couleur: cs.color, fond: bg, y: Math.round(b.top), h: Math.round(b.height) };
      });
      const banniere = c.page.locator('img[alt=""]').first();
      if (await banniere.count()) { const bb = await banniere.boundingBox(); r['banniereBas' + largeur] = bb ? Math.round(bb.y + bb.height) : null; }
    }
    await c.ctx.close();
  }
  // 2. Balado : le lecteur est dans la page et joue.
  for (const largeur of [1440, 390]) {
    const c = await ouvrir(browser, largeur);
    await c.page.goto(BASE + '/projets', { waitUntil: 'load', timeout: 60000 }); await c.page.waitForTimeout(2000);
    const sec = c.page.locator('section').filter({ hasText: /Les épisodes|Episodes/ }).first();
    r['baladoSection' + largeur] = await sec.count();
    if (await sec.count()) {
      await sec.scrollIntoViewIfNeeded(); await c.page.waitForTimeout(600);
      const lire = sec.locator('button[aria-label]').first();
      r['baladoBouton' + largeur] = await lire.getAttribute('aria-label');
      await lire.click(); await c.page.waitForTimeout(4000);
      r['baladoJoue' + largeur] = await c.page.evaluate(() => { const a = document.querySelector('audio'); return a ? { paused: a.paused, t: Math.round(a.currentTime * 10) / 10, src: (a.currentSrc || '').slice(0, 60) } : null; });
      await shot(c.page, 'balado-lecteur', largeur);
    }
    await c.ctx.close();
  }
  // 3. Porte admin : la personne cliente est refusée; le compte admin témoin entre.
  let c = await ouvrir(browser, 1440); await connecter(c.page, clientEmail, clientPw);
  await c.page.goto(BASE + '/admin', { waitUntil: 'load', timeout: 60000 }); await c.page.waitForTimeout(3000);
  r.adminRefuseUrl = c.page.url().replace(BASE, '');
  r.adminRefuseModal = await c.page.locator('text=/Espace admin|Admin area/').count();
  r.adminRefuseGoogle = await c.page.locator('button').filter({ hasText: /Google/ }).count();
  r.adminRefuseSidebar = await c.page.locator('aside, nav').filter({ hasText: /Agenda|Dossiers/ }).count();
  await shot(c.page, 'admin-refuse', 1440); await c.ctx.close();
  c = await ouvrir(browser, 1440); await connecter(c.page, adminEmail, adminPw);
  await c.page.goto(BASE + '/admin', { waitUntil: 'load', timeout: 60000 }); await c.page.waitForTimeout(3500);
  r.adminOkSidebar = await c.page.locator('aside, nav').filter({ hasText: /Agenda|Dossiers/ }).count();
  await shot(c.page, 'admin-ok', 1440); await c.ctx.close();
  await browser.close();
  console.log(JSON.stringify({ ...r, erreurs: erreurs.slice(0, 6) }));
})();
