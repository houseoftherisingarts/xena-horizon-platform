// Boucle verdict du panneau « Google Agenda » (Admin › Agenda) : trois états, palette ciel et encre,
// mode nuit, à 1440 et 390. Usage : node scripts/qa-agenda-google.cjs <baseUrl> <dossierSortie>
const { chromium } = require('/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:4186';
const OUT = process.argv[3] || 'captures-agenda';
fs.mkdirSync(OUT, { recursive: true });

const ETATS = ['deconnecte', 'connecte', 'indisponible'];
const TAILLES = [
  { nom: '1440', width: 1440, height: 900 },
  { nom: '390', width: 390, height: 844 },
];

async function preparer(page, nuit) {
  await page.evaluate((n) => {
    try {
      if (n) window.localStorage.setItem('xena.nuit', '1');
      else window.localStorage.removeItem('xena.nuit');
    } catch {}
  }, nuit);
}

async function mesurer(page) {
  return page.evaluate(() => {
    const panneau = [...document.querySelectorAll('h2')].find((h) => /Google Agenda|Google Calendar/.test(h.textContent || ''));
    if (!panneau) return { trouve: false };
    const rect = panneau.getBoundingClientRect();
    const debordeH = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    const italiques = [...panneau.closest('section').querySelectorAll('*')].some(
      (e) => e.innerText && e.innerText.trim() && getComputedStyle(e).fontStyle === 'italic'
    );
    return { trouve: true, top: rect.top, debordeH, italiques };
  });
}

(async () => {
  const browser = await chromium.launch();
  const rapport = { pages: [] };

  for (const taille of TAILLES) {
    const context = await browser.newContext({ viewport: { width: taille.width, height: taille.height } });
    for (const etat of ETATS) {
      for (const nuit of [false, true]) {
        const page = await context.newPage();
        await page.goto(`${BASE}/admin/agenda?etatDemo=${etat}`, { waitUntil: 'networkidle' });
        await preparer(page, nuit);
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(300);
        const m = await mesurer(page);
        if (m.trouve) {
          await page.evaluate((top) => window.scrollTo(0, Math.max(0, top - 80)), m.top);
          await page.waitForTimeout(150);
        }
        const nomFichier = `google-agenda_${etat}${nuit ? '_nuit' : ''}_${taille.nom}.png`;
        await page.screenshot({ path: `${OUT}/${nomFichier}` });
        rapport.pages.push({ etat, nuit, taille: taille.nom, fichier: nomFichier, ...m });
        await page.close();
      }
    }
    await context.close();
  }

  await browser.close();
  fs.writeFileSync(`${OUT}/rapport.json`, JSON.stringify(rapport, null, 2));
  const manques = rapport.pages.filter((p) => !p.trouve || p.debordeH || p.italiques);
  console.log(JSON.stringify(rapport, null, 2));
  if (manques.length) {
    console.error(`ATTENTION : ${manques.length} capture(s) à problème.`);
    process.exit(1);
  }
  console.log(`OK : ${rapport.pages.length} captures dans ${OUT}/`);
})();
