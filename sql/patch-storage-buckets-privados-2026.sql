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
