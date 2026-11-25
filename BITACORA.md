# BITÁCORA — Alejandro CAD/CAM

Registro de cambios del repo `alejandro-carvajal-site` (alejandrocadcam.com).
Comparte BD Supabase (`zgihrwqfyvgyapbwzkvw`) con PRODIGY, separados por columna `negocio`.

---

## 2026-11-24 (i) — Encía por diente, dólares en un solo criterio, bot en pesos para Colombia y CSP de YouTube (paridad)

- 💡 Encía SOLO por diente (Alejandro: «es mejor cobrar por diente»): $10.000 / US$3 cada diente, sin «encía total» ni tope (quitada del flujo, del SQL pendiente y del protocolo). Full Arch 12 u + barra + encía en los 12 = $730.000.
- Dólares en un solo criterio: guía de 1 implante US$60 (decisión de Alejandro 24-nov: catálogo guia_1, flujo de Alejandro, calculadoras y bot), DSD US$80, supraestructura US$45, Maryland US$40, guía compleja US$90 (los del protocolo; las calculadoras de las dos webs decían cosas distintas entre sí) y pilar US$18 = 1,5 créditos (el protocolo decía 35). Alineadores no se tocó (su propio flujo).
- Chatbot: desde Colombia (request.cf.country = CO) functions/api/gemini.js agrega la tabla de diseño EN PESOS leída del catálogo (caché 5 min) y le pide responder en pesos; afuera sigue en dólares. Bot de Alejandro: texto en dólares al día (express US$10 desde 2 h, guía US$60, férula US$25, Full Arch US$12/unidad); header.js ?v=20261124c.
- CSP (publicado aparte, ya en vivo): www.youtube.com permitido en script-src de la segunda CSP de las dos webs; la medición de video de GA4 carga iframe_api y quedaba bloqueada (reporte R-21 en /escaner-domicilio). Verificado en vivo: sin bloqueos, el video y sus botones funcionan.
- ODO_CFG.v 20261124c · odontograma-flujo ?v=20261124e. Se publica con el SQL (vigilante).

## 2026-11-24 (h) — Calculadora de diseño con los pesos del catálogo y modelos por arcada de trabajo (paridad)

- calculadora-diseno: los pesos salen del catálogo, los mismos del flujo (antes dólar × 3.400: una corona salía $40.800 y en el flujo $30.000). Lo que se cobra por unidad en pesos se cobra por unidad (encerado/mockup, Full Arch, modelo por arcada); lo que no está en el catálogo usa US$ × 2.500 (la proporción de la corona). El dólar de lo que el catálogo tiene en dólares también sale de ahí (unidad cementada US$12 pareja: puente 3 pzas US$36, onlay, endocrown y provisional US$12; Full Arch US$12 por unidad; modelo US$4 por arcada). Express $20.000 / US$10 como el flujo. Desde Colombia arranca en pesos (ProdigyGeo/ACGeo). La cotización guardada lleva la moneda real (antes siempre «USD»). Probado local: corona ×2 $60.000 · Full Arch ×12 $360.000 / US$144 · mockup ×6 $90.000 · express +$20.000 · sin errores.
- Odontograma: «Arcadas: superior e inferior / solo la arcada de trabajo» en modelos (solo la de trabajo: 1 corona sup. + modelo + troquel = $57.500); la encía total dice cuántos dientes cubre. ODO_CFG.v 20261124b, odontograma-flujo ?v=20261124d.
- docs/PROTOCOLO-WHATSAPP.md (PRODIGY): tabla de diseño en pesos para responder por WhatsApp; tabla en USD con 24–48 h y Full Arch por unidad; tiempos nuevos.
- Se publica junto con el SQL de Full Arch/encía/modelos (vigilante: publica al detectar el catálogo nuevo).

## 2026-11-24 (g) — Full Arch por unidad, encía y modelos con precio (paridad con PRODIGY)

- 💡 Alejandro (24-nov): Full Arch por unidad; precio para diseñar encía (por unidad o total) y para modelos con y sin implantes/análogos. Valores elegidos (cambiables en el catálogo): Full Arch $30.000/u (US$12 = 1 crédito; 15 u = los US$180 de antes) · encía $10.000/u (US$3) con tope «encía total» $100.000 por arcada (US$25) · modelo sin implantes $20.000/arcada (US$4, como el «desde $4» de /en/ de Alejandro) · con implantes (análogos o encía removible) $30.000/arcada (US$8) · troquel $7.500/pieza (US$2, ref. Sindekar $7.500).
- odontograma.html (ambos): bloque «Encía · Sin encía / Con encía» por diente (coronas, pónticos, provisionales y encerados, igual que «Barra interna»); la orden lleva encia:true; PRECIO_DIS de la vista sola = tabla aprobada; texto del modelo «el diseño del modelo se suma al total… la impresión va aparte». ODO_CFG.v 20261124a.
- js/odontograma-flujo.js (?v=20261124c): diente con barra interna o «Subestructura (barra)» = Full Arch por unidad; barra interna una vez por arcada (y pilar/segmento de barra comparten esa barra: antes podían cobrarse dos veces); encía por diente con tope por arcada; modelos superior + inferior (con implantes en la arcada que los tenga y si se pidieron análogos o encía removible) + troqueles por pieza preparada. Antes el modelo salía «a cotizar».
- flujo-diseno (ambos): tarjeta nueva «Modelos» (4 tarjetas, llena la fila) y chips de encía en Implantología; archivos requeridos para encía y modelos.
- Probado local (catálogo nuevo simulado): Full Arch 12 u + barra interna + encía = $710.000 (US$319) · puente 3 u con encía en el póntico $100.000 · corona s/implante + corona + modelos + 1 troquel $137.500 (US$56) · solo modelos $40.000 (US$8) · segmento + pilar de barra + 1 u Full Arch misma arcada $280.000. Sin errores.
- 🟡 sql/catalogo-fullarch-encia-modelos-2026.sql (repo PRODIGY): se publica cuando esté corrido (con el catálogo viejo, all_on_4 por unidad saldría a $150.000/US$180 cada una).


