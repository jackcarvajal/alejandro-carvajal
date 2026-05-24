#!/usr/bin/env node
/**
 * Alejandro Carvajal CAD/CAM — Auto-Article Generator
 * ─────────────────────────────────────────────────────────────
 * Motor: Google Gemini 2.0 Flash (gratuito, 1500 req/día)
 * Imágenes: Wikipedia REST API (gratuito, sin key)
 * Estándar editorial: SOLO revistas científicas indexadas con DOI
 *
 * Variable de entorno requerida:
 *   GEMINI_API_KEY — Google AI Studio → aistudio.google.com
 *
 * Uso: node scripts/gen-articulo-ac.js
 */

'use strict';

const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ARTICLES_PATH = path.join(__dirname, '..', 'articles-ac.js');
const SOCIAL_PATH   = path.join(__dirname, '..', 'marketing-social-ac.txt');
const GEMINI_KEY    = process.env.GEMINI_API_KEY;

// ── Temas rotativos — perspectiva del diseñador CAD freelance ─────
const TOPIC_POOL = [
  {
    slug_prefix:  'diseno-cad-remoto',
    chip:         'Flujo Remoto',
    emoji:        '📡',
    grad:         'grad-1',
    categoria:    'flujos',
    lectura:      '7 min',
    titulo_seed:  'Flujo de trabajo CAD dental remoto 2026',
    tema_es:      'Protocolos clínicos validados para el flujo de trabajo de diseño CAD dental remoto: requisitos de escáner intraoral (precisión ≥20 µm trueness), formatos de archivo STL/OBJ/PLY, transferencia de registros oclusales digitales y estándares de entrega. Evidencia clínica de precisión en restauraciones diseñadas remotamente vs. en laboratorio tradicional.',
    wiki_article: 'CAD/CAM dentistry',
  },
  {
    slug_prefix:  'materiales-cad',
    chip:         'Materiales',
    emoji:        '💎',
    grad:         'grad-2',
    categoria:    'materiales',
    lectura:      '8 min',
    titulo_seed:  'Materiales para restauraciones CAD/CAM 2026',
    tema_es:      'Propiedades mecánicas y clínicas de los materiales para restauraciones CAD/CAM en 2026: zirconia 3Y-TZP, 4Y-PSZ, 5Y-PSZ, disilicato de litio (e.max CAD), zirconia reforzada con litio (Celtra Duo), PMMA de alta densidad y resinas compuestas nanocerámicas. Comparativa de resistencia flexural, módulo elástico, tenacidad a la fractura y translucidez según estudios ISO 6872 y publicaciones recientes.',
    wiki_article: 'Zirconium dioxide in dentistry',
  },
  {
    slug_prefix:  'guia-quirurgica-digital',
    chip:         'Guías Quirúrgicas',
    emoji:        '🦷',
    grad:         'grad-3',
    categoria:    'guia',
    lectura:      '9 min',
    titulo_seed:  'Precisión de guías quirúrgicas digitales 2026',
    tema_es:      'Meta-análisis y revisiones sistemáticas sobre la precisión de guías quirúrgicas impresas en 3D para implantes: desviaciones angulares, laterales y de profundidad publicadas en Clinical Oral Implants Research, IJOS y Journal of Clinical Periodontology. Comparativa de tipos: dentosoportadas, mucosoportadas e implantoesoportadas. Variables que afectan la precisión: material de impresión 3D, protocolo de esterilización, tolerancias de fresado.',
    wiki_article: 'Dental implant',
  },
  {
    slug_prefix:  'scanner-intraoral-precision',
    chip:         'Escáneres',
    emoji:        '📐',
    grad:         'grad-1',
    categoria:    'diseno',
    lectura:      '7 min',
    titulo_seed:  'Precisión escáneres intraorales para diseño CAD 2026',
    tema_es:      'Evaluación clínica de la precisión (trueness y precision según ISO 5725) de los principales escáneres intraorales para casos de diseño CAD dental en 2026: Medit i700/i900, 3Shape Trios 5, iTero Element 7, Primescan. Estudios in vitro e in vivo publicados en Journal of Dentistry, Journal of Prosthetic Dentistry y Dental Materials. Impacto en la adaptación marginal de restauraciones CAD/CAM.',
    wiki_article: 'Intraoral scanner',
  },
  {
    slug_prefix:  'ferulas-oclusales-cad',
    chip:         'Férulas Oclusales',
    emoji:        '🔬',
    grad:         'grad-2',
    categoria:    'ferula',
    lectura:      '6 min',
    titulo_seed:  'Férulas oclusales CAD vs convencional — evidencia 2026',
    tema_es:      'Comparativa clínica y técnica de férulas oclusales fabricadas por CAD/CAM vs. convencionales (resina acrílica de presión): adaptación, retención, dureza Vickers, estabilidad dimensional y efectividad clínica en bruxismo y DTM. Revisión de ensayos clínicos publicados en Journal of Oral Rehabilitation, Journal of Prosthetic Dentistry y Journal of Craniomandibular & Sleep Practice.',
    wiki_article: 'Occlusal splint',
  },
  {
    slug_prefix:  'full-arch-digital',
    chip:         'Full Arch',
    emoji:        '⚙️',
    grad:         'grad-3',
    categoria:    'flujos',
    lectura:      '10 min',
    titulo_seed:  'Protocolo Full Arch digital — precisión y evidencia 2026',
    tema_es:      'Protocolo clínico basado en evidencia para rehabilitaciones Full Arch digitales (All-on-4, All-on-6): digitalización de arco completo con escáner intraoral, técnicas de verificación de arco, diseño CAD de estructura metálica y prótesis final. Tasas de éxito implantario, desajuste pasivo y satisfacción del paciente según meta-análisis recientes en IJOS y Clinical Oral Implants Research.',
    wiki_article: 'All-on-4',
  },
  {
    slug_prefix:  'exocad-eficiencia',
    chip:         'Software CAD',
    emoji:        '🖥️',
    grad:         'grad-1',
    categoria:    'software',
    lectura:      '7 min',
    titulo_seed:  'Eficiencia y precisión en Exocad DentalCAD — evidencia clínica 2026',
    tema_es:      'Evaluación de la precisión y eficiencia del software Exocad DentalCAD para el diseño de restauraciones dentales: estudios de adaptación marginal, tiempo de diseño, curva de aprendizaje y comparativa con 3Shape Dental System. Publicaciones en Journal of Prosthetic Dentistry, International Journal of Computerized Dentistry y Journal of Dental Education.',
    wiki_article: 'CAD/CAM dentistry',
  },
  {
    slug_prefix:  'ia-dental-cad',
    chip:         'IA en CAD',
    emoji:        '🤖',
    grad:         'grad-2',
    categoria:    'ia',
    lectura:      '8 min',
    titulo_seed:  'Inteligencia artificial en diseño CAD dental — estado del arte 2026',
    tema_es:      'Aplicaciones de inteligencia artificial y aprendizaje automático en diseño CAD dental: segmentación automática de márgenes, propuesta de anatomía oclusal, detección de colisiones y optimización de contactos proximales. Estudios de validación publicados en Journal of Dental Research, Computers in Biology and Medicine y Journal of Dentistry. Precisión comparada con diseño manual por expertos.',
    wiki_article: 'Artificial intelligence in healthcare',
  },
  // ── TEMAS COMPARTIDOS — materiales, máquinas, marcas, SEO ────────
  {
    slug_prefix:  'emax-cad-ivoclar',
    chip:         'Materiales',
    emoji:        '💎',
    grad:         'grad-3',
    categoria:    'materiales',
    lectura:      '7 min',
    titulo_seed:  'IPS e.max CAD Ivoclar — propiedades y casos clínicos',
    tema_es:      'Análisis clínico del disilicato de litio IPS e.max CAD (Ivoclar Vivadent): resistencia flexural (≥400 MPa), módulo de elasticidad, translucidez por bloque (LT, MO, HT, BL), protocolo de cristalización en horno Programat y adaptación marginal en coronas monolíticas. Comparativa con IPS e.max Press. Estudios en Journal of Prosthetic Dentistry y Dental Materials 2022-2025.',
    wiki_article: 'Lithium disilicate',
  },
  {
    slug_prefix:  'zirconia-katana-dd',
    chip:         'Materiales',
    emoji:        '💎',
    grad:         'grad-4',
    categoria:    'materiales',
    lectura:      '7 min',
    titulo_seed:  'Zirconia Katana vs DD Bio ZW+ — comparativa propiedades',
    tema_es:      'Comparativa de propiedades mecánicas y ópticas de las zirconias de alta translucidez líderes del mercado: Katana STML/UTML (Kuraray Noritake), DD Bio ZW+ (Dental Direkt), Prettau Anterior (Zirkonzahn) y Cercon ht (Dentsply Sirona). Resistencia flexural, tenacidad a fractura, translucidez (%T) y comportamiento clínico publicados en Dental Materials y Journal of Dentistry.',
    wiki_article: 'Zirconium dioxide in dentistry',
  },
  {
    slug_prefix:  'celtra-vita-enamic',
    chip:         'Materiales',
    emoji:        '🔬',
    grad:         'grad-5',
    categoria:    'materiales',
    lectura:      '6 min',
    titulo_seed:  'Celtra Duo vs Vita Enamic — cerámica híbrida para CAD/CAM',
    tema_es:      'Comparativa clínica de las principales cerámicas híbridas para fresado CAD/CAM: Celtra Duo (Dentsply Sirona) vs Vita Enamic (Vita Zahnfabrik). Propiedades mecánicas, módulo elástico, resistencia al desgaste, biocompatibilidad y supervivencia clínica a 3-5 años. Publicaciones en Journal of Dentistry, Dental Materials y Clinical Oral Investigations.',
    wiki_article: 'Dental ceramics',
  },
  {
    slug_prefix:  'pmma-provisional',
    chip:         'Materiales',
    emoji:        '🦷',
    grad:         'grad-1',
    categoria:    'materiales',
    lectura:      '6 min',
    titulo_seed:  'PMMA multicapa para provisionales CAD/CAM — Ivotion y alternativas',
    tema_es:      'Uso clínico del PMMA de alta densidad multicapa para prótesis provisionales y de larga duración: bloques Ivotion (Ivoclar), Temp Premium (Amann Girrbach), VITA CAD-Temp multiColor. Propiedades mecánicas, estética y comportamiento en rehabilitaciones Full Arch. Estudios en Journal of Prosthetic Dentistry y Clinical Oral Investigations.',
    wiki_article: 'Polymethyl methacrylate',
  },
  {
    slug_prefix:  'vita-suprinity',
    chip:         'Materiales',
    emoji:        '💎',
    grad:         'grad-2',
    categoria:    'materiales',
    lectura:      '6 min',
    titulo_seed:  'Vita Suprinity — zirconia reforzada con silicato de litio en CAD/CAM',
    tema_es:      'Caracterización clínica de Vita Suprinity PC (Vita Zahnfabrik): composición, resistencia flexural (420 MPa pre-cristalización, 700 MPa post), protocolo de cristalización y comparativa estética frente a IPS e.max CAD. Estudios en Dental Materials, Journal of Dentistry y Operative Dentistry.',
    wiki_article: 'Dental ceramics',
  },
  {
    slug_prefix:  'resinas-3d-nextdent',
    chip:         'Impresión 3D',
    emoji:        '🖨️',
    grad:         'grad-3',
    categoria:    'fabricacion',
    lectura:      '6 min',
    titulo_seed:  'Resinas 3D dentales — NextDent, SprintRay y Carbon DLS',
    tema_es:      'Comparativa de resinas fotopolimerizables de clase II CE/FDA para impresión 3D dental: NextDent Splint & Tray, SprintRay Crown SG, Carbon DLS RPU 130. Resistencia flexural, precisión dimensional (µm), biocompatibilidad ISO 10993 y comportamiento clínico en guías quirúrgicas, provisionales y férulas. Estudios en Journal of Prosthetic Dentistry y Dental Materials.',
    wiki_article: '3D printing in dentistry',
  },
  {
    slug_prefix:  'fresadoras-5ejes',
    chip:         'Fresadoras',
    emoji:        '⚙️',
    grad:         'grad-4',
    categoria:    'maquinaria',
    lectura:      '8 min',
    titulo_seed:  'Fresadoras dentales 5 ejes — Amann Girrbach, Roland, VHF, XTCERA',
    tema_es:      'Comparativa técnica de fresadoras dentales de 5 ejes: Amann Girrbach Ceramill Motion 3, Roland DWX-52DCi, VHF K5+ cameo, XTCERA M5 Pro y Dentsply Sirona inLab MC X5. Precisión de fresado (±10 µm), materiales compatibles (zirconia, titanio, PMMA, e.max CAD), velocidad de husillo y costo operativo. Publicaciones en Journal of Prosthetic Dentistry e International Journal of Computerized Dentistry.',
    wiki_article: 'Dental milling machine',
  },
  {
    slug_prefix:  'scanner-lab-vs-intraoral',
    chip:         'Escáneres Lab',
    emoji:        '📡',
    grad:         'grad-5',
    categoria:    'diseno',
    lectura:      '7 min',
    titulo_seed:  'Escáner de laboratorio vs intraoral — Medit T710 vs i900',
    tema_es:      'Comparativa de precisión y flujo de trabajo entre escáneres de laboratorio (Medit T710, 3Shape D2000, Shining3D AutoScan DS-MIX) y escáneres intraorales (Medit i900, Trios 5) para diseño CAD dental. Trueness, precision, compatibilidad de software, tiempo de escaneado y casos de uso óptimos. Publicaciones en Journal of Dentistry y Journal of Prosthetic Dentistry.',
    wiki_article: 'Intraoral scanner',
  },
  {
    slug_prefix:  'hornos-sinterizacion',
    chip:         'Equipos Lab',
    emoji:        '🔥',
    grad:         'grad-1',
    categoria:    'maquinaria',
    lectura:      '6 min',
    titulo_seed:  'Hornos de sinterización de zirconia — Programat S1, Vita Zyrcomat 6100',
    tema_es:      'Impacto del protocolo de sinterización en las propiedades finales de la zirconia dental: ciclo estándar (8h) vs. alta velocidad (75 min). Comparativa de hornos Ivoclar Programat S1, Vita Zyrcomat 6100 MS, Dentsply Sirona inFire HTC Speed y Amann Girrbach Oven S1. Efecto sobre translucidez, resistencia flexural y adaptación marginal. Estudios en Dental Materials y Journal of Prosthetic Dentistry.',
    wiki_article: 'Zirconium dioxide in dentistry',
  },
  {
    slug_prefix:  'implantes-straumann',
    chip:         'Implantología',
    emoji:        '🦷',
    grad:         'grad-2',
    categoria:    'implantologia',
    lectura:      '7 min',
    titulo_seed:  'Implantes Straumann BLX y BLT — evidencia clínica',
    tema_es:      'Revisión de evidencia clínica sobre Straumann BLX (Roxolid SLActive) y BLT: torque de inserción, estabilidad primaria (ISQ), osteointegración acelerada, tasas de éxito a 5 años y protocolo de carga inmediata. Publicaciones en Clinical Oral Implants Research, IJOS y Periodontology 2000.',
    wiki_article: 'Dental implant',
  },
  {
    slug_prefix:  'implantes-nobel',
    chip:         'Implantología',
    emoji:        '🦷',
    grad:         'grad-3',
    categoria:    'implantologia',
    lectura:      '8 min',
    titulo_seed:  'Nobel Biocare All-on-4 — protocolo, materiales y supervivencia',
    tema_es:      'Revisión sistemática y meta-análisis del protocolo All-on-4 con Nobel Biocare (Nobel Active, NobelParallel Conical Connection): supervivencia implantaria (>95% a 5 años), pérdida ósea marginal, complicaciones y comparativa con All-on-6. Publicaciones en Clinical Oral Implants Research, IJOS y Journal of Clinical Periodontology.',
    wiki_article: 'All-on-4',
  },
  {
    slug_prefix:  'implantes-osstem',
    chip:         'Implantología',
    emoji:        '🦷',
    grad:         'grad-4',
    categoria:    'implantologia',
    lectura:      '7 min',
    titulo_seed:  'Osstem TS III vs MegaGen AnyRidge — evidencia comparativa',
    tema_es:      'Comparativa de implantes coreanos líderes: Osstem TSIII SA y MegaGen AnyRidge. Diseño de macro y microestructura, torque de inserción en hueso tipo III-IV, osteointegración y tasas de supervivencia. Ensayos clínicos en Clinical Oral Implants Research, Journal of Clinical Periodontology e IJOS.',
    wiki_article: 'Dental implant',
  },
  {
    slug_prefix:  'exocad-vs-3shape',
    chip:         'Software CAD',
    emoji:        '🖥️',
    grad:         'grad-5',
    categoria:    'software',
    lectura:      '7 min',
    titulo_seed:  'Exocad vs 3Shape Dental System — ¿cuál elegir?',
    tema_es:      'Comparativa técnica de Exocad DentalCAD 3.5 Rijeka y 3Shape Dental System 2025: módulos, compatibilidad con escáneres, precisión de diseño, curva de aprendizaje, licencias y adopción global. Datos de satisfacción publicados en International Journal of Computerized Dentistry y Journal of Prosthetic Dentistry.',
    wiki_article: 'CAD/CAM dentistry',
  },
  {
    slug_prefix:  'cementacion-adhesiva-ceramicas',
    chip:         'Protocolos',
    emoji:        '🔬',
    grad:         'grad-1',
    categoria:    'clinica',
    lectura:      '6 min',
    titulo_seed:  'Cementación adhesiva en cerámicas CAD/CAM — protocolo basado en evidencia',
    tema_es:      'Protocolo de cementación adhesiva para restauraciones CAD/CAM según sustrato: grabado HF 5% + silano (disilicato de litio), MDP + sandblasting (zirconia). Cementos resinosos: RelyX Ultimate 3M, Variolink Esthetic Ivoclar, Panavia V5 Kuraray. Resistencia de unión y supervivencia clínica. Publicaciones en Journal of Prosthetic Dentistry, Operative Dentistry y Dental Materials.',
    wiki_article: 'Dental bonding',
  },
  {
    slug_prefix:  'dsd-protocolo',
    chip:         'Diseño Sonrisa',
    emoji:        '✨',
    grad:         'grad-2',
    categoria:    'estetica',
    lectura:      '6 min',
    titulo_seed:  'Diseño Digital de Sonrisa DSD — protocolo actualizado',
    tema_es:      'Protocolo actualizado de Digital Smile Design (DSD): integración de fotografía facial, escáner intraoral y software de planificación estética (DSD App, Smile Designer Pro, 3Shape Smile Design). Validación del mockup digital frente a encerado físico y satisfacción del paciente. Estudios en Journal of Esthetic and Restorative Dentistry y Journal of Prosthetic Dentistry.',
    wiki_article: 'Cosmetic dentistry',
  },
  {
    slug_prefix:  'ia-pearl-overjet',
    chip:         'Inteligencia Artificial',
    emoji:        '🤖',
    grad:         'grad-3',
    categoria:    'innovacion',
    lectura:      '7 min',
    titulo_seed:  'IA en odontología — Pearl, Overjet y detección de caries por radiografía',
    tema_es:      'Estado del arte de la IA en odontología diagnóstica: Pearl AI y Overjet para detección automática de caries y pérdida ósea periimplantaria en radiografías (aprobados FDA). IA en CAD para segmentación de márgenes automática. Estudios de validación en Journal of Dental Research, Dentomaxillofacial Radiology y Journal of Dentistry.',
    wiki_article: 'Artificial intelligence in healthcare',
  },
  {
    slug_prefix:  'alineadores-invisalign-vs-lab',
    chip:         'Ortodoncia Digital',
    emoji:        '📐',
    grad:         'grad-4',
    categoria:    'ortodoncia',
    lectura:      '6 min',
    titulo_seed:  'Invisalign vs alineadores de laboratorio — eficacia clínica',
    tema_es:      'Comparativa clínica entre Invisalign (ClinCheck) y alineadores de laboratorio (uLab, 3Shape Ortho Analyzer, OrthoAnalyzer): eficacia de movimiento dental, precisión de los alineadores impresos en 3D, tasa de refinamientos y costo-beneficio. Publicaciones en American Journal of Orthodontics y Angle Orthodontist.',
    wiki_article: 'Clear aligners',
  },
  {
    slug_prefix:  'flujo-digital-lab',
    chip:         'Flujo Digital',
    emoji:        '⚙️',
    grad:         'grad-5',
    categoria:    'tecnologia',
    lectura:      '7 min',
    titulo_seed:  'Flujo de trabajo 100% digital en laboratorio dental',
    tema_es:      'Implementación del flujo completamente digital en laboratorio dental: escáner de laboratorio (Medit T710, 3Shape D2000), software CAD (Exocad, 3Shape), fresadora (Amann Girrbach, Roland, VHF) e impresora 3D (SprintRay, Asiga). Ventajas frente al flujo analógico: tiempo de turnaround, precisión, trazabilidad y costos. Estudios en Journal of Prosthetic Dentistry e International Journal of Computerized Dentistry.',
    wiki_article: 'Dental laboratory',
  },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${todayISO()}-${crypto.randomBytes(2).toString('hex')}`;
}

function pickTopics() {
  // Leer slugs ya publicados para evitar repetir tema reciente
  let usedSlugs = [];
  try {
    const raw = fs.readFileSync(ARTICLES_PATH, 'utf8');
    const matches = raw.match(/slug:\s*['"]([^'"]+)['"]/g) || [];
    usedSlugs = matches.map(m => m.replace(/slug:\s*['"]/, '').replace(/['"]/, ''));
  } catch (e) { /* archivo nuevo, continuar */ }

  // Pool sin los slugs usados recientemente (últimos 6)
  const recent = usedSlugs.slice(0, 6);
  const available = TOPIC_POOL.filter(t => !recent.some(s => s.startsWith(t.slug_prefix)));
  const pool = available.length >= 1 ? available : TOPIC_POOL;

  // Selección aleatoria de 1 tema
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [shuffled[0]];
}

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0,300)}`));
        resolve(data);
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function callGemini(prompt) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.15,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  });
  const raw = await httpRequest({
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  }, body);
  const parsed = JSON.parse(raw);
  if (parsed.error) throw new Error(parsed.error.message);
  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini: respuesta vacía');
  return text;
}

