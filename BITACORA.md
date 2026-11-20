# BITÁCORA — Alejandro CAD/CAM

Registro de cambios del repo `alejandro-carvajal-site` (alejandrocadcam.com).
Comparte BD Supabase (`zgihrwqfyvgyapbwzkvw`) con PRODIGY, separados por columna `negocio`.

---

## 2026-11-19 (i) — PayPal de pedidos listo para configurar

- functions/api/paypal-pedidos.js + create-order/capture/webhook: pedidos en USD (moneda USD), recargo 7 % en un solo lugar, verifica la orden antes de capturar, filtra negocio alejandrocadcam, descripción «Alejandro CAD/CAM · Caso». js/pagos.js: client-id desde el servidor; sin PayPal configurado, aviso de Wise. Cupón COP→USD (COP_POR_USD 4000) descontado en precio_total. COOP same-origin-allow-popups en /flujo-diseno* y /pagar*. Wompi oculto en /pagar (cobraría USD como COP).
- 🔴 Pendiente: trigger detectar_precio_sospechoso compara USD de Alejandro con catálogo COP (alertas falsas) — corregir en SQL.

## 2026-11-19 (h) — «Mi academia»: cursos en línea con video protegido (R2)

- ✅ SQL sql/academia-cursos-2026.sql (repo PRODIGY) corrido 19-nov: 5 tablas · 14 RPC · RLS · permisos por columna.
- app/mi-academia.html (tablero tipo SmileTech, módulos, recursos, calificar, comunidad, certificado; marca de agua con nombre/correo/fecha; pantalla completa del contenedor), app/certificado-academia.html (QR), verificar-certificado.html (pública, noindex), pestaña «Academia» en app/admin-panel.html, enlace en app/client-panel.html, «Cursos disponibles» en academia.html (precio opcional COP/USD).
- functions/api/academia-video-token.js + academia-video.js: URL firmada HMAC 2 h, inscripción verificada, Range 206, recursos como descarga. Requiere en Cloudflare: binding R2 ACADEMIA_VIDEOS → academia-videos y secreto ACADEMIA_VIDEO_SECRET (si faltan responde 503).

## 2026-11-19 (g) — Cupón de referido diferido en flujo-diseno (paridad PRODIGY)

- 🟡 flujo-diseno.html: «Validar» solo consulta (prodigy_validar_cupon_credito) y el cupón se gasta tras guardar el pedido (prodigy_consumir_cupon_pedido; respaldo a prodigy_usar_cupon_credito). El WhatsApp ya no restaba COP del total en USD («TOTAL: $0»): ahora informa el crédito y se descuenta al cobrar; notas lleva el cupón. Wompi no aplica aquí (pagarConWompi() sin botón, precios en USD).

## 2026-11-19 (f) — Academia reforzada (benchmark exocad training)

- academia.html: «Elige cómo aprender» (online en vivo · voy a tu laboratorio · clase en Bogotá), temario por nivel (básico/intermedio/avanzado + sesión 1 a 1), «Lo que recibes» (certificado digital de asistencia, grabación, soporte por WhatsApp, casos reales), «Antes de empezar» (no necesita licencia propia: el computador con exocad lo pone Alejandro; aviso «solo software, no técnicas clínicas»), CTA «Reservar cupo» → /wa/academia + educacion@. JSON-LD y FAQ al día. Sin precios.

## 2026-11-19 (e) — PayPal para planes de créditos + aviso de congelamiento

- 🟡 functions/api/paypal-creditos.js + ramas tipo creditos en paypal-create-order/capture/webhook: monto leído del lote (servidor), sesión verificada, captura COMPLETED con monto exacto, activación idempotente (también por webhook). Botón «Pagar con PayPal» en Mis créditos (Wise sigue). CSP con PayPal y COOP same-origin-allow-popups en /app/client-panel. CORS de paypal-* corregido (tenía el dominio de PRODIGY).
- ✅ SQL sql/creditos-pago-paypal-2026.sql corrido el 19-nov (verificación OK, recargo 7 %). 🔴 PENDIENTE: variables PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET / PAYPAL_WEBHOOK_ID en Cloudflare (hoy NO existen: PayPal no funciona en ningún sitio).
- functions/api/creditos-recordatorio.js + workflow diario: correo a los 60 y 80 días antes del congelamiento (dry_run). Requiere CRON_SECRET en GitHub = Cloudflare.

## 2026-11-19 (d) — Lista única de precios USD (decisión de Alejandro)

- 💡 Unidades cementadas = 1 crédito = 12 USD (corona, carilla, inlay/onlay, puente por pieza, endocrown); corona/pilar sobre implante = 1,5 créditos = 18 USD; lo complejo queda como el flujo (guía 65, barra 150, full arch 180, setup 100, férula 25, encerado 50, Express 10). flujo-diseno y calculadora-diseno igualados.

## 2026-11-19 (c) — flujo-diseno: tres fallas que impedían pedir

- 🔴→🟡 enviarWhatsApp() daba ReferenceError (esLocal/waFull/indSel) → ningún pedido salía.
- 🔴→🟡 Precios: tomaba precio COP de catalogo como USD (corona «$15000 USD», Express «$50000 USD») → solo usa precio_usd > 0.
- 🔴→🟡 inicializarPagosAC no existía → el recuadro de pago se quedaba en «Detectando…». Nuevo campo de correo (confirmación, cuenta y panel).
- envia-tu-scanner: el insert no revisaba error; ahora se registra y el aviso al equipo lo dice.

## 2026-11-19 (b) — Seguridad de Functions (agente, revisado)

- 🟡 send-email (Alejandro): sin sesión solo confirma al correo guardado en el pedido (el flujo ahora lo guarda), tope global 30/h y 5/h por destinatario. cotizacion-auto y lead-magnet ya no mandan WhatsApp al número del body. cuenta-implicita: una cuenta por código y correo exacto. Topes globales por hora en notify-staff (y ya no devuelve los teléfonos del equipo) y waitlist-notify. Errores genéricos al cliente (detalle solo en logs). leer-comprobante: solo URLs del storage del proyecto, sin redirecciones. *.pages.dev con X-Robots-Tag noindex (_headers + _middleware para /article y /wa).

## 2026-11-19 (a) — Créditos prepagados en la plataforma + el flujo por fin guarda los pedidos

- 🔴→🟡 **flujo-diseno no guardaba ningún pedido en la base**: llamaba `getSupabase()`, que en este repo no existía (solo PRODIGY tiene js/supabase-client.js). Los casos salían solo por WhatsApp; la tabla tenía 0 pedidos de Alejandro. Ahora usa el cliente único de auth-guard; con sesión, el pedido queda a nombre del cliente (user_id + email).
- 🔴→🟡 **app/client-panel no mostraba ningún caso**: pedía columnas inexistentes (servicio, total, doctor) → 400. Ahora usa alias a tipo_trabajo, precio_total, nombre_doctor. Montos ≥ 1000 se muestran en COP (antes todo decía USD).
- 🟡 Créditos: js/creditos.js + sección «Mis créditos» (saldo, plan, días para congelarse, compra de planes con referencia CR-xxxx y comprobante por WhatsApp, movimientos), «Pagar con créditos» en Facturación y al terminar el flujo, cuenta regresiva de entrega por caso, revisiones adicionales con aviso del costo.
- 🟡 admin-panel → pestaña «Créditos»: compras por activar, resumen por cliente, cargar plan, ajuste, cobrar caso cotizado aparte, devolver.
- Pendiente: Alejandro vuelve a correr sql/creditos-diseno-2026.sql (repo PRODIGY) para que el cliente pueda pagar con créditos.

## 2026-11-18 (k) — Rastreo de enlaces estilo Beacons

- 🟡 functions/wa/[[fuente]].js (+ wa/index.js, wa-en.js, _routes.json): /wa, /wa/<origen> y /wa/en/<origen> anotan el clic (analytics_events, evento wa_click) y abren el WhatsApp Business 573159831800 con un mensaje que dice el origen («te encontré en Google…»). Gemelo del de PRODIGY.
- 🟡 js/rastreo-enlaces.js en /links: visitas por origen (?src=) y clics por botón. Cifras en https://prodigylabdental.com/app/editar-links.html (Alejandro CAD/CAM).
- track-event: el hash anónimo del IP ahora rota cada día (antes cada 100 s, no servía para contar personas).

## 2026-11-18 (j) — /links sin salto al cargar el abanico

- links.html: la galería reserva el alto final del abanico (fan-layout + flechas) mientras cargan las fotos (clase cf-pending, se quita al pintar, al caer al mosaico o a los 6 s). En producción el cambio de recuadros de ejemplo al abanico daba CLS ~0,25.

## 2026-11-18 (i) — Analítica diferida, links e letra mínima

