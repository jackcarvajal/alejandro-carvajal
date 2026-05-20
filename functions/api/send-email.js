/**
 * Cloudflare Pages Function — Envío de emails via Resend
 * Variables de entorno requeridas en Cloudflare Dashboard:
 *   RESEND_API_KEY = re_xxxxxxxxx (de resend.com)
 *   FROM_EMAIL     = Alejandro Carvajal <alejandro@alejandrocadcam.pages.dev>
 *
 * Endpoint: POST /api/send-email
 * Body: { to, subject, html }
 */
export async function onRequestPost({ request, env }) {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

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

  // Validar email destino básico
  if (!to.includes('@') || to.length > 254) {
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
