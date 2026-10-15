import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const screenshotsDir = path.join(root, 'public', 'screenshots');
const viewport = { width: 1440, height: 810 };
const projects = [
  { name: 'Activa MKT', url: 'https://www.activa-mkt.com/es/', file: 'activa.webp' },
  { name: 'APATEL Panama', url: 'https://apatelpanama.com/', file: 'apatel.webp' },
  { name: 'SEPIA', url: 'https://sepia.lat/', file: 'sepia.webp' },
  { name: 'Aula Virtual SEPIA', url: 'https://aula.sepia.lat/', file: 'sepia-aula.webp' },
  { name: 'OIRSA Aula Virtual', url: 'https://aulavirtual.oirsa.org/', file: 'oirsa.webp' },
  { name: 'Cooperativa Bio Cosmetica Panama', url: 'https://coopbiocap.com/', file: 'coopbio.webp' },
  { name: 'CEREBR4L', url: 'https://cerebr4l.com/en/', file: 'cerebr4l.webp' },
  { name: 'QUEBEC S.A. de C.V.', url: 'https://quebec.earth/', file: 'quebec.webp' },
  { name: 'TUNNME', url: 'https://tunnme.com/', file: 'tunnme.webp' },
];
const cookieSelectors = [
  '#onetrust-banner-sdk', '#onetrust-consent-sdk', '.cookie-banner', '.cookies-banner',
  '.cookie-consent', '.cc-window', '[class*="cookie-consent"]', '[id*="cookie-banner"]',
  '[class*="CookieConsent"]', '[aria-label*="cookie" i]',
];

await mkdir(screenshotsDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const project of projects) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    try {
      await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        await Promise.all(Array.from(document.images, (image) => {
          if (image.complete) return Promise.resolve();
          return new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
            setTimeout(resolve, 8000);
          });
        }));
      });
      await page.addStyleTag({ content: `${cookieSelectors.join(',')} { display:none !important; visibility:hidden !important; }` }).catch(() => {});
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const png = await page.screenshot({ type: 'png', fullPage: false, animations: 'disabled' });
      await sharp(png).resize(viewport.width, viewport.height, { fit: 'fill' }).webp({ quality: 88 }).toFile(path.join(screenshotsDir, project.file));
      results.push({ ...project, ok: true });
      console.log(`OK   ${project.name}: public/screenshots/${project.file}`);
    } catch (error) {
      results.push({ ...project, ok: false, error: error.message });
      console.error(`FAIL ${project.name} (${project.url}): ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
const failed = results.filter((result) => !result.ok);
console.log(`\nGenerated ${results.length - failed.length}/${results.length} screenshots.`);
if (failed.length) process.exitCode = 1;
