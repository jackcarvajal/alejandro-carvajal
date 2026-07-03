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
