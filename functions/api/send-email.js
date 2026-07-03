/**
 * Cloudflare Pages Function — Envío de emails via Resend
 * Variables de entorno requeridas en Cloudflare Dashboard:
 *   RESEND_API_KEY = re_xxxxxxxxx (de resend.com)
 *   FROM_EMAIL     = Alejandro Carvajal <alejandro@alejandrocadcam.pages.dev>
 *
 * Endpoint: POST /api/send-email
 * Body: { to, subject, html }
 */
function corsHeaders(origin) {
  const allowed = ['https://alejandrocadcam.pages.dev'];
  const o = allowed.includes(origin) || (origin||'').endsWith('.pages.dev') ? origin : 'https://alejandrocadcam.pages.dev';
  return {
    'Access-Control-Allow-Origin':  o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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
  if (secret !== env.CRON_SECRET && admin !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: CORS });
  }

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

  // Validar API key configurada
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY no configurada en Cloudflare' }), { status: 500, headers: CORS });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), { status: 400, headers: CORS });
  }

  const { to, subject, html } = body;
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
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  const h = corsHeaders(origin);
  delete h['Content-Type'];
  return new Response(null, { status: 204, headers: h });
}
