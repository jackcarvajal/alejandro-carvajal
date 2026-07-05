-- ============================================================
-- Alejandro CAD/CAM — notificaciones_wa nunca tuvo RLS habilitado
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Hallazgo (auditoría 2026-07-04): la tabla notificaciones_wa
-- (migrate-flujo-diseno.sql) se creó sin ALTER TABLE ... ENABLE ROW
-- LEVEL SECURITY. Con el GRANT ALL a anon/authenticated ya aplicado
-- globalmente (patch-supabase-public-grants-2026.sql), sin RLS
-- cualquier usuario con la anon key podría leer/escribir todas las
-- filas (mensajes de WA enviados a doctores). Ningún archivo del
-- proyecto inserta ni lee de esta tabla todavía (log sin usar) —
-- se corrige sin riesgo de romper nada.
-- ============================================================

ALTER TABLE public.notificaciones_wa ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_notif_wa" ON public.notificaciones_wa;
CREATE POLICY "admin_all_notif_wa" ON public.notificaciones_wa
  FOR ALL TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin','superadmin','operario','operator','staff'))
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin','superadmin','operario','operator','staff'));

SELECT 'patch-notificaciones-wa-rls-2026 aplicado' AS status;