## 2026-11-24 (f) — Pesos de Colombia con la tabla aprobada y fuera «desde 15 min» en todo el sitio

- 💡 Tabla aprobada por Alejandro (solo diseño, público colombiano): pieza cementada $30.000 · con conexión a implante $50.000 · pilar personalizado $25.000 · provisional $20.000 · encerado/mockup por diente $15.000 · barra $250.000. En dólares no cambia nada (exterior).
- flujo-diseno: en Colombia los pesos salen del catálogo (window._catCOP con TODO el catálogo de diseño, también provisional, sonrisa_3d y guías), no del dólar × 4.000 (queda solo de respaldo). ODO_CFG: copId (sonrisa 3D → sonrisa_3d, cáscara de huevo → provisional), copPorDiente (encerados y mockup por diente en pesos; en dólares sigue por caso) y copGuias.
- js/odontograma-flujo.js (igual en PRODIGY): corona sobre implante (pilar personalizado, atornillada o pilar de aditamiento) = corona_ator del catálogo en pesos; en dólares la de pilar personalizado sigue siendo corona + pilar (US$30) y la atornillada US$18. Probado local: pilar $50.000/US$30 · 2 carillas $60.000 · 4 encerados $60.000/US$50 · atornillada $50.000/US$18 · provisional $20.000 (con el SQL del catálogo; antes del SQL usa los pesos viejos).
- 🟡 SQL pendiente de correr (PRODIGY repo): sql/catalogo-precios-colombia-2026.sql.
- «Desde 15 min» fuera en 17 archivos (index, diseno-remoto, calculadora, preguntas, términos, seguimiento, sobre-mi, envia-tu-scanner, soporte, links, reseñas, buscar-indice, 4 páginas /en/, chatbot de header.js y correo emailnotif.js): normal 24 a 48 h hábiles; express desde 2 h con costo adicional. Hero de diseno-remoto: «tu laboratorio a un clic de distancia». Soporte y calculadora: «2 revisiones incluidas» (decía 1).
- ?v= header.js 20261124b · emailnotif.js 20261124a · odontograma-flujo.js 20261124b · SW alejandro-v19.

## 2026-11-24 (e) — Flujo: tiempos normal/express, formatos y cuenta dentro del flujo

- Tiempo de entrega (pedido de Alejandro): fuera «desde 15 min». Dos tarjetas: NORMAL · incluido · 24 a 48 h hábiles (según el caso y la cola) y EXPRESS · con precio adicional · desde 2 h hábiles. Elegir express marca la casilla express-cad que ya cobra calcularTotal() (la casilla vieja de la sección 1 queda oculta); arranca en normal. Resumen, confirmación y WhatsApp con los textos nuevos.
- «¿STL, PLY u OBJ? Cuál enviar» junto a la zona de subida: PLY el mejor (forma + color), STL el universal, OBJ con sus texturas en ZIP; arcadas y mordida alineadas en oclusión.
- FAQ del flujo (JSON-LD) con los tiempos nuevos. El «desde 15 min» sigue en ~17 páginas del sitio: pendiente de decisión.
- Cuenta dentro del flujo (pedido de Alejandro): sin sesión, recuadro «Último paso: tu cuenta» con «Soy nuevo» (correo + contraseña → signUp, queda conectado) y «Ya tengo cuenta» (entra; «¿Olvidaste tu contraseña?»). Con sesión: «Tu cuenta» con sus datos (doctores_perfil), «Cambiar mis datos», «No soy yo» y «Guardar estos datos en mi perfil» (upsert solo de nombre, WhatsApp, ciudad y especialidad al guardar el pedido). Enviar exige cuenta; si el correo queda por confirmar, deja enviar igual. El enlace de arriba abre «Ya tengo cuenta».

## 2026-11-24 (d) — Flujo de diseño: lo que vio Alejandro en vivo

- Odontograma (js/odontograma-flujo.js, igual en ambas webs): una corona (u otra pieza) marcada sobre «Pilar personalizado» cobraba solo la corona; ahora suma el pilar (catálogo pilar_pers: US$18 / $25.000). «Post y core» pasa a «a cotizar: perno-muñón». El nombre del servicio queda corto («Corona anatómica en zirconio + Pilar personalizado · a cotizar: modelo impreso»); el detalle por diente (material, proceso, implante) va a las notas del pedido con window._odoDetalle().
- Tiempos alineados con el estimador y la promesa; «Express 24h» → «Express 2 a 4 horas hábiles» (lo que ya calculaba).
- Tarjetas de entrega: «Simple · desde 15 min*» y «Medio y complejo · 24 a 48 h hábiles» + nota (lo del FAQ); antes 48/72 h.
- Precios en pesos para Colombia (solo lo que se muestra): país por /api/geo (ACGeo) y zona horaria mientras llega; selector «Pesos / Dólares» en el resumen. Misma tasa que la calculadora y el cupón: US$1 = $4.000 COP. calcularTotal() no se toca (los montos se repintan con un MutationObserver) y el pedido sigue en USD; la confirmación, el éxito y el WhatsApp muestran el equivalente en pesos. Nota bajo el total: «Equivale a US$X · en pesos por Nequi, Bancolombia o Daviplata».
- Cabecera: vuelve la identidad de antes (ícono CAD + «Alejandro Carvajal»), centrada, con «Envía tu caso de diseño CAD», los pasos y los enlaces.
- Resumen: acompaña al bajar por debajo del menú fijo (top = alto del menú) y debajo lleva «Así trabaja el diseño» + WhatsApp.
- Archivos: un solo bloque para subir (arrastrar, ZIP o enlace en un desplegable), primero lo que pide el caso y al final «Confirma qué incluiste»; fuera el recuadro «Subir archivos al portal» y el aviso de nombres duplicado. Mismos ids y funciones (validarChecks, subirZIPMaestro, validarLink).

