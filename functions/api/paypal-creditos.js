/**
 * PayPal para PLANES DE CRÉDITOS (Bronce / Plata / Oro / Platino) — módulo compartido, NO es un endpoint
 * (no exporta onRequest*). Lo usan las ramas `tipo:'creditos'` de:
 *   GET  /api/paypal-create-order?tipo=creditos   → { disponible, client_id, recargo_pct }
 *   POST /api/paypal-create-order  { tipo:'creditos', lote_id }            (Authorization: Bearer <sesión>)
 *   POST /api/paypal-capture       { tipo:'creditos', lote_id, orderID }   (Authorization: Bearer <sesión>)
 *   POST /api/paypal-webhook       (custom_id «CR:<lote>»: respaldo si la captura se perdió)
 *
 * SEGURIDAD
 *   · El monto NUNCA viene del navegador: sale de creditos_lotes.monto (precio del catálogo que fijó
 *     creditos_solicitar_plan) + recargo_paypal_pct de creditos_reglas.
 *   · Solo el dueño del lote (JWT de Supabase verificado en /auth/v1/user) puede crear o capturar su orden,
 *     y solo si el lote sigue «pendiente_pago».
 *   · Antes de capturar se lee la orden en PayPal (custom_id, moneda USD y monto); después se exige la
 *     captura COMPLETED con el mismo monto. Recién ahí se activa con creditos_activar_lote_pago (RPC que
 *     solo ejecuta service_role; idempotente por la referencia «paypal:<id de captura>»).
 *   · Si el SQL (sql/creditos-pago-paypal-2026.sql, repo PRODIGY) aún no se corrió, no se crea ni se captura
 *     ninguna orden: el cliente sigue con Wise / WhatsApp.
 * Env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV, SUPABASE_URL, SUPABASE_SERVICE_KEY (+ PAYPAL_WEBHOOK_ID).
 */
import { cfg, adminH, usuarioDe } from './reportar-problema.js';

export const NEG = 'alejandrocadcam';
export const PREFIJO = 'CR:';                                   // custom_id de las órdenes de créditos
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ORDER_RE = /^[A-Z0-9-]{5,40}$/i;
const PLANES = { bronce: 'Bronce', plata: 'Plata', oro: 'Oro', platino: 'Platino', modelos_50: 'Modelos 50', modelos_100: 'Modelos 100', modelos_200: 'Modelos 200' };

export const esCustomIdCreditos = (s) => String(s || '').startsWith(PREFIJO);
export const refCorta = (id) => 'CR-' + String(id).slice(0, 8).toUpperCase();
// Mismo redondeo que el SQL: round(monto * (1 + pct/100), 2), en centavos para no arrastrar decimales binarios.
export const montoConRecargo = (monto, pct) => Math.round(Number(monto) * 100 * (1 + (Number(pct) || 0) / 100)) / 100;
const nombrePlan = (c) => PLANES[c] || c || 'Plan';
const json = (obj, status, h) => new Response(JSON.stringify(obj), { status, headers: h });

/* ── Supabase (service role) ─────────────────────────────────────────── */
async function leerLote(c, id) {
  const r = await fetch(`${c.URL}/rest/v1/creditos_lotes?id=eq.${id}&select=id,negocio,cliente_id,plan_codigo,unidades,monto,moneda,estado,referencia_pago&limit=1`,
    { headers: adminH(c.SERVICE) });
  if (!r.ok) throw new Error('bd_lote_' + r.status);
  return (await r.json())[0] || null;
}

