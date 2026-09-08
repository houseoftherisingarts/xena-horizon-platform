// Boucle verdict Xena Horizon, tour v2 (8 septembre 2026) : palettes encre et ciel, éditeur de textes,
// rendez-vous qui ouvre le compte, espace client, back-office complet. Mesures par page : lignes du h1,
// débordement horizontal, italiques, tirets longs, textes sous 13 px, sticky qui coince, erreurs console.
// Usage : node scripts/qa-v2.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = process.argv[3] || 'captures-v2';
fs.mkdirSync(OUT, { recursive: true });
const comptes = fs.readFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', 'utf8').trim().split('\n');
const [clientEmail, clientPw] = comptes[0].split(' / ').map((s) => s.trim());
const [adminEmail, adminPw] = (comptes[1] || ' / ').split(' / ').map((s) => s.trim());

const PUBLIQUES = [
  { nom: 'accueil', path: '/', scrolls: [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1] },
  { nom: 'services', path: '/services', scrolls: [0, 0.5, 1] },
  { nom: 'projets', path: '/projets', scrolls: [0, 0.5, 1] },
  { nom: 'a-propos', path: '/a-propos', scrolls: [0, 0.5, 1] },
  { nom: 'espace-porte', path: '/espace', scrolls: [0, 0.5, 1] },
];
const ADMIN = ['/admin', '/admin/dossiers', '/admin/clients', '/admin/offres', '/admin/factures', '/admin/finances', '/admin/agenda', '/admin/courriel', '/admin/messages', '/admin/infolettre', '/admin/galerie', '/admin/social'];

const rapport = { erreurs: [], pages: [], rdv: null };

async function mesurer(page, nom, taille) {
  const m = await page.evaluate(() => {
    const visible = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    const h1 = document.querySelector('h1');
    let lignesH1 = 0;
    if (h1) {
      const lh = parseFloat(getComputedStyle(h1).lineHeight) || parseFloat(getComputedStyle(h1).fontSize) * 1.2;
      lignesH1 = Math.round(h1.getBoundingClientRect().height / lh);
    }
    const tous = [...document.querySelectorAll('body *')];
    const italiques = tous.filter((e) => getComputedStyle(e).fontStyle === 'italic' && e.innerText && e.innerText.trim() && visible(e)).length;
    const petits = tous.filter((e) => {
      if (!visible(e) || e.children.length > 0) return false;
      const txt = (e.innerText || '').trim();
      if (!txt) return false;
      return parseFloat(getComputedStyle(e).fontSize) < 13;
    }).map((e) => `${parseFloat(getComputedStyle(e).fontSize)}px « ${(e.innerText || '').trim().slice(0, 40)} »`).slice(0, 8);
    const stickies = tous.filter((e) => getComputedStyle(e).position === 'sticky');
    const stickyCoince = stickies.filter((s) => {
      const z = parseInt(getComputedStyle(s).zIndex) || 0;
      let n = s.parentElement && s.parentElement.nextElementSibling;
      while (n) {
        const zn = parseInt(getComputedStyle(n).zIndex) || 0;
        if (n.getBoundingClientRect().height > 0 && z >= zn && zn > 0) return true;
        n = n.nextElementSibling;
      }
      return false;
    }).length;
    const tirets = (document.body.innerText.match(/—/g) || []).length;
    return {
      h1: h1 ? h1.innerText.replace(/\n/g, ' / ') : null,
      lignesH1,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      italiques,
      petits,
      stickyCoince,
      tirets,
      titre: document.title,
      skin: document.documentElement.getAttribute('data-skin') || 'encre',
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

async function ouvrir(browser, largeur, skin) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur > 600 ? 900 : 844 }, reducedMotion: 'no-preference' });
  if (skin) await ctx.addInitScript((s) => { try { localStorage.setItem('xena.skin', s); } catch (e) {} }, skin);
  // L'intro ne joue qu'une fois par session : on la laisse passer pour la première page seulement.
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') rapport.erreurs.push(`${largeur}${skin ? ' ' + skin : ''}: ${m.text().slice(0, 200)}`); });
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
  await page.waitForTimeout(1500);
}

