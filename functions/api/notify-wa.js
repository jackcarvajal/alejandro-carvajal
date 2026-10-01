/**
 * Cloudflare Pages Function — WhatsApp al doctor según el estado del caso (Alejandro CAD/CAM)
 * POST /api/notify-wa
 * Gemelo de PRODIGY (functions/api/notify-wa.js) con los mensajes de un servicio de SOLO DISEÑO.
 * Lo usa la Bandeja de WhatsApp (app/bandeja-whatsapp.html) para armar el texto de cada aviso.
 *
 *  1. OFICIAL — WhatsApp Cloud API de Meta: si existen WA_TOKEN y WA_PHONE_ID (del número de Alejandro) y quien
 *     llama es el admin, se envía con plantillas aprobadas (acad_diseno_listo, acad_avance_caso,
 *     acad_reenviar_archivos, acad_caso_entregado) → { enviado:true }.
 *  2. MANUAL — devuelve wa_url (wa.me con el texto listo).
 * El enlace de seguimiento lleva la llave del caso solo si llama el admin (sesión verificada).
 * Body: { nuevo_estado, codigo, nombre_doctor, whatsapp, pais, servicio, fecha_entrega, solo_texto }
 */
import { cfg, adminH, usuarioDe, ADMIN_EMAILS } from './reportar-problema.js';

const WA_ALEJANDRO = '573219581949';
const SITIO = 'https://alejandrocadcam.com';

