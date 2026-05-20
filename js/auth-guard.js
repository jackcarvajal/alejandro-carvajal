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

    // Exponer como ACAuth Y ProdigyAuth (compatibilidad con páginas clonadas)
    window.ACAuth     = { require, signOut, getRole, getSb };
    window.ProdigyAuth = window.ACAuth;
})();