(async () => {
  const browser = await chromium.launch();

  // 1. Pages publiques, palette encre, 1440 et 390 ; palette ciel à 1440 et 390 (accueil complet, autres pages en 3 points).
  for (const skin of ['encre', 'ciel']) {
    for (const largeur of [1440, 390]) {
      const { ctx, page } = await ouvrir(browser, largeur, skin);
      const suffixe = skin === 'encre' ? '' : '-ciel';
      for (const v of PUBLIQUES) {
        if (skin === 'ciel' && largeur === 390 && v.nom !== 'accueil' && v.nom !== 'espace-porte') continue;
        await page.goto(BASE + v.path, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(v.nom === 'accueil' ? 3000 : 2000);
        await mesurer(page, v.nom + suffixe, largeur);
        await capturer(page, v.nom + suffixe, largeur, skin === 'ciel' && v.nom === 'accueil' ? v.scrolls : v.scrolls.length > 3 ? [0, 0.25, 0.55, 1] : v.scrolls);
      }
      if (skin === 'encre' && largeur === 1440) {
        // Anglais : accueil et services
        for (const v of PUBLIQUES.slice(0, 2)) {
          await page.goto(BASE + v.path, { waitUntil: 'load', timeout: 60000 });
          await page.waitForTimeout(1500);
          const bascule = page.locator('button').filter({ hasText: /FR\s*\/\s*EN|^EN$/ }).first();
          if (await bascule.count()) { await bascule.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(800); }
          await mesurer(page, `${v.nom}-en`, largeur);
          await capturer(page, `${v.nom}-en`, largeur, [0, 0.5, 1]);
        }
        // Bascule de palette cliquée en direct (le switch de la barre), preuve que le geste fonctionne.
        await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(2500);
        const sw = page.locator('[role="switch"]').first();
        if (await sw.count()) {
          await sw.click();
          await page.waitForTimeout(600);
          await page.screenshot({ path: path.join(OUT, `bascule-cliquee-${largeur}.png`) });
          rapport.bascule = await page.evaluate(() => ({ skin: document.documentElement.getAttribute('data-skin'), stocke: localStorage.getItem('xena.skin') }));
          await sw.click();
        } else rapport.erreurs.push('bascule de palette introuvable dans la barre');
      }
      await ctx.close();
    }
  }

  // 2. Prendre rendez-vous : le formulaire ouvre un compte et un dossier.
  {
    const { ctx, page } = await ouvrir(browser, 1440);
    const courriel = `temoin-rdv-${Date.now().toString(36)}@xenahorizon.com`;
    await page.goto(BASE + '/#contact', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);
    try {
      await page.locator('#contact-name').fill('Témoin Rendez-vous');
      await page.locator('#contact-email').fill(courriel);
      await page.locator('#contact-message').fill('Message de vérification : prise de rendez-vous qui ouvre le compte.');
      await page.locator('#contact-name').scrollIntoViewIfNeeded();
      await page.locator('#contact form button[type="submit"]').click();
      await page.locator('#contact form').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(OUT, 'rdv-succes-1440.png') });
      const texte = await page.locator('#contact').innerText();
      // Ouvrir mon espace : la personne est déjà connectée, elle doit atterrir dans son espace.
      const bouton = page.locator('#contact button').filter({ hasText: /Ouvrir mon espace|Open my space/ }).first();
      let espaceOuvert = false;
      if (await bouton.count()) {
        await bouton.click();
        await page.waitForTimeout(3500);
        await page.screenshot({ path: path.join(OUT, 'rdv-espace-1440.png') });
        espaceOuvert = (await page.locator('h1').first().innerText().catch(() => '')).length > 0 && !(await page.locator('input[type="password"]').count());
      }
      rapport.rdv = { courriel, texte: texte.slice(0, 400), espaceOuvert };
    } catch (e) {
      rapport.erreurs.push(`rdv: ${e.message.slice(0, 200)}`);
      rapport.rdv = { courriel, erreur: e.message.slice(0, 200) };
    }
    fs.appendFileSync(process.env.HOME + '/.config/xena/compte-temoin.txt', `\n${courriel} / (mot de passe aléatoire, compte créé par le formulaire)`);
    await ctx.close();
  }

  // 3. Espace client connecté (client témoin), 1440 et 390.
  for (const largeur of [1440, 390]) {
    const { ctx, page } = await ouvrir(browser, largeur);
    await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    try {
      await connecter(page, clientEmail, clientPw);
      await mesurer(page, 'espace-connecte', largeur);
      await capturer(page, 'espace-connecte', largeur, [0, 0.5, 1]);
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
  }

  // 4. Back-office complet et éditeur de textes (admin témoin).
  if (adminEmail) {
    for (const largeur of [1440, 390]) {
      const { ctx, page } = await ouvrir(browser, largeur);
      await page.goto(BASE + '/espace', { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(2000);
      try {
        await connecter(page, adminEmail, adminPw);
        for (const route of ADMIN) {
          await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
          await page.waitForTimeout(3000);
          const nom = 'admin' + (route.replace('/admin', '').replace(/\//g, '-') || '-tableau');
          await mesurer(page, nom, largeur);
          await capturer(page, nom, largeur, largeur > 600 ? [0, 1] : [0]);
        }
        // Menu mobile ouvert
        if (largeur < 600) {
          await page.goto(BASE + '/admin', { waitUntil: 'load', timeout: 60000 });
          await page.waitForTimeout(2500);
          const menu = page.locator('button[aria-label="Ouvrir le menu"]').first();
          if (await menu.count()) { await menu.click(); await page.waitForTimeout(600); await page.screenshot({ path: path.join(OUT, 'admin-menu-390.png') }); }
        }
        // Éditeur de textes sur l'accueil
        if (largeur > 600) {
          await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 });
          await page.waitForTimeout(3000);
          await page.screenshot({ path: path.join(OUT, 'editeur-crayon-1440.png') });
          const crayon = page.locator('[data-editeur] button').first();
          if (await crayon.count()) {
            await crayon.click();
            await page.waitForTimeout(800);
            await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.42));
            await page.waitForTimeout(900);
            await page.screenshot({ path: path.join(OUT, 'editeur-mode-1440.png') });
            const balises = await page.locator('[data-tx]').count();
            const cible = page.locator('h2[data-tx], p[data-tx]').first();
            if (await cible.count()) {
              await cible.scrollIntoViewIfNeeded();
              await page.waitForTimeout(400);
              await cible.click();
              await page.waitForTimeout(700);
              await page.screenshot({ path: path.join(OUT, 'editeur-fenetre-1440.png') });
              const zone = page.locator('[data-editeur] textarea');
              const avant = await zone.inputValue();
              await zone.fill(avant + ' (essai)');
              await page.locator('[data-editeur] button').filter({ hasText: /Appliquer|Apply/ }).click();
              await page.waitForTimeout(600);
              await page.screenshot({ path: path.join(OUT, 'editeur-applique-1440.png') });
              const applique = (await page.locator('body').innerText()).includes(avant + ' (essai)');
              // On annule : rien ne s'écrit dans Firestore pendant la vérification.
              await page.locator('[data-editeur] button[aria-label]').filter({ has: page.locator('svg') }).last().click().catch(() => {});
              await page.waitForTimeout(500);
              rapport.editeur = { balises, applique, avant: avant.slice(0, 60) };
            } else rapport.editeur = { balises, applique: false, erreur: 'aucun h2/p balisé' };
          } else rapport.erreurs.push('crayon introuvable pour le compte admin');
        }
      } catch (e) {
        rapport.erreurs.push(`${largeur} admin: ${e.message.slice(0, 200)}`);
      }
      await ctx.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));
  const fautes = rapport.pages.filter((p) => p.lignesH1 > 2 || p.scrollWidth > p.clientWidth + 1 || p.italiques > 0 || p.tirets > 0 || p.stickyCoince > 0 || (p.petits && p.petits.length));
  console.log(`Pages mesurées : ${rapport.pages.length}. Fautes mesurées : ${fautes.length}. Erreurs console : ${rapport.erreurs.length}.`);
  for (const f of fautes) console.log(`  ✗ ${f.nom} ${f.taille} : h1 ${f.lignesH1} lignes, débordement ${f.scrollWidth - f.clientWidth}, italiques ${f.italiques}, tirets ${f.tirets}, sticky ${f.stickyCoince}, petits ${JSON.stringify(f.petits)}`);
  for (const e of rapport.erreurs.slice(0, 12)) console.log(`  ! ${e}`);
  console.log('rdv', JSON.stringify(rapport.rdv));
  console.log('bascule', JSON.stringify(rapport.bascule));
  console.log('editeur', JSON.stringify(rapport.editeur));
})();
