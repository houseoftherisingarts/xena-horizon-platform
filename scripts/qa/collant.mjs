// Ouvre la carte du collant Vexel (lien aria-label « Site créé par Vexel… ») et la capture en 1440 et 390.
//   BASE=http://localhost:4200 ROUTE=/services node scripts/qa/collant.mjs scripts/qa/shots/collant
import { chromium } from '/Users/lesalondesinconnus/Documents/Websites/FMM 2026/node_modules/playwright/index.mjs';
const BASE = process.env.BASE || 'http://localhost:4200';
const out = process.argv[2] || 'scripts/qa/shots/collant';
const ROUTE = process.env.ROUTE || '/services';
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, deviceScaleFactor: w < 600 ? 2 : 1, locale: 'fr-CA' });
  const p = await c.newPage();
  await p.goto(`${BASE}${ROUTE}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  const compris = p.locator('button:has-text("Compris")').first();
  if (await compris.count()) await compris.click().catch(() => {});
  const badge = p.locator('a[aria-label^="Site créé par Vexel"]').first();
  console.log(tag, 'badge trouvé :', await badge.count());
  await badge.scrollIntoViewIfNeeded().catch(() => {});
  await p.waitForTimeout(500);
  await badge.evaluate((el) => { el.scrollIntoView({ block: 'center' }); el.click(); });
  await p.waitForTimeout(1200);
  console.log(tag, 'dialog :', await p.locator('[role="dialog"]').count());
  await p.screenshot({ path: `${out}-${tag}.jpg`, quality: 80, type: 'jpeg' });
  await c.close();
}
await b.close();
