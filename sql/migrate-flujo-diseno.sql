-- FLUJO COMPLETO DE DISEÑO CAD — alejandrocadcam
-- Ejecutar en Supabase → SQL Editor

-- 1. Campos en tabla pedidos
ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS pago_estado        text    DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS comprobante_url    text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS link_diseno        text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS diseno_aprobado    boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notas_cambios      text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS revisiones_usadas  int     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stl_ruta           text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stl_liberado       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS fotos_feedback     text[]  DEFAULT '{}';

-- 2. Tabla historial de revisiones del diseño
CREATE TABLE IF NOT EXISTS diseno_revisiones (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id     uuid NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  revision_num  int  NOT NULL DEFAULT 1,
  link_html     text,
  stl_ruta      text,
  notas_cliente text,
  fotos_cliente text[] DEFAULT '{}',
  creado_en     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revisiones_pedido ON diseno_revisiones(pedido_id);

-- 3. Tabla de notificaciones WA enviadas (log)
CREATE TABLE IF NOT EXISTS notificaciones_wa (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id   uuid REFERENCES pedidos(id) ON DELETE SET NULL,
  codigo      text,
  tipo        text,  -- 'pago_recibido'|'diseno_listo'|'aprobado'|'cambios'|'entregado'
  mensaje     text,
  enviado_en  timestamptz DEFAULT now()
);

-- 4. Bucket Storage para STL (ejecutar desde Storage UI si no existe)
-- Bucket: 'disenos-cad'  → Private (NO público)
-- RLS: solo service_role puede leer/escribir
