# Alejandro CAD/CAM — PENDIENTES MAESTRO
> Solo tareas activas. Última revisión: 2026-11-20
> Completadas → eliminar. Nuevas → agregar arriba de su bloque.

---

## 🔴 20-nov-2026 — ACCIONES TUYAS (Alejandro)

- 🔴 **Academia — % retenido en devoluciones**: el borrador de condiciones (rama local `borrador/terminos-academia`,
  sin publicar) retiene **25 %** si el alumno ya empezó (≤ 20 % visto, ≤ 5 días hábiles). Confirmar o cambiar el % →
  Claude lo publica. Presencial: sin devolución (solo el retracto legal). Revisarlo con un abogado antes es buena idea.
- 🔴 **Correr** `sql/academia-cursos-2026.sql` (repo PRODIGY) → `registra_primer_acceso = true`.
- 🔴 **Videos de la Academia**: en Cloudflare (proyecto alejandrocadcam) falta el binding R2 `ACADEMIA_VIDEOS` y la
  variable secreta `ACADEMIA_VIDEO_SECRET` (no mandarla por chat).
- 🔴 **PayPal**: pasos en PENDIENTES.md de PRODIGY (una app sirve para las dos webs).
- 🔴 **www.alejandrocadcam.com da 404**: falta la regla 301 www → alejandrocadcam.com (ver PENDIENTES de PRODIGY, punto 3).
- 🟡 **Catálogo**: 4 servicios de diseño no están en `catalogo` (guía 1 implante, implante adicional, planificación full arch,
  provisional PMMA con guía) → la alerta de precio no los vigila. ¿Se agregan? (aparecerían también en el admin de precios de PRODIGY).
- 🟡 Google Maps: teléfono viejo y pin en el Atlántico (arreglo manual en Business Profile).

---

## 🔴 ESTA SESIÓN (17-nov-2026) — ACCIONES TUYAS (Alejandro)

### A) Publicar el lote de crecimiento USA (listo en código, SIN push)
- ✅ HECHO 18-nov — **Activar WhatsApp Business** en `573159831800` (eSIM) → web publicada con el número nuevo: instala la app Business en el celular → verifica
  por SMS → manda un mensaje de prueba a `wa.me/573159831800` → avísame **"activo"**.
  Desbloquea el push de: nº nuevo (60 archivos) + hub /en/ reforzado + i18n del chrome /en/ + trust band US.
  (Al publicar, yo bumpeo el caché de header.js/footer.js.)
- 🟡 Decidir: **avisos internos** (CallMeBot/functions `notify-wa`, `cotizacion-auto`, `resumen-semanal`)
  → ¿al WhatsApp nuevo del negocio o a tu personal?

### B) Google Ads — medir conversiones
- 🔴 **Crear/abrir las acciones de conversión** en Google Ads → Metas → Conversiones.
- 🔴 Darme el **AW- ID** (`AW-##########`) + los **labels** (WhatsApp, STL, cotización, videollamada)
  → los pego en `js/conversions.js` + agrego `gtag('config','AW-...')` en header.js.
  (Alternativa sin código: importar `whatsapp_click`/`stl_upload` desde GA4.)
- 🟡 Confirmar que el **Meta Pixel `1254573606759925`** es tuyo.

### C) Crecimiento USA — frente rápido (trae casos antes que Google)
- 🟢 Abrir perfil + postear 2 casos en **DentalLabNetwork.com**, grupos FB ("Dental Lab Technicians",
  "Exocad Users"), Reddit (r/dentallab) y LinkedIn.
- 🟢 Search Console → **Solicitar indexación** de las 8 /en/ (Inspección de URL).
- 🟡 Mandarme **4–6 casos before/after** reales → página **Case Studies EN** (o subir casos en
  admin-panel → Portafolio para que la página los lea de Supabase).

### Ideas registradas
- 🟡 **Academia Exocad para hispanohablantes en USA** — segmentar "español · Estados Unidos" (alto ticket,
  mismo idioma, menos competido).

