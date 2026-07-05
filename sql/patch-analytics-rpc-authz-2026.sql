-- ============================================================
-- ALEJANDRO CAD/CAM — Restringir RPCs de dashboard/analytics a admin
-- Ejecutar en: Supabase Dashboard → SQL Editor — URGENTE
--
-- Hallazgo (auditoría 2026-07-04): las 3 funciones de
-- sql/alejandro-analytics-rpc.sql estaban otorgadas a
-- `authenticated, anon` SIN ninguna verificación de rol — es decir,
-- ni siquiera se necesitaba iniciar sesión. Cualquier visitante del
-- sitio (usando la anon key pública, embebida en cualquier página)
-- podía llamar:
--   - alejandro_dashboard_semana(): pedidos e INGRESOS de la semana y
--     el mes, casos en diseño, leads, cotizaciones.
--   - alejandro_top_servicios(): servicios más vendidos y ticket
--     promedio.
--   - alejandro_ingresos_semanas(): ingresos semana a semana.
--
-- Esto es el dashboard financiero completo del negocio, expuesto sin
-- ninguna autenticación.
-- ============================================================

CREATE OR REPLACE FUNCTION public.alejandro_dashboard_semana()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE resultado JSON;
BEGIN
  IF NOT (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','operario','operator','staff')
    OR (auth.jwt() ->> 'email') = 'jackalejandroc@gmail.com'
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT json_build_object(
    'pedidos_semana',   (SELECT COUNT(*) FROM pedidos WHERE created_at >= NOW() - INTERVAL '7 days' AND negocio = 'alejandrocadcam'),
    'pedidos_mes',      (SELECT COUNT(*) FROM pedidos WHERE created_at >= NOW() - INTERVAL '30 days' AND negocio = 'alejandrocadcam'),
    'pedidos_total',    (SELECT COUNT(*) FROM pedidos WHERE negocio = 'alejandrocadcam'),
    'ingresos_semana',  (SELECT COALESCE(SUM(precio_total),0) FROM pedidos WHERE negocio = 'alejandrocadcam' AND pago_estado = 'pago_confirmado' AND created_at >= NOW() - INTERVAL '7 days'),
    'ingresos_mes',     (SELECT COALESCE(SUM(precio_total),0) FROM pedidos WHERE negocio = 'alejandrocadcam' AND pago_estado = 'pago_confirmado' AND created_at >= NOW() - INTERVAL '30 days'),
    'en_diseno',        (SELECT COUNT(*) FROM pedidos WHERE negocio = 'alejandrocadcam' AND estado_operativo IN ('EN_DISENO','REVISION_CLIENTE')),
    'por_aprobar',      (SELECT COUNT(*) FROM pedidos WHERE negocio = 'alejandrocadcam' AND estado_operativo = 'REVISION_CLIENTE'),
    'leads_semana',     (SELECT COUNT(*) FROM leads_doctores WHERE created_at >= NOW() - INTERVAL '7 days'),
    'cotizaciones_sem', (SELECT COUNT(*) FROM cotizaciones WHERE created_at >= NOW() - INTERVAL '7 days'),
    'calculado_en',     NOW()
  ) INTO resultado;
  RETURN resultado;
END;
$$;
-- Revocar anon explícitamente (antes tenía acceso sin ninguna sesión)
REVOKE EXECUTE ON FUNCTION public.alejandro_dashboard_semana() FROM anon;

CREATE OR REPLACE FUNCTION public.alejandro_top_servicios(limite INT DEFAULT 5)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE resultado JSON;
BEGIN
  IF NOT (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','operario','operator','staff')
    OR (auth.jwt() ->> 'email') = 'jackalejandroc@gmail.com'
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT json_agg(row_to_json(t)) INTO resultado FROM (
    SELECT servicio, COUNT(*) AS total, ROUND(AVG(precio_total)) AS ticket_promedio
    FROM pedidos
    WHERE negocio = 'alejandrocadcam' AND created_at >= NOW() - INTERVAL '30 days' AND servicio IS NOT NULL
    GROUP BY 1 ORDER BY total DESC LIMIT limite
  ) t;
  RETURN COALESCE(resultado, '[]'::JSON);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.alejandro_top_servicios(INT) FROM anon;

CREATE OR REPLACE FUNCTION public.alejandro_ingresos_semanas(n_semanas INT DEFAULT 6)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE resultado JSON;
BEGIN
  IF NOT (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','operario','operator','staff')
    OR (auth.jwt() ->> 'email') = 'jackalejandroc@gmail.com'
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT json_agg(row_to_json(t)) INTO resultado FROM (
    SELECT DATE_TRUNC('week', created_at)::date AS semana,
           COUNT(*) AS pedidos,
           COALESCE(SUM(precio_total) FILTER(WHERE pago_estado='pago_confirmado'), 0) AS ingresos
    FROM pedidos
    WHERE negocio = 'alejandrocadcam' AND created_at >= NOW() - (n_semanas || ' weeks')::INTERVAL
    GROUP BY 1 ORDER BY 1
  ) t;
  RETURN COALESCE(resultado, '[]'::JSON);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.alejandro_ingresos_semanas(INT) FROM anon;

-- ── 4. alejandro_actividad_hoy() (logs-incidencias-ac.sql) ──────
-- Sin verificación interna de rol — cualquier doctor logueado podía
-- ver el resumen de incidencias internas del día (tipos + conteos).
CREATE OR REPLACE FUNCTION public.alejandro_actividad_hoy()
RETURNS TABLE(tipo text, total bigint, ultima_vez timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','operario','operator','staff')
    OR (auth.jwt() ->> 'email') = 'jackalejandroc@gmail.com'
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  SELECT l.tipo, COUNT(*) AS total, MAX(l.created_at) AS ultima_vez
  FROM public.logs_incidencias l
  WHERE l.negocio='alejandrocadcam'
    AND l.created_at >= CURRENT_DATE
  GROUP BY l.tipo
  ORDER BY total DESC;
END;
$$;

-- ── VERIFICACIÓN ─────────────────────────────────────────────────
-- Sin sesión (anon key): SELECT alejandro_dashboard_semana();
-- debe fallar con "permission denied" (revocado) — antes funcionaba
-- sin ningún login.
-- ============================================================
