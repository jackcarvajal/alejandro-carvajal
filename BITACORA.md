# BITÁCORA — Alejandro CAD/CAM

Registro de cambios del repo `alejandro-carvajal-site` (alejandrocadcam.com).
Comparte BD Supabase (`zgihrwqfyvgyapbwzkvw`) con PRODIGY, separados por columna `negocio`.

---

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
