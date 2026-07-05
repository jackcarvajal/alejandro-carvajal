-- ================================================================
-- ALEJANDRO CAD/CAM — SQL MAESTRO CONSOLIDADO
-- Generado 2026-07-04 — reune los patches pendientes propios de Alejandro.
-- NOTA: la mayoria de fixes de seguridad de esta sesion fueron en tablas
-- COMPARTIDAS con PRODIGY (mismo proyecto Supabase) — esos ya se corrigen
-- ejecutando sql/MAESTRO-EJECUTAR-TODO-2026-07-04.sql del repo PRODIGY.
-- Este archivo son SOLO los patches especificos de Alejandro.
-- ================================================================

-- ############################################################
-- # 1/3 — BUCKETS DE STORAGE PUBLICOS (disenos-cad, scanner-uploads, pedidos-archivos)
-- ############################################################
-- ============================================================
-- ALEJANDRO CAD/CAM — Privatizar buckets de Storage
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- (mismo proyecto Supabase que PRODIGY, zgihrwqfyvgyapbwzkvw,
--  compartido entre ambos negocios vía columna `negocio`)
--
-- Contexto (auditoría 2026-07-03, paridad con fix aplicado en PRODIGY):
-- Los buckets 'disenos-cad', 'scanner-uploads' y 'pedidos-archivos'
-- son PÚBLICOS. Las URLs se generaban con getPublicUrl() en varios
-- paneles → cualquiera con la ruta (predecible por convención de
-- nombre/UUID) podía descargar STL, comprobantes de pago y archivos
-- de biblioteca de clientes SIN autenticación.
-- Ya corregido en código: getPublicUrl() → createSignedUrl() en
-- app/client-panel.html, app/admin-panel.html, envia-tu-scanner.html,
-- js/flujo-uploader.js. Este SQL debe ejecutarse DESPUÉS de que ese
-- código esté desplegado (si no, los paneles muestran enlaces rotos
-- hasta el siguiente deploy de Cloudflare Pages).
-- ============================================================

-- ── 1. Privatizar bucket 'disenos-cad' (STL de trabajo, comprobantes, biblioteca) ──
UPDATE storage.buckets SET public = false WHERE id = 'disenos-cad';

DROP POLICY IF EXISTS "disenos_cad_staff_read"   ON storage.objects;
DROP POLICY IF EXISTS "disenos_cad_staff_write"  ON storage.objects;
DROP POLICY IF EXISTS "disenos_cad_staff_delete" ON storage.objects;
DROP POLICY IF EXISTS "disenos_cad_owner_read"   ON storage.objects;
DROP POLICY IF EXISTS "disenos_cad_owner_write"  ON storage.objects;

-- Lectura: admin, o el propio doctor si la ruta empieza con su user_id
-- (bibliotecas/{uid}/..., feedback/{pedidoId}/... no tiene prefijo de uid,
--  así que esos casos dependen solo de la policy admin — el cliente los
--  ve a través de su propia sesión en client-panel.html usando su pedido)
CREATE POLICY "disenos_cad_staff_read" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'disenos-cad'
        AND (
            auth.email() = 'jackalejandroc@gmail.com'
            OR (storage.foldername(name))[1] = auth.uid()::text
            OR (storage.foldername(name))[2] = auth.uid()::text  -- bibliotecas/{uid}/...
        )
    );

CREATE POLICY "disenos_cad_write" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'disenos-cad');

CREATE POLICY "disenos_cad_staff_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'disenos-cad' AND auth.email() = 'jackalejandroc@gmail.com');

-- ── 2. Privatizar bucket 'scanner-uploads' (subida anónima de doctores) ──
UPDATE storage.buckets SET public = false WHERE id = 'scanner-uploads';

DROP POLICY IF EXISTS "scanner_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "scanner_admin_read"    ON storage.objects;
DROP POLICY IF EXISTS "scanner_admin_delete"  ON storage.objects;

CREATE POLICY "scanner_public_upload" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        bucket_id = 'scanner-uploads'
        AND name ~* '\.(stl|ply|zip|obj|dcm|jpg|jpeg|png|pdf)$'
    );

CREATE POLICY "scanner_admin_read" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'scanner-uploads' AND auth.email() = 'jackalejandroc@gmail.com');

CREATE POLICY "scanner_admin_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'scanner-uploads' AND auth.email() = 'jackalejandroc@gmail.com');

-- ── 3. Privatizar bucket 'pedidos-archivos' (js/flujo-uploader.js, copiado de PRODIGY) ──
UPDATE storage.buckets SET public = false WHERE id = 'pedidos-archivos';