const MSGS_ES = {
  ERROR_STL:           (d) => `⚠️ *Caso #${d.cod} — Necesito tus archivos*\n\nHola Dr. ${d.dr}, los archivos de tu caso llegaron incompletos o con un problema. Reenvíalos para continuar.\n\n📍 Tu caso: ${d.link}\n\n_Alejandro CAD/CAM_`,
  EN_DISENO:           (d) => `🎨 *Caso #${d.cod} — Empecé tu diseño*\n\nHola Dr. ${d.dr}, ya estoy diseñando tu caso.\n\n📍 Síguelo aquí: ${d.link}\n\n_Alejandro CAD/CAM_`,
  REVISION_CLIENTE:    (d) => `✨ *Caso #${d.cod} — Tu diseño está listo*\n\nHola Dr. ${d.dr}, tu diseño está listo para revisar. Apruébalo o pide cambios (2 revisiones incluidas):\n\n👉 ${d.link}\n\n_Alejandro CAD/CAM_`,
  CAMBIOS_SOLICITADOS: (d) => `🔄 *Caso #${d.cod} — Aplicando tus cambios*\n\nHola Dr. ${d.dr}, recibí tus notas y ya estoy haciendo los ajustes.\n\n📍 ${d.link}\n\n_Alejandro CAD/CAM_`,
  ENTREGADO:           (d) => `🎉 *Caso #${d.cod} — Diseño entregado*\n\nHola Dr. ${d.dr}, tus archivos finales están listos para descargar en tu portal.\n\n📍 ${d.link}\n\n_¿Dudas? Escríbeme al +${WA_ALEJANDRO}_`,
};
const MSGS_EN = {
  ERROR_STL:           (d) => `⚠️ *Case #${d.cod} — I need your files*\n\nHello Dr. ${d.dr}, your case files arrived incomplete or with a problem. Please resend them to continue.\n\n📍 Your case: ${d.link}\n\n_Alejandro CAD/CAM_`,
  EN_DISENO:           (d) => `🎨 *Case #${d.cod} — Design started*\n\nHello Dr. ${d.dr}, I'm now designing your case.\n\n📍 Track it: ${d.link}\n\n_Alejandro CAD/CAM_`,
  REVISION_CLIENTE:    (d) => `✨ *Case #${d.cod} — Your design is ready*\n\nHello Dr. ${d.dr}, your design is ready for review. Approve it or request changes (2 revisions included):\n\n👉 ${d.link}\n\n_Alejandro CAD/CAM_`,
  CAMBIOS_SOLICITADOS: (d) => `🔄 *Case #${d.cod} — Applying your changes*\n\nHello Dr. ${d.dr}, I received your notes and I'm working on them.\n\n📍 ${d.link}\n\n_Alejandro CAD/CAM_`,
  ENTREGADO:           (d) => `🎉 *Case #${d.cod} — Design delivered*\n\nHello Dr. ${d.dr}, your final files are ready to download in your portal.\n\n📍 ${d.link}\n\n_Questions? Reach me at +${WA_ALEJANDRO}_`,
};
const ETAPA_ES = { EN_DISENO: 'empecé el diseño', CAMBIOS_SOLICITADOS: 'estoy aplicando sus cambios' };
const ETAPA_EN = { EN_DISENO: 'design has started', CAMBIOS_SOLICITADOS: 'I am applying your changes' };
function plantillaDe(estado, d, intl) {
  const ruta = u => String(u || '').replace(/^https:\/\/(www\.)?alejandrocadcam\.com\//, '');
  if (estado === 'REVISION_CLIENTE') return { name: 'acad_diseno_listo', body: [d.dr, d.cod], url: ruta(d.link) };
  if (estado === 'ERROR_STL') return { name: 'acad_reenviar_archivos', body: [d.dr, d.cod], url: ruta(d.link) };
  if (estado === 'ENTREGADO') return { name: 'acad_caso_entregado', body: [d.dr, d.cod], url: ruta(d.link) };
  const etapa = (intl ? ETAPA_EN : ETAPA_ES)[estado];
  return etapa ? { name: 'acad_avance_caso', body: [d.dr, d.cod, etapa], url: ruta(d.link) } : null;
}
async function enviarOficial(env, wa, p, intl) {
  const components = [{ type: 'body', parameters: p.body.map(t => ({ type: 'text', text: String(t).slice(0, 120) })) }];
  if (p.url) components.push({ type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: p.url }] });
  const r = await fetch(`https://graph.facebook.com/${env.WA_GRAPH_VERSION || 'v23.0'}/${env.WA_PHONE_ID}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${env.WA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: wa, type: 'template', template: { name: p.name, language: { code: intl ? 'en' : 'es' }, components } }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.ok && j.messages?.[0]?.id) return { ok: true, id: j.messages[0].id };
  console.error('[notify-wa] Cloud API:', r.status, j.error?.code, j.error?.message);
  return { ok: false };
}

// Solo el admin (por correo) usa la bandeja de Alejandro. Roles solo de app_metadata.
const esPersonal = u => !!u && (ADMIN_EMAILS.includes(String(u.email || '').toLowerCase())
  || [].concat(u.app_metadata?.roles || [], u.app_metadata?.role || []).includes('admin'));
const normalizarWA = n => { const d = String(n || '').replace(/\D/g, ''); return d.length === 10 && d.startsWith('3') ? '57' + d : d; };

function corsHeaders(origin) {
  const allowed = ['https://alejandrocadcam.com', 'https://www.alejandrocadcam.com'];
  const ok = allowed.includes(origin) || /^https:\/\/([a-z0-9-]+\.)?alejandrocadcam\.pages\.dev$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin':  ok ? origin : 'https://alejandrocadcam.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

export async function onRequestPost({ request, env }) {
  const cors = corsHeaders(request.headers.get('Origin') || '');
  const c = cfg(env);
  const yo = c.SERVICE ? await usuarioDe(request, c) : null;
  const personal = esPersonal(yo);
  // Rate limit por IP: 20 / 5 min sin sesión; 300 / 5 min para el admin (Bandeja de WhatsApp)
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rlKey = new Request('https://rl.internal/acad-notify-wa_' + ip);
  const hit = await caches.default.match(rlKey);
  const n = hit ? (parseInt(await hit.text(), 10) || 0) : 0;
  if (n >= (personal ? 300 : 20)) return new Response(JSON.stringify({ error: 'Demasiadas solicitudes.' }), { status: 429, headers: cors });
  await caches.default.put(rlKey, new Response(String(n + 1), { headers: { 'Cache-Control': 'max-age=300' } }));

  let body;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400, headers: cors }); }
  const { nuevo_estado, codigo, nombre_doctor, whatsapp, pais } = body;
  if (!whatsapp || !nuevo_estado) return new Response(JSON.stringify({ error: 'Faltan whatsapp y nuevo_estado' }), { status: 400, headers: cors });
  const esIntl = pais && pais !== 'CO';
  const fn = (esIntl ? MSGS_EN : MSGS_ES)[nuevo_estado];
  if (!fn) return new Response(JSON.stringify({ skipped: true, reason: 'Estado sin mensaje definido' }), { status: 200, headers: cors });

  const wa = normalizarWA(whatsapp);
  const dr = (nombre_doctor || '').split(' ')[0] || 'Doctor';
  const cod = codigo || '—';
  let link = `${SITIO}/app/client-panel`, pedidoId = null;
  if (personal && codigo) {
    try {
      const r = await fetch(`${c.URL}/rest/v1/pedidos?codigo=eq.${encodeURIComponent(codigo)}&negocio=eq.alejandrocadcam&select=id,hash_seguridad&limit=1`, { headers: adminH(c.SERVICE) });
      const [p] = r.ok ? await r.json() : [];
      if (p) { pedidoId = p.id; link = `${SITIO}/seguimiento-caso?id=${encodeURIComponent(codigo)}${p.hash_seguridad ? '&key=' + encodeURIComponent(p.hash_seguridad) : ''}`; }
    } catch (_) { /* queda el portal */ }
  }
  const d = { cod, dr, link };
  const mensaje = fn(d);
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(mensaje)}`;

  if (personal && env.WA_TOKEN && env.WA_PHONE_ID && !body.solo_texto) {
    const p = plantillaDe(nuevo_estado, d, esIntl);
    if (p) {
      const r = await enviarOficial(env, wa, p, esIntl).catch(() => ({ ok: false }));
      if (r.ok) {
        if (pedidoId) await fetch(`${c.URL}/rest/v1/avisos_whatsapp?pedido_id=eq.${pedidoId}&estado=eq.${encodeURIComponent(nuevo_estado)}&estado_envio=eq.pendiente`, {
          method: 'PATCH', headers: { ...adminH(c.SERVICE), Prefer: 'return=minimal' },
          body: JSON.stringify({ estado_envio: 'enviado', metodo: 'oficial', enviado_at: new Date().toISOString(), enviado_por: yo?.id || null }),
        }).catch(() => {});
        return new Response(JSON.stringify({ enviado: true, metodo: 'oficial', id: r.id, wa_url: waUrl, mensaje }), { status: 200, headers: cors });
      }
    }
  }
  return new Response(JSON.stringify({ enviado: false, metodo: 'wa_url', wa_url: waUrl, mensaje }), { status: 200, headers: cors });
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin') || '') });
}
