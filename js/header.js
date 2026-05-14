/**
 * Alejandro Carvajal — Header Global v1
 * Mismos colores y estructura que PRODIGY. Marca personal.
 */
(function () {
  'use strict';
  if (document.getElementById('pheader-ac')) return;

  /* ── GA4 Global ── */
  if (!document.getElementById('ac-ga4')) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',wait_for_update:500});
    gtag('js', new Date());
    gtag('config','G-XXXXXXXXXX',{anonymize_ip:true});
    var _g = document.createElement('script');
    _g.id='ac-ga4'; _g.async=true;
    _g.src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(_g);
  }

  var css = [
    /* Variables — mismas que PRODIGY */
    ':root{--mg:#D946A6;--gold:#D4AF37;--cyan:#00d2ff;--bg:#050505;--card:#0d1520;--text:#e2e8f0;--muted:#94a3b8;}',
    /* Topbar */
    '#pheader-ac{position:sticky;top:0;z-index:1000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;}',
    '#pheader-ac .ac-topbar{background:rgba(5,5,5,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(212,175,55,.15);padding:0 24px;height:36px;display:flex;align-items:center;justify-content:space-between;font-size:.72rem;color:var(--muted);}',
    '#pheader-ac .ac-topbar strong{color:var(--text);}',
    '#pheader-ac .ac-topbar-right{display:flex;align-items:center;gap:16px;}',
    '#pheader-ac .ac-topbar-right a{color:var(--muted);text-decoration:none;display:flex;align-items:center;gap:5px;transition:color .2s;}',
    '#pheader-ac .ac-topbar-right a:hover{color:var(--gold);}',
    /* Navbar */
    '#pheader-ac .ac-nav{background:rgba(5,5,5,.98);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.06);padding:0 24px;height:58px;display:flex;align-items:center;justify-content:space-between;max-width:100%;}',
    '#pheader-ac .ac-logo{text-decoration:none;display:flex;flex-direction:column;line-height:1.1;}',
    '#pheader-ac .ac-logo .name{font-size:.92rem;font-weight:900;letter-spacing:2.5px;color:var(--gold);text-transform:uppercase;}',
    '#pheader-ac .ac-logo .role{font-size:.55rem;letter-spacing:3px;color:var(--muted);text-transform:uppercase;}',
    '#pheader-ac .ac-links{display:flex;align-items:center;gap:24px;}',
    '#pheader-ac .ac-links a{color:var(--muted);text-decoration:none;font-size:.78rem;font-weight:700;letter-spacing:.4px;text-transform:uppercase;transition:color .2s;white-space:nowrap;}',
    '#pheader-ac .ac-links a:hover,#pheader-ac .ac-links a.active{color:var(--gold);}',
    '#pheader-ac .ac-cta{background:linear-gradient(135deg,#D946A6,#9333ea)!important;color:#fff!important;padding:9px 18px!important;border-radius:8px!important;letter-spacing:.3px!important;}',
    '#pheader-ac .ac-cta:hover{opacity:.88;transform:translateY(-1px);color:#fff!important;}',
    '#pheader-ac .ac-menu{display:none;background:none;border:none;color:var(--gold);font-size:1.3rem;cursor:pointer;padding:4px;}',
    '#pheader-ac .ac-mobile{display:none;flex-direction:column;background:rgba(5,5,5,.99);border-top:1px solid rgba(255,255,255,.06);}',
    '#pheader-ac .ac-mobile a{color:var(--muted);text-decoration:none;font-size:.82rem;font-weight:700;text-transform:uppercase;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,.04);transition:color .2s;}',
    '#pheader-ac .ac-mobile a:hover{color:var(--gold);background:rgba(212,175,55,.05);}',
    '@media(max-width:860px){#pheader-ac .ac-links{display:none;}#pheader-ac .ac-menu{display:block;}}',
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var path = window.location.pathname;
  function ac(p){ return path===p||path.startsWith(p+'/')?' class="active"':''; }

  var header = document.createElement('div');
  header.id = 'pheader-ac';
  header.innerHTML =
    /* Topbar */
    '<div class="ac-topbar">' +
      '<span>🦷 Diseñador CAD/CAM · Bogotá, Colombia · Servicio global</span>' +
      '<div class="ac-topbar-right">' +
        '<a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp" style="color:#25D366"></i> +57 321 958 1949</a>' +
        '<a href="app/login.html"><i class="fas fa-key"></i> Portal</a>' +
      '</div>' +
    '</div>' +
    /* Navbar */
    '<div class="ac-nav">' +
      '<a href="/" class="ac-logo">' +
        '<span class="name">Alejandro Carvajal</span>' +
        '<span class="role">CAD · CAM · Dental Designer</span>' +
      '</a>' +
      '<div class="ac-links">' +
        '<a href="/"'+ac('/')+'>Inicio</a>' +
        '<a href="/portafolio"'+ac('/portafolio')+'>Portafolio</a>' +
        '<a href="/diseno-remoto"'+ac('/diseno-remoto')+'>Diseño Remoto</a>' +
        '<a href="/calculadora-diseno"'+ac('/calculadora-diseno')+'>Cotizador</a>' +
        '<a href="/blog"'+ac('/blog')+'>Blog</a>' +
        '<a href="/cursos"'+ac('/cursos')+'>Cursos</a>' +
        '<a href="https://wa.me/573219581949?text=Hola%20Alejandro%2C%20quiero%20cotizar%20un%20diseño%20CAD." target="_blank" rel="noopener noreferrer" class="ac-cta"><i class="fas fa-bolt"></i> Enviar caso</a>' +
      '</div>' +
      '<button class="ac-menu" onclick="var m=document.querySelector(\'#pheader-ac .ac-mobile\');m.style.display=m.style.display===\'flex\'?\'none\':\'flex\'">☰</button>' +
    '</div>' +
    /* Mobile */
    '<div class="ac-mobile">' +
      '<a href="/">Inicio</a>' +
      '<a href="/portafolio">Portafolio</a>' +
      '<a href="/diseno-remoto">Diseño Remoto</a>' +
      '<a href="/calculadora-diseno">Cotizador</a>' +
      '<a href="/blog">Blog</a>' +
      '<a href="/cursos">Cursos</a>' +
      '<a href="https://wa.me/573219581949?text=Hola%20Alejandro%2C%20quiero%20cotizar%20un%20diseño%20CAD." target="_blank" rel="noopener noreferrer">💬 Enviar mi caso</a>' +
      '<a href="app/login.html">🔑 Portal clientes</a>' +
    '</div>';

  document.body.insertBefore(header, document.body.firstChild);
})();
