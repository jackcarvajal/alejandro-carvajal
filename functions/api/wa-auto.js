/**
 * Alejandro CAD/CAM — WA automático
 * POST /api/wa-auto
 * Body: { whatsapp, mensaje }
 *
 * Env vars: CALLMEBOT_APIKEY
 */

const CORS_OK = ['https://alejandrocadcam.pages.dev'];

function cors(origin) {
  const ok = CORS_OK.includes(origin) || (origin||'').includes('.pages.dev') || !origin;
  return { 'Access-Control-Allow-Origin': ok ? origin||'*' : CORS_OK[0], 'Content-Type': 'application/json' };
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: { ...cors(request.headers.get('Origin')||''), 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const h = cors(origin);

  if (!env.CALLMEBOT_APIKEY) return new Response(JSON.stringify({ error: 'CALLMEBOT_APIKEY no configurada' }), { status: 503, headers: h });

  // Rate limit 15/hora por IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rlKey = new Request('https://rl.internal/wa-auto-ac_' + ip);
  const hit = await caches.default.match(rlKey);
  if (hit) {
    const n = parseInt(await hit.text(), 10) || 0;
    if (n >= 15) return new Response(JSON.stringify({ error: 'Rate limit' }), { status: 429, headers: h });
    await caches.default.put(rlKey, new Response(String(n+1), { headers: { 'Cache-Control': 'max-age=3600' } }));
  } else {
    await caches.default.put(rlKey, new Response('1', { headers: { 'Cache-Control': 'max-age=3600' } }));
  }

  let body;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400, headers: h }); }

  const { whatsapp, mensaje } = body;
  if (!whatsapp || !mensaje) return new Response(JSON.stringify({ error: 'Faltan whatsapp o mensaje' }), { status: 400, headers: h });

  const wa = String(whatsapp).replace(/\D/g, '');
  if (wa.length < 10) return new Response(JSON.stringify({ error: 'WA inválido' }), { status: 400, headers: h });
  const waFull = wa.length === 10 ? '57' + wa : wa;

  // Límite por número destino (no solo por IP) — evita usar este endpoint
  // publico como herramienta de acoso/spam repetido contra un mismo numero
  // rotando de IP. Max 5 mensajes/hora al mismo numero.
  const rlDestKey = new Request('https://rl.internal/wa-auto-ac-dest_' + waFull);
  const rlDestHit = await caches.default.match(rlDestKey);
  const destCount = rlDestHit ? (parseInt(await rlDestHit.text(), 10) || 0) : 0;
  if (destCount >= 5) return new Response(JSON.stringify({ error: 'Demasiados mensajes a este número.' }), { status: 429, headers: h });
  await caches.default.put(rlDestKey, new Response(String(destCount+1), { headers: { 'Cache-Control': 'max-age=3600' } }));

  try {
    const resp = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${waFull}&text=${encodeURIComponent(mensaje)}&apikey=${env.CALLMEBOT_APIKEY}`);
    const txt = await resp.text();

    // CallMeBot no usa códigos HTTP consistentes para errores — responde 200
    // con un mensaje de texto. "Message queued" es la única confirmación real
    // de envío; cualquier otra cosa (API key inválida, número no registrado,
    // límite alcanzado) antes se reportaba como éxito sin verificar.
    const enviado = resp.ok && /message queued/i.test(txt);
    if (!enviado) {
      if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
        await fetch(`${env.SUPABASE_URL}/rest/v1/logs_incidencias`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tipo: 'WA_AUTO_ERROR',
            severidad: 'WARN',
            descripcion: `[wa-auto] Falló envío a ${waFull}: ${txt.slice(0, 300)}`,
            resuelta: false,
          }),
        }).catch(() => {});
      }
      return new Response(JSON.stringify({ error: 'CallMeBot no confirmó el envío', detail: txt.slice(0, 200) }), { status: 502, headers: h });
    }

    return new Response(JSON.stringify({ ok: true, wa: waFull }), { status: 200, headers: h });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: h });
  }
}