---

## ✅ SEO inglés — hreflang verificado sano (8-nov)

Auditoría de reciprocidad en todo el sitio (49 HTML, 40 con hreflang) → **0 asimetrías y 0 destinos rotos
entre páginas indexables.** Revisado el pendiente previo: **`en/veneer-terms` es noindex a propósito**
(Terms of Service; el ES legal ya existe en `terminos-y-legal.html`) → NO necesita gemelo ES ni hreflang;
el backlog anterior («crear su versión ES») estaba de más. WARN cosméticos: páginas noindex (article base,
caso, seguimiento-caso, terminos-y-legal) cargan hreflang que Google ignora → limpieza opcional, cero
impacto. El «inglés en todo» vía `?lang=en` sigue NO viable (el parámetro no se lee; faltan `data-i18n`)
→ proyecto de traducción aparte. Paridad con PRODIGY.

---

## 🔴🔴 Fix crítico de dinero (compartido con PRODIGY) — wompi-signature firmaba montos del cliente

**El hueco más grave.** La Edge Function `wompi-signature` (proyecto Supabase compartido) firmaba cualquier `monto_en_centavos` que mandara el cliente sin validarlo contra el pedido real → pagar $1.000 por un pedido de $500.000. **La corrección server-side ya se hizo en el repo de PRODIGY** (`supabase/functions/wompi-signature/index.ts` v2.0, lee `precio_total` de la BD) y al desplegarse cubre AMBOS negocios (misma función compartida).

**Fix de código ya aplicado en ESTE repo (paridad):** `js/pagos.js` — usa el monto que devuelve el servidor (no el del cliente) para `amount-in-cents` y **falla cerrado** si no hay firma (antes continuaba sin firma, reabriendo el hueco). Cache-buster `?v=20260710`. Ya commiteado/pusheado.

**Falta (acción compartida, ejecutar una vez):** `supabase functions deploy wompi-signature` desde el repo de PRODIGY (donde vive el código de la función).

---

## ✅ Fix de código (2026-07-10) — gap de paridad: flujo-uploader.js sin validación de tamaño/extensión

`js/flujo-uploader.js` subía archivos a Storage (subida anónima, `uid='anon'`) sin validar tamaño ni extensión — un visitante sin login podía subir archivos de cualquier tamaño/tipo al bucket `pedidos-archivos`. La versión gemela de PRODIGY ya tenía este check (`MAX_FILE_MB=500` + `ALLOWED_EXTS`); se portó (Ley de Oro de paridad). La validación de magic-bytes ya existía.

**Riesgo residual (compartido con PRODIGY, bajo, sin corregir):** las subidas anónimas van directo a Storage sin pasar por una Cloudflare Function, así que no tienen rate-limit por IP (sí validan tamaño/extensión/magic-bytes). Cerrarlo requeriría cambio arquitectónico — diferido.

---

## ✅ Fix de código (2026-07-09) — SRI en SDK de Supabase + permissions en smoke-tests.yml

`@supabase/supabase-js` fijado a `2.110.2` + `integrity`/`crossorigin` en los 16 archivos que lo cargan (mismo hash que PRODIGY, mismo SDK). `smoke-tests.yml` — agregado `permissions: contents: read` explícito. Sin vulnerabilidad crítica encontrada en workflows (no interpola contexto no confiable de PR/issue).

---

## ✅ Fix de código (2026-07-09) — logout sin revocar token + relay WA abierto

- `js/header.js` — el logout del mini-login del header solo borraba `localStorage`, nunca revocaba el refresh token server-side (`/auth/v1/logout`). Corregido, mismo fix aplicado en PRODIGY.
- `functions/api/wa-auto.js` — no validaba el contenido del mensaje (a diferencia de PRODIGY): cualquier visitante podía usarlo como relay de WhatsApp arbitrario. Corregido: exige marca "alejandro" en el mensaje + límite de 700 caracteres.

