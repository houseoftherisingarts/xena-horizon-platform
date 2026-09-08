// Boucle verdict Xena Horizon, tour v3 (8 septembre 2026, soir) : palette ciel par défaut, « Prendre
// rendez-vous » qui ouvre le compte, espace façon Foyer (bannière, avatar, Mon profil), calendrier de
// rendez-vous et rencontre vidéo, admin Agenda, Courriel et messagerie, Infolettres.
// Usage : node scripts/qa-v3.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = process.argv[3] || 'captures-v3';
const SCRATCH = '/private/tmp/claude-501/-Users-lesalondesinconnus/58bd1e1f-7152-450f-95f0-4b5111d59e86/scratchpad/';
fs.mkdirSync(OUT, { recursive: true });
const comptes = fs.readFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', 'utf8').trim().split('\n');
const [clientEmail, clientPw] = comptes[0].split(' / ').map((s) => s.trim());
const [adminEmail, adminPw] = (comptes[1] || ' / ').split(' / ').map((s) => s.trim());

const rapport = { erreurs: [], pages: [], etapes: {} };

async function mesurer(page, nom, taille) {
  const m = await page.evaluate(() => {
    const visible = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    const h1 = document.querySelector('h1');
    let lignesH1 = 0;
    if (h1) { const lh = parseFloat(getComputedStyle(h1).lineHeight) || parseFloat(getComputedStyle(h1).fontSize) * 1.2; lignesH1 = Math.round(h1.getBoundingClientRect().height / lh); }
    const tous = [...document.querySelectorAll('body *')];
    const italiques = tous.filter((e) => getComputedStyle(e).fontStyle === 'italic' && e.innerText && e.innerText.trim() && visible(e)).length;
    const petits = tous.filter((e) => visible(e) && e.children.length === 0 && (e.innerText || '').trim() && parseFloat(getComputedStyle(e).fontSize) < 13).map((e) => `${parseFloat(getComputedStyle(e).fontSize)}px « ${(e.innerText || '').trim().slice(0, 40)} »`).slice(0, 6);
    const tirets = (document.body.innerText.match(/—/g) || []).length;
    return { h1: h1 ? h1.innerText.replace(/\n/g, ' / ') : null, lignesH1, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, italiques, petits, tirets, titre: document.title, skin: document.documentElement.getAttribute('data-skin') || 'ciel', bg: getComputedStyle(document.body).backgroundColor };
  });
  rapport.pages.push({ nom, taille, ...m });
  return m;
}
async function shot(page, nom, largeur, scrolls = [0]) {
  for (const s of scrolls) {
    await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * f), s);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `${nom}-${largeur}-${Math.round(s * 100)}.png`) });
  }
}
async function ouvrir(browser, largeur, skin) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 }, permissions: [] });
  if (skin) await ctx.addInitScript((s) => { try { localStorage.setItem('xena.skin', s); } catch (e) {} }, skin);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/meet\.jit\.si|external_api/.test(m.text())) rapport.erreurs.push(`${largeur}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => rapport.erreurs.push(`${largeur} PAGEERROR: ${e.message.slice(0, 200)}`));
  return { ctx, page };
}
async function connecter(page, email, pw) {
  const mail = page.locator('input[type="email"]').first();
  await mail.waitFor({ timeout: 15000 });
  await mail.fill(email);
  await page.locator('input[type="password"]').first().fill(pw);
  await page.locator('form button[type="submit"]').first().click();
  await page.locator('input[type="password"]').first().waitFor({ state: 'detached', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1800);
}
const onglet = (page, re) => page.locator('[role="tab"]').filter({ hasText: re }).first();

(async () => {
  const browser = await chromium.launch();

  // 1. Public : palette ciel par défaut, encre par la bascule, mobile.
  for (const largeur of [1440, 390]) {
    const { ctx, page } = await ouvrir(browser, largeur);
    for (const [nom, p] of [['accueil', '/'], ['services', '/services'], ['projets', '/projets'], ['a-propos', '/a-propos']]) {
      await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(nom === 'accueil' ? 3000 : 1800);
      await mesurer(page, nom, largeur); await shot(page, nom, largeur, nom === 'accueil' ? [0, 0.3, 0.6, 1] : [0, 0.5, 1]);
    }
    if (largeur === 1440) {
      await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(2500);
      const sw = page.locator('[role="switch"]').first();
      if (await sw.count()) { await sw.click(); await page.waitForTimeout(600); await mesurer(page, 'accueil-encre', largeur); await shot(page, 'accueil-encre', largeur, [0, 0.6]); await sw.click(); }
      // « Prendre rendez-vous » de la barre : la porte s'ouvre sur la création du compte
      await page.locator('nav button').filter({ hasText: /Prendre rendez-vous/ }).first().click();
      await page.waitForTimeout(1500);
      rapport.etapes.porteRdv = { url: page.url(), texte: (await page.locator('body').innerText()).includes('Crée ton compte') };
      await mesurer(page, 'porte-rdv', largeur); await shot(page, 'porte-rdv', largeur, [0]);
    }
    await ctx.close();
  }

  // 2. Parcours complet : « Prendre rendez-vous » → compte neuf → onglet Rendez-vous → réservation → Mon profil.
  {
    const { ctx, page } = await ouvrir(browser, 1440);
    const courriel = `temoin-rdv-${Date.now().toString(36)}@xenahorizon.com`;
    const mdp = 'Temoin-' + Date.now().toString(36);
    fs.appendFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', `\n${courriel} / ${mdp}`);
    await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(2500);
    await page.locator('nav button').filter({ hasText: /Prendre rendez-vous/ }).first().click();
    await page.waitForTimeout(1200);
    try {
      await page.locator('input[type="email"]').first().fill(courriel);
      await page.locator('input[type="password"]').first().fill(mdp);
      await page.locator('form button[type="submit"]').first().click();
      await page.locator('input[type="password"]').first().waitFor({ state: 'detached', timeout: 25000 });
      await page.waitForTimeout(3000);
      await mesurer(page, 'espace-rdv', 1440); await shot(page, 'espace-rdv', 1440, [0, 0.5]);
      const ongletActif = await page.locator('[role="tab"][aria-selected="true"]').first().innerText().catch(() => '');
      // Un jour disponible, un créneau, la demande
      const jour = page.locator('section[data-tx-scope="espaceRendezVous"] .grid-cols-7 button[class*="bg-rose"]:not([disabled])').first();
      let reserve = false;
      if (await jour.count()) {
        await jour.click(); await page.waitForTimeout(600);
        const creneau = page.locator('section[data-tx-scope="espaceRendezVous"] button.rounded-pilule.border:not([disabled])').first();
        if (await creneau.count()) {
          await creneau.click(); await page.waitForTimeout(500);
          const note = page.locator('textarea').first(); if (await note.count()) await note.fill('Vérification : demande de rendez-vous.');
          const demander = page.locator('button').filter({ hasText: /Demander|Réserver|Confirmer/ }).first();
          if (await demander.count()) { await demander.click(); await page.waitForTimeout(2500); reserve = (await page.locator('body').innerText()).includes('attente'); }
          await shot(page, 'espace-rdv-reserve', 1440, [0, 0.5]);
        }
      }
      rapport.etapes.rdv = { courriel, ongletActif, reserve };
      // Mon profil : avatar, bannière, bio
      const tabProfil = onglet(page, /Mon profil|My profile/);
      if (await tabProfil.count()) {
        await tabProfil.click(); await page.waitForTimeout(800);
        const fichiers = page.locator('input[type="file"]');
        const n = await fichiers.count();
        if (n >= 1) await fichiers.nth(0).setInputFiles(SCRATCH + 'avatar-test.jpg');
        if (n >= 2) await fichiers.nth(1).setInputFiles(SCRATCH + 'banniere-test.jpg');
        await page.waitForTimeout(3500);
        const bio = page.locator('textarea').first(); if (await bio.count()) await bio.fill('Artiste témoin pour la vérification.');
        const enregistrer = page.locator('button').filter({ hasText: /Enregistrer|Save/ }).first();
        if (await enregistrer.count()) { await enregistrer.click(); await page.waitForTimeout(2500); }
        await mesurer(page, 'espace-profil', 1440); await shot(page, 'espace-profil', 1440, [0, 0.5]);
        rapport.etapes.profil = { fichiers: n, banniere: await page.evaluate(() => { const i = document.querySelector('img'); return i ? i.currentSrc.slice(0, 80) : null; }) };
      }
      // Les autres onglets
      for (const re of [/Mon dossier|My file/, /Mes pièces|My documents/, /Messages/]) { const t = onglet(page, re); if (await t.count()) { await t.click(); await page.waitForTimeout(700); await page.screenshot({ path: path.join(OUT, `espace-${re.source.split('|')[0].toLowerCase().replace(/[^a-z]+/g, '-')}-1440-0.png`) }); } }
    } catch (e) { rapport.erreurs.push(`parcours rdv: ${e.message.slice(0, 200)}`); }
    await ctx.close();
  }

  // 3. Espace client témoin sur mobile (bannière, avatar, onglets en deux rangées, calendrier).
  {
    const { ctx, page } = await ouvrir(browser, 390);
    await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1500);
    try {
      await connecter(page, clientEmail, clientPw);
      await mesurer(page, 'espace-connecte', 390); await shot(page, 'espace-connecte', 390, [0, 0.4]);
      const t = onglet(page, /Rendez-vous|Appointments/); if (await t.count()) { await t.click(); await page.waitForTimeout(800); await mesurer(page, 'espace-rdv', 390); await shot(page, 'espace-rdv', 390, [0, 0.5]); }
      const p = onglet(page, /Mon profil|My profile/); if (await p.count()) { await p.click(); await page.waitForTimeout(800); await shot(page, 'espace-profil', 390, [0]); }
    } catch (e) { rapport.erreurs.push(`390 client: ${e.message.slice(0, 200)}`); }
    await ctx.close();
  }

  // 4. Back-office : agenda (confirmer la demande, disponibilités), courriel et messagerie, infolettres.
  if (adminEmail) {
    for (const largeur of [1440, 390]) {
      const { ctx, page } = await ouvrir(browser, largeur);
      await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1500);
      try {
        await connecter(page, adminEmail, adminPw);
        for (const [nom, route] of [['admin-agenda', '/admin/agenda'], ['admin-courriel', '/admin/courriel'], ['admin-messages', '/admin/messages'], ['admin-infolettre', '/admin/infolettre'], ['admin-dossiers', '/admin/dossiers'], ['admin-tableau', '/admin']]) {
          await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(3000);
          await mesurer(page, nom, largeur); await shot(page, nom, largeur, largeur > 600 ? [0, 0.5, 1] : [0, 0.5]);
          if (largeur > 600 && nom === 'admin-agenda') {
            const confirmer = page.locator('button').filter({ hasText: /^Confirmer$|^Confirm$/ }).first();
            if (await confirmer.count()) { await confirmer.click(); await page.waitForTimeout(1500); await shot(page, 'admin-agenda-confirme', largeur, [0]); rapport.etapes.confirme = true; }
          }
          if (largeur > 600 && nom === 'admin-messages') {
            const premier = page.locator('[data-dossier], button').filter({ hasText: /temoin/ }).first();
            if (await premier.count()) { await premier.click(); await page.waitForTimeout(1500); await shot(page, 'admin-messages-fil', largeur, [0, 0.5]); }
          }
          if (largeur > 600 && nom === 'admin-infolettre') {
            const composer = page.locator('[role="tab"], button').filter({ hasText: /Composer|Nouvelle lettre|Nouvelle infolettre/ }).first();
            if (await composer.count()) { await composer.click(); await page.waitForTimeout(1500); await shot(page, 'admin-infolettre-composer', largeur, [0, 0.5]); }
          }
        }
      } catch (e) { rapport.erreurs.push(`${largeur} admin: ${e.message.slice(0, 200)}`); }
      await ctx.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  const fautes = rapport.pages.filter((p) => p.lignesH1 > 2 || p.scrollWidth > p.clientWidth + 1 || p.italiques > 0 || p.tirets > 0 || (p.petits && p.petits.length));
  console.log(`Pages mesurées : ${rapport.pages.length}. Fautes mesurées : ${fautes.length}. Erreurs console : ${rapport.erreurs.length}.`);
  for (const f of fautes) console.log(`  ✗ ${f.nom} ${f.taille} : h1 ${f.lignesH1}, débordement ${f.scrollWidth - f.clientWidth}, ital ${f.italiques}, tirets ${f.tirets}, petits ${JSON.stringify(f.petits)}`);
  for (const e of rapport.erreurs.slice(0, 12)) console.log(`  ! ${e}`);
  console.log('étapes', JSON.stringify(rapport.etapes));
})();
