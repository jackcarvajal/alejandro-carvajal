# Alejandro CAD/CAM — PENDIENTES MAESTRO
> Solo tareas activas. Última revisión: 2026-05-24
> Completadas → eliminar. Nuevas → agregar arriba de su bloque.

---

## 🔴 URGENTE — Bloquean funcionalidades activas

| # | Acción | Dónde | Detalle |
|---|---|---|---|
| 1 | `GEMINI_API_KEY` en Cloudflare Pages | Pages → Settings → Environment Variables | Sin esto el chatbot IA no responde |
| 2 | `GEMINI_API_KEY` en GitHub Secrets | Repo → Settings → Secrets and variables → Actions → New | Sin esto el cron de artículos no corre (lunes/miércoles) |
| 3 | Redesplegar en Cloudflare tras agregar env vars | Cloudflare → Deployments → Retry deployment | Para activar bot + SEO fixes |
| 4 | Subir casos al portafolio | `/app/admin-panel.html` → tab Portafolio | Mínimo 5 casos con portada |

---

## 🟡 SEO / GOOGLE

| # | Acción | Estado |
|---|---|---|
| 1 | Search Console → re-enviar `sitemap.xml` | ⏳ |
| 2 | Google Ads ID → reemplazar `AW-XXXXXXXXX` en `js/conversions.js` | ⏳ |
| 3 | DNS → SPF + DKIM + DMARC para alejandrocadcam.pages.dev | ⏳ |

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
