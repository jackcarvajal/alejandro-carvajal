-- ============================================================
-- Alejandro CAD/CAM — Guías Quirúrgicas CDR
-- Precios: Local +20% sobre convenio CDR | Internacional +80%
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- 1. Agregar columna precio_usd si no existe
ALTER TABLE catalogo ADD COLUMN IF NOT EXISTS precio_usd NUMERIC(10,0) DEFAULT 0;

-- 2. Actualizar guías existentes con precios correctos
UPDATE catalogo SET
  precio     = 180000,
  precio_usd = 65,
  nombre     = 'Guía Quirúrgica — 1 implante'
WHERE id = 'guia_1_2';

UPDATE catalogo SET
  precio     = 456000,
  precio_usd = 170,
  nombre     = 'Guía Quirúrgica — Híbrida (4 implantes)'
WHERE id = 'guia_3_4';

UPDATE catalogo SET
  precio     = 720000,
  precio_usd = 180,
  nombre     = 'Guía Quirúrgica — Full Arch / All-on-4'
WHERE id = 'guia_5_mas';

-- 3. Insertar servicios nuevos de cirugía guiada
INSERT INTO catalogo (id, flujo, categoria, nombre, precio, precio_usd, activo) VALUES
  ('guia_adicional',    'diseno', 'cad_quirurgica', 'Implante adicional (c/u)',         60000,  22,  true),
  ('guia_sobredent',    'diseno', 'cad_quirurgica', 'Guía Sobredentadura (2 implantes)',384000, 145, true),
  ('guia_reborde',      'diseno', 'cad_quirurgica', 'Guía Regularización de Reborde',  216000,  80, true),
  ('planif_unit',       'diseno', 'cad_quirurgica', 'Planeación Preliminar — Unitario', 192000,  70, true),
  ('prov_pmma_guia',    'diseno', 'cad_quirurgica', 'Provisional PMMA con Guía',        216000,  80, true),
  ('prov_impreso',      'diseno', 'cad_quirurgica', 'Provisional Impreso',              108000,  40, true)
ON CONFLICT (id) DO UPDATE SET
  precio     = EXCLUDED.precio,
  precio_usd = EXCLUDED.precio_usd,
  nombre     = EXCLUDED.nombre,
  activo     = true;

-- 4. Actualizar precio_usd en servicios CAD existentes
-- (los que ya están en la tabla con precios de diseño general)
UPDATE catalogo SET precio_usd = ROUND(precio / 4000) WHERE flujo = 'diseno' AND precio_usd = 0;
