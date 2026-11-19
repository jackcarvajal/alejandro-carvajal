/**
 * Alejandro CAD/CAM — Recordatorio por correo antes de que se congelen los créditos prepagados
 * POST /api/creditos-recordatorio   (header: X-Cron-Key: CRON_SECRET  ·  también acepta Authorization: Bearer)
 * Body opcional: { "dry_run": true }  → devuelve a quién SE le escribiría, sin enviar ni marcar nada.
 *
 * Regla (creditos-diseno-2026.sql): los créditos se congelan tras `dias_congelamiento` (default 90) días
 * sin actividad. Actividad = último lote activado (activo/agotado) o último consumo.
 * Se envía UN correo al faltar ≤30 días (día 60) y UNO al faltar ≤10 días (día 80), solo a clientes con
 * saldo disponible (suma de restantes de lotes 'activo' > 0) y aún no congelados.
 *
 * Anti-duplicado: un evento en analytics_events (evento 'creditos_recordatorio', pagina = clave
 * "cliente|ultima_actividad|hito"). Si el cliente vuelve a tener actividad, cambia la clave y el ciclo reinicia.
 * Sin tablas nuevas. Corre una vez al día (GitHub Actions) → la ventana "≤30 / ≤10" tolera un día perdido.
 *
 * Env vars: SUPABASE_SERVICE_KEY, CRON_SECRET, RESEND_API_KEY, FROM_EMAIL (opcional), REPLY_TO (opcional)
 */

const SURL = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
const NEGOCIO = 'alejandrocadcam';
const EVENTO = 'creditos_recordatorio';
const PANEL = 'https://alejandrocadcam.com/app/client-panel';
const DIA_MS = 86400000;

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Comparación en tiempo constante del secreto
function igual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function fmtFecha(d) {
  return new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });
}
const fmtN = n => Number(n).toLocaleString('es-CO', { maximumFractionDigits: 2 });

function correo({ nombre, saldo, congelaEl, dias, hito }) {
  const asunto = hito === 10
    ? `Tus créditos se congelan en ${dias} días`
    : `Tus créditos se congelarán en ${dias} días`;
  const cuerpo = `
    <p>Hola${nombre ? ' ' + escH(nombre) : ''},</p>
    <p>Tienes <b>${escH(fmtN(saldo))} créditos</b> de diseño disponibles. Por inactividad se congelan el <b>${escH(fmtFecha(congelaEl))}</b> (en ${dias} días).</p>
    <p>Envía un caso o compra cualquier plan para mantenerlos activos.</p>
    <p><a href="${PANEL}" style="display:inline-block;background:#D4AF37;color:#050505;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700">Ir a mi panel</a></p>
    <p>Un abrazo,<br>Alejandro Carvajal<br>Alejandro CAD/CAM</p>`;
  const html = `<div style="font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.5;color:#1a2332;max-width:560px">${cuerpo}</div>`;
  return { asunto, html };
}