- gtag y Meta Pixel cargan con la primera interacción o a los 6 s (antes al load). Política de cookies con Google Ads y Meta; enlace de Facebook arreglado.
- /links: imágenes del portafolio por /render?width=600 con tamaño reservado (LCP 4,9-9 s → 2,9-4,9 s local). Academia: fuente de respaldo métrica. Letra mínima 12 px en etiquetas/chips.

## 2026-11-18 (h) — Auditoría con agentes: pagos, track-event y robots

- PayPal: `paypal-capture` y `paypal-webhook` exigen `currency_code === 'USD'` (antes una orden en otra moneda con el mismo número pagaba el pedido).
- Stripe (sin llaves aún): sesión obligatoria, pedido obligatorio con precio verificado (falla cerrada), cobro 100 % (el 50 % lo pedía el navegador) y URLs de retorno validadas contra alejandrocadcam.com (antes pages.dev).
- `track-event`: limpia y recorta los campos como PRODIGY.
- robots.txt: los grupos de GPTBot, PerplexityBot, Google-Extended, ClaudeBot y OAI-SearchBot ahora repiten los Disallow privados.
- SEO/accesibilidad: 22 títulos y 12 descripciones reescritos (≤60 / ≤155), aria-label en 4 campos.
- gemini.js con lista blanca del cuerpo; article.js usa og:image propia si la portada es de Wikimedia.
- Pendiente: `send-email` sin sesión y con `to` libre (portar el de PRODIGY); `cotizacion-auto` sin uso y sin autenticación (evaluar borrarlo); www no redirige al dominio raíz.

## 2026-11-18 (g) — Font Awesome propio y liviano + íconos en blanco

- Font Awesome propio: `assets/font-awesome/fa.css` + `webfonts/` con solo los 248 íconos usados (CSS 102→25 KB, sólidos 153→21 KB, marcas 115→2 KB). Las 51 páginas públicas lo enlazan; `header.js` lo inyecta fuera de /app (/app sigue con el CDN). Revisadas las públicas: 0 íconos sin glifo. Si se agrega un ícono nuevo a la web pública, regenerar el subconjunto.
- Íconos que salían en blanco: alarm-clock→stopwatch (términos), box-check→box-open (mis-casos).
- CSP: Meta Pixel (`www.facebook.com`) y `fonts.gstatic.com` estaban bloqueados → permitidos (puede explicar parte del «Pixel AC roto»).
- Reporte automático de bloqueos CSP en `reportar-problema.js` (ya subido, commit 79d010e). `unsafe-eval` se queda por el visor de Spline.

## 2026-11-18 (f) — Respaldo por correo de los leads + CSP de scripts

- `functions/api/notify-staff.js`: si algún aviso de CallMeBot no queda en cola (bot lleno, número cambiado), el mismo aviso sale por correo (Resend, `FROM_EMAIL` → `contacto@alejandrocadcam.com`, o `LEADS_EMAIL` si se define). Probado en local con fetch simulado (OK / falla / sin staff / sin nada).
- `_headers`: segunda `Content-Security-Policy` que limita los scripts a una lista de dominios (antes cualquier `https:`), más `form-action` y `frame-ancestors`. Probada inyectándola en páginas reales: 0 violaciones de scripts.
- Arreglos en la CSP actual: GA4 (`analytics.google.com`, `www.google.com/g/collect`), audiencias de Google Ads (`google.com.co`) y Cloudflare Web Analytics estaban bloqueados → parte de la medición no llegaba.

## 2026-11-18 (e) — Fuera la corona: ícono = nombre + CAD/CAM

- Alejandro: «la corona no es el logo… eliminar, no volver a proponer». Ícono nuevo (pestaña, app, manifiesto, favicon.ico) = ALEJANDRO dorado + CARVAJAL en puntos LiDAR + LUXURY DENTAL CAD/CAM, como el manual de marca.
- Se quitó el emoji 👑 del favicon de 64 páginas, del logo del menú (header.js), panel de cliente, login, correos, recibos, pago y orden. Se quitaron los SVG de corona de assets/icons. Quedan 👑 solo como ícono del servicio «corona dental» en listas de servicios.
- SW alejandro-v17 para que el celular tome el ícono nuevo. Bump ?v header/emailnotif 20261118d, confetti 20261118a.

## 2026-11-18 (d) — QR → página de enlaces

- /qr → /links?utm_source=qr&utm_medium=impreso (302). Todos los QR impresos y de artefactos apuntan a /qr: abren la página de enlaces y se puede cambiar el destino sin reimprimir. Los escaneos se ven en Analytics como fuente «qr».
- assets/qr: nuevo qr-alejandro.svg/png + tarjeta-alejandro.png (→ /qr). Se quitaron las tarjetas viejas de WhatsApp/enlaces.
- SQL de RPC públicas CORRIDO por Alejandro (verificación 0/0). Quedan abiertas solo las públicas por diseño (token/UUID/newsletter/seguimiento).

## 2026-11-18 (c) — /links en celular + QR reparados + seguridad

- /links móvil: la nube de puntos va arriba (detrás del nombre) y las fotos de casos suben debajo de WhatsApp/Guardar contacto (solo celular; PC igual). particle-bg.js dibuja la palabra quieta con «reducir movimiento» y ya no se reinicia al hacer scroll en iOS.
- QR: el generador de los artefactos (kit, papelería, folletos, brochures, protocolos) tenía mal el Reed-Solomon → los QR NO escaneaban. Reparado y verificado con jsQR. Nuevos QR oficiales en assets/qr/ (WhatsApp → /wa, /links, web, tarjetas 1080×1350).
- WhatsApp: todo enlace sale con «— desde alejandrocadcam.com/<página>» (header.js) para saber qué página trae cada cliente.
- Correo público: contacto@alejandrocadcam.com en lugar del Gmail personal (footer, soporte, términos, recibos, emails). Wise y listas de admin siguen con el Gmail a propósito.
- Seguridad: _auditoria.ps1 y .eslintrc.json bloqueados (middleware + _routes). SQL de RPC públicas pendiente de correr (sql/seguridad-rpc-publicas-2026.sql en el repo PRODIGY).
- Bump ?v=20261118c header/footer/emailnotif.

## 2026-11-18 (b) — Mensaje prellenado en cada botón de WhatsApp

- ✅ 50 botones sin texto o con texto genérico ahora abren WhatsApp con un mensaje acorde a la página/botón
  (34 archivos): noscript de cada servicio, flotantes `ux-btn`, tarjetas de precio de guías (una por tipo),
  seguimiento ("Mi código es: …"), términos, offline, portal cliente, correo de notificación.
- `js/footer.js`: ícono y "Soporte directo" con mensaje ES/EN según `_phdrIdiomaPagina()`.
- `js/header.js`: menú WHATSAPP ES/EN + fallbacks del asistente IA llevan la pregunta del usuario.
- `article.html`: los botones de WhatsApp incluyen el título del artículo leído.
- Calculadora: el flotante decía "Hello…" en página ES → corregido a español.
- Sin texto a propósito: admin-panel / configuracion / mis-casos (son de Alejandro) y JSON-LD (schema).
- Bump `?v=20261118b` en header/footer/emailnotif (134 refs, 54 archivos).

## 2026-11-18  (PUBLICADO el lote: WhatsApp nuevo 573159831800 + /en/ + blogs + onboarding)

- ✅ WhatsApp Business **573159831800** activo → publicado el lote completo del 17-nov (número nuevo en 65
  archivos de contacto público, hub /en/, i18n chrome, trust band, blog /en/ + 3 artículos ES/EN, onboarding).
- Bump de caché `?v=20261118a` en header/footer/pagos/emailnotif/reportar-problema (152 refs, 63 archivos).
- Fix auditoría: breadcrumb de los artículos ES apuntaba a `/blog/` (roto) → `/blog` (= blog.html).
- Avisos internos de leads (`notify-wa`, `cotizacion-auto`, `resumen-semanal`, `notify-staff`, `callmebot`)
  **siguen en el personal 573219581949** a propósito (CallMeBot atado a ese número). Moverlos = decisión pendiente.

## 2026-11-17  (Crecimiento USA: hub /en/ reforzado + i18n del chrome /en/)

- ✅ **`en/index.html`** — ganchos para labs US: White-label ("your clients never see us"), Confidential
  (files used only for your case), **U.S.-hours overlap (Bogotá = Eastern Time)**, intro "invisible design
  desk" + sección **"How it works"** (3 pasos). Nº WhatsApp nuevo ya incluido.
