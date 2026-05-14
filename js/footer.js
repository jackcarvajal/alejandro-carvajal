/**
 * Alejandro Carvajal — Footer Global
 */
(function () {
  'use strict';
  if (document.getElementById('ac-footer')) return;

  var css = [
    '#ac-footer{background:#060608;border-top:1px solid rgba(201,169,110,.12);padding:56px 0 24px;font-family:inherit;}',
    '#ac-footer .ac-fg{max-width:1200px;margin:0 auto;padding:0 28px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;}',
    '#ac-footer h4{color:#c9a96e;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;padding-bottom:8px;border-bottom:1px solid rgba(201,169,110,.2);display:inline-block;}',
    '#ac-footer ul{list-style:none;padding:0;margin:0;}',
    '#ac-footer li{padding:5px 0;font-size:.84rem;color:var(--muted,#8a8a9a);}',
    '#ac-footer a{color:var(--muted,#8a8a9a);text-decoration:none;transition:color .2s,padding-left .18s;}',
    '#ac-footer a:hover{color:#c9a96e;padding-left:4px;}',
    '#ac-footer .ac-brand-logo{font-size:1.15rem;font-weight:900;letter-spacing:3px;color:#c9a96e;margin-bottom:3px;}',
    '#ac-footer .ac-brand-role{font-size:.6rem;letter-spacing:3px;color:#8a8a9a;text-transform:uppercase;margin-bottom:12px;}',
    '#ac-footer .ac-brand-desc{color:#8a8a9a;font-size:.8rem;line-height:1.7;margin:0 0 16px;}',
    '#ac-footer .ac-social{display:flex;gap:10px;margin-top:14px;}',
    '#ac-footer .ac-social a{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.07);color:#e2e8f0;font-size:.9rem;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s,color .2s;}',
    '#ac-footer .ac-social a:hover{background:rgba(201,169,110,.2);color:#c9a96e;padding-left:0;}',
    '#ac-footer .ac-copy{text-align:center;border-top:1px solid rgba(255,255,255,.05);max-width:1200px;margin:0 auto;padding:20px 28px 0;color:#8a8a9a;font-size:.73rem;}',
    '#ac-footer .ac-copy a{color:#8a8a9a;text-decoration:none;}',
    '#ac-footer .ac-copy a:hover{color:#c9a96e;padding-left:0;}',
    '@media(max-width:960px){#ac-footer .ac-fg{grid-template-columns:1fr 1fr;}}',
    '@media(max-width:520px){#ac-footer .ac-fg{grid-template-columns:1fr;gap:28px;}}',
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var footer = document.createElement('footer');
  footer.id = 'ac-footer';
  footer.innerHTML =
    '<div class="ac-fg">' +
      '<div>' +
        '<div class="ac-brand-logo">ALEJANDRO</div>' +
        '<div class="ac-brand-role">Carvajal · CAD · CAM · Dental</div>' +
        '<p class="ac-brand-desc">Diseñador dental especializado en flujos CAD/CAM. Exocad, 3Shape, CoDiagnostiX. Servicio remoto a clínicas y laboratorios de todo el mundo.</p>' +
        '<div style="font-size:.7rem;color:#8a8a9a;">🌍 Bogotá, Colombia · Servicio global</div>' +
        '<div class="ac-social">' +
          '<a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
          '<a href="https://www.instagram.com/labdentalprodigy/" target="_blank" rel="noopener noreferrer" title="Instagram"><i class="fab fa-instagram"></i></a>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<h4>Servicios</h4>' +
        '<ul>' +
          '<li><a href="/portafolio">Portafolio CAD</a></li>' +
          '<li><a href="/#servicios">Diseño Remoto</a></li>' +
          '<li><a href="/#servicios">Guías Quirúrgicas</a></li>' +
          '<li><a href="/#servicios">Férulas & Ortodoncia</a></li>' +
          '<li><a href="/#servicios">Full Arch / DSD</a></li>' +
        '</ul>' +
      '</div>' +
      '<div>' +
        '<h4>Formación</h4>' +
        '<ul>' +
          '<li><a href="/cursos">Cursos Exocad</a></li>' +
          '<li><a href="/cursos">Soporte técnico</a></li>' +
          '<li><a href="/blog">Blog técnico</a></li>' +
          '<li><a href="/soporte">Resolución de errores</a></li>' +
        '</ul>' +
      '</div>' +
      '<div>' +
        '<h4>Contacto</h4>' +
        '<ul>' +
          '<li><a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp" style="color:#25D366;margin-right:6px"></i>+57 321 958 1949</a></li>' +
          '<li><a href="mailto:alejandro@prodigylabdental.com"><i class="far fa-envelope" style="margin-right:6px"></i>alejandro@prodigylabdental.com</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="ac-copy">' +
      '<p>© 2026 Alejandro Carvajal · Diseñador CAD/CAM Dental · Bogotá, Colombia · ' +
        '<a href="/terminos">Términos</a> · <a href="/terminos#privacidad">Privacidad</a>' +
      '</p>' +
    '</div>';

  document.body.appendChild(footer);

  /* Cookie consent simple */
  if (!localStorage.getItem('ac_cookies_ok')) {
    var cb = document.createElement('div');
    cb.id = 'ac-cookie';
    cb.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#0e1018;border-top:1px solid rgba(201,169,110,.25);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:inherit;font-size:.8rem;color:#8a8a9a;';
    cb.innerHTML = '<span>Usamos cookies analíticas para mejorar la experiencia. <a href="/terminos#privacidad" style="color:#c9a96e">Ver política</a></span>' +
      '<div style="display:flex;gap:8px;">' +
        '<button onclick="localStorage.setItem(\'ac_cookies_ok\',\'0\');document.getElementById(\'ac-cookie\').remove();" style="background:transparent;color:#8a8a9a;border:1px solid #334155;border-radius:6px;padding:7px 14px;cursor:pointer;font-size:.8rem;">Rechazar</button>' +
        '<button onclick="localStorage.setItem(\'ac_cookies_ok\',\'1\');document.getElementById(\'ac-cookie\').remove();" style="background:#c9a96e;color:#000;border:none;border-radius:6px;padding:7px 18px;cursor:pointer;font-size:.8rem;font-weight:700;">Aceptar</button>' +
      '</div>';
    document.body.appendChild(cb);
  }
})();
