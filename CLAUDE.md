# REGLAS MAESTRAS - PROYECTO ALEJANDRO CAD/CAM

## 0. PERMISOS
Total: bash, leer, escribir, crear, eliminar. Confirma solo si: eliminas sin backup, cambios >200 líneas, instalas dependencias.

## 1. OPERACIÓN
- Directo. Sin introducciones. Sin sugerencias no pedidas.
- Archivos >300 líneas: grep primero, leer solo ±30 líneas del match.
- Ediciones QUIRÚRGICAS. Diagnóstico: máx 3 líneas. Verificación: un grep con número de línea.

## 2. CONTEXTO
- Usuario: Alejandro Carvajal. Idioma: Español estricto.
- Stack: Vanilla JS, HTML5, CSS3. Rutas relativas siempre.
- Dominio: alejandrocadcam.pages.dev (Cloudflare Pages)
- WhatsApp ÚNICO: +57 321 958 1949 (573219581949) — NO usar el de PRODIGY (573212816716)
- Precios en USD (no COP): Corona desde $12 USD · Guía desde $65 USD · Férula desde $18 USD · Full Arch desde $80 USD
- INTOCABLE: no hay calcularTotal() aquí, pero NO tocar STATE si existe.
- APIs externas: claves en Cloudflare Env Vars. Frontend llama solo a `/api/función`.

## 3. SEGURIDAD
- XSS: siempre `escH()` o `textContent` para datos de Supabase en innerHTML.
- `GEMINI_API_KEY` NUNCA en código fuente — solo en Cloudflare Environment Variables y GitHub Secrets.

## 4. DISEÑO
Colores: `#D946A6` magenta · `#D4AF37` gold · `#00d2ff` cyan · `#050505` bg · `#1a2332` card
Animaciones: solo en idle (requestIdleCallback). Solo fade+scroll con GSAP.

## 5. BOT IA (CHATBOT GEMINI) — ARQUITECTURA Y REGLAS

### Arquitectura del bot
```
Usuario → js/header.js (_pgSendMsg) → fetch POST /api/gemini
                                           ↓
                                Cloudflare Pages Function
                                (functions/api/gemini.js)
                                           ↓
                                Gemini 2.0 Flash (GEMINI_API_KEY en Cloudflare Env Vars)
                                Fallback chain: 2.0-flash → 2.0-flash-lite → 1.5-flash → 1.5-flash-8b
```

### Archivos clave del bot
| Archivo | Rol |
|---|---|
| `js/header.js` | UI + lógica cliente + system prompt (`_pgBuildPrompt`) |
| `functions/api/gemini.js` | Proxy Cloudflare — guarda la API key |
| Cloudflare Env Vars | `GEMINI_API_KEY` — JAMÁS en código fuente |

### System prompt — precios en USD (NO COP)
- Corona: desde $12 USD | Express +$8 USD
- Guía quirúrgica: desde $65 USD
- Férula oclusal: desde $18 USD
- Full Arch: desde $80 USD
- WA correcto: 573219581949 (NUNCA el de PRODIGY)

### Manejo de errores (4 casos — implementado)
```javascript
// Caso 1: Rate limit (429)         → "Muchas consultas — espera un momento"
// Caso 2: API key no configurada   → "Fuera de línea. WhatsApp 573219581949"
// Caso 3: Otro error               → detalle + WhatsApp
// Caso 4 (catch red)               → "Sin conexión. WhatsApp"
```

### Causa más común del bot roto
`GEMINI_API_KEY` no configurada en Cloudflare Pages → Settings → Environment Variables.
**Solución:** agregar la variable y redesplegar (Cloudflare → Deployments → Retry deployment).

### Checklist de verificación del bot
- [ ] `GEMINI_API_KEY` en Cloudflare Env Vars
- [ ] `functions/api/gemini.js` existe en el repo
- [ ] WA en system prompt y errores: **573219581949** (NO 573212816716)
- [ ] Precios en USD en system prompt
- [ ] 4 casos de error en `_pgSendMsg`
- [ ] Rate limit 5 req/min en el proxy
- [ ] `system_instruction` enviada en cada request (separada de `contents`)

