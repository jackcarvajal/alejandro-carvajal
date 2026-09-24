# BITÁCORA — Alejandro CAD/CAM

Registro de cambios del repo `alejandro-carvajal-site` (alejandrocadcam.com).
Comparte BD Supabase (`zgihrwqfyvgyapbwzkvw`) con PRODIGY, separados por columna `negocio`.

---

## 🗓️ 24 sep 2026 — "¿Algo no funciona?" + asistente IA (gemelo de PRODIGY)

- 🟡 Botón de reporte en páginas de cliente y formularios (`js/reportar-problema.js`): tipo, descripción, captura, detalle técnico; errores JS automáticos (agrupados). Páginas solo-admin cargan el script con `<body data-no-reportar>` (solo captura errores).
- 🟡 `functions/api/reportar-problema.js` + `functions/api/asistente-soporte.js` (Claude, streaming): la IA intenta resolver en vivo; WhatsApp (STAFF_n) solo si no se resuelve. Tabla compartida `reportes_web` con `negocio=alejandrocadcam`.
- 🟡 Bandeja `app/reportes-web.html` (solo admin) + ítem en admin-panel con contador; «Analizar con IA».
- 🟡 Migas de subidas fallidas en `envia-tu-scanner.html` y `js/flujo-uploader.js`.
- ⏳ Requiere: SQL `sql/reportes-web-2026.sql` + `sql/reportes-web-ia-2026.sql` (en el repo PRODIGY, tabla compartida) y Secret `ANTHROPIC_API_KEY` en este proyecto de Cloudflare.

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
