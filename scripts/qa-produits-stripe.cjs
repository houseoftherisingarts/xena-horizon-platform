// Boucle verdict du module « produits reliés à Stripe » (bâtisseur H, 8 septembre 2026) : le bloc
// « Paiement » du formulaire d'offre (Admin › Offres) et les trois chemins de bouton sur la carte
// publique /services (S'inscrire, Acheter, Sur demande), en palette ciel et en mode nuit, 1440 et 390.
// Usage : node scripts/qa-produits-stripe.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://127.0.0.1:4192';
const OUT = process.argv[3] || 'captures-produits';
fs.mkdirSync(OUT, { recursive: true });

const rapport = { erreurs: [], pages: [] };

async function mesurer(page, nom, taille) {
  const m = await page.evaluate(() => {
    const visible = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    const tous = [...document.querySelectorAll('body *')];
    const italiques = tous.filter((e) => getComputedStyle(e).fontStyle === 'italic' && e.innerText && e.innerText.trim() && visible(e)).length;
    const petits = tous.filter((e) => {
      if (!visible(e) || e.children.length > 0) return false;
      const txt = (e.innerText || '').trim();
      if (!txt) return false;
      return parseFloat(getComputedStyle(e).fontSize) < 13;
    }).map((e) => `${parseFloat(getComputedStyle(e).fontSize)}px « ${(e.innerText || '').trim().slice(0, 40)} »`).slice(0, 8);
    const tirets = (document.body.innerText.match(/—/g) || []).length;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      italiques,
      petits,
      tirets,
    };
  });
  rapport.pages.push({ nom, taille, ...m });
  return m;
}

async function ouvrir(browser, largeur, nuit) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 }, reducedMotion: 'no-preference' });
  if (nuit) await ctx.addInitScript(() => { try { localStorage.setItem('xena.nuit', '1'); } catch (e) {} });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') rapport.erreurs.push(`${largeur}${nuit ? ' nuit' : ''}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => rapport.erreurs.push(`${largeur} PAGEERROR: ${e.message.slice(0, 200)}`));
  return { ctx, page };
}

(async () => {
  const browser = await chromium.launch();

  // 1. Le bloc « Paiement » du formulaire d'offre (Admin › Offres, nouvelle offre), 1440/390, ciel/nuit.
  for (const largeur of [1440, 390]) {
    for (const nuit of [false, true]) {
      const { ctx, page } = await ouvrir(browser, largeur, nuit);
      const suffixe = nuit ? '-nuit' : '';
      await page.goto(BASE + '/admin/offres', { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(2000);
      const nouvelle = page.locator('button').filter({ hasText: /Nouvelle Offre|New Offer/ }).first();
      if (await nouvelle.count()) {
        await nouvelle.click();
        await page.waitForTimeout(700);
        await mesurer(page, `admin-formulaire${suffixe}`, largeur);
        await page.screenshot({ path: path.join(OUT, `admin-formulaire-sur-demande${suffixe}-${largeur}.png`), fullPage: true });
        // Bascule sur « Paiement en ligne » : prix, pastille d'état, lien de paiement.
        const stripeBtn = page.locator('button').filter({ hasText: /Paiement en ligne|Online payment/ }).first();
        if (await stripeBtn.count()) {
          await stripeBtn.click();
          await page.waitForTimeout(500);
          await mesurer(page, `admin-formulaire-stripe${suffixe}`, largeur);
          await page.screenshot({ path: path.join(OUT, `admin-formulaire-stripe${suffixe}-${largeur}.png`), fullPage: true });
        } else rapport.erreurs.push(`${largeur}${suffixe}: bouton « Paiement en ligne » introuvable`);
      } else rapport.erreurs.push(`${largeur}${suffixe}: bouton « Nouvelle Offre » introuvable`);
      await ctx.close();
    }
  }

  // 2. La carte publique /services : trois chemins de bouton (S'inscrire, Acheter, Sur demande),
  //    catalogue d'exemple sous MODE=verif (DEMO_PAIEMENT dans pages/PublicServices.tsx).
  for (const largeur of [1440, 390]) {
    for (const nuit of [false, true]) {
      const { ctx, page } = await ouvrir(browser, largeur, nuit);
      const suffixe = nuit ? '-nuit' : '';
      await page.goto(BASE + '/services?demo=paiement', { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(2500);
      const offresEl = page.locator('#offres');
      await offresEl.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(1000);
      await mesurer(page, `services-offres${suffixe}`, largeur);
      await page.screenshot({ path: path.join(OUT, `services-offres${suffixe}-${largeur}.png`), fullPage: true });
      const boutons = await page.locator('#offres button').allInnerTexts();
      rapport[`boutons-${largeur}${suffixe}`] = boutons.map((b) => b.trim()).filter(Boolean);
      await ctx.close();
    }
  }

  // 3. Retour de paiement (?paiement=ok) : le message de remerciement dans le hero.
  {
    const { ctx, page } = await ouvrir(browser, 1440, false);
    await page.goto(BASE + '/services?paiement=ok', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    await mesurer(page, 'services-merci', 1440);
    await page.screenshot({ path: path.join(OUT, 'services-merci-1440.png') });
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  const fautes = rapport.pages.filter((p) => p.scrollWidth > p.clientWidth + 1 || p.italiques > 0 || p.tirets > 0 || (p.petits && p.petits.length));
  console.log(`Pages mesurées : ${rapport.pages.length}. Fautes mesurées : ${fautes.length}. Erreurs console : ${rapport.erreurs.length}.`);
  for (const f of fautes) console.log(`  ✗ ${f.nom} ${f.taille} : débordement ${f.scrollWidth - f.clientWidth}, italiques ${f.italiques}, tirets ${f.tirets}, petits ${JSON.stringify(f.petits)}`);
  for (const e of rapport.erreurs.slice(0, 12)) console.log(`  ! ${e}`);
})();