- 🔴→✅ **Bug i18n del chrome /en/**: el sistema de traducción EN (dicc. `_EN` + `_traducirEn` en header.js)
  existía pero NO se disparaba en el **hub `/en/`** — `ruta()` reduce `/en/index.html` a `/en` (sin barra) y
  L22 chequeaba `indexOf('/en/')`. Fix: `enIngles = ruta()==='/en' || ...`. Ahora header/menú/footer/banner
  salen en inglés en el hub (las páginas internas /en/ ya lo hacían).
- ✅ **Banner de cookies**: 2 claves nuevas en `_EN` para el texto que cambié hoy — ahora traduce completo en /en/.
- ✅ **footer.js**: la fila `.fsvc` ("Servicios de diseño CAD", enlaces ES) se **oculta en /en/** (redundante;
  la columna "CAD DESIGN" ya la cubre con enlaces /en/). ES intacto (verificado en 404).
- ✅ **Trust band US** en las **7 `/en/` de servicio** (remote-design, smile-design, veneers, implant-esthetics,
  all-on-x, clear-aligners, surgical-guides): franja antes del footer con White-label · Confidential ·
  U.S.-hours overlap. Estilos inline (no dependen del CSS de cada página). Insertado con script idempotente.
- ✅ **Blog /en/ — 3 artículos comerciales** (cada uno con schema Article + BreadcrumbList, CTA WhatsApp nuevo,
  cross-linked entre sí, en `sitemap.xml` priority 0.7, header/footer en inglés vía el fix i18n):
  `dental-cad-outsourcing-guide` (cómo tercerizar), `exocad-vs-3shape-for-labs` (comparativa + tabla),
  `cut-dental-lab-cad-costs` (economía del lab) + **índice `/en/blog/`** (hub de guías, CollectionPage + ItemList).
  Enlazados desde el hub /en/ ("Read our guides"), todos en `sitemap.xml`. Sección blog /en/ COMPLETA.
- ✅ **PENDIENTES.md** actualizado (bloque 17-nov con acciones de Alejandro: activar WhatsApp, AW- ID, postear
  en comunidades US, indexar en Search Console, fotos de casos).
- 🔴 PENDIENTE al publicar: **bump `?v=`** de header.js/footer.js (cambiaron) en todas las páginas, junto con
  el swap de nº WhatsApp (sin push hasta que el 573159831800 tenga WhatsApp activo).

---

## 2026-11-17  (Fix tracking: Consent Mode v2 — `ad_storage` por fin se otorga)

- 🔴→✅ **`ad_storage` nunca se otorgaba** (header.js `default` + footer.js on-load líneas 142/143 + los 2 botones del
  banner solo daban `analytics_storage`). Con Consent Mode v2 eso dejaba las conversiones de Google Ads **sin
  cookies → solo modeladas ≈ 0** (causa de "Ads sin conversiones", junto con el AW- placeholder). Ahora, al
  **Aceptar**, se otorgan los 4 (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`); "Solo
  esenciales" los deniega todos. Banner → "cookies analíticas **y de medición publicitaria**" (el Meta Pixel ya
  cargaba bajo un banner que decía solo "analíticas" → disclosure honesto).
- ✅ **Meta Pixel** ya estaba OK: conversions.js lee `ac_cookies_ok` / escucha `ac_consent_granted` = lo que setea el
  banner (el bug viejo de la línea ~188 ya se había resuelto). Carga al aceptar.
- Cache-bust: `header.js`/`footer.js` → `?v=20261117a` en 45 .html (117 refs). Sintaxis verificada (`node --check`).
- 🔴 PENDIENTE (Alejandro, necesita su cuenta): **Google Ads ID real** → reemplazar `AW-XXXXXXXXX` en
  `js/conversions.js` L22 + los 4 labels (`WA_CLICK_LABEL`, `STL_UPLOAD_LABEL`, `COTI_LABEL`, `LEAD_LABEL`). Sin eso,
  el guard de L53 aborta TODAS las conversiones de Ads — es LA causa #1. Confirmar también que el Pixel
  `1254573606759925` es el suyo.
- 🔴 PENDIENTE (al dar el AW- ID): **`header.js` solo configura GA4** (`gtag('config','G-Z8G2X7ETQ1')` L158).
  Para que disparen las conversiones de Ads hay que agregar `gtag('config','AW-...')` junto a esa línea — si no,
  el evento `conversion` no tiene destino configurado y no cuenta. (Lo agrego cuando llegue el ID.)
- ⚠️ **Conversiones definidas pero sin cablear**: solo se llaman `trackSTLUpload`+`trackFormSubmitOk`
  (envia-tu-scanner.html L988-989) y `trackWhatsAppClick` (auto, listener global). `trackCotizacionSent` (COTI) y
  `trackLeadQualified` (LEAD/videollamada) **no las llama ninguna página** → esas 2 conversiones nunca disparan.
  Decidir si se necesitan (¿hay form de cotización / botón de videollamada que contar?).
- 💎 Paridad PRODIGY: **NO se porta** el grant de `ad_storage`. PRODIGY lo mantiene `denied` a propósito
  (comentario en su header.js: "AW-18130335500: SOLO conversiones. ad_storage sigue denegado") — mide por
  GA4-import, no por conversiones directas. La LEY DE ORO pide evaluar+portar *si aplica*; aquí no aplica.

## 2026-11-10  (hub /en/ + SonarGrid vanilla — paridad con PRODIGY)

- ✅ **Hub `/en/`** (`en/index.html`): índice de los 7 servicios de DISEÑO (remote $4, smile $12, veneers
  per unit, implant-esthetics $15, all-on-x $25, aligners $25, surgical-guides $59), acento **dorado** + sonar
  en oro en el hero. SIN gate (Alejandro no tiene mantenimiento). `_IDIOMA_CFG`: `hubEn`/twin home ES → `/en/`.
  Schema WebSite+ItemList, sitemap (0.9). Commit `1e75e02`.
- ✅ **`js/sonar-grid.js`**: módulo idéntico al de PRODIGY (React→vanilla). Canvas, theme-aware, idle, reduced-motion.
- 💡 Catálogos NO se fusionan: Alejandro = estudio de diseño/STL; PRODIGY = lab con fabricación. Solo se porta el tech.
- ✅ **SonarGrid en las 6 /en/ de diseño** (color variado: remote/smile oro, implant-esthetics/all-on-x
  magenta, aligners/surgical cian). Logo→/en/ en inglés. Commit `040f071`/`ea51d40`.
- ✅ **Tira "International · English" en el footer** (hub + /en/) + bump `header.js`/`footer.js?v=20261110h`
  en las /en/ (js es immutable 1 año → sin bump no propaga). Commit `10fb1e9`.

## 2026-11-10  (SEO · cross-link entre páginas /en/ — paridad con PRODIGY)

- ✅ **Clúster interno /en/**: bloque "The full CAD menu" (`grid-3` de `.card`) al cierre de 6 páginas /en/
  de diseño (all-on-x · clear-aligners · implant-esthetics · remote-design · smile-design · surgical-guides).
  Cada una enlaza a los otros 6 servicios con su precio de diseño real ya publicado (remote $4 · smile $12 ·
  veneers per unit · implant-esthetics $15 · all-on-x $25 · aligners $25 · surgical-guides $59). Antes
  **0 cross-links** entre las /en/. `en/veneers.html` excluida (plantilla distinta, sin `grid-3`/precios).
  `audit.mjs` verde. Commit `58b5f7c`. Paridad con PRODIGY `f4ace46`.

## 2026-11-08  (SEO · auditoría de reciprocidad hreflang en todo el sitio — paridad con PRODIGY)

- 🔴→✅ **BUG GRAVE corregido — los 26 artículos de Alejandro estaban NOINDEX.** `article.html:22` tenía
  `<meta robots content="noindex,follow">` en la base, el Function (`functions/article.js`) NO la cambia, y
  el sitemap lista 26 URLs `/article?id=` → Google nunca podía indexar NINGÚN artículo (todo el trabajo de
  CWV/JSON-LD/schema en ellos era inútil). PRODIGY sí tenía `index` en su base (`article.html:21`) — era una
  divergencia de Alejandro. **Fix:** base → `index, follow` (igual que PRODIGY); el `noindex` de
  no-encontrado/próximamente lo sigue poniendo el cliente (línea 412, el más restrictivo gana). Detectado con
  barrido sitemap↔noindex (PRODIGY 0 / Alejandro 26). ⚠️ Verificar en vivo tras deploy + reindexar en GSC.
- ✅ **Enlazado interno — footer con índice de servicios (arregla "Descubierta: sin indexar" de GSC):**
  análisis de huérfanas detectó **9+ páginas de servicio enlazadas SOLO desde el home** (diseno-endodontico,
  diseno-implante-digital, diseno-provisional, diseno-puente-implante, modelo-digital-diagnostico,
  protesis-removible-digital, rehabilitacion-oral, splint-oclusal-cad, wax-up-digital…) → 1 solo enlace
  entrante = baja prioridad de rastreo. **Fix:** banda "Servicios de diseño CAD" en `footer.js` (grid
  responsivo) con 15 servicios → cada uno gana un enlace interno en TODA página. Cache-buster `?v=20261108a`
  en 43 páginas. Preview desktop+móvil verificado. El export de GSC (8-nov) mostraba el sitio clavado en
  25-26 indexadas por 2 meses (causa raíz = el noindex de artículos de arriba).
- ✅ **hreflang verificado sano:** auditoría de reciprocidad sobre todo el sitio (49 HTML, 40 con hreflang)
  → **0 asimetrías y 0 destinos rotos entre páginas indexables.** Grafo ES/EN íntegro.
- ✅ **Cumplimiento CLAUDE.md §5 (flash blanco):** auditados los 61 HTML. Único gap: `recibo-caso.html`
  (dark, `--bg:#050505`) no tenía `<meta name="color-scheme" content="dark">` → añadido. Resto ya cumplía.
- ✅ **404 + Soft404/URLs basura (paridad con PRODIGY):** 301 de `/en/calculadora-diseno` (URL vieja) →
  `/calculadora-diseno` en `_redirects`. Y en `functions/article.js`: `/article` sin id o con id-basura de
  template literal (`${r.id}`…) → **301 a `/blog`** (antes servía soft-404/noindex y gastaba crawl budget).
- ✅ **Artículos retirados → 301 server-side (paridad PRODIGY):** un id-retirado (tema vigente, id viejo)
  servía 200 vacío (soft-404 para Google, redirect solo client-side). Ahora el Function hace **301 a la
  versión vigente** del mismo tema → consolida link equity y ahorra crawl budget.
- ✅ **SEO on-page cursos + diseño remoto (9-nov):** `/diseno-remoto` el H1 era "Tu laboratorio CAD a 15
  minutos" (sin keyword) → ahora "**Diseño CAD dental remoto** / tu laboratorio a 15 minutos*" (keyword en
  H1, mantiene el gancho). `/cursos` saltaba H1→H3 → añadido H2 "Cursos de Exocad — online y presencial"
  sobre las 3 tarjetas (jerarquía correcta). Preview verificado. Pendiente (proyecto de contenido): engordar
  /cursos a ~2.000 palabras con H2 keyword-ricos y long-tail (curso exocad Colombia/personalizado/implantes).
- ✅ **Backlog «SEO inglés» corregido:** `en/veneer-terms` es **noindex a propósito** (Terms of Service;
  el ES ya existe en `terminos-y-legal.html`) → no necesita gemelo ES ni hreflang; la tarea previa estaba
  de más. Resto de páginas EN (clear-aligners, all-on-x, remote-design, smile-design, implant-esthetics,
  surgical-guides, veneers) con gemelo ES y hreflang recíproco correcto.
- 🟡 **Cruft cosmético (no urgente):** páginas noindex (article base, caso, seguimiento-caso,
  terminos-y-legal) cargan hreflang que Google ignora → limpieza opcional, cero impacto.

---

## 2026-11-07  (SEO · hreflang de artículos + páginas ES/EN — paridad con PRODIGY)

- ✅ **Core Web Vitals (medición en vivo, móvil + throttling 4x/Slow-4G):** home + páginas internas 🟢.
  La plantilla `/article` fallaba **CLS ~0.31 🔴** (el hero nacía vacío y crecía con el JS). **Fix de
  paridad en `functions/article.js`**: inyección server-side de `#article-title`/`#article-sub`/`#hero-chip`
  + `min-height` en `#article-meta` → LCP adelantado. Gemelo del fix en PRODIGY.
- ✅ **CLS del artículo — fix decisivo (la portada):** el server-render del hero no bastó (CLS seguía
  ~0.29 🔴). Causa real: la imagen de portada se insertaba por JS sin espacio reservado. Fix: slot
  `#article-cover` con `aspect-ratio:16/9` reservado en el 1er pintado (CSS), el cliente lo rellena, y
  `functions/article.js` quita el slot en artículos sin portada (sin og_img y categoría fuera de
  `{ia,materiales,tecnologia,equipo}`). Verificado con preview. Gemelo del fix en PRODIGY.
- ✅ **TBT del artículo (idle):** recientes + relacionados (below-the-fold, sin SEO) pasan a
  `requestIdleCallback` para sacarlos de la tarea de render crítica. Verificado: se pintan tras idle,
  0 errores JS. Gemelo en PRODIGY.
- ✅ **Validación de schema (118 bloques JSON-LD): 0 inválidos.** Home usa `Person` (marca personal) +
  `WebSite` con SearchAction + `Service` → completo. Fix de paridad: añadido `image` (og) al
  `MedicalBusiness` de `carillas.html` y `en/veneers.html`, que iban sin imagen.

- ✅ **hreflang de páginas (31 archivos)**: quitado el `hreflang en → ?lang=en` fantasma de 21 páginas ES
  (el parámetro no lo lee ningún JS; i18n usa solo `localStorage`). Las 8 EN ya tenían back-links `es`
  correctos; se **normalizó el `x-default`** de los 7 pares al ES (mercado primario), que estaba inconsistente
  (3 ES apuntaban a EN). Único EN-only sin gemelo ES: `en/veneer-terms` → ES pendiente en `PENDIENTES.md`.
- ✅ **`tools/audit-live.mjs`**: ya no marca los `404 /api/*` locales como fallo (paridad PRODIGY, `ac6ab11`).
- ✅ **JSON-LD de artículos server-side** (`functions/article.js`): inyecta `Article`+`BreadcrumbList` en el
  `<script id="jsonld-schema">` (iba vacío en estático), leyendo de `/articles-ac.js`. Variante de Alejandro
  (autor `Person`, breadcrumb "Blog"). Validado 26/26. Paridad con PRODIGY.

- ✅ **`functions/article.js`**: además del canonical, corrige el **hreflang** de cada artículo.
  El `article.html` declaraba `hreflang="es"`/`x-default` → `/article` genérico y un `en` → `/article?lang=en`
  **fantasma** (no hay artículos en inglés). HTMLRewriter pone `es`/`x-default` al **self-URL** y **elimina**
  el `en`. ✅ verificado en vivo (`curl` de `/article?id=exocad-vs-dental-wings-…`). Commit `038bf9d`.
  Gemelo del fix de PRODIGY (`7d6a7d8`).

---

## 2026-11-06  (SEO · canonical server-side para los artículos — paridad con PRODIGY)

- ✅ **`functions/article.js`** (nueva Pages Function, gemela de la de PRODIGY): intercepta `/article?id=X`,
  sirve el `article.html` estático (`next()`) y con **HTMLRewriter inyecta del lado del SERVIDOR** el
  `canonical`/`og:url` correctos (self-URL) + título/descripción/og reales leídos de `/articles-ac.js`.
  Arregla "Página alternativa con canónica adecuada" en GSC: el canonical estático apuntaba a `/article`
  genérico y solo lo corregía el JS. Idempotente; el JS del cliente queda igual.
- ✅ **`_routes.json`**: agregado `/article` al `include` — sin esto Cloudflare servía `/article` estático
  directo (bypass de Functions) y la Function nunca corría. Mismo fix en PRODIGY (`93efa33`).

---

## 2026-11-05  (auditoría orphans · duplicados de keyword · enlazado interno)

Auditoría de enlazado interno (causa de "descubierta, sin indexar" en GSC). El único hub es `index.html`.
- ✅ **+4 servicios al hub** (grilla de index): `carillas` (no estaba enlazada desde index — flagship),
  `rehabilitacion-oral`, `diseno-puente-implante` (huérfanas) y `diseno-endodontico` (revivida, ver abajo).
- ✅ **Sitemap sin URLs que redirigen**: saqué `/diseno-endodontico` (luego revivida), `/guias-quirurgicas-cad`
  y `/protesis-digital` (301 → Google las marcaba "página con redirección").
- ✅ **Duplicado de keyword resuelto — férula = splint**: `ferulas-oclusales.html` consolidada en
  `splint-oclusal-cad.html` (que ya cubre "férula Michigan/oclusal/bruxismo" en title+keywords). Redirect
  301 `/ferulas` y `/ferulas-oclusales` → splint; borrada + fuera de sitemap.
- ✅ **`diseno-endodontico` revivida** (era "Postes y Muñones", servicio distinto de Endocrown — 18× poste,
  20× muñón): quité su redirect, la re-agregué al sitemap y a la grilla. `index,follow` ya estaba.
- ✅ **`protesis-digital.html` borrada** (consolidada en `protesis-removible-digital`, redirect queda).
- ✅ **`guias-quirurgicas-cad.html` borrada** + **bug corregido**: `guias-quirurgicas.html` (página ES,
  lang=es, canonical ES) tenía TODO el head en **inglés con precio "$59"** (violaba ES-sin-precios) — por
  eso existía la versión `-cad`. Traducido title/description/og/twitter/schema a español, sin precio.
- Verificado: `node tools/audit.mjs` → 61 páginas, 0 críticos, 0 enlaces rotos.

## 2026-11-05  (OG images faltantes · limpieza full-arch duplicado)

- ✅ **5 OG images generadas** (JPG 1200×630 desde sus templates HTML): `og-portafolio`, `og-blog`,
  `og-soporte`, `og-nosotros`, `og-envia-tu-scanner`. Antes esas 5 páginas apuntaban a un `.jpg`
  inexistente → preview roto al compartir en WhatsApp/Facebook/LinkedIn. Ya todas las páginas con
  `og:image` tienen su imagen real.
- ✅ **full-arch-cad.html eliminado** — era duplicado huérfano de wax-up (noindex, 0 enlaces internos,
  fuera del sitemap). El full-arch real ya existe: `diseno-full-arch.html` (/diseno-full-arch, indexado,
  enlazado desde index/carillas/guías/links). Redirect 301 `/full-arch-cad → /diseno-full-arch.html`
  agregado en `_redirects`. Cierra el pendiente SEO de contenido duplicado.
- Verificado: `node tools/audit.mjs` → 64 páginas, 0 críticos, 0 enlaces rotos.

---

## 2026-10-21  (correos oficiales · Cloudflare Email Routing)

- ✅ **Email Routing activado** en alejandrocadcam.com (Cloudflare, cf CLI). MX route1/2/3.mx.cloudflare.net +
  SPF `v=spf1 include:_spf.mx.cloudflare.net ~all`. No rompe Resend (envío sigue por DKIM `resend._domainkey`).
- ✅ **4 direcciones → jackalejandroc@gmail.com**: `alejandro@` (principal), `cad@` (diseño), `educacion@`
  (formación), `contacto@` (general). Se descartó `hola@` (suena a buzón genérico/poco pro).
- ✅ **hola@ → contacto@** en envia-tu-scanner.html (MAIL_CASOS), seguimiento-caso.html, terminos-y-legal.html
  (hola@ ya no enruta → quedaba muerto). Verificado: 0 `hola@` restantes.
- ℹ️ Teléfonos `300 000 0000`/`3001234567` = placeholders de inputs; `322 877 4481` (NUM) = Nequi/Daviplata de
  Jessica (legítimo). El `3169542824` de article.html era falso positivo (ID de Unsplash). No se tocaron.
- ✅ **cursos.html · schema `Course`** (SEO exocad): `ItemList` de 3 cursos (Básico · Full Arch & Guías ·
  Mentoring) con `CourseInstance` → elegible a resultados enriquecidos de cursos en Google + cita por IA.
  Ya tenía Service/FAQ/HowTo/Breadcrumb. 5/5 JSON-LD válidos. ⚠️ PRODIGY NO tiene cursos (su exocad es
  "soporte por hora", soporte-exocad.html) → no se duplica Course allá (evita canibalización de keywords).
- ✅ **cursos.html · "próximamente" → "Inscripciones abiertas"**: los cursos YA se venden. Badge, tag,
  subtítulo, Service schema, formulario (Reserva tu cupo) y CTA (Quiero inscribirme) actualizados.
- ✅ **PRODIGY `_redirects`: /cursos → alejandrocadcam.com/cursos (301)** — cursos concentrados en Alejandro.
- ✅ **Rich Results Test OK**: Google detecta 3 "Course list items" + Breadcrumbs, 0 errores. Se agregó
  `url`+`image` a cada Course (limpia avisos del carrusel). FAQ/HowTo ya no son rich result (Google los
  descontinuó 2023) pero el markup sigue válido para IA.
- ✅ **Bug viejo arreglado**: `/cursos` apuntaba su `og:image`/`twitter:image` a `assets/og-cursos.jpg`
  **inexistente** (preview social roto) → ahora `og-home.jpg`. ⏳ Opcional: crear una og-cursos.jpg dedicada.
- ✅ **LinkedIn en schema actualizado** (index.html + sobre-mi.html): `sameAs` apuntaba al viejo
  `/in/j-alejandro-carvajal` → ahora `/in/alejandrocadcam` (URL real del perfil). Conecta web ↔ LinkedIn.

- ✅ **envía-tu-scanner · plantilla opcional** (13-oct, paridad con PRODIGY): bloque plegable que arma el texto del caso para enviarlo por WhatsApp (573219581949) o correo (hola@). Lo recomendado sigue siendo subir el STL.
## 2026-10-13  (serverless: _routes.json)

- ✅ **_routes.json** (paridad con PRODIGY): Cloudflare sirve lo estático directo; solo /api/* y los internos bloqueados (sql, supabase, scripts, tools, tests, package*.json, *.md de raíz) pasan por Functions. Verificado: páginas 200, /api/geo 200, /CLAUDE.md y /sql/ → 404. ⚠️ Nuevo path bloqueado o Function fuera de /api/ → añadir a include.


## 2026-10-09  (reseñas fuera del schema · geo propio · GA4 sin doble conteo)

- ✅ **Schema de reseñas eliminado**: AggregateRating 5.0★/48 en 23 páginas (commit f81f081, jun-2026) y Review propias en
  index, sobre-mi, reseñas, diseno-remoto, guias-quirurgicas. Google no muestra reseñas propias; estrellas reales = GBP.
- 🔴 **reseñas.html dice «48 reseñas verificadas»** en texto visible: confirmar si son reales (memoria: 15 testimonios reales).
- ✅ **/api/geo propio** (functions/api/geo.js): reemplaza ipapi.co en flujo-diseno, geo-detect.js y pagos.js; fuera del CSP.
- ✅ **GA4 contaba doble** cada evento de conversions.js — corregido. footer.js?v=20261011a en 46 páginas.
- 🔴 **Pixel de Meta nunca carga**: conversions.js lee 'Alejandro Carvajal_cookies_ok' y escucha
  'Alejandro Carvajal_consent_granted' (nadie los escribe; el banner usa ac_cookies_ok). Sin tocar: decisión ad_storage.

