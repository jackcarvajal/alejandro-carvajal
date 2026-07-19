/**
 * Alejandro Carvajal CAD/CAM — Smoke Tests
 * Node.js — sin dependencias externas
 *
 * Uso: node tests/smoke-tests.js
 */
'use strict';
const fs   = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let passed = 0, failed = 0;
function ok(m)   { console.log(`  ✅ ${m}`); passed++; }
function fail(m) { console.error(`  ❌ ${m}`); failed++; }
function fileContent(rel) { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; } }
function assert(cond, msg) { cond ? ok(msg) : fail(msg); }

/* ── 1. ARCHIVOS CRÍTICOS ────────────────────────────────── */
console.log('\n📁  ARCHIVOS CRÍTICOS');
const critFiles = [
  'index.html','calculadora-diseno.html','diseno-remoto.html','portafolio.html',
  'caso.html','article.html','guias-quirurgicas.html','cursos.html',
  'envia-tu-scanner.html','blog.html','404.html','offline.html',
  'js/header.js','js/footer.js','js/auth-guard.js',
  'css/styles.css','css/global-nav.min.css',
  'manifest.json','sw.js','robots.txt','sitemap.xml','_headers',
  'app/admin-panel.html','app/client-panel.html','app/login.html',
  'articles-ac.js',
];
critFiles.forEach(f => assert(fileContent(f).length > 0, `${f} existe`));

/* ── 2. SIN HANDLERS INLINE EN PÁGINAS PÚBLICAS ─────────── */
console.log('\n🎨  SIN HANDLERS INLINE');
const pubPages = [
  'index.html','diseno-remoto.html','guias-quirurgicas.html','article.html',
  'caso.html','envia-tu-scanner.html','terminos-y-legal.html','calculadora-diseno.html',
];
pubPages.forEach(pg => {
  const c = fileContent(pg);
  const n = (c.match(/onmouseover|onmouseout/g) || []).length;
  n === 0 ? ok(`${pg} — 0 handlers inline`) : fail(`${pg} tiene ${n} handlers inline`);
});

/* ── 3. CLASES HOVER CSS ─────────────────────────────────── */
console.log('\n🖌️   CLASES CSS HOVER');
const styles = fileContent('css/styles.css');
['hover-card-mg','hover-card-gold','hover-fade','hover-lift','hover-btn-mg','hover-bg-light','prefers-reduced-motion'].forEach(cls =>
  assert(styles.includes(cls), `css/styles.css tiene .${cls}`)
);

/* ── 4. COTIZACIONES ─────────────────────────────────────── */
console.log('\n🗂️   COTIZACIONES');
const calcDiseno = fileContent('calculadora-diseno.html');
assert(calcDiseno.includes('guardarCotizacionAC'), 'calculadora-diseno tiene guardarCotizacionAC()');
assert(calcDiseno.includes("from('cotizaciones').insert"), 'calculadora-diseno inserta en cotizaciones');
assert(calcDiseno.includes('btnGuardarCot'), 'calculadora-diseno tiene botón guardar');
const adminAC = fileContent('app/admin-panel.html');
assert(adminAC.includes('tab-cotizaciones'), 'admin-panel tiene tab cotizaciones');
assert(adminAC.includes('cargarCotizacionesAC'), 'admin-panel tiene función cargarCotizacionesAC');
const clientPanelAC = fileContent('app/client-panel.html');
assert(clientPanelAC.includes('sec-cotizaciones'), 'client-panel Alejandro tiene sección cotizaciones');
assert(clientPanelAC.includes('cargarCotizacionesAC_client'), 'client-panel Alejandro tiene función cargarCotizacionesAC_client');

/* ── 5. CURSOS LEADS ─────────────────────────────────────── */
console.log('\n🎓  CURSOS LEADS');
const cursos = fileContent('cursos.html');
assert(cursos.includes('registrarInteresCursos'), 'cursos.html tiene función registrarInteresCursos()');
assert(cursos.includes('leads_doctores'), 'cursos.html inserta en leads_doctores');
assert(cursos.includes('c-habeas'), 'cursos.html tiene checkbox habeas data');
assert(adminAC.includes('tab-cursos-leads'), 'admin-panel tiene tab cursos-leads');
assert(adminAC.includes('cargarCursosLeads'), 'admin-panel tiene función cargarCursosLeads');

