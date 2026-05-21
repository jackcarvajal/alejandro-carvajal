-- ============================================================
-- PATCH: Columnas faltantes en tabla portfolio para alejandrocadcam
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- Columnas de negocio y metadatos de diseño
ALTER TABLE portfolio
  ADD COLUMN IF NOT EXISTS negocio      TEXT DEFAULT 'prodigy',
  ADD COLUMN IF NOT EXISTS tipo_trabajo TEXT,
  ADD COLUMN IF NOT EXISTS software     TEXT,
  ADD COLUMN IF NOT EXISTS destacado    BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS exocad_url   TEXT;

-- Índice para filtrar por negocio eficientemente
CREATE INDEX IF NOT EXISTS idx_portfolio_negocio ON portfolio(negocio);

-- RLS: lectura pública filtrada por negocio (ya existe anon_read_portfolio — no conflicto)
-- Escritura: solo admin (ya existe admin_write_portfolio)
