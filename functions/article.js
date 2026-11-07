/**
 * Cloudflare Pages Function — /article?id=XXX
 *
 * PROBLEMA SEO QUE RESUELVE:
 *   article.html arma el contenido con JavaScript (lee ARTICLES_AC de
 *   /articles-ac.js en el navegador). En el HTML ESTÁTICO que ve Googlebot en su
 *   primera pasada, el <link rel="canonical"> apunta a /article (genérico) para
 *   TODOS los artículos, y el JS lo corrige solo si Google re-renderiza →
 *   Search Console los marca como "Página alternativa con canónica adecuada" y
 *   no los indexa.
 *
 * QUÉ HACE:
 *   Intercepta /article, sirve el article.html estático (next()) y con
 *   HTMLRewriter inyecta del lado del SERVIDOR el canonical/og:url correctos
 *   (self-URL, sin depender de datos) y —best-effort desde /articles-ac.js— el
 *   título/descripción/imagen reales. El JS del cliente queda igual.
 *
 * Gemelo del functions/article.js de PRODIGY (Ley de Oro de paridad).
 */

const DOMINIO = 'https://alejandrocadcam.com';
const SUFIJO = ' | Alejandro Carvajal CAD/CAM';
const DATA = '/articles-ac.js';

class PonerAttr {
  constructor(attr, valor) { this.attr = attr; this.valor = valor; }
  element(el) { el.setAttribute(this.attr, this.valor); }
}
class PonerTexto {
  constructor(texto) { this.texto = texto; }
  element(el) { el.setInnerContent(this.texto); }
}
class Quitar {
  element(el) { el.remove(); }
}

function extraerMeta(txt, id) {
  const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp('"id"\\s*:\\s*"' + esc + '"').exec(txt);
  if (!m) return null;
  const slice = txt.slice(m.index, m.index + 4000); // dentro del objeto del artículo
  const campo = (n) => {
    const r = new RegExp('"' + n + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"').exec(slice);
    return r ? r[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\\\\/g, '\\') : null;
  };
  return { titulo: campo('titulo'), subtitulo: campo('subtitulo'), og_img: campo('og_img') };
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const res = await next();                       // sirve el article.html estático
  const ct = res.headers.get('content-type') || '';
  if (!id || !ct.includes('text/html')) return res;

  const selfUrl = DOMINIO + '/article?id=' + encodeURIComponent(id);

  let meta = null;
  try {
    const aRes = await fetch(url.origin + DATA, { cf: { cacheTtl: 1800, cacheEverything: true } });
    if (aRes.ok) meta = extraerMeta(await aRes.text(), id);
  } catch (_) { /* el canonical se corrige igual */ }

  // El canonical SIEMPRE se corrige (no depende de los datos)
  let rw = new HTMLRewriter()
    .on('link#canonical', new PonerAttr('href', selfUrl))
    .on('meta#og-url', new PonerAttr('content', selfUrl))
    // hreflang: es/x-default al self; el 'en' es fantasma (no hay artículos en inglés) → se quita
    .on('link[hreflang="es"]', new PonerAttr('href', selfUrl))
    .on('link[hreflang="x-default"]', new PonerAttr('href', selfUrl))
    .on('link[hreflang="en"]', new Quitar());

  if (meta && meta.titulo) {
    rw = rw
      .on('title', new PonerTexto(meta.titulo + SUFIJO))   // en Alejandro <title> lleva id=meta-title
      .on('meta#og-title', new PonerAttr('content', meta.titulo))
      .on('meta#tw-title', new PonerAttr('content', meta.titulo));
  }
  if (meta && meta.subtitulo) {
    rw = rw
      .on('meta#meta-desc', new PonerAttr('content', meta.subtitulo))
      .on('meta#og-desc', new PonerAttr('content', meta.subtitulo))
      .on('meta#tw-desc', new PonerAttr('content', meta.subtitulo));
  }
  if (meta && meta.og_img) {
    const img = meta.og_img.startsWith('http') ? meta.og_img : DOMINIO + meta.og_img;
    rw = rw
      .on('meta#og-image', new PonerAttr('content', img))
      .on('meta#tw-image', new PonerAttr('content', img));
  }

  return rw.transform(res);
}
