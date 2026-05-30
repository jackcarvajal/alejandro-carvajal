/**
 * Alejandro Carvajal — Generador de OG Images con Puppeteer
 *
 * Uso: node scripts/gen-og-images.js
 * Requiere: npm install puppeteer (una vez)
 *
 * Genera JPG 1200x630 desde los templates HTML en /assets/og-*.html
 * Guarda los resultados como /assets/og-*.jpg
 */

const path = require('path');
const fs   = require('fs');

const ASSETS = path.join(__dirname, '..', 'assets');

const templates = [
  'og-home',
  'og-diseno-remoto',
  'og-calculadora-diseno',
  'og-guias-quirurgicas',
  'og-portafolio',
  'og-blog',
  'og-cursos',
  'og-envia-tu-scanner',
  'og-soporte',
  'og-nosotros',
];

async function generateOG() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.error('Puppeteer no instalado. Ejecuta: npm install puppeteer');
    console.log('\nAlternativa manual:');
    console.log('1. Abre cada archivo assets/og-*.html en el navegador');
    console.log('2. Usa DevTools → Device toolbar → 1200x630');
    console.log('3. Captura pantalla y guarda como assets/og-*.jpg');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  let ok = 0, err = 0;
  for (const tpl of templates) {
    const htmlPath = path.join(ASSETS, `${tpl}.html`);
    const jpgPath  = path.join(ASSETS, `${tpl}.jpg`);
    if (!fs.existsSync(htmlPath)) {
      console.log(`SKIP: ${tpl}.html no existe`);
      continue;
    }
    try {
      await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 10000 });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✓ ${tpl}.jpg`);
      ok++;
    } catch(e) {
      console.error(`✗ ${tpl}: ${e.message}`);
      err++;
    }
  }

  await browser.close();
  console.log(`\nCompletado: ${ok} generadas, ${err} errores`);
  console.log('Los archivos JPG están en /assets/');
}

generateOG();
