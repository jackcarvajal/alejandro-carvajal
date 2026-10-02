/**
 * Cloudflare Pages Function — Envío de emails via Resend
 * Variables de entorno requeridas en Cloudflare Dashboard:
 *   RESEND_API_KEY = re_xxxxxxxxx (de resend.com)
 *   FROM_EMAIL     = Alejandro Carvajal <alejandro@alejandrocadcam.com>
 *
 * Endpoint: POST /api/send-email
 * Body: { to, subject, html, codigo? }
 *
 * Quién puede enviar (paridad con PRODIGY, 1-oct-2026). Antes solo pasaba con CRON_SECRET/ADMIN_SECRET y el
 * navegador nunca los manda (ni debe: serían públicos) → ningún correo salía.
 *  · cron / admin interno (cabecera secreta) → libre
 *  · admin con sesión (correo de la lista fija o rol admin de app_metadata) → a cualquier doctor
 *  · cliente con sesión → solo a su propio correo
 *  · sin sesión → solo la confirmación de un pedido recién creado (código de los últimos 15 min), con el texto
 *    armado aquí (no se acepta HTML del navegador) y una sola vez por pedido
 */
import { cfg, adminH, usuarioDe, ADMIN_EMAILS } from './reportar-problema.js';
const escH = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function corsHeaders(origin) {
  const allowed = ['https://alejandrocadcam.com'];
  const o = allowed.includes(origin) || /^https:\/\/([a-z0-9-]+\.)?alejandrocadcam\.pages\.dev$/.test(origin || '') ? origin : 'https://alejandrocadcam.com';
  return {
    'Access-Control-Allow-Origin':  o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const CORS = corsHeaders(origin);

  // Auth — solo desde CRON o admin interno. Antes este endpoint aceptaba
  // `html` arbitrario del cliente SIN NINGUNA autenticacion — relay de
  // email abierto: cualquiera podia enviar phishing/spam con cualquier
  // contenido usando el dominio y la cuota de Resend de Alejandro, a
  // cualquier destinatario. PRODIGY ya generaba el HTML solo server-side
  // desde plantillas por este mismo motivo (functions/api/send-email.js).
  const secret = request.headers.get('x-cron-secret');
  const admin  = request.headers.get('x-admin-token');
  const secretoOk = (!!env.CRON_SECRET && secret === env.CRON_SECRET) || (!!env.ADMIN_SECRET && admin === env.ADMIN_SECRET);

  // Rate limit: 5 emails / 10 min por IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const cache = caches.default;
  const rlKey = new Request('https://rl.internal/send-email_' + ip);
  const rlHit = await cache.match(rlKey);
  if (rlHit) {
    const count = parseInt(await rlHit.text(), 10) || 0;
    if (count >= 5) {
      return new Response(JSON.stringify({ error: 'Demasiadas solicitudes. Intenta más tarde.' }), { status: 429, headers: CORS });
    }
    await cache.put(rlKey, new Response(String(count + 1), { headers: { 'Cache-Control': 'max-age=600' } }));
  } else {
    await cache.put(rlKey, new Response('1', { headers: { 'Cache-Control': 'max-age=600' } }));
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), { status: 400, headers: CORS });
  }

  let { to, subject, html } = body;
  if (!secretoOk) {
    const c = cfg(env);
    const yo = c.SERVICE ? await usuarioDe(request, c) : null;
    const correoYo = String(yo?.email || '').toLowerCase();
    const roles = [].concat(yo?.app_metadata?.roles || [], yo?.app_metadata?.role || []);
    const esAdmin = !!yo && (ADMIN_EMAILS.includes(correoYo) || roles.includes('admin'));
    if (!esAdmin) {
      if (yo) {
        if (String(to || '').toLowerCase() !== correoYo) return new Response(JSON.stringify({ error: 'Solo puedes enviarte correos a ti mismo.' }), { status: 403, headers: CORS });
      } else {
        const codigo = String(body.codigo || '').trim();
        if (!codigo || !c.SERVICE) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: CORS });
        const desde = new Date(Date.now() - 15 * 60000).toISOString();
        const r = await fetch(`${c.URL}/rest/v1/pedidos?codigo=eq.${encodeURIComponent(codigo)}&negocio=eq.alejandrocadcam&created_at=gte.${encodeURIComponent(desde)}&select=id&limit=1`, { headers: adminH(c.SERVICE) }).catch(() => null);
        const hay = r && r.ok ? (await r.json()).length > 0 : false;
        const una = new Request('https://rl.internal/acad-confirmacion_' + codigo);
        if (!hay || await caches.default.match(una)) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403, headers: CORS });
        await caches.default.put(una, new Response('1', { headers: { 'Cache-Control': 'max-age=86400' } }));
        subject = `✅ Caso recibido #${codigo} — Alejandro CAD/CAM`;
        html = `<div style="font-family:Arial,sans-serif;background:#050505;color:#e2e8f0;padding:28px"><div style="max-width:560px;margin:0 auto">
          <p style="color:#D4AF37;font-weight:900;letter-spacing:2px">ALEJANDRO CAD/CAM</p><h2>¡Recibimos tu caso de diseño CAD!</h2>
          <p>Tu orden <strong>${escH(codigo)}</strong> fue creada. Verificamos el pago y empezamos.</p>
          <p>Sigue tu caso en <a style="color:#00d2ff" href="https://alejandrocadcam.com/seguimiento-caso">alejandrocadcam.com/seguimiento-caso</a>.</p></div></div>`;
      }
    }
  }
  // Primero quién pide (arriba); después si el servicio de correo está configurado
  // Validar API key configurada
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY no configurada en Cloudflare' }), { status: 500, headers: CORS });
  }

  if (!to || !subject || !html) {
    return new Response(JSON.stringify({ error: 'Faltan campos: to, subject, html' }), { status: 400, headers: CORS });
  }

  // Validar email destino
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || to.length > 254) {
    return new Response(JSON.stringify({ error: 'Email destino inválido' }), { status: 400, headers: CORS });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || 'Alejandro Carvajal CAD/CAM <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
        reply_to: 'jackalejandroc@gmail.com'
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error Resend');

    return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 200, headers: CORS });
  } catch (e) {
    console.error('[send-email]', e);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500, headers: CORS });
  }
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  const h = corsHeaders(origin);
  delete h['Content-Type'];
  return new Response(null, { status: 204, headers: h });
}
