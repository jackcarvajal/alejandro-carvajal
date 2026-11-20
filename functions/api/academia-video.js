/**
 * GET|HEAD /api/academia-video?l=<id de la clase>&e=<vence, unix seg>&s=<firma>          → video de la clase
 * GET|HEAD /api/academia-video?l=<id de la clase>&r=<n.º de recurso>&e=…&s=…             → recurso (STL, RAR…) como descarga
 * Sirve los archivos de «Mi academia» desde el bucket R2 PRIVADO academia-videos.
 *
 * El enlace firmado lo entrega /api/academia-video-token SOLO a un alumno con inscripción activa (o para una
 * clase de muestra). Aquí no hay sesión: basta la firma HMAC-SHA256 (env.ACADEMIA_VIDEO_SECRET), que cubre la
 * clase, el recurso y el vencimiento (~2 h). El nombre del archivo en R2 (video_key / recursos[].key) se lee con
 * service_role: el navegador nunca lo conoce.
 *
 * Soporta HTTP Range (206 + Content-Range) para que el reproductor pueda adelantar sin bajar todo el archivo.
 * Env / bindings: ACADEMIA_VIDEOS (R2), ACADEMIA_VIDEO_SECRET, SUPABASE_SERVICE_KEY (+ SUPABASE_URL opcional).
 * Si falta el binding o el secreto responde 503 «Videos aún no configurados».
 * Tablas: sql/academia-cursos-2026.sql (repo PRODIGY).
 */
import { cfg, adminH } from './reportar-problema.js';

export const VIGENCIA_SEG = 2 * 3600;                 // vida del enlace firmado
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FIRMA_RE = /^[0-9a-f]{64}$/;
const enc = (t) => new TextEncoder().encode(t);
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const ahora = () => Math.floor(Date.now() / 1000);
// n.º de recurso: null (= el video) o 0..99. Una «r» vacía o rara NO cuenta como video: se rechaza.
const idxValido = (r) => r === null || r === undefined || (typeof r === 'number' ? Number.isInteger(r) && r >= 0 && r < 100 : /^\d{1,2}$/.test(String(r)));
const normIdx = (r) => (r === null || r === undefined ? null : Number(r));

/* ── Firma ─────────────────────────────────────────────────────────────
   Mensaje: «academia-video:<clase>:<vence>» para el video y «academia-video:<clase>:r<n>:<vence>» para el
   recurso n: una firma de video no sirve para bajar un recurso, ni la de un recurso para otro. */
