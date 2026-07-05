# Alejandro CAD/CAM — PENDIENTES MAESTRO
> Solo tareas activas. Última revisión: 2026-07-04
> Completadas → eliminar. Nuevas → agregar arriba de su bloque.

---

## ⭐ ATAJO — SQL pendiente en un solo archivo

`sql/MAESTRO-EJECUTAR-TODO-2026-07-04.sql` reúne los 5 patches propios de Alejandro (buckets de Storage, índices, RPCs de analytics sin login, RPCs de cotizaciones sin rol, notificaciones_wa sin RLS habilitado desde su creación). **Importante:** la mayoría de los hallazgos de seguridad de esta sesión fueron en tablas compartidas con PRODIGY (mismo proyecto Supabase) — esos se corrigen ejecutando `sql/MAESTRO-EJECUTAR-TODO-2026-07-04.sql` del repo de **PRODIGY**, no de este. Necesitas ejecutar **ambos** archivos maestros (uno en cada sesión del SQL Editor, mismo proyecto Supabase — el orden entre ellos no importa).

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