---

## ✅ SQL ejecutado (2026-07-09, compartido con PRODIGY) — anti-abuso de referidos por WhatsApp

Trigger sobre `pedidos` (tabla compartida), aplica a ambos negocios. Ejecutado desde el repo PRODIGY.

---

## ✅ SQL ejecutado (2026-07-09, compartido con PRODIGY) — alerta de precio sospechoso

Confirmado. El trigger de `sql/patch-alerta-precio-sospechoso-2026-07.sql` (ejecutado desde el repo PRODIGY) cubre la tabla `pedidos` completa, protege ambos negocios.

**Fix de código ya aplicado en este repo:** `client-panel.html` (path traversal en subida a bibliotecas), `envia-tu-scanner.html` (extensión de archivo sin sanitizar), `seguimiento-caso.html` (iframe de Exocad sin `sandbox`).

---

## ✅ Fix de código (2026-07-08) — resumen-semanal.js: secreto en query string

`functions/api/resumen-semanal.js` recibía el `CRON_SECRET` vía `?key=` en la URL (quedaba expuesto en logs de acceso de Cloudflare) → corregido a header `Authorization: Bearer`. Hallazgo de la ronda 2 de auditoría (paridad con el patrón `Bearer` que ya usa `purgar-stl-storage.js` de PRODIGY). Si hay algún cron/GitHub Action que llame este endpoint con `?key=`, hay que actualizarlo para mandar el header en vez del query param.

**XSS** — `envia-tu-scanner.html`: nombre del doctor y WhatsApp (formulario público sin sesión) se insertaban sin escapar en el mensaje de éxito → agregada función de escape local. Mismo hallazgo y fix en PRODIGY.

---

## ✅ SQL ejecutado (2026-07-06, compartido con PRODIGY) — buscar_pedido_publico() (patch 26)

Confirmado — "Patch 26 aplicado". `seguimiento-caso.html` ya funciona. También corregido en código: `app/admin-panel.html` (export CSV usaba `precio_usd`/`precio`, reales `total_usd`/`precio_total`; y el tab "Clientes" usaba tabla `doctores` inexistente + columna `email` inexistente — real: `doctores_perfil`, sin `email` propio ya que vive en `auth.users`).

Verificado línea por línea y **limpio**: `flujo-diseno.html` completo, `js/flujo-uploader.js` (usa `createSignedUrl` correctamente, solo se corrigió un comentario desactualizado).

**Con esto se cierra el barrido completo de columnas fantasma por código en ambos proyectos.** Solo queda la prueba en vivo (crear un pedido real) para validar todo de punta a punta.

---

## ✅ Fix de código (2026-07-05) — cotizacion-auto.js y resumen-semanal.js con columnas fantasma

Ya commiteado y pusheado, se despliega solo.
- `cotizacion-auto.js`: el INSERT a `cotizaciones` usaba `doctor`/`email`/`whatsapp` (ninguna existe — reales: `doctor_nombre`, `doctor_email`, `doctor_tel`) y no incluía `negocio`. **Ninguna cotización se ha guardado jamás desde este endpoint.**
- `resumen-semanal.js`: el SELECT a `pedidos` incluía `total` (no existe, real: `precio_total`) — el resumen semanal por WA siempre reportaba 0 pedidos e ingresos $0 sin importar la actividad real.

## ✅ SQL ejecutado (2026-07-05, compartido con PRODIGY) — trigger de referidos (patch 25)

Confirmado — "Patch 25 aplicado". `prodigy_detectar_primer_pedido_referido()` usaba `NEW.doctor` (no existe); corregido a `NEW.nombre_doctor`.

---

## ⭐ ATAJO — SQL pendiente en un solo archivo

