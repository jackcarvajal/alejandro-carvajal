/**
 * Cloudflare Pages Function — /curso?slug=XXX (página pública de un curso de la Academia)
 *
 * PROBLEMA SEO QUE RESUELVE (igual que functions/article.js):
 *   curso.html arma todo con JavaScript. En el HTML ESTÁTICO que ve Google en su primera pasada, el canonical
 *   apunta a /academia para TODOS los cursos y el título es genérico → los cursos no se indexarían como páginas
 *   propias y no habría ficha de curso (Course) para los resultados enriquecidos.
 *
 * QUÉ HACE: sirve curso.html (next()) y con HTMLRewriter pone del lado del SERVIDOR el título, la descripción,
 *   el canonical, las etiquetas og:* y el JSON-LD Course con los datos reales del curso publicado.
 *   El JS del cliente sigue pintando la página y no duplica el JSON-LD (lo omite si ya viene del servidor).
 *   · Sin slug (o con basura) → 301 a /academia.
 *   · Slug que no existe o no está publicado → la página dice «No encontramos este curso» + noindex.
 *   · Si la base no responde → se sirve la página tal cual (el cliente la arregla como antes).
 *
 * Lee con la anon key solo columnas públicas de cursos publicados (RLS de academia_cursos).
 * Ruta incluida en _routes.json ("/curso"). 20-nov-2026.
 */

const DOMINIO = 'https://alejandrocadcam.com';
const SB = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWhyd3FmeXZneWFwYnd6a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzczNDksImV4cCI6MjA5MDg1MzM0OX0.9CzmFDQYeQKcbtAZoT1_n_OuJ1qPVJu3jImd938T634';
const SUFIJO = ' | Academia Alejandro CAD/CAM';
const NIVEL = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' };   // = js/academia-publica.js

class PonerAttr { constructor(a, v) { this.a = a; this.v = v; } element(el) { el.setAttribute(this.a, this.v); } }
class PonerTexto { constructor(t) { this.t = t; } element(el) { el.setInnerContent(this.t); } }
class AgregarAlHead { constructor(h) { this.h = h; } element(el) { el.append(this.h, { html: true }); } }

// Misma regla que urlOk() de js/academia-publica.js: ruta propia o https
function urlOk(u) {
  u = String(u || '').trim();
  if (/^\/[^/\\]/.test(u)) return DOMINIO + u;
  try { const x = new URL(u); return x.protocol === 'https:' ? x.href : ''; } catch (_) { return ''; }
}
// Misma regla que precioPlano(): COP si está cargado, si no USD
function precioPlano(c) {
  if (Number(c.precio_cop) > 0) return { price: String(Math.round(Number(c.precio_cop))), currency: 'COP' };
  if (Number(c.precio_usd) > 0) return { price: String(Number(c.precio_usd)), currency: 'USD' };
  return null;
}

export async function onRequestGet(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const slug = (url.searchParams.get('slug') || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(slug)) return Response.redirect(DOMINIO + '/academia', 301);

  const res = await next();                                   // sirve curso.html
  if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return res;

  let C;
  try {
    const r = await fetch(SB + '/rest/v1/academia_cursos?select=slug,titulo,descripcion,nivel,software,instructor,portada_url,precio_cop,precio_usd'
      + '&slug=eq.' + encodeURIComponent(slug) + '&publicado=eq.true&negocio=eq.alejandrocadcam&limit=1',
      { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON }, cf: { cacheTtl: 300, cacheEverything: true } });
    if (!r.ok) return res;
    C = (await r.json())[0] || null;
  } catch (_) { return res; }

  if (!C) {   // no existe o no está publicado: que no se indexe la página de «no encontrado»
    const h = new Headers(res.headers); h.set('X-Robots-Tag', 'noindex');
    return new Response(res.body, { status: res.status, headers: h });
  }

  const self = DOMINIO + '/curso?slug=' + encodeURIComponent(C.slug);
  const titulo = String(C.titulo || 'Curso').trim();
  const desc = String(C.descripcion || '').replace(/\s+/g, ' ').trim().slice(0, 155) || 'Curso grabado de diseño dental digital con Alejandro Carvajal.';
  const img = urlOk(C.portada_url);

  const ld = { '@context': 'https://schema.org', '@type': 'Course', name: titulo, description: String(C.descripcion || titulo).slice(0, 500),
    inLanguage: 'es', url: self, provider: { '@type': 'Organization', name: 'Alejandro CAD/CAM', url: DOMINIO },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', instructor: { '@type': 'Person', name: C.instructor || 'Alejandro Carvajal' } } };
  if (img) ld.image = img;
  if (C.software) ld.about = C.software;
  if (NIVEL[C.nivel]) ld.educationalLevel = NIVEL[C.nivel];
  const p = precioPlano(C);
  if (p) ld.offers = { '@type': 'Offer', price: p.price, priceCurrency: p.currency, availability: 'https://schema.org/InStock', url: self, category: 'Paid' };
  const ldTxt = JSON.stringify(ld).replace(/</g, '\\u003c');

  let rw = new HTMLRewriter()
    .on('title', new PonerTexto(titulo + SUFIJO))
    .on('meta[name="description"]', new PonerAttr('content', desc))
    .on('link[rel="canonical"]', new PonerAttr('href', self))
    .on('meta[property="og:title"]', new PonerAttr('content', titulo + SUFIJO))
    .on('meta[property="og:description"]', new PonerAttr('content', desc))
    .on('meta[property="og:url"]', new PonerAttr('content', self))
    .on('head', new AgregarAlHead('<script type="application/ld+json" data-curso-ld>' + ldTxt + '</script>'));
  if (img) rw = rw.on('meta[property="og:image"]', new PonerAttr('content', img));
  return rw.transform(res);
}
