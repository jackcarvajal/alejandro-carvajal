/**
 * Alejandro Carvajal — Header Global
 * Estructura 100% idéntica a PRODIGY. Solo cambia la marca y los links.
 */

/* ── COOKIE BANNER ─────────────────────────────────────────────────────── */
(function(){
  if (localStorage.getItem('pg_cookies_decision')) return;
  document.addEventListener('DOMContentLoaded', function(){
    var b = document.createElement('div');
    b.id = 'pg-cookie-banner';
    b.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#0a0f1a;border-top:1px solid rgba(212,175,55,.25);padding:14px 24px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between;font-family:-apple-system,sans-serif;font-size:.78rem;color:#94a3b8;';
    b.innerHTML =
      '<span style="flex:1;min-width:220px;line-height:1.6;"><strong style="color:#e2e8f0;">🍪 Cookies / Privacy</strong> — We use analytics cookies to improve the service. ' +
      '<a href="/terminos-y-legal" style="color:#D4AF37;text-decoration:none;">Privacy policy</a>.</span>' +
      '<div style="display:flex;gap:8px;flex-shrink:0;">' +
        '<button type="button" id="pg-ck-accept" style="padding:8px 18px;background:linear-gradient(135deg,#D946A6,#9333ea);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.78rem;">Accept</button>' +
        '<button type="button" id="pg-ck-reject" style="padding:8px 18px;background:transparent;border:1px solid rgba(255,255,255,.15);color:#94a3b8;border-radius:8px;cursor:pointer;font-size:.78rem;">Essential only</button>' +
      '</div>';
    document.body.appendChild(b);
    function dismiss(accept) {
      localStorage.setItem('pg_cookies_decision', accept ? 'accepted' : 'rejected');
      if (accept && window.gtag) window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted'});
      b.style.transition = 'opacity .3s'; b.style.opacity = '0';
      setTimeout(function(){ b.remove(); }, 300);
    }
    document.getElementById('pg-ck-accept').onclick = function(){ dismiss(true); };
    document.getElementById('pg-ck-reject').onclick = function(){ dismiss(false); };
  });
})();