`sql/MAESTRO-EJECUTAR-TODO-2026-07-04.sql` reúne los 5 patches propios de Alejandro (buckets de Storage, índices, RPCs de analytics sin login, RPCs de cotizaciones sin rol, notificaciones_wa sin RLS habilitado desde su creación). **Importante:** la mayoría de los hallazgos de seguridad de esta sesión fueron en tablas compartidas con PRODIGY (mismo proyecto Supabase) — esos se corrigen ejecutando `sql/MAESTRO-EJECUTAR-TODO-2026-07-04.sql` del repo de **PRODIGY**, no de este. Necesitas ejecutar **ambos** archivos maestros (uno en cada sesión del SQL Editor, mismo proyecto Supabase — el orden entre ellos no importa).

---

## 🟡 PRUEBA EN VIVO PENDIENTE — pedidos nunca ha guardado un solo registro (patch 24 YA EJECUTADO)

**Mismo hallazgo crítico que en PRODIGY** (tabla `pedidos` compartida). `flujo-diseno.html` insertaba con columnas que nunca existieron (`doctor`, `whatsapp`, `servicio`, `total`, `link_stl`, `nonce`, `flujo`, `fuente_pago`, `software_diseno`) — el checkout mostraba "éxito" sin que el pedido se guardara jamás. También corregidos `app/admin-panel.html` y `app/mis-casos.html` (fallaban al cargar pedidos por el mismo motivo).

**Ya corregido en código y SQL ejecutado** (patch 24, confirmado por Alejandro — agregó `flujo`, `nombre_cliente`, `nota_calidad`, `direccion` a la tabla compartida `pedidos`).

**Solo falta la PRUEBA REAL**: crear un pedido de prueba desde `flujo-diseno.html` de Alejandro y confirmar con `SELECT * FROM pedidos WHERE negocio='alejandrocadcam' ORDER BY created_at DESC LIMIT 1;` que se guardó.

---

## ✅ Fix de código (2026-07-05) — wa-auto.js sin límite por número destino (paridad con PRODIGY)

Ya commiteado y pusheado, se despliega solo. El endpoint sigue siendo público (necesario para el registro de clientes antes de login), pero ahora limita a 5 mensajes/hora por número destino además del límite por IP — evita usarlo para acoso/spam dirigido a un mismo número rotando de IP. Mismo fix ya aplicado en el `wa-auto.js` de PRODIGY.

---

## 🔴 CRÍTICO — 2 endpoints públicos sin ninguna autenticación (auditoría paridad 2026-07-03)

**Hallazgo:**
1. `functions/api/send-email.js` aceptaba `html` **arbitrario** del cliente sin ninguna autenticación — cualquiera podía enviar phishing/spam con cualquier contenido usando tu dominio y tu cuota de Resend, a cualquier destinatario. PRODIGY ya tenía esto corregido (genera el HTML siempre del lado del servidor).
2. `functions/api/send-push.js` no exigía nada — cualquiera podía disparar una notificación push a **todos** tus suscriptores con título/mensaje arbitrario (`included_segments:['All']`), sin límite más allá del rate-limit por IP.

**Ya corregido en código:** ambos ahora exigen el mismo header `x-cron-secret` o `x-admin-token` que ya usa PRODIGY. Ninguno de los dos tenía un botón real en el sitio que los llamara (código sin usar todavía), así que este cambio no rompe nada visible hoy.

**Pendiente de tu parte:** agregar `ADMIN_SECRET` como variable de entorno en Cloudflare Pages (Settings → Environment Variables) — un string aleatorio que tú inventes. `CRON_SECRET` ya debería existir de configuraciones anteriores.

---

## 🔴 URGENTE — Activar webhook de Stripe (auditoría pagos 2026-07-03)

**Hallazgo grave:** no existía ningún receptor de webhook de Stripe — `stripe-checkout.js` solo creaba la sesión de pago, nada confirmaba el pago del lado del servidor. Además `app/success.html` (destino del `success_url`) **no existe como archivo** — el cliente termina en un 404 tras pagar.

