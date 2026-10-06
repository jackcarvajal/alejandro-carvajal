/**
 * Alejandro Carvajal — Header Global
 * Estructura 100% idéntica a PRODIGY. Solo cambia la marca y los links.
 */

/* ── AVISO DE COOKIES: uno solo, el de footer.js (oct-2026). Antes header.js mostraba otro encima (en Alejandro,
   en inglés). La decisión que alguien tomó en el aviso viejo («pg_cookies_decision») se sigue respetando. */

window._IDIOMA_CFG = {"hubEn": "/en/remote-design", "paginasEn": ["/envia-tu-scanner", "/preguntas", "/soporte", "/portafolio"], "mapaEn": {"/": "/en/remote-design", "/diseno-remoto": "/en/remote-design", "/calculadora-diseno": "/en/remote-design", "/corona-cad": "/en/remote-design", "/diseno-full-arch": "/en/all-on-x", "/full-arch-cad": "/en/all-on-x", "/rehabilitacion-oral": "/en/all-on-x", "/alineadores": "/en/clear-aligners", "/estetica-implantes": "/en/implant-esthetics", "/diseno-implante-digital": "/en/implant-esthetics", "/diseno-puente-implante": "/en/implant-esthetics", "/diseno-sonrisa": "/en/smile-design", "/guias-quirurgicas": "/en/surgical-guides", "/guias-quirurgicas-cad": "/en/surgical-guides", "/terminos-y-legal": "/en/veneer-terms"}, "esDe": {"/en/remote-design": "/diseno-remoto", "/en/all-on-x": "/diseno-full-arch", "/en/clear-aligners": "/alineadores", "/en/implant-esthetics": "/estetica-implantes", "/en/smile-design": "/diseno-sonrisa", "/en/surgical-guides": "/guias-quirurgicas", "/en/veneer-terms": "/terminos-y-legal", "/en/veneers": "/diseno-sonrisa"}};
/* ── IDIOMA: ES · EN · PT (oct-2026, igual en ambas webs; solo cambia _IDIOMA_CFG) ─────────────────────────
   · ES: el sitio está escrito en español.
   · EN: traducción TÉCNICA hecha a mano (odontología digital / CAD-CAM) de las páginas de /i18n/en.json → se
     traducen en la misma página. En las demás, EN lleva a su versión en inglés (/en/…) o a la portada en inglés:
     nunca una página mitad español, mitad inglés.
   · PT: traducción automática de Google de la página completa (para el cliente que la quiera en cualquier página).
   Estado: localStorage 'prd_lang' (es | en | pt). */
(function () {
  var C = window._IDIOMA_CFG;
  function ruta() { return location.pathname.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/+$/, '') || '/'; }
  function guardado() { try { return localStorage.getItem('prd_lang') || 'es'; } catch (e) { return 'es'; } }
  function guardar(l) { try { localStorage.setItem('prd_lang', l); } catch (e) {} }
  var enIngles = ruta().indexOf('/en/') === 0;
  var enCompleta = C.paginasEn.indexOf(ruta()) >= 0;
  // idioma del texto de ESTA página (lo usan el menú, el pie e i18n.js)
  window._phdrIdiomaPagina = function () { return enIngles || (guardado() === 'en' && enCompleta) ? 'en' : 'es'; };

  function cookieGT(v) {
    var d = location.hostname.replace(/^www\./, ''), fin = v ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=' + (v || '') + ';path=/' + fin;
    document.cookie = 'googtrans=' + (v || '') + ';path=/;domain=.' + d + fin;
  }
  // las marcas no se traducen («ALEJANDRO» → «ALEXANDRE», «PRODIGY» → «PRODÍGIO»)
  function protegerMarcas() {
    var re = /\b(PRODIGY|Prodigy|ProDigy|Alejandro Carvajal|ALEJANDRO CARVAJAL|ALEJANDRO|Alejandro|Exocad|exocad|3Shape|CoDiagnostiX|coDiagnostiX)\b/;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), lista = [], n;
    while ((n = w.nextNode())) if (re.test(n.nodeValue) && n.parentElement && !n.parentElement.closest('script,style,[translate=no]')) lista.push(n);
    lista.forEach(function (t) {
      var fr = document.createDocumentFragment();
      t.nodeValue.split(new RegExp(re.source, 'g')).forEach(function (p, i) {
        if (!p) return;
        if (i % 2) { var s = document.createElement('span'); s.setAttribute('translate', 'no'); s.className = 'notranslate'; s.textContent = p; fr.appendChild(s); }
        else fr.appendChild(document.createTextNode(p));
      });
      t.parentNode.replaceChild(fr, t);
    });
  }
  function activarPT() {
    cookieGT('/es/pt');
    if (document.getElementById('gt-script')) return;
    protegerMarcas();
    var st = document.createElement('style');
    st.textContent = 'iframe.skiptranslate,.goog-te-banner-frame,#goog-gt-tt,.goog-te-balloon-frame,.VIpgJd-ZVi9od-ORHb-OEVmcd{display:none!important}' +
      'body{top:0!important;position:static!important}.goog-text-highlight{background:none!important;box-shadow:none!important}#gt-oculto{display:none}';
    document.head.appendChild(st);
    var h = document.createElement('div'); h.id = 'gt-oculto'; document.body.appendChild(h);
    window._phdrGT = function () { new window.google.translate.TranslateElement({ pageLanguage: 'es', includedLanguages: 'pt', autoDisplay: false }, 'gt-oculto'); };
    var s = document.createElement('script'); s.id = 'gt-script'; s.async = true;
    s.src = 'https://translate.google.com/translate_a/element.js?cb=_phdrGT';
    document.body.appendChild(s);
  }

  // EN en la misma página: diccionario técnico; sigue traduciendo lo que aparezca después (filtros, IA, paginador)
  function traducirEN() {
    fetch('/i18n/en.json').then(function (r) { return r.json(); }).then(function (D) {
      var T = D.textos || {}, OMITIR = '[translate=no],.notranslate,script,style,textarea,#pg-msgs,.pg-chat-msgs,.oia-cuerpo,.oia-q,#casesGrid h3,#casesGrid .card-body p';
      var traducir = function (raiz) {
        if (!raiz || raiz.nodeType !== 1 || raiz.closest(OMITIR)) return;
        var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT), n, k, m;
        while ((n = w.nextNode())) {
          if (!n.parentElement || n.parentElement.closest(OMITIR)) continue;
          k = n.nodeValue.replace(/\s+/g, ' ').trim();
          if (k && T[k]) { m = n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/); n.nodeValue = m[1] + T[k] + m[2]; }
        }
        [raiz].concat([].slice.call(raiz.querySelectorAll('[placeholder],[aria-label],[title]'))).forEach(function (e) {
          ['placeholder', 'aria-label', 'title'].forEach(function (a) { var v = e.getAttribute && e.getAttribute(a); if (v && T[v.trim()]) e.setAttribute(a, T[v.trim()]); });
        });
      };
      traducir(document.body);
      document.title = T[document.title] || document.title;
      new MutationObserver(function (ms) {
        ms.forEach(function (x) { [].forEach.call(x.addedNodes, function (nd) { traducir(nd.nodeType === 3 ? nd.parentElement : nd); }); });
      }).observe(document.body, { childList: true, subtree: true });
    }).catch(function () {});
  }

  function marcarBotones() {
    var activo = guardado() === 'pt' && !enIngles ? 'pt' : window._phdrIdiomaPagina();
    [].forEach.call(document.querySelectorAll('[data-lang-btn]'), function (b) {
      var si = b.getAttribute('data-lang-btn') === activo;
      b.classList.toggle('active', si); b.setAttribute('aria-pressed', si ? 'true' : 'false');
    });
  }
  window._phdrMarcarIdioma = marcarBotones;

  window._phdrIdioma = function (l) {
    var antes = guardado();
    guardar(l);
    if (l !== 'pt' && antes === 'pt') cookieGT(null);
    if (l === 'en') {
      if (enIngles) return marcarBotones();
      if (enCompleta) return location.reload();
      location.href = C.mapaEn[ruta()] || C.hubEn; return;
    }
    // ES o PT: siempre desde la página en español (PT la traduce Google)
    if (enIngles) { location.href = C.esDe[ruta()] || '/'; return; }
    location.reload();
  };

  function alCargar() {
    marcarBotones();
    if (!enIngles && guardado() === 'pt') activarPT();
    else if (!enIngles && window._phdrIdiomaPagina() === 'en') traducirEN();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', alCargar); else alCargar();
})();

/* ── GA4 (y Clarity) — DESPUÉS de cargar la página ─────────────────────────
   La cola de gtag (consentimiento + config) se crea YA, sin red, para que «Aceptar cookies» funcione
   aunque el script no haya bajado. gtag.js (190 KB) se pide tras el evento load y con el navegador libre:
   antes competía con el contenido. Es el ÚNICO cargador de GA: las páginas no deben traer su propio
   <script> de GA (con los dos, cada visita contaba dos page_view). Respeta Consent Mode v2 y reaplica
   el consentimiento ya dado (antes volvía a quedar «denied» en cada página).
─────────────────────────────────────────────────────────────────────── */
(function(){
  var GA_ID = 'G-Z8G2X7ETQ1';
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function(){ window.dataLayer.push(arguments); };
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',wait_for_update:500});
    try { if (localStorage.getItem('pg_cookies_decision') === 'accepted' || localStorage.getItem('ac_cookies_ok') === '1') gtag('consent','update',{analytics_storage:'granted'}); } catch (e) {}
    gtag('js', new Date());
    gtag('config', GA_ID, {anonymize_ip:true});
  }
  function _cargar() {
    if (!document.getElementById('ac-ga4')) {
      var s = document.createElement('script');
      s.id = 'ac-ga4'; s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(s);
    }
    if (window._loadClarity) window._loadClarity();
  }
  function _luego() { if (window.requestIdleCallback) requestIdleCallback(_cargar, { timeout: 4000 }); else setTimeout(_cargar, 1500); }
  if (document.readyState === 'complete') _luego(); else window.addEventListener('load', _luego);
})();

