// Genera las imágenes para compartir (og:image, 1200×630) con fotos reales de casos del portafolio.
//
//   node tools/og-generar.mjs            → crea/actualiza assets/og-<slug>.jpg
//   node tools/og-generar.mjs --aplicar  → además apunta og:image y twitter:image de cada página a su imagen
//                                          (y agrega og:image:width/height y twitter:card si faltan); --solo-metas no regenera
//   node tools/og-generar.mjs --solo corona-cad,full-arch   → solo esas
//
// Reglas (22-nov-2026): español sin precios ni promesas de tiempo; inglés tampoco (los precios cambian y la
// imagen queda vieja en cachés de WhatsApp/Facebook). Foto real de exocad, un solo acento (dorado), sin brillos,
// sin etiquetas decorativas. Requiere Chrome o Edge instalados (variable CHROME para otra ruta).

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FOTOS = 'https://zgihrwqfyvgyapbwzkvw.supabase.co/storage/v1/object/public/portafolio/';
// «local:» = archivo del repo (assets/…); lo demás = portafolio en Supabase (casos reales).
const foto = f => f.startsWith('local:') ? pathToFileURL(join(ROOT, 'assets', f.slice(6))).href : FOTOS + f;
const IMPL = 'caso-1784766305902/gallery/', ALLX = 'caso-1784774716081/gallery/', ZIRC = 'caso-1784774363552/gallery/';
const ALN = 'caso-1784826632765/gallery/foto-2.png';   // modelos anidados en la placa de impresión