**Ya corregido en código (este commit):**
- Nueva función `functions/api/stripe-webhook.js` — verifica firma de Stripe, procesa `checkout.session.completed`, marca el pedido Pagado, inserta en `pagos`
- `stripe-checkout.js`: valida el monto contra `precio_total` real en BD + `Idempotency-Key` para evitar sesiones duplicadas

**Pasos que faltan:**

1. Esperar deploy de Cloudflare Pages de este commit
2. Stripe Dashboard → Developers → Webhooks → Add endpoint → URL `https://alejandrocadcam.com/api/stripe-webhook` → evento `checkout.session.completed` → copiar el Signing secret (`whsec_...`)
3. Agregar `STRIPE_WEBHOOK_SECRET` en Cloudflare Pages → Environment Variables
4. Probar con "Send test webhook" desde Stripe Dashboard

**Pendiente aparte (no bloqueante, es de contenido/UX):** crear `app/success.html` — hoy el cliente que paga con Stripe llega a una página 404. Puede copiarse la estructura de `app/success.html` de PRODIGY como base y adaptar textos/marca.

---

## 🔴 URGENTE — Ejecutar 2 SQL en Supabase (paridad seguridad/rendimiento con PRODIGY, 2026-07-03)

**Hallazgo:** buckets `disenos-cad`, `scanner-uploads` y `pedidos-archivos` son **públicos** — mismo problema que se corrigió en PRODIGY. Índice de `pedidos` demasiado simple (`negocio` solo) para los patrones de consulta reales (`negocio + created_at`, `negocio + user_id`).

**Ya corregido en código (este commit):**
- `getPublicUrl()` → `createSignedUrl()` en `app/client-panel.html` (3 puntos), `app/admin-panel.html` (STL de revisión ya usaba solo path — correcto)
- Reintento automático (3 intentos, backoff) en 5 rutas de subida: `app/client-panel.html` (x3), `app/admin-panel.html`, `envia-tu-scanner.html`, `js/flujo-uploader.js`
- `envia-tu-scanner.html`: usuario anónimo ya no intenta firmar una URL que no puede leer — guarda solo la ruta. `app/admin-panel.html` → `loadEscaners()` ahora firma la URL al mostrarla (tiene permiso, el anónimo no)

**Pasos que faltan (en orden):**

1. **Esperar el deploy de Cloudflare Pages** de este commit
2. **Ejecutar `sql/patch-storage-buckets-privados-2026.sql`** en Supabase Dashboard → SQL Editor → `https://supabase.com/dashboard/project/zgihrwqfyvgyapbwzkvw/sql/new`
3. **Ejecutar `sql/patch-indices-pedidos-alejandro-2026.sql`** en el mismo SQL Editor — sin riesgo, solo agrega 3 índices

---

## 🔴 URGENTE — Vulnerabilidad de seguridad

| # | Acción | Dónde | Detalle |
|---|---|---|---|
| 0 | ~~**Ejecutar `sql/patch-rls-client-column-protection.sql`**~~ | ✅ **Ejecutado** | Trigger activo — clientes protegidos |

---

## 🔴 URGENTE — Bloquean funcionalidades activas

| # | Acción | Dónde | Detalle |
|---|---|---|---|
| 1 | ~~`GEMINI_API_KEY` en Cloudflare Pages~~ | ✅ **LISTO** (verificado 2026-11-06: bot responde 200 con `gemini-2.5-flash`) | — |
| 2 | ~~`GEMINI_API_KEY` en GitHub Secrets~~ | ✅ **LISTO** (artículos auto-generados frescos: 4-nov) | — |
| 3 | ~~Redesplegar en Cloudflare tras env vars~~ | ✅ hecho (bot + SEO en vivo) | — |
| 4 | Subir casos al portafolio | `/app/admin-panel.html` → tab Portafolio | Mínimo 5 casos con portada |
| 5 | `RESEND_API_KEY` en Cloudflare Pages | Pages → Settings → Environment Variables | Para `functions/api/send-email.js` (notificaciones email) |

---