## 2026-11-24 (c) — Mejoras 2 y 4 aprobadas: flujo de diseño sin iniciar sesión y foto real en corona-cad

- flujo-diseno: ya no exige sesión (antes, al tocar «Enviar mi caso» salía el ingreso). Cabecera directa («Envía tu caso de diseño CAD», 5 pasos, preguntas, orden en PDF, «¿Ya tienes cuenta? Entra», horario 24/7). Orden nuevo: 1 diseño · 2 entrega · 3 archivos · 4 tus datos · 5 confirmar y pagar. Fuera del tope: banner de corte, aviso 24/7 suelto y las franjas de FAQ y orden en papel (pasan a la cabecera).
- Sin sesión aparece «Último paso: tu cuenta» junto al pago: el correo (sincronizado con el de «Tus datos») es obligatorio; al guardar el pedido, /api/cuenta-implicita (origen pedido, nuevo) crea la cuenta, deja el pedido a su nombre (user_id) y manda la clave temporal solo a ese correo. El cuadro de éxito lo dice. Con sesión no cambia nada.
- /api/cuenta-implicita: origen pedido = pedido de ese código, de hace < 15 min y con ESE correo; una cuenta por código; si la cuenta ya existe no se toca (el panel encuentra el pedido por correo: política pedidos_select_cliente). Simulado con red falsa: correo igual → crea + vincula; distinto → 403; existente → {existe}; escáner igual que antes.
- Google no se ofrece en el último paso: la redirección perdería el caso armado (archivos, odontograma). Va arriba, antes de llenar («¿Ya tienes cuenta? Entra»).
- corona-cad: foto real de diseño en Exocad bajo las cifras del hero.

## 2026-11-24 (b) — Letra legible en el celular y menos efectos (mejora 6, aprobada)

- Capa compartida al final de js/header.js (id legible-css), solo ≤ 700 px: texto de lectura ≥ 15 px y datos secundarios ≥ 13 px. Cubre los style="font-size:.6–.86rem / 9–13px" en línea y las clases chicas que se repiten (faq-body, step-desc, product-desc, section-subtitle, pie, etc.). En todas las anchuras: sin text-shadow en textos de secciones, sin sombras en tarjetas/botones de secciones (salvo al pasar el mouse) y sin rótulos encima de un título (.label con raya, .sec-tag, .eyebrow, .section-label solo si el título va justo debajo). El hero no se toca.
- Medido en 24 páginas (texto < 14 px en el celular, antes → después): portada PRODIGY 66 → 22 %, impresión 3D 80 → 21 %, flujo de diseño 80 → 19 %, corona-cad de Alejandro 82 → 18 %, calculadora de Alejandro 91 → 61 % (sus tarjetas quedan en 13 px a propósito). Sin desborde horizontal en ninguna.
- ?v=20261124a en header.js.

## 2026-11-24 — Mejoras aprobadas del informe visual (paridad)

- app/login: pestañas Operador/Admin ocultas para el público; «Acceso del equipo», ?equipo=1 o redirect interno las muestra.
- diseno-remoto: «0 contratos · membresías» → «Sin contratos ni membresías»; el contador «casos activos hoy —» se veía vacío porque el div tenía dos atributos style (el display:none se ignoraba).
- portafolio: la Ñ de «DISEÑOS» ya no se corta.
- El SQL de textos del portafolio (repo PRODIGY, sql/portafolio-textos-2026.sql) corrige también lo que se ve aquí (casos negocio = ambos).

## 2026-11-23 (g) — Auditoría visual: portafolio de portada en 3 columnas en el celular y dato repetido

- Portada: las tarjetas del portafolio quedaban en 3 columnas de ~100 px en el celular (texto palabra por palabra): el estilo en línea repeat(3,1fr) anulaba la regla @media 1fr → quitado del atributo.
- corona-cad y diseno-full-arch: el tercer dato del hero repetía «STL · Listo para fresar» → «2 · Revisiones incluidas».
- Pendiente de decisión (ver informe): cifras «200+ doctores activos / 24 h entrega garantizada / 98 % satisfacción» del login; errores de texto en casos del portafolio («Cronas», «protipo par aluego», «All for X»).

## 2026-11-23 (f) — PageSpeed móvil: accesibilidad (contraste y orden de títulos) + aviso «English»

- Pie: títulos de columna h4 → h2 (Lighthouse: salto de nivel) con los estilos globales de h2 anulados; línea «International · English» y texto del aviso de cookies #64748b → #94a3b8 (4,3:1 → 7,9:1).
- Portada: quitado el preconnect a cdnjs (no se usa al cargar; Lighthouse: más de 4 preconnect).
- Portada: etiqueta «Estética» de las tarjetas del portafolio #D946A6 → #e46abb (3,99:1 → 5,3:1 sobre la tarjeta).
- geo-detect: el aviso «This site is also available in English» se encogía a media pantalla (left:50% sin ancho) y el texto quedaba en columna angosta → width:max-content; la ✕ más grande y legible.
- ?v=20261123e en footer.js (55 páginas) y geo-detect.js. Verificado con axe sobre las páginas en vivo + archivos locales: 0 fallos de orden de títulos y de contraste en el pie.

