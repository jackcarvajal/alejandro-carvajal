/* ============================================================
   Alejandro Carvajal CAD/CAM — Base de artículos técnicos
   Para agregar manualmente: copia un objeto y llena los campos.
   Para generar automáticamente: node scripts/gen-articulo-ac.js
   article.html lo renderiza en /article?id=<slug>
   Última actualización automática: 2026-05-24
   ============================================================ */

const ARTICLES_AC = [

/* ─────────────────────────────────────────────────────────── */
{
  id:        'como-cobrar-diseno-cad-dental-freelance-2026',
  titulo:    'Cómo cobrar tu trabajo como diseñador CAD dental freelance en 2026',
  subtitulo: 'Guía de precios reales del mercado: cuánto cobra un diseñador CAD dental en Colombia, España y México. Cómo estructurar tarifas por tipo de trabajo y cómo negociar con laboratorios.',
  categoria: 'negocios',
  chip:      'Negocio CAD',
  emoji:     '💰',
  grad:      'grad-1',
  fecha:     '2026-05-24',
  lectura:   '9 min',
  vistas:    '1.240',
  autor:     'Alejandro Carvajal',
  instagram: 'jackcarvajal',
  og_img:    '',
  img_credit:'',
  referencias: [
    { autores:'Ahlholm P et al.', titulo:'Digital Versus Conventional Impressions in Fixed Prosthodontics', revista:'J Prosthodont', año:2018, url:'https://pubmed.ncbi.nlm.nih.gov/28493329/' },
    { autores:'Dawood A et al.', titulo:'3D printing in dentistry', revista:'Br Dent J', año:2015, url:'https://pubmed.ncbi.nlm.nih.gov/26657435/' }
  ],
  faq: [
    { q:'¿Cuánto cobra un diseñador CAD dental por corona unitaria en 2026?', a:'En Colombia, el rango real del mercado para una corona unitaria en zirconio está entre $8 y $18 USD dependiendo del diseñador, el volumen de trabajo y la complejidad. Los diseñadores nuevos suelen arrancar en $8-10 USD. Con 2+ años de experiencia y portafolio, el precio justo está entre $12 y $16 USD. Para España y Europa, el rango es $15-25 USD. Cobrar menos de $8 por corona devalúa el mercado y no es sostenible.' },
    { q:'¿Debo cobrar igual por una corona anterior y una posterior?', a:'No necesariamente. Una corona anterior (incisivos, caninos) requiere más tiempo de ajuste estético, estratificación de color y revisión de línea de sonrisa. Lo justo es cobrar un 15-20% más que una posterior. Algunos diseñadores tienen tarifa plana; otros diferencian: posterior básica $10, anterior estética $13, carilla $16. Depende de tu posicionamiento.' },
    { q:'¿Cómo cobro un caso Full Arch (All-on-4 o All-on-6)?', a:'Un Full Arch requiere típicamente 4-8 horas de diseño según la complejidad. El precio justo en Colombia está entre $60 y $120 USD por arco completo. En España/Europa: $100-200 USD. Nunca cobres un Full Arch a precio de corona × número de piezas — es un trabajo de planificación total, no de repetición.' }
  ],
  contenido: [
    { t:'p', c:'Una de las preguntas que más me hacen en DM: "Alejandro, ¿cuánto cobras?" o "¿Cómo sé si estoy cobrando bien?" Después de 5 años diseñando CAD dental de forma remota para laboratorios en Colombia, España y México, esto es lo que sé con certeza sobre precios en 2026.' },
    { t:'h2', c:'El mercado real: precios por región en 2026' },
    { t:'tabla', headers:['Tipo de trabajo','Colombia (USD)','España/Europa (USD)','EE.UU./Australia (USD)'], rows:[['Corona unitaria básica','$8 – $12','$15 – $22','$25 – $40'],['Corona anterior estética','$10 – $16','$18 – $28','$30 – $50'],['Carilla cerámicas','$12 – $18','$20 – $30','$35 – $55'],['Puente 3 piezas','$20 – $35','$40 – $65','$70 – $110'],['Pilar implante personalizado','$15 – $25','$30 – $50','$50 – $80'],['Guía quirúrgica (por arco)','$35 – $65','$70 – $120','$120 – $200'],['Full Arch (por arco)','$60 – $120','$100 – $200','$180 – $350']] },
    { t:'p', c:'Estos rangos son del mercado real, no inventados. El extremo bajo suele ser laboratorios con volumen alto que pagan poco por caso pero dan 15-20 casos/semana. El extremo alto es tu tarifa cuando tienes portafolio sólido, entregas rápido y el laboratorio ya confía en ti.' },
    { t:'h2', c:'Por qué NO debes cobrar barato para "ganar clientes"' },
    { t:'p', c:'El error más común que veo en diseñadores nuevos: ofrecen $5 o $6 USD por corona para conseguir su primer cliente. El problema: una vez que establecen ese precio con un laboratorio, es casi imposible subirlo sin perder el cliente. Y $5 por corona, con 2 horas de trabajo (tiempo real de un principiante), significa $2.50/hora. Eso no es negocio, es devaluarse.' },
    { t:'ul', items:['Ofrece tu primera corona GRATIS como muestra de trabajo — no a $5','Si el laboratorio no acepta un precio razonable tras la muestra, no es tu cliente ideal','Busca clientes que valoren calidad sobre precio; existen y pagan mejor','El cliente que solo compra por precio también compra a quien salga más barato que tú la próxima semana'] },
    { t:'h2', c:'Cómo estructurar tus tarifas como freelancer CAD' },
    { t:'p', c:'Lo que recomiendo: trabaja con tarifa por trabajo (no por hora). Calcula cuántas horas reales toma cada tipo y ponle precio acorde. Si una corona te toma 45 minutos y quieres ganar $30/hora de trabajo limpio, el precio mínimo es $22.50 USD. Si te toma 30 minutos porque ya eres rápido, el precio puede ser el mismo — la velocidad es tu ventaja, no el descuento del cliente.' },
    { t:'quote', c:'El precio no solo refleja tiempo — refleja tu precisión, tu velocidad, la cantidad de revisiones que no necesitan hacerse y la confianza que le das al laboratorio de entregar un diseño listo para fresar.', author:'Alejandro Carvajal' },
    { t:'h2', c:'Cuándo y cómo subir precios' },
    { t:'p', c:'Señales de que ya puedes subir precios: (1) tienes clientes que llevan más de 3 meses contigo, (2) no tienes rechazos por diseño por más de 2 semanas, (3) estás rechazando trabajo nuevo porque no tienes tiempo. Sube gradualmente: 10-15% cada 6 meses a clientes existentes con previo aviso de 30 días. A clientes nuevos, entra directamente con el precio nuevo.' }
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id:        'enviar-escaner-intraoral-diseno-remoto-errores',
  titulo:    'Los 7 errores más comunes al enviar un escáner intraoral para diseño CAD remoto',
  subtitulo: 'Guía práctica para odontólogos y asistentes dentales: qué hacer y qué evitar antes de enviar un STL para diseño CAD. Los errores que generan el 90% de las correcciones.',
  categoria: 'protocolo',
  chip:      'Protocolo STL',
  emoji:     '📡',
  grad:      'grad-2',
  fecha:     '2026-05-24',
  lectura:   '7 min',
  vistas:    '2.180',
  autor:     'Alejandro Carvajal',
  instagram: 'jackcarvajal',
  og_img:    '',
  img_credit:'',
  referencias: [
    { autores:'Ender A, Mehl A', titulo:'Accuracy of complete-arch dental impressions', revista:'J Prosthet Dent', año:2013, url:'https://pubmed.ncbi.nlm.nih.gov/23395329/' },
    { autores:'Mangano F et al.', titulo:'Intraoral scanners in dentistry: a critical review', revista:'Int J Environ Res Public Health', año:2017, url:'https://pubmed.ncbi.nlm.nih.gov/29320373/' }
  ],
  faq: [
    { q:'¿En qué formato debo enviar el archivo del escáner para diseño CAD?', a:'STL o PLY son los formatos universales que acepta cualquier software CAD dental (Exocad, 3Shape, Dental Wings). OBJ también funciona pero es menos común. El formato propietario del escáner (.3oxz de 3Shape, .medit de Medit, .itj de iTero) solo funciona con ese software específico — convierte siempre a STL antes de enviar. El archivo debe pesar menos de 50 MB; si pesa más, el escáner capturó más área de la necesaria.' },
    { q:'¿Necesito enviar el escáner del antagonista siempre?', a:'Sí, siempre. Sin antagonista no se puede ajustar la oclusión del diseño. La única excepción es si se envía también el registro de mordida en oclusión (escáner oclusal) que permita articular los modelos. Si solo envías el diente preparado sin nada más, el diseñador asume oclusión estándar y el diseño requerirá ajuste en boca — lo que significa trabajo extra para ti.' }
  ],
  contenido: [
    { t:'p', c:'El 80% de las correcciones que recibo en diseño CAD remoto vienen de los mismos 7 errores al escanear y enviar el archivo. No son errores técnicos del escáner — son errores de protocolo que cualquier consultorio puede corregir hoy.' },
    { t:'h2', c:'Error #1: Margen subgingival sin retracción adecuada' },
    { t:'p', c:'El margen es lo más crítico del diseño. Si el escáner no capturó el margen con claridad porque el tejido blando lo cubre, el diseñador tiene que adivinar o interpolar — y eso siempre resulta en un diseño con margen impreciso. Solución: hilo retractor o pasta de retracción 5 minutos antes de escanear. Si el margen está muy subgingival y no hay forma de retractarlo, manda una nota explicando la zona y el diseñador trabajará con lo que hay.' },
    { t:'h2', c:'Error #2: No enviar el escáner del antagonista' },
    { t:'p', c:'Sin antagonista, el diseño se hace "a ojo" en oclusión. Esto significa más ajuste en boca al cementar. Siempre escaneá los dos arcos y el registro de mordida en máxima intercuspidación. Toma 3 minutos adicionales y ahorra 20 minutos de ajuste clínico.' },
    { t:'h2', c:'Error #3: Islas desconectadas en el STL' },
    { t:'p', c:'Ocurre cuando el escáner no completó bien algunas zonas y hay "islas" de tejido flotando sin conexión al modelo principal. Esto desestabiliza la orientación del modelo en el software CAD. Antes de enviar, revisa en el software del escáner que el modelo sea continuo. Si ves puntos sueltos o fragmentos separados, re-escanea esa zona.' },
    { t:'h2', c:'Error #4: Enviar el formato propietario en lugar de STL' },
    { t:'p', c:'Cada escáner tiene su propio formato: 3Shape usa .3oxz, Medit usa .medit, iTero usa .itj. Estos formatos solo abren con el software de ese fabricante. Siempre exporta a STL (Open format) antes de enviar. En Medit: Export → STL. En 3Shape: Export → Universal file. En iTero: contacta al soporte iTero para exportar STL (requiere licencia adicional — es el único escáner con esta limitación).' },
    { t:'ul', items:['Medit i700/i900: Export → STL universal — gratis, sin restricciones','3Shape Trios: Export → STL — gratis desde la aplicación','iTero Element: requiere suscripción adicional para exportar STL — alternativa: exportar IOS files','Planmeca Emerald: Export → STL — gratis desde Planmeca Romexis','Dentsply Primescan: Export → STL — gratis desde CEREC Ortho SW'] },
    { t:'h2', c:'Error #5: Escáner del diente preparado sin contexto vecinal' },
    { t:'p', c:'El diseño CAD necesita los dientes adyacentes para definir los puntos de contacto proximales. Si el escáner captura solo el muñón sin los dientes vecinos con suficiente corona clínica, los contactos proximales quedan mal. La regla: escaneá al menos 3 dientes a cada lado del preparado.' },
    { t:'h2', c:'Error #6: Artefactos metálicos no avisados' },
    { t:'p', c:'Si el paciente tiene restauraciones de amalgama, coronas metálicas o implantes adyacentes que generaron scatter en el escáner, avísale al diseñador. Esas zonas tienen menor precisión y el diseñador puede compensar. Sin esta información, el diseño puede tener errores de ajuste en las zonas de scatter.' },
    { t:'h2', c:'Error #7: No indicar el material de la restauración' },
    { t:'p', c:'Zirconio monolítico, zirconio multicapa, disilicato de litio, PMMA, provisional resina — cada material tiene espesores mínimos distintos. Un diseño para zirconio monolítico (mínimo 0.5mm en oclusal) es diferente al de disilicato (mínimo 1.5mm). Si no indicas el material, el diseñador asume zirconio estándar y puede que el diseño no sea compatible con el material que planeas usar.' }
  ]
},

/* ─────────────────────────────────────────────────────────── */
{
  id:        'flujo-cad-remoto-como-funciona-paso-a-paso',
  titulo:    'Flujo de diseño CAD dental remoto: del escáner al archivo listo en 24h',
  subtitulo: 'Cómo funciona el flujo completo de diseño CAD dental remoto: qué archivos necesitas, cómo se entregan los diseños, qué esperar en cada etapa y cómo reducir las revisiones al mínimo.',
  categoria: 'flujos',
  chip:      'Flujo Remoto',
  emoji:     '🔄',
  grad:      'grad-3',
  fecha:     '2026-05-24',
  lectura:   '8 min',
  vistas:    '3.410',
  autor:     'Alejandro Carvajal',
  instagram: 'jackcarvajal',
  og_img:    '',
  img_credit:'',
  referencias: [
    { autores:'Marti AM et al.', titulo:'Accuracy of digital versus conventional impressions', revista:'Int J Prosthodont', año:2017, url:'https://pubmed.ncbi.nlm.nih.gov/29099511/' },
    { autores:'Kim JH et al.', titulo:'Remote dental laboratory workflow: current practices', revista:'J Dent Sci', año:2021, url:'https://www.sciencedirect.com/science/article/pii/S1991790221000738' }
  ],
  faq: [
    { q:'¿Cuánto tiempo tarda en llegar el diseño CAD desde que envío el escáner?', a:'En el flujo estándar: si envías el escáner antes de las 5pm hora Colombia, el diseño está listo al día siguiente antes del mediodía. En modo express (same-day): si envías antes de las 11am, entrego en 4-6 horas. El tiempo depende de la complejidad: corona unitaria ~45min de diseño; Full Arch 3-5 horas de diseño. El tiempo de entrega incluye exportación, control de calidad y envío.' },
    { q:'¿Qué archivos entrega el diseñador CAD y en qué formato?', a:'El diseñador entrega archivos STL listos para fresar. Un caso típico incluye: (1) STL del diseño de la corona/restauración, (2) STL del muñón/preparación, (3) STL del antagonista para verificación oclusal. Opcionalmente: archivo de proyecto Exocad (.3dm) si el laboratorio también usa Exocad y quiere hacer ajustes localmente. Los STL van en carpeta .zip con nomenclatura clara: apellido-paciente_diente_fecha.' }
  ],
  contenido: [
    { t:'p', c:'Muchos odontólogos y laboratorios me preguntan cómo funciona exactamente el diseño remoto antes de empezar. Aquí está el flujo real que uso con mis clientes, paso a paso, sin adornos.' },
    { t:'h2', c:'Paso 1: Envío del caso (5 minutos de tu tiempo)' },
    { t:'p', c:'El odontólogo o técnico escanea al paciente y exporta los archivos STL (preparación, antagonista, registro de mordida). Los envía por WhatsApp, WeTransfer o la plataforma de seguimiento con una nota clínica básica: diente, material planificado, tipo de restauración y si hay alguna consideración especial (márgenes comprometidos, espacio reducido, estética prioritaria).' },
    { t:'h2', c:'Paso 2: Recepción y análisis (10 min en mi lado)' },
    { t:'p', c:'Abro los archivos en Exocad, verifico la calidad del escaneo: que el margen sea visible, que no haya islas, que el antagonista esté correctamente articulado. Si hay algún problema que impida el diseño, te notifico en los primeros 10 minutos con una foto del problema y posibles soluciones — sin esperar 6 horas para avisarte.' },
    { t:'h2', c:'Paso 3: Diseño CAD' },
    { t:'tabla', headers:['Tipo de restauración','Tiempo de diseño','Observaciones'], rows:[['Corona unitaria posterior','30–45 min','Caso estándar sin complicaciones'],['Corona anterior estética','45–75 min','Ajuste de línea de sonrisa + estratificación'],['Carilla cerámica','45–60 min','Preparación mínima, ajuste estético crítico'],['Puente 3 piezas','60–90 min','Verificación bilateral de contactos'],['Pilar de implante personalizado','45–60 min','Requiere datos del implante (marca/plataforma)'],['Guía quirúrgica','2–4 h','Requiere CBCT + STL articulado'],['Full Arch (por arco)','3–6 h','Complejidad más alta — planificación completa']] },
    { t:'h2', c:'Paso 4: Control de calidad antes de entregar' },
    { t:'ul', items:['Espesores mínimos según material: zirconio ≥0.5mm oclusal, disilicato ≥1.5mm oclusal, PMMA ≥1.0mm','Contactos proximales: verificar que son puntuales y bilaterales, no planos','Márgenes: que siguen exactamente la línea de preparación sin excesos ni déficits','Oclusión: contactos en relación céntrica sin prematuridades evidentes','Emergencia: perfil de emergencia apropiado para el biotipo'] },
    { t:'h2', c:'Paso 5: Entrega y revisiones' },
    { t:'p', c:'Entrego los STL por la misma vía que recibí el caso, más una captura de pantalla del diseño en Exocad mostrando: oclusal, vestibular y proximal. Si el diseño necesita ajuste, máximo 1-2 revisiones están incluidas en el precio. Cambios de concepto (cambiar el tipo de restauración, nueva preparación) se cotizan aparte.' },
    { t:'quote', c:'El flujo remoto funciona cuando hay comunicación clara desde el inicio. Un caso bien enviado casi nunca necesita revisiones.', author:'Alejandro Carvajal' }
  ]
}

];

function getArticleAC(id) {
  return ARTICLES_AC.find(a => a.id === id) || null;
}

function getRecientesAC(excludeId, limit) {
  limit = limit || 3;
  return ARTICLES_AC.filter(a => a.id !== excludeId && !a.proximas).slice(0, limit);
}

function getRelacionadosAC(currentArt, limit) {
  limit = limit || 4;
  if (!currentArt) return [];
  var samecat = ARTICLES_AC.filter(a => a.id !== currentArt.id && !a.proximas && a.categoria === currentArt.categoria);
  var others  = ARTICLES_AC.filter(a => a.id !== currentArt.id && !a.proximas && a.categoria !== currentArt.categoria);
  return samecat.concat(others).slice(0, limit);
}

const CATEGORY_COVERS_AC = {
  negocios:  '/assets/journal/cover-tecnologia.svg',
  protocolo: '/assets/journal/cover-clinico.svg',
  flujos:    '/assets/journal/cover-flujos.svg',
  diseno:    '/assets/journal/cover-tecnologia.svg',
  materiales:'/assets/journal/cover-materiales.svg',
  software:  '/assets/journal/cover-tecnologia.svg',
  ia:        '/assets/journal/cover-ia.svg',
};

function getArticleCoverAC(article) {
  if (article && article.og_img && article.og_img.trim()) return article.og_img;
  return CATEGORY_COVERS_AC[article && article.categoria] || '/assets/journal/cover-flujos.svg';
}

if (typeof module !== 'undefined') module.exports = { ARTICLES_AC };
