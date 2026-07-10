# Alejandro CAD/CAM — PENDIENTES MAESTRO
> Solo tareas activas. Última revisión: 2026-07-09
> Completadas → eliminar. Nuevas → agregar arriba de su bloque.

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
2. Stripe Dashboard → Developers → Webhooks → Add endpoint → URL `https://alejandrocadcam.pages.dev/api/stripe-webhook` → evento `checkout.session.completed` → copiar el Signing secret (`whsec_...`)
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
| 1 | `GEMINI_API_KEY` en Cloudflare Pages | Pages → Settings → Environment Variables | Sin esto el chatbot IA no responde |
| 2 | `GEMINI_API_KEY` en GitHub Secrets | Repo → Settings → Secrets and variables → Actions → New | Sin esto el cron de artículos no corre (lunes/miércoles) |
| 3 | Redesplegar en Cloudflare tras agregar env vars | Cloudflare → Deployments → Retry deployment | Para activar bot + SEO fixes |
| 4 | Subir casos al portafolio | `/app/admin-panel.html` → tab Portafolio | Mínimo 5 casos con portada |
| 5 | `RESEND_API_KEY` en Cloudflare Pages | Pages → Settings → Environment Variables | Para `functions/api/send-email.js` (notificaciones email) |

---

## 🟡 SEO / GOOGLE

| # | Acción | Estado |
|---|---|---|
| 1 | Search Console → re-enviar `sitemap.xml` | ⏳ |
| 2 | Google Ads ID → reemplazar `AW-XXXXXXXXX` en `js/conversions.js` | ⏳ |
| 3 | DNS → SPF + DKIM + DMARC para alejandrocadcam.pages.dev | ⏳ |
| 4 | **OG images** → capturar JPG desde HTML: `assets/og-home.html`, `og-calculadora-diseno.html`, `og-diseno-remoto.html` → guardar como `.jpg` 1200×630 | ⏳ |

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