## 2026-11-23 (e) — Avisos del portal que nunca salían (paridad)

- 🔴 client-panel (comprobante, diseño aprobado, cambios) llamaba a js/callmebot.js con apikey «PENDIENTE» → ningún aviso llegaba. Ahora por /api/notify-staff. notif_nuevoCaso queda vacío (flujo-diseno ya avisa por notify-staff; evita duplicado).
- notify-staff: sin WhatsApp del cliente no manda «s/n» ni wa.me/ vacío.
- Diagnóstico: los 14 wa_click del 21-nov por /wa/instagram y /wa/en/instagram vienen de EE. UU. con el mismo navegador (iPhone iOS 17.0 / Android 10 K) en ráfaga → revisores automáticos de Meta al cambiar el enlace de la bio, no personas. ≈184 visitas humanas en 30 días, 11 desde Facebook, 0 de anuncios.

## 2026-11-23 (d) — Barrido de precios (paridad)

- ✓ calculadora-diseno (USD) = flujo de diseño en todo lo comparable (corona, carilla, puente 3 = 3×12, pilar, alineadores, guía, mock-up, barra, full arch).
- Nada que corregir aquí; los arreglos de guías y fresado son del flujo de PRODIGY.

## 2026-11-23 (c) — Panel: bucket «disenos-cad» inexistente; pagos y permisos (paridad)

- 🔴 El bucket **disenos-cad no existe**: el STL final que sube Alejandro (admin-panel), la descarga del cliente, las fotos de feedback, el comprobante y las bibliotecas del cliente fallaban siempre. Ahora: STL → dental-cases/<pedido>/vN.stl (el cliente lo lee por política es_dueno_pedido; límite 20 MB), comprobantes y feedback → prodigy-files/<carpeta>/<pedido>/…, bibliotecas → pedidos-archivos/<uid>/bibliotecas/…. Probado en transacción revertida (admin sube, cliente ve su STL, cliente sube feedback y biblioteca).
- 🟡 PayPal (captura y webhook): 'paypal' en pago_confirmado_por (uuid) hacía fallar la confirmación → nota_confirmacion_pago.
- ✅ (corrido el 23-nov) El SQL del repo PRODIGY sql/pedidos-avisos-y-permisos-cliente-2026.sql arregla también aquí: cambios de etapa/pago que fallaban, webhooks que no confirmaban y la lista blanca de lo que el cliente puede tocar (incluye aprobar diseño, pedir cambios +1, fabricación y comprobante, que es lo que hace este panel).

## 2026-11-23 (b) — Auditoría del flujo de diseño y «Envía tu escáner» (paridad con PRODIGY)

- ⚠️ Caché: las URL ?v=20261123a se pidieron antes del despliegue (prueba local) y el CDN guardó la versión vieja → subidas a ?v=20261123c (stl-multi-viewer de PRODIGY a b). Verificado en vivo descomprimiendo la variante br. Recorrido final en vivo de todos los flujos: todos ✓, 0 errores.

- 🔴 Subidas de archivos caídas desde el 18-nov en las DOS webs (base compartida): sql/storage-pedido-existe-2026.sql (repo PRODIGY) ✅ corrido el 23-nov y verificado.
- 🔴 flujo-diseno: «Archivos requeridos» y ZIP del caso iban a disenos-cad, un bucket que NO existe → fallaban siempre y el pedido no se podía enviar. Ahora FlujoUploader.subirUno() → pedidos-archivos, stl_url y pedido_archivos; validarChecks y submitOrden cuentan esos archivos; el link no se pierde.
- 🟡 auth-guard: con la sesión iniciada lanzaba TypeError (document.body aún no existe en flujo-diseno) y la página quedaba oculta 4 s → ?v= 20261123a en las 12 páginas.
- 🟡 Visores 3D (stl-multi-viewer, visor-universal): loaders de three sin import map → jsDelivr /+esm.
- 🟡 Envía tu escáner: solo STL/PLY/ZIP (el bucket rechaza OBJ/DICOM).
- Verificado con el mismo navegador automático (escrituras atrapadas, nada enviado) y con inserción revertida en la base.

## 2026-11-23 — Todas las páginas públicas con su imagen para compartir nueva

- 🟡 tools/og-generar.mjs: +10 imágenes (academia ×4 páginas y sobre-mí con la foto real de Alejandro dictando una conferencia; portafolio, seguimiento, blog/article, preguntas, carillas, cotizador, soporte, en/faq). El cotizador en español mostraba «Design Price Calculator» en inglés y el host alejandrocadcam.pages.dev. Ya no queda ninguna página pública con imagen del estilo viejo.
- 🟡 12 páginas sin twitter:card/twitter:image u og:image:width/height (X mostraba la tarjeta chica): --aplicar los agrega si faltan (--solo-metas aplica sin regenerar). JSON-LD de carillas, cursos y 4 páginas /en/ y el respaldo de article.html apuntaban a imágenes viejas → corregido.
- tools/og-generar.mjs: fotos locales («local:»), --aplicar tolera atributos antes de property (article.html), object-position por foto.

## 2026-11-22 (i) — Imágenes para compartir con fotos reales; 6 testimonios más en reseñas