// ¿Ya se corrió el SQL? Lee la regla del recargo y sondea la RPC (p_lote nulo → «Falta el lote», sin efectos).
// Solo se recuerda el resultado positivo (5 min por instancia): si falta el SQL se vuelve a mirar cada vez.
let _disp = null, _dispAt = 0;
export async function disponibilidad(env) {
  if (_disp && Date.now() - _dispAt < 5 * 60e3) return _disp;
  const c = cfg(env);
  try {
    const rr = await fetch(`${c.URL}/rest/v1/creditos_reglas?negocio=eq.${NEG}&clave=eq.recargo_paypal_pct&select=valor&limit=1`, { headers: adminH(c.SERVICE) });
    const regla = rr.ok ? (await rr.json())[0] : null;
    const pr = await fetch(`${c.URL}/rest/v1/rpc/creditos_activar_lote_pago`, {
      method: 'POST', headers: adminH(c.SERVICE), body: JSON.stringify({ p_lote: null, p_referencia: null, p_monto: null }),
    });
    const pj = await pr.json().catch(() => ({}));
    const rpcLista = /Falta el lote/.test(String(pj.message || ''));
    if (!regla || !rpcLista) return { ok: false, motivo: 'sql_pendiente' };
    _disp = { ok: true, recargo_pct: Number(regla.valor) || 0 }; _dispAt = Date.now();
    return _disp;
  } catch (e) {
    console.error('[paypal-creditos] disponibilidad:', e.message);
    return { ok: false, motivo: 'bd_no_responde' };
  }
}

async function activar(env, loteId, referencia, monto) {
  const c = cfg(env);
  try {
    const r = await fetch(`${c.URL}/rest/v1/rpc/creditos_activar_lote_pago`, {
      method: 'POST', headers: adminH(c.SERVICE),
      body: JSON.stringify({ p_lote: loteId, p_referencia: referencia, p_monto: monto }),
    });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok && !!d && d.ok === true, status: r.status, data: d || {}, error: r.ok ? '' : String((d && (d.message || d.code)) || r.status) };
  } catch (e) {
    return { ok: false, status: 0, data: {}, error: 'sin conexión con la base: ' + e.message };   // status 0 = reintentar
  }
}

// Aviso al equipo en la campana del panel (misma tabla que los pagos de pedidos). Best-effort.
async function avisarEquipo(env, titulo, mensaje) {
  const c = cfg(env);
  try {
    await fetch(`${c.URL}/rest/v1/notificaciones_internas`, {
      method: 'POST', headers: { ...adminH(c.SERVICE), Prefer: 'return=minimal' },
      body: JSON.stringify({ tipo: 'pago', prioridad: 'alta', destinatario_rol: 'contabilidad', destinatario_dept: null,
        titulo, mensaje, accion_url: '/app/admin-panel.html', leida_por: [] }),
    });
  } catch (_e) { /* no bloquear el pago por un aviso */ }
}

// Identidad SOLO desde la sesión + lote propio de este negocio.
async function loteDelUsuario(request, env, loteId, h) {
  if (!ID_RE.test(loteId)) return { resp: json({ error: 'Compra no válida' }, 400, h) };
  const c = cfg(env);
  const user = await usuarioDe(request, c);
  if (!user || !user.id) return { resp: json({ error: 'Inicia sesión para pagar tu plan.' }, 401, h) };
  let lote;
  try { lote = await leerLote(c, loteId); } catch (_) { return { resp: json({ error: 'No se pudo validar la compra' }, 502, h) }; }
  if (!lote || lote.negocio !== NEG || lote.cliente_id !== user.id) return { resp: json({ error: 'Esta compra no está a tu nombre' }, 403, h) };
  return { lote, user };
}

/* ── GET ?tipo=creditos — ¿se puede pagar con PayPal? (el client-id público sale del servidor: siempre
      coincide con las credenciales con que se crean las órdenes, también en sandbox) ── */
export async function configCreditos(env, h) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return json({ disponible: false, motivo: 'paypal_no_configurado' }, 200, h);
  }
  const d = await disponibilidad(env);
  if (!d.ok) return json({ disponible: false, motivo: d.motivo }, 200, h);
  return json({ disponible: true, client_id: env.PAYPAL_CLIENT_ID, sandbox: env.PAYPAL_ENV === 'sandbox', recargo_pct: d.recargo_pct }, 200, h);
}

