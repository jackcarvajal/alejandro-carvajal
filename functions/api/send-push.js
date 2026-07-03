/**
 * Cloudflare Pages Function — Envío de Web Push via OneSignal
 * Variables de entorno requeridas:
 *   ONESIGNAL_APP_ID   = abc123-...
 *   ONESIGNAL_API_KEY  = REST API Key de OneSignal
 */
function corsHeaders(origin) {
  const allowed = ['https://alejandrocadcam.pages.dev'];
  const o = allowed.includes(origin) || (origin||'').endsWith('.pages.dev') ? origin : 'https://alejandrocadcam.pages.dev';
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const CORS = corsHeaders(origin);

  // Auth — solo desde CRON o admin interno. Antes este endpoint no exigia
  // NADA: cualquiera podia hacer POST /api/send-push sin externalUserId y
  // disparar un broadcast (included_segments=['All']) a TODOS los
  // suscriptores push con titulo/mensaje arbitrario — vector real de
  // spam/phishing. PRODIGY ya exigia este mismo gate (functions/api/send-push.js).
  const secret = request.headers.get('x-cron-secret');
  const admin  = request.headers.get('x-admin-token');
  if (secret !== env.CRON_SECRET && admin !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: CORS });
  }

  // Rate limit: 10 notificaciones / 10 min por IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const cache = caches.default;
  const rlKey = new Request('https://rl.internal/send-push_' + ip);
  const rlHit = await cache.match(rlKey);
  if (rlHit) {
    const count = parseInt(await rlHit.text(), 10) || 0;
    if (count >= 10) {
      return new Response(JSON.stringify({ error: 'Demasiadas solicitudes.' }), { status: 429, headers: CORS });
    }
    await cache.put(rlKey, new Response(String(count + 1), { headers: { 'Cache-Control': 'max-age=600' } }));
  } else {
    await cache.put(rlKey, new Response('1', { headers: { 'Cache-Control': 'max-age=600' } }));
  }

  if (!env.ONESIGNAL_APP_ID || !env.ONESIGNAL_API_KEY) {
    return new Response(JSON.stringify({ error: 'OneSignal no configurado' }), { status: 500, headers: CORS });
  }

  let parsed;
  try { parsed = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), { status: 400, headers: CORS });
  }
  const { titulo, mensaje, url: rawUrl, externalUserId } = parsed;

  if (!titulo || !mensaje) {
    return new Response(JSON.stringify({ error: 'Faltan campos: titulo, mensaje' }), { status: 400, headers: CORS });
  }

  // Validar URL de destino — solo dominio propio
  const _own = /^https:\/\/alejandrocadcam\.pages\.dev\//;
  const url = rawUrl && _own.test(rawUrl) ? rawUrl : 'https://alejandrocadcam.pages.dev/app/client-panel';

  const body = {
    app_id: env.ONESIGNAL_APP_ID,
    headings: { en: String(titulo).slice(0, 100), es: String(titulo).slice(0, 100) },
    contents:  { en: String(mensaje).slice(0, 200), es: String(mensaje).slice(0, 200) },
    url,
    chrome_web_icon: 'https://alejandrocadcam.pages.dev/assets/icon-192.png'
  };

  // Si hay userId específico, enviar solo a ese usuario
  if (externalUserId) {
    body.include_aliases = { external_id: [String(externalUserId).slice(0, 100)] };
    body.target_channel = 'push';
  } else {
    // Broadcast a todos (solo para pruebas)
    body.included_segments = ['All'];
  }

  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${env.ONESIGNAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.ok ? 200 : 500, headers: CORS });
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  const h = corsHeaders(origin);
  delete h['Content-Type'];
  return new Response(null, { status: 204, headers: h });
}
