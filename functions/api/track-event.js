/**
 * Alejandro CAD/CAM — Track Event Analytics
 * POST /api/track-event
 * Body: { evento, pagina, negocio?, metadata? }
 *
 * Env vars: SUPABASE_SERVICE_KEY
 */

const SURL = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
const CORS_OK = ['https://alejandrocadcam.pages.dev'];

function cors(origin) {
  const ok = CORS_OK.includes(origin) || (origin||'').includes('.pages.dev') || !origin;
  return { 'Access-Control-Allow-Origin': ok ? origin||'*' : CORS_OK[0], 'Content-Type': 'application/json' };
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: { ...cors(request.headers.get('Origin')||''), 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const h = cors(origin);

  // Rate limit 60/min por IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rlKey = new Request('https://rl.internal/track-ac_' + ip);
  const hit = await caches.default.match(rlKey);
  if (hit) {
    const n = parseInt(await hit.text(), 10) || 0;
    if (n >= 60) return new Response('{}', { status: 429, headers: h });
    await caches.default.put(rlKey, new Response(String(n+1), { headers: { 'Cache-Control': 'max-age=60' } }));
  } else {
    await caches.default.put(rlKey, new Response('1', { headers: { 'Cache-Control': 'max-age=60' } }));
  }

  if (!env.SUPABASE_SERVICE_KEY) return new Response('{}', { status: 200, headers: h }); // silencioso

  let body;
  try { body = await request.json(); } catch { return new Response('{}', { status: 200, headers: h }); }

  const { evento, pagina, negocio = 'alejandrocadcam', metadata = {} } = body;
  if (!evento) return new Response('{}', { status: 200, headers: h });

  // Hash anónimo del IP
  const ipHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + Date.now().toString().slice(0,-5)))
    .then(b => Array.from(new Uint8Array(b)).slice(0,8).map(x=>x.toString(16).padStart(2,'0')).join(''));

  const country = request.headers.get('CF-IPCountry') || null;
  const ua = (request.headers.get('User-Agent') || '').slice(0, 250);

  try {
    await fetch(`${SURL}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ evento, pagina, negocio, metadata, ip_hash: ipHash, country, user_agent: ua }),
    });
  } catch (_) { /* silencioso — nunca bloquea el frontend */ }

  return new Response('{}', { status: 200, headers: h });
}
