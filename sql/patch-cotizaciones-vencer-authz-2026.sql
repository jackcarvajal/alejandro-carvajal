-- ============================================================
-- Alejandro CAD/CAM — RPCs de cotizaciones sin ninguna verificación de rol
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Hallazgo (auditoría 2026-07-04): alejandro_cotizaciones_por_vencer(int)
-- y alejandro_expirar_cotizaciones() (patch-cotizaciones-ac-expiracion.sql)
-- son SECURITY DEFINER sin ninguna verificación interna de rol, y en
-- Postgres las funciones nuevas otorgan EXECUTE a PUBLIC por defecto —
-- sin un REVOKE explícito, cualquier usuario autenticado (cualquier
-- doctor con sesión) podía llamar:
--   supabase.rpc('alejandro_cotizaciones_por_vencer', {p_dias:30})
-- y obtener nombre, WhatsApp y total de las cotizaciones de OTROS
-- doctores. Ningún archivo del proyecto llama estas 2 funciones
-- (no hay cron ni página que las use todavía) — se corrigen sin
-- riesgo de romper nada.
-- ============================================================

CREATE OR REPLACE FUNCTION public.alejandro_expirar_cotizaciones()
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _n int;
BEGIN
  IF NOT (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','superadmin','operario','operator','staff')
    OR (auth.jwt() ->> 'email') = 'jackalejandroc@gmail.com'
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  UPDATE public.cotizaciones
  SET estado = 'expirada'
  WHERE estado IN ('borrador','enviada')
    AND expira_at < now()
    AND negocio = 'alejandrocadcam';
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END;
$$;
REVOKE ALL ON FUNCTION public.alejandro_expirar_cotizaciones() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.alejandro_expirar_cotizaciones() TO authenticated;

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
REVOKE ALL ON FUNCTION public.alejandro_cotizaciones_por_vencer(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.alejandro_cotizaciones_por_vencer(int) TO authenticated;

-- ── VERIFICACIÓN ─────────────────────────────────────────────────
-- Sin sesión (anon key): SELECT * FROM alejandro_cotizaciones_por_vencer();
-- debe fallar con "permission denied".
-- Con sesión de un doctor no-admin: debe fallar con "No autorizado".
-- ============================================================

SELECT 'patch-cotizaciones-vencer-authz-2026 aplicado' AS status;
