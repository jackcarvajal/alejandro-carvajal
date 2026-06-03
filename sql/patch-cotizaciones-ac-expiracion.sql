-- ============================================================
-- Alejandro CAD/CAM — Expiración automática de cotizaciones
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Asegurar que expira_at existe con default 30 días
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='cotizaciones' AND column_name='expira_at'
  ) THEN
    ALTER TABLE public.cotizaciones ADD COLUMN expira_at timestamptz DEFAULT (now() + interval '30 days');
  END IF;
END;
$$;

-- 2. Retroactivo: fijar expira_at donde falta
UPDATE public.cotizaciones
SET expira_at = created_at + interval '30 days'
WHERE expira_at IS NULL AND created_at IS NOT NULL AND negocio = 'alejandrocadcam';

-- 3. RPC: expirar cotizaciones AC vencidas
DROP FUNCTION IF EXISTS public.alejandro_expirar_cotizaciones();
CREATE OR REPLACE FUNCTION public.alejandro_expirar_cotizaciones()
RETURNS int LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE _n int;
BEGIN
  UPDATE public.cotizaciones
  SET estado = 'expirada'
  WHERE estado IN ('borrador','enviada')
    AND expira_at < now()
    AND negocio = 'alejandrocadcam';
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END;
$$;

-- 4. RPC: cotizaciones AC por vencer (para alertas admin)
DROP FUNCTION IF EXISTS public.alejandro_cotizaciones_por_vencer(int);
CREATE OR REPLACE FUNCTION public.alejandro_cotizaciones_por_vencer(p_dias int DEFAULT 7)
RETURNS TABLE(id uuid, codigo text, doctor text, whatsapp text, total numeric, expira_at timestamptz, dias_restantes int)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.codigo, c.doctor, c.whatsapp, c.total, c.expira_at,
    EXTRACT(DAY FROM c.expira_at - now())::int AS dias_restantes
  FROM public.cotizaciones c
  WHERE c.estado IN ('borrador','enviada')
    AND c.negocio = 'alejandrocadcam'
    AND c.expira_at BETWEEN now() AND now() + (p_dias||' days')::interval
  ORDER BY c.expira_at ASC
  LIMIT 50;
END;
$$;

-- 5. Índice para queries de vencimiento AC
CREATE INDEX IF NOT EXISTS idx_cotiz_expira_ac ON public.cotizaciones (expira_at, estado, negocio) WHERE estado IN ('borrador','enviada') AND negocio = 'alejandrocadcam';

SELECT 'cotizaciones expiracion AC OK' AS status;
