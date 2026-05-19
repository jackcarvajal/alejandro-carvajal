/**
 * Alejandro Carvajal — Header Global
 * Estructura 100% idéntica a PRODIGY. Solo cambia la marca y los links.
 */

/* ── GA4 ── */
(function(){
  if (document.getElementById('ac-ga4')) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',wait_for_update:500});
  gtag('js', new Date());
  gtag('config','G-3N0ZZE5V10',{anonymize_ip:true});
  var s = document.createElement('script');
  s.id='ac-ga4'; s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id=G-3N0ZZE5V10';
  document.head.appendChild(s);
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
    _fa.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
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
  ].join('');

  var st = document.createElement('style');
  st.id = 'pheader-v2-css';
  st.textContent = css;
  document.head.appendChild(st);

  var page = activePath.split('/').pop() || 'index.html';
  function ac(href) {
    var h = href.split('/').pop().split('#')[0];
    return (h===page||(h===''&&(page===''||page==='index.html')))?' class="pnav2-active"':'';
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
    '</div>';

  /* ── NAVBAR ── */
  var navHtml =
    '<nav id="pheader-v2">' +
      '<div class="pnav2-c">' +
        '<button class="pnav2-ham" id="pnav2-ham" aria-label="Menú"><i class="fas fa-bars" id="pnav2-ham-ico"></i></button>' +

        /* Izquierda */
        '<div class="pnav2-left">' +
          '<div class="pnav2-dd" id="pnav2-dd">' +
            '<button class="pnav2-dd-btn">SERVICIOS <i class="fas fa-chevron-down pnav2-dd-arrow"></i></button>' +
            '<div class="pnav2-dd-menu">' +
              '<a href="/diseno-remoto" style="background:rgba(217,70,166,.08);border-left:2px solid #D946A6;">' +
                '<i class="fas fa-globe" style="color:#D946A6"></i>' +
                '<span>DISEÑO CAD REMOTO<span class="dd-sub">🌍 Internacional · desde $14 USD · 24h</span></span>' +
              '</a>' +
              '<a href="/calculadora-diseno">' +
                '<i class="fas fa-calculator"></i>' +
                '<span>COTIZADOR<span class="dd-sub">Precio instantáneo · USD &amp; COP</span></span>' +
              '</a>' +
              '<a href="/flujo-diseno">' +
                '<i class="fas fa-drafting-compass"></i>' +
                '<span>PEDIR DISEÑO<span class="dd-sub">Sube tu STL · entrega 24h</span></span>' +
              '</a>' +
              '<a href="/envia-tu-scanner">' +
                '<i class="fas fa-upload"></i>' +
                '<span>ENVÍA TU ESCÁNER<span class="dd-sub">Sin login · rápido</span></span>' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<a href="/portafolio"'+ac('/portafolio')+'>PORTAFOLIO</a>' +
          '<a href="/envia-tu-scanner"'+ac('/envia-tu-scanner')+'>ENVÍA TU CASO</a>' +
        '</div>' +

        /* Logo centrado */
        '<a href="/" class="pnav2-logo">' +
          '<svg class="pnav2-logo-gem" width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
              '<linearGradient id="gem1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D946A6"/><stop offset="100%" stop-color="#D4AF37"/></linearGradient>' +
              '<linearGradient id="gem2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".9"/><stop offset="100%" stop-color="#D946A6" stop-opacity=".6"/></linearGradient>' +
            '</defs>' +
            '<polygon points="14,1 27,9 14,23 1,9" fill="url(#gem1)"/>' +
            '<polygon points="14,1 27,9 14,10" fill="url(#gem2)" opacity=".5"/>' +
            '<polygon points="14,1 1,9 14,10" fill="#fff" opacity=".2"/>' +
            '<line x1="1" y1="9" x2="27" y2="9" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/>' +
          '</svg>' +
          '<strong>ALEJANDRO</strong>' +
          '<em>CAD · CAM · DENTAL</em>' +
        '</a>' +

        /* Derecha */
        '<div class="pnav2-right">' +
          '<a href="/blog"'+ac('/blog')+'>BLOG</a>' +
          '<a href="/seguimiento-caso"'+ac('/seguimiento-caso')+'>SIGUE TU CASO</a>' +
          '<div class="pnav2-dd" id="pnav2-dd-sop">' +
            '<button class="pnav2-dd-btn">SOPORTE <i class="fas fa-chevron-down pnav2-dd-arrow"></i></button>' +
            '<div class="pnav2-dd-menu r">' +
              '<a href="/cursos"><i class="fas fa-graduation-cap"></i><span>Cursos Exocad<span class="dd-sub">Principiante · Avanzado</span></span></a>' +
              '<a href="javascript:void(0)" onclick="_phdrToggleIA()"><i class="fas fa-robot" style="color:#00FF41"></i><span>Asistente IA<span class="dd-sub">Respuesta 24/7</span></span></a>' +
            '</div>' +
          '</div>' +
          '<button class="pnav2-ia-btn" id="pnav2-ia-btn" onclick="_phdrToggleIA()" aria-label="Asistente IA"><i class="fas fa-robot"></i></button>' +
          '<div class="pnav2-ped-wrap" id="pnav2-ped-wrap">' +
            '<button class="pnav2-ped-btn" onmouseenter="_phdrPedHover(true)" onmouseleave="_phdrPedHover(false)">HAZ TU PEDIDO <i class="fas fa-chevron-down" style="font-size:9px;margin-left:4px;transition:transform .2s;" id="pnav2-ped-arrow"></i></button>' +
            '<div class="pnav2-ped-drop" id="pnav2-ped-drop">' +
              '<a href="/diseno-remoto" class="pnav2-ped-card"><i class="fas fa-globe" style="color:#D946A6;font-size:1.2rem;"></i><div><strong>Diseño CAD Remoto</strong><span>Global · STL en 24h</span></div></a>' +
              '<a href="/envia-tu-scanner" class="pnav2-ped-card"><i class="fas fa-upload" style="color:#00d2ff;font-size:1.2rem;"></i><div><strong>Envía tu Escáner</strong><span>Sin login · rápido</span></div></a>' +
              '<a href="/flujo-diseno" class="pnav2-ped-card"><i class="fas fa-drafting-compass" style="color:#D4AF37;font-size:1.2rem;"></i><div><strong>Portal Clientes</strong><span>Seguimiento en tiempo real</span></div></a>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</nav>' +

    /* MOBILE */
    '<div class="pnav2-mob" id="pnav2-mob">' +
      '<a href="/diseno-remoto"><i class="fas fa-globe" style="margin-right:8px;color:#D946A6"></i>DISEÑO CAD REMOTO</a>' +
      '<a href="/calculadora-diseno"><i class="fas fa-calculator" style="margin-right:8px"></i>COTIZADOR</a>' +
      '<a href="/portafolio">PORTAFOLIO</a>' +
      '<a href="/envia-tu-scanner">ENVÍA TU CASO</a>' +
      '<a href="/seguimiento-caso">SIGUE TU CASO</a>' +
      '<a href="/blog">BLOG</a>' +
      '<a href="/cursos">CURSOS EXOCAD</a>' +
      '<a href="javascript:void(0)" onclick="_phdrToggleIA();" style="color:#00FF41;"><i class="fas fa-robot" style="margin-right:8px"></i>ASISTENTE IA</a>' +
      '<a href="https://wa.me/573219581949" target="_blank" rel="noopener noreferrer" style="color:#25D366;"><i class="fab fa-whatsapp" style="margin-right:8px"></i>WHATSAPP</a>' +
      '<a href="/app/login.html" style="color:#D946A6;font-weight:900;"><i class="fas fa-key" style="margin-right:8px"></i>PORTAL CLIENTES</a>' +
    '</div>' +

    /* CTA FLOTANTE */
    (noCta ? '' :
      '<div id="pcta-pedido">' +
        '<div id="pcta-label" style="display:none;">¿Qué necesitas?</div>' +
        '<div id="pcta-menu">' +
          '<a href="/diseno-remoto" class="pcta-card pcta-card-cad"><i class="fas fa-globe"></i><span class="pcta-card-title">Diseño CAD</span><span class="pcta-card-sub">Global · 24h</span></a>' +
          '<a href="/envia-tu-scanner" class="pcta-card pcta-card-cam"><i class="fas fa-upload"></i><span class="pcta-card-title">Subir STL</span><span class="pcta-card-sub">Sin login</span></a>' +
        '</div>' +
        '<button id="pcta-btn" onclick="_phdrCtaToggle(this)" aria-expanded="false">' +
          '<span class="ppulse"></span>HAZ TU PEDIDO<i class="fas fa-chevron-up pcta-chev"></i>' +
        '</button>' +
      '</div>') +

    /* CHATBOT */
    '<button id="pg-chat-bubble" onclick="_phdrToggleIA()" aria-label="Asistente IA">' +
      '<i class="fas fa-robot" id="pg-chat-ico"></i><span class="pg-notif"></span>' +
    '</button>' +
    '<div id="pg-chat-window">' +
      '<div class="pg-chat-header">' +
        '<div class="pg-chat-avatar">🦷</div>' +
        '<div class="pg-chat-info"><h4>Asistente Alejandro CAD</h4><p>En línea ahora</p></div>' +
        '<button class="pg-chat-close" onclick="_phdrToggleIA()"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="pg-chat-msgs" id="pg-msgs"></div>' +
      '<div class="pg-typing" id="pg-typing"><div class="pg-tdots"><span></span><span></span><span></span></div></div>' +
      '<div class="pg-chat-sugs" id="pg-sugs">' +
        '<button class="pg-sug-btn" onclick="_pgSend(this.textContent)">¿Cuánto cuesta una corona?</button>' +
        '<button class="pg-sug-btn" onclick="_pgSend(this.textContent)">¿Cómo envío mi STL?</button>' +
        '<button class="pg-sug-btn" onclick="_pgSend(this.textContent)">¿Qué tiempo de entrega?</button>' +
      '</div>' +
      '<div class="pg-chat-input-area">' +
        '<textarea id="pg-chat-input" placeholder="Escribe tu pregunta..." rows="1"></textarea>' +
        '<button id="pg-chat-send" onclick="_pgSend()" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>' +
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
    document.body.style.overflow = open ? 'hidden' : '';
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
  window._phdrLogin = function(e) {
    e.preventDefault();
    var email = document.getElementById('tb-email').value.trim();
    var pass  = document.getElementById('tb-pass').value;
    if (!email || !pass) return;
    var SURL = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
    var SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWlyd3FmeXZneWFwYnd6a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMzMxMzEsImV4cCI6MjAyMzYwOTEzMX0.E5rCm3bh2TCiPxsVqA_Y7JlDj2LR3PjlKLHJZOI6b0Y';
    fetch(SURL+'/auth/v1/token?grant_type=password', {
      method:'POST',
      headers:{'apikey':SKEY,'Content-Type':'application/json'},
      body:JSON.stringify({email:email,password:pass})
    }).then(function(r){return r.json();}).then(function(d){
      if (d.access_token) {
        localStorage.setItem('sb-access-token', d.access_token);
        localStorage.setItem('sb-refresh-token', d.refresh_token||'');
        window.location.href = '/app/admin-panel.html';
      } else {
        alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    }).catch(function(){ alert('Error de conexión.'); });
  };

  /* ── CHATBOT IA ── */
  window._phdrToggleIA = function() {
    var w = document.getElementById('pg-chat-window');
    if (!w) return;
    var opening = !w.classList.contains('open');
    w.classList.toggle('open');
    if (opening && !document.getElementById('pg-msgs').children.length) {
      _pgAddMsg('bot', 'Hola 👋 Soy el asistente de Alejandro Carvajal. Puedo ayudarte con precios, tiempos de entrega y cómo enviar tu caso. ¿En qué te ayudo?');
    }
  };

  function _pgAddMsg(role, text) {
    var msgs = document.getElementById('pg-msgs');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'pg-msg' + (role==='user'?' user':'');
    div.innerHTML = '<div class="pg-msg-av">'+(role==='user'?'👤':'🦷')+'</div><div class="pg-msg-bbl">'+text+'</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  window._pgSend = function(text) {
    var inp = document.getElementById('pg-chat-input');
    var msg = text || (inp ? inp.value.trim() : '');
    if (!msg) return;
    if (inp) inp.value = '';
    document.getElementById('pg-sugs').style.display='none';
    _pgAddMsg('user', msg);
    var typing = document.getElementById('pg-typing');
    if (typing) typing.classList.add('visible');
    fetch('/api/gemini', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message: msg})
    }).then(function(r){return r.json();})
    .then(function(d){
      if (typing) typing.classList.remove('visible');
      _pgAddMsg('bot', d.reply || d.text || 'En este momento no puedo responder. Escríbeme por WhatsApp: <a href="https://wa.me/573219581949" target="_blank">+57 321 958 1949</a>');
    })
    .catch(function(){
      if (typing) typing.classList.remove('visible');
      _pgAddMsg('bot', 'Escríbeme directamente: <a href="https://wa.me/573219581949" target="_blank">+57 321 958 1949</a>');
    });
  };

  var chatInput = document.getElementById('pg-chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', function(e){
      if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); _pgSend(); }
    });
  }

})();
