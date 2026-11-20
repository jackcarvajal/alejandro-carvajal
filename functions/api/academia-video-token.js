/**
 * POST /api/academia-video-token   Authorization: Bearer <JWT de la sesión de Supabase>
 *   { leccion: <uuid> }                     → { url, expira, vigencia_seg }   enlace firmado (~2 h) al VIDEO de la clase
 *   { leccion: <uuid>, recurso: <n.º> }     → { url, expira, vigencia_seg }   enlace firmado para DESCARGAR el recurso n
 *   { comprobar: ["clave/en/r2.mp4", …] }   → { archivos: { clave: { existe, bytes } } }   solo admin (revisa nombres en R2)
 *
 *   · El usuario se verifica en el servidor (GET /auth/v1/user con el JWT); nada se toma del navegador.
 *   · Con service_role se exige inscripción ACTIVA en el curso de la clase; las clases «es_muestra» de un curso
 *     publicado bastan con sesión iniciada. El administrador (lista fija de correos) puede ver todo para revisar.
 *     Los recursos piden exactamente la misma verificación que el video.
 *   · Límite: 120 enlaces por hora por usuario y 300 por IP.
 * Env / bindings: ACADEMIA_VIDEOS (R2), ACADEMIA_VIDEO_SECRET, SUPABASE_SERVICE_KEY (+ SUPABASE_URL opcional).
 * Tablas: sql/academia-cursos-2026.sql (repo PRODIGY). Si aún no se corrió: 503 con codigo «sql_pendiente».
 */
import { cors, cfg, adminH, usuarioDe, limite, ADMIN_EMAILS, NEGOCIO } from './reportar-problema.js';
import { urlFirmada, VIGENCIA_SEG } from './academia-video.js';

const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KEY_RE = /^(?!\/)(?!.*\.\.)[^\u0000-\u001f]{1,300}$/;
const json = (obj, status, h) => new Response(JSON.stringify(obj), { status, headers: h });
const esAdmin = (user) => ADMIN_EMAILS.includes(String((user && user.email) || '').toLowerCase());

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: { ...cors(request.headers.get('Origin') || ''),
    'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
}

// Clase + curso (embebido por la FK). Devuelve { fila } o { pendiente:true } si las tablas no existen.
async function leerLeccion(c, id) {
  const r = await fetch(`${c.URL}/rest/v1/academia_lecciones?id=eq.${id}&select=id,curso_id,es_muestra,publicado,video_key,recursos,academia_cursos(publicado,negocio)&limit=1`,
    { headers: adminH(c.SERVICE) });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    if (r.status === 404 || /PGRST20[0-9]|42P01|42703|does not exist|schema cache/i.test(t)) return { pendiente: true };
    throw new Error('bd_leccion_' + r.status);
  }
  return { fila: (await r.json())[0] || null };
}

async function inscripcionActiva(c, curso, alumno) {
  const r = await fetch(`${c.URL}/rest/v1/academia_inscripciones?curso_id=eq.${curso}&alumno_id=eq.${alumno}&estado=eq.activa&select=id&limit=1`,
    { headers: adminH(c.SERVICE) });
  if (!r.ok) throw new Error('bd_inscripcion_' + r.status);
  return (await r.json()).length > 0;
}

// Solo admin: ¿existen estos archivos en R2 y cuánto pesan? (para no guardar un nombre mal escrito)
async function comprobarArchivos(env, claves, h) {
  const lista = [...new Set((Array.isArray(claves) ? claves : []).map((k) => String(k || '').trim()).filter(Boolean))].slice(0, 30);
  const archivos = {};
  for (const k of lista) {
    if (!KEY_RE.test(k)) { archivos[k] = { existe: false, error: 'nombre no válido' }; continue; }
    try { const m = await env.ACADEMIA_VIDEOS.head(k); archivos[k] = m ? { existe: true, bytes: m.size } : { existe: false }; }
    catch (_) { archivos[k] = { existe: false, error: 'no se pudo revisar' }; }
  }
  return json({ archivos }, 200, h);
}

export async function onRequestPost({ request, env }) {
  const h = { ...cors(request.headers.get('Origin') || ''), 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  if (!env.ACADEMIA_VIDEOS || !env.ACADEMIA_VIDEO_SECRET) return json({ error: 'Videos aún no configurados', codigo: 'sin_configurar' }, 503, h);
  const c = cfg(env);
  if (!c.SERVICE) return json({ error: 'Videos aún no configurados', codigo: 'sin_configurar' }, 503, h);

  const ip = request.headers.get('CF-Connecting-IP') || 'sin-ip';
  if (!(await limite(ip, 'acad-token-ip', 300))) return json({ error: 'Demasiadas solicitudes. Espera unos minutos.' }, 429, h);

  let body = {};
  try { body = (await request.json()) || {}; } catch (_) { /* cuerpo vacío o no JSON */ }

  const user = await usuarioDe(request, c);
  if (!user || !user.id) return json({ error: 'Inicia sesión para ver la clase.', codigo: 'sin_sesion' }, 401, h);

  if (body.comprobar !== undefined) {
    if (!esAdmin(user)) return json({ error: 'No autorizado' }, 403, h);
    return comprobarArchivos(env, body.comprobar, h);
  }

  const leccion = String(body.leccion || '').trim().toLowerCase();
  if (!ID_RE.test(leccion)) return json({ error: 'Clase no válida' }, 400, h);
  const pideRecurso = body.recurso !== undefined && body.recurso !== null;
  if (pideRecurso && !(Number.isInteger(body.recurso) && body.recurso >= 0 && body.recurso < 100)) return json({ error: 'Recurso no válido' }, 400, h);
  if (!(await limite(user.id, 'acad-token', 120))) return json({ error: 'Demasiadas solicitudes. Espera unos minutos.' }, 429, h);

  let lec;
  try {
    const r = await leerLeccion(c, leccion);
    if (r.pendiente) return json({ error: 'La academia aún no está activada', codigo: 'sql_pendiente' }, 503, h);
    lec = r.fila;
  } catch (e) {
    console.error('[academia-video-token]', e.message);
    return json({ error: 'No se pudo validar la clase' }, 502, h);
  }
  const curso = lec && lec.academia_cursos;
  if (!lec || !lec.publicado || !curso || curso.negocio !== NEGOCIO) return json({ error: 'Clase no encontrada' }, 404, h);
  if (pideRecurso) {
    const rec = Array.isArray(lec.recursos) ? lec.recursos[body.recurso] : null;
    if (!rec || !rec.key) return json({ error: 'Recurso no encontrado', codigo: 'sin_recurso' }, 404, h);
  } else if (!lec.video_key) {
    return json({ error: 'Esta clase todavía no tiene video.', codigo: 'sin_video' }, 409, h);
  }

  let permitido = esAdmin(user);
  if (!permitido && lec.es_muestra && curso.publicado) permitido = true;
  if (!permitido) {
    try { permitido = await inscripcionActiva(c, lec.curso_id, user.id); }
    catch (e) { console.error('[academia-video-token]', e.message); return json({ error: 'No se pudo validar tu inscripción' }, 502, h); }
  }
  if (!permitido) return json({ error: 'Esta clase es solo para alumnos inscritos en el curso.', codigo: 'no_inscrito' }, 403, h);

  const { url, expira } = await urlFirmada(env.ACADEMIA_VIDEO_SECRET, leccion, undefined, pideRecurso ? body.recurso : null);
  return json({ url, expira, vigencia_seg: VIGENCIA_SEG }, 200, h);
}
