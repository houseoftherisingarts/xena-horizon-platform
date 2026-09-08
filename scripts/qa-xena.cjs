// Boucle verdict Xena Horizon : captures 1440 et 390 de chaque page, connexion des comptes témoins,
// erreurs console, débordement horizontal, nombre de lignes du h1. Usage : node qa-xena.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = process.argv[3] || 'captures';
fs.mkdirSync(OUT, { recursive: true });
const comptes = fs.readFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', 'utf8').trim().split('\n');
const [clientEmail, clientPw] = comptes[0].split(' / ').map((s) => s.trim());
const [adminEmail, adminPw] = comptes[1].split(' / ').map((s) => s.trim());

const VUES = [
  { nom: 'accueil', path: '/', scrolls: [0, 0.25, 0.5, 0.75, 1] },
  { nom: 'services', path: '/services', scrolls: [0, 0.5, 1] },
  { nom: 'projets', path: '/projets', scrolls: [0, 0.5, 1] },
  { nom: 'a-propos', path: '/a-propos', scrolls: [0, 0.5, 1] },
  { nom: 'espace-porte', path: '/espace', scrolls: [0, 0.5, 1] },
];

const rapport = { erreurs: [], pages: [] };

async function mesurer(page, nom, taille) {
  const m = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    let lignesH1 = 0;
    if (h1) {
      const lh = parseFloat(getComputedStyle(h1).lineHeight) || parseFloat(getComputedStyle(h1).fontSize) * 1.2;
      lignesH1 = Math.round(h1.getBoundingClientRect().height / lh);
    }
    const italiques = [...document.querySelectorAll('body *')].filter((e) => {
      const st = getComputedStyle(e);
      return st.fontStyle === 'italic' && e.innerText && e.innerText.trim().length > 0 && e.getClientRects().length > 0;
    }).length;
    const tirets = (document.body.innerText.match(/—/g) || []).length;
    return {
      h1: h1 ? h1.innerText.replace(/\n/g, ' / ') : null,
      lignesH1,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      italiques,
      tirets,
      titre: document.title,
    };
  });
  rapport.pages.push({ nom, taille, ...m });
  return m;
}

async function capturer(page, nom, largeur, scrolls) {
  for (const s of scrolls) {
    await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * f), s);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `${nom}-${largeur}-${Math.round(s * 100)}.png`) });
  }
}

async function ouvrir(browser, largeur) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') rapport.erreurs.push(`${largeur}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => rapport.erreurs.push(`${largeur} PAGEERROR: ${e.message.slice(0, 200)}`));
  return { ctx, page };
}

async function connecter(page, email, pw) {
  // La porte : champ courriel, champ mot de passe, bouton de connexion.
  const mail = page.locator('input[type="email"]').first();
  await mail.waitFor({ timeout: 15000 });
  await mail.fill(email);
  await page.locator('input[type="password"]').first().fill(pw);
  const bouton = page.locator('form button[type="submit"]').first();
  await bouton.click();
  // On attend que la session soit vraiment ouverte (bandeau de l'espace ou message d'erreur), pas un délai fixe.
  await page.locator('input[type="password"]').first().waitFor({ state: 'detached', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1500);
}

(async () => {
  const browser = await chromium.launch();
  for (const largeur of [1440, 390]) {
    const { ctx, page } = await ouvrir(browser, largeur);
    for (const v of VUES) {
      await page.goto(BASE + v.path, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(2500);
      await mesurer(page, v.nom, largeur);
      await capturer(page, v.nom, largeur, v.scrolls);
    }
    // Pages publiques en anglais : bascule FR/EN puis mêmes captures
    for (const v of VUES.slice(0, 4)) {
      await page.goto(BASE + v.path, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(1500);
      const bascule = page.locator('button').filter({ hasText: /^\s*FR\s*\/\s*EN\s*$/ }).first();
      if (await bascule.count()) { await bascule.click(); await page.waitForTimeout(800); }
      await mesurer(page, `${v.nom}-en`, largeur);
      await capturer(page, `${v.nom}-en`, largeur, [0, 0.5, 1]);
    }

    // Espace client connecté
    await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    try {
      await connecter(page, clientEmail, clientPw);
      await mesurer(page, 'espace-connecte', largeur);
      await capturer(page, 'espace-connecte', largeur, [0, 0.5, 1]);
      // onglets de l'espace, si présents
      // Seulement les onglets de l'espace (jamais les boutons de la barre de navigation, ni la bascule FR/EN).
      const onglets = page.locator('[role="tab"]');
      const n = Math.min(await onglets.count(), 6);
      for (let i = 0; i < n; i++) {
        const t = onglets.nth(i);
        const label = ((await t.innerText()) || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
        await t.click().catch(() => {});
        await page.waitForTimeout(900);
        await page.screenshot({ path: path.join(OUT, `espace-${label || i}-${largeur}.png`) });
      }
    } catch (e) {
      rapport.erreurs.push(`${largeur} connexion client: ${e.message.slice(0, 200)}`);
    }
    await ctx.close();

    // Back-office : admin témoin
    const adm = await ouvrir(browser, largeur);
    await adm.page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 });
    await adm.page.waitForTimeout(2000);
    try {
      await connecter(adm.page, adminEmail, adminPw);
      await adm.page.goto(BASE + '/admin/dossiers', { waitUntil: 'load', timeout: 60000 });
      await adm.page.waitForTimeout(3000);
      await mesurer(adm.page, 'admin-dossiers', largeur);
      await capturer(adm.page, 'admin-dossiers', largeur, [0, 1]);
      const fiche = adm.page.locator('table tr, [data-dossier], .dossier').first();
      if (await fiche.count()) {
        await fiche.click().catch(() => {});
        await adm.page.waitForTimeout(1500);
        await capturer(adm.page, 'admin-fiche', largeur, [0, 0.5, 1]);
      }
    } catch (e) {
      rapport.erreurs.push(`${largeur} admin: ${e.message.slice(0, 200)}`);
    }
    await adm.ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  console.log(JSON.stringify(rapport, null, 1));
})();
