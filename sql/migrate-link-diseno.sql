-- Agregar campos de aprobación de diseño a tabla pedidos
-- Ejecutar en Supabase Dashboard → SQL Editor

ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS link_diseno text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS diseno_aprobado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notas_cambios text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS revisiones_usadas int DEFAULT 0;

-- Índice para búsqueda rápida por aprobación pendiente
CREATE INDEX IF NOT EXISTS idx_pedidos_diseno ON pedidos(diseno_aprobado) WHERE link_diseno IS NOT NULL;
