-- ============================================================
-- Alejandro CAD/CAM — Tabla logs_incidencias
-- Para trazabilidad de pedidos (aprobaciones, entregas, cambios)
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.logs_incidencias (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now(),
  pedido_id   uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
  tipo        text NOT NULL,        -- PEDIDO_CREADO, DISENO_APROBADO, ENTREGADO, AJUSTE, etc.
  severidad   text DEFAULT 'INFO',  -- INFO, WARN, ERROR
  descripcion text,
  resuelta    boolean DEFAULT false,
  negocio     text DEFAULT 'alejandrocadcam'
);

CREATE INDEX IF NOT EXISTS idx_logs_ac_pedido ON public.logs_incidencias (pedido_id, created_at DESC) WHERE negocio='alejandrocadcam';
CREATE INDEX IF NOT EXISTS idx_logs_ac_tipo ON public.logs_incidencias (tipo, negocio, created_at DESC);

ALTER TABLE public.logs_incidencias ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.logs_incidencias TO service_role;
GRANT SELECT ON TABLE public.logs_incidencias TO authenticated;

-- Admin lee todos los logs AC
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='logs_incidencias' AND policyname='admin_lee_logs_ac'
  ) THEN
    CREATE POLICY "admin_lee_logs_ac" ON public.logs_incidencias
      FOR SELECT TO authenticated
      USING (negocio='alejandrocadcam' AND auth.jwt()->'app_metadata'->>'role' IN ('admin','superadmin'));
  END IF;
END;
$$;

-- RPC: actividad del día AC
CREATE OR REPLACE FUNCTION public.alejandro_actividad_hoy()
RETURNS TABLE(tipo text, total bigint, ultima_vez timestamptz)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT l.tipo, COUNT(*) AS total, MAX(l.created_at) AS ultima_vez
  FROM public.logs_incidencias l
  WHERE l.negocio='alejandrocadcam'
    AND l.created_at >= CURRENT_DATE
  GROUP BY l.tipo
  ORDER BY total DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.alejandro_actividad_hoy() TO authenticated;

SELECT 'logs_incidencias AC OK' AS status;