- 🔴→✅ 16 páginas en español (corona-cad, alineadores, full arch, endodoncia, provisional, términos, soporte…) compartían og-guias-quirurgicas.jpg: en WhatsApp salía «Guided Surgery from $65 USD · From 4h turnaround». El inicio y 4 páginas más usaban og-home.jpg en inglés con «From $25 USD»; diseño de sonrisa y estética de implantes, og-diseno-remoto.jpg con «24–48h · From $25 USD».
- 🟡 Nuevo tools/og-generar.mjs: 26 imágenes 1200×630 con capturas reales de exocad del portafolio (Supabase), acento dorado, sin precios ni tiempos; `--aplicar` cambia og:image y twitter:image en 35 páginas. cursos → og-academia.png, soporte → og-soporte.jpg.
- manifest.json: la captura de instalación de la app pasa a og-inicio.jpg; sw.js precarga og-inicio.jpg → CACHE alejandro-v18 (MAP.md al día).
- 🟡 reseñas: +6 testimonios confirmados (DentArt, Dr. Ricardo Silva, Dra. Claudia Vargas, Dra. Marcela Ríos, Dr. Esteban Cruz, Dra. Vanessa López), textos originales en español; la sección queda con los 15 confirmados.

## 2026-11-22 (h) — Reseñas con cifras reales, sin 50/50 en diseño, sin «maximum of 24 hours», CRON_SECRET

- 🟡 reseñas: fuera «48 reseñas verificadas» (en la página hay testimonios, no 48) y las cifras infladas (+200 casos/mes, 98 % recurrentes, 12 países, entrega 24 h) → 1.800 unidades de diseño al año, desde 15 min*, 20+ países, 10+ años. Sección nueva con los 9 testimonios confirmados de las landings (Restrepo, Gómez, Torres, Benavides, Arango, Morales, Mendoza, Gutiérrez, Henao). Fondos re-alternados.
- 🟡 Pago 50/50 fuera del diseño (100 % anticipado, sin repetir la regla): FAQ de alineadores, corona-cad, diseno-endodontico, diseno-full-arch, rehabilitacion-oral; carillas «Pagas al confirmar el caso»; HowTo de envia-tu-scanner y sobre-mi.
- 🟡 en/remote-design (texto + FAQ JSON-LD) y en/dental-cad-outsourcing-guide decían «within a maximum of 24 hours» → «from 15 minutes; conditions apply and every case is different».
- 🟡 Horario 8am–5pm (index, soporte ×3) en vez de 7pm; index: «Entrega estándar 24h*» → «Diseño desde 15 min*».
- 🟡 tools/audit.mjs sección 7: bloquea el 50/50, «maximum of 24 hours» y «refinamiento/entrega sin costo».
- ✅ CRON_SECRET creado (aleatorio, 64 hex) en GitHub Actions y en Cloudflare Pages (producción); las otras 9 variables intactas. Verificado con dry_run (no envía correos). El recordatorio diario sale solo a las 9 a. m.
- ✅ Auditoría en vivo (audit-live): 75 páginas, 0 problemas.
- Pendiente de decisión: los «24 h» por servicio (calculadora, FAQ de provisional/splint/endodoncia, links, menú) — ¿pasar todos a «desde 15 min*»?

## 2026-11-22 (g) — SQL de créditos corrido; términos sin entrega «sin costo»

- ✅ Regla revision_extra = 0,2 crédito ya en la base (verificado 22-nov): la 3.ª revisión pagada con créditos descuenta 0,2.
- 🟡 terminos-y-legal: «Entrega personal en Bogotá: sin costo adicional» → mensajería por app que solicita y paga el cliente.

## 2026-11-22 (f) — Sin «ajustes sin costo» ni envío gratis; años y cifras unificados

- 🟡 Textos de ajustes «sin costo» / «at no cost» → «2 revisiones incluidas en el precio» en alineadores, carillas, caso-endodontico-digital, corona-cad, diseno-endodontico, diseno-puente-implante, diseno-remoto, envia-tu-scanner, guias-quirurgicas (+ diccionario EN), rehabilitacion-oral, modelo-digital-diagnostico, terminos (FAQ de datos), i18n/en.json, js/emailnotif.js (correo: «última revisión incluida; después, 20 % de la unidad») y app/admin-panel (WhatsApp).
- 🟡 en/veneers: quitado el envío gratis (primer pedido y 12+ unidades); el estimador suma siempre el envío ($35) y el primer pedido conserva el 20 % de descuento. en/veneer-terms igual.
- 🟡 index: «5+ años de experiencia» → «10+» (como sobre-mí, cursos e «inicio técnico 2014»). sobre-mí: descripciones con «1.800 unidades de diseño al año».
- 🟡 tools/audit.mjs sección 7: además bloquea envío gratis, «una ronda de ajustes», «revisiones/ajustes … sin costo», «at no extra cost» y «máximo 24 horas».
- ?v= emailnotif 20261122a (admin-panel, client-panel, flujo-diseno).

## 2026-11-22 (e) — Tiempos «desde 15 min», revisión adicional solo si la piden, cifras reales

