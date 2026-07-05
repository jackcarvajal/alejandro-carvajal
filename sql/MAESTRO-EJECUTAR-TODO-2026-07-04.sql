-- ================================================================
-- ALEJANDRO CAD/CAM — SQL MAESTRO CONSOLIDADO
-- Generado 2026-07-04 — reune los patches pendientes propios de Alejandro.
-- NOTA: la mayoria de fixes de seguridad de esta sesion fueron en tablas
-- COMPARTIDAS con PRODIGY (mismo proyecto Supabase) — esos ya se corrigen
-- ejecutando sql/MAESTRO-EJECUTAR-TODO-2026-07-04.sql del repo PRODIGY.
-- Este archivo son SOLO los 2 patches especificos de Alejandro.
-- ================================================================

-- ############################################################
-- # 1/2 — BUCKETS DE STORAGE PUBLICOS (Alejandro: disenos-cad, scanner-uploads, pedidos-archivos)
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
-- # 2/2 — INDICES FALTANTES EN PEDIDOS (filtro negocio+created_at/user_id)
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

-- ================================================================
-- FIN — recuerda tambien ejecutar MAESTRO-EJECUTAR-TODO-2026-07-04.sql de PRODIGY
-- (cubre las tablas compartidas: pedidos, creditos_cliente, referidos, etc.)
-- ================================================================
SELECT 'SQL MAESTRO Alejandro 2026-07-04 aplicado completo' AS status;