async function fetchWikipediaImage(articleTitle) {
  try {
    const title = encodeURIComponent(articleTitle);
    const raw = await httpRequest({
      hostname: 'en.wikipedia.org',
      path: `/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=1200&pilicense=any`,
      method: 'GET',
      headers: { 'User-Agent': 'AlejandroCadCam/1.0 (alejandrocadcam.pages.dev)' }
    });
    const data  = JSON.parse(raw);
    const page  = Object.values(data.query?.pages || {})[0];
    if (!page?.thumbnail?.source) return null;
    return {
      url:    page.thumbnail.source,
      credit: `Wikipedia — ${articleTitle}`,
      link:   `https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}`
    };
  } catch (e) {
    console.warn('⚠️  Wikipedia imagen error:', e.message);
    return null;
  }
}

function buildPrompt(topic) {
  return `Eres un experto en odontología digital y redactor científico con formación doctoral en ciencias de la salud oral.
Tu ÚNICO deber es escribir basado en evidencia publicada en revistas indexadas de alto impacto:
Periodontology 2000 · Journal of Dental Research (JDR) · Journal of Clinical Periodontology
Journal of Dentistry · Dental Materials · Journal of Prosthetic Dentistry
Clinical Oral Implants Research · IJOS · Journal of Endodontics
Cochrane Database of Systematic Reviews · Journal of Oral Rehabilitation

Fuentes de búsqueda autorizadas: PubMed/NCBI · ScienceDirect (Elsevier) · JADA (ada.org) · SciELO

Escribe un artículo técnico riguroso en español sobre:
"${topic.tema_es}"

REGLAS ABSOLUTAS — VIOLACIÓN = ARTÍCULO RECHAZADO:
1. SOLO datos de estudios reales y verificables publicados en revistas indexadas
2. JAMÁS inventes estadísticas, porcentajes, citas ni DOIs — si no tienes certeza 100%, omite el dato
3. JAMÁS uses frases vagas como "estudios muestran" sin citar la fuente exacta (Apellido et al., Revista, Año)
4. Cada afirmación técnica numérica DEBE tener referencia entre paréntesis
5. Referencias en formato Vancouver completo con DOI verificable en PubMed o ScienceDirect
6. Mínimo 4 referencias con DOI real
7. Nivel técnico para odontólogos generales y técnicos dentales especializados
8. Mínimo 5 secciones temáticas (h2)
9. Una tabla comparativa con datos de estudios reales (indicar fuente)

Devuelve EXACTAMENTE este JSON (sin texto antes ni después, sin markdown):
{
  "titulo": "Título descriptivo y preciso en español (máx 85 chars)",
  "subtitulo": "Resumen del valor clínico en 1-2 oraciones con dato clave y fuente",
  "contenido": [
    {"t": "p", "c": "Párrafo introductorio con contexto clínico, epidemiología y gap de conocimiento..."},
    {"t": "h2", "c": "Sección 1"},
    {"t": "p", "c": "Contenido técnico con datos verificables y referencias (Apellido et al., Revista, Año)..."},
    {"t": "table", "headers": ["Criterio","Opción A","Opción B","Fuente"], "rows": [["...","...","...","Apellido et al., Revista, Año"]]},
    {"t": "h2", "c": "Sección 2"},
    {"t": "p", "c": "Contenido..."},
    {"t": "list", "items": ["Dato con referencia (Apellido, Año)", "Dato 2 (Apellido, Año)"]},
    {"t": "h2", "c": "Sección 3"},
    {"t": "p", "c": "Contenido..."},
    {"t": "h2", "c": "Sección 4"},
    {"t": "p", "c": "Contenido..."},
    {"t": "h2", "c": "Sección 5"},
    {"t": "p", "c": "Contenido..."},
    {"t": "quote", "c": "Cita textual o conclusión de estudio con datos concretos", "author": "Apellido et al., Revista, Año"}
  ],
  "referencias": [
    "Apellido AI, Apellido BJ. Título completo. Nombre Revista. Año;Vol(N):pp-pp. doi:10.XXXX/XXXXX",
    "Apellido C, Apellido D, et al. Título. Revista. Año;Vol:pp. doi:10.XXXX/XXXXX",
    "Apellido E et al. Título. Revista. Año;Vol(N):pp-pp. PMID: XXXXXXXX",
    "Apellido F, Apellido G. Título. Revista. Año;Vol(N):pp-pp. doi:10.XXXX/XXXXX"
  ],
  "faq": [
    {"q": "Pregunta clínica frecuente y práctica sobre el tema", "a": "Respuesta técnica precisa con referencia a evidencia publicada"},
    {"q": "Segunda pregunta clínica aplicable en la práctica diaria", "a": "Respuesta con recomendación clínica basada en estudio específico"}
  ],
  "social_instagram": "Texto máx 150 chars con dato clínico verificado + 3 hashtags odontología.",
  "social_linkedin": "2-3 oraciones. Insight técnico-científico para profesionales dentales. Sin hashtags."
}`;
}