export async function firmaVideo(secret, leccion, exp, recurso = null) {
  const k = await crypto.subtle.importKey('raw', enc(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const r = normIdx(recurso);
  return hex(await crypto.subtle.sign('HMAC', k, enc('academia-video:' + String(leccion).toLowerCase() + ':' + (r === null ? '' : 'r' + r + ':') + exp)));
}

export async function urlFirmada(secret, leccion, t = ahora(), recurso = null) {
  const e = t + VIGENCIA_SEG, r = normIdx(recurso);
  const s = await firmaVideo(secret, leccion, e, r);
  return { url: `/api/academia-video?l=${encodeURIComponent(leccion)}${r === null ? '' : '&r=' + r}&e=${e}&s=${s}`, expira: e };
}

// true solo si la firma coincide (comparación en tiempo constante) y el enlace sigue vigente.
export async function firmaValida(secret, leccion, exp, firma, t = ahora(), recurso = null) {
  if (!secret || !ID_RE.test(String(leccion || '')) || !/^\d{9,11}$/.test(String(exp || '')) || !FIRMA_RE.test(String(firma || '')) || !idxValido(recurso)) return false;
  const e = Number(exp);
  if (e <= t || e > t + VIGENCIA_SEG + 300) return false;          // vencido, o con una vigencia que nunca firmamos
  const ok = await firmaVideo(secret, leccion, e, recurso);
  let d = 0;
  for (let i = 0; i < ok.length; i++) d |= ok.charCodeAt(i) ^ firma.charCodeAt(i);
  return d === 0;
}

/* ── Range ───────────────────────────────────────────────────────────────
   null       → sin Range válido: se responde el archivo completo (200), como permite RFC 9110.
   'invalido' → rango imposible para este tamaño: 416.
   {start,end} → bytes inclusivos a servir (206). Varios rangos («0-1,5-6») se ignoran (200). */
export function leerRango(cabecera, size) {
  if (!cabecera) return null;
  const m = /^bytes=(\d*)-(\d*)$/i.exec(String(cabecera).trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  if (m[1] === '') {                                               // «bytes=-500» = los últimos 500
    const n = Number(m[2]);
    if (!n || !size) return 'invalido';
    return { start: Math.max(0, size - n), end: size - 1 };
  }
  const start = Number(m[1]);
  if (m[2] !== '' && Number(m[2]) < start) return null;            // sintaxis inválida → se ignora
  if (start >= size) return 'invalido';
  const end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  return { start, end };
}

/* ── Tipo y nombre de descarga de un recurso ── */
const TIPOS = { stl: 'model/stl', obj: 'model/obj', ply: 'application/octet-stream', zip: 'application/zip', rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed', pdf: 'application/pdf', dcm: 'application/dicom', xml: 'application/xml', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
export function tipoArchivo(nombre) {
  const ext = (/\.([a-z0-9]{1,5})$/i.exec(String(nombre || '')) || [])[1];
  return TIPOS[String(ext || '').toLowerCase()] || 'application/octet-stream';
}
// Content-Disposition seguro: nombre ASCII sin comillas ni rutas + filename* en UTF-8 (RFC 6266).
export function disposicion(nombre) {
  const limpio = String(nombre || 'archivo').replace(/^.*[\\/]/, '').replace(/[\u0000-\u001f"\\]/g, '').slice(0, 120) || 'archivo';
  const ascii = limpio.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7e]/g, '_');
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(limpio)}`;
}

/* ── Archivos de la clase (service_role; memoria de 10 min por instancia) ── */
const _clases = new Map();
async function archivosDe(c, leccion) {
  const hit = _clases.get(leccion);
  if (hit && Date.now() - hit.t < 10 * 60e3) return hit.v;
  const r = await fetch(`${c.URL}/rest/v1/academia_lecciones?id=eq.${leccion}&select=video_key,recursos,publicado&limit=1`, { headers: adminH(c.SERVICE) });
  if (!r.ok) throw new Error('bd_' + r.status);
  const fila = (await r.json())[0];
  const v = fila && fila.publicado ? { video: fila.video_key ? String(fila.video_key) : null, recursos: Array.isArray(fila.recursos) ? fila.recursos : [] } : null;
  if (v) { if (_clases.size > 500) _clases.clear(); _clases.set(leccion, { v, t: Date.now() }); }
  return v;
}

const BASE = { 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin' };
const error = (msg, status, extra) => new Response(JSON.stringify({ error: msg }), {
  status, headers: { ...BASE, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...(extra || {}) },
});

async function servir({ request, env }, conCuerpo) {
  const bucket = env.ACADEMIA_VIDEOS;
  if (!bucket || !env.ACADEMIA_VIDEO_SECRET) return error('Videos aún no configurados', 503);
  const q = new URL(request.url).searchParams;
  const l = String(q.get('l') || '').toLowerCase();
  const rIdx = q.has('r') ? q.get('r') : null;
  if (!(await firmaValida(env.ACADEMIA_VIDEO_SECRET, l, q.get('e'), q.get('s'), ahora(), rIdx))) {
    return error('El enlace venció o no es válido. Recarga la clase.', 403);
  }
  const c = cfg(env);
  if (!c.SERVICE) return error('Videos aún no configurados', 503);
  let arch;
  try { arch = await archivosDe(c, l); } catch (e) { console.error('[academia-video]', e.message); return error('No se pudo leer la clase', 502); }
  if (!arch) return error('Clase no encontrada', 404);

  const recurso = rIdx === null ? null : arch.recursos[Number(rIdx)];
  const key = rIdx === null ? arch.video : (recurso && recurso.key ? String(recurso.key) : null);
  if (!key) return error(rIdx === null ? 'Esta clase no tiene video' : 'Recurso no encontrado', 404);

  const meta = await bucket.head(key);
  if (!meta) return error('No se encontró el archivo en el almacenamiento', 404);
  const size = meta.size;
  const r = leerRango(request.headers.get('Range'), size);
  const ct = (meta.httpMetadata && meta.httpMetadata.contentType) || '';
  const h = { ...BASE, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=3600' };
  if (rIdx === null) {
    h['Content-Type'] = /^video\//.test(ct) ? ct : 'video/mp4';
    h['Content-Disposition'] = 'inline';
  } else {
    h['Content-Type'] = tipoArchivo(recurso.nombre || key);
    h['Content-Disposition'] = disposicion(recurso.nombre || key.replace(/^.*\//, ''));
  }
  if (meta.httpEtag) h.ETag = meta.httpEtag;
  if (r === 'invalido') return error('Rango no válido', 416, { 'Content-Range': `bytes */${size}`, 'Accept-Ranges': 'bytes' });

  if (r) {
    h['Content-Range'] = `bytes ${r.start}-${r.end}/${size}`;
    h['Content-Length'] = String(r.end - r.start + 1);
  } else {
    h['Content-Length'] = String(size);
  }
  if (!conCuerpo) return new Response(null, { status: r ? 206 : 200, headers: h });
  const obj = r ? await bucket.get(key, { range: { offset: r.start, length: r.end - r.start + 1 } }) : await bucket.get(key);
  if (!obj) return error('No se encontró el archivo en el almacenamiento', 404);
  return new Response(obj.body, { status: r ? 206 : 200, headers: h });
}

export const onRequestGet = (ctx) => servir(ctx, true);
export const onRequestHead = (ctx) => servir(ctx, false);
