# MAP — Alejandro CAD/CAM Arquitectura de Referencia
> Para uso interno de Claude. Leer antes de editar archivos grandes.
> Última actualización: 2026-05-24

---

## CONSTANTES GLOBALES

```
SUPABASE_URL  = 'https://zgihrwqfyvgyapbwzkvw.supabase.co'  (mismo que PRODIGY)
SW_VERSION    = 'alejandro-v10'   (sw.js línea 2)
FOOTER_VER    = 'v=20260523'      (footer.js?v=20260523)
WA_ALEJANDRO  = '573219581949'    — ÚNICO válido, nunca usar el de PRODIGY
DOMINIO       = 'alejandrocadcam.pages.dev'
ADMIN_EMAIL   = 'jackalejandroc@gmail.com'
GEMINI_PROXY  = '/api/gemini'     (Cloudflare Pages Function)
```

---

## JS GLOBALES

### js/header.js
| Función / Sección | Línea |
|---|---|
| Mini-login topbar | ~505 |
| `_SURL` Supabase URL | 508 |
| Chatbot `_pgHistory` | 621 |
| `_pgAddMsg()` — render mensaje | 661 |
| `_pgSendMsg()` — enviar al proxy | ~675 |
| Manejo errores bot (4 casos) | ~697-712 |
| WA fallback chatbot | 703-706-712 |

### js/footer.js
| Función / Sección | Línea |
|---|---|
| Footer HTML completo | ~1 |
| Cookie consent banner | ~final |

### sw.js
| Item | Valor |
|---|---|
| Cache version | `alejandro-v10` (línea 2) |
| PRECACHE array | línea 5 |
| NEVER_CACHE array | línea 28 |

---

## PÁGINAS PÚBLICAS

### index.html
| Sección | Línea |
|---|---|
| Hero principal | ~116 (`<main id="main-content">`) |
| Portafolio dinámico | ~331 (fetch Supabase `casos_portafolio`) |

### diseno-remoto.html
| Sección | Línea |
|---|---|
| `<main id="main-content">` | 126 |
| Fetch portafolio | ~815 |

### flujo-diseno.html — ⚠️ INTOCABLE: calcularTotal(), STATE
| Función | Línea |
|---|---|
| `<main id="main-content">` | 362 |
| `STATE` objeto global | ~900 |
| `calcularTotal()` | 1463 |
| Insert `pedidos` en Supabase | 1693 |

### blog.html
| Sección | Línea |
|---|---|
| `<main id="main-content">` | 413 |
| `renderAll(arts)` | ~renderAll |
| `filterArticles()` | ~filterArticles |
| Lead insert `leads_doctores` | 556 |

### article.html
| Sección | Línea |
|---|---|
| `<main id="main-content">` | 175 |
| `init()` — carga artículo por ?id= | ~init |
| `renderContent()` — normaliza t/tipo | ~renderContent |

### articles-ac.js — Base de artículos
| Item | Valor |
|---|---|
| `ARTICLES_AC` array | línea 9 |
| `getArticleAC(id)` | línea 138 |
| `getRecientesAC()` | línea 143 |
| `getRelacionadosAC()` | línea 147 |
| `CATEGORY_COVERS_AC` | línea 155 |
| `getArticleCoverAC()` | línea 165 |

### sobre-mi.html — Perfil profesional personal
| Sección | Línea aprox |
|---|---|
| `<main id="main-content">` | ~333 |
| Stats animados (10+, 1000+, 20+, 24h) | ~361 |
| Historia + países + soporte 3Shape | ~399 |
| Arsenal técnico (6 cards con barras) | ~450 |
| Timeline 2014→2026 (5 hitos) | ~509 |
| Servicios sin precios (9 cards) | ~565 |
| Países clientes (14 pills) | ~614 |
| SEO: Person schema, canonical /sobre-mi | línea 22 |
| Footer: link "Sobre Alejandro" → /sobre-mi | footer.js línea 68 |

### calculadora-diseno.html
| Sección | Línea |
|---|---|
| `<main id="main-content">` | 116 |