/* ── GA4 — carga diferida con requestIdleCallback para no bloquear render ── */
(function(){
  function _loadGA4() {
    if (document.getElementById('ac-ga4')) return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',wait_for_update:500});
    gtag('js', new Date());
    gtag('config','G-Z8G2X7ETQ1',{anonymize_ip:true});
    var s = document.createElement('script');
    s.id='ac-ga4'; s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id=G-Z8G2X7ETQ1';
    document.head.appendChild(s);
  }
  // Usar requestIdleCallback para no bloquear el hilo principal
  if ('requestIdleCallback' in window) {
    requestIdleCallback(_loadGA4, { timeout: 3000 });
  } else {
    setTimeout(_loadGA4, 1000);
  }
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
    'border-radius:6px;color:#e2e8f0;font-size:13px;height:44px;',
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
    '.pnav2-ped-btn{background:linear-gradient(135deg,#D946A6 0%,#a0186e 100%);',
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
    '.pnav2-ham{display:none;background:none;border:none;cursor:pointer;padding:6px;color:#D4AF37;font-size:1.4rem;}',
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

    /* IA button */
    '.pnav2-ia-btn{background:rgba(0,255,65,0.08);border:1.5px solid rgba(0,255,65,0.3);',
    'color:#00FF41;width:38px;height:38px;border-radius:8px;cursor:pointer;',
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
    'background:linear-gradient(135deg,#D946A6 0%,#a0186e 100%);',
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
    '.pg-chat-input-area{padding:12px 14px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:flex-end;flex-shrink:0;}',
    '#pg-chat-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#e2e8f0;font-size:.88rem;font-family:inherit;padding:10px 14px;outline:none;resize:none;min-height:40px;max-height:100px;transition:border-color .2s;}',
    '#pg-chat-input:focus{border-color:rgba(0,210,255,0.4);}',
    '#pg-chat-input::placeholder{color:#94a3b8;}',
    '#pg-chat-send{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#00d2ff,#006699);border:none;cursor:pointer;color:#fff;font-size:.9rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s;}',
    '#pg-chat-send:hover{opacity:.85;}#pg-chat-send:disabled{opacity:.4;cursor:not-allowed;}',
    '@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',

    /* THEME TOGGLE BTN */
    '.pnav2-theme-btn{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);',
    'color:#e2e8f0;width:38px;height:38px;border-radius:8px;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;font-size:1rem;',
    'flex-shrink:0;transition:all .2s;font-family:inherit;}',
    '.pnav2-theme-btn:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.35);}',
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
          '<div style="position:relative;margin-bottom:12px;"><i class="far fa-envelope" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-modal-email" type="email" placeholder="Correo electrónico" autocomplete="email" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:.88rem;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'"></div>' +
          '<div style="position:relative;margin-bottom:12px;"><i class="fas fa-lock" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-modal-pass" type="password" placeholder="Contraseña" autocomplete="current-password" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:.88rem;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'" onkeydown="if(event.key===\'Enter\')_phdrLogin()"></div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">' +
            '<label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:.75rem;color:#94a3b8;"><input type="checkbox" id="tb-remember" style="accent-color:#D946A6;width:14px;height:14px;"> Recordarme</label>' +
            '<a href="/app/login.html?mode=reset" style="font-size:.73rem;color:#D946A6;text-decoration:none;">¿Olvidaste tu clave?</a>' +
          '</div>' +
          '<button type="button" onclick="_phdrLogin()" id="tb-modal-btn" style="width:100%;padding:13px;background:linear-gradient(135deg,#D946A6,#9333ea);color:#fff;border:none;border-radius:10px;font-size:.9rem;font-weight:800;cursor:pointer;letter-spacing:.5px;transition:opacity .2s;">Entrar</button>' +
          '<p style="text-align:center;font-size:.75rem;color:#94a3b8;margin-top:14px;">¿No tienes cuenta? <button type="button" onclick="_phdrTab(\'register\')" style="background:none;border:none;color:#D946A6;font-weight:700;cursor:pointer;font-size:.75rem;">Regístrate</button></p>' +
        '</div>' +
        /* Campos registro */
        '<div id="tb-fields-register" style="display:none;">' +
          '<div style="position:relative;margin-bottom:12px;"><i class="far fa-envelope" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-reg-email" type="email" placeholder="Correo electrónico" autocomplete="email" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:.88rem;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'"></div>' +
          '<div style="position:relative;margin-bottom:12px;"><i class="fas fa-lock" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none;"></i><input id="tb-reg-pass" type="password" placeholder="Contraseña (mín. 8 caracteres)" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:.88rem;padding:11px 12px 11px 36px;outline:none;font-family:inherit;" onfocus="this.style.borderColor=\'rgba(217,70,166,.6)\'" onblur="this.style.borderColor=\'rgba(255,255,255,.12)\'"></div>' +
          '<button type="button" onclick="_phdrRegister()" id="tb-reg-btn" style="width:100%;padding:13px;background:linear-gradient(135deg,#D946A6,#9333ea);color:#fff;border:none;border-radius:10px;font-size:.9rem;font-weight:800;cursor:pointer;letter-spacing:.5px;">Crear cuenta</button>' +
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
        '<a href="/" class="pnav2-logo">' +
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
              '<button type="button" onclick="_phdrToggleIA()" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 16px;width:100%;text-align:left;color:inherit;font:inherit;" aria-label="Abrir asistente IA"><i class="fas fa-robot" style="color:#00FF41"></i><span>Asistente IA<span class="dd-sub">Respuesta 24/7</span></span></button>' +
            '</div>' +
          '</div>' +
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
    if (cta) cta.classList.toggle('visible', window.scrollY > 200);
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
    localStorage.removeItem(_TOKEN_KEY);
    window.location.reload();
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
    sb.auth.signUp({email:email, password:pass}).then(function(res){
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

  /* ── THEME TOGGLE ── */
  var _LIGHT_VARS = {
    '--bg':'#f0f4f8','--card':'#ffffff','--muted':'#475569',
    '--border':'rgba(0,0,0,0.1)','--txt':'#0f172a',
    '--bg-darker':'#eef2f7','--bg-dark':'#f5f7fa','--bg-card':'#ffffff',
    '--bg-card-hover':'#f8fafc','--text-primary':'#0f172a',
    '--text-secondary':'#374151','--text-tertiary':'#6b7280',
    '--text-muted':'#9ca3af','--border-subtle':'rgba(0,0,0,0.08)',
    '--border-color':'rgba(0,0,0,0.12)',
    '--neon':'#16a34a',
    '--accent-neon':'#16a34a',
    '--cyan':'#0284c7','--accent-cyan':'#0284c7',
    '--mg':'#be185d','--accent-mg':'#be185d',
    '--gold':'#b45309','--accent-gold':'#b45309',
    '--surface':'rgba(0,0,0,0.04)',
    '--overlay':'rgba(0,0,0,0.06)'
  };

  function _phdrApplyTheme(t) {
    var root = document.documentElement;
    var btn  = document.getElementById('pnav2-theme-btn');
    var mob  = document.getElementById('pnav2-theme-mob');
    var ico  = document.getElementById('pnav2-theme-ico');
    if (t === 'light') {
      Object.keys(_LIGHT_VARS).forEach(function(k){ root.style.setProperty(k, _LIGHT_VARS[k]); });
      document.body.classList.add('light-mode');
      if (btn) btn.textContent = '☀️';
      if (mob) mob.style.color = '#b45309';
      if (ico) { ico.className = 'fas fa-sun'; ico.parentElement.lastChild.textContent = 'MODO OSCURO'; }
    } else {
      Object.keys(_LIGHT_VARS).forEach(function(k){ root.style.removeProperty(k); });
      document.body.classList.remove('light-mode');
      if (btn) btn.textContent = '🌙';
      if (mob) mob.style.color = '#94a3b8';
      if (ico) { ico.className = 'fas fa-moon'; ico.parentElement.lastChild.textContent = 'MODO CLARO'; }
    }
    localStorage.setItem('pg_theme', t);
  }

  window._phdrToggleTheme = function() {
    _phdrApplyTheme(document.body.classList.contains('light-mode') ? 'dark' : 'light');
  };

  /* Restaurar preferencia guardada */
  (function(){
    var saved = localStorage.getItem('pg_theme');
    if (saved === 'light') {
      var root = document.documentElement;
      Object.keys(_LIGHT_VARS).forEach(function(k){ root.style.setProperty(k, _LIGHT_VARS[k]); });
      document.body.classList.add('light-mode');
      document.addEventListener('DOMContentLoaded', function(){
        var btn = document.getElementById('pnav2-theme-btn');
        var ico = document.getElementById('pnav2-theme-ico');
        if (btn) btn.textContent = '☀️';
        if (ico) { ico.className = 'fas fa-sun'; ico.parentElement.lastChild.textContent = 'MODO OSCURO'; }
      });
    }
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