(function () {
  'use strict';
  if (document.getElementById('nav-topbar') || document.getElementById('pheader-v2')) return;

  var cfg      = window._headerConfig || {};
  var noCta    = !!cfg.noCta;
  var activePath = cfg.activePath || window.location.pathname;

  if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="fontawesome"]')) {
    var _fa = document.createElement('link');
    _fa.rel='stylesheet';
    _fa.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    _fa.crossOrigin='anonymous';
    document.head.appendChild(_fa);
  }

  /* ── CSS IDÉNTICO A PRODIGY ── */
  var css = [
    'body{padding-top:114px!important;}',

    /* TOPBAR */
    '#nav-topbar{position:fixed;top:0;left:0;right:0;height:56px;',
    'background:#0a0a0e;border-bottom:1px solid rgba(217,70,166,0.35);',
    'display:flex;align-items:center;justify-content:center;',
    'padding:0 24px;z-index:1001;gap:8px;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
    '#tb-form{display:flex;align-items:center;gap:8px;}',
    '.tb-input-wrap{position:relative;display:flex;align-items:center;}',
    '.tb-input-wrap i{position:absolute;left:11px;color:#94a3b8;font-size:13px;pointer-events:none;}',
    '.tb-input{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);',
    'border-radius:6px;color:#e2e8f0;font-size:16px;height:44px;',
    'padding:0 12px 0 34px;width:190px;outline:none;',
    'transition:border-color .2s,background .2s;font-family:inherit;}',
    '.tb-input::placeholder{color:#94a3b8;}',
    '.tb-input:focus{border-color:rgba(217,70,166,0.55);background:rgba(217,70,166,0.06);}',
    '.tb-sep{width:1px;height:26px;background:rgba(255,255,255,0.1);margin:0 4px;}',
    '.tb-acceso{height:44px;padding:0 20px;background:#e2e8f0;color:#0a0a0e;',
    'font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;',
    'border:none;border-radius:6px;cursor:pointer;transition:background .2s;',
    'white-space:nowrap;font-family:inherit;}',
    '.tb-acceso:hover{background:#fff;}',
    '.tb-registro{height:44px;padding:0 20px;background:transparent;color:#94a3b8;',
    'font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;',
    'border:1px solid rgba(255,255,255,0.18);border-radius:6px;cursor:pointer;',
    'transition:border-color .2s,color .2s;white-space:nowrap;text-decoration:none;',
    'display:inline-flex;align-items:center;font-family:inherit;}',
    '.tb-registro:hover{border-color:rgba(255,255,255,0.4);color:#fff;}',
    '@media(max-width:768px){#tb-form .tb-input-wrap,#tb-form .tb-sep{display:none;}',
    '#nav-topbar{justify-content:center;gap:8px;}}',
    '@media(max-width:480px){#nav-topbar{height:46px;}',
    '.tb-acceso,.tb-registro{padding:0 14px;font-size:13px;}}',

    /* NAVBAR */
    '#pheader-v2{position:fixed;top:56px;left:0;right:0;width:100%;',
    'background:rgba(8,8,12,0.97);backdrop-filter:blur(24px);',
    'border-bottom:1px solid rgba(212,175,55,0.2);',
    'padding:18px 0;z-index:1000;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    'transition:box-shadow .3s;}',
    '#pheader-v2.nav-scrolled{box-shadow:0 4px 40px rgba(217,70,166,0.18);',
    'border-bottom-color:rgba(217,70,166,0.35);}',
    '.pnav2-c{max-width:1400px;margin:0 auto;display:flex;align-items:center;padding:0 24px;gap:0;}',
    '.pnav2-left,.pnav2-right{display:flex;gap:14px;flex-wrap:nowrap;align-items:center;flex:1;}',
    '.pnav2-left{justify-content:flex-end;}',
    '.pnav2-right{justify-content:flex-start;}',
    '.pnav2-left>a,.pnav2-right>a{color:#cbd5e1;text-decoration:none;font-size:13.5px;',
    'font-weight:700;text-transform:uppercase;letter-spacing:.8px;white-space:nowrap;transition:color .25s;}',
    '.pnav2-left>a:hover,.pnav2-right>a:hover{color:#fff;}',
    '.pnav2-left>a.pnav2-active,.pnav2-right>a.pnav2-active{color:#00FF41!important;}',
    '.pnav2-logo{flex-shrink:0;padding:0 20px;text-decoration:none;text-align:center;pointer-events:auto;display:flex;flex-direction:column;align-items:center;gap:2px;}',
    '.pnav2-logo-gem{filter:drop-shadow(0 0 8px #D946A6cc);}',
    '.pnav2-logo strong{display:block;font-size:18px;font-weight:900;letter-spacing:3px;background:linear-gradient(90deg,#D4AF37,#D946A6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.1;}',
    '.pnav2-logo em{display:block;font-style:normal;font-size:9px;font-weight:700;letter-spacing:4px;color:#f5f5f7aa;text-transform:uppercase;}',

    /* Dropdown */
    '.pnav2-dd{position:relative;display:flex;align-items:center;}',
    '.pnav2-dd-btn{color:#D946A6;text-decoration:none;font-size:13.5px;font-weight:800;',
    'letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;',
    'display:inline-flex;align-items:center;gap:5px;cursor:pointer;',
    'transition:color .25s;background:none;border:none;padding:0;font-family:inherit;}',
    '.pnav2-dd-btn:hover{color:#D4AF37;}',
    '.pnav2-dd-arrow{font-size:11px;transition:transform .25s;}',
    '.pnav2-dd:hover .pnav2-dd-arrow,.pnav2-dd.open .pnav2-dd-arrow{transform:rotate(180deg);}',
    '.pnav2-dd-menu{position:absolute;top:calc(100% + 12px);left:0;',
    'background:rgba(5,5,5,0.98);backdrop-filter:blur(24px);',
    'border:1px solid rgba(212,175,55,0.22);border-radius:12px;',
    'padding:6px 0;min-width:240px;z-index:10;',
    'opacity:0;visibility:hidden;transform:translateY(-6px);',
    'transition:opacity .22s,visibility .22s,transform .22s;}',
    '.pnav2-dd:hover .pnav2-dd-menu,.pnav2-dd.open .pnav2-dd-menu{opacity:1;visibility:visible;transform:translateY(0);}',
    '.pnav2-dd-menu a{display:flex;align-items:center;gap:10px;padding:11px 18px;color:#cbd5e1;text-decoration:none;',
    'font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;transition:background .2s,color .2s;}',
    '.pnav2-dd-menu a:hover{background:rgba(212,175,55,0.08);color:#D4AF37;}',
    '.pnav2-dd-menu a i{color:#D946A6;width:16px;text-align:center;flex-shrink:0;}',
    '.pnav2-dd-menu a span.dd-sub{display:block;font-size:12px;font-weight:400;letter-spacing:.3px;color:rgba(203,213,225,.5);text-transform:none;margin-top:2px;}',
    '.pnav2-dd-menu.r{left:auto;right:0;}',

    /* HAZ TU PEDIDO */
    '.pnav2-ped-wrap{position:relative;display:inline-block;}',
    '.pnav2-ped-btn{background:linear-gradient(135deg,#B0267F 0%,#a0186e 100%);',
    'color:#fff;padding:10px 22px;border-radius:6px;font-size:12px;font-weight:800;',
    'letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;',
    'white-space:nowrap;display:inline-flex;align-items:center;gap:6px;',
    'box-shadow:0 4px 20px rgba(217,70,166,0.4);font-family:inherit;',
    'transition:box-shadow .2s,transform .2s;}',
    '.pnav2-ped-btn:hover{box-shadow:0 6px 28px rgba(217,70,166,0.6);transform:translateY(-1px);}',
    '.pnav2-ped-drop{position:absolute;top:calc(100% + 4px);right:0;',
    'background:rgba(8,8,12,0.98);backdrop-filter:blur(20px);',
    'border:1px solid rgba(217,70,166,0.3);border-radius:14px;',
    'padding:8px;min-width:260px;z-index:2000;',
    'box-shadow:0 16px 48px rgba(0,0,0,0.6);',
    'opacity:0;pointer-events:none;transform:translateY(8px);',
    'transition:opacity .2s,transform .2s;}',
    '.pnav2-ped-drop.open,.pnav2-ped-wrap:hover .pnav2-ped-drop{opacity:1;pointer-events:auto;transform:translateY(0);}',
    '.pnav2-ped-card{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;text-decoration:none;color:#e2e8f0;transition:background .15s;}',
    '.pnav2-ped-card:hover{background:rgba(255,255,255,0.05);}',
    '.pnav2-ped-card div{display:flex;flex-direction:column;}',
    '.pnav2-ped-card strong{font-size:.85rem;font-weight:800;}',
    '.pnav2-ped-card span{font-size:.72rem;color:#94a3b8;margin-top:1px;}',

    /* Hamburger + mobile */
    '.pnav2-ham{display:none;background:none;border:none;cursor:pointer;padding:10px;color:#D4AF37;font-size:1.4rem;min-width:44px;min-height:44px;}',
    '.pnav2-mob{display:none;position:fixed;top:108px;left:0;right:0;',
    'background:rgba(0,0,0,0.97);backdrop-filter:blur(20px);',
    'border-bottom:1px solid rgba(212,175,55,0.2);padding:20px 30px;z-index:999;',
    'flex-direction:column;gap:14px;}',
    '.pnav2-mob.open{display:flex;}',
    '.pnav2-mob a{color:#f5f5f7;text-decoration:none;font-size:1rem;font-weight:700;',
    'text-transform:uppercase;letter-spacing:1px;padding:10px 0;',
    'border-bottom:1px solid rgba(255,255,255,0.07);}',
    '.pnav2-mob a:hover{color:#D4AF37;}',
    '.pnav2-mob a:last-child{border-bottom:none;}',
    '@media(max-width:1024px){.pnav2-left>a:not(.pnav2-dd *){display:none;}',
    '.pnav2-right>a{display:none;}.pnav2-ham{display:block!important;}}',
    /* Celular/tablet (oct-2026): lo que no cabe ya está en el menú ☰ y en el botón flotante «Haz tu pedido».
       Antes, a 390 px SOPORTE, tema, IA y HAZ TU PEDIDO quedaban fuera de la pantalla (cortados). */
    '@media(max-width:900px){.pnav2-dd,.pnav2-theme-btn,.pnav2-ia-btn{display:none!important;}}',
    '@media(max-width:640px){.pnav2-ped-wrap,#urgencia-widget{display:none!important;}.pnav2-c{padding:0 12px;}.pnav2-logo{padding:0 8px;}}',
    /* Botones flotantes de utilidad (subir / tema / WhatsApp): ~25 páginas los tienen sin estilos y quedaban como
       3 botoncitos de 14 px al final de la página. :where() = sin peso, si la página trae los suyos ganan esos.
       En celular se ocultan: tema y WhatsApp están en el menú ☰ y hay botón flotante propio (oct-2026). */
    /* Imágenes con width/height (reservan su espacio al cargar): que sigan escalando bien. :where() = sin peso */
    ':where(img[width][height]){height:auto;}',
    // opciones de listas desplegables legibles (en Windows la lista nativa se abría blanca con letra blanca)
    ':where(select) option,:where(select) optgroup{background-color:#121a26;color:#e5e7eb;}',
    ':where(.ux-floaters){position:fixed;bottom:28px;right:24px;z-index:900;display:flex;flex-direction:column;gap:10px;}',
    ':where(.ux-btn){width:44px;height:44px;border-radius:50%;background:rgba(13,21,32,.92);border:1px solid rgba(255,255,255,.15);color:#cbd5e1;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;text-decoration:none;}',
    '@media(max-width:640px){.ux-floaters{display:none!important;}.pheader-lang button{padding:6px 9px;}}',

    /* IA button */
    '.pnav2-ia-btn{background:rgba(0,255,65,0.08);border:1.5px solid rgba(0,255,65,0.3);',
    'color:#00FF41;width:44px;height:44px;border-radius:8px;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;font-size:1rem;',
    'flex-shrink:0;transition:all .2s;font-family:inherit;',
    'animation:_pia-glow 3s ease-in-out infinite;}',
    '@keyframes _pia-glow{0%,100%{box-shadow:0 0 0 0 rgba(0,255,65,0)}50%{box-shadow:0 0 14px 3px rgba(0,255,65,0.22)}}',
    '.pnav2-ia-btn:hover{background:rgba(0,255,65,0.2);border-color:#00FF41;box-shadow:0 0 22px rgba(0,255,65,0.45);animation:none;transform:scale(1.1);}',

    /* CTA flotante */
    '@keyframes _ppulse{0%{box-shadow:0 0 0 0 rgba(0,255,65,.7)}70%{box-shadow:0 0 0 8px rgba(0,255,65,0)}100%{box-shadow:0 0 0 0 rgba(0,255,65,0)}}',
    '#pcta-pedido{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(100px);',
    'z-index:998;opacity:0;transition:opacity .4s ease,transform .4s cubic-bezier(.34,1.56,.64,1);',
    'pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:12px;}',
    '#pcta-pedido.visible{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto;}',
    '#pcta-menu{display:grid;grid-template-columns:1fr 1fr;gap:8px;opacity:0;transform:translateY(16px);pointer-events:none;transition:opacity .3s ease,transform .3s cubic-bezier(.34,1.56,.64,1);}',
    '#pcta-menu.open{opacity:1;transform:translateY(0);pointer-events:auto;}',
    '.pcta-card{display:flex;flex-direction:column;align-items:center;gap:8px;',
    'background:rgba(10,10,16,0.96);border:1px solid rgba(217,70,166,0.35);',
    'border-radius:14px;padding:16px 18px;text-decoration:none;color:#e2e8f0;',
    'min-width:90px;text-align:center;backdrop-filter:blur(16px);',
    'box-shadow:0 8px 32px rgba(0,0,0,0.5);transition:border-color .2s,transform .2s,box-shadow .2s;}',
    '.pcta-card:hover{transform:translateY(-5px);color:#fff;}',
    '.pcta-card i{font-size:1.6rem;margin-bottom:2px;}',
    '.pcta-card-cad{border-color:rgba(0,210,255,0.35);}',
    '.pcta-card-cad i{color:#00d2ff;}',
    '.pcta-card-cad:hover{border-color:rgba(0,210,255,0.8);box-shadow:0 12px 40px rgba(0,0,0,0.6),0 0 20px rgba(0,210,255,0.3);}',
    '.pcta-card-cam{border-color:rgba(212,175,55,0.35);}',
    '.pcta-card-cam i{color:#D4AF37;}',
    '.pcta-card-cam:hover{border-color:rgba(212,175,55,0.8);}',
    '.pcta-card-title{font-size:11px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:#e2e8f0;line-height:1.2;}',
    '.pcta-card-sub{font-size:9px;font-weight:600;letter-spacing:.5px;color:#94a3b8;line-height:1.2;text-transform:none;}',
    '#pcta-label{transition:opacity .3s;text-align:center;font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px;}',
    '#pcta-btn{display:inline-flex;align-items:center;gap:10px;',
    'background:linear-gradient(135deg,#B0267F 0%,#a0186e 100%);',
    'color:#fff;font-weight:800;font-size:.95rem;letter-spacing:1.5px;',
    'padding:14px 32px;border-radius:100px;border:1px solid rgba(255,255,255,0.15);',
    'box-shadow:0 8px 32px rgba(217,70,166,0.45),0 2px 8px rgba(0,0,0,0.4);',
    'cursor:pointer;white-space:nowrap;transition:box-shadow .2s,transform .2s;font-family:inherit;}',
    '#pcta-btn:hover{box-shadow:0 12px 48px rgba(217,70,166,0.65);transform:scale(1.04);}',
    '#pcta-btn .ppulse{width:8px;height:8px;background:#00FF41;border-radius:50%;animation:_ppulse 2s infinite;flex-shrink:0;}',
    '#pcta-btn .pcta-chev{transition:transform .3s;font-size:12px;}',
    '#pcta-btn.active .pcta-chev{transform:rotate(180deg);}',
    '@media(max-width:520px){.pcta-card{min-width:72px;padding:12px 10px;}.pcta-card i{font-size:1.2rem;}#pcta-btn{font-size:.82rem;padding:12px 22px;}#pcta-menu{gap:7px;}}',

    /* Chat bubble */
    '#pg-chat-bubble{position:fixed;bottom:28px;left:28px;z-index:9000;',
    'width:64px;height:64px;border-radius:50%;',
    'background:linear-gradient(135deg,#00d2ff 0%,#006699 100%);',
    'border:2px solid rgba(0,210,255,0.55);cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;',
    'font-size:1.55rem;color:#fff;box-shadow:0 8px 32px rgba(0,210,255,0.45);',
    'transition:transform .2s,box-shadow .2s;animation:_pbot-pulse 2.5s ease-in-out infinite;}',
    '@keyframes _pbot-pulse{0%,100%{box-shadow:0 8px 32px rgba(0,210,255,0.45)}50%{box-shadow:0 8px 48px rgba(0,210,255,0.75),0 0 0 10px rgba(0,210,255,0.06)}}',
    '#pg-chat-bubble:hover{transform:scale(1.1);animation:none;}',
    '#pg-chat-bubble .pg-notif{position:absolute;top:-1px;right:-1px;width:15px;height:15px;background:#00FF41;border-radius:50%;border:2px solid #050505;animation:_ppulse 2s infinite;}',
    '#pg-chat-window{position:fixed;bottom:102px;left:28px;z-index:9000;width:360px;max-height:540px;',
    'background:#0a0f18;border:1px solid rgba(0,210,255,0.28);border-radius:20px;',
    'display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,0.7);',
    'transform:scale(0.92) translateY(20px);opacity:0;pointer-events:none;',
    'transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .25s ease;}',
    '#pg-chat-window.open{transform:scale(1) translateY(0);opacity:1;pointer-events:auto;}',
    '@media(max-width:420px){#pg-chat-window{width:calc(100vw - 24px);left:12px;bottom:88px;}}',
    '@media(max-width:768px){#pg-chat-bubble{display:none!important;}}',
    '.pg-chat-header{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;}',
    '.pg-chat-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#00d2ff,#006699);display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0;}',
    '.pg-chat-info h4{font-size:.9rem;font-weight:700;color:#e2e8f0;margin:0;}',
    '.pg-chat-info p{font-size:.72rem;color:#00FF41;display:flex;align-items:center;gap:4px;margin:0;}',
    '.pg-chat-info p::before{content:"";width:6px;height:6px;background:#00FF41;border-radius:50%;display:inline-block;}',
    '.pg-chat-close{margin-left:auto;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1rem;padding:4px;transition:color .2s;}',
    '.pg-chat-close:hover{color:#e2e8f0;}',
    '.pg-chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;}',
    '.pg-msg{display:flex;gap:8px;max-width:88%;}',
    '.pg-msg.user{align-self:flex-end;flex-direction:row-reverse;}',
    '.pg-msg-av{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;margin-top:2px;}',
    '.pg-msg.user .pg-msg-av{background:rgba(217,70,166,0.3);}',
    '.pg-msg-bbl{background:rgba(255,255,255,0.06);border-radius:14px 14px 14px 4px;padding:10px 14px;font-size:.87rem;line-height:1.6;color:#e2e8f0;}',
    '.pg-msg.user .pg-msg-bbl{background:rgba(217,70,166,0.18);border-radius:14px 14px 4px 14px;}',
    '.pg-typing{display:none;align-self:flex-start;}',
    '.pg-typing.visible{display:flex;}',
    '.pg-tdots{display:flex;gap:4px;padding:12px 16px;background:rgba(255,255,255,0.06);border-radius:14px 14px 14px 4px;}',
    '.pg-tdots span{width:7px;height:7px;background:#00d2ff;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;}',
    '.pg-tdots span:nth-child(2){animation-delay:.2s;}.pg-tdots span:nth-child(3){animation-delay:.4s;}',
    '.pg-chat-sugs{padding:0 12px 10px;display:flex;flex-wrap:wrap;gap:6px;}',
    '.pg-sug-btn{background:rgba(0,210,255,0.08);border:1px solid rgba(0,210,255,0.2);color:#00d2ff;font-size:.72rem;font-weight:600;padding:5px 12px;border-radius:100px;cursor:pointer;transition:background .2s;white-space:nowrap;font-family:inherit;}',
    '.pg-sug-btn:hover{background:rgba(0,210,255,0.15);}',
    '.pg-chat-aviso{padding:6px 14px 0;font-size:.7rem;line-height:1.4;color:#94a3b8;flex-shrink:0;}',
    '.pg-chat-input-area{padding:12px 14px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:flex-end;flex-shrink:0;}',
    '#pg-chat-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#e2e8f0;font-size:16px;font-family:inherit;padding:10px 14px;outline:none;resize:none;min-height:40px;max-height:100px;transition:border-color .2s;}',
    '#pg-chat-input:focus{border-color:rgba(0,210,255,0.4);}',
    '#pg-chat-input::placeholder{color:#94a3b8;}',
    '#pg-chat-send{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#00d2ff,#006699);border:none;cursor:pointer;color:#fff;font-size:.9rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s;}',
    '#pg-chat-send:hover{opacity:.85;}#pg-chat-send:disabled{opacity:.4;cursor:not-allowed;}',
    '@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',

    /* THEME TOGGLE BTN */
    '.pnav2-theme-btn{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);',
    'color:#e2e8f0;width:44px;height:44px;border-radius:8px;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;font-size:1rem;',
    'flex-shrink:0;transition:all .2s;font-family:inherit;}',
    '.pnav2-theme-btn:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.35);}',
    /* Selector de idioma */
    '.pheader-lang{display:flex;gap:2px;background:rgba(13,21,32,0.85);border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:3px;margin-left:12px;}',
    '.pheader-lang button{background:none;border:none;cursor:pointer;color:#94a3b8;font-size:.7rem;font-weight:700;letter-spacing:.5px;padding:4px 8px;border-radius:5px;transition:all .2s;font-family:inherit;}',
    '.pheader-lang button.active{background:rgba(212,175,55,0.18);color:#D4AF37;}',
    /* Lupa: buscador de la web + IA (js/buscador-web.js). Visible también en celular (a la derecha). */
    '.pnav2-buscar-btn{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);color:#e2e8f0;width:44px;height:44px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;transition:all .2s;font-family:inherit;}',
    '.pnav2-buscar-btn:hover{background:rgba(0,210,255,.12);border-color:rgba(0,210,255,.5);color:#fff;}',
    '@media(max-width:1024px){.pnav2-right{justify-content:flex-end!important;}}',
    ':focus-visible{outline:2px solid #D946A6;outline-offset:2px;border-radius:3px;}',
  ].join('');

  var st = document.createElement('style');
  st.id = 'pheader-v2-css';
  st.textContent = css;
  document.head.appendChild(st);

  var page = activePath.split('/').pop() || 'index.html';
  function ac(href) {
    var h = href.split('/').pop().split('#')[0];
    return (h===page||(h===''&&(page===''||page==='index.html')))?' class="pnav2-active" aria-current="page"':'';
  }

  /* ── TOPBAR ── */
  var topbarHtml =
    '<div id="nav-topbar">' +
      '<form id="tb-form" onsubmit="_phdrLogin(event)">' +
        '<div class="tb-input-wrap"><i class="far fa-user"></i><input id="tb-email" type="email" class="tb-input" placeholder="Correo electrónico" autocomplete="email"></div>' +
        '<div class="tb-input-wrap"><i class="fas fa-lock"></i><input id="tb-pass" type="password" class="tb-input" placeholder="Contraseña" autocomplete="current-password"></div>' +
        '<div class="tb-sep"></div>' +
        '<button type="submit" class="tb-acceso">ACCESO</button>' +
        '<a href="/app/login.html?mode=register" class="tb-registro">REGISTRO</a>' +
      '</form>' +
      '<div class="pheader-lang" role="group" aria-label="Idioma" translate="no">' +
        '<button type="button" data-lang-btn="es" onclick="_phdrIdioma(\'es\')" title="Español">ES</button>' +
        '<button type="button" data-lang-btn="en" onclick="_phdrIdioma(\'en\')" title="English — traducción técnica">EN</button>' +
        '<button type="button" data-lang-btn="pt" onclick="_phdrIdioma(\'pt\')" title="Português — tradução automática do Google">PT</button>' +
      '</div>' +
    '</div>' +
    /* MODAL LOGIN */
    '<div id="tb-modal-overlay" onclick="if(event.target===this)_phdrCloseModal()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:9999;align-items:center;justify-content:center;padding:20px;">' +
      '<div style="background:#0d1525;border:1px solid rgba(217,70,166,.35);border-radius:18px;padding:32px;width:100%;max-width:380px;position:relative;">' +
        '<button type="button" onclick="_phdrCloseModal()" style="position:absolute;top:14px;right:14px;background:none;border:none;color:#94a3b8;font-size:1.1rem;cursor:pointer;line-height:1;">✕</button>' +
        /* Tabs */
        '<div style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,.08);">' +
          '<button type="button" id="tb-tab-login" onclick="_phdrTab(\'login\')" style="flex:1;padding:10px;background:none;border:none;border-bottom:2px solid #D946A6;color:#fff;font-size:.82rem;font-weight:800;letter-spacing:1px;cursor:pointer;text-transform:uppercase;">Acceso</button>' +
          '<button type="button" id="tb-tab-reg" onclick="_phdrTab(\'register\')" style="flex:1;padding:10px;background:none;border:none;border-bottom:2px solid transparent;color:#94a3b8;font-size:.82rem;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;">Registro</button>' +
        '</div>' +
        /* Logo */
        '<div style="text-align:center;margin-bottom:20px;">' +
          '<div style="font-size:1.8rem;line-height:1;">👑</div>' +
          '<div style="font-size:.72rem;font-weight:700;letter-spacing:3px;color:#94a3b8;margin-top:4px;text-transform:uppercase;">Alejandro CAD/CAM</div>' +
        '</div>' +
        /* Error */
        '<div id="tb-modal-err" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#f87171;border-radius:8px;padding:9px 14px;font-size:.78rem;margin-bottom:14px;"></div>' +
        /* Campos login */
        '<div id="tb-fields-login">' +
          '<div style="position:relative;margin-bottom:12px;"><i class="far fa-envelope" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-modal-email" type="email" placeholder="Correo electrónico" autocomplete="email" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:16px;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'"></div>' +
          '<div style="position:relative;margin-bottom:12px;"><i class="fas fa-lock" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-modal-pass" type="password" placeholder="Contraseña" autocomplete="current-password" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:16px;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'" onkeydown="if(event.key===\'Enter\')_phdrLogin()"></div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">' +
            '<label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:.75rem;color:#94a3b8;"><input type="checkbox" id="tb-remember" style="accent-color:#D946A6;width:14px;height:14px;"> Recordarme</label>' +
            '<a href="/app/login.html?mode=reset" style="font-size:.73rem;color:#D946A6;text-decoration:none;">¿Olvidaste tu clave?</a>' +
          '</div>' +
          '<button type="button" onclick="_phdrLogin()" id="tb-modal-btn" style="width:100%;padding:13px;background:linear-gradient(135deg,#B0267F,#9333ea);color:#fff;border:none;border-radius:10px;font-size:.9rem;font-weight:800;cursor:pointer;letter-spacing:.5px;transition:opacity .2s;">Entrar</button>' +
          '<p style="text-align:center;font-size:.75rem;color:#94a3b8;margin-top:14px;">¿No tienes cuenta? <button type="button" onclick="_phdrTab(\'register\')" style="background:none;border:none;color:#D946A6;font-weight:700;cursor:pointer;font-size:.75rem;">Regístrate</button></p>' +
        '</div>' +
        /* Campos registro */
        '<div id="tb-fields-register" style="display:none;">' +
          '<div style="position:relative;margin-bottom:12px;"><i class="far fa-envelope" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-reg-email" type="email" placeholder="Correo electrónico" autocomplete="email" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:16px;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'"></div>' +
          '<div style="position:relative;margin-bottom:12px;"><i class="fas fa-lock" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-reg-pass" type="password" placeholder="Contraseña (mín. 8 caracteres)" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:16px;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'"></div>' +
          '<button type="button" onclick="_phdrRegister()" id="tb-reg-btn" style="width:100%;padding:13px;background:linear-gradient(135deg,#B0267F,#9333ea);color:#fff;border:none;border-radius:10px;font-size:.9rem;font-weight:800;cursor:pointer;letter-spacing:.5px;">Crear cuenta</button>' +
          '<p style="text-align:center;font-size:.75rem;color:#94a3b8;margin-top:14px;">¿Ya tienes cuenta? <button type="button" onclick="_phdrTab(\'login\')" style="background:none;border:none;color:#D946A6;font-weight:700;cursor:pointer;font-size:.75rem;">Inicia sesión</button></p>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ── NAVBAR ── */
  var navHtml =
    '<nav id="pheader-v2" aria-label="Navegación principal">' +
      '<div class="pnav2-c">' +
        '<button type="button" class="pnav2-ham" id="pnav2-ham" aria-label="Abrir menú" aria-expanded="false" aria-controls="pnav2-mob"><i class="fas fa-bars" id="pnav2-ham-ico"></i></button>' +

        /* Izquierda */
        '<div class="pnav2-left">' +
          '<div class="pnav2-dd" id="pnav2-dd">' +
            '<button type="button" class="pnav2-dd-btn" aria-haspopup="true" aria-expanded="false">SERVICIOS <i class="fas fa-chevron-down pnav2-dd-arrow"></i></button>' +
            '<div class="pnav2-dd-menu">' +
              '<a href="/diseno-remoto#coronas">' +
                '<i class="fas fa-crown" style="color:#D4AF37"></i>' +
                '<span>Coronas &amp; Inlays<span class="dd-sub">Zirconia · disilicato · PMMA · desde $14 USD</span></span>' +
              '</a>' +
              '<a href="/diseno-remoto#carillas">' +
                '<i class="fas fa-star" style="color:#D946A6"></i>' +
                '<span>Carillas &amp; DSD<span class="dd-sub">Diseño estético · control de proporciones</span></span>' +
              '</a>' +
              '<a href="/guias-quirurgicas">' +
                '<i class="fas fa-crosshairs" style="color:#00d2ff"></i>' +
                '<span>Cirugía Guiada<span class="dd-sub">Desde $65 USD · planificación digital · desde 4h</span></span>' +
              '</a>' +
              '<a href="/diseno-remoto#fullarch">' +
                '<i class="fas fa-teeth" style="color:#a78bfa"></i>' +
                '<span>Full Arch &amp; Rehabilitaciones<span class="dd-sub">All-on-4 · All-on-6 · híbridos</span></span>' +
              '</a>' +
              '<a href="/diseno-remoto#ferulas">' +
                '<i class="fas fa-shield-alt" style="color:#4ade80"></i>' +
                '<span>Férulas &amp; Oclusión<span class="dd-sub">Michigan · NTI · plano de mordida</span></span>' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<a href="/portafolio"'+ac('/portafolio')+'>PORTAFOLIO</a>' +
          '<a href="/envia-tu-scanner"'+ac('/envia-tu-scanner')+'>ENVÍA TU CASO</a>' +
        '</div>' +

        /* Logo centrado */
        '<a href="/" class="pnav2-logo" translate="no">' +
          '<span style="font-size:1.1rem;filter:drop-shadow(0 0 6px rgba(212,175,55,.8));line-height:1;">👑</span>' +
          '<strong>ALEJANDRO</strong>' +
          '<em>CAD · CAM · DENTAL</em>' +
        '</a>' +

        /* Derecha */
        '<div class="pnav2-right">' +
          '<a href="/sobre-mi"'+ac('/sobre-mi')+'>SOBRE MÍ</a>' +
          '<a href="/blog"'+ac('/blog')+'>BLOG</a>' +
          '<a href="/seguimiento-caso"'+ac('/seguimiento-caso')+'>SIGUE TU CASO</a>' +
          '<div class="pnav2-dd" id="pnav2-dd-sop">' +
            '<button type="button" class="pnav2-dd-btn" aria-haspopup="true" aria-expanded="false">SOPORTE <i class="fas fa-chevron-down pnav2-dd-arrow"></i></button>' +
            '<div class="pnav2-dd-menu r">' +
              '<a href="/cursos"><i class="fas fa-graduation-cap"></i><span>Cursos Exocad<span class="dd-sub">Principiante · Avanzado</span></span></a>' +
              '<a href="/reseñas"><i class="fas fa-star" style="color:#D4AF37"></i><span>Reseñas<span class="dd-sub">Laboratorios · Clínicas · Internacional</span></span></a>' +
              '<button type="button" onclick="_phdrToggleIA()" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 16px;width:100%;text-align:left;color:inherit;font:inherit;" aria-label="Abrir asistente IA"><i class="fas fa-robot" style="color:#00FF41"></i><span>Asistente IA<span class="dd-sub">Respuesta 24/7</span></span></button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="pnav2-buscar-btn" id="pnav2-buscar-btn" onclick="_phdrBuscar()" aria-label="Buscar en la web o preguntar a la IA" title="Buscar (Ctrl+K)">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
          '</button>' +
          '<button type="button" class="pnav2-theme-btn" id="pnav2-theme-btn" onclick="_phdrToggleTheme()" aria-label="Cambiar tema" title="Modo claro / oscuro">🌙</button>' +
          '<button type="button" class="pnav2-ia-btn" id="pnav2-ia-btn" onclick="_phdrToggleIA()" aria-label="Asistente IA" aria-expanded="false" aria-controls="pg-chat-window"><i class="fas fa-robot"></i></button>' +
          '<div class="pnav2-ped-wrap" id="pnav2-ped-wrap" onmouseenter="_phdrPedHover(true)" onmouseleave="_phdrPedHover(false)">' +
            '<button type="button" class="pnav2-ped-btn">HAZ TU PEDIDO <i class="fas fa-chevron-down" style="font-size:9px;margin-left:4px;transition:transform .2s;" id="pnav2-ped-arrow"></i></button>' +
            '<div class="pnav2-ped-drop" id="pnav2-ped-drop">' +
              '<a href="/diseno-remoto" class="pnav2-ped-card"><i class="fas fa-globe" style="color:#D946A6;font-size:1.2rem;"></i><div><strong>Diseño CAD Remoto</strong><span>Global · STL en 24h</span></div></a>' +
              '<a href="/flujo-diseno" class="pnav2-ped-card"><i class="fas fa-pen-nib" style="color:#D4AF37;font-size:1.2rem;"></i><div><strong>Enviar mi Caso</strong><span>Portal · login requerido</span></div></a>' +
              '<a href="/app/client-panel" class="pnav2-ped-card"><i class="fas fa-user-circle" style="color:#00d2ff;font-size:1.2rem;"></i><div><strong>Portal Clientes</strong><span>Seguimiento en tiempo real</span></div></a>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</nav>' +

    /* MOBILE */
    '<div class="pnav2-mob" id="pnav2-mob" role="navigation" aria-label="Menú móvil">' +
      '<a href="/diseno-remoto"><i class="fas fa-globe" style="margin-right:8px;color:#D946A6"></i>DISEÑO CAD REMOTO</a>' +
      '<a href="/calculadora-diseno"><i class="fas fa-calculator" style="margin-right:8px"></i>COTIZADOR</a>' +
      '<a href="/portafolio">PORTAFOLIO</a>' +
      '<a href="/guias-quirurgicas" style="color:#00d2ff;"><i class="fas fa-crosshairs" style="margin-right:8px"></i>CIRUGÍA GUIADA</a>' +
      '<a href="/envia-tu-scanner">ENVÍA TU CASO</a>' +
      '<a href="/seguimiento-caso">SIGUE TU CASO</a>' +
      '<a href="/sobre-mi">SOBRE MÍ</a>' +
      '<a href="/blog">BLOG</a>' +
      '<a href="/cursos">CURSOS EXOCAD</a>' +
      '<a href="/reseñas">RESEÑAS</a>' +
      '<button type="button" onclick="_phdrToggleIA();" style="background:none;border:none;cursor:pointer;color:#00FF41;font:inherit;font-size:.9rem;font-weight:700;display:flex;align-items:center;padding:12px 20px;width:100%;text-align:left;" aria-label="Abrir asistente IA"><i class="fas fa-robot" style="margin-right:8px"></i>ASISTENTE IA</button>' +
      '<a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer" style="color:#25D366;"><i class="fab fa-whatsapp" style="margin-right:8px"></i>WHATSAPP</a>' +
      '<a href="/app/login.html" style="color:#D946A6;font-weight:900;"><i class="fas fa-key" style="margin-right:8px"></i>PORTAL CLIENTES</a>' +
      '<button type="button" onclick="_phdrToggleTheme();document.getElementById(\'pnav2-mob\').classList.remove(\'open\');document.getElementById(\'pnav2-ham-ico\').className=\'fas fa-bars\';document.body.style.overflow=\'\';" id="pnav2-theme-mob" style="background:none;border:none;cursor:pointer;color:#94a3b8;font:inherit;font-size:.9rem;font-weight:700;display:flex;align-items:center;padding:12px 20px;width:100%;text-align:left;" aria-label="Cambiar modo de color">' +
        '<i class="fas fa-moon" style="margin-right:8px" id="pnav2-theme-ico"></i>MODO CLARO' +
      '</button>' +
    '</div>' +

    /* CTA FLOTANTE */
    (noCta ? '' :
      '<div id="pcta-pedido">' +
        '<div id="pcta-label" style="display:none;">¿Qué necesitas?</div>' +
        '<div id="pcta-menu">' +
          '<a href="/diseno-remoto" class="pcta-card pcta-card-cad"><i class="fas fa-globe"></i><span class="pcta-card-title">Diseño CAD</span><span class="pcta-card-sub">Global · 24h</span></a>' +
          '<a href="/envia-tu-scanner" class="pcta-card pcta-card-cam"><i class="fas fa-upload"></i><span class="pcta-card-title">Subir STL</span><span class="pcta-card-sub">Sin login</span></a>' +
        '</div>' +
        '<button type="button" id="pcta-btn" onclick="_phdrCtaToggle(this)" aria-expanded="false">' +
          '<span class="ppulse"></span>HAZ TU PEDIDO<i class="fas fa-chevron-up pcta-chev"></i>' +
        '</button>' +
      '</div>') +

    /* CHATBOT */
    '<button type="button" id="pg-chat-bubble" onclick="_phdrToggleIA()" aria-label="Asistente IA">' +
      '<i class="fas fa-robot" id="pg-chat-ico"></i><span class="pg-notif"></span>' +
    '</button>' +
    '<div id="pg-chat-window" role="dialog" aria-label="Asistente IA Alejandro Carvajal" aria-modal="false">' +
      '<div class="pg-chat-header">' +
        '<div class="pg-chat-avatar">🦷</div>' +
        '<div class="pg-chat-info"><h4>Asistente Alejandro CAD</h4><p>En línea ahora</p></div>' +
        '<button type="button" class="pg-chat-close" onclick="_phdrToggleIA()" aria-label="Cerrar chat"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="pg-chat-msgs" id="pg-msgs"></div>' +
      '<div class="pg-typing" id="pg-typing"><div class="pg-tdots"><span></span><span></span><span></span></div></div>' +
      '<div class="pg-chat-sugs" id="pg-sugs">' +
        '<button type="button" class="pg-sug-btn" onclick="_pgSend(this.textContent)">¿Cuánto cuesta una corona?</button>' +
        '<button type="button" class="pg-sug-btn" onclick="_pgSend(this.textContent)">¿Cómo envío mi STL?</button>' +
        '<button type="button" class="pg-sug-btn" onclick="_pgSend(this.textContent)">¿Qué tiempo de entrega?</button>' +
      '</div>' +
      '<div class="pg-chat-aviso">🔒 No escribas datos de pacientes (nombres, documentos, fotos). Guardamos las preguntas sin datos personales para mejorar las respuestas.</div>' +
      '<div class="pg-chat-input-area">' +
        '<textarea id="pg-chat-input" placeholder="Escribe tu pregunta..." rows="1" aria-label="Escribe tu mensaje al asistente"></textarea>' +
        '<button type="button" id="pg-chat-send" onclick="_pgSend()" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>' +
      '</div>' +
    '</div>';

  /* ── INYECTAR ── */
  var wrap = document.createElement('div');
  wrap.innerHTML = topbarHtml + navHtml;
  document.body.insertBefore(wrap, document.body.firstChild);

  /* ── SCROLL ── */
  window.addEventListener('scroll', function(){
    var nav = document.getElementById('pheader-v2');
    var cta = document.getElementById('pcta-pedido');
    if (nav) nav.classList.toggle('nav-scrolled', window.scrollY > 10);
    if (cta) {
      var foot = document.getElementById('pfoot-root');
      var footVisible = foot && foot.getBoundingClientRect().top < (window.innerHeight - 20);
      cta.classList.toggle('visible', window.scrollY > 200 && !footVisible);
    }
  });

  /* ── HAMBURGER ── */
  document.getElementById('pnav2-ham').addEventListener('click', function(){
    var mob = document.getElementById('pnav2-mob');
    var ico = document.getElementById('pnav2-ham-ico');
    var open = mob.classList.toggle('open');
    ico.className = open ? 'fas fa-times' : 'fas fa-bars';
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
    this.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* ── DROPDOWN aria-expanded (accesibilidad) ── */
  document.querySelectorAll('.pnav2-dd').forEach(function(dd) {
    var btn = dd.querySelector('.pnav2-dd-btn');
    if (!btn) return;
    dd.addEventListener('mouseenter', function() { btn.setAttribute('aria-expanded', 'true'); });
    dd.addEventListener('mouseleave', function() { btn.setAttribute('aria-expanded', 'false'); });
    btn.addEventListener('click', function() {
      var open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.querySelectorAll('.pnav2-dd').forEach(function(other) {
        if (other !== dd) {
          other.classList.remove('open');
          var ob = other.querySelector('.pnav2-dd-btn');
          if (ob) ob.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  /* ── CTA TOGGLE ── */
  window._phdrCtaToggle = function(btn) {
    var menu  = document.getElementById('pcta-menu');
    var label = document.getElementById('pcta-label');
    var open  = menu.classList.toggle('open');
    btn.classList.toggle('active', open);
    if (label) label.style.display = open ? 'block' : 'none';
  };

  /* ── PED HOVER ── */
  window._phdrPedHover = function(open) {
    var drop  = document.getElementById('pnav2-ped-drop');
    var arrow = document.getElementById('pnav2-ped-arrow');
    if (!drop) return;
    drop.classList.toggle('open', open);
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
  };

  /* ── LOGIN ── */
  var _SURL = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
  var _SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWhyd3FmeXZneWFwYnd6a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzczNDksImV4cCI6MjA5MDg1MzM0OX0.9CzmFDQYeQKcbtAZoT1_n_OuJ1qPVJu3jImd938T634';
  var _ADMIN_EMAIL = 'jackalejandroc@gmail.com';
  var _TOKEN_KEY   = 'sb-zgihrwqfyvgyapbwzkvw-auth-token';

  /* ── DETECTAR SESIÓN ACTIVA — usa fetch directo, sin SDK ── */
  (function checkSession(){
    var stored = localStorage.getItem(_TOKEN_KEY);
    if(!stored) return;
    var tok = '';
    try{ tok = JSON.parse(stored)?.access_token||''; }catch(e){}
    if(!tok) return;
    fetch(_SURL+'/auth/v1/user',{headers:{'apikey':_SKEY,'Authorization':'Bearer '+tok}})
      .then(function(r){return r.ok?r.json():null;})
      .then(function(u){
        if(!u||!u.email) return;
        var tb = document.getElementById('nav-topbar');
        if(!tb) return;
        var isAdmin = u.email===_ADMIN_EMAIL;
        var panelUrl = isAdmin ? '/app/admin-panel' : '/app/client-panel';
        tb.innerHTML =
          '<div style="display:flex;align-items:center;gap:12px;padding:0 16px;height:100%">'+
            '<span style="font-size:.75rem;color:#94a3b8"><i class="fas fa-user-circle" style="color:#D4AF37;margin-right:5px"></i>'+(isAdmin?'Admin':'Dr.')+' · '+_pgEscH(u.email.split('@')[0])+'</span>'+
            '<a href="'+panelUrl+'" style="background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);color:#D4AF37;padding:5px 14px;border-radius:6px;font-size:.72rem;font-weight:800;text-decoration:none"><i class="fas fa-th-large" style="margin-right:4px"></i>Mi Panel</a>'+
            '<button type="button" onclick="_phdrLogout()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#94a3b8;padding:5px 12px;border-radius:6px;font-size:.72rem;font-weight:700;cursor:pointer"><i class="fas fa-sign-out-alt" style="margin-right:4px"></i>Salir</button>'+
          '</div>';
      }).catch(function(){});
  })();

  window._phdrLogout = function(){
    var stored = localStorage.getItem(_TOKEN_KEY);
    var tok = '';
    try { tok = JSON.parse(stored)?.access_token||''; } catch(e){}
    localStorage.removeItem(_TOKEN_KEY);
    // Revocar el refresh token server-side — sin esto, un JWT copiado antes
    // del logout seguía siendo válido hasta su expiración natural (~1h).
    var done = function(){ window.location.reload(); };
    if (tok) {
      fetch(_SURL+'/auth/v1/logout',{method:'POST',headers:{'apikey':_SKEY,'Authorization':'Bearer '+tok}})
        .then(done).catch(done);
    } else {
      done();
    }
  };

  /* ── MODAL HELPERS ── */
  window._phdrOpenModal = function() {
    var ov = document.getElementById('tb-modal-overlay');
    if(ov){ ov.style.display='flex'; document.getElementById('tb-modal-email').focus(); }
  };
  window._phdrCloseModal = function() {
    var ov = document.getElementById('tb-modal-overlay');
    if(ov) ov.style.display='none';
    var err = document.getElementById('tb-modal-err');
    if(err) err.style.display='none';
  };
  window._phdrTab = function(tab) {
    var isLogin = tab==='login';
    document.getElementById('tb-fields-login').style.display    = isLogin?'block':'none';
    document.getElementById('tb-fields-register').style.display = isLogin?'none':'block';
    document.getElementById('tb-tab-login').style.borderBottomColor = isLogin?'#D946A6':'transparent';
    document.getElementById('tb-tab-login').style.color              = isLogin?'#fff':'#94a3b8';
    document.getElementById('tb-tab-reg').style.borderBottomColor   = isLogin?'transparent':'#D946A6';
    document.getElementById('tb-tab-reg').style.color               = isLogin?'#94a3b8':'#fff';
    var err = document.getElementById('tb-modal-err');
    if(err) err.style.display='none';
  };

  function _phdrShowErr(msg) {
    var el = document.getElementById('tb-modal-err');
    if(!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  window._phdrLogin = function(e) {
    if(e) e.preventDefault();
    var email = (document.getElementById('tb-email')||{}).value.trim();
    var pass  = (document.getElementById('tb-pass')||{}).value;
    if(!email||!pass){ window.location.href='/app/login.html'; return; }
    var btn = document.querySelector('.tb-acceso');
    if(btn){btn.textContent='...';btn.disabled=true;}
    fetch(_SURL+'/auth/v1/token?grant_type=password',{
      method:'POST',
      headers:{'apikey':_SKEY,'Content-Type':'application/json'},
      body:JSON.stringify({email:email,password:pass})
    }).then(function(r){return r.json();}).then(function(d){
      if(btn){btn.textContent='ACCESO';btn.disabled=false;}
      if(d.access_token){
        localStorage.setItem(_TOKEN_KEY,JSON.stringify({
          access_token:d.access_token,refresh_token:d.refresh_token||'',user:d.user
        }));
        var dest = (d.user&&d.user.email===_ADMIN_EMAIL) ? '/app/admin-panel' : '/app/client-panel';
        window.location.href = dest;
      } else {
        alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    }).catch(function(){
      if(btn){btn.textContent='ACCESO';btn.disabled=false;}
      alert('Error de conexión.');
    });
  };

  window._phdrRegister = function() {
    var email = (document.getElementById('tb-reg-email')||{}).value||'';
    var pass  = (document.getElementById('tb-reg-pass')||{}).value||'';
    email = email.trim();
    if(!email||!pass){ _phdrShowErr('Completa todos los campos.'); return; }
    if(pass.length<8){ _phdrShowErr('La contraseña debe tener mínimo 8 caracteres.'); return; }
    var btn = document.getElementById('tb-reg-btn');
    if(btn){btn.textContent='Creando…';btn.disabled=true;}
    var sb = window.supabase.createClient(_SURL, _SKEY);
    // negocio + regreso a este dominio: el correo de confirmación sale con la marca de Alejandro (plantillas compartidas de Supabase)
    sb.auth.signUp({email:email, password:pass, options:{ data:{ negocio:'alejandrocadcam' }, emailRedirectTo: location.origin + '/app/login.html' }}).then(function(res){
      if(btn){btn.textContent='Crear cuenta';btn.disabled=false;}
      if(res.error){ _phdrShowErr(res.error.message); return; }
      var err = document.getElementById('tb-modal-err');
      if(err){err.style.background='rgba(0,255,65,.08)';err.style.borderColor='rgba(0,255,65,.25)';err.style.color='#00FF41';err.textContent='✅ Cuenta creada. Revisa tu correo para confirmar.';err.style.display='block';}
    }).catch(function(){
      if(btn){btn.textContent='Crear cuenta';btn.disabled=false;}
      _phdrShowErr('Error de conexión.');
    });
  };

  /* ── CHATBOT IA + MODAL MANAGER — diferidos con requestIdleCallback ── */
  // Estas funciones no son críticas para el primer render
  (function _deferNonCritical() {
    function _init() {
  var _pgHistory = [];

  /* Una sola pregunta a la IA, con el mismo contexto que el chat (lo usa el orbe del Centro de Ayuda, js/orbe-ia.js) */
  window._phdrPreguntaIA = function (texto, canal) {
    return fetch('/api/gemini', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction: { parts: [{ text: _pgSystemPrompt() }] }, contents: [{ role: 'user', parts: [{ text: String(texto).slice(0, 300) }] }], canal: canal || 'orbe' })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        var c = d && d.candidates && d.candidates[0] && d.candidates[0].content;
        if (c && c.parts) return c.parts.map(function (p) { return p.text || ''; }).join('').trim();
        var e = new Error((d && d.error) || ('HTTP ' + r.status)); e.status = r.status; throw e;
      });
    });
  };

  function _pgSystemPrompt() {
    return 'Eres el asistente técnico oficial de Alejandro Carvajal, diseñador CAD/CAM dental independiente con sede en Colombia.\n\n' +
      'PÁGINA ACTUAL: ' + (document.title||'Alejandro Carvajal CAD/CAM') + ' (' + window.location.pathname + ')\n\n' +
      'SERVICIOS:\n' +
      '• Diseño CAD remoto (Exocad, 3Shape, CoDiagnostiX, Blender for Dental)\n' +
      '• Guías quirúrgicas digitales para implantes (dentosoportada, mucosoportada)\n' +
      '• Férulas oclusales Michigan y NTI-tss\n' +
      '• Setups de ortodoncia invisible (Exocad Ortho)\n' +
      '• Revisión y corrección de diseños CAD\n' +
      '• Formatos aceptados: STL, OBJ, PLY, CBCT (DICOM), Exocad, 3Shape\n\n' +
      'PRECIOS (referencia USD — confirmación exacta en /calculadora-diseno o WA):\n' +
      '• Corona unitaria: desde $12 USD | Express 24h: +$8 USD\n' +
      '• Guía quirúrgica completa (por arco): desde $59 USD\n' +
      '• Férula oclusal: desde $18 USD\n' +
      '• Full Arch (por arco): desde $80 USD\n\n' +
      'TIEMPOS: Corona/carilla estándar 24–48h · Express desde 15 min · Full Arch 4–8h · Guías quirúrgicas 48–72h (incluye planificación CBCT).\n' +
      'PROCESO DE REVISIÓN: El doctor recibe el STL del diseño para aprobación. Incluye 1 revisión sin costo adicional. Revisiones adicionales tienen costo según la complejidad.\n' +
      'PAGOS: Para Colombia — transferencia PSE, Nequi, Daviplata. Para internacional — PayPal, Wise, transferencia USD. 100% anticipado primeros clientes.\n' +
      'CONTACTO: WhatsApp +57 321 958 1949 · alejandrocarvajal@hotmail.com\n' +
      'ENVÍO DE CASOS: formulario en /flujo-diseno o por WhatsApp adjuntando STL. También por WeTransfer, Google Drive o Dropbox.\n\n' +
      'PORTAL DEL CLIENTE (/app/client-panel.html): El doctor puede ver historial de casos, aprobar diseños, descargar STL, cotizar y ver su código de referidos. El seguimiento es en tiempo real.\n\n' +
      'REGISTRO: El doctor puede crear su cuenta enviando un escáner en /envia-tu-scanner — el sistema crea su portal automáticamente.\n\n' +
      'FAQ: /preguntas — preguntas frecuentes con buscador sobre precios, tiempos y formatos.\n\n' +
      'BORRADOR: En el flujo de pedido (/flujo-diseno) hay un botón "Guardar borrador" — el formulario se guarda 7 días en el dispositivo.\n\n' +
      'PROGRAMA DE REFERIDOS: El colega obtiene 5% de descuento en su primer diseño. El referidor recibe $30.000 COP de crédito (cupón CRED-XXXXXXXX). Código en /app/client-panel.\n\n' +
      'CURSOS EXOCAD: Alejandro ofrece capacitación 1 a 1 presencial u online. Módulos: básico, Full Arch & guías quirúrgicas, mentoring con casos reales. Detalles en /cursos.\n\n' +
      'Responde en español, técnico pero accesible. Máx 3 párrafos cortos. ' +
      'Si preguntan precio exacto, envía a /calculadora-diseno o WhatsApp. ' +
      'No inventes datos — di "confirma con Alejandro por WhatsApp al +57 321 958 1949". ' +
      'Si escriben en inglés, responde en inglés. Emojis técnicos con moderación (🦷 ⚙️ 📐).';
  }


  /* ── PÁGINAS /en/: menú, pie y aviso de cookies en inglés (antes salían en español) ── */
  if (window._phdrIdiomaPagina && window._phdrIdiomaPagina() === 'en') {
    var _EN = {"Correo electrónico": "Email", "Contraseña": "Password", "ACCESO": "LOG IN", "REGISTRO": "SIGN UP", "SERVICIOS": "SERVICES", "Coronas & Inlays": "Crowns & Inlays", "Zirconia · disilicato · PMMA · desde $14 USD": "Zirconia · lithium disilicate · PMMA · from $14 USD", "Carillas & DSD": "Veneers & DSD", "Diseño estético · control de proporciones": "Esthetic design · proportion control", "Cirugía Guiada": "Guided Surgery", "Desde $65 USD · planificación digital · desde 4h": "From $65 USD · digital planning · from 4h", "Full Arch & Rehabilitaciones": "Full Arch & Rehabilitations", "All-on-4 · All-on-6 · híbridos": "All-on-4 · All-on-6 · hybrids", "Férulas & Oclusión": "Splints & Occlusion", "Michigan · NTI · plano de mordida": "Michigan · NTI · bite plane", "PORTAFOLIO": "PORTFOLIO", "ENVÍA TU CASO": "SEND YOUR CASE", "SOBRE MÍ": "ABOUT ME", "SIGUE TU CASO": "TRACK YOUR CASE", "SOPORTE": "SUPPORT", "Cursos Exocad": "Exocad Courses", "Principiante · Avanzado": "Beginner · Advanced", "Reseñas": "Reviews", "Laboratorios · Clínicas · Internacional": "Labs · Clinics · International", "Asistente IA": "AI Assistant", "Respuesta 24/7": "Answers 24/7", "HAZ TU PEDIDO": "PLACE AN ORDER", "Diseño CAD Remoto": "Remote CAD Design", "Global · STL en 24h": "Global · STL in 24h", "Enviar mi Caso": "Send my Case", "Portal · login requerido": "Portal · login required", "Portal Clientes": "Client Portal", "Seguimiento en tiempo real": "Real-time tracking", "DISEÑO CAD REMOTO": "REMOTE CAD DESIGN", "COTIZADOR": "QUOTE", "CIRUGÍA GUIADA": "GUIDED SURGERY", "CURSOS EXOCAD": "EXOCAD COURSES", "RESEÑAS": "REVIEWS", "ASISTENTE IA": "AI ASSISTANT", "PORTAL CLIENTES": "CLIENT PORTAL", "MODO CLARO": "LIGHT MODE", "MODO OSCURO": "DARK MODE", "¿Qué necesitas?": "What do you need?", "Diseño CAD": "CAD Design", "Global · 24h": "Global · 24h", "Subir STL": "Upload STL", "Sin login": "No login", "Diseñador dental especializado en Exocad y 3Shape. Diseño remoto de coronas, guías quirúrgicas, Full Arch y DSD para clínicas y laboratorios del mundo.": "Dental designer specialized in Exocad and 3Shape. Remote design of crowns, surgical guides, Full Arch and DSD for clinics and labs worldwide.", "🌎 Bogotá, Colombia · Servicio global": "🌎 Bogotá, Colombia · Worldwide service", "Diseño Remoto": "Remote Design", "Cotizador Online": "Online Quote", "Envía tu Escáner": "Send your Scan", "Portafolio": "Portfolio", "Seguimiento de Caso": "Case Tracking", "Formación": "Training", "Soporte técnico": "Technical support", "Preguntas frecuentes": "FAQ", "Alineadores Invisibles": "Clear Aligners", "Ferulas Oclusales": "Occlusal Splints", "Blog técnico": "Technical blog", "📱 Instalar App": "📱 Install App", "Empresa": "Company", "Sobre Alejandro": "About Alejandro", "Términos y Privacidad": "Terms & Privacy", "Acceso Clientes": "Client Login", "Soporte directo": "Direct support", "© 2026 Alejandro Carvajal · Diseñador CAD/CAM Dental · Bogotá, Colombia ·": "© 2026 Alejandro Carvajal · Dental CAD/CAM Designer · Bogotá, Colombia ·", "Términos": "Terms", "Privacidad": "Privacy", "Usamos": "We use", "cookies analíticas": "analytics cookies", "para mejorar el servicio.": "to improve the service.", "Ver política": "See policy", "Solo esenciales": "Essential only", "Aceptar": "Accept"};
    var _traducirEn = function () {
      ['nav-topbar', 'pheader-v2', 'pnav2-mob', 'pcta-pedido', 'ac-footer-root', 'ac-cookie-banner'].forEach(function (id) {
        var raiz = document.getElementById(id), w, n, k;
        if (!raiz) return;
        w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
        while ((n = w.nextNode())) { k = n.nodeValue.trim(); if (_EN[k]) n.nodeValue = n.nodeValue.replace(k, _EN[k]); }
        raiz.querySelectorAll('input[placeholder]').forEach(function (i) { if (_EN[i.placeholder]) i.placeholder = _EN[i.placeholder]; });
      });
    };
    window._phdrTraducir = _traducirEn;
    _traducirEn();
    document.addEventListener('DOMContentLoaded', _traducirEn);
    window.addEventListener('load', _traducirEn);
  }

  /* ── BUSCADOR DE LA WEB + IA ── se carga la primera vez que se usa (lupa del menú, Ctrl+K o «/») */
  window._phdrBuscar = function () {
    var abrir = function () { window.Buscador.abrir({ wa: '573219581949' }); };
    if (window.Buscador) return abrir();
    var s = document.createElement('script'); s.src = '/js/buscador-web.js?v=20261007'; s.onload = abrir;
    document.head.appendChild(s);
  };
  if (window.location.pathname.indexOf('/app/') !== 0) {          // en /app el Ctrl+K es el buscador de casos
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase(), t = e.target, escribiendo = t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName));
      if (((e.ctrlKey || e.metaKey) && k === 'k') || (k === '/' && !escribiendo && !e.ctrlKey && !e.metaKey && !e.altKey)) { e.preventDefault(); window._phdrBuscar(); }
    });
  }

  window._phdrToggleIA = function() {
    var w = document.getElementById('pg-chat-window');
    if (!w) return;
    var opening = !w.classList.contains('open');
    w.classList.toggle('open');
    var btn = document.getElementById('pnav2-ia-btn');
    if (btn) btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
    if (opening && !document.getElementById('pg-msgs').children.length) {
      _pgAddMsg('bot', 'Hola 👋 Soy el asistente de Alejandro Carvajal. Puedo ayudarte con precios, tiempos de entrega y cómo enviar tu caso. ¿En qué te ayudo?');
    }
    var inp = document.getElementById('pg-chat-input');
    if (opening && inp) setTimeout(function(){ inp.focus(); }, 300);
  };

  function _pgEscH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function _pgAddMsg(role, text) {
    var msgs = document.getElementById('pg-msgs');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'pg-msg' + (role==='user'?' user':'');
    var safe = _pgEscH(text).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    div.innerHTML = '<div class="pg-msg-av">'+(role==='user'?'👤':'🦷')+'</div><div class="pg-msg-bbl">'+safe+'</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  window._pgSend = function(text) {
    var inp = document.getElementById('pg-chat-input');
    var msg = text || (inp ? inp.value.trim() : '');
    if (!msg) return;
    if (inp) { inp.value = ''; inp.style.height = 'auto'; }
    var sugs = document.getElementById('pg-sugs');
    if (sugs) sugs.style.display = 'none';
    var sendBtn = document.getElementById('pg-chat-send');
    if (sendBtn) sendBtn.disabled = true;
    _pgAddMsg('user', msg);
    _pgHistory.push({ role:'user', parts:[{ text:msg }] });
    // Recorta a los últimos 12 turnos: mantiene contexto sin crecer sin límite (evita chocar
    // el cap de 24KB del proxy /api/gemini en chats largos y baja el costo por request).
    if (_pgHistory.length > 12) _pgHistory = _pgHistory.slice(-12);
    var typing = document.getElementById('pg-typing');
    if (typing) typing.classList.add('visible');
    fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: _pgSystemPrompt() }] },
        contents: _pgHistory
      })
    }).then(function(r){ return r.json(); })
    .then(function(d) {
      if (typing) typing.classList.remove('visible');
      if (sendBtn) sendBtn.disabled = false;
      if (d.candidates && d.candidates[0] && d.candidates[0].content) {
        var reply = d.candidates[0].content.parts[0].text;
        _pgHistory.push({ role:'model', parts:[{ text:reply }] });
        _pgAddMsg('bot', reply);
      } else if (d.error && (String(d.error).includes('solicitudes') || String(d.error).includes('429'))) {
        _pgAddMsg('bot', 'Muchas consultas seguidas — espera un momento e intenta de nuevo.');
      } else if (d.error && String(d.error).includes('configurado')) {
        _pgAddMsg('bot', 'El asistente está temporalmente fuera de línea. Escríbeme directamente por <a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer">WhatsApp +57 321 958 1949</a> — respondo en minutos.');
      } else {
        var errDetail = d.error ? (' (' + String(d.error).slice(0,60) + ')') : '';
        _pgAddMsg('bot', 'No pude procesar tu pregunta ahora mismo' + errDetail + '. Escríbeme por <a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer">WhatsApp</a> y te respondo enseguida.');
      }
    })
    .catch(function() {
      if (typing) typing.classList.remove('visible');
      if (sendBtn) sendBtn.disabled = false;
      _pgAddMsg('bot', 'Sin conexión ahora mismo. <a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer">WhatsApp +57 321 958 1949</a> — respondo en minutos.');
    });
  };

  document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'pg-chat-input') {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    }
  });

  var chatInput = document.getElementById('pg-chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', function(e){
      if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); _pgSend(); }
    });
  }

  /* ── THEME TOGGLE ──
     Modo claro = el diseño oscuro con los colores invertidos, en UNA sola regla para toda la web.
     Antes cada página tenía su propio «light-mode» a medias (variables sueltas + estilos fijos oscuros)
     y en claro quedaban textos sin contraste. Fotos, videos y mapas se vuelven a invertir para verse normales.
     Estado único: localStorage 'pg_theme'. El «light-mode» viejo de cada página se neutraliza. */
  var _CLARO_CSS = 'html.tema-claro{filter:invert(1) hue-rotate(180deg);background:#050505}'
    // Se vuelven a invertir (se ven con sus colores reales): fotos, videos, mapas y escenas 3D
    // (el robot de Spline y los visores three.js — su <canvas> lleva data-engine). Las partículas 2D sí se invierten.
    + 'html.tema-claro img,html.tema-claro video,html.tema-claro iframe,html.tema-claro [style*="url("],'
    + 'html.tema-claro spline-viewer,html.tema-claro model-viewer,html.tema-claro canvas[data-engine],html.tema-claro [data-sin-invertir]{filter:invert(1) hue-rotate(180deg)}'
    + 'html.tema-claro [style*="url("] img{filter:none}'
    + 'html.tema-claro spline-viewer{opacity:.38}'   // el robot de la portada detrás del título: suave para que el texto se lea
    + '@media print{html.tema-claro{filter:none}}';
  function _claroCss() {
    if (document.getElementById('tema-claro-css')) return;
    var s = document.createElement('style'); s.id = 'tema-claro-css'; s.textContent = _CLARO_CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  function _phdrIconos(claro) {
    var btn  = document.getElementById('pnav2-theme-btn');
    var mob  = document.getElementById('pnav2-theme-mob');
    var ico  = document.getElementById('pnav2-theme-ico');
    if (btn) btn.textContent = claro ? '☀️' : '🌙';
    if (mob) mob.style.color = claro ? '#b45309' : '#94a3b8';
    if (ico) { ico.className = claro ? 'fas fa-sun' : 'fas fa-moon'; ico.parentElement.lastChild.textContent = claro ? 'MODO OSCURO' : 'MODO CLARO'; }
    if (window._phdrTraducir) window._phdrTraducir(); // en EN/PT, el texto recién puesto se traduce
  }
  /* Contraste en modo claro: al invertir, los textos de acento (magenta, neón, cian, dorado) quedan en tonos
     pastel sobre fondo claro (2–4:1). Cada texto que quede bajo 4.5:1 (3:1 si es grande) se aclara ANTES de la
     inversión —al invertir queda más oscuro, mismo tono— hasta pasar. Solo en modo claro; al volver a oscuro se
     restaura el color original. Se salta lo dudoso (fondos con imagen o degradado, texto con degradado). */
  var _HR = [[-0.574, 1.43, 0.144], [0.426, 0.43, 0.144], [0.426, 1.43, -0.856]]; // hue-rotate(180deg)
  function _visto(c) { // color que ve el ojo con invert(1) hue-rotate(180deg)
    return _HR.map(function (f) { return Math.min(1, Math.max(0, f[0] * (1 - c[0]) + f[1] * (1 - c[1]) + f[2] * (1 - c[2]))); });
  }
  function _lum(c) {
    var k = [0.2126, 0.7152, 0.0722], s = 0;
    for (var i = 0; i < 3; i++) s += k[i] * (c[i] <= 0.03928 ? c[i] / 12.92 : Math.pow((c[i] + 0.055) / 1.055, 2.4));
    return s;
  }
  function _rgba(s) { var m = String(s).match(/[\d.]+/g); return m && m.length >= 3 ? { c: [m[0] / 255, m[1] / 255, m[2] / 255], a: m[3] === undefined ? 1 : +m[3] } : null; }
  function _entorno(el) { // fondos posibles (antes de invertir: uno por color de cada degradado) y opacidad; null si hay imagen
    var capas = [], op = 1, e, cs, b, g;
    for (e = el; e && e.nodeType === 1; e = e.parentElement) {
      cs = getComputedStyle(e); op *= +cs.opacity;
      if (cs.backgroundImage !== 'none') {
        if (/url\(/.test(cs.backgroundImage)) return null;
        g = (cs.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(_rgba).filter(Boolean);
        if (g.length) capas.push(g.slice(0, 4));
      }
      b = _rgba(cs.backgroundColor);
      if (b && b.a > 0) capas.push([b]);
      if (b && b.a >= 0.99) break;
    }
    var fondos = [[0.02, 0.02, 0.02]];
    for (var i = capas.length - 1; i >= 0; i--) {
      var sig = [];
      fondos.forEach(function (f) { capas[i].forEach(function (l) { sig.push(f.map(function (v, k) { return l.c[k] * l.a + v * (1 - l.a); })); }); });
      fondos = sig.slice(0, 16);
    }
    return { fondos: fondos, op: op };
  }
  function _contrasteClaro() {
    if (!document.body || !document.documentElement.classList.contains('tema-claro')) return;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, vistos = new Set();
    while ((n = w.nextNode())) {
      var el = n.parentElement;
      if (!el || vistos.has(el) || !n.textContent.trim()) continue;
      vistos.add(el);
      if (el.hasAttribute('data-claro-color') || el.closest('svg,script,style,[data-sin-invertir],[style*="url("]')) continue;
      var cs = getComputedStyle(el), t = _rgba(cs.color), fill = _rgba(cs.webkitTextFillColor);
      if (!t || t.a < 0.5 || (fill && fill.a === 0)) continue;
      var en = _entorno(el);
      if (!en || en.op < 0.5) continue;
      var fs = parseFloat(cs.fontSize), meta = (fs >= 24 || (fs >= 18.66 && parseInt(cs.fontWeight, 10) >= 700)) ? 3 : 4.5;
      var fvs = en.fondos.map(_visto), lfs = fvs.map(_lum);
      var razon = function (c) { // el peor caso entre los colores del fondo
        var vc = _visto(c);
        return Math.min.apply(null, fvs.map(function (fv, j) {
          var lt = _lum(vc.map(function (x, k) { return x * en.op + fv[k] * (1 - en.op); }));
          return (Math.max(lt, lfs[j]) + 0.05) / (Math.min(lt, lfs[j]) + 0.05);
        }));
      };
      if (razon(t.c) >= meta) continue;
      var lf = lfs.reduce(function (a, v) { return a + v; }, 0) / lfs.length;
      var hacia = lf > 0.4 ? 1 : 0; // fondo visto claro → letra vista más oscura → color de origen más claro
      for (var k = 0.1; k <= 1.001; k += 0.1) {
        var c = t.c.map(function (v) { return v + (hacia - v) * k; });
        if (razon(c) >= meta) {
          el.setAttribute('data-claro-color', (el.style.getPropertyValue('color') || '') + '|' + el.style.getPropertyPriority('color'));
          el.style.setProperty('color', 'rgb(' + c.map(function (v) { return Math.round(v * 255); }).join(',') + ')', 'important');
          break;
        }
      }
    }
  }
  function _contrasteRestaurar() {
    document.querySelectorAll('[data-claro-color]').forEach(function (el) {
      var p = el.getAttribute('data-claro-color').split('|');
      if (p[0]) el.style.setProperty('color', p[0], p[1]); else el.style.removeProperty('color');
      el.removeAttribute('data-claro-color');
    });
  }
  var _ccObs = null, _ccT = 0;
  function _contrasteProgramar() {
    clearTimeout(_ccT);
    _ccT = setTimeout(function () { (window.requestIdleCallback || setTimeout)(_contrasteClaro); }, 300);
  }
  function _contrasteVigilar(claro) {
    if (!claro) { if (_ccObs) { _ccObs.disconnect(); _ccObs = null; } _contrasteRestaurar(); return; }
    if (!document.body) { document.addEventListener('DOMContentLoaded', function () { _contrasteVigilar(document.documentElement.classList.contains('tema-claro')); }); return; }
    _contrasteProgramar();
    if (!_ccObs) { _ccObs = new MutationObserver(_contrasteProgramar); _ccObs.observe(document.body, { childList: true, subtree: true }); }
  }
  function _phdrApplyTheme(t) {
    var claro = t === 'light';
    _claroCss();
    document.documentElement.classList.toggle('tema-claro', claro);
    if (document.body) document.body.classList.remove('light-mode');
    _phdrIconos(claro);
    _contrasteVigilar(claro);
    try { localStorage.setItem('pg_theme', claro ? 'light' : 'dark'); localStorage.setItem('theme', 'dark'); } catch (e) {}
  }

  window._phdrToggleTheme = function() {
    _phdrApplyTheme(document.documentElement.classList.contains('tema-claro') ? 'dark' : 'light');
  };

  /* Restaurar preferencia guardada (también la clave vieja 'theme' de algunas páginas) */
  (function(){
    var claro = false;
    try { claro = localStorage.getItem('pg_theme') === 'light' || localStorage.getItem('theme') === 'light'; } catch (e) {}
    if (claro) _phdrApplyTheme('light'); else { try { localStorage.setItem('theme', 'dark'); } catch (e) {} }
    document.addEventListener('DOMContentLoaded', function(){ _phdrIconos(document.documentElement.classList.contains('tema-claro')); });
    // Botones viejos de algunas páginas que ponen «light-mode» en el body: se traducen a este modo único
    function vigilar() {
      if (!document.body) return;
      new MutationObserver(function(){
        if (document.body.classList.contains('light-mode')) {
          document.body.classList.remove('light-mode');
          _phdrApplyTheme(document.documentElement.classList.contains('tema-claro') ? 'dark' : 'light');
        }
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    if (document.body) vigilar(); else document.addEventListener('DOMContentLoaded', vigilar);
  })();

  // Marcar íconos FA decorativos como aria-hidden
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('i.fas,i.fab,i.far,i.fal,i.fad').forEach(function(ic){
      if (!ic.hasAttribute('aria-hidden') && !ic.hasAttribute('aria-label') && !ic.hasAttribute('role')){
        ic.setAttribute('aria-hidden','true');
      }
    });
  });

  /* ── MODAL MANAGER GLOBAL — role=dialog + focus trap ── */
  (function(){
    var _lastFocus = null, _currentModal = null;
    var FOCUSABLE = ['a[href]','button:not([disabled])','input:not([disabled])','select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'].join(',');
    function _isVisible(el) { if (!el) return false; var s=window.getComputedStyle(el); return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'; }
    function _isModal(el) { if (!el||el.nodeType!==1) return false; var cls=el.className||'',id=el.id||''; return cls.indexOf('modal-overlay')!==-1||cls.indexOf('modal-ov')!==-1||(cls.indexOf('modal')!==-1&&cls.indexOf('active')!==-1)||(id.indexOf('modal-')===0&&_isVisible(el)); }
    function _applyDialog(el) { if (!el.hasAttribute('role')) el.setAttribute('role','dialog'); if (!el.hasAttribute('aria-modal')) el.setAttribute('aria-modal','true'); if (!el.hasAttribute('aria-labelledby')&&!el.hasAttribute('aria-label')) { var h=el.querySelector('h1,h2,h3,[id*="title"],[id*="titulo"]'); if (h) { if (!h.id) h.id='acm-'+Math.random().toString(36).slice(2,7); el.setAttribute('aria-labelledby',h.id); } else { el.setAttribute('aria-label','Diálogo'); } } }
    function _focusFirst(modal) { var items=Array.from(modal.querySelectorAll(FOCUSABLE)).filter(_isVisible); if (items.length) items[0].focus(); }
    function _trapFocus(e) { if (!_currentModal||e.key!=='Tab') return; var items=Array.from(_currentModal.querySelectorAll(FOCUSABLE)).filter(_isVisible); if (!items.length) return; var first=items[0],last=items[items.length-1]; if (e.shiftKey) { if (document.activeElement===first) { e.preventDefault(); last.focus(); } } else { if (document.activeElement===last) { e.preventDefault(); first.focus(); } } }
    function _onOpen(modal) { _applyDialog(modal); _lastFocus=document.activeElement; _currentModal=modal; setTimeout(function(){ _focusFirst(modal); },50); document.addEventListener('keydown',_trapFocus); }
    function _onClose() { _currentModal=null; document.removeEventListener('keydown',_trapFocus); if (_lastFocus&&_lastFocus.focus) { try { _lastFocus.focus(); } catch(_){} } }
    var obs=new MutationObserver(function(mutations) { mutations.forEach(function(m) { var el=m.target; if (_isModal(el)) { if (_isVisible(el)) { _onOpen(el); } else if (_currentModal===el) { _onClose(); } } }); });
    document.addEventListener('DOMContentLoaded', function(){ obs.observe(document.body,{attributes:true,attributeFilter:['class','style'],subtree:true}); });
  })();
  } // fin _init

  // Diferir ejecución al hilo idle — no bloquea el paint inicial
  if ('requestIdleCallback' in window) {
    requestIdleCallback(_init, { timeout: 2000 });
  } else {
    setTimeout(_init, 500);
  }
  })(); // _deferNonCritical

})();
