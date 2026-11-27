/* Créditos de diseño prepagados (Bronce / Plata / Oro / Platino) — lado del cliente.
 * El dinero y el saldo se deciden SOLO en la base (RPC creditos_* de sql/creditos-diseno-2026.sql, repo PRODIGY).
 * Aquí solo se muestra y se llaman las funciones. Sin precios ni factores escritos en el código: salen de
 * creditos_planes y creditos_reglas.
 * Lo usan app/client-panel.html (saldo, planes, pagar casos, cuentas regresivas) y flujo-diseno.html (pagar al enviar). */
(function () {
  var NEG = 'alejandrocadcam';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function num(n) {
    var v = Number(n) || 0;
    return (Math.round(v * 100) / 100).toLocaleString('es-CO', { maximumFractionDigits: 2 });
  }
  function fecha(ts, conHora) {
    if (!ts) return '—';
    var o = { day: 'numeric', month: 'short', year: 'numeric' };
    if (conHora) { o.hour = '2-digit'; o.minute = '2-digit'; }
    return new Date(ts).toLocaleString('es-CO', o);
  }

  // Traduce los errores de la base a algo que el cliente entienda.
  function mensajeError(e) {
    var m = String((e && (e.message || e.details)) || e || '');
    if (/SALDO_INSUFICIENTE/.test(m)) return 'No te alcanzan los créditos. ' + m.replace(/^.*SALDO_INSUFICIENTE:?\s*/, '').replace(/^./, function (c) { return c.toUpperCase(); });
    if (/CONGELADO/.test(m)) return 'Tu saldo está congelado por inactividad (más de 90 días sin enviar casos). Se reactiva al comprar cualquier plan.';
    if (/COTIZAR/.test(m)) return 'Este caso (Full Arch, guía o diseño de sonrisa) se cotiza aparte: te escribimos con los créditos que necesita.';
    if (/confirmar pago directamente/i.test(m)) return 'El pago con créditos aún no está habilitado. Escríbenos por WhatsApp y lo cargamos nosotros.';
    if (/Ya tienes compras pendientes/i.test(m)) return 'Ya tienes compras pendientes de pago. Págalas o escríbenos antes de pedir otra.';
    if (/PAYPAL_NO_DISPONIBLE/.test(m)) return 'El pago con PayPal aún no está activo. Paga por Wise y envíanos el comprobante.';
    if (/cargar PayPal/i.test(m)) return 'No se pudo cargar PayPal (¿bloqueador de anuncios?). Recarga la página o paga por Wise.';
    if (/Sesión requerida|JWT|not authorized|permission denied/i.test(m)) return 'Inicia sesión para usar tus créditos.';
    if (/No autorizado/.test(m)) return 'Este caso no está a tu nombre.';
    return 'No se pudo completar: ' + m.slice(0, 140);
  }

  async function estado(sb) {
    var r = await sb.rpc('creditos_mi_estado', { p_negocio: NEG });
    if (r.error) throw r.error;
    return r.data || {};
  }
  async function planes(sb) {
    var r = await sb.from('creditos_planes').select('*')   // «*»: incluye tipo (diseno|modelos) sin romper si aún no existe
      .eq('negocio', NEG).eq('activo', true).order('orden');
    return r.data || [];
  }
  async function reglas(sb) {
    var r = await sb.from('creditos_reglas').select('clave,valor').eq('negocio', NEG);
    var o = {};
    (r.data || []).forEach(function (x) { o[x.clave] = Number(x.valor); });
    return o;
  }
  async function solicitarPlan(sb, codigo) {
    var r = await sb.rpc('creditos_solicitar_plan', { p_negocio: NEG, p_plan: codigo });
    if (r.error) throw r.error;
    return r.data;
  }
  async function pagarPedido(sb, pedidoId) {
    var r = await sb.rpc('creditos_consumir_pedido', { p_pedido: pedidoId });
    if (r.error) throw r.error;
    return r.data || {};
  }

  // Cuenta regresiva de entrega: fecha_ingreso + sla_horas_objetivo. Devuelve HTML de un chip que se refresca solo.
  function limiteEntrega(p) {
    if (!p || !p.fecha_ingreso || !p.sla_horas_objetivo) return null;
    return new Date(new Date(p.fecha_ingreso).getTime() + Number(p.sla_horas_objetivo) * 3600e3);
  }
  function textoRestante(lim) {
    var ms = lim.getTime() - Date.now();
    var abs = Math.abs(ms), h = Math.floor(abs / 3600e3), m = Math.floor((abs % 3600e3) / 60e3);
    var t = (h >= 48 ? Math.floor(h / 24) + ' d ' + (h % 24) + ' h' : h + ' h ' + String(m).padStart(2, '0') + ' min');
    return ms >= 0 ? 'Entrega en ' + t : 'Entrega vencida hace ' + t;
  }
  function chipEntrega(p) {
    var lim = limiteEntrega(p);
    if (!lim) return '';
    var venc = lim.getTime() < Date.now();
    return '<span class="cuenta-reg' + (venc ? ' vencida' : '') + '" data-limite="' + lim.toISOString() + '" title="Límite: ' +
      esc(fecha(lim, true)) + '">⏱ ' + esc(textoRestante(lim)) + '</span>';
  }
  function refrescarChips() {
    document.querySelectorAll('.cuenta-reg[data-limite]').forEach(function (el) {
      var lim = new Date(el.getAttribute('data-limite'));
      el.textContent = '⏱ ' + textoRestante(lim);
      el.classList.toggle('vencida', lim.getTime() < Date.now());
    });
  }
  setInterval(refrescarChips, 60000);

  // Botón «Pagar con créditos» en la confirmación del flujo (solo con sesión y saldo).
  async function ofrecerEnExito(sb, pedidoId, contenedor) {
    if (!sb || !pedidoId || !contenedor) return;
    try {
      var s = await sb.auth.getSession();
      if (!s || !s.data || !s.data.session) return;
      var e = await estado(sb);
      if (!(Number(e.disponibles) > 0) || e.congelado) return;
      contenedor.innerHTML =
        '<div style="background:rgba(0,210,255,.07);border:1px solid rgba(0,210,255,.3);border-radius:10px;padding:14px;margin-bottom:14px;text-align:left">' +
        '<div style="font-size:.86rem;font-weight:800;color:#00d2ff;margin-bottom:4px">Tienes ' + esc(num(e.disponibles)) + ' créditos</div>' +
        '<div style="font-size:.78rem;color:#cbd5e1;margin-bottom:10px">Paga este caso con tu saldo y el plazo de entrega empieza ya.</div>' +
        '<button type="button" id="btn-pagar-creditos" style="width:100%;padding:11px;border:none;border-radius:9px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#00d2ff,#0ea5e9);color:#001">Pagar con mis créditos</button>' +
        '<div id="msg-pagar-creditos" role="status" style="font-size:.78rem;margin-top:8px"></div></div>';
      var btn = document.getElementById('btn-pagar-creditos');
      btn.addEventListener('click', async function () {
        btn.disabled = true; btn.textContent = 'Cobrando…';
        var msg = document.getElementById('msg-pagar-creditos');
        try {
          var r = await pagarPedido(sb, pedidoId);
          msg.style.color = '#00FF41';
          msg.textContent = r.ya_cobrado ? 'Este caso ya estaba pagado con créditos.'
            : 'Listo: ' + num(r.creditos) + ' créditos descontados. Te quedan ' + num(r.saldo) + '.' +
              (r.entrega_limite ? ' Entrega a más tardar: ' + fecha(r.entrega_limite, true) + '.' : '');
          btn.textContent = 'Pagado con créditos';
        } catch (err) {
          msg.style.color = '#f87171'; msg.textContent = mensajeError(err);
          btn.disabled = false; btn.textContent = 'Pagar con mis créditos';
        }
      });
    } catch (_) { /* sin créditos habilitados: no se muestra nada */ }
  }

  /* ── Pagar un plan pendiente con PayPal (USD) ─────────────────────────────────────────────────────
   * El monto lo fija el SERVIDOR leyendo creditos_lotes + recargo_paypal_pct (nunca este navegador), y la
   * captura se verifica allá antes de activar (functions/api/paypal-creditos.js). Aquí solo se pinta el botón.
   * Si el SQL o las credenciales de PayPal aún no están, paypalConfig() dice disponible:false y el panel deja Wise. */
  var _ppCfg = null;
  async function paypalConfig() {
    if (_ppCfg) return _ppCfg;
    var d = null;
    try {
      var r = await fetch('/api/paypal-create-order?tipo=creditos', { headers: { Accept: 'application/json' } });
      d = await r.json();
    } catch (_) { d = null; }
    if (d && d.disponible && d.client_id) { _ppCfg = d; return d; }   // solo se recuerda si está disponible
    return { disponible: false, motivo: (d && d.motivo) || 'sin_conexion' };
  }
  // Solo para MOSTRAR el total antes de pagar (mismo redondeo que el servidor y el SQL).
  function montoPayPal(monto, pct) { return Math.round(Number(monto) * 100 * (1 + (Number(pct) || 0) / 100)) / 100; }

  var _sdk = null;
  function cargarSdkPayPal(clientId) {
    if (window.paypal && window.paypal.Buttons) return Promise.resolve();
    if (_sdk) return _sdk;
    _sdk = new Promise(function (ok, fallo) {
      var s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(clientId) +
        '&currency=USD&intent=capture&components=buttons&disable-funding=credit';
      s.onload = function () { ok(); };
      s.onerror = function () { _sdk = null; s.remove(); fallo(new Error('No se pudo cargar PayPal')); };
      document.head.appendChild(s);
    });
    return _sdk;
  }

  async function postSesion(sb, url, body) {
    var s = await sb.auth.getSession();
    var t = s && s.data && s.data.session && s.data.session.access_token;
    if (!t) throw new Error('Sesión requerida');
    var r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify(body) });
    var d = {};
    try { d = await r.json(); } catch (_) { d = {}; }
    d._status = r.status;
    return d;
  }

  // Pinta los botones de PayPal de un lote pendiente dentro de `contenedor`.
  // cb.listo(respuesta)  → pago confirmado y créditos activos.
  // cb.aviso(texto, tipo, respuesta) → tipo 'info' | 'error' (respuesta.capturado = el dinero ya salió: no reintentar).
  async function pagarLotePayPal(sb, loteId, contenedor, cb) {
    var cfg = await paypalConfig();
    if (!cfg.disponible) throw new Error('PAYPAL_NO_DISPONIBLE');
    await cargarSdkPayPal(cfg.client_id);
    contenedor.innerHTML = '';
    var ultimoError = '';
    await window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 42 },
      createOrder: async function () {
        var d = await postSesion(sb, '/api/paypal-create-order', { tipo: 'creditos', lote_id: loteId });
        if (!d.id) { ultimoError = d.error || 'No se pudo crear la orden de PayPal.'; throw new Error(ultimoError); }
        return d.id;
      },
      onApprove: async function (data, actions) {
        cb.aviso('Confirmando tu pago con PayPal…', 'info');
        var d;
        try { d = await postSesion(sb, '/api/paypal-capture', { tipo: 'creditos', lote_id: loteId, orderID: data.orderID }); }
        catch (e) { return cb.aviso('Se cortó la conexión al confirmar. Recarga en un minuto: si PayPal cobró, tus créditos aparecen solos.', 'error', { capturado: true }); }
        if (d.ok) return cb.listo(d);
        if (d.reintentar && actions && actions.restart) { cb.aviso(d.error, 'error', d); return actions.restart(); }
        cb.aviso(d.error || 'No se pudo confirmar el pago.', d.pendiente ? 'info' : 'error', d);
      },
      onCancel: function () { cb.aviso('Cancelaste el pago en PayPal. No se cobró nada; puedes intentarlo de nuevo.', 'info'); },
      onError: function () {
        cb.aviso(ultimoError || 'PayPal no completó el pago. Intenta de nuevo o paga por Wise.', 'error');
        ultimoError = '';
      },
    }).render(contenedor);
  }

  window.Creditos = {
    NEG: NEG, esc: esc, num: num, fecha: fecha, mensajeError: mensajeError,
    estado: estado, planes: planes, reglas: reglas, solicitarPlan: solicitarPlan, pagarPedido: pagarPedido,
    limiteEntrega: limiteEntrega, chipEntrega: chipEntrega, refrescarChips: refrescarChips, ofrecerEnExito: ofrecerEnExito,
    paypalConfig: paypalConfig, montoPayPal: montoPayPal, pagarLotePayPal: pagarLotePayPal,
  };
})();