/* ── 6. SEGURIDAD ────────────────────────────────────────── */
console.log('\n🔐  SEGURIDAD');
const headers = fileContent('_headers');
assert(headers.includes('Content-Security-Policy'), '_headers tiene CSP');
assert(headers.includes('X-Frame-Options'), '_headers tiene X-Frame-Options');
assert(headers.includes('noindex') || fileContent('app/admin-panel.html').includes('noindex'), 'app/ tiene noindex');
const authGuard = fileContent('js/auth-guard.js');
assert(authGuard.includes('Auth Guard') || authGuard.includes('auth-guard') || authGuard.includes('supabase'), 'auth-guard.js existe con contenido');
assert(authGuard.length > 100, 'auth-guard.js tiene contenido suficiente');
const robots = fileContent('robots.txt');
assert(robots.includes('Disallow: /app/'), 'robots.txt bloquea /app/');

/* ── 7. SEO ──────────────────────────────────────────────── */
console.log('\n🔍  SEO');
const sitemap = fileContent('sitemap.xml');
assert(sitemap.includes('<urlset'), 'sitemap.xml es XML válido');
assert(sitemap.includes('lastmod'), 'sitemap.xml tiene lastmod');
const indexH = fileContent('index.html');
assert(indexH.includes('canonical'), 'index.html tiene canonical');
assert(indexH.includes('og:title'), 'index.html tiene og:title');
assert(indexH.includes('schema.org'), 'index.html tiene schema.org');

/* ── 8. SW Y PWA ─────────────────────────────────────────── */
console.log('\n📱  SW Y PWA');
const sw = fileContent('sw.js');
assert(sw.includes('alejandro') || sw.includes('caches.open'), 'sw.js existe');
assert(sw.includes('install'), 'sw.js tiene evento install');
assert(sw.includes('notificationclick'), 'sw.js valida URL en notificationclick');
const manifest = fileContent('manifest.json');
assert(manifest.includes('"name"'), 'manifest.json tiene name');
assert(manifest.includes('"icons"'), 'manifest.json tiene icons');

/* ── 9. JOURNAL (articles-ac.js) ─────────────────────────── */
console.log('\n📰  JOURNAL');
const articlesAC = fileContent('articles-ac.js');
assert(articlesAC.includes('ARTICLES_AC'), 'articles-ac.js define ARTICLES_AC');
assert(articlesAC.includes('titulo'), 'articles-ac.js tiene campo titulo');

/* ── FAQPage COVERAGE ────────────────────────────────────── */
console.log('\n🔍  FAQPage Schema Coverage');
const paginasConFAQ = [
  'index.html','diseno-remoto.html','guias-quirurgicas.html',
  'envia-tu-scanner.html','calculadora-diseno.html','cursos.html',
  'sobre-mi.html','blog.html','portafolio.html',
  // 'instalar-app.html' — esa página nunca se creó en este proyecto (sí existe en
  // PRODIGY, de donde se copió esta lista). El test fallaba en cada push por un
  // archivo inexistente, y con el CI siempre en rojo un fallo real pasa
  // desapercibido. Si algún día se crea la página, se vuelve a agregar aquí.
  'seguimiento-caso.html','soporte.html',
];
paginasConFAQ.forEach(pg => {
  const content = fileContent(pg);
  assert(content.includes('FAQPage'), pg + ' tiene FAQPage schema');
});

/* ── STRIP REFERIDOS ─────────────────────────────────────── */
console.log('\n🟢  Strip Referidos');
const paginasConStrip = [
  'index.html','diseno-remoto.html','guias-quirurgicas.html',
  'envia-tu-scanner.html','cursos.html','portafolio.html','blog.html',
];
paginasConStrip.forEach(pg => {
  const content = fileContent(pg);
  assert(content.includes('REFERIDOS STRIP'), pg + ' tiene strip de referidos');
});

/* ── RESUMEN ─────────────────────────────────────────────── */
console.log('\n' + '═'.repeat(50));
console.log(`RESUMEN: ${passed} ✅  ${failed} ❌`);
if (failed > 0) { console.error(`\n🚨 ${failed} test(s) fallaron`); process.exit(1); }
else { console.log('\n🎉 Todos los tests pasaron'); process.exit(0); }