/* ── POST create-order { tipo:'creditos', lote_id } ── */
export async function crearOrdenCreditos({ request, env, body, h, ppToken, base }) {
  const { lote, resp } = await loteDelUsuario(request, env, String(body.lote_id || '').trim(), h);
  if (resp) return resp;
  if (lote.estado !== 'pendiente_pago') return json({ error: 'Este plan ya no está pendiente de pago (' + lote.estado + ').' }, 409, h);
  if (lote.moneda !== 'USD' || !(Number(lote.monto) > 0)) return json({ error: 'Esta compra no tiene un monto en USD' }, 400, h);

  const disp = await disponibilidad(env);
  if (!disp.ok) return json({ error: 'El pago con PayPal aún no está activo. Paga por Wise y envíanos el comprobante.', codigo: 'SQL_PENDIENTE' }, 503, h);

  const valor = montoConRecargo(lote.monto, disp.recargo_pct).toFixed(2);
  try {
    const token = await ppToken(env);
    const r = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: refCorta(lote.id),
          custom_id: PREFIJO + lote.id,
          description: `Alejandro CAD/CAM · Plan ${nombrePlan(lote.plan_codigo)} · ${Number(lote.unidades)} créditos de diseño`.slice(0, 127),
          amount: { currency_code: 'USD', value: valor },
        }],
        application_context: { brand_name: 'Alejandro CAD/CAM', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
      }),
    });
    const order = await r.json();
    if (!r.ok || !order.id) {
      console.error('[paypal-creditos] crear orden:', JSON.stringify(order).slice(0, 300));
      return json({ error: 'No se pudo crear la orden de PayPal' }, 502, h);
    }
    return json({ id: order.id, monto_usd: valor, recargo_pct: disp.recargo_pct }, 200, h);
  } catch (e) {
    console.error('[paypal-creditos] crear orden:', e.message);
    return json({ error: 'Error conectando con PayPal' }, 502, h);
  }
}

// Revisa que una orden/captura de PayPal corresponda a ESTE lote y cubra el monto (moneda USD).
function cubreElLote(unidad, lote, esperado) {
  const amt = unidad && unidad.amount || {};
  return String(unidad && unidad.custom_id || '') === PREFIJO + lote.id
    && amt.currency_code === 'USD' && Number(amt.value) >= esperado - 0.01;
}

