/**
 * Alejandro Carvajal — Header & Navbar Global
 * Inyecta navegación en todas las páginas públicas.
 */
(function () {
  'use strict';
  if (document.getElementById('ac-header')) return;

  /* ── GA4 Global ── */
  if (!document.getElementById('ac-ga4')) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',wait_for_update:500});
    gtag('js', new Date());
    gtag('config','G-XXXXXXXXXX',{anonymize_ip:true}); // ← reemplazar con GA4 ID
    var _s = document.createElement('script');
    _s.id = 'ac-ga4'; _s.async = true;
    _s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(_s);
  }

  var css = [
    ':root{--gold:#c9a96e;--gold2:#e8c97a;--cyan:#00d2ff;--bg:#060608;--card:#0e1018;--text:#f1f0ed;--muted:#8a8a9a;--border:rgba(201,169,110,.15);}',
    '#ac-header{position:sticky;top:0;z-index:1000;background:rgba(6,6,8,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);}',
    '#ac-nav{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;}',
    '#ac-logo{text-decoration:none;display:flex;flex-direction:column;line-height:1.1;}',
    '#ac-logo .name{font-size:1rem;font-weight:900;letter-spacing:2px;color:var(--gold);text-transform:uppercase;}',
    '#ac-logo .role{font-size:.6rem;letter-spacing:3px;color:var(--muted);text-transform:uppercase;}',
    '#ac-links{display:flex;align-items:center;gap:28px;}',
    '#ac-links a{color:var(--muted);text-decoration:none;font-size:.82rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;transition:color .2s;}',
    '#ac-links a:hover,#ac-links a.active{color:var(--gold);}',
    '.ac-cta{background:linear-gradient(135deg,#c9a96e,#a07840)!important;color:#000!important;padding:9px 20px!important;border-radius:8px!important;}',
    '.ac-cta:hover{opacity:.85;transform:translateY(-1px);}',
    '#ac-menu-btn{display:none;background:none;border:none;color:var(--gold);font-size:1.3rem;cursor:pointer;padding:4px;}',
    '#ac-mobile{display:none;flex-direction:column;gap:0;background:rgba(6,6,8,.98);border-top:1px solid var(--border);padding:12px 0;}',
    '#ac-mobile a{color:var(--muted);text-decoration:none;font-size:.85rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:13px 24px;display:block;border-bottom:1px solid rgba(255,255,255,.04);transition:color .2s;}',
    '#ac-mobile a:hover{color:var(--gold);background:rgba(201,169,110,.05);}',
    '@media(max-width:768px){#ac-links{display:none;}#ac-menu-btn{display:block;}}',
  ].join('');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var path = window.location.pathname;
  function ac(p){ return path === p || path.startsWith(p+'/') ? ' class="active"' : ''; }

  var header = document.createElement('header');
  header.id = 'ac-header';
  header.innerHTML =
    '<nav id="ac-nav">' +
      '<a href="/" id="ac-logo">' +
        '<span class="name">Alejandro Carvajal</span>' +
        '<span class="role">CAD · CAM · Diseñador Dental</span>' +
      '</a>' +
      '<div id="ac-links">' +
        '<a href="/"' + ac('/') + '>Inicio</a>' +
        '<a href="/portafolio"' + ac('/portafolio') + '>Portafolio</a>' +
        '<a href="/cursos"' + ac('/cursos') + '>Cursos</a>' +
        '<a href="/soporte"' + ac('/soporte') + '>Soporte Exocad</a>' +
        '<a href="/blog"' + ac('/blog') + '>Blog</a>' +
        '<a href="https://wa.me/573219581949?text=Hola%20Alejandro%2C%20quiero%20cotizar%20un%20diseño%20CAD." target="_blank" rel="noopener noreferrer" class="ac-cta">Contactar</a>' +
      '</div>' +
      '<button id="ac-menu-btn" onclick="document.getElementById(\'ac-mobile\').style.display=document.getElementById(\'ac-mobile\').style.display===\'flex\'?\'none\':\'flex\'" aria-label="Menú">☰</button>' +
    '</nav>' +
    '<div id="ac-mobile">' +
      '<a href="/">Inicio</a>' +
      '<a href="/portafolio">Portafolio</a>' +
      '<a href="/cursos">Cursos</a>' +
      '<a href="/soporte">Soporte Exocad</a>' +
      '<a href="/blog">Blog</a>' +
      '<a href="https://wa.me/573219581949?text=Hola%20Alejandro%2C%20quiero%20cotizar%20un%20diseño%20CAD." target="_blank" rel="noopener noreferrer">💬 Contactar por WhatsApp</a>' +
    '</div>';

  document.body.insertBefore(header, document.body.firstChild);
})();
