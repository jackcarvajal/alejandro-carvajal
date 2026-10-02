# BITÁCORA — Alejandro CAD/CAM

Registro de cambios del repo `alejandro-carvajal-site` (alejandrocadcam.com).
Comparte BD Supabase (`zgihrwqfyvgyapbwzkvw`) con PRODIGY, separados por columna `negocio`.

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