const ES = { pie: 'Diseño real en exocad' }, EN = { pie: 'Real design in exocad' };
const IMAGENES = [
  { slug: 'inicio', ...ES, foto: ZIRC + 'foto-3.jpeg', t: 'Diseño CAD dental para laboratorios y clínicas', s: 'Coronas, carillas, implantes y Full Arch diseñados a mano en exocad. Servicio remoto desde Bogotá.', paginas: ['index', 'instalar-app', 'links', 'reseñas', 'terminos-y-legal'] },
  { slug: 'corona-cad', ...ES, foto: ZIRC + 'foto-15.jpeg', t: 'Diseño de coronas CAD', s: 'Zirconia, disilicato o PMMA, con contactos y oclusión ajustados antes de fresar.', paginas: ['corona-cad'] },
  { slug: 'alineadores', ...ES, pie: 'Caso real · modelos listos para imprimir', foto: ALN, t: 'Diseño de alineadores invisibles', s: 'Planificación de movimientos por etapas, con modelos listos para imprimir.', paginas: ['alineadores'] },
  { slug: 'postes-munones', ...ES, foto: ZIRC + 'foto-13.jpeg', t: 'Postes y muñones en CAD', s: 'Diseño para dientes con tratamiento de conductos, listo para fresar o imprimir.', paginas: ['diseno-endodontico'] },
  { slug: 'endocrown', ...ES, foto: ZIRC + 'foto-12.jpeg', t: 'Endocrown en CAD', s: 'Restauración de dientes tratados con endodoncia, diseñada en exocad.', paginas: ['caso-endodontico-digital'] },
  { slug: 'full-arch', ...ES, foto: ALLX + 'foto-2.jpeg', t: 'Diseño Full Arch sobre implantes', s: 'All-on-4 y All-on-6: híbridas y estructuras con ajuste pasivo.', paginas: ['diseno-full-arch'] },
  { slug: 'implante', ...ES, foto: IMPL + 'foto-11.jpeg', t: 'Corona sobre implante', s: 'Perfil de emergencia y pilar personalizado para cada caso.', paginas: ['diseno-implante-digital'] },
  { slug: 'puente-implante', ...ES, foto: IMPL + 'foto-8.jpeg', t: 'Puente sobre implantes', s: 'Estructuras atornilladas con las chimeneas en el lugar correcto.', paginas: ['diseno-puente-implante'] },
  { slug: 'provisional', ...ES, foto: ZIRC + 'foto-7.jpeg', t: 'Provisionales CAD en PMMA', s: 'Para probar en boca forma, función y estética antes de la definitiva.', paginas: ['diseno-provisional'] },
  { slug: 'guias', ...ES, foto: IMPL + 'foto-10.jpeg', t: 'Diseño de guías quirúrgicas', s: 'Planificación de implantes a partir del CBCT y el escaneo intraoral.', paginas: ['guias-quirurgicas'] },
  { slug: 'modelo-diagnostico', ...ES, foto: ALLX + 'foto-5.jpeg', t: 'Modelo digital de diagnóstico', s: 'Modelos para estudio, DSD y presentación del caso al paciente.', paginas: ['modelo-digital-diagnostico'] },
  { slug: 'removible', ...ES, foto: ALLX + 'foto-8.jpeg', t: 'Prótesis removible digital', s: 'Bases y dientes diseñados en exocad para fresar o imprimir.', paginas: ['protesis-removible-digital'] },
  { slug: 'rehabilitacion', ...ES, foto: ZIRC + 'foto-2.jpeg', t: 'Rehabilitación oral completa', s: 'Del DSD y el wax-up a la restauración definitiva, por etapas.', paginas: ['rehabilitacion-oral'] },
  { slug: 'splint', ...ES, foto: ALLX + 'foto-6.jpeg', t: 'Splint oclusal CAD', s: 'Férulas diseñadas en exocad sobre el escaneo del paciente.', paginas: ['splint-oclusal-cad'] },
  { slug: 'wax-up', ...ES, foto: IMPL + 'foto-7.jpeg', t: 'Wax-up digital', s: 'El encerado diagnóstico en 3D para planear y mostrar el caso.', paginas: ['wax-up-digital'] },
  { slug: 'diseno-sonrisa', ...ES, foto: ZIRC + 'foto-4.jpeg', t: 'Diseño de sonrisa digital', s: 'Proporciones, bordes incisales y textura planeados antes de producir.', paginas: ['diseno-sonrisa'] },
  { slug: 'estetica-implantes', ...ES, foto: IMPL + 'foto-2.jpeg', t: 'Coronas y pilares sobre implantes', s: 'Perfiles de emergencia que cuidan el tejido blando.', paginas: ['estetica-implantes'] },
  { slug: 'diseno-remoto-es', ...ES, foto: ZIRC + 'foto-9.jpeg', t: 'Diseño CAD dental remoto', s: 'Envías el escaneo y recibes el STL listo para fresar o imprimir.', paginas: ['diseno-remoto', 'flujo-diseno'] },
  { slug: 'envia-escaneo', ...ES, foto: ZIRC + 'foto-11.jpeg', t: 'Envía tu escaneo', s: 'STL, PLY u OBJ de cualquier escáner intraoral, por el portal o por correo.', paginas: ['envia-tu-scanner'] },
  { slug: 'en-remote-design', ...EN, foto: ZIRC + 'foto-3.jpeg', t: 'Remote dental CAD design for labs and clinics', s: 'Send the scan, get a mill-ready STL. Designed by hand in exocad.', paginas: ['en/index', 'en/remote-design', 'en/dental-cad-outsourcing-guide', 'en/cut-dental-lab-cad-costs', 'en/exocad-vs-3shape-for-labs'] },
  { slug: 'en-all-on-x', ...EN, foto: ALLX + 'foto-2.jpeg', t: 'All-on-X and full-arch CAD design', s: 'Hybrids and implant frameworks with a passive fit.', paginas: ['en/all-on-x'] },
  { slug: 'en-clear-aligners', ...EN, pie: 'Real case · print-ready models', foto: ALN, t: 'Clear aligner CAD design and setup', s: 'Staged tooth movement with print-ready models.', paginas: ['en/clear-aligners'] },
  { slug: 'en-implant-esthetics', ...EN, foto: IMPL + 'foto-2.jpeg', t: 'Implant crowns and custom abutments', s: 'Emergence profiles designed around the soft tissue.', paginas: ['en/implant-esthetics'] },
  { slug: 'en-smile-design', ...EN, foto: ZIRC + 'foto-4.jpeg', t: 'Digital smile design and veneer CAD', s: 'Proportions, incisal edges and texture planned before production.', paginas: ['en/smile-design'] },
  { slug: 'en-surgical-guides', ...EN, foto: IMPL + 'foto-10.jpeg', t: 'Surgical guide design from CBCT', s: 'Implant planning from the CBCT and the intraoral scan.', paginas: ['en/surgical-guides'] },
  { slug: 'en-veneers', ...EN, foto: IMPL + 'foto-4.jpeg', t: 'Veneers for U.S. dentists', s: 'Designed in exocad, fabricated in Colombia, shipped to your practice.', paginas: ['en/veneers'] },
  // Resto de páginas (22-nov-2026)
  { slug: 'academia', ...ES, pie: 'Alejandro dictando una conferencia', pos: '50% 18%', foto: 'local:alejandro-carvajal.jpg', t: 'Academia de diseño CAD en exocad', s: 'De la primera corona al Full Arch, con casos reales y en español.', paginas: ['academia', 'curso', 'verificar-certificado', 'cursos'] },
  { slug: 'sobre-mi', ...ES, pie: 'Alejandro Carvajal', pos: '50% 18%', foto: 'local:alejandro-carvajal.jpg', t: 'Alejandro Carvajal, diseñador CAD/CAM dental', s: 'Más de 10 años diseñando a mano en exocad para laboratorios y clínicas de 20+ países.', paginas: ['sobre-mi'] },
  { slug: 'portafolio', ...ES, foto: IMPL + 'foto-3.jpeg', t: 'Portafolio de diseño CAD', s: 'Casos reales: coronas, carillas, implantes y Full Arch.', paginas: ['portafolio'] },
  { slug: 'seguimiento', ...ES, foto: ZIRC + 'foto-10.jpeg', t: 'Seguimiento de tu caso', s: 'Consulta en qué etapa está tu diseño.', paginas: ['seguimiento-caso'] },
  { slug: 'blog-cad', ...ES, foto: ALLX + 'foto-7.jpeg', t: 'Blog de diseño CAD dental', s: 'Exocad, materiales y flujo digital, con fuentes científicas reales.', paginas: ['blog', 'article'] },
  { slug: 'preguntas', ...ES, foto: IMPL + 'foto-4.jpeg', t: 'Preguntas frecuentes', s: 'Archivos, revisiones, formas de pago y cómo enviar tu caso.', paginas: ['preguntas'] },
  { slug: 'carillas-cad', ...ES, foto: ZIRC + 'foto-4.jpeg', t: 'Diseño de carillas', s: 'Hollywood o natural: apruebas el mock-up 3D antes de producir.', paginas: ['carillas'] },
  { slug: 'cotizador', ...ES, foto: ZIRC + 'foto-15.jpeg', t: 'Cotizador de diseño CAD', s: 'Arma tu pedido y conoce el valor antes de enviarlo.', paginas: ['calculadora-diseno'] },
  { slug: 'en-faq', ...EN, foto: IMPL + 'foto-4.jpeg', t: 'Dental CAD design FAQ', s: 'Files, turnaround, revisions, credit plans and USD payment.', paginas: ['en/faq'] },
  { slug: 'soporte-ac', ...ES, foto: ALLX + 'foto-3.jpeg', t: 'Soporte técnico', s: 'Ayuda con exocad, archivos STL y dudas de tu caso, por WhatsApp.', paginas: ['soporte'] },
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/(\S+-\S+)/g, '<span style="white-space:nowrap">$1</span>');   // «All-on-4» no se parte en el guion
const plantilla = i => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;800&display=swap">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden;background:#070708;font-family:Inter,'Segoe UI',Arial,sans-serif}
.panel{position:absolute;left:0;top:0;bottom:0;width:520px;padding:56px 52px 50px 60px;display:flex;flex-direction:column;justify-content:space-between}
.marca{font-size:21px;font-weight:600;color:#f1f1f1;letter-spacing:.01em}
.marca b{font-weight:600;color:#D4AF37;margin-left:6px;letter-spacing:.06em}
h1{font-size:${i.t.length > 34 ? 46 : 54}px;line-height:1.08;font-weight:800;color:#fff;text-wrap:balance;letter-spacing:-.01em}
p{margin-top:22px;font-size:22px;line-height:1.45;color:#aeb4bf;font-weight:500}
.web{font-size:20px;font-weight:600;color:#D4AF37}
.foto{position:absolute;left:520px;top:0;right:0;bottom:0;overflow:hidden;background:#1c1830}
.foto img{width:100%;height:100%;object-fit:cover;object-position:${i.pos || 'center'}}
.pie{position:absolute;right:0;bottom:0;padding:9px 16px;background:rgba(7,7,8,.78);color:#e7e7e7;font-size:15px;font-weight:500}
</style></head><body>
<div class="panel"><div class="marca">Alejandro Carvajal<b>CAD/CAM</b></div>
<div><h1>${esc(i.t)}</h1><p>${esc(i.s)}</p></div><div class="web">alejandrocadcam.com</div></div>
<div class="foto"><img src="${foto(i.foto)}" alt=""><div class="pie">${esc(i.pie)}</div></div>
</body></html>`;

function chromePath() {
  const c = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  const p = c.find(x => x && existsSync(x)); if (!p) throw new Error('No encuentro Chrome/Edge (define CHROME=ruta)'); return p;
}

async function conCDP(fn) {
  const perfil = mkdtempSync(join(tmpdir(), 'og-'));
  const PUERTO = 9400 + Math.floor(Math.random() * 400);
  const ch = spawn(chromePath(), ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' });
  try {
    let ver; for (let k = 0; k < 50 && !ver; k++) { try { ver = await (await fetch(`http://127.0.0.1:${PUERTO}/json/version`)).json(); } catch { await new Promise(r => setTimeout(r, 200)); } }
    if (!ver) throw new Error('Chrome no abrió el puerto de depuración');
    const t = await (await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const pend = {}; const ev = [];
    ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } else ev.forEach(h => h(m)); });
    await new Promise(r => ws.addEventListener('open', r));
    const send = (method, params = {}) => new Promise((ok, mal) => { const i = ++id; pend[i] = m => m.error ? mal(new Error(m.error.message)) : ok(m.result); ws.send(JSON.stringify({ id: i, method, params })); });
    const cargado = () => new Promise(r => { const h = m => { if (m.method === 'Page.loadEventFired') { ev.splice(ev.indexOf(h), 1); r(); } }; ev.push(h); });
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await fn({ send, cargado });
    ws.close();
  } finally { ch.kill(); await new Promise(r => setTimeout(r, 400)); try { rmSync(perfil, { recursive: true, force: true }); } catch {} }
}

const args = process.argv.slice(2);
const solo = args.includes('--solo') ? args[args.indexOf('--solo') + 1].split(',') : null;
const lista = IMAGENES.filter(i => !solo || solo.includes(i.slug));
const tmp = mkdtempSync(join(tmpdir(), 'og-html-'));

if (!args.includes('--solo-metas')) await conCDP(async ({ send, cargado }) => {   // --solo-metas: no regenera, solo --aplicar
  for (const i of lista) {
    const f = join(tmp, i.slug + '.html'); writeFileSync(f, plantilla(i));
    let ok = false;
    for (let intento = 1; intento <= 3 && !ok; intento++) {   // la foto viene de Supabase: un fallo de red se reintenta
      const listo = cargado(); await send('Page.navigate', { url: pathToFileURL(f).href }); await listo;
      const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression:
        `document.fonts.ready.then(() => Promise.all([...document.images].map(m => m.decode().then(() => m.naturalWidth).catch(() => 0))))` });
      ok = r.result.value.every(Boolean);
    }
    if (!ok) throw new Error('No cargó la foto de ' + i.slug);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
    writeFileSync(join(ROOT, 'assets', `og-${i.slug}.jpg`), Buffer.from(shot.data, 'base64'));
    console.log('✓ assets/og-' + i.slug + '.jpg');
  }
});
rmSync(tmp, { recursive: true, force: true });

// Tamaño (WhatsApp arma la vista previa sin descargar la imagen primero) y tarjeta grande de X, si faltan.
function completarMetas(t, url) {
  const m = t.match(/^([ \t]*)<meta\b[^>]*\bproperty="og:image"[^>]*>/m); if (!m) return t;
  const eol = t.includes('\r\n') ? '\r\n' : '\n', extra = [];
  if (!/property="og:image:width"/.test(t)) extra.push('<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">');
  if (!/name="twitter:card"/.test(t)) extra.push('<meta name="twitter:card" content="summary_large_image">');
  if (!/name="twitter:image"/.test(t)) extra.push(`<meta name="twitter:image" content="${url}">`);
  return extra.length ? t.replace(m[0], m[0] + extra.map(e => eol + m[1] + e).join('')) : t;
}

if (args.includes('--aplicar')) {
  for (const i of lista) for (const p of i.paginas) {
    const f = join(ROOT, p + '.html'); let t = readFileSync(f, 'utf8'); const antes = t;
    const url = `https://alejandrocadcam.com/assets/og-${i.slug}.jpg`;
    t = t.replace(/(<meta\b[^>]*\bproperty="og:image"[^>]*\bcontent=")[^"]+(")/, `$1${url}$2`).replace(/(<meta\b[^>]*\bname="twitter:image"[^>]*\bcontent=")[^"]+(")/, `$1${url}$2`);
    t = completarMetas(t, url);
    if (t !== antes) { writeFileSync(f, t); console.log('  → ' + p + '.html'); } else console.log('  = ' + p + '.html (sin cambio)');
  }
}