export async function onRequestPost({ request, env }) {
  const llave = request.headers.get('X-Cron-Key') || (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!env.CRON_SECRET || !igual(llave, env.CRON_SECRET)) return json({ error: 'Unauthorized' }, 401);
  if (!env.SUPABASE_SERVICE_KEY) return json({ error: 'SUPABASE_SERVICE_KEY falta' }, 503);

  let body = {};
  try { body = await request.json(); } catch (_) { /* sin cuerpo = ejecución real */ }
  const dryRun = !!body && body.dry_run === true;
  if (!dryRun && !env.RESEND_API_KEY) return json({ error: 'RESEND_API_KEY falta' }, 503);

  const h = { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' };
  const get = async path => {
    const r = await fetch(`${SURL}${path}`, { headers: h });
    if (!r.ok) throw new Error(`Supabase ${r.status} en ${path.split('?')[0]}`);
    return r.json();
  };

  try {
    const ahora = Date.now();

    // 1. Regla de días (editable en BD; default 90)
    const reglas = await get(`/rest/v1/creditos_reglas?negocio=eq.${NEGOCIO}&clave=eq.dias_congelamiento&select=valor`);
    const diasCong = Number(reglas?.[0]?.valor) > 0 ? Math.floor(Number(reglas[0].valor)) : 90;

    // 2. Lotes activos/agotados → saldo y última activación por cliente
    const lotes = await get(`/rest/v1/creditos_lotes?negocio=eq.${NEGOCIO}&estado=in.(activo,agotado)&select=cliente_id,estado,restantes,activado_at&limit=10000`);
    const cli = new Map();
    for (const l of Array.isArray(lotes) ? lotes : []) {
      const c = cli.get(l.cliente_id) || { saldo: 0, ult: 0 };
      if (l.estado === 'activo') c.saldo += Number(l.restantes) || 0;
      const t = l.activado_at ? Date.parse(l.activado_at) : 0;
      if (t > c.ult) c.ult = t;
      cli.set(l.cliente_id, c);
    }

    // 3. Consumos recientes (solo los de la ventana de congelamiento pueden mover la fecha)
    const desde = new Date(ahora - diasCong * DIA_MS).toISOString();
    const movs = await get(`/rest/v1/creditos_movimientos?negocio=eq.${NEGOCIO}&tipo=eq.consumo&created_at=gte.${desde}&select=cliente_id,created_at&order=created_at.desc&limit=10000`);
    for (const m of Array.isArray(movs) ? movs : []) {
      const c = cli.get(m.cliente_id);
      const t = Date.parse(m.created_at);
      if (c && t > c.ult) c.ult = t;
    }

    // 4. Marcadores ya enviados
    const previos = await get(`/rest/v1/analytics_events?evento=eq.${EVENTO}&negocio=eq.${NEGOCIO}&select=pagina&limit=10000`);
    const enviadosPrev = new Set((Array.isArray(previos) ? previos : []).map(p => p.pagina));

    let revisados = 0, enviados = 0;
    const candidatos = [], errores = [];

    for (const [id, c] of cli) {
      revisados++;
      if (!(c.saldo > 0) || !c.ult) continue;                 // sin créditos o sin actividad conocida
      const congelaMs = c.ult + diasCong * DIA_MS;
      if (ahora > congelaMs) continue;                        // ya congelado
      const dias = Math.ceil((congelaMs - ahora) / DIA_MS);
      const hito = dias <= 10 ? 10 : dias <= 30 ? 30 : 0;
      if (!hito) continue;
      const clave = `${id}|${new Date(c.ult).toISOString()}|${hito}`;
      if (enviadosPrev.has(clave)) continue;                  // ya se avisó en este periodo
      candidatos.push({ id, clave, hito, dias, saldo: c.saldo, congelaEl: new Date(congelaMs).toISOString() });
    }

    if (dryRun) {
      return json({ ok: true, dry_run: true, dias_congelamiento: diasCong, revisados, enviados: 0,
        enviaria: candidatos.map(x => ({ cliente_id: x.id, hito_dias: x.hito, dias_restantes: x.dias, saldo: x.saldo, se_congela_el: x.congelaEl })) });
    }

    for (const x of candidatos) {
      try {
        const ur = await fetch(`${SURL}/auth/v1/admin/users/${x.id}`, { headers: h });
        if (!ur.ok) throw new Error(`usuario ${ur.status}`);
        const u = await ur.json();
        const to = u?.email;
        if (!to) throw new Error('sin email');
        const nombre = String(u?.user_metadata?.full_name || u?.user_metadata?.nombre || '').split(' ')[0].slice(0, 40);
        const { asunto, html } = correo({ nombre, saldo: x.saldo, congelaEl: x.congelaEl, dias: x.dias, hito: x.hito });

        const rs = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: env.FROM_EMAIL || 'Alejandro Carvajal CAD/CAM <onboarding@resend.dev>',
            to: [to], subject: asunto, html,
            ...(env.REPLY_TO ? { reply_to: env.REPLY_TO } : {}),
          }),
        });
        if (!rs.ok) throw new Error(`Resend ${rs.status}`);

        // Marcar SOLO después de enviar; si el marcador falla, se reintentaría mañana (preferible a no avisar)
        await fetch(`${SURL}/rest/v1/analytics_events`, {
          method: 'POST',
          headers: { ...h, Prefer: 'return=minimal' },
          body: JSON.stringify({ evento: EVENTO, pagina: x.clave, negocio: NEGOCIO, metadata: { hito: x.hito, dias: x.dias, saldo: x.saldo } }),
        });
        enviados++;
      } catch (e) {
        errores.push({ cliente_id: x.id, error: e.message });
      }
    }

    return json({ ok: true, revisados, enviados, ...(errores.length ? { errores } : {}) });
  } catch (err) {
    console.error('[creditos-recordatorio]', err);
    return json({ error: err.message }, 500);
  }
}
