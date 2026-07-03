/**
 * Alejandro CAD/CAM — Resumen semanal por WA
 * GET /api/resumen-semanal?key=CRON_SECRET
 *
 * Llamar los lunes 8 AM Bogotá. Resumen de la semana anterior.
 * Env vars: SUPABASE_SERVICE_KEY, CRON_SECRET, CALLMEBOT_APIKEY
 */

const SURL = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
const WA_ALEJANDRO = '573219581949';

export async function onRequestGet({ request, env }) {
  const key = new URL(request.url).searchParams.get('key');
  if (!env.CRON_SECRET || key !== env.CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'SUPABASE_SERVICE_KEY falta' }), { status: 503 });

  const h = { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' };
  const lunes = new Date(); lunes.setDate(lunes.getDate() - 7); lunes.setHours(0,0,0,0);
  const desde = lunes.toISOString();

  try {
    // Pedidos de la semana
    const [rPed, rCot, rNl] = await Promise.all([
      fetch(`${SURL}/rest/v1/pedidos?negocio=eq.alejandrocadcam&created_at=gte.${desde}&select=id,estado,total,precio_total,flujo`, { headers: h }),
      fetch(`${SURL}/rest/v1/cotizaciones?negocio=eq.alejandrocadcam&created_at=gte.${desde}&select=id,estado,total`, { headers: h }),
      fetch(`${SURL}/rest/v1/newsletter_subscribers?negocio=eq.alejandrocadcam&activo=eq.true&select=id`, { headers: h }),
    ]);

    const pedidos = await rPed.json().catch(() => []);
    const cotizaciones = await rCot.json().catch(() => []);
    const subs = await rNl.json().catch(() => []);

    const nPed = Array.isArray(pedidos) ? pedidos.length : 0;
    const ingresos = Array.isArray(pedidos) ? pedidos.reduce((s,p)=>s+Number(p.total||p.precio_total||0),0) : 0;
    const nCot = Array.isArray(cotizaciones) ? cotizaciones.length : 0;
    const nSubs = Array.isArray(subs) ? subs.length : 0;
    const fmtUSD = n => `$${Math.round(n).toLocaleString('es-CO')} USD`;

    const semana = `${lunes.toLocaleDateString('es-CO',{day:'2-digit',month:'short'})} – ${new Date().toLocaleDateString('es-CO',{day:'2-digit',month:'short'})}`;

    const msg = `📊 *Alejandro CAD/CAM — Resumen Semana*\n_${semana}_\n\n📦 *Pedidos:* ${nPed}\n💰 *Ingresos:* ${fmtUSD(ingresos)}\n📋 *Cotizaciones:* ${nCot}\n📧 *Suscriptores newsletter:* ${nSubs}\n\n${nPed===0?'⚠️ Sin pedidos esta semana — revisar canales de adquisición.':nPed<5?'📈 Semana tranquila. Considera activar promoción.':'✅ Buena semana!'}\n\n🔗 https://alejandrocadcam.pages.dev/app/metricas.html`;

    if (env.CALLMEBOT_APIKEY) {
      const waRes = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${WA_ALEJANDRO}&text=${encodeURIComponent(msg)}&apikey=${env.CALLMEBOT_APIKEY}`);
      const waTxt = await waRes.text();
      if (!waRes.ok || !/message queued/i.test(waTxt)) {
        console.error('[resumen-semanal] Falló WA:', waTxt.slice(0, 200));
      }
    }

    return new Response(JSON.stringify({ ok: true, semana, pedidos: nPed, ingresos, cotizaciones: nCot }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
