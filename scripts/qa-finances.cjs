// Boucle verdict du module comptable (xena4-J-compta, 8 septembre 2026) : capture les six composants
// de components/admin/finances/ à 1440 et 390, en palette ciel et en mode nuit, avec le jeu d'exemple
// (une année de revenus et dépenses d'une consultante autonome). Sert http://127.0.0.1:4190 (dist-verif),
// jamais un autre serveur : le harnais qa-finances.html y est déjà buildé (scripts/vite.qa.config.ts).
// Mesures par capture : débordement horizontal, italiques, tiret cadratin, texte sous 13 px, lignes du h1/h2.
// Usage : node scripts/qa-finances.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://127.0.0.1:4190';
const OUT = process.argv[3] || 'captures-verif/xena4-J-compta';
fs.mkdirSync(OUT, { recursive: true });

// Un vrai CSV pour simuler le dépôt et capturer l'écran d'aperçu d'Import.tsx (colonnes détectées,
// doublons signalés), pas seulement la zone de dépôt vide.
const CSV_TEMOIN = path.join(OUT, '..', 'releve-temoin.csv');
fs.writeFileSync(
  CSV_TEMOIN,
  ['Date;Description;Débit;Crédit', '2026-09-03;Stripe;45,50;', '2026-09-05;Nouveau client;;750,00'].join('\n')
);

// Les six composants de la mission; Recus se capture à part (sans/avec reçu) via ?c=recus&recu=.
const ECRANS = [
  { nom: 'transactions', url: `${BASE}/qa-finances.html?c=transactions` },
  { nom: 'import', url: `${BASE}/qa-finances.html?c=import` },
  { nom: 'conciliation', url: `${BASE}/qa-finances.html?c=conciliation` },
  { nom: 'plan-comptable', url: `${BASE}/qa-finances.html?c=plan-comptable` },
  { nom: 'tiers', url: `${BASE}/qa-finances.html?c=tiers` },
  { nom: 'recus-sans', url: `${BASE}/qa-finances.html?c=recus&recu=sans` },
  { nom: 'recus-avec', url: `${BASE}/qa-finances.html?c=recus&recu=avec` },
];

const rapport = { erreurs: [], ecrans: [] };

async function mesurer(page) {
  return page.evaluate(() => {
    const visible = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    const tous = [...document.querySelectorAll('body *')];
    const italiques = tous.filter((e) => getComputedStyle(e).fontStyle === 'italic' && e.innerText && e.innerText.trim() && visible(e)).length;
    const petits = tous
      .filter((e) => {
        if (!visible(e) || e.children.length > 0) return false;
        const txt = (e.innerText || '').trim();
        if (!txt) return false;
        return parseFloat(getComputedStyle(e).fontSize) < 13;
      })
      .map((e) => `${parseFloat(getComputedStyle(e).fontSize)}px « ${(e.innerText || '').trim().slice(0, 40)} »`)
      .slice(0, 8);
    const h = document.querySelector('h1, h2');
    let lignesTitre = 0;
    if (h) {
      const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize) * 1.2;
      lignesTitre = Math.round(h.getBoundingClientRect().height / lh);
    }
    return {
      // body.scrollWidth aussi, pas seulement documentElement : une ligne d'actions qui déborde sans
      // wrap peut élargir le body sans que documentElement le signale (trouvé sur Transactions.tsx,
      // 8 sept, corrigé dans components/admin/ui.tsx).
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      clientWidth: document.documentElement.clientWidth,
      italiques,
      petits,
      tirets: (document.body.innerText.match(/—/g) || []).length,
      titre: h ? h.innerText.replace(/\n/g, ' / ') : null,
      lignesTitre,
      skin: document.documentElement.getAttribute('data-skin') || 'ciel',
      nuit: document.documentElement.hasAttribute('data-nuit'),
    };
  });
}

async function passe(browser, { largeur, hauteur, nuit, skin }) {
  const context = await browser.newContext({ viewport: { width: largeur, height: hauteur } });
  await context.addInitScript(
    ([n, s]) => {
      try {
        if (n) localStorage.setItem('xena.nuit', '1');
        if (s === 'encre') localStorage.setItem('xena.skin', 'encre');
      } catch (e) {}
    },
    [nuit, skin]
  );
  const page = await context.newPage();
  page.on('pageerror', (err) => rapport.erreurs.push(`${skin}/${nuit ? 'nuit' : 'jour'} ${largeur}px : ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') rapport.erreurs.push(`console ${skin}/${nuit ? 'nuit' : 'jour'} ${largeur}px : ${msg.text()}`);
  });

  for (const ecran of ECRANS) {
    await page.goto(ecran.url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(900); // laisse le temps à useTransactions() de basculer sur le jeu d'exemple
    const m = await mesurer(page);
    const suffixe = `${nuit ? 'nuit' : skin}-${largeur}`;
    const fichier = path.join(OUT, `${ecran.nom}-${suffixe}.png`);
    await page.screenshot({ path: fichier, fullPage: true });
    rapport.ecrans.push({ ecran: ecran.nom, largeur, palette: nuit ? 'nuit' : skin, fichier, ...m });
  }
  await context.close();
}

(async () => {
  const browser = await chromium.launch();
  await passe(browser, { largeur: 1440, hauteur: 900, nuit: false, skin: 'ciel' });
  await passe(browser, { largeur: 390, hauteur: 844, nuit: false, skin: 'ciel' });
  await passe(browser, { largeur: 1440, hauteur: 900, nuit: true, skin: 'ciel' });
  await passe(browser, { largeur: 390, hauteur: 844, nuit: true, skin: 'ciel' });
  await browser.close();

  fs.writeFileSync(path.join(OUT, 'rapport.json'), JSON.stringify(rapport, null, 2));

  const soucis = rapport.ecrans.filter(
    (e) => e.scrollWidth > e.clientWidth + 1 || e.italiques > 0 || e.tirets > 0 || e.petits.length > 0 || e.lignesTitre > 2
  );
  console.log(`${rapport.ecrans.length} captures écrites dans ${OUT}`);
  if (rapport.erreurs.length) console.log(`Erreurs console/page : ${rapport.erreurs.length}`, rapport.erreurs.slice(0, 5));
  if (soucis.length) {
    console.log(`${soucis.length} écran(s) à regarder de près :`);
    for (const s of soucis) {
      console.log(
        `- ${s.ecran} (${s.palette}, ${s.largeur}px) : débordement=${s.scrollWidth > s.clientWidth + 1} italiques=${s.italiques} tirets=${s.tirets} petits=${s.petits.length} lignesTitre=${s.lignesTitre}`
      );
    }
  } else {
    console.log('Aucun souci détecté par les mesures automatiques.');
  }
})();
