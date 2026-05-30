-- Alejandro Carvajal — Analytics RPCs
-- Ejecutar en Supabase Dashboard → SQL Editor

-- ── 1. Dashboard semana ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.alejandro_dashboard_semana()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE resultado JSON;
BEGIN
  SELECT json_build_object(
    'pedidos_semana',   (SELECT COUNT(*) FROM pedidos WHERE created_at >= NOW() - INTERVAL '7 days' AND negocio = 'alejandro'),
    'pedidos_mes',      (SELECT COUNT(*) FROM pedidos WHERE created_at >= NOW() - INTERVAL '30 days' AND negocio = 'alejandro'),
    'pedidos_total',    (SELECT COUNT(*) FROM pedidos WHERE negocio = 'alejandro'),
    'ingresos_semana',  (SELECT COALESCE(SUM(precio_total),0) FROM pedidos WHERE negocio = 'alejandro' AND pago_estado = 'pago_confirmado' AND created_at >= NOW() - INTERVAL '7 days'),
    'ingresos_mes',     (SELECT COALESCE(SUM(precio_total),0) FROM pedidos WHERE negocio = 'alejandro' AND pago_estado = 'pago_confirmado' AND created_at >= NOW() - INTERVAL '30 days'),
    'en_diseno',        (SELECT COUNT(*) FROM pedidos WHERE negocio = 'alejandro' AND estado_operativo IN ('EN_DISENO','REVISION_CLIENTE')),
    'por_aprobar',      (SELECT COUNT(*) FROM pedidos WHERE negocio = 'alejandro' AND estado_operativo = 'REVISION_CLIENTE'),
    'leads_semana',     (SELECT COUNT(*) FROM leads_doctores WHERE created_at >= NOW() - INTERVAL '7 days'),
    'cotizaciones_sem', (SELECT COUNT(*) FROM cotizaciones WHERE created_at >= NOW() - INTERVAL '7 days'),
    'calculado_en',     NOW()
  ) INTO resultado;
  RETURN resultado;
END;
$$;
GRANT EXECUTE ON FUNCTION public.alejandro_dashboard_semana() TO authenticated, anon;

-- ── 2. Top servicios ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.alejandro_top_servicios(limite INT DEFAULT 5)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE resultado JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO resultado FROM (
    SELECT servicio, COUNT(*) AS total, ROUND(AVG(precio_total)) AS ticket_promedio
    FROM pedidos
    WHERE negocio = 'alejandro' AND created_at >= NOW() - INTERVAL '30 days' AND servicio IS NOT NULL
    GROUP BY 1 ORDER BY total DESC LIMIT limite
  ) t;
  RETURN COALESCE(resultado, '[]'::JSON);
END;
$$;
GRANT EXECUTE ON FUNCTION public.alejandro_top_servicios(INT) TO authenticated, anon;

-- ── 3. Ingresos por semana ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.alejandro_ingresos_semanas(n_semanas INT DEFAULT 6)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE resultado JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO resultado FROM (
    SELECT DATE_TRUNC('week', created_at)::date AS semana,
           COUNT(*) AS pedidos,
           COALESCE(SUM(precio_total) FILTER(WHERE pago_estado='pago_confirmado'), 0) AS ingresos
    FROM pedidos
    WHERE negocio = 'alejandro' AND created_at >= NOW() - (n_semanas || ' weeks')::INTERVAL
    GROUP BY 1 ORDER BY 1
  ) t;
  RETURN COALESCE(resultado, '[]'::JSON);
END;
$$;
GRANT EXECUTE ON FUNCTION public.alejandro_ingresos_semanas(INT) TO authenticated, anon;