### portafolio.html
| Función | Línea |
|---|---|
| `<main id="main-content">` | 506 |
| Fetch `casos_portafolio` Supabase | ~784 |

### guias-quirurgicas.html
| Sección | Línea |
|---|---|
| `<main id="main-content">` | 222 |

### envia-tu-scanner.html
| Sección | Línea |
|---|---|
| `<main id="main-content">` | 302 |
| Upload bucket `scanner-uploads` | 804 |
| Insert `solicitudes_scanner` | 816 |

---

## PORTAL /app/

### app/admin-panel.html
| Función | Línea |
|---|---|
| `showTab()` — tabs pedidos/portafolio | 381 |
| `loadPedidos()` | 421 |
| `cargarPortafolio()` | ~390 |
| `calcularTotal()` llamada | 463 |

### app/client-panel.html
| Función | Línea |
|---|---|
| Fetch `pedidos` (negocio=alejandrocadcam) | 465 |
| Aprobar diseño → `pedidos` update | 587 |
| Subir comprobante pago | 703 |

### app/login.html
| Función | Línea |
|---|---|
| Auth Supabase | ~login |

---

## SUPABASE (compartida con PRODIGY)

### Tablas usadas por Alejandro
| Tabla | Uso |
|---|---|
| `casos_portafolio` | Portafolio público (index, portafolio, caso, diseno-remoto) |
| `pedidos` | Pedidos de flujo-diseno (filtro: `negocio='alejandrocadcam'`) |
| `leads_doctores` | Leads desde blog.html |
| `solicitudes_scanner` | STL enviados desde envia-tu-scanner.html |

### Buckets Storage
| Bucket | Visibilidad | Uso |
|---|---|---|
| `portafolio` | Public | Imágenes casos portafolio |
| `scanner-uploads` | Private | STL subidos por doctores |
| `casos` | Private | Archivos de pedidos |

---

## ARTÍCULOS — PIPELINE AUTOMÁTICO

### scripts/gen-articulo-ac.js
| Item | Valor |
|---|---|
| `TOPIC_POOL` | 28 temas (línea 27) |
| `pickTopics()` | Aleatorio, evita últimos 6 slugs |
| `buildPrompt()` | Prompt científico con journals indexados |
| `callGemini()` | temperature: 0.15, gemini-2.0-flash |
| Salida | prepende a `articles-ac.js` |
| Sitemap | auto-actualiza `sitemap.xml` |

### .github/workflows/journal-cron.yml
| Item | Valor |
|---|---|
| Cron | Lunes + miércoles 14:00 UTC (9 AM Bogotá) |
| Secret requerido | `GEMINI_API_KEY` en GitHub Secrets |
| Artifact | `marketing-social-ac.txt` (30 días) |

---

## BOT IA

### Proxy
| Item | Valor |
|---|---|
| Endpoint | `/api/gemini` (Cloudflare Pages Function) |
| Env var requerida | `GEMINI_API_KEY` en Cloudflare Pages |
| Fallback chain | gemini-2.0-flash → flash-lite → 1.5-flash → 1.5-flash-8b |

### 4 casos de error (header.js ~697-712)
| Caso | Trigger | Respuesta |
|---|---|---|
| 1 | `candidates[0].content` OK | Muestra respuesta |
| 2 | `429` / `solicitudes` | "Muchas consultas..." |
| 3 | `configurado` | "Fuera de línea. WA 573219581949" |
| 4 | catch red | "Sin conexión. WA 573219581949" |

---

## SEO / ROBOTS

### robots.txt
- `*` Allow /  + Disallow rutas privadas
- GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended → Allow (buscadores IA)
- ClaudeBot, CCBot, Bytespider, FacebookBot → Disallow (solo entrenamiento)

### Páginas públicas (index, follow)
index, diseno-remoto, guias-quirurgicas, calculadora-diseno, blog, article, portafolio, envia-tu-scanner, soporte, terminos-y-legal, flujo-diseno, 404, cursos

### Páginas privadas (noindex)
/app/*, caso.html, seguimiento-caso.html, recibo-caso.html, recibo-demo.html, offline.html