- 🟡 Alejandro (22-nov): NO decir «máximo 24 horas»; decir «desde 15 minutos*», aplican condiciones y restricciones, cada caso es diferente, empezando por lo simple (un modelo, un provisional o una unidad). Restaurado/reescrito en diseno-remoto (título «tu laboratorio a 15 minutos de distancia*», descripciones, cifra «15 min*», tarjeta, pie), index (meta, paso 2, cifra del hero), en/remote-design, en/implant-esthetics, en/smile-design, JSON-LD de flujo-diseno/seguimiento-caso/calculadora, /preguntas, /en/faq, términos (4 sitios; urgencias = prioridad y recargo según cupo, sin horas), asistente y /links (trust3). El pie ya no dice «abono 50 %».
- 🟡 Revisión adicional: solo si, después de recibir la segunda, piden más cambios (20 % de la unidad, 0,2 crédito); nada por adelantado; se avisa al pedir la 1.ª y la 2.ª. Términos, /preguntas, /en/faq, asistentes, sobre-mi, calculadora (fuera el interruptor → fila «2 revisiones · Incluidas») y app/client-panel (texto dinámico «revisión N de 2»; decía «sin costo»).
- 🟡 8 páginas de servicio decían «una ronda de ajustes (sin costo)» → 2 revisiones en el precio (caso-endodontico-digital, diseno-implante-digital, diseno-provisional, diseno-puente-implante, modelo-digital-diagnostico, protesis-removible-digital, splint-oclusal-cad, wax-up-digital).
- 🟡 Cifras reales (≈150 unidades de diseño al mes, ≈10 casos completos al mes): calculadora, diseno-remoto, index → 1.800 unidades de diseño al año; sobre-mi → 1.800 unidades/año y 120 casos completos/año (el contador acepta data-suffix).
- ?v= header 20261122e.

## 2026-11-22 (d) — Revisión adicional = 20 % · tiempos reales · valoración según el caso

- 🟡 Decisión de Alejandro (22-nov): tras las 2 revisiones incluidas, cada revisión cuesta el **20 %** del valor de la unidad (0,2 crédito en planes); antes 50 % / 0,5. Unificado en terminos-y-legal (2 secciones), /preguntas, /en/faq, asistente de la web, functions/api/asistente-soporte.js, app/client-panel (respaldo 0,2) y calculadora-diseno (la opción suma 20 % del diseño; se quitó el override revision_calc_ac, que no existe en config_precios; la etiqueta de urgencia mostraba $8 con precio $10 → usa el valor real).
- 🟡 sobre-mi decía «1 revisión incluida» → 2 + 20 % desde la tercera (visible y JSON-LD). Calculadora: FAQ de datos estructurados con 2 revisiones y tiempos de los términos.
- 🟡 «Desde 15 min» / «STL en 15 min» / «Urgencias en 2h» contradecían los términos (simple máximo 24 h, urgente 4-6 h): corregidos en diseno-remoto (título, descripciones, tarjeta, pie), index (meta y tarjeta), en/remote-design y JSON-LD de flujo-diseno. El pie de diseno-remoto además decía que el plazo cuenta «desde el pago del abono (50%)» → «desde que el caso está completo y pagado».
- 🟡 Valoración del caso: su valor depende del caso y del tipo de servicio (se confirma por WhatsApp antes de empezar) en /preguntas, /en/faq y los dos asistentes.
- 🟡 diseno-remoto: cifra «15min–48h» → «4–48h» según complejidad; seguimiento-caso JSON-LD con los tiempos de los términos.
- 🟡 tools/audit.mjs sección 7 CRÍTICA (igual que PRODIGY): nada gratis + revisión al 20 %.
- ✅ **SQL corrido (22-nov, verificado: revision_extra 0.20):** `sql/creditos-revision-20-2026.sql` (repo PRODIGY) — regla revision_extra 0,5 → 0,2 crédito.
- ?v= header 20261122d.

## 2026-11-22 (c) — Nada gratis

- ✅ Decisión de Alejandro (22-nov): ningún servicio es gratis, tampoco el primer caso; valoración del caso opcional y con costo; el trabajo empieza con el pago. Respuesta ampliada en /preguntas y /en/faq; fuera «First consultation free / you don't pay / First design free» (/en/, guía de outsourcing, costos), «Primera consulta gratis… no pagas» (blog), «Paga solo si te satisface… primer ajuste gratis» (reseñas), «es gratis / Sin riesgo» (diseno-remoto); «revisiones sin costo/free» → «incluidas».
- ✅ functions/api/asistente-soporte.js decía «1 ronda de revisiones» → 2 en 48 h, desde la tercera 50 %; nunca ofrecer gratis. Asistente de la web igual. ?v= header 20261122c.
- 💡 Se deja: «Clase de muestra gratis» de cursos (grabada, no usa tiempo). Horario de Alejandro sigue L-S 8-5 (el cambio del sábado fue para el laboratorio PRODIGY).

## 2026-11-22 (b) — Preguntas en inglés, pie sin enlaces rotos, menos «100 % anticipado»