function parseGeminiResponse(raw) {
  let jsonStr = raw.trim();
  const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) jsonStr = match[1].trim();
  const data = JSON.parse(jsonStr);
  if (!data.titulo)    throw new Error('Falta titulo');
  if (!data.contenido) throw new Error('Falta contenido');
  if (!Array.isArray(data.referencias) || data.referencias.length < 3)
    throw new Error('Insuficientes referencias — se requieren mínimo 4');
  return data;
}

function buildArticleObject(topic, aiData, image) {
  const contenido = aiData.contenido || [];
  if (image) {
    const firstP = contenido.findIndex(b => b.t === 'p');
    const imgBlock = { t:'img', src: image.url, alt: topic.titulo_seed,
      caption: `${image.credit} · Wikimedia Commons (CC BY-SA)` };
    if (firstP >= 0) contenido.splice(firstP + 1, 0, imgBlock);
    else contenido.unshift(imgBlock);
  }
  return {
    id:         uid(topic.slug_prefix),
    titulo:     aiData.titulo,
    subtitulo:  aiData.subtitulo || '',
    categoria:  topic.categoria,
    chip:       topic.chip,
    fecha:      todayISO(),
    lectura:    topic.lectura,
    vistas:     '0',
    emoji:      topic.emoji,
    grad:       topic.grad,
    og_img:     image ? image.url : '',
    img_credit: image ? image.credit : '',
    img_link:   image ? image.link  : '',
    autor:      'Alejandro Carvajal',
    instagram:  'jackcarvajal',
    contenido,
    faq:        aiData.faq || [],
    referencias: aiData.referencias || []
  };
}