## 🟡 SEO / GOOGLE

| # | Acción | Estado |
|---|---|---|
| 1 | Search Console → re-enviar `sitemap.xml` | ⏳ |
| 2 | Google Ads ID → reemplazar `AW-XXXXXXXXX` en `js/conversions.js` | ⏳ |
| 3 | DNS → SPF + DKIM + DMARC para alejandrocadcam.com | ⏳ |
| 4 | **OG images** → capturar JPG desde HTML 1200×630 | ✅ (2026-11-05) — todas las páginas con `og:image` ya tienen su `.jpg` real (home/calc/diseno-remoto/guias/carillas + portafolio/blog/soporte/nosotros/envia-tu-scanner) |

---

## 🎨 CONTENIDO VISUAL — TUYO

| # | Contenido | Dónde | Impacto |
|---|---|---|---|
| 1 | 5-10 capturas Exocad reales | portafolio, diseno-remoto, diseno-cad | 🔴 |
| 2 | Video 30-60 seg OBS: STL → diseño | diseno-remoto hero | 🔴 |
| 3 | Foto tuya en PC con Exocad | nosotros (si existe), diseno-remoto | 🟡 |
| 4 | Antes/después: STL crudo vs. diseño final | diseno-remoto, guias-quirurgicas | 🟡 |

---

## ✅ COMPLETADO (2026-05-24)
- CLAUDE.md creado con reglas maestras, bot IA, artículos científicos
- MAP.md creado con arquitectura completa
- PENDIENTES.md creado
- VERIFICAR.md creado
- Bot IA: 4 casos de error + precios USD + WA correcto 573219581949
- SEO: flujo-diseno + terminos-y-legal → index,follow
- robots.txt: bots IA (ChatGPT/Perplexity/Gemini permitidos, CCBot/ClaudeBot bloqueados)
- articles-ac.js: pool 28 temas unificados + pick aleatorio sin repetición
- gen-articulo-ac.js: temperature 0.15
- WCAG: `<main id="main-content">` verificado en todas las páginas públicas
- blog.html: noindex→index,follow + `<main>` WCAG fix
- article.html: renderContent() normaliza ambos formatos (t/tipo, c/texto)
- sw.js: v10 activo
- sobre-mi.html: creada con perfil personal (10+ años, países, soporte 3Shape, timeline 2014–2026)
- footer.js: "Sobre Alejandro" enlazado a /sobre-mi (era /)
- sitemap.xml: sobre-mi.html agregado con priority=0.8 lastmod=2026-05-24
- **SEO autónomo**: hreflang EN en soporte, envia-tu-scanner, cursos, flujo-diseno
- portafolio.html: robots index,follow + author agregados
- sitemap.xml: flujo-diseno.html agregado (priority=0.8)
- **SEO lote 2026-05-27h**: twitter:title+description en 4 páginas (calculadora-diseno, cursos, index, soporte); títulos >75chars → ≤72 en 4 páginas; descriptions >165chars → ≤160 en 6 páginas; max-snippet:-1+max-image-preview:large en 9 páginas; schema Person sameAs (IG+LinkedIn+WA) en index+sobre-mi; geo tags en en/remote-design; keywords en terminos-y-legal; sitemap lastmod 2026-05-27 en/remote-design; _plantilla-publica max-snippet
- **Lote 2026-05-27**: `functions/api/gemini.js` creado (chatbot proxy, era 502); `scripts/gen-articulo-ac.js` + `.github/workflows/journal-cron-ac.yml` (auto-journal lunes+miércoles 9AM, 13 tópicos); sw.js v10→v11 + /sobre-mi en PRECACHE; blog.html filtros corregidos (categorías reales); caso.html XSS fix (escHtml en onclick publicarNota); MAP.md actualizado (sw v11, gemini proxy, journal); journal-cron-ac.yml fix grep titulo (JS single-quote); PENDIENTES.md actualizado; XSS audit final — LIMPIOS ambos proyectos