## 2026-10-08  (menú simétrico · idioma con sesión · envía tu escáner sin precios)

- ✅ **Selector ES/EN/PT con sesión abierta**: se perdía al iniciar sesión (la barra de «Admin · Mi Panel · Salir» lo
  reemplazaba). Ahora se conserva.
- ✅ **Menú simétrico**: logo en el eje central exacto. Izquierda: tema · IA · SERVICIOS · PORTAFOLIO · ENVÍA TU
  CASO · BLOG; derecha: SIGUE TU CASO · SOPORTE · SOBRE MÍ · lupa · HAZ TU PEDIDO. ≤1260 px menú ☰.
- ✅ **envia-tu-scanner sin precios** (era la caja de precios de laboratorio de PRODIGY en COP): ofertas de valor +
  «Cotizar en línea»; botones del formulario sin precio; menú SERVICIOS sin «desde $X USD». Las landings en USD
  (diseno-remoto, corona-cad, guías, etc.) siguen con precio: pendiente de decisión de Alejandro.
- ✅ `js/dientes.js` (odontograma FDI · Universal · Palmer) copiado para el flujo de diseño.

- ✅ **Flujo de diseño en inglés técnico** (`/flujo-diseno` en `paginasEn`, +450 textos y «patrones» en `en.json`).
- ✅ **Odontograma FDI · Universal · Palmer** en el flujo (`js/dientes.js`): `pedidos.piezas` en FDI, WhatsApp con
  ambas; seguimiento y recibo muestran la nomenclatura del cliente.