DROP POLICY IF EXISTS "pedidos_archivos_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "pedidos_archivos_staff_read"     ON storage.objects;
DROP POLICY IF EXISTS "pedidos_archivos_anon_read"      ON storage.objects;
DROP POLICY IF EXISTS "pedidos_archivos_staff_delete"   ON storage.objects;

CREATE POLICY "pedidos_archivos_public_upload" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        bucket_id = 'pedidos-archivos'
        AND name ~* '\.(stl|ply|obj|dcm|zip|jpg|jpeg|png|pdf|3oxz|constructionfile)$'
    );

CREATE POLICY "pedidos_archivos_staff_read" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'pedidos-archivos'
        AND (
            auth.email() = 'jackalejandroc@gmail.com'
            OR (storage.foldername(name))[1] = auth.uid()::text
        )
    );

-- uid='anon' cuando el doctor sube sin sesión (self-service) — necesita
-- firmar su propia URL de inmediato para el mensaje de WhatsApp. Acceso
-- limitado a la carpeta compartida 'anon/', igual que en PRODIGY.
CREATE POLICY "pedidos_archivos_anon_read" ON storage.objects
    FOR SELECT TO anon
    USING (
        bucket_id = 'pedidos-archivos'
        AND (storage.foldername(name))[1] = 'anon'
    );

CREATE POLICY "pedidos_archivos_staff_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'pedidos-archivos' AND auth.email() = 'jackalejandroc@gmail.com');

-- ── VERIFICACIÓN ─────────────────────────────────────────────────
-- SELECT id, public FROM storage.buckets WHERE id IN ('disenos-cad','scanner-uploads','pedidos-archivos');
--   → todos deben mostrar public = false

-- ############################################################
-- # 2/3 — INDICES FALTANTES EN PEDIDOS (filtro negocio+created_at/user_id)
-- ############################################################
-- ============================================================
-- ALEJANDRO CAD/CAM — Índices compuestos faltantes en `pedidos`
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- (mismo proyecto Supabase que PRODIGY — tabla `pedidos` compartida,
--  filtrada por columna `negocio`)
--
-- Hallazgo (auditoría rendimiento 2026-07-03): existe idx_pedidos_negocio
-- (columna simple), pero el código consulta constantemente con el patrón
-- negocio + created_at / negocio + user_id, que un índice simple sobre
-- `negocio` no cubre eficientemente:
--
-- .eq('negocio','alejandrocadcam').order('created_at',...)
--   → app/client-panel.html:547-548,679,695,815-816,1030-1032
--   → app/admin-panel.html:475,940-941
-- .eq('user_id',...).eq('negocio','alejandrocadcam')
--   → app/client-panel.html:815
-- bibliotecas_cliente: .eq('negocio',...).eq('user_id',...)
--   → app/client-panel.html:881,890
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_pedidos_negocio_created
    ON public.pedidos (negocio, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pedidos_negocio_user
    ON public.pedidos (negocio, user_id);

CREATE INDEX IF NOT EXISTS idx_bibliotecas_negocio_user
    ON public.bibliotecas_cliente (negocio, user_id);

-- ── VERIFICACIÓN ─────────────────────────────────────────────────
-- SELECT indexname FROM pg_indexes WHERE tablename = 'pedidos' AND indexname LIKE 'idx_pedidos_negocio%';
-- EXPLAIN ANALYZE SELECT * FROM pedidos WHERE negocio = 'alejandrocadcam' ORDER BY created_at DESC LIMIT 20;
--   → debe mostrar "Index Scan" en vez de "Seq Scan"

-- ############################################################
-- # 3/3 — DASHBOARD FINANCIERO SIN AUTH (grave: expuesto incluso sin login)
-- ############################################################
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

-- ############################################################
-- # 4/4 (agregado) — COTIZACIONES AC: RPCs sin ninguna verificacion de rol
-- ############################################################
-- Hallazgo: alejandro_cotizaciones_por_vencer(int) y
-- alejandro_expirar_cotizaciones() son SECURITY DEFINER sin check de
-- rol; Postgres otorga EXECUTE a PUBLIC por defecto en funciones
-- nuevas. Cualquier doctor autenticado podia ver nombre/WhatsApp/total
-- de cotizaciones de OTROS doctores. Ningun archivo del proyecto llama
-- estas funciones todavia (sin cron ni pagina) — se corrige sin riesgo.

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

SELECT 'Patch 4/4 (cotizaciones authz) aplicado' AS status;

-- ================================================================
-- FIN — recuerda tambien ejecutar MAESTRO-EJECUTAR-TODO-2026-07-04.sql de PRODIGY
-- (cubre las tablas compartidas: pedidos, creditos_cliente, referidos, etc.)
-- ================================================================
SELECT 'SQL MAESTRO Alejandro 2026-07-04 aplicado completo' AS status;
