/**
 * Alejandro CAD/CAM — Cuenta del doctor creada en el SERVIDOR al enviar «Envía tu escáner»
 * POST /api/cuenta-implicita   Body: { origen:'escaner', email, codigo, nombre, clinica, whatsapp }
 * (gemelo de functions/api/cuenta-implicita.js de PRODIGY — paridad de seguridad, 1-oct-2026)
 *
 * Antes la página hacía auth.signUp en el navegador con una clave FIJA visible en el código:
 * cualquiera podía entrar a toda cuenta creada así que no hubiera cambiado la clave, o abrir una cuenta con el correo
 * de otro doctor. Ahora:
 *  · solo se crea si ese correo acaba de dejar una solicitud con ese código (últimos 15 min)
 *  · la clave temporal es aleatoria, la genera el servidor y SOLO viaja al correo del doctor
 *  · si el correo ya tiene cuenta, no se toca
 *  · sin Resend configurado la cuenta igual se crea y el doctor entra con «Olvidé mi contraseña» (correo: false)
 * Env: SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY · RESEND_API_KEY + FROM_EMAIL (opcionales)
 */
import { cfg, adminH, cors, limite } from './reportar-problema.js';

const J = (o, status, h) => new Response(JSON.stringify(o), { status, headers: h });
const escH = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const claveTemporal = () => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const b = crypto.getRandomValues(new Uint8Array(10));
  return 'Acad-' + Array.from(b, x => abc[x % abc.length]).join('');
};

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: { ...cors(request.headers.get('Origin') || ''), 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function onRequestPost({ request, env }) {
  const h = cors(request.headers.get('Origin') || '');
  const c = cfg(env);
  if (!c.SERVICE) return J({ error: 'No configurado' }, 503, h);
  if (!(await limite(request.headers.get('CF-Connecting-IP') || 'x', 'cuenta-implicita', 5))) return J({ error: 'Demasiadas solicitudes' }, 429, h);

  let b; try { b = await request.json(); } catch { return J({ error: 'JSON inválido' }, 400, h); }
  const email = String(b.email || '').trim().toLowerCase();
  const codigo = String(b.codigo || '').trim();
  // correo estricto: sin comas, paréntesis ni % (va dentro de un filtro de PostgREST)
  if (b.origen !== 'escaner' || !/^[a-z0-9._+'-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(email) || email.length > 254 || !codigo) return J({ error: 'Datos incompletos' }, 400, h);

  const desde = encodeURIComponent(new Date(Date.now() - 15 * 60000).toISOString());
  const rs = await fetch(`${c.URL}/rest/v1/solicitudes_scanner?codigo=eq.${encodeURIComponent(codigo)}&negocio=eq.alejandrocadcam&email=ilike.${encodeURIComponent(email)}&created_at=gte.${desde}&select=id&limit=1`, { headers: adminH(c.SERVICE) });
  if (!rs.ok || !(await rs.json()).length) return J({ error: 'No autorizado' }, 403, h);

  const nombre = String(b.nombre || '').slice(0, 120), clinica = String(b.clinica || '').slice(0, 120), whatsapp = String(b.whatsapp || '').slice(0, 30);
  const clave = claveTemporal();
  const ru = await fetch(`${c.URL}/auth/v1/admin/users`, {
    method: 'POST', headers: adminH(c.SERVICE),
    body: JSON.stringify({ email, password: clave, email_confirm: true,
      user_metadata: { nombre, clinica, whatsapp, negocio: 'alejandrocadcam', primera_vez: true } }),
  });
  const u = await ru.json().catch(() => ({}));
  if (!ru.ok) {
    if (ru.status === 422 || /registered|exists/i.test(u.msg || u.message || u.error_code || '')) return J({ existe: true }, 200, h);
    console.error('[cuenta-implicita] crear usuario:', ru.status, u.error_code || u.msg);
    return J({ error: 'No se pudo crear la cuenta' }, 502, h);
  }

  // Bienvenida con la clave temporal: solo al correo del doctor
  let correo = false;
  if (env.RESEND_API_KEY) {
    const html = `<div style="font-family:Arial,sans-serif;background:#050505;color:#e2e8f0;padding:28px"><div style="max-width:560px;margin:0 auto">
      <p style="color:#D4AF37;font-weight:900;letter-spacing:2px">ALEJANDRO CAD/CAM</p>
      <h2>Tu portal de seguimiento está listo</h2>
      <p>Hola ${escH(nombre.split(' ')[0])}, recibimos tu caso <strong>${escH(codigo)}</strong>. Desde tu portal ves el avance del diseño y lo apruebas.</p>
      <p><a href="https://alejandrocadcam.com/app/login.html" style="display:inline-block;background:#D4AF37;color:#050505;font-weight:800;padding:12px 22px;border-radius:8px;text-decoration:none">Entrar a mi portal →</a></p>
      <p style="font-size:14px">Usuario: <strong>${escH(email)}</strong><br>Clave temporal: <strong style="color:#D4AF37">${escH(clave)}</strong></p>
      <p style="font-size:12px;color:#94a3b8">Cámbiala al ingresar. Si no solicitaste esto, ignora este correo.</p></div></div>`;
    const re = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.FROM_EMAIL || 'Alejandro Carvajal CAD/CAM <onboarding@resend.dev>', to: [email],
        subject: 'Tu portal de Alejandro CAD/CAM está listo', html, reply_to: 'jackalejandroc@gmail.com' }),
    }).catch(() => null);
    correo = !!(re && re.ok);
  }
  return J({ creada: true, correo }, 200, h);
}
