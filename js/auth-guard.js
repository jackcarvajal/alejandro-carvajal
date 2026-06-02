/**
 * Alejandro Carvajal CAD/CAM — Auth Guard v1.1
 * Admin: jackalejandroc@gmail.com
 * Cliente: cualquier usuario autenticado
 */
(function () {
    const SUPABASE_URL  = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWhyd3FmeXZneWFwYnd6a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzczNDksImV4cCI6MjA5MDg1MzM0OX0.9CzmFDQYeQKcbtAZoT1_n_OuJ1qPVJu3jImd938T634';
    const ADMIN_EMAILS  = ['jackalejandroc@gmail.com'];

    const DEST_MAP = {
        admin:  '/app/admin-panel',
        client: '/seguimiento-caso'
    };

    function getRole(user) {
        if (ADMIN_EMAILS.includes((user.email || '').toLowerCase())) return 'admin';
        return 'client';
    }

    function getSb() {
        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    }

    async function require(neededRole, loginUrl) {
        const sb = getSb();
        const { data: { session } } = await sb.auth.getSession();
        if (!session) {
            window.location.href = loginUrl || '/app/login';
            return null;
        }

        // ── SEGURIDAD: Cambio de contraseña obligatorio en primer acceso ──
        const meta = session.user.user_metadata || {};
        const isPrimerAcceso = meta.primera_vez === true;
        const isChangingPassword = window.location.pathname.includes('cambiar-contrasena') ||
                                    window.location.pathname.includes('reset-password');
        if (isPrimerAcceso && !isChangingPassword) {
            const dest = encodeURIComponent(window.location.href);
            window.location.href = '/app/cambiar-contrasena.html?primera_vez=1&next=' + dest;
            return null;
        }

        const role = getRole(session.user);
        const allowed = Array.isArray(neededRole) ? neededRole : (neededRole ? [neededRole] : null);
        if (allowed && !allowed.includes(role)) {
            window.location.href = DEST_MAP[role] || '/app/login';
            return null;
        }
        window.AC_ROLE  = role;
        window.AC_EMAIL = session.user.email;
        window.AC_UID   = session.user.id;
        document.body.style.visibility = 'visible';
        return session;
    }

    async function signOut() {
        await getSb().auth.signOut();
        window.location.href = '/app/login';
    }

    /* ── SESSION TIMEOUT — 30 min de inactividad ── */
    (function _sessionTimeout() {
        if (!window.location.pathname.includes('/app/')) return;
        const IDLE_MS = 30 * 60 * 1000;
        let _timer;
        function _reset() {
            clearTimeout(_timer);
            _timer = setTimeout(function() {
                var warn = confirm('⚠️ Tu sesión expirará en 1 minuto por inactividad.\n\nOK para continuar · Cancelar para cerrar sesión ahora.');
                if (!warn) { signOut(); return; }
                _timer = setTimeout(function() { alert('Sesión cerrada por inactividad.'); signOut(); }, 60000);
            }, IDLE_MS - 60000);
        }
        ['mousemove','keydown','click','scroll','touchstart'].forEach(function(ev) { document.addEventListener(ev, _reset, { passive: true }); });
        _reset();
    })();

    // Exponer como ACAuth Y ProdigyAuth (compatibilidad con páginas clonadas)
    window.ACAuth     = { require, signOut, getRole, getSb };
    window.ProdigyAuth = window.ACAuth;
})();