- 🟡 Nueva https://alejandrocadcam.com/en/faq: 15 preguntas (qué enviar, numeración Universal/FDI, formatos, tiempos con zona horaria, precio, PayPal/Wise, planes de créditos, sin caso gratis, 2 revisiones, seguimiento, carillas para EE. UU., Academia en español). Par hreflang con /preguntas; selector ES/EN /preguntas ↔ /en/faq (/preguntas salió de paginasEn); enlace en el hub /en/; sitemap, _headers, og-en-faq.jpg.
- ✅ js/footer.js: 32 enlaces eran relativos («portafolio», «preguntas»…) → en /en/* y /blog/* daban 404 (/en/portafolio). Ahora absolutos; FAQ → /en/faq en rutas /en/. ?v= footer 20261122a en todas.
- ✅ Decisión de Alejandro (22-nov): no repetir «100 % anticipado» por todas partes. Fuera el cartel de /flujo-diseno, la coletilla del WhatsApp, la fila del odontograma; preguntas en tono informativo; el asistente lo menciona solo si preguntan.

## 2026-11-22 — Sin correo personal en el aviso de pago

- ✅ flujo-diseno (modal «Orden registrada»): ya no muestra el Gmail personal como cuenta Wise; dice transferencia Nequi/Daviplata/Bancolombia o Wise (USD) con datos por WhatsApp + referencia del caso.
- ✅ functions/api/cuenta-implicita.js: el correo «Tu portal está listo» responde a alejandro@alejandrocadcam.com (antes el Gmail personal).
- 💡 app/client-panel.html (con sesión) sigue mostrando el correo de Wise para transferir: es el dato real de cobro; cambiarlo solo si la cuenta Wise pasa al correo de la marca.

## 2026-11-21 (b) — Pago 100 % anticipado, asistente IA al día, código de pedido real

- ✅ Decisión de Alejandro (21-nov): 100 % anticipado para todos (diseño, fresado y modelos); se paga en la página (créditos) o por transferencia con comprobante por WhatsApp. Términos (general, diseño, fresado + JSON-LD de pagos y de tiempos), preguntas, flujo-diseno (JSON-LD y HowTo), diseno-remoto (sin Stripe), calculadora-diseno.
- ✅ Asistente IA (header.js): tiempos de los términos, horario L-S 8-5 + 24/7, 2 revisiones (antes «1»), pagos, planes de créditos, Academia (antes /cursos 1 a 1), correo oficial alejandro@ (antes un hotmail). ?v= header.js → 20261121a.
- ✅ /seguimiento-caso: el ejemplo de código era de PRODIGY («PROD-2026-XXXX»); ahora CAD-XXXXXXXXXX, el que genera flujo-diseno.
- ✅ odontograma.html: decía «PRODIGY Lab» en el encabezado de impresión y en la marca → Alejandro CAD/CAM; pago 100 % anticipado (ODO_CFG.v=20261121a).
- ✅ (22-nov: CRON_SECRET creado igual en GitHub y Cloudflare Pages, verificado en dry_run) GitHub Actions «Recordatorio créditos (congelamiento)» fallaba desde el 20-nov: falta el secret CRON_SECRET en GitHub y también en Cloudflare Pages (alejandrocadcam). Hay que crearlo igual en los dos.

## 2026-11-21 (a) — Preguntas frecuentes al día con lo nuevo

- 🟡 preguntas.html: tiempos de los términos (simple ≤24 h, urgente 4–6 h, medio 24–48 h, complejo por caso, cuenta con caso completo y pagado, L–S 8–5), revisiones = 2 + 0,5 crédito, pagos sin Wompi ni Stripe (PayPal +7 % / Wise), nuevas: recepción 24/7, caso completo, planes de créditos (congelamiento 90 días), sin casos de prueba gratis, seguimiento, otros países y categoría 🎓 Academia (cursos, Mi academia, certificado verificable, devolución, calificar). JSON-LD FAQPage alineado con las preguntas visibles (18). sitemap lastmod.
- 🔴 Por decidir: flujo-diseno dice «PAGO 100% ANTICIPADO» para todos y los términos «cliente existente 50/50»; las FAQ siguen a los términos.

## 2026-11-20 (f) — Analítica de verdad diferida

- ✅ header.js + conversions.js (= PRODIGY): el oyente de «scroll» en captura recibía el scroll de carruseles internos y cargaba la analítica antes de tiempo; ahora solo cuenta el scroll de la página. ?v= header.js/footer.js → 20261120b en 55 archivos; conversions.js → 20261120b.
- La home ya tenía content-visibility:auto (.sec, .portfolio-sec, .test-sec, .cta-banner); probado auto 900px por sección: sin diferencia real → se deja igual.
- Revisión mensual: tools/revision-sitio.mjs vive en el repo de PRODIGY y revisa las dos webs.

## 2026-11-20 (e) — Títulos cortos para Google, hero sin salto

- ✅ articles-ac.js: "titulo_seo" (≤ 60 car.) en los 28 artículos; functions/article.js + article.html lo usan solo para <title> (marca si cabe en 65); h1/og/JSON-LD con el titular. Probado contra los 28: 0 discrepancias. scripts/gen-articulo-ac.js: el prompt lo pide y se guarda solo si mide 15–60 (= PRODIGY).
- ✅ index.html: respaldo de letra para negritas (700 y 800–900) con Arial Bold calibrado al ancho de Inter (100,5 % y 102 %). Antes el respaldo era Arial normal con negrita sintética: al llegar Inter el hero se reacomodaba (CLS 0,064, desfase de hasta 205 px por cambio de línea). Ahora: CLS 0 en local con red lenta; con la letra bloqueada el hero difiere ≤ 5 px de lado y 0 vertical.

## 2026-11-20 (d) — Retracto en el correo, calificar al terminar, títulos de artículos, revisión completa

- ✅ admin-panel (correo de bienvenida del alumno): párrafo de retracto (5 días hábiles, 100 % si no abrió clases + enlace a Condiciones) solo si el pago NO es cortesía. Probado con la función real y stubs (sin enviar).
- ✅ mi-academia: al llegar al 100 % sin calificación se abre la ventana «Terminaste el curso. ¿Cómo te pareció?» (una vez) y el botón Calificar queda destacado.
- ✅ article.html + functions/article.js (= PRODIGY): <title> con « | Alejandro Carvajal CAD/CAM» solo si cabe en 65 caracteres (antes 28 artículos pasaban de 70) y meta description ≤ 160 cortada en palabra completa (7 pasaban). og/twitter siguen completos.
- Revisión en vivo (sitemap completo, 73 URLs): todas 200, sin noindex, canonical correcto, sin títulos/descripciones duplicados, JSON-LD válido, og:image cargan, cabeceras de seguridad completas, 404 real, http→https. 0 img sin alt y 0 _blank sin noopener. CWV móvil (CPU 4x): home LCP 1,5 s · CLS 0,064; academia 1,4 s; blog 1,6 s.

## 2026-11-20 (c) — Términos: secciones sin estilo, condiciones de la Academia

- ✅ terminos-y-legal: 3 secciones usaban class="details-content" (sin CSS: texto pegado al borde, sin viñetas) → accordion-content.
- 🟡 Rama local borrador/terminos-academia (ccb4d5c, sin publicar): presencial sin devolución salvo el retracto legal (pago a distancia y curso a más de 5 días); grabados: retracto 100 % si no abrió clases, con ≤20 % visto se retiene 25 % (porcentaje por confirmar); incumplimiento = sin devolución. Merge con master verificado limpio.
- ✅ academia-video-token: la 1.ª vez que un alumno inscrito pide el video o un recurso de una clase que no es de muestra, guarda primer_acceso_at (solo si está vacía; sin el SQL no hace nada ni bloquea). admin-panel → Alumnos: columna «Actividad» dice «No ha abierto clases» / «Abrió clases el …» (aparece cuando el SQL esté corrido).
- ✅ Condiciones de la Academia PUBLICADAS (Alejandro aprobó el 25 %): rama borrador/terminos-academia unida a master; pestaña Academia en terminos-y-legal + enlaces desde curso, academia (FAQ + JSON-LD) y Mi academia.
- PENDIENTES: bloque «20-nov — acciones tuyas» (% de retención, SQL, R2 de videos, PayPal, www 404, catálogo).
- ✅ Estrellas de los cursos (mejora 3 que pidió Alejandro): functions/curso.js agrega aggregateRating al JSON-LD Course solo si hay calificaciones reales (RPC pública academia_calificaciones_publicas: promedio + cantidad de alumnos con inscripción activa, nunca nombres ni comentarios). curso.html muestra «★ 4,8 (12 calificaciones)» en los datos del curso (Google exige que se vea en la página) y las tarjetas de academia.html «★ 4,8 (12)». js/academia-publica.js ?v=20261120a (calificaciones + calHtml). mi-academia: aviso en el modal de calificar (estrellas al promedio público sin nombre; el comentario solo lo lee el equipo). Sin el SQL la RPC no existe y no se muestra nada (probado). ✅ SQL corrido por Alejandro el 20-nov (verificado en la base; con anon: RPC 200, academia_resenas e inscripciones 401). Quitado primer_acceso_at del ALLOW de audit-schema-live.
- ✅ Cloudflare (cf CLI, a pedido de Alejandro): regla 301 www.alejandrocadcam.com → alejandrocadcam.com conservando ruta y parámetros (Redirect Rules de la zona; no había reglas antes). Verificado en vivo: http y https con www → 301 → 200.

## 2026-11-20 (b) — SEO de cursos en el servidor, correo de bienvenida, ?v= unificado

- ✅ functions/curso.js + _routes.json (/curso): título, descripción, canonical, og y JSON-LD Course del lado del servidor (antes todo curso canonizaba a /academia). Sin slug → 301 a /academia; curso inexistente → X-Robots-Tag noindex (verificado en vivo). Enlaces de academia.html a /curso?slug=; el cliente no duplica el JSON-LD.
- ✅ admin-panel → Academia: al inscribir, casilla «Avisarle por correo» (marcada): correo con enlace a Mi academia vía /api/send-email con la sesión del admin, responde a educacion@. send-email: reply_to por defecto alejandro@alejandrocadcam.com (antes el Gmail personal); admin/cron pueden pedir otra casilla @alejandrocadcam.com. Simulado en local (sin enviar).
- ✅ header.js/footer.js ?v=20261120a en todas las páginas (había 4 versiones).
- 💡 Pendiente: reseñas públicas / AggregateRating en /curso (necesita RPC pública + aprobar el texto de reseñas del borrador de condiciones).

## 2026-11-20 (a) — PayPal sin doble registro, /links más rápido, borrador de condiciones de la Academia

- ✅ paypal-capture y paypal-webhook: marcan Pagado solo si el pedido sigue sin confirmar (PATCH con pago_estado=neq.pago_confirmado y return=representation); si el otro ganó la carrera no se duplica el registro en pagos ni el aviso. PRODIGY quedó con la misma seguridad que este repo.
- ✅ links + js/card-fan-carousel.js (?v=20261120a): config de la galería pedida en el <head>, cartas visibles sin lazy y la del centro con fetchpriority=high, leyendas escapadas. Segunda vuelta: como la galería del panel está vacía, el <head> también pide los casos del portafolio, arma las cartas (window.__LNK.cartas/casos, una sola fuente) y precarga la del centro. LCP en 4G lenta: 4,8 s (antes) → 4,0 s (primera vuelta, en vivo) → 2,4 s (local).
- 🟡 Corrección del trigger detectar_precio_sospechoso (USD vs catálogo COP) en el repo de PRODIGY: sql/patch-deteccion-precio-manipulado-2026-07.sql. Falta correrlo.
- 💡 Borrador de «Condiciones de la Academia» (pestaña Academia en terminos-y-legal + enlaces desde curso, academia y Mi academia) en la rama local borrador/terminos-academia (worktree D:/proyectos-web/ac-borrador-academia). NO publicado: espera aprobación de Alejandro (retracto 5 días hábiles si vio ≤20 %, acceso sin vencimiento, cancelación presencial 8 días / 48 h).

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
