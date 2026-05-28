#!/usr/bin/env node
/**
 * Alejandro Carvajal CAD/CAM — Auto-Journal Generator
 * Motor: Google Gemini 2.0 Flash (gratuito, 1500 req/dia)
 * Imagenes: Wikipedia REST API (gratuito, sin key)
 * Social copy: GitHub Actions Artifact (privado)
 * Variable de entorno requerida (GitHub Secret): GEMINI_API_KEY
 */
'use strict';
const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const ARTICLES_PATH = path.join(__dirname, '..', 'articles-ac.js');
const SOCIAL_PATH   = path.join(__dirname, '..', 'marketing-social-ac.txt');
const GEMINI_KEY    = process.env.GEMINI_API_KEY;
const TOPIC_POOL = [
  { slug_prefix: 'exocad-dentalcad-flujo', chip: 'Software CAD', emoji: '🖥️', grad: 'grad-1', categoria: 'software', lectura: '7 min', titulo_seed: 'Exocad DentalCAD — flujo de trabajo y precision marginal 2025', tema_es: 'Evaluacion de la precision y eficiencia del software Exocad DentalCAD para diseno de restauraciones dentales: adaptacion marginal (gap interno <50 micras), tiempo de diseno, curva de aprendizaje y comparativa con 3Shape Dental System. Modulos clave: Implant Bar & Bridge, Removable Partial Denture, Smile Design. Publicaciones en Journal of Prosthetic Dentistry, International Journal of Computerized Dentistry y Journal of Dental Education.', wiki_article: 'CAD/CAM dentistry' },
  { slug_prefix: 'diseno-cad-remoto-protocolo', chip: 'Flujo Remoto', emoji: '📡', grad: 'grad-2', categoria: 'flujos', lectura: '7 min', titulo_seed: 'Diseno CAD dental remoto — protocolos validados 2025', tema_es: 'Protocolos clinicos validados para el flujo de trabajo de diseno CAD dental remoto: requisitos de escaner intraoral (precision mayor a 20 micras trueness), formatos de archivo STL/OBJ/PLY, transferencia de registros oclusales digitales y estandares de entrega. Evidencia clinica de precision en restauraciones disenadas remotamente vs. en laboratorio tradicional. Publicaciones en Journal of Prosthetic Dentistry y Journal of Dentistry.', wiki_article: 'CAD/CAM dentistry' },
  { slug_prefix: 'adaptacion-marginal-cad', chip: 'Precision CAD', emoji: '🔬', grad: 'grad-3', categoria: 'clinica', lectura: '6 min', titulo_seed: 'Adaptacion marginal en restauraciones CAD/CAM — estandar clinico 2025', tema_es: 'Revision sistematica de la adaptacion marginal en restauraciones CAD/CAM: valores de gap marginal clinicamente aceptables (menos de 100 micras segun criterios ADA/McCabe), efecto del material (zirconia vs. disilicato de litio vs. ceramica hibrida), precision del diseno en software y proceso de manufactura. Estudios in vitro e in vivo publicados en Journal of Prosthetic Dentistry, Dental Materials y Journal of Dentistry.', wiki_article: 'Dental restoration' },
  { slug_prefix: 'escaner-intraoral-cad-precision', chip: 'Escaneres', emoji: '📐', grad: 'grad-4', categoria: 'diseno', lectura: '7 min', titulo_seed: 'Escaneres intraorales para diseno CAD — impacto en adaptacion marginal', tema_es: 'Evaluacion clinica de la precision de los principales escaneres intraorales para casos de diseno CAD dental: Medit i700/i900, 3Shape Trios 5, iTero Element 7, Primescan. Impacto directo en la adaptacion marginal de restauraciones CAD/CAM. Estudios en Journal of Dentistry, Journal of Prosthetic Dentistry y Dental Materials.', wiki_article: 'Intraoral scanner' },
  { slug_prefix: 'emax-cad-diseno-2025', chip: 'Materiales', emoji: '💎', grad: 'grad-5', categoria: 'materiales', lectura: '7 min', titulo_seed: 'IPS e.max CAD Ivoclar — propiedades y diseno en software CAD', tema_es: 'Analisis clinico del disilicato de litio IPS e.max CAD (Ivoclar Vivadent) desde la perspectiva del disenador CAD: resistencia flexural mayor a 400 MPa, consideraciones de grosor de diseno por tipo de restauracion (corona, carilla, onlay), protocolos de espacio de adhesion y cristalizacion en horno Programat. Estudios en Journal of Prosthetic Dentistry y Dental Materials 2022-2025.', wiki_article: 'Lithium disilicate' },
  { slug_prefix: 'zirconia-diseno-grosor', chip: 'Zirconia CAD', emoji: '💎', grad: 'grad-1', categoria: 'materiales', lectura: '7 min', titulo_seed: 'Zirconia para diseno CAD — grosores minimos y alta translucidez 2025', tema_es: 'Parametros clinicos de diseno CAD para restauraciones en zirconia de alta translucidez: grosores minimos por tipo (corona posterior 0.5mm, corona anterior 0.3-0.5mm, estructura puente), efecto de los parametros de fresado en propiedades finales, y comparativa de bloques Katana STML/UTML, DD Bio ZW+ y Prettau Anterior. Datos de resistencia flexural y supervivencia clinica en Dental Materials y Journal of Prosthetic Dentistry.', wiki_article: 'Zirconium dioxide in dentistry' },
  { slug_prefix: 'guia-quirurgica-precision-2025', chip: 'Guias Quirurgicas', emoji: '🦷', grad: 'grad-2', categoria: 'implantologia', lectura: '8 min', titulo_seed: 'Precision de guias quirurgicas estaticas — meta-analisis 2025', tema_es: 'Meta-analisis de la precision de cirugia guiada estatica para implantes dentales: desviacion angular media, desviacion lateral en hombro y punta (mm), desviacion de profundidad. Variables: tipo de soporte (dentosoportada vs. mucosoportada), sistema de planificacion (CoDiagnostiX, Simplant, Blue Sky Plan, Implant Studio 3Shape), material de la guia. Revisiones en Clinical Oral Implants Research, IJOS y Journal of Clinical Periodontology 2022-2025.', wiki_article: 'Dental implant' },
  { slug_prefix: 'dsd-protocolo-2025', chip: 'Diseno Sonrisa', emoji: '✨', grad: 'grad-3', categoria: 'estetica', lectura: '6 min', titulo_seed: 'Digital Smile Design DSD — protocolo actualizado 2025', tema_es: 'Protocolo actualizado de Diseno Digital de Sonrisa (DSD): integracion de fotografia facial estandarizada, escaner intraoral y software de planificacion estetica. Comparativa de plataformas: DSD App, Smile Designer Pro, 3Shape Smile Design. Validacion del mockup digital frente a encerado fisico, satisfaccion del paciente y predictibilidad del resultado final. Estudios en Journal of Esthetic and Restorative Dentistry y Journal of Prosthetic Dentistry.', wiki_article: 'Cosmetic dentistry' },
  { slug_prefix: 'alineadores-laboratorio-2025', chip: 'Ortodoncia Digital', emoji: '📐', grad: 'grad-4', categoria: 'ortodoncia', lectura: '6 min', titulo_seed: 'Alineadores de laboratorio vs. Invisalign — eficacia clinica 2025', tema_es: 'Comparativa clinica entre Invisalign (Align Technology, ClinCheck) y sistemas de alineadores fabricados en laboratorio (uLab, 3Shape Ortho, OrthoAnalyzer): eficacia de movimiento dental, precision de alineadores impresos en 3D, tasa de refinamientos, satisfaccion del paciente y costo-beneficio. Ensayos clinicos en American Journal of Orthodontics and Dentofacial Orthopedics y Angle Orthodontist.', wiki_article: 'Clear aligners' },
  { slug_prefix: 'cementacion-adhesiva-ceramicas', chip: 'Protocolos', emoji: '🔬', grad: 'grad-5', categoria: 'clinica', lectura: '6 min', titulo_seed: 'Cementacion adhesiva en ceramicas CAD/CAM — protocolo basado en evidencia', tema_es: 'Protocolo de cementacion adhesiva basado en evidencia para restauraciones CAD/CAM segun sustrato ceramico: grabado con HF 5% mas silano (disilicato de litio, ceramica hibrida), tratamiento con MDP mas sandblasting (zirconia), eleccion de cemento resinoso (RelyX Ultimate 3M, Variolink Esthetic Ivoclar, Panavia V5 Kuraray). Resistencia de union, supervivencia clinica y errores comunes. Publicaciones en Journal of Prosthetic Dentistry, Operative Dentistry y Dental Materials.', wiki_article: 'Dental bonding' },
  { slug_prefix: 'full-arch-digital-2025', chip: 'Full Arch', emoji: '⚙️', grad: 'grad-1', categoria: 'implantologia', lectura: '10 min', titulo_seed: 'Protocolo Full Arch digital — precision, materiales y evidencia 2025', tema_es: 'Protocolo clinico basado en evidencia para rehabilitaciones Full Arch digitales (All-on-4, All-on-6): digitalizacion de arco completo, tecnicas de verificacion de arco, diseno CAD de estructura metalica y protesis final en zirconia monolitica o PMMA. Tasas de exito implantario, desajuste pasivo y satisfaccion del paciente segun meta-analisis en IJOS y Clinical Oral Implants Research.', wiki_article: 'All-on-4' },
  { slug_prefix: 'ia-diseno-cad-2025', chip: 'IA en CAD', emoji: '🤖', grad: 'grad-2', categoria: 'innovacion', lectura: '7 min', titulo_seed: 'Inteligencia artificial en diseno CAD dental — segmentacion y anatomia', tema_es: 'Aplicaciones de inteligencia artificial en diseno CAD dental: segmentacion automatica de margenes, propuesta de anatomia oclusal, deteccion de colisiones y optimizacion de contactos proximales. Estudios de validacion comparados con diseno manual por expertos. Publicaciones en Journal of Dental Research, Computers in Biology and Medicine y Journal of Dentistry.', wiki_article: 'Artificial intelligence in healthcare' },
  { slug_prefix: 'ferulas-oclusales-cad', chip: 'Ferulas', emoji: '🔬', grad: 'grad-3', categoria: 'ferula', lectura: '6 min', titulo_seed: 'Ferulas oclusales CAD/CAM vs. convencionales — evidencia clinica', tema_es: 'Comparativa clinica de ferulas oclusales fabricadas por CAD/CAM vs. convencionales (resina acrilica de presion): adaptacion, retencion, dureza Vickers, estabilidad dimensional y efectividad clinica en bruxismo y DTM. Revision de ensayos clinicos en Journal of Oral Rehabilitation, Journal of Prosthetic Dentistry y Journal of Craniomandibular & Sleep Practice.', wiki_article: 'Occlusal splint' },
  { slug_prefix: 'carillas-ultrafinas-cad', chip: 'Carillas CAD', emoji: '✨', grad: 'grad-4', categoria: 'estetica', lectura: '7 min', titulo_seed: 'Carillas ceramicas ultrafinas CAD — diseno, grosor minimo y evidencia clinica', tema_es: 'Protocolo de diseno CAD para carillas ceramicas de minima preparacion (no prep y minimal prep): grosor minimo viable segun material (disilicato de litio 0.3-0.5mm, zirconia high-translucent 0.5mm, ceramica hibrida 0.8mm), parametros de perfil de emergencia, angulo de cavosuperficial y margen subgingival. Supervivencia clinica a 5-10 anos segun estudios en Journal of Prosthetic Dentistry y Journal of Esthetic and Restorative Dentistry.', wiki_article: 'Dental veneers' },
  { slug_prefix: 'endocrown-cad-2025', chip: 'Endocorona', emoji: '🦷', grad: 'grad-5', categoria: 'clinica', lectura: '7 min', titulo_seed: 'Endocorona CAD/CAM — protocolo de diseno y evidencia de supervivencia 2025', tema_es: 'Protocolo clinico para diseno CAD de endocoronas como alternativa al poste-munon: indicaciones (premolares y molares endodonciados), parametros de extension pulpar y grosor de paredes (minimo 2mm axial), materiales recomendados (disilicato de litio vs zirconia), resistencia a fractura in vitro y tasas de exito clinico. Estudios en Journal of Endodontics, Journal of Dentistry y Journal of Prosthetic Dentistry 2022-2025.', wiki_article: 'Crown (dentistry)' },
  { slug_prefix: 'coronas-monoliticas-cad', chip: 'Monoliticas', emoji: '💎', grad: 'grad-1', categoria: 'materiales', lectura: '6 min', titulo_seed: 'Coronas monoliticas en zirconia — diseno CAD y ventajas frente a anatomizadas', tema_es: 'Comparativa tecnica entre coronas monoliticas en zirconia (Katana STML/UTML, Prettau Anterior, DD Bio ZW+) y coronas con estratificado ceramico: parametros de diseno CAD (grosor oclusal, anatomia cuspidea, contactos oclusales), tasas de fractura ceramica (chipping), desgaste antagonista y longevidad clinica. Evidencia en Journal of Prosthetic Dentistry, Clinical Oral Investigations y Dental Materials.', wiki_article: 'Zirconium dioxide in dentistry' },
  { slug_prefix: 'flujo-stl-externo-fresado', chip: 'Flujo STL', emoji: '📡', grad: 'grad-2', categoria: 'flujos', lectura: '6 min', titulo_seed: 'Protocolo de entrega de archivos STL para fresado externo — estandares 2025', tema_es: 'Estandares tecnicos para la transferencia de archivos de diseno CAD a centros de fresado externos: formatos aceptados (STL, OBJ, 3MF, DCM), verificacion de cierre de malla, orientacion de la restauracion en el bloque, especificacion del material y parametros de conector en puentes. Herramientas de verificacion mesh (Meshmixer, netfabb) y protocolos de revision pre-fresado. Fuentes: Journal of Prosthetic Dentistry, Journal of Dentistry y guias tecnicas de fabricantes (Amann Girrbach, VHF, Roland DGA).', wiki_article: 'CAD/CAM dentistry' },
  { slug_prefix: 'anatomia-oclusal-cad', chip: 'Oclusion CAD', emoji: '🔬', grad: 'grad-3', categoria: 'clinica', lectura: '7 min', titulo_seed: 'Anatomia oclusal en diseno CAD — curvas de Wilson y Spee en restauraciones', tema_es: 'Aplicacion de principios de oclusion funcional en el diseno CAD de restauraciones: curva de Spee (compensacion antero-posterior, promedio 1.5mm), curva de Wilson (inclinacion transversal de cuspides), guia anterior y desoclusiones en trabajo y balanceo. Parametros de ajuste en software Exocad (altura de cuspides, angulos de vertiente) y 3Shape (articulador virtual). Evidencia en Journal of Prosthetic Dentistry y Journal of Oral Rehabilitation.', wiki_article: 'Curve of Spee' },
  { slug_prefix: 'peek-implantologia-cad', chip: 'PEEK Implantes', emoji: '⚙️', grad: 'grad-4', categoria: 'materiales', lectura: '7 min', titulo_seed: 'PEEK en implantologia y protesica — propiedades y diseno CAD 2025', tema_es: 'Propiedades y aplicaciones clinicas del polietercetona (PEEK) en diseno CAD para implantologia: modulo de elasticidad similar a hueso cortical (3-4 GPa), biocompatibilidad (ISO 10993), aplicaciones como pilares individualizados, estructuras de soporte, provisionales de largo plazo y base de protesis removibles sobre implantes. Limitaciones esteticas y tratamientos superficiales para mejora de adhesion. Estudios en Clinical Oral Implants Research y Journal of Prosthetic Dentistry.', wiki_article: 'Polyether ether ketone' },
  { slug_prefix: 'exocad-vs-dental-wings', chip: 'Software', emoji: '🖥️', grad: 'grad-5', categoria: 'software', lectura: '7 min', titulo_seed: 'Exocad DentalCAD vs Dental Wings DWOS — comparativa de software CAD 2025', tema_es: 'Analisis comparativo de los dos principales software de diseno CAD dental: Exocad DentalCAD 3.5 Rijeka (modularidad, open system, integracion con escaneres y fresadoras) vs Dental Wings DWOS (Straumann Group, flujo cerrado, integracion con CARES y Neodent). Curva de aprendizaje, costo de licencia, soporte multiusuario, modulos especializados (Implant Bar & Bridge, Ortho, Removable). Evidencia de productividad en Journal of Prosthodontics y Journal of Prosthetic Dentistry.', wiki_article: 'CAD/CAM dentistry' },
  { slug_prefix: 'provisionales-largo-plazo-cad', chip: 'Provisionales', emoji: '🔬', grad: 'grad-1', categoria: 'clinica', lectura: '7 min', titulo_seed: 'Provisionales de largo plazo en PMMA CAD/CAM — protocolo y evidencia', tema_es: 'Protocolo de diseno CAD de provisionales de largo plazo en PMMA fresado (Ivotion, IvoClar ProArt, Telio CAD): parametros de diseno (grosor oclusal minimo 1.5mm, conectores, perfil de emergencia), ventajas sobre acrilicos polimerizados en boca (precision, estabilidad de color, porosidad minima). Rendimiento clinico a 12-24 meses durante tratamientos implantarios extensos. Estudios en Journal of Prosthetic Dentistry y Journal of Esthetic and Restorative Dentistry.', wiki_article: 'Interim restoration' },
  { slug_prefix: 'escaneado-facial-dsd', chip: 'Facial Scan', emoji: '📷', grad: 'grad-2', categoria: 'estetica', lectura: '6 min', titulo_seed: 'Escaneado facial 3D para Diseno Digital de Sonrisa — protocolos 2025', tema_es: 'Integracion de escaneado facial tridimensional en el flujo de Diseno Digital de Sonrisa (DSD): escaner facial estatico (Bellus3D, Structure Sensor) vs. dinamico (3dMD, Di4D), fusion con CBCT y escaner intraoral en software (3Shape Smile Design, Exocad Smile Creator, DSD App 2.0). Precision de superposicion facial-dental, aprobacion del paciente y predictibilidad del resultado estetico. Estudios en Journal of Prosthetic Dentistry y Journal of Dental Research.', wiki_article: 'Digital smile design' },
  { slug_prefix: 'puentes-posteriores-cad', chip: 'Puentes CAD', emoji: '🔬', grad: 'grad-3', categoria: 'clinica', lectura: '7 min', titulo_seed: 'Puentes posteriores CAD/CAM — diseno de conectores y evidencia de fractura', tema_es: 'Parametros criticos de diseno CAD para puentes posteriores de 3 o mas piezas: dimension minima de conector segun material (zirconia solida 16mm2, disilicato de litio 12mm2, zirconia estratificada 25mm2), radio de curvatura del conector, relacion largo-ancho de tramo de pontico, gingival escape y anatomia de pontico. Tasas de fractura clinica y fatiga por carga oclusal. Evidencia en Journal of Prosthetic Dentistry, Dental Materials y Journal of Dentistry.', wiki_article: 'Fixed partial denture' },
  { slug_prefix: 'rehabilitacion-oral-completa-cad', chip: 'Rehab Oral', emoji: '⚙️', grad: 'grad-4', categoria: 'clinica', lectura: '10 min', titulo_seed: 'Rehabilitacion oral completa CAD/CAM — flujo digital y protocolos 2025', tema_es: 'Protocolo clinico basado en evidencia para rehabilitacion oral completa con flujo totalmente digital: DVO mediante articulador virtual en software (Exocad Gnathology Module, 3Shape Smile Design), validacion con provisionales PMMA, diseno CAD definitivo en zirconia monolitica o ceramica estratificada, secuencia de cementacion. Tasas de exito a 5 anos y complicaciones en Journal of Prosthetic Dentistry, Journal of Oral Rehabilitation y IJOS.', wiki_article: 'Full mouth rehabilitation' },
  { slug_prefix: 'flujo-digital-ortopedico', chip: 'Ortopedia CAD', emoji: '📐', grad: 'grad-5', categoria: 'ortopedia', lectura: '7 min', titulo_seed: 'Flujo digital CAD para aparatos ortopedicos dentales — evidencia 2025', tema_es: 'Protocolo de diseno CAD digital para aparatos ortopedicos dentomaxilofaciales: expansores palatinos de diseno digital (Haas, Hyrax), aparatos funcionales (Herbst, Twin Block) fabricados en PMMA fresado o impresos en 3D. Precision de ajuste, tiempo de fabricacion y ventajas sobre metodos convencionales de laboratorio. Revision de evidencia en American Journal of Orthodontics and Dentofacial Orthopedics y European Journal of Orthodontics.', wiki_article: 'Orthodontic appliance' },
];
function todayISO() { return new Date().toISOString().slice(0, 10); }
function uid(prefix) { return prefix + '-' + todayISO() + '-' + crypto.randomBytes(2).toString('hex'); }
function pickTopics() {
  let usedSlugs = [];
  try {
    const raw = fs.readFileSync(ARTICLES_PATH, 'utf8');
    const matches = raw.match(/slug:\s*['"]([^'"]+)['"]/g) || [];
    usedSlugs = matches.map(m => m.replace(/slug:\s*['"]/, '').replace(/['"]/, ''));
  } catch (e) {}
  const recent = usedSlugs.slice(0, 6);
  const available = TOPIC_POOL.filter(t => !recent.some(s => s.startsWith(t.slug_prefix)));
  const pool = available.length >= 2 ? available : TOPIC_POOL;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}
function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        resolve(data);
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
async function callGemini(prompt) {
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.15, maxOutputTokens: 8192, responseMimeType: 'application/json' }, safetySettings: [{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }, { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' }, { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }, { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }] });
  const raw = await httpRequest({ hostname: 'generativelanguage.googleapis.com', path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, body);
  const parsed = JSON.parse(raw);
  if (parsed.error) throw new Error(parsed.error.message);
  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini: respuesta vacia. ' + JSON.stringify(parsed).slice(0, 200));
  return text;
}
async function fetchWikipediaImage(articleTitle) {
  try {
    const title = encodeURIComponent(articleTitle);
    const raw = await httpRequest({ hostname: 'en.wikipedia.org', path: `/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=1200&pilicense=any`, method: 'GET', headers: { 'User-Agent': 'AlejandroCadCam/1.0 (alejandrocadcam.pages.dev)' } });
    const data = JSON.parse(raw);
    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0];
    if (!page?.thumbnail?.source) return null;
    return { url: page.thumbnail.source, credit: `Wikipedia — ${articleTitle}`, link: `https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}` };
  } catch (e) { console.warn('Wikipedia imagen error:', e.message); return null; }
}
function buildPrompt(topic) {
  return `Eres un experto en odontologia digital y disenador CAD dental profesional con formacion clinica avanzada.
Tu unico deber es escribir basado en evidencia publicada en revistas indexadas de alto impacto:
Periodontology 2000, Journal of Dental Research, Journal of Clinical Periodontology,
Journal of Dentistry, Dental Materials, Journal of Prosthetic Dentistry,
Clinical Oral Implants Research, International Journal of Oral & Maxillofacial Implants (IJOS),
Journal of Endodontics, Cochrane Database of Systematic Reviews.
Fuentes autorizadas: PubMed/NCBI, ScienceDirect (Elsevier), JADA (ada.org), SciELO.

Escribe un articulo tecnico riguroso en espanol sobre:
"${topic.tema_es}"

REGLAS ABSOLUTAS:
1. SOLO datos de estudios reales verificables en revistas indexadas
2. JAMAS inventes estadisticas, citas ni DOIs
3. Cada afirmacion tecnica numerica DEBE tener referencia (Apellido et al., Revista, Anio)
4. Referencias en formato Vancouver completo con DOI
5. Minimo 4 referencias con DOI verificable de PubMed o ScienceDirect
6. Nivel tecnico para odontologos y disenadores CAD dentales
7. Minimo 5 secciones tematicas (h2)
8. Minimo una tabla comparativa con datos de estudios reales

Devuelve EXACTAMENTE este JSON (sin texto ni markdown extra):
{"titulo":"Titulo descriptivo en espanol (max 85 chars)","subtitulo":"Resumen del valor clinico en 1-2 oraciones","contenido":[{"t":"p","c":"Parrafo introductorio..."},{"t":"h2","c":"Seccion 1"},{"t":"p","c":"Desarrollo tecnico..."},{"t":"list","items":["Dato 1","Dato 2","Dato 3"]},{"t":"h2","c":"Seccion 2"},{"t":"p","c":"Contenido..."},{"t":"table","headers":["Col1","Col2","Col3"],"rows":[["v1","v2","v3"]]},{"t":"h2","c":"Seccion 3"},{"t":"p","c":"Contenido..."},{"t":"quote","c":"Cita o conclusion relevante","author":"Apellido et al., Revista, Anio"}],"referencias":["Apellido A, et al. Titulo. Revista. Anio;Vol(N):pp. doi:10.XXXX/XXXXX","Apellido B, et al. Titulo. Revista. Anio;Vol:pp. PMID: XXXXXXXX"],"faq":[{"q":"Pregunta clinica frecuente","a":"Respuesta tecnica precisa"},{"q":"Segunda pregunta clinica","a":"Respuesta con recomendacion"}],"social_instagram":"Texto Instagram max 150 chars. Dato sorprendente + 3 hashtags.","social_linkedin":"Texto LinkedIn 2-3 oraciones. Insight tecnico para profesionales. Sin hashtags."}`;
}
function parseGeminiResponse(raw) {
  let jsonStr = raw.trim();
  const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) jsonStr = match[1].trim();
  const data = JSON.parse(jsonStr);
  if (!data.titulo) throw new Error('Falta titulo');
  if (!data.contenido) throw new Error('Falta contenido');
  if (!Array.isArray(data.referencias) || data.referencias.length < 2) throw new Error('Insuficientes referencias');
  return data;
}
function buildArticleObject(topic, aiData, image) {
  return {
    id: uid(topic.slug_prefix), titulo: aiData.titulo, subtitulo: aiData.subtitulo || '',
    categoria: topic.categoria, chip: topic.chip, fecha: todayISO(), lectura: topic.lectura,
    vistas: '0', emoji: topic.emoji, grad: topic.grad,
    og_img: image ? image.url : '', img_credit: image ? image.credit : '', img_link: image ? image.link : '',
    autor: 'Alejandro Carvajal', instagram: 'jackcarvajal',
    contenido: image ? (() => {
      const c = [...(aiData.contenido || [])];
      const firstP = c.findIndex(b => b.t === 'p');
      const imgBlock = { t: 'img', src: image.url, alt: topic.titulo_seed, caption: `${image.credit} - Wikimedia Commons (CC BY-SA)` };
      if (firstP >= 0) c.splice(firstP + 1, 0, imgBlock); else c.unshift(imgBlock);
      return c;
    })() : aiData.contenido,
    faq: aiData.faq || [], referencias: aiData.referencias || []
  };
}
function readExistingArticles() {
  const raw = fs.readFileSync(ARTICLES_PATH, 'utf8');
  const match = raw.match(/const ARTICLES_AC\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error('No se encontro ARTICLES_AC en articles-ac.js');
  return Function('"use strict"; return ' + match[1])();
}
function serializeArticles(articles) {
  const header = `/* ============================================================\n   Alejandro Carvajal CAD/CAM — Base de articulos tecnicos\n   Ultima actualizacion automatica: ${todayISO()}\n   ============================================================ */\n\nconst ARTICLES_AC = [\n\n`;
  const footer = '\n];\n\nif (typeof module !== "undefined") module.exports = { ARTICLES_AC };\n';
  const items = articles.map(a => '/* ─────────────────────────────────────────────────── */\n' + JSON.stringify(a, null, 2)).join(',\n\n');
  return header + items + footer;
}
function writeSocialFile(newArticles, socialDataList) {
  const date = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  let content = '='.repeat(60) + '\nALEJANDRO CAD/CAM AUTO-JOURNAL — ' + date + '\n' + '='.repeat(60) + '\n';
  newArticles.forEach((art, i) => {
    const s = socialDataList[i] || {};
    content += `\nARTICULO: ${art.titulo}\nURL: https://alejandrocadcam.pages.dev/article?id=${art.id}\n`;
    if (art.og_img) content += `IMAGEN: ${art.og_img}\n`;
    content += `\nINSTAGRAM:\n${s.social_instagram || '—'}\n\nLINKEDIN:\n${s.social_linkedin || '—'}\n\n` + '-'.repeat(40) + '\n';
  });
  fs.writeFileSync(SOCIAL_PATH, content, 'utf8');
  console.log('marketing-social-ac.txt generado (GitHub Artifact)');
}
function updateSitemap(articles) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  try {
    let xml = fs.readFileSync(sitemapPath, 'utf8');
    for (const a of articles) {
      const entry = `  <url>\n    <loc>https://alejandrocadcam.pages.dev/article?id=${a.id}</loc>\n    <lastmod>${todayISO()}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
      xml = xml.replace('</urlset>', entry + '\n\n</urlset>');
    }
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`sitemap.xml actualizado con ${articles.length} articulo(s)`);
  } catch (e) { console.warn('No se pudo actualizar sitemap.xml:', e.message); }
}
async function main() {
  if (!GEMINI_KEY) { console.error('GEMINI_API_KEY no definida'); process.exit(1); }
  console.log(`\nAlejandro CAD/CAM Auto-Journal — ${todayISO()}\n`);
  const topics = pickTopics();
  const newArticles = [], socialDataList = [];
  for (const topic of topics) {
    console.log(`\nGenerando: "${topic.titulo_seed}"`);
    try {
      const raw = await callGemini(buildPrompt(topic));
      const aiData = parseGeminiResponse(raw);
      console.log(`Texto: "${aiData.titulo}" | Referencias: ${aiData.referencias.length}`);
      const image = await fetchWikipediaImage(topic.wiki_article);
      if (image) console.log(`Imagen: ${image.credit}`);
      newArticles.push(buildArticleObject(topic, aiData, image));
      socialDataList.push(aiData);
    } catch (err) { console.error(`Error (${topic.slug_prefix}):`, err.message); }
  }
  if (newArticles.length === 0) { console.error('No se genero ningun articulo. Abortando.'); process.exit(1); }
  let existing = [];
  try { existing = readExistingArticles(); console.log(`Articulos existentes: ${existing.length}`); } catch (e) { console.warn('No se pudo leer articles-ac.js:', e.message); }
  const allArticles = [...newArticles, ...existing];
  fs.writeFileSync(ARTICLES_PATH, serializeArticles(allArticles), 'utf8');
  console.log(`articles-ac.js actualizado: ${allArticles.length} articulos totales`);
  writeSocialFile(newArticles, socialDataList);
  updateSitemap(newArticles);
  console.log('\nAuto-Journal completado.\n');
  newArticles.forEach(a => console.log(`  -> ${a.titulo}\n     ID: ${a.id}`));
}
main().catch(err => { console.error('\nFatal:', err.message); process.exit(1); });
