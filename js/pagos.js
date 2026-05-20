/**
 * Alejandro Carvajal CAD/CAM — Sistema de Pagos v1.0
 * ────────────────────────────────────────────────────
 * Mismas cuentas que PRODIGY — fuente_pago identifica el origen.
 *
 * ✅ Claves PÚBLICAS (seguras en frontend):
 *    - Wompi Public Key (producción) → dinero a PRODIGY/Alejandro (misma cuenta)
 *    - PayPal Client ID (Live)
 *
 * Recargos:
 *   Wompi:         +3%   (PSE / Nequi / Tarjeta — Colombia en COP)
 *   PayPal:        +5.4% (Internacional en USD)
 *   Transferencia: +0%   (Wise / Bancolombia / Nequi manual)
 *
 * NOTA CONTABLE: fuente_pago = 'alejandrocadcam.pages.dev/flujo-diseno'
 * Permite separar contabilidad de PRODIGY vs alejandrocadcam en los reportes.
 */

const TASA_COP_USD = 4200; // Tasa referencial — actualizar mensualmente

const AC_PAGOS = {
    wompi: {
        publicKey: 'pub_prod_toFqXM5Ko9rn6Htt6kiEma7jHj9zuA0', // Cuenta PRODIGY/Alejandro
        recargo:   0.03,
        label:     'PSE / Nequi / Tarjeta — Wompi',
        icono:     '💳',
        disponible: true
    },
    paypal: {
        clientId: 'AfJ71Yzfk4hmHF_hj6F9sdUqTLCK9tilmCegiXOTpScB81NhLLDuiKX2u37aY_E4swf8UO8QuC7jvaG',
        recargo:  0.054,
        label:    'PayPal / Tarjeta internacional',
        icono:    '🌎',
        disponible: true
    }
};

/* ── Toast ── */
function _acToast(msg) {
    let el = document.getElementById('_ac-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = '_ac-toast';
        el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a2332;border:1px solid rgba(217,70,166,.4);color:#f8fafc;padding:12px 24px;border-radius:10px;font-size:.85rem;z-index:9999;opacity:0;transition:opacity .3s;pointer-events:none;max-width:340px;text-align:center;';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(_acToast._t);
    _acToast._t = setTimeout(() => el.style.opacity = '0', 4000);
}

/* ── Detectar país ── */
async function detectarPaisAC() {
    const c = sessionStorage.getItem('ac_pais');
    if (c) return c;
    try {
        const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const d = await r.json();
        const p = d.country_code || 'CO';
        sessionStorage.setItem('ac_pais', p);
        return p;
    } catch { return 'CO'; }
}

/* ── Wompi — checkout Colombia (COP) — SOLO para IP colombianas ── */
async function pagarWompi({ montoCOP, referencia, email, descripcion }) {
    // Doble verificación: bloquear si IP no es Colombia
    const pais = await detectarPaisAC();
    if (pais !== 'CO') {
        _acToast('Este método de pago solo está disponible para clientes en Colombia.');
        return;
    }
    const centavos = Math.round(montoCOP * 100);
    const params = new URLSearchParams({
        'public-key':      AC_PAGOS.wompi.publicKey,
        'currency':        'COP',
        'amount-in-cents': String(centavos),
        'reference':       referencia,
        'redirect-url':    `${window.location.origin}/seguimiento-caso?pedido=${referencia}&pago=ok`
    });
    if (email)       params.set('customer-email', email);
    if (descripcion) params.set('checkout[name]', descripcion);

    const popup = window.open(
        `https://checkout.wompi.co/p/?${params.toString()}`,
        'wompi-ac',
        'width=520,height=700,scrollbars=yes'
    );
    if (!popup) _acToast('Activa las ventanas emergentes para continuar con el pago.');
}

/* ── PayPal — checkout internacional (USD) ── */
let _ppLoaded = false;
function cargarPayPal() {
    if (_ppLoaded || document.getElementById('ac-paypal-sdk')) return Promise.resolve();
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.id = 'ac-paypal-sdk';
        s.src = `https://www.paypal.com/sdk/js?client-id=${AC_PAGOS.paypal.clientId}&currency=USD&intent=capture&disable-funding=credit,card`;
        s.onload  = () => { _ppLoaded = true; res(); };
        s.onerror = () => rej(new Error('PayPal SDK no cargó'));
        document.head.appendChild(s);
    });
}