- ✅ Aviso «This page is only available in Spanish · English version →» en páginas sin traducción técnica.
- ✅ Panel IA: filtro «Más repetidas». El resumen semanal lo manda PRODIGY (alerta-sla) para las dos webs.
- ✅ **Bug viejo: con sesión abierta la barra «Dr. · Mi Panel · Salir» nunca aparecía** (`_pgEscH is not defined`,
  tragado por el `.catch`): la barra de sesión usa su propio escape. Verificado con sesión simulada.
- ✅ **Simetría en todas las páginas** (`js/simetria.js`, lo cargan header.js y footer.js en páginas públicas): rejillas de
  tarjetas iguales sin huérfanas (6 → una fila o 3+3, 4 → 2+2, 8 → 4+4, 9 → 3×3) y, si no hay reparto exacto, última
  fila centrada; bloques corridos se centran. Recalcula al cambiar el ancho y cuando se agregan tarjetas. Excluir:
  `data-no-simetria`. Auditoría (scratchpad `audit-simetria.mjs`, 1440/1024/768): Alejandro 85 → 0, PRODIGY → 0.
- ✅ «¿Qué necesitas?» de diseno-remoto (ambas): cada opción con su color de marca, ícono en cuadro y texto alineado.
- ✅ **cursos.html**: letra subida a la escala de ESTANDARES-UX-TIPOGRAFIA (mínimo legible .85rem; antes .6–.78rem).
- ✅ **Decisión de precios (8-oct): USD en inglés, nada en español.** 20 páginas en español sin precios (tarjetas → alcance,
  tablas sin columna de precio, FAQ «¿cuánto cuesta?» → respuesta de cotizar, meta y JSON-LD sin precios, «calculadora de
  ahorro» fuera de diseno-remoto). Las páginas /en/ conservan sus USD. guias-quirurgicas: en español oculta precios y
  muestra «Cotizar este caso»; con su botón EN muestra USD (`body.es-sin-precio`).
