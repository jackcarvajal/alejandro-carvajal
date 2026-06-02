/**
 * Alejandro Carvajal — Footer Global
 * Mismo estilo que PRODIGY. Marca personal.
 */
(function () {
  'use strict';
  if (document.getElementById('ac-footer-root')) return;

  var css = [
    '#ac-footer-root{background:#050505;border-top:1px solid rgba(212,175,55,.2);padding:64px 0 28px;font-family:inherit;}',
    '#ac-footer-root .fg{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;max-width:1260px;margin:0 auto 48px;padding:0 28px;}',
    '#ac-footer-root .fc h4{color:#D4AF37;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 18px;padding-bottom:8px;border-bottom:1px solid rgba(212,175,55,.25);display:inline-block;}',
    '#ac-footer-root .fc ul{list-style:none;padding:0;margin:0;}',
    '#ac-footer-root .fc li{padding:5px 0;color:#94a3b8;font-size:13.5px;}',
    '#ac-footer-root .fc a{color:#94a3b8;text-decoration:none;transition:color .25s,padding-left .2s;}',
    '#ac-footer-root .fc a:hover{color:#D4AF37;padding-left:4px;}',
    '#ac-footer-root .flogo{font-size:20px;font-weight:900;letter-spacing:2px;color:#D4AF37;margin:0 0 3px;}',
    '#ac-footer-root .ftag{font-size:.6rem;text-transform:uppercase;letter-spacing:3px;color:#94a3b8;margin:0 0 12px;}',
    '#ac-footer-root .fdesc{color:#94a3b8;font-size:12.5px;line-height:1.65;margin:0 0 14px;}',
    '#ac-footer-root .fgeo{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:#94a3b8;}',
    '#ac-footer-root .fgeo-dot{width:7px;height:7px;border-radius:50%;background:#00FF41;box-shadow:0 0 6px rgba(0,255,65,.7);flex-shrink:0;}',
    '#ac-footer-root .fsocial{display:flex;gap:10px;margin-top:16px;}',
    '#ac-footer-root .fsocial a{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);color:#e2e8f0;font-size:16px;text-decoration:none;transition:background .25s,color .25s;}',
    '#ac-footer-root .fsocial a:hover{background:rgba(212,175,55,.2);color:#D4AF37;}',
    '#ac-footer-root .fcopy{text-align:center;border-top:1px solid rgba(255,255,255,.06);max-width:1260px;margin:0 auto;padding:22px 28px 0;color:#94a3b8;font-size:12px;}',
    '#ac-footer-root .fcopy a{color:#94a3b8;text-decoration:none;transition:color .2s;}',
    '#ac-footer-root .fcopy a:hover{color:#D4AF37;}',
    '@media(max-width:960px){#ac-footer-root .fg{grid-template-columns:1fr 1fr;}}',
    '@media(max-width:520px){#ac-footer-root .fg{grid-template-columns:1fr;gap:28px;}#ac-footer-root{padding:40px 0 16px;}}',
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var footer = document.createElement('footer');
  footer.id = 'ac-footer-root';
  footer.innerHTML =
    '<div class="fg">' +
      '<div class="fc">' +
        '<div class="flogo">ALEJANDRO</div>' +
        '<div class="ftag">Carvajal · CAD · CAM · Dental</div>' +
        '<p class="fdesc">Diseñador dental especializado en Exocad y 3Shape. Diseño remoto de coronas, guías quirúrgicas, Full Arch y DSD para clínicas y laboratorios del mundo.</p>' +
        '<div style="font-size:.7rem;font-style:italic;color:#94a3b8;margin:6px 0 10px;line-height:1.5;">🌎 Bogotá, Colombia · Servicio global<br>Exocad® · 3Shape® · CoDiagnostiX®</div>' +
        '<div class="fgeo"><span class="fgeo-dot"></span>Bogotá, Colombia</div>' +
        '<div class="fsocial">' +
          '<a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
          '<a href="https://www.instagram.com/jackcarvajal/" target="_blank" rel="noopener noreferrer" title="Instagram @jackcarvajal"><i class="fab fa-instagram"></i></a>' +
          '<a href="https://www.facebook.com/profile.php?id=61575383924264" target="_blank" rel="noopener noreferrer" title="Facebook"><i class="fab fa-facebook"></i></a>' +
        '</div>' +
      '</div>' +
      '<div class="fc">' +
        '<h4>Diseño CAD</h4>' +
        '<ul>' +
          '<li><a href="diseno-remoto">Diseño Remoto</a></li>' +
          '<li><a href="calculadora-diseno">Cotizador Online</a></li>' +
          '<li><a href="envia-tu-scanner">Envía tu Escáner</a></li>' +
          '<li><a href="portafolio">Portafolio</a></li>' +
          '<li><a href="seguimiento-caso">Seguimiento de Caso</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="fc">' +
        '<h4>Formación</h4>' +
        '<ul>' +
          '<li><a href="cursos">Cursos Exocad</a></li>' +
          '<li><a href="soporte">Soporte técnico</a></li>' +
          '<li><a href="preguntas"><i class="fas fa-circle-question" style="color:#D946A6;margin-right:5px;" aria-hidden="true"></i>Preguntas frecuentes</a></li>' +
          '<li><a href="blog">Blog técnico</a></li>' +
          '<li><a href="instalar-app">📱 Instalar App</a></li>' +
        '</ul>' +
        '<h4 style="margin-top:20px;">Empresa</h4>' +
        '<ul>' +
          '<li><a href="sobre-mi">Sobre Alejandro</a></li>' +
          '<li><a href="terminos-y-legal">Términos y Privacidad</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="fc">' +
        '<h4>Portal Clientes</h4>' +
        '<a href="app/login.html" style="display:block;border:1px solid #D4AF37;color:#D4AF37;padding:11px 16px;text-align:center;text-decoration:none;border-radius:4px;margin-bottom:18px;font-size:13px;font-weight:700;letter-spacing:.5px;transition:background .3s,color .3s;" onmouseover="this.style.background=\'#D4AF37\';this.style.color=\'#000\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D4AF37\'"><i class="fas fa-key"></i> Acceso Clientes</a>' +
        '<ul>' +
          '<li><a href="https://wa.me/573219581949?text=Hola%20Alejandro%2C%20necesito%20soporte" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp" style="color:#25D366;margin-right:6px"></i>Soporte directo</a></li>' +
          '<li><a href="mailto:jackalejandroc@gmail.com"><i class="far fa-envelope" style="margin-right:6px"></i>jackalejandroc@gmail.com</a></li>' +
          '<li><a href="tel:+573219581949"><i class="fas fa-phone" style="margin-right:6px"></i>+57 321 958 1949</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="fcopy">' +
      '<p>© 2026 Alejandro Carvajal · Diseñador CAD/CAM Dental · Bogotá, Colombia · ' +
        '<a href="terminos-y-legal">Términos</a> · ' +
        '<a href="terminos-y-legal#privacidad">Privacidad</a>' +
      '</p>' +
    '</div>';

  document.body.appendChild(footer);

  /* ── UTM + Conversions (diferido) ── */
  function _load(src){ var s=document.createElement('script');s.src=src;s.defer=true;document.body.appendChild(s); }
  _load('/js/utm-tracker.js?v=20260528');
  _load('/js/conversions.js?v=20260528');
  _load('/js/geo-detect.js?v=20260528');

  /* ── Cookie consent ── */
  var _ok = localStorage.getItem('ac_cookies_ok');
  if (_ok==='1'&&window.gtag) window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied'});
  else if (_ok==='0'&&window.gtag) window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied'});
  if (!_ok) {
    var cb = document.createElement('div');
    cb.id = 'ac-cookie-banner';
    cb.setAttribute('role', 'dialog');
    cb.setAttribute('aria-label', 'Aviso de cookies');
    cb.setAttribute('aria-modal', 'false');
    cb.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#0d1520;border-top:1px solid rgba(212,175,55,.3);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:inherit;font-size:.82rem;color:#94a3b8;';
    cb.innerHTML = '<span>Usamos <strong style="color:#e2e8f0">cookies analíticas</strong> para mejorar el servicio. <a href="/terminos-y-legal#privacidad" style="color:#D946A6">Ver política</a></span>' +
      '<div style="display:flex;gap:8px;">' +
        '<button type="button" onclick="localStorage.setItem(\'ac_cookies_ok\',\'0\');if(window.gtag)window.gtag(\'consent\',\'update\',{analytics_storage:\'denied\',ad_storage:\'denied\'});document.getElementById(\'ac-cookie-banner\').remove();" style="background:transparent;color:#94a3b8;border:1px solid #334155;border-radius:8px;padding:12px 16px;font-weight:600;cursor:pointer;font-size:.82rem;min-height:44px;">Solo esenciales</button>' +
        '<button type="button" onclick="localStorage.setItem(\'ac_cookies_ok\',\'1\');if(window.gtag)window.gtag(\'consent\',\'update\',{analytics_storage:\'granted\',ad_storage:\'denied\'});document.getElementById(\'ac-cookie-banner\').remove();" style="background:#D946A6;color:#fff;border:none;border-radius:8px;padding:12px 20px;font-weight:700;cursor:pointer;font-size:.82rem;min-height:44px;">Aceptar</button>' +
      '</div>';
    document.body.appendChild(cb);
  }
})();
