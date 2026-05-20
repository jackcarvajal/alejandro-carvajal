-- Agregar columna negocio a tabla pedidos para separar PRODIGY y alejandrocadcam
-- Ejecutar en Supabase Dashboard → SQL Editor

ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS negocio text DEFAULT NULL;

-- Marcar pedidos existentes como PRODIGY (todos los anteriores son de PRODIGY)
UPDATE pedidos
  SET negocio = 'prodigy'
  WHERE negocio IS NULL;

-- Índice para filtrar por negocio rápido
CREATE INDEX IF NOT EXISTS idx_pedidos_negocio ON pedidos(negocio);