## 6. SISTEMA DE ARTÍCULOS — ESTÁNDAR CIENTÍFICO OBLIGATORIO (ARTÍCULOS IA)

### Regla absoluta
**JAMÁS inventar, alucinar ni parafrasear sin cita verificable.**
Cada afirmación clínica o estadística DEBE tener referencia real con DOI verificable en PubMed/ScienceDirect.
Temperatura Gemini: 0.15 (mínima alucinación).

### Journals aceptados (únicos válidos como fuente)
| Journal | Especialidad | Base de datos |
|---|---|---|
| Periodontology 2000 | Periodoncia, implantología | PubMed / ScienceDirect |
| Journal of Dental Research (JDR) | Investigación multidisciplinaria | PubMed / ScienceDirect |
| Journal of Clinical Periodontology | Periodoncia clínica, implantes | PubMed / ScienceDirect |
| Journal of Dentistry | Materiales, odontología digital | ScienceDirect |
| Dental Materials | Resinas, cerámicas, metales | ScienceDirect |
| Journal of Prosthetic Dentistry (JPD) | Rehabilitación oral, prótesis | ScienceDirect |
| Am. Journal of Orthodontics (AJODO) | Ortodoncia | ScienceDirect |
| Journal of Endodontics | Endodoncia, pulpa dental | ScienceDirect |
| Clinical Oral Implants Research (COIR) | Implantología | PubMed / ScienceDirect |
| International Journal of Oral Surgery (IJOS) | Cirugía oral | PubMed |
| JADA (J. American Dental Association) | Práctica clínica general | jada.ada.org |
| Cochrane Oral Health | Revisiones sistemáticas | cochrane.org |
| SciELO Odontología | Estudios en español/portugués | scielo.org |

### Plataformas para buscar DOIs reales
- **PubMed / NCBI** — pubmed.ncbi.nlm.nih.gov
- **ScienceDirect (Elsevier)** — sciencedirect.com
- **JADA** — jada.ada.org
- **SciELO** — scielo.org

### Fuentes NO permitidas
- Wikipedia (solo datos generales no clínicos)
- Blogs, sitios comerciales de fabricantes
- GPT/Gemini sin cita verificable
- Artículos sin DOI o revistas no indexadas

### Reglas de construcción del artículo
1. Mínimo 5 secciones (h2)
2. Mínimo 4 referencias con DOI real — verificadas antes de incluir
3. Tablas DEBEN tener columna "Fuente/DOI"
4. Estadísticas numéricas → cita obligatoria
5. El prompt a Gemini debe listar los journals explícitamente y prohibir inventar DOIs

### Cómo se generan los artículos (pipeline)
- Script: `scripts/gen-articulo-ac.js`
- Trigger: GitHub Actions `.github/workflows/journal-cron.yml`, lunes y miércoles 9 AM Bogotá (14:00 UTC)
- Motor: Gemini 2.0 Flash via `GEMINI_API_KEY` (GitHub Secret)
- Salida: prepende objeto a `articles-ac.js` → array `ARTICLES_AC`
- Auto-actualiza: `sitemap.xml` con nueva URL `/blog/[slug]`
- Social copy: `marketing-social-ac.txt` → GitHub Artifact privado (30 días)
- Artículos separados de PRODIGY — temática: CAD/CAM, diseño digital, guías quirúrgicas, flujos de trabajo freelance

### Formato de bloque de contenido
`article.html` acepta AMBOS formatos vía `renderContent()`:
```javascript
// Legacy (manual): { tipo, texto, cabeceras, filas }
// Nuevo (auto-journal): { t, c, headers, rows }
// Normalización: tp = b.t || b.tipo; txt = b.c ?? b.texto
```

### Variables de entorno requeridas
- **Cloudflare Pages** → `GEMINI_API_KEY` (chatbot en producción)
- **GitHub Secrets** → `GEMINI_API_KEY` (cron de artículos)

## 6. REPORTE (al terminar tarea)
```
CAMBIOS: [archivo] → [qué] (línea X)
VERIFICADO: [grep] → [resultado]
PENDIENTE: [acción] → solo si hay algo
```
