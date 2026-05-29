-- ============================================================
-- ALEJANDRO CAD/CAM — Patch: RLS + protección columnas en pedidos
--
-- PROBLEMA DOBLE:
-- 1. "sistema_puede_escribir" bloquea TODAS las escrituras de clientes
--    → aprobación de diseño, comprobante de pago, calificación NPS
--    → todas fallan silenciosamente en producción (BUG)
-- 2. Sin restricción de columnas, un cliente podría actualizar
--    cualquier campo de su propio pedido (si la RLS lo permitiera)
--
-- FIX:
--   a) Nueva política RLS que permite a clientes actualizar SUS pedidos
--   b) Trigger que protege columnas sensibles (precio, estado, propietario)
-- ============================================================

-- ── 1. RLS: cliente puede actualizar SOLO sus propios pedidos ─
DROP POLICY IF EXISTS "cliente_puede_actualizar_propio" ON pedidos;
CREATE POLICY "cliente_puede_actualizar_propio" ON pedidos
    FOR UPDATE TO authenticated
    USING  (auth.uid() = user_id OR auth.email() = email OR auth.email() = doctor)
    WITH CHECK (auth.uid() = user_id OR auth.email() = email OR auth.email() = doctor);

-- ── 2. Trigger que bloquea cambios a columnas críticas para clientes ─
CREATE OR REPLACE FUNCTION ac_restrict_client_pedido_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _email  text;
    _is_admin boolean;
BEGIN
    _email    := (current_setting('request.jwt.claims', true)::jsonb ->> 'email');
    _is_admin := (_email = 'jackalejandroc@gmail.com');

    -- Admin puede todo
    IF _is_admin OR current_user = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- ── Clientes NO pueden cambiar estos campos ──

    IF NEW.estado IS DISTINCT FROM OLD.estado THEN
        -- Excepción: el cliente SÍ puede cambiar estado a 'aprobado' o 'revision'
        -- (aprobación de diseño, solicitud de cambios)
        IF NEW.estado NOT IN ('aprobado', 'revision', 'cambios_solicitados') THEN
            RAISE EXCEPTION 'AC_SECURITY: Cliente no puede cambiar estado a %', NEW.estado;
        END IF;
    END IF;

    -- Precio: nunca
    IF NEW.precio IS DISTINCT FROM OLD.precio THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede modificar precio';
    END IF;

    -- Precio total (columna alternativa)
    IF NEW.precio_total IS DISTINCT FROM OLD.precio_total THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede modificar precio_total';
    END IF;

    -- Confirmar pago directamente
    IF NEW.pago_estado = 'pago_confirmado' AND OLD.pago_estado != 'pago_confirmado' THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede confirmar pago directamente';
    END IF;

    -- Propietario del pedido
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede reasignar user_id';
    END IF;
    IF NEW.doctor IS DISTINCT FROM OLD.doctor THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede reasignar doctor';
    END IF;

    -- STL: solo admin puede liberar archivos
    IF NEW.stl_liberado IS DISTINCT FROM OLD.stl_liberado THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede cambiar stl_liberado';
    END IF;
    IF NEW.stl_ruta IS DISTINCT FROM OLD.stl_ruta THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede cambiar stl_ruta';
    END IF;
    IF NEW.link_stl IS DISTINCT FROM OLD.link_stl THEN
        RAISE EXCEPTION 'AC_SECURITY: Cliente no puede cambiar link_stl';
    END IF;

    -- Columnas que SÍ puede cambiar el cliente:
    -- diseno_aprobado, notas_cambios, revisiones_usadas (aprobación)
    -- comprobante_url, pago_estado (→ pago_subido) (pago)
    -- calificacion, calificacion_comentario (NPS)
    -- fotos_feedback (feedback)

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ac_restrict_client_pedido_updates ON pedidos;
CREATE TRIGGER trg_ac_restrict_client_pedido_updates
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION ac_restrict_client_pedido_updates();

-- ── VERIFICACIÓN ─
-- SELECT trigger_name, event_manipulation, action_timing
-- FROM information_schema.triggers
-- WHERE event_object_table = 'pedidos' AND trigger_schema = 'public';

-- ============================================================
-- RESULTADO:
-- ✅ Clientes pueden aprobar diseño, subir comprobante, calificar, enviar feedback
-- ❌ Clientes NO pueden: cambiar precio, confirmar pago, cambiar propietario, modificar STL
-- ✅ Admin (jackalejandroc@gmail.com) conserva acceso total
-- ============================================================
