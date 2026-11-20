/**
 * PayPal para PEDIDOS de Alejandro CAD/CAM — módulo compartido, NO es un endpoint (no exporta onRequest*).
 * Única fuente de verdad del monto que usan las ramas de pedidos de:
 *   GET  /api/paypal-create-order?tipo=pedido  → { disponible, client_id, sandbox, recargo_pct } (el botón usa ESE client-id)
 *   POST /api/paypal-create-order  { referencia }            → crea la orden con cobroPedido()
 *   POST /api/paypal-capture       { orderID, referencia }   → revisa la orden ANTES de capturar y la captura DESPUÉS
 *   POST /api/paypal-webhook       (PAYMENT.CAPTURE.COMPLETED de un pedido: respaldo si la captura se perdió)
 * Los planes de créditos van por su propia ruta (./paypal-creditos.js) y no usan nada de aquí.
 *
 * REGLA DE MONEDA (19-nov-2026) — los diseños de Alejandro se cobran en USD:
 *   · flujo-diseno guarda precio_total en dólares (fmtUSD) para TODOS los clientes, también los de Colombia,
 *     y desde el 19-nov marca moneda = 'USD' en el pedido.
 *   · moneda = 'USD'                                   → precio_total ya está en USD.
 *   · moneda vacía o 'COP' (el DEFAULT de la columna, que es lo que quedaba antes del 19-nov):
 *       precio_total ≥ UMBRAL_COP (1000) → está en COP (pedido hecho en pesos por el equipo) → ÷ TASA_COP_USD
 *       precio_total <  UMBRAL_COP       → está en USD (ningún diseño vale menos de $1.000 COP y ninguno sin
 *                                          marcar moneda llega a US$1.000)
 *   · Cualquier otra moneda → no se cobra por PayPal (monto 0: el equipo lo revisa).
 *   · Recargo internacional RECARGO_PAYPAL = 7 % (PayPal + cambio de moneda; lo asume el pagador). Igual que
 *     PRODIGY y que creditos_reglas.recargo_paypal_pct = 7 de los planes de créditos.
 *   · Cobro = baseUSD × 1,07 redondeado a centavos. La captura vale si es en USD y pagado ≥ cobro − 0,01.
 * Solo pedidos con negocio = 'alejandrocadcam': la app de PayPal la comparten las dos webs, así que un pedido de
 * PRODIGY ni se cobra ni se reconcilia aquí.
 */
export const NEGOCIO        = 'alejandrocadcam';
export const RECARGO_PAYPAL = 0.07;     // 7 % — mismo valor en create, capture y webhook (vienen de aquí)
export const TASA_COP_USD   = 4200;     // misma tasa referencial que js/pagos.js (solo para pedidos guardados en COP)
export const UMBRAL_COP     = 1000;     // precio_total ≥ 1000 sin moneda USD = pesos
export const TOLERANCIA_USD = 0.01;     // un centavo de redondeo

const centavos = (n) => Math.round(Number(n) * 100) / 100;

// ¿En qué moneda está precio_total y cuánto es en USD antes del recargo?
export function baseDelPedido(pedido) {
  const precio = Number(pedido && pedido.precio_total) || 0;
  const moneda = String((pedido && pedido.moneda) || '').trim().toUpperCase();
  if (!(precio > 0)) return { moneda: moneda || 'USD', precio: 0, usd: 0 };
  if (moneda === 'USD') return { moneda: 'USD', precio, usd: centavos(precio) };
  if (moneda && moneda !== 'COP') return { moneda, precio, usd: 0 };
  if (precio >= UMBRAL_COP) return { moneda: 'COP', precio, usd: centavos(precio / TASA_COP_USD) };
  return { moneda: 'USD', precio, usd: centavos(precio) };
}

// Lo que se cobra en PayPal (USD, con el recargo internacional).
export function cobroPedido(pedido) {
  const b = baseDelPedido(pedido);
  const total_usd = b.usd > 0 ? Math.round(b.usd * 100 * (1 + RECARGO_PAYPAL)) / 100 : 0;
  return { ...b, total_usd, recargo_pct: Math.round(RECARGO_PAYPAL * 100) };
}

export const cubreElPedido = (pagado, esperado) => Number(pagado) > 0 && Number(pagado) >= Number(esperado) - TOLERANCIA_USD;
export const descripcionPedido = (codigo) => ('Alejandro CAD/CAM · Caso ' + codigo).slice(0, 127);
// La orden/captura es de ESTE pedido (custom_id o reference_id = código).
export const esDelPedido = (unidad, codigo) => !!unidad && (unidad.custom_id === codigo || unidad.reference_id === codigo);

const sbH = (env) => ({ Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, apikey: env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json' });

// Pedido autoritativo de ESTE negocio por su código (lanza si la base no responde).
export async function leerPedido(env, codigo) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/pedidos?codigo=eq.${encodeURIComponent(codigo)}&negocio=eq.${NEGOCIO}` +
    '&select=id,codigo,precio_total,moneda,pago_estado,flujo&limit=1', { headers: sbH(env) });
  if (!r.ok) throw new Error('bd_pedido_' + r.status);
  return (await r.json())[0] || null;
}

// GET ?tipo=pedido — ¿se puede pagar un pedido con PayPal? El client-id público sale del servidor para que el
// botón siempre use las mismas credenciales con que se crean las órdenes (también en sandbox).
export function configPedidos(env, h) {
  const listo = !!(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET && env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY);
  const body = listo
    ? { disponible: true, client_id: env.PAYPAL_CLIENT_ID, sandbox: env.PAYPAL_ENV === 'sandbox', recargo_pct: Math.round(RECARGO_PAYPAL * 100) }
    : { disponible: false, motivo: 'paypal_no_configurado' };
  return new Response(JSON.stringify(body), { status: 200, headers: h });
}
