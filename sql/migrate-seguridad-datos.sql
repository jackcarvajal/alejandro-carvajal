-- SEGURIDAD DE DATOS — Aislamiento cliente/operario
-- Ejecutar en Supabase → SQL Editor

-- 1. Campo código interno del operario en pedidos
ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS operario_codigo text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT NULL;

-- 2. Campo user_id en diseno_revisiones (para saber quién subió cada revisión)
ALTER TABLE diseno_revisiones
  ADD COLUMN IF NOT EXISTS operario_codigo text DEFAULT NULL;

-- 3. RLS en pedidos — cliente solo ve SUS casos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política: cliente ve solo sus propios pedidos
CREATE POLICY IF NOT EXISTS "cliente_solo_sus_pedidos"
  ON pedidos FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.email() = email
    OR auth.email() = doctor
    -- Admin ve todo
    OR auth.email() IN ('jackalejandroc@gmail.com')
  );

-- Política: solo el sistema (service_role) puede insertar/actualizar
CREATE POLICY IF NOT EXISTS "sistema_puede_escribir"
  ON pedidos FOR ALL
  USING (auth.role() = 'service_role' OR auth.email() IN ('jackalejandroc@gmail.com'))
  WITH CHECK (auth.role() = 'service_role' OR auth.email() IN ('jackalejandroc@gmail.com'));

-- 4. Vista segura para operarios — sin PII del cliente
CREATE OR REPLACE VIEW pedidos_operario AS
  SELECT
    id,
    codigo,
    servicio,
    material,
    submaterial,
    estado,
    pago_estado,
    link_diseno,
    diseno_aprobado,
    notas_cambios,
    revisiones_usadas,
    stl_ruta,
    stl_liberado,
    link_stl,
    operario_codigo,
    created_at,
    updated_at,
    flujo,
    negocio,
    -- PII enmascarado
    CONCAT(LEFT(COALESCE(doctor, email, ''), 2), '***') AS cliente_codigo,
    -- Nunca exponer: email, whatsapp, nombre completo, comprobante_url
    NULL::text AS email,
    NULL::text AS whatsapp,
    NULL::text AS comprobante_url
  FROM pedidos;

-- Solo admin puede ver la vista completa
COMMENT ON VIEW pedidos_operario IS 'Vista para operarios — PII del cliente enmascarado';
