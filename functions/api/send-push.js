/**
 * Cloudflare Pages Function — Envío de Web Push via OneSignal
 * Variables de entorno requeridas:
 *   ONESIGNAL_APP_ID   = abc123-...
 *   ONESIGNAL_API_KEY  = REST API Key de OneSignal
 */
export async function onRequestPost({ request, env }) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (!env.ONESIGNAL_APP_ID || !env.ONESIGNAL_API_KEY) {
    return new Response(JSON.stringify({ error: 'OneSignal no configurado' }), { status: 500, headers: CORS });
  }

  const { titulo, mensaje, url, externalUserId } = await request.json();

  const body = {
    app_id: env.ONESIGNAL_APP_ID,
    headings: { en: titulo, es: titulo },
    contents:  { en: mensaje, es: mensaje },
    url: url || 'https://alejandrocadcam.pages.dev/app/client-panel',
    chrome_web_icon: 'https://alejandrocadcam.pages.dev/assets/icon-192.png'
  };

  // Si hay userId específico, enviar solo a ese usuario
  if (externalUserId) {
    body.include_aliases = { external_id: [externalUserId] };
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

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
