// Captures des composants portés de 21st.dev : mots tournants, texte gluant, interrupteurs, cartes, FAQ.
// Usage : node scripts/qa-21st.cjs <baseUrl> <dossier>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:4173'; const OUT = process.argv[3] || 'captures-21st';
fs.mkdirSync(OUT, { recursive: true }); const erreurs = []; const r = {};
(async () => {
  const b = await chromium.launch();
  for (const largeur of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 } }); const p = await ctx.newPage();
    p.on('pageerror', (e) => erreurs.push(`${largeur} ${e.message.slice(0, 140)}`));
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|googletagmanager/.test(m.text())) erreurs.push(`${largeur} ${m.text().slice(0, 140)}`); });
    await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(4200);
    await p.evaluate(() => { try { localStorage.setItem('xena.consentement', JSON.stringify({ valeur: 'refuse', date: new Date().toISOString() })); } catch {} });
    await p.screenshot({ path: path.join(OUT, `v2-hero-a-${largeur}.png`) }); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(OUT, `v2-hero-b-${largeur}.png`) });
    // Colophon des clients (texte gluant)
    const clients = p.locator('[data-tx-scope="accueilCitation"]').last();
    if (await clients.count()) {
      await clients.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
      await p.screenshot({ path: path.join(OUT, `v2-clients-a-${largeur}.png`) }); await p.waitForTimeout(1000);
      await p.screenshot({ path: path.join(OUT, `v2-clients-b-${largeur}.png`) });
      r[`clientsTexte${largeur}`] = await clients.innerText().then((t) => t.slice(0, 80));
    }
    // Interrupteurs
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
    if (largeur === 1440) {
      const nav = p.locator('nav').first();
      await nav.screenshot({ path: path.join(OUT, `v2-nav-ciel-fr-${largeur}.png`) });
      await p.locator('[role="switch"][aria-label*="alette"]').first().click(); await p.waitForTimeout(600);
      await p.locator('[role="switch"][aria-label*="angue"], [role="switch"][aria-label*="anguage"]').first().click(); await p.waitForTimeout(800);
      await nav.screenshot({ path: path.join(OUT, `v2-nav-encre-en-${largeur}.png`) });
      await p.screenshot({ path: path.join(OUT, `v2-hero-encre-en-${largeur}.png`) });
      r.langueApres = await p.locator('[role="switch"]').nth(1).getAttribute('aria-label');
      // retour
      await p.locator('[role="switch"]').first().click(); await p.locator('[role="switch"]').nth(1).click(); await p.waitForTimeout(500);
    } else {
      await p.locator('nav button[aria-label], nav button').filter({ has: p.locator('svg') }).last().click().catch(() => {});
      await p.waitForTimeout(900); await p.screenshot({ path: path.join(OUT, `v2-tiroir-${largeur}.png`) });
      r.tiroirSwitches = await p.locator('[role="switch"]').count();
    }
    // Services : cartes + FAQ
    await p.goto(BASE + '/services', { waitUntil: 'load' }); await p.waitForTimeout(1500);
    const carte = p.locator('[data-tx-scope="faq"]').first();
    const offres = p.locator('h3').filter({ hasText: /Abonnement mensuel|Monthly subscription/ }).first();
    if (await offres.count()) { await offres.scrollIntoViewIfNeeded(); await p.waitForTimeout(700); const bb = await offres.boundingBox(); if (bb && largeur === 1440) { await p.mouse.move(bb.x + 200, bb.y + 20); await p.waitForTimeout(400); } await p.screenshot({ path: path.join(OUT, `v2-cartes-${largeur}.png`) }); }
    if (await carte.count()) {
      await carte.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
      await p.screenshot({ path: path.join(OUT, `v2-faq-1-${largeur}.png`) });
      const boutons = carte.locator('button[aria-expanded]'); r[`faqQuestions${largeur}`] = await boutons.count();
      await boutons.nth(2).click(); await p.waitForTimeout(700);
      r[`faqOuvertes${largeur}`] = await carte.locator('button[aria-expanded="true"]').count();
      await p.screenshot({ path: path.join(OUT, `v2-faq-2-${largeur}.png`) });
    }
    await ctx.close();
  }
  await b.close(); console.log(JSON.stringify({ ...r, erreurs: erreurs.slice(0, 6) }));
})();