function readExistingArticles() {
  const raw = fs.readFileSync(ARTICLES_PATH, 'utf8');
  const match = raw.match(/const ARTICLES_AC\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error('No se encontró ARTICLES_AC en articles-ac.js');
  // eslint-disable-next-line no-new-func
  return Function('"use strict"; return ' + match[1])();
}

function serializeArticles(articles) {
  const header =
`/* ============================================================
   Alejandro Carvajal CAD/CAM — Base de artículos técnicos
   Estándar editorial: solo revistas indexadas con DOI verificable
   Para agregar manualmente: copia un objeto y llena los campos.
   Para generar automáticamente: node scripts/gen-articulo-ac.js
   Última actualización automática: ${todayISO()}
   ============================================================ */

const ARTICLES_AC = [

`;
  const footer = `
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
  guia:      '/assets/journal/cover-clinico.svg',
  ferula:    '/assets/journal/cover-clinico.svg',
};

function getArticleCoverAC(article) {
  if (article && article.og_img && article.og_img.trim()) return article.og_img;
  return CATEGORY_COVERS_AC[article && article.categoria] || '/assets/journal/cover-flujos.svg';
}

if (typeof module !== 'undefined') module.exports = { ARTICLES_AC };
`;
  const items = articles
    .map(a =>
      '/* ─────────────────────────────────────────────────── */\n' +
      JSON.stringify(a, null, 2)
    )
    .join(',\n\n');

  return header + items + footer;
}

function writeSocialFile(article, socialData) {
  const date = new Date().toLocaleDateString('es-CO', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  const sep = '═'.repeat(60);
  const url = `https://alejandrocadcam.pages.dev/article?id=${article.id}`;
  let content = `${sep}\nALEJANDRO CAD/CAM — Auto-Article ${date}\n${sep}\n`;
  content += `\n📝 ARTÍCULO: ${article.titulo}\n`;
  content += `🔗 URL: ${url}\n`;
  if (article.og_img) content += `🖼️  IMAGEN: ${article.og_img}\n`;
  content += `\n📸 INSTAGRAM:\n${socialData.social_instagram || '—'}\n`;
  content += `\n💼 LINKEDIN:\n${socialData.social_linkedin || '—'}\n`;
  fs.writeFileSync(SOCIAL_PATH, content, 'utf8');
  console.log('✅ marketing-social-ac.txt generado');
}

async function updateSitemap(articleId) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const newEntry = `  <url>
    <loc>https://alejandrocadcam.pages.dev/article?id=${articleId}</loc>
    <lastmod>${todayISO()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`;
  xml = xml.replace('</urlset>', newEntry + '\n\n</urlset>');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`✅ sitemap.xml actualizado con ${articleId}`);
}

