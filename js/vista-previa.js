/* VISTA PREVIA (rama vista-previa, NO producción): mejoras propuestas y aún sin aprobar, sobre las páginas reales.
   Mejora 2: foto real en corona-cad · 4: el flujo de diseño se abre sin iniciar sesión (en esta rama se quitó la
   exigencia de sesión de flujo-diseno.html) y la cuenta se pide en el último paso, antes de pagar. */
(function () {
  'use strict';
  var ruta = location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  var FOTO = function (c, f) { return 'https://zgihrwqfyvgyapbwzkvw.supabase.co/storage/v1/render/image/public/portafolio/' + c + '/gallery/' + f + '?width=900&height=675&resize=cover&quality=78'; };
  function css(t) { var s = document.createElement('style'); s.textContent = t; document.head.appendChild(s); }
  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  listo(function () {
    css('#vp-aviso{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:100000;background:#D4AF37;color:#111;font:800 12px/1.2 Inter,system-ui,sans-serif;letter-spacing:.04em;padding:7px 12px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.45);pointer-events:none;white-space:nowrap}');
    var a = document.createElement('div'); a.id = 'vp-aviso'; a.textContent = 'VISTA PREVIA · CAMBIOS SIN APROBAR'; document.body.appendChild(a);
  });

  /* ── 2. corona-cad: foto real del diseño ── */
  if (ruta === '/corona-cad') listo(function () {
    css('.fx{margin:24px auto 0;border-radius:16px;overflow:hidden;border:1px solid rgba(212,175,55,.25);background:#0d1525;max-width:560px;text-align:left}' +
      '.fx img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}.fx figcaption{padding:10px 14px;font:500 .95rem/1.45 Inter,system-ui,sans-serif;color:#cbd5e1}');
    var stats = [].slice.call(document.querySelectorAll('div')).filter(function (d) { return d.style.display === 'flex' && /Revisiones incluidas/.test(d.textContent) && d.children.length === 3; })[0];
    var ref = stats || document.querySelector('.hero-sub'); if (!ref) return;
    var f = document.createElement('figure'); f.className = 'fx';
    f.innerHTML = '<img src="' + FOTO('caso-1784774363552', 'foto-3.jpeg') + '" alt="Diseño real de coronas en Exocad"><figcaption>Diseño real en Exocad. Lo apruebas antes de que exporte el STL.</figcaption>';
    ref.after(f);
  });

  /* ── 4. Flujo de diseño sin iniciar sesión; cuenta al pagar ── */
  if (ruta === '/flujo-diseno') listo(function () {
    document.body.style.visibility = 'visible';
    var main = document.getElementById('main-content'); if (!main) return;
    [].slice.call(main.children).filter(function (d) { return d.tagName === 'DIV' && (/Ver FAQ/.test(d.textContent) || /orden en papel o PDF/.test(d.textContent)) && d.textContent.length < 300; }).forEach(function (d) { d.remove(); });
    var ciclo = document.getElementById('banner-ciclo'); if (ciclo) ciclo.remove();
    [].slice.call(document.querySelectorAll('div')).filter(function (d) { return /Recibimos casos 24\/7/i.test(d.textContent) && d.textContent.length < 500; }).forEach(function (d) { d.remove(); });
    css('.fxh{text-align:left;padding:18px 0 6px}.fxh h1{font:800 1.75rem/1.15 Inter,system-ui,sans-serif;color:#f8fafc;margin:0 0 8px;letter-spacing:-.01em}' +
      '.fxh p{font:400 1rem/1.55 Inter,system-ui,sans-serif;color:#cbd5e1;margin:0 0 14px}.fxh ol{list-style:none;display:flex;gap:6px;flex-wrap:wrap;padding:0;margin:0 0 12px}' +
      '.fxh li{font:600 .85rem Inter,system-ui,sans-serif;color:#cbd5e1;background:#1a2332;border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:6px 11px}.fxh li b{color:#D4AF37;margin-right:4px}' +
      '.fxh .l{font-size:.9rem;color:#94a3b8}.fxh .l a{color:#00d2ff;font-weight:700;text-decoration:none}' +
      '.accordion-header h2,.timeline-section h2{text-transform:none!important;letter-spacing:0!important;font-size:1.05rem!important}' +
      '.cx{margin:16px 0;padding:16px;border-radius:14px;background:#1a2332;border:1px solid rgba(217,70,166,.35);font-family:Inter,system-ui,sans-serif}' +
      '.cx h3{font-size:1.05rem;font-weight:800;color:#f8fafc;margin:0 0 6px}.cx p{font-size:.92rem;line-height:1.5;color:#cbd5e1;margin:0 0 12px}' +
      '.cx .g{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:13px;border-radius:10px;background:#fff;color:#1f2937;font-weight:700;font-size:.98rem;border:0;margin-bottom:10px;cursor:pointer}' +
      '.cx input{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:#0d1525;color:#e2e8f0;font-size:.98rem;margin-bottom:8px}' +
      '.cx .m{width:100%;padding:13px;border-radius:10px;border:0;background:#D946A6;color:#fff;font-weight:800;font-size:1rem;cursor:pointer}' +
      '.cx small{display:block;margin-top:8px;color:#94a3b8;font-size:.82rem}.cx .vp{display:none;margin-top:10px;padding:10px 12px;border-radius:10px;background:rgba(212,175,55,.12);color:#f5e6b3;font-size:.88rem}');
    var hd = document.querySelector('.container > header');
    if (hd) {
      hd.className = 'fxh';
      hd.innerHTML = '<h1>Envía tu caso de diseño CAD</h1><p>Unos 2 minutos: eliges el diseño, subes el escaneo y pagas al confirmar. Sin iniciar sesión: la cuenta se crea al pagar.</p>' +
        '<ol><li><b>1</b>Diseño</li><li><b>2</b>Entrega</li><li><b>3</b>Archivos</li><li><b>4</b>Tus datos</li><li><b>5</b>Pago</li></ol>' +
        '<p class="l"><a href="/preguntas">Preguntas</a> · Recibimos casos 24/7 (corte 5:00 PM)</p>';
    }
    var w = main;
    var datos = [].slice.call(w.children).filter(function (e) { return e.matches('.accordion') && /DATOS DEL PROFESIONAL/.test(e.textContent.slice(0, 300)); })[0];
    var archivos = [].slice.call(w.children).filter(function (e) { return e.matches('.accordion') && /CHECKLIST DE ARCHIVOS/.test(e.textContent.slice(0, 300)); })[0];
    var dis = [].slice.call(w.children).filter(function (e) { return e.matches('.accordion') && /TIPO DE DISEÑO CAD/.test(e.textContent.slice(0, 300)); })[0];
    if (datos && archivos) { archivos.after(datos); datos.classList.remove('active'); if (dis) dis.classList.add('active'); }
    var ren = [[/2\. TIPO DE DISEÑO CAD/, '1. ¿Qué diseño necesitas?'], [/3\. TIEMPO DE ENTREGA ESTIMADO/, '2. Tiempo de entrega'], [/4\. CHECKLIST DE ARCHIVOS/, '3. Archivos del caso'], [/1\. DATOS DEL PROFESIONAL/, '4. Tus datos'], [/5\. CONFIRMACIÓN FINAL/, '5. Confirmar y pagar']];
    [].forEach.call(w.querySelectorAll('h2'), function (h) { ren.forEach(function (r) { if (r[0].test(h.textContent)) h.textContent = r[1]; }); });

    // Último paso: crear la cuenta para pagar (en la vista previa los botones no crean cuentas)
    var pagos = document.getElementById('ac-pagos-container');
    if (pagos) {
      var box = document.createElement('div'); box.className = 'cx';
      box.innerHTML = '<h3>Último paso: crea tu cuenta para pagar</h3>' +
        '<p>Tu caso ya está listo. Con la cuenta pagas, ves el diseño, pides cambios y descargas el STL. Toma 10 segundos.</p>' +
        '<button class="g" type="button"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg> Continuar con Google</button>' +
        '<input type="email" id="vp-correo" placeholder="o tu correo: doctor@clinica.com" autocomplete="email"><button class="m" type="button">Crear cuenta y pagar</button>' +
        '<small>Si ya tienes cuenta, entra con el mismo correo y el caso queda en tu historial.</small>' +
        '<div class="vp" role="status">Esto es la vista previa: aquí no se crea la cuenta ni se cobra. En la web real, al tocar el botón se crea la cuenta y sigue el pago.</div>';
      [].forEach.call(box.querySelectorAll('button'), function (b) { b.onclick = function () { box.querySelector('.vp').style.display = 'block'; }; });
      pagos.before(box);
    }
  });
})();