/* ── POST capture { tipo:'creditos', lote_id, orderID } ── */
export async function capturarOrdenCreditos({ request, env, body, h, ppToken, base }) {
  const orderID = String(body.orderID || '').trim();
  if (!ORDER_RE.test(orderID)) return json({ error: 'Faltan datos del pago' }, 400, h);
  const { lote, resp } = await loteDelUsuario(request, env, String(body.lote_id || '').trim(), h);
  if (resp) return resp;
  const ref = refCorta(lote.id);

  // Ya activo: si fue por PayPal es un reintento (ok); si fue por otro medio, NO se cobra de nuevo.
  if (lote.estado === 'activo' || lote.estado === 'agotado') {
    if (String(lote.referencia_pago || '').startsWith('paypal:')) return json({ ok: true, ya_activo: true, unidades: Number(lote.unidades) }, 200, h);
    return json({ error: 'Este plan ya está activo: no se cobró nada en PayPal.' }, 409, h);
  }
  if (lote.estado !== 'pendiente_pago') return json({ error: 'Este plan ya no está pendiente de pago (' + lote.estado + ').' }, 409, h);

  const disp = await disponibilidad(env);
  if (!disp.ok) return json({ error: 'El pago con PayPal aún no está activo: no se cobró nada. Paga por Wise.', codigo: 'SQL_PENDIENTE' }, 503, h);
  const esperado = montoConRecargo(lote.monto, disp.recargo_pct);

  let orden, token;
  try {
    token = await ppToken(env);
    // 1) Leer la orden ANTES de capturar: si no es de este lote o no cubre el monto, no se toca el dinero.
    const go = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(orderID)}`, { headers: { Authorization: `Bearer ${token}` } });
    orden = await go.json();
    if (!go.ok) { console.error('[paypal-creditos] leer orden:', JSON.stringify(orden).slice(0, 300)); return json({ error: 'No se encontró la orden de PayPal' }, 400, h); }
    if (!cubreElLote((orden.purchase_units || [])[0], lote, esperado)) {
      console.error('[paypal-creditos] orden no corresponde al lote', ref, JSON.stringify(orden.purchase_units || []).slice(0, 300));
      return json({ error: 'La orden de PayPal no corresponde a este plan: no se cobró nada.' }, 400, h);
    }
    // 2) Capturar (si ya estaba capturada —respuesta perdida— se usa tal cual).
    if (orden.status === 'APPROVED') {
      const cr = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': 'cr-cap-' + orderID },
      });
      const cap = await cr.json();
      if (!cr.ok) {
        const issue = ((cap.details || [])[0] || {}).issue || '';
        if (issue === 'INSTRUMENT_DECLINED') return json({ error: 'PayPal rechazó ese medio de pago. Elige otro.', reintentar: true }, 402, h);
        console.error('[paypal-creditos] captura:', JSON.stringify(cap).slice(0, 300));
        return json({ error: 'El pago no se completó en PayPal' }, 402, h);
      }
      orden = cap;
    } else if (orden.status !== 'COMPLETED') {
      return json({ error: 'El pago aún no está aprobado en PayPal' }, 402, h);
    }
  } catch (e) {
    console.error('[paypal-creditos] captura:', e.message);
    return json({ error: 'Error capturando el pago' }, 502, h);
  }

  // 3) Verificar la captura en sí (estado, moneda y monto).
  const pu = (orden.purchase_units || [])[0] || {};
  const capt = ((pu.payments || {}).captures || [])[0] || {};
  const pagado = Number((capt.amount || {}).value || 0);
  if (capt.status === 'PENDING') {
    // PayPal la dejó en revisión: el webhook PAYMENT.CAPTURE.COMPLETED activa el lote cuando la libere.
    return json({ ok: false, pendiente: true, error: 'PayPal dejó tu pago en revisión. Tus créditos se activan solos cuando PayPal lo libere; no pagues de nuevo.' }, 202, h);
  }
  if (capt.status !== 'COMPLETED' || !capt.id || (capt.amount || {}).currency_code !== 'USD' || !(pagado >= esperado - 0.01)) {
    console.error('[paypal-creditos] captura inesperada', ref, JSON.stringify(capt).slice(0, 300));
    await avisarEquipo(env, '⚠️ Revisar pago PayPal de créditos — ' + ref, 'La captura de PayPal (' + (capt.id || orderID) + ') no cuadra con el plan (' + (capt.status || '?') + ', US$' + pagado + ' de US$' + esperado + '). Revisar en PayPal.');
    return json({ ok: false, capturado: true, error: 'PayPal registró el pago pero no cuadra con el plan. Ya avisamos a Alejandro; no pagues de nuevo.' }, 409, h);
  }

  // 4) Activar en la base (idempotente; la misma referencia la usa el webhook).
  const a = await activar(env, lote.id, 'paypal:' + capt.id, pagado);
  if (!a.ok) {
    console.error('[paypal-creditos] pago capturado pero no se activó', ref, a.status, a.error);
    await avisarEquipo(env, '⚠️ Créditos pagados SIN activar — ' + ref,
      'Entró un pago PayPal de US$' + pagado + ' (captura ' + capt.id + ') del plan ' + nombrePlan(lote.plan_codigo) + ', pero la activación falló: ' + a.error.slice(0, 160) + '. Activarlo a mano en Créditos o devolver el pago.');
    return json({ ok: false, capturado: true, error: 'Tu pago entró en PayPal, pero no pudimos activar los créditos solos. Ya avisamos a Alejandro (referencia ' + ref + '); no pagues de nuevo.' }, 500, h);
  }
  if (!a.data.ya_activo) {
    await avisarEquipo(env, '💰 Plan de créditos pagado — ' + ref + ' (Alejandro CAD/CAM)',
      'Pago PayPal de US$' + pagado + ' (captura ' + capt.id + '): plan ' + nombrePlan(lote.plan_codigo) + ', ' + Number(lote.unidades) + ' créditos activados solos.');
  }
  return json({ ok: true, ya_activo: !!a.data.ya_activo, unidades: Number(a.data.unidades || lote.unidades), monto_usd: pagado }, 200, h);
}

/* ── Webhook PAYMENT.CAPTURE.COMPLETED con custom_id «CR:<lote>» (firma ya verificada por paypal-webhook.js) ──
   Respuestas: 200 = listo o no se debe reintentar · 5xx = PayPal reintenta (p. ej. el SQL aún no está). */
export async function webhookCreditos(env, evt) {
  const res = evt.resource || {};
  const loteId = String(res.custom_id || '').slice(PREFIJO.length);
  const captureId = String(res.id || '');
  const pagado = Number((res.amount || {}).value || 0);
  const ok = (t) => new Response(t, { status: 200 });
  if (!ID_RE.test(loteId) || !captureId) return ok('sin lote');
  if (res.status && res.status !== 'COMPLETED') return ok('captura no completada');

  let lote;
  try { lote = await leerLote(cfg(env), loteId); } catch (_) { return new Response('error BD', { status: 502 }); }
  if (!lote || lote.negocio !== NEG) return ok('lote no encontrado');
  const ref = refCorta(lote.id), referencia = 'paypal:' + captureId;

  if (lote.estado === 'activo' || lote.estado === 'agotado') {
    if (lote.referencia_pago === referencia) return ok('ya procesado');
    console.error('[paypal-webhook] pago PayPal sobre un lote ya activo', ref, captureId);
    await avisarEquipo(env, '⚠️ Posible doble pago de créditos — ' + ref,
      'Llegó un pago PayPal de US$' + pagado + ' (captura ' + captureId + ') para un plan que ya estaba activo (' + (lote.referencia_pago || '—') + '). Revisar y devolver si corresponde.');
    return ok('lote ya activo');
  }
  if (lote.estado !== 'pendiente_pago') return ok('lote ' + lote.estado);

  const disp = await disponibilidad(env);
  if (!disp.ok) return new Response('sql pendiente', { status: 503 });   // PayPal reintenta por horas
  const esperado = montoConRecargo(lote.monto, disp.recargo_pct);
  if ((res.amount || {}).currency_code !== 'USD' || !(pagado >= esperado - 0.01)) {
    console.error('[paypal-webhook] monto/moneda no coincide', ref, pagado, esperado);
    await avisarEquipo(env, '⚠️ Revisar pago PayPal de créditos — ' + ref, 'Pago de US$' + pagado + ' (captura ' + captureId + ') no cuadra con el plan (US$' + esperado + ').');
    return ok('monto no coincide');
  }

  const a = await activar(env, lote.id, referencia, pagado);
  if (!a.ok) {
    if (a.status === 0 || a.status === 404 || a.status >= 500) return new Response('error activando', { status: 502 });   // reintentar
    console.error('[paypal-webhook] no se activó', ref, a.error);
    await avisarEquipo(env, '⚠️ Créditos pagados SIN activar — ' + ref, 'Pago PayPal US$' + pagado + ' (captura ' + captureId + '): ' + a.error.slice(0, 160));
    return ok('no activado');
  }
  if (!a.data.ya_activo) {
    await avisarEquipo(env, '💰 Plan de créditos pagado — ' + ref + ' (Alejandro CAD/CAM)',
      'Pago PayPal de US$' + pagado + ' (captura ' + captureId + '): plan ' + nombrePlan(lote.plan_codigo) + ' activado [reconciliado por webhook].');
  }
  return ok('ok');
}