async function main() {
  if (!GEMINI_KEY) {
    console.error('❌ GEMINI_API_KEY no está definida');
    process.exit(1);
  }

  console.log(`\n🚀 Alejandro CAD/CAM Auto-Article — ${todayISO()}`);
  console.log('📚 Estándar: solo revistas indexadas con DOI verificable\n');

  const [topic] = pickTopics();
  console.log(`── Generando: "${topic.titulo_seed}"`);

  const raw    = await callGemini(buildPrompt(topic));
  const aiData = parseGeminiResponse(raw);
  console.log(`✅ Texto: "${aiData.titulo}"`);
  console.log(`📚 Referencias: ${aiData.referencias.length}`);

  const image = await fetchWikipediaImage(topic.wiki_article);
  if (image) console.log(`🖼️  Imagen: ${image.credit}`);

  const article = buildArticleObject(topic, aiData, image);

  let existing = [];
  try {
    existing = readExistingArticles();
    console.log(`📚 Artículos existentes: ${existing.length}`);
  } catch (e) {
    console.warn('⚠️  No se pudo leer articles-ac.js:', e.message);
  }

  const allArticles = [article, ...existing];
  fs.writeFileSync(ARTICLES_PATH, serializeArticles(allArticles), 'utf8');
  console.log(`✅ articles-ac.js → ${allArticles.length} artículos totales`);

  await updateSitemap(article.id);
  writeSocialFile(article, aiData);

  console.log('\n🎉 Artículo generado:');
  console.log(`   → ${article.titulo}`);
  console.log(`   → ID: ${article.id}`);
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