/* ── PayPal — SOLO para clientes internacionales (no Colombia) ── */
async function renderPayPal({ montoUSD, referencia, descripcion, containerId, onSuccess }) {
    const pais = await detectarPaisAC();
    if (pais === 'CO') {
        const cont = document.getElementById(containerId || 'ac-paypal-container');
        if (cont) cont.innerHTML = '<div style="font-size:.75rem;color:#94a3b8;padding:8px">PayPal no disponible para Colombia. Usa Wompi o transferencia.</div>';
        return;
    }
    try { await cargarPayPal(); } catch {
        _acToast('No se pudo conectar con PayPal. Intenta con Wise o contáctanos.');
        return;
    }
    const cont = document.getElementById(containerId || 'ac-paypal-container');
    if (!cont) return;
    cont.innerHTML = '';
    window.paypal.Buttons({
        createOrder: (d, a) => a.order.create({
            purchase_units: [{
                reference_id: referencia,
                description:  descripcion || 'Alejandro Carvajal CAD/CAM — Diseño dental',
                amount: { value: montoUSD.toFixed(2), currency_code: 'USD' }
            }]
        }),
        onApprove: (d, a) => a.order.capture().then(details => {
            if (onSuccess) onSuccess({ referencia, details });
            else window.location.href = `/seguimiento-caso?pedido=${referencia}&pago=ok`;
        }),
        onError: () => _acToast('Pago no completado. Intenta de nuevo o usa Wise.')
    }).render(`#${containerId || 'ac-paypal-container'}`);
}

/* ── Selector inteligente por país ── */
async function inicializarPagosAC(containerId, montoUSD, referencia, emailCliente, descripcion) {
    const pais = await detectarPaisAC();
    const cont = document.getElementById(containerId);
    if (!cont) return;

    if (pais === 'CO') {
        /* Colombia: mostrar Wompi (COP) + opción Wise/transferencia */
        const montoCOP = Math.round(montoUSD * TASA_COP_USD);
        const totalWompi = Math.round(montoCOP * 1.03);
        cont.innerHTML = `
        <div style="margin:16px 0">
            <div style="font-size:.72rem;font-weight:800;letter-spacing:1px;color:#D4AF37;margin-bottom:10px;text-transform:uppercase">🇨🇴 Elige cómo pagar</div>
            <div style="display:flex;flex-direction:column;gap:8px">
                <button onclick="pagarWompi({montoCOP:${totalWompi},referencia:'${referencia}',email:'${emailCliente||''}',descripcion:'${descripcion||'Diseño CAD'}'});this.disabled=true;this.textContent='Abriendo checkout…'"
                    style="width:100%;padding:13px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;border:none;border-radius:9px;font-weight:800;font-size:.9rem;cursor:pointer">
                    💳 Pagar con PSE / Nequi / Tarjeta · $${totalWompi.toLocaleString('es-CO')} COP (+3%)
                </button>
                <div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.15);border-radius:9px;padding:14px">
                    <div style="font-size:.72rem;font-weight:800;color:#D4AF37;margin-bottom:8px;text-transform:uppercase">🏦 Transferencia directa (sin comisión)</div>
                    <div style="font-size:.8rem;color:#e2e8f0;line-height:1.9">
                        <strong style="color:#D4AF37">Nequi / Daviplata:</strong> +57 321 958 1949<br>
                        <strong style="color:#D4AF37">Bancolombia:</strong> Alejandro Carvajal · Ref: ${referencia}
                    </div>
                    <div style="font-size:.7rem;color:#94a3b8;margin-top:6px">Sube el comprobante abajo para confirmar tu pedido.</div>
                </div>
            </div>
        </div>`;
    } else {
        /* Internacional: PayPal + Wise */
        const recargo = parseFloat((montoUSD * AC_PAGOS.paypal.recargo).toFixed(2));
        const total   = parseFloat((montoUSD + recargo).toFixed(2));
        cont.innerHTML = `
        <div style="margin:16px 0">
            <div style="font-size:.72rem;font-weight:800;letter-spacing:1px;color:#60a5fa;margin-bottom:10px;text-transform:uppercase">🌍 International Payment — ${pais}</div>
            <div style="display:flex;flex-direction:column;gap:8px">
                <div style="background:rgba(0,97,255,.06);border:1px solid rgba(0,97,255,.25);border-radius:9px;padding:14px">
                    <div style="font-size:.78rem;font-weight:800;color:#60a5fa;margin-bottom:8px">PayPal (+5.4% fee = $${recargo} USD)</div>
                    <div id="ac-paypal-container"></div>
                </div>
                <div style="background:rgba(0,210,255,.04);border:1px solid rgba(0,210,255,.15);border-radius:9px;padding:14px">
                    <div style="font-size:.72rem;font-weight:800;color:#00d2ff;margin-bottom:8px;text-transform:uppercase">💸 Wise — No fee</div>
                    <div style="font-size:.8rem;color:#e2e8f0;line-height:1.9">
                        <strong style="color:#00d2ff">Email:</strong> jackalejandroc@gmail.com<br>
                        <strong style="color:#00d2ff">Amount:</strong> $${montoUSD.toFixed(2)} USD<br>
                        <strong style="color:#00d2ff">Reference:</strong> ${referencia}
                    </div>
                </div>
            </div>
        </div>`;
        renderPayPal({ montoUSD: total, referencia, descripcion, containerId: 'ac-paypal-container' });
    }
}