- ✅ Función vieja de Google Translate (sin botón) eliminada de flujo-diseno.
- ✅ **Orden por diente estilo exocad DentalDB en el flujo de diseño** (igual que PRODIGY, `ODO_CFG` con el catálogo USD de
  Alejandro: encerado/mock-up se cobran una vez por caso; dentadura completa y esqueléticas «a cotizar»; guías con sus
  claves). `odontograma.html?sitio=ac` oculta las guías «diseño + impresa» y la regularización de reborde.
- ✅ **Odontograma en la nomenclatura del doctor** (pedido de Alejandro: «para mercado USA no es correcta»): selector FDI · Universal ·
  Palmer arriba del diagrama; en Universal/Palmer cada diente lleva su número encima (la imagen trae FDI dibujado). En inglés
  arranca en Universal. El título, el resumen y el WhatsApp usan esa nomenclatura con el FDI al lado; el laboratorio, FDI.
- ✅ **Aviso de marcas**: «exocad® y DentalDB® son marcas registradas de exocad GmbH… no está afiliado, patrocinado ni
  respaldado por exocad» en el flujo y debajo del odontograma, y sección «Marcas de terceros» en Términos.
- ✅ Odontograma: grupos plegables en celular, materiales compactos, alto real del marco, orden estructurada
  (`pedidos.odontograma`, se envía solo si la columna existe — SQL en el repo de PRODIGY).
- ✅ SQL de `pedidos.odontograma` corrido (8-oct) → fuera del ALLOW de audit-schema-live. El dibujo de la orden por
  diente se ve en la Ficha del caso y el panel de diseño de PRODIGY (aquí no hay panel de producción).
- ✅ **Robot del asistente IA en Soporte** (`js/robot-ia.js`, igual que PRODIGY) en lugar del ícono 🛠️: sigue el cursor,
  parpadea, ojos de corazón al tocarlo y abre el chat IA. 3D solo en computador; celular → figura fija. Antena oro.
- ✅ **Menú: ACADEMIA aparte de SOPORTE** (pedido de Alejandro). Izquierda: SERVICIOS · PORTAFOLIO · ENVÍA TU CASO · BLOG ·
  ACADEMIA (/cursos). Derecha: SIGUE TU CASO · SOPORTE ▾ (Centro de soporte · Asistente IA · Preguntas frecuentes) ·
  SOBRE MÍ ▾ (Mi historia · Reseñas). Antes SOPORTE tenía Cursos y Reseñas y no enlazaba a /soporte. Celular: SOPORTE
  (faltaba) y «ACADEMIA · CURSOS EXOCAD». Compacto hasta 1.439 px para que nada se salga. «Asistente IA» del desplegable ya
  no se ve pegado. Logo centrado verificado de 1.261 a 1.920 px.
- ✅ **Tema: siempre abre en oscuro**; el claro dura solo la visita (igual que PRODIGY). header.js v=20261009.
- ✅ CSP acortada (1.794 → 1.499, mismo efecto) + chequeo en `tools/audit.mjs` de líneas de `_headers` > 2.000 (Cloudflare
  las descarta en silencio; a PRODIGY le pasó).
- ✅ **Odontograma sin capturas** (igual que PRODIGY): diagrama dental en SVG con números nativos FDI/Universal/Palmer,
  tipo de implante con íconos vectoriales de exocad, inglés con los nombres oficiales de exocad y portugués nuevo
  (`i18n/pt-odontograma.json`). 441 → 260 KB.
- ✅ **Odontograma = interfaz de exocad DentalDB 3.3** (igual que PRODIGY): diagrama vectorial de DentalDB, indicaciones en
  el orden de exocad, materiales permitidos por indicación con sus imágenes reales y proceso (5/3 ejes, láser, impresión).
- ✅ **Modelo con articulador** (igual que PRODIGY): «¿Desea que diseñemos el modelo?» → Sí → tipo de modelo + articulación
  del Model Creator de exocad 3.3: impresos (xSNAP, Snapculator, Artex print-click, Dentag, Dematec, RYS, iTero, Twister
  Ball, 4 pines…) o montaje (Artex CR, Bio-Art A7 Plus, SAM, KaVo, Stratos, Denar, Panadent, Gamma, Gerber…) con versión.
  Va en la orden (`modelo`), en el resumen y en «A cotizar: diseño del modelo». EN/PT traducidos.
- ✅ **Corrección:** «¿Desea modelos impresos?» → sólido/hueco · con/sin zócalo · troqueles · articulador + versión. Fuera
  «Escaneado de la oclusión» (todos envían escaneo intraoral). Resumen completo en EN/PT; orden al lab en español. En
  celular/tablet el odontograma ya no tiene scroll interno por columna.
- ✅ **Modelos impresos v3** (igual que PRODIGY): hueco por defecto; casillas para dientes (troqueles zanahoria/adicionales)
  y para implantes (análogos/encía, se marcan solos con implantes); referencia del articulador opcional («la más adecuada
  para el caso»); se recuerda la última elección del doctor.
- ✅ **Guías unificadas con el odontograma (exoplan)** (igual que PRODIGY): grupo «Planificación (exoplan)» con íconos de
  DentalDB 3.3; banda de guía solo con dientes en «Planificación de implantes»: guía o solo planificación, tipo sugerido
  por nº de implantes (sin impresión ni reborde en Alejandro). Plan de restauración = encerado/sonrisa una vez por caso.
  «Planificación Quirúrgica» oculta en «Otros servicios». Ícono de «Diente adyacente» arreglado.
- ✅ **«Acciones» como DentalDB 3.3** (igual que PRODIGY): sin banda abajo; junto al odontograma, Acciones → Planificación de
  Implantes · Guía Quirúrgica, con soporte obligatorio (dento / muco / óseo + pines de anclaje).
- ✅ **Pedido de guía alineado al protocolo** (igual que PRODIGY): el apoyo, las anillas y el guiado ya no se piden (los
  decide la planificación y el doctor aprueba). Se pide: sitios, sistema e implante sugerido por sitio (Ø × largo, opcional),
  ¿arcada con dientes o edéntula? (archivos `guia_1_2` o `guia_5_mas` vía `ODO_CFG.archivosGuia`) y abordaje opcional.
  La IA (header.js `?v=20261010` en todas las páginas) explica el mismo protocolo.
- ✅ **Acordeón bajo la indicación** (igual que PRODIGY): la configuración de planificación y guía se abre justo debajo de
  «Planificación de implantes» (sin botón repetido); opción **varios implantes** (se cotiza). header.js `?v=20261010b`.
- ✅ Fuera «Diente ausente - plan de sustitución» y «Diente de soporte para guía quirúrgica» (sobraban).
- ✅ **Barra interna** (igual que PRODIGY, validada con exocad 3.3): en coronas, cofias, pónticos y encerados, bajo el material,
  con TI, TI láser, metal sinterizado (y láser), zirconio o PEEK. «Plan de restauración» → «Diseño de sonrisa 3D» junto a Mockup.
- ✅ **Odontograma reorganizado** (igual que PRODIGY): «Prótesis sobre implantes» unificado, guías después de la prótesis,
  sin caja de proceso, Copiar/Pegar/Limpiar dentro del diagrama, opciones en una sola línea.
- ✅ **Datos del doctor al día + código de cliente** (igual que PRODIGY, `js/datos-doctor.js` en flujo-diseno): código DR-####
  visible y en el WhatsApp del pedido; si cambia WhatsApp, ciudad o especialidad, se ofrece guardarlos como predeterminados.
- ✅ Fuera Corona prensada y Póntico prensado; paso «Copiar, Pegar y Limpiar» en la guía del odontograma.
- ✅ «Material» debajo del diagrama con dos columnas (sin hueco); ícono de dentadura para «Diseño de sonrisa 3D».
- 🟡 Pendiente de decisión: el artículo «¿Cuánto cobra un diseñador CAD…?» (articles-ac.js) trata justamente de precios por
  región; quitarle los números lo deja vacío.

