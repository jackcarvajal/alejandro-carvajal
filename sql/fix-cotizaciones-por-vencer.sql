-- ═══════════════════════════════════════════════════════════════
-- FIX alejandro_cotizaciones_por_vencer — misma falla que en PRODIGY:
-- seleccionaba c.codigo / c.doctor / c.whatsapp, inexistentes en la
-- tabla compartida `cotizaciones` (42703). Reales: doctor_nombre,
-- doctor_tel; no hay codigo -> LEFT(id,8). RETURNS TABLE se conserva.
-- Misma BD que PRODIGY (proyecto zgihrwqfyvgyapbwzkvw). No-destructivo.
-- Pegar en Supabase SQL Editor → Run.
-- ═══════════════════════════════════════════════════════════════
-- La función desplegada tiene un tipo de retorno distinto → CREATE OR REPLACE
-- no puede cambiarlo (42P13). Se hace DROP + CREATE.
DROP FUNCTION IF EXISTS public.alejandro_cotizaciones_por_vencer(int);

CREATE OR REPLACE FUNCTION public.alejandro_cotizaciones_por_vencer(p_dias int DEFAULT 7)
RETURNS TABLE(id uuid, codigo text, doctor text, whatsapp text, total numeric, expira_at timestamptz, dias_restantes int)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','superadmin','operario','operator','staff')
    OR (auth.jwt() ->> 'email') = 'jackalejandroc@gmail.com'
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  SELECT c.id, LEFT(c.id::text, 8), c.doctor_nombre, c.doctor_tel, c.total, c.expira_at,
    EXTRACT(DAY FROM c.expira_at - now())::int AS dias_restantes
  FROM public.cotizaciones c
  WHERE c.estado IN ('borrador','enviada')
    AND c.negocio = 'alejandrocadcam'
    AND c.expira_at BETWEEN now() AND now() + (p_dias||' days')::interval
  ORDER BY c.expira_at ASC
  LIMIT 50;
END;
$$;
REVOKE ALL ON FUNCTION public.alejandro_cotizaciones_por_vencer(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.alejandro_cotizaciones_por_vencer(int) TO authenticated;

-- Verificar: SELECT * FROM alejandro_cotizaciones_por_vencer(30);