## 🗓️ 7 oct 2026 (tarde) — Selector ES · EN · PT · IA que crece · blog con fuentes de PubMed

- **Selector de idioma** nuevo en la barra superior (igual que PRODIGY): EN = traducción técnica a mano de Envía tu
  escáner, Preguntas, Soporte y Portafolio (`/i18n/en.json`); en las demás lleva a la página /en/ equivalente.
  PT = traducción automática de Google de cualquier página (marcas protegidas: ya no sale «ALEXANDRE»).
- **IA**: gemini.js usa respuestas oficiales aprobadas y guarda preguntas anónimas (SQL pendiente, mismo de PRODIGY:
  `sql/ia-conocimiento-2026.sql`). Página `app/ia-conocimiento.html` YA publicada (sin tablas avisa «falta correr el SQL»); el pre-push solo avisa por `TABLAS_PENDIENTES` en audit-schema-live → quitarlas cuando el SQL esté corrido. Aviso de no datos de pacientes.
- **Blog**: fuentes reales de PubMed antes de escribir; si no hay artículo ese día, no es error.
- header.js / footer.js `v=20261007`.

---

## 🗓️ 7 oct 2026 — Flujo de diseño arreglado · idiomas · un solo aviso de cookies

- **flujo-diseno**: 4 tarjetas de categoría cerradas con `</div>` y el acordeón sin cerrar → el resumen de precios
  caía debajo del formulario. Arreglado (0 etiquetas mal cerradas en toda la web). `TASA_COP_USD` duplicada hacía
  fallar `pagos.js` (botones de pago sin funciones) y las tasas usaban `SUPABASE_ANON` inexistente.
- **Idiomas**: «YOU SEND → I DESIGN…», «PRECISION BY DESIGN · WORLDWIDE» y el lema de /links ahora en español.
  Páginas /en/: menú, pie y aviso de cookies en inglés (header.js, solo en /en/).
- **Un solo aviso de cookies** (salían dos; el de header.js estaba en inglés). stl-multi-viewer: precarga 3D sin error.
- header.js `v=20261006d`, footer.js `v=20261006`.

---

## 🗓️ 6 oct 2026 (noche) — Artículos sin fuentes borrados · buscador de la web + IA

- Regla: solo artículos con referencias científicas reales (revistas de odontología o investigación seria). Borrados
  los que no tenían ninguna: 25→10. `gen-articulo-ac.js` filtra revistas y pide estudios clásicos con título exacto.
- Lupa en el menú (y Ctrl+K / «/»): `js/buscador-web.js` + `buscar-indice.json` (lo regenera el cron del blog con
  `tools/indice-busqueda.mjs`). También dentro de /soporte. Portafolio: filtro por material y orden.
- header.js `v=20261006c`, orbe-ia.js `v=20261006b`.

---

## 🗓️ 6 oct 2026 (tarde) — Referencias reales · orbe IA · flujo en Envía tu escáner · portafolio v2

- **Referencias**: mostraban «undefined». Verificadas en Crossref: de 127 solo 15 eran reales (el resto, DOIs de
  otros artículos o inexistentes) → quitadas; las reales, con datos oficiales. 15 de 25 artículos quedan sin
  referencias (sección oculta). `gen-articulo-ac.js` verifica cada referencia antes de publicar (mínimo 2 reales).
- **Orbe IA** en /preguntas (js/orbe-ia.js, gemelo de PRODIGY) usando `window._phdrPreguntaIA` → /api/gemini.
- **Flujo de escaneos** (js/flujo-escaneos.js) reemplaza la cinta aether en el hero de Envía tu escáner.
- **Portafolio y caso v2**: igual que PRODIGY (filtros bajo el menú, 2 columnas en celular, visor 3D bajo demanda).
- header.js `v=20261006b`.

---

## 🗓️ 6 oct 2026 — Blog sin repetidos · modo claro legible · soporte en un renglón · 50/50

- **Blog**: 41→25 artículos (mismo tema publicado 2-3 veces; queda el más reciente). Los enlaces viejos redirigen al
  vigente del mismo tema (article.html) y salen del sitemap. `gen-articulo-ac.js`: un tema no se repite antes de 120
  días y, si vuelve, reemplaza al anterior. Temas libres hoy: 4 → luego no publica hasta que un tema cumpla 120 días.
- **Modo claro**: el viejo (variables sueltas + `body.light-mode`) dejaba textos blancos sobre blanco. Ahora es el de
  PRODIGY (inversión única + corrector de contraste solo en claro), copiado tal cual en header.js.
- **Portafolio**: paginador con botón deshabilitado visible y página activa en magenta oscuro.
- **Listas desplegables**: opciones con fondo oscuro (en Windows salían blancas con letra blanca).
- **Soporte**: 4 canales en un renglón en escritorio; el correo se lee en el texto y el botón dice «Escribir correo».
- **50/50**: «Pagas solo cuando apruebas» → «50% para iniciar · 50% contra entrega» (diseño remoto).
- **Magenta** con letra blanca #D946A6 → #B0267F (contraste AA); Font Awesome sin bloquear la carga.
- **Google Analytics contaba dos visitas por página** (14 páginas traían su propio `<script>` de GA y header.js lo
  volvía a configurar). Ahora header.js es el único cargador, reaplica el consentimiento ya dado y pide gtag.js
  después del evento load. Desde hoy las visitas en GA bajan ~a la mitad: es el conteo real.
- **Globo de marcas del inicio**: ya no redimensiona el canvas en cada cuadro; se arma al acercarse y gira solo visible.
- supabase-js fijado a 2.110.2 con integridad (SRI) en envía-tu-escáner. Versiones: header.js y orbiting `v=20261006`.

---

## 🗓️ 1 oct 2026 — Cuenta del doctor creada en el servidor (Envía tu escáner)

- ✅ `envia-tu-scanner.html` hacía `auth.signUp` en el navegador con una clave FIJA escrita en el código y la mandaba
  por WhatsApp: cualquiera podía entrar a esas cuentas (verificado: 0 cuentas la tenían). Ahora llama a
  `functions/api/cuenta-implicita.js` (gemelo de PRODIGY): solo con una solicitud de ese correo de los últimos 15 min,
  clave aleatoria que va solo al correo (Resend directo). Sin Resend: la cuenta se crea igual y el doctor entra con
  «Olvidé mi contraseña».
- 🟡 Dominio alejandrocadcam.com agregado en Resend (São Paulo), DNS + DMARC `p=none` creados en Cloudflare;
  falta que Resend lo verifique, la clave `RESEND_API_KEY` y `FROM_EMAIL` en Cloudflare.

## 🗓️ 1 oct 2026 — Correos: ahora sí pueden salir (y siguen cerrados)

- ✅ `functions/api/send-email.js` exigía `x-cron-secret`/`x-admin-token`, que el navegador nunca manda → ningún correo
  salía. Ahora: admin con sesión → a cualquiera; cliente → a sí mismo; sin sesión → solo la confirmación de un pedido
  recién creado (texto armado en el servidor, una vez por pedido). `js/emailnotif.js` manda la sesión y el código.
- 🟡 Falta `RESEND_API_KEY` y `FROM_EMAIL` en Cloudflare para que salgan de verdad.

## 🗓️ 1 oct 2026 — Máximo 50 MB por archivo (plan gratis de Supabase)

- ✅ `js/formatos.js` y `js/upload-guard.js` avisan antes de subir si un archivo pasa de 50 MB (el proyecto Supabase
  compartido está en plan gratis). Si se pasa a Pro, subir esos límites.

## 🗓️ 1 oct 2026 — Bandeja de WhatsApp (gemela de PRODIGY)

- ✅ `app/bandeja-whatsapp.html` (solo admin): los avisos al doctor de cada cambio de etapa, listos para enviar con el
  número de Alejandro. `functions/api/notify-wa.js` nuevo con los mensajes de solo diseño (EN_DISENO, REVISION_CLIENTE,
  CAMBIOS_SOLICITADOS, ERROR_STL, ENTREGADO) y la API oficial de Meta lista (plantillas `acad_*`, inerte sin WA_TOKEN).
- 🟡 Se activa al correr `sql/avisos-whatsapp-fase2-2026.sql` (repo PRODIGY; la tabla es compartida).

## 🗓️ 1 oct 2026 — Turno del doctor (paridad con PRODIGY)

- ✅ Seguimiento: recuadro dorado cuando el caso espera al doctor, con botón a su panel (aprobar) o a WhatsApp.
- ✅ Panel del cliente: el aviso de revisión abre la aprobación directo (antes llevaba a «caso no encontrado»); ya no
  sale con CAMBIOS (turno del diseñador); `#aprobar=COD` lo prioriza y lo muestra.

## 🗓️ 1 oct 2026 — Seguimiento con el estado real (paridad con PRODIGY)

- ✅ `seguimiento-caso.html` usaba el enum `estado` → casi todo salía «Recibido». Ahora usa `estado_operativo` (cuando se
  corra `sql/seguimiento-estado-operativo-2026.sql` del repo PRODIGY — la función es compartida, se corre una vez).
- ✅ El botón «Ver» del portal del cliente llevaba a «caso no encontrado» (enlace sin la llave): ahora el dueño con sesión ve su caso.
- ✅ La actualización cada minuto manda la llave del caso.

## 🗓️ 1 oct 2026 — CORS anclado al proyecto (paridad con PRODIGY)

- ✅ 15 chequeos de origen en 12 functions aceptaban cualquier `*.pages.dev` (cualquiera crea uno gratis, y
  `includes` también acepta `x.pages.dev.atacante.com`) y cualquier origen con "localhost". Ahora regex anclada a
  `alejandrocadcam.pages.dev` (y sus previews) y `http://localhost:puerto`. El `audit.mjs` de PRODIGY lo vigila:
  `node tools/audit.mjs D:/proyectos-web/alejandro-carvajal-site` (desde el repo PRODIGY).

## 🗓️ 24 sep 2026 — Auditoría (paridad con PRODIGY)

- ✅ `tools/audit-schema-live.mjs`: portados los 2 arreglos de puntos ciegos (ventanas solapadas + tabla inexistente) → destapó bug real:
  `admin-panel` «Confirmar pago» pedía `pedidos.doctor,total` (no existen) → 400 y el correo de pago confirmado NUNCA salía. Corregido.
- ✅ XSS en onclick (19 lugares: admin-panel, bandeja, client-panel, mis-casos, caso) → `window.escJ`. `js/notif-panel.js` ídem (?v=20260924).
- ✅ `app/metricas.html`: supabase-js con `defer` → TypeError createClient al cargar (panel BI roto). Quitado defer.
- ✅ Auditoría 2: foco atrapado en el diálogo de reporte, Inter solo al abrir, avisos de no incluir datos de pacientes, nombres de archivo ocultos a la IA externa, tope global de WhatsApp.
- ✅ `_headers` /app/* con no-store + X-Robots noindex (antes solo *.html y sin X-Robots) · `_redirects` bloquea /tools/* y /tests/*.

## 🗓️ 24 sep 2026 — "¿Algo no funciona?" + asistente IA (gemelo de PRODIGY)

- 🟡 Botón de reporte en páginas de cliente y formularios (`js/reportar-problema.js`): tipo, descripción, captura, detalle técnico; errores JS automáticos (agrupados). Páginas solo-admin cargan el script con `<body data-no-reportar>` (solo captura errores).
- 🟡 `functions/api/reportar-problema.js` + `functions/api/asistente-soporte.js` (Gemini gratis con la GEMINI_API_KEY existente, streaming): la IA intenta resolver en vivo; WhatsApp (STAFF_n) solo si no se resuelve. Tabla compartida `reportes_web` con `negocio=alejandrocadcam`.
- 🟡 Bandeja `app/reportes-web.html` (solo admin) + ítem en admin-panel con contador; «Analizar con IA».
- 🟡 Migas de subidas fallidas en `envia-tu-scanner.html` y `js/flujo-uploader.js`.
- ✅ SQL de la tabla compartida corrido (repo PRODIGY: `sql/reportes-web-2026.sql` + `sql/reportes-web-ia-2026.sql`).

## 🗓️ Sesión 14-18 sep 2026 — SEO alto ticket, aislamiento, WhatsApp leads

### SEO freelance alto ticket (Exocad/3Shape)
- Cluster bilingüe EN+ES con pares hreflang: smile-design↔diseno-sonrisa, implant-esthetics↔estetica-implantes, surgical-guides↔guias-quirurgicas, all-on-x↔diseno-full-arch, clear-aligners↔alineadores. Schema Service+FAQPage+BreadcrumbList, geo Bogotá, hreflang recíproco corregido.
- +4 FAQ long-tail en surgical-guides y all-on-x (freelance, all-on-4 vs 6, printer/resina) + cross-link.
- Posicionamiento "calidad extrema + personalización, no producción masiva" (bandas en landings + meta hubs). "15 min*" cualificado (real para unidades simples).
- Testimonios reales con permiso en 6 landings + guias-quirurgicas (15 doctores). Estrellas decorativas, SIN AggregateRating (Google ignora reseñas propias) → estrellas reales = Google Business Profile.
- **Fix noindex** en diseno-remoto y guias-quirurgicas (estaban bloqueadas de Google por error; sitemap 0.9 + canonical propio). Reportado en GSC.
- **Fix bug `">`** en tarjetas de casos de diseno-remoto (onerror con comillas `\"` rotas → `&quot;`).
- Link corto de marca **/wa** y **/wa-en** (redirect a WhatsApp con mensaje freelance, para bio Instagram).

### Precios (PROVISIONAL — pricing no estudiado)
- calculadora-diseno `PRECIOS_USD` bajado ~15% + `USD_COP` 4000→3400.

### Aislamiento por negocio (SQL corridos por el usuario)
- **casos_portafolio:** columna `negocio`; display filtra `.in(['alejandrocadcam','ambos'])` en portafolio.html, caso.html (individual+relacionados), diseno-remoto.html; admin-panel lista igual. 21 casos existentes = 'ambos'. Grid destacado muestra tipos variados.
- **solicitudes_scanner:** columna `negocio`; insert etiqueta `negocio:'alejandrocadcam'`; admin-panel filtra su marca + legacy null.

### WhatsApp leads
- `functions/api/notify-staff.js`: avisa al staff por WhatsApp (CallMeBot) al entrar lead. Env STAFF_n_PHONE/APIKEY. Llamado desde envia-tu-scanner. **INERTE hasta configurar env.**
- Ruteo alejandrocadcam → Alejandro (573219581949) + esposa (5212311034504).

### Infra / IA / push
- `OneSignalSDKWorker.js` en raíz — faltaba, push fallaba en silencio.
- robots.txt: ClaudeBot permitido.

### PENDIENTE usuario
- Configurar CallMeBot + env STAFF_* · vincular teléfono esposa a WhatsApp Business · lanzar Meta (prueba, carillas/estética) · sesión de pricing · GSC solicitar indexación landings nuevas.

### Artifacts de apoyo (no en repo)
- Catálogo WhatsApp · Guión de cierre WhatsApp · Manual de anuncios Meta · Tablero de campaña compartido (db).

### Sesión 19-sep — SEO, precios, seguridad, rendimiento (aplica a ambos repos)
- **SEO:** destrabadas 15 páginas PRODIGY que estaban `noindex` pese a estar en sitemap; preguntas/soporte a index; sitemap limpio; fix soft-404 `/article` (redirige a blog) + noindex en id inválido; `/cdn-cgi/` bloqueado en robots; H1 en links.html; títulos largos acortados; **llms.txt** (IA search) en ambos.
- **Precios Alejandro (aprobado):** alto ticket ↑ según mercado freelance intl — modelo $5→8, guía $49→69, guía compleja $74→99, DSD $69→89, full arch $149. Bug de labels de calculadora sincronizado (mostraban precio viejo). PRODIGY diseño NO tocado (sin testear). Sindekar 2025 guardado como referencia.
- **Rendimiento:** miniaturas de portafolio vía Supabase `render/image` (-54% peso, automático fotos futuras); preconnects reducidos a ≤4 site-wide; a11y del carrusel (aria-hidden→tabindex, role group).
- **Seguridad (auditoría Opus, SAST + RLS en vivo):** TODO PASA. Sin secretos en cliente, service_role solo server-side, RLS bloquea anon en pedidos/leads/newsletter, CORS allowlist, authz app_metadata, XSS escapado. Post-cuántico: Cloudflare ya hace TLS híbrido ML-KEM; datos AES-256. Doc en `SECURITY.md` (ES/EN) ambos repos. SQL de índices en `sql/optimizacion-indices-2026-09.sql` (PRODIGY) — pendiente correr.
- **PRODIGY home + nosotros:** en modo mantenimiento A PROPÓSITO (decisión usuario). Anuncios/SEO apuntan a páginas internas, no al home.

### Cierre aislamiento 18-sep (fugas que faltaban)
- Faltaba filtro de negocio en consultas públicas y admin (fugaban casos entre marcas): **home destacados** (index.html) y **galería /links** (links.html) en ambos repos; en PRODIGY además **contador total** (portafolio.html) y **paneles admin** (gestionar-casos, panel-interno). Corregido con `negocio in (marca, ambos)` (REST `&negocio=in.(...)` o `.in('negocio',[...])`). Auditorías estáticas + schema-live OK. Pusheado.
