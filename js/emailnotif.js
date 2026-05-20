/**
 * Email automático al cliente via EmailJS
 * Gratis: 200 emails/mes · https://www.emailjs.com
 *
 * ACTIVACIÓN (una sola vez — 5 minutos):
 * 1. Crear cuenta en emailjs.com
 * 2. Add Service → Gmail → conectar jackalejandroc@gmail.com
 * 3. Copiar SERVICE_ID (ej: service_abc123)
 * 4. Email Templates → Create Template → copiar TEMPLATE_ID
 * 5. Account → API Keys → copiar PUBLIC_KEY
 * 6. Reemplazar los 3 valores abajo
 *
 * Template sugerido en EmailJS:
 * Subject: {{asunto}}
 * Body: {{cuerpo}}
 * To: {{email_cliente}}
 * Reply-to: jackalejandroc@gmail.com
 */

const EMAILJS_SERVICE_ID  = 'PENDIENTE'; // ← tu service_id de EmailJS
const EMAILJS_TEMPLATE_ID = 'PENDIENTE'; // ← tu template_id de EmailJS
const EMAILJS_PUBLIC_KEY  = 'PENDIENTE'; // ← tu public key de EmailJS

// Cargar EmailJS SDK dinámicamente
(function loadEmailJS(){
  if(window.emailjs) return;
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload=()=>emailjs.init({publicKey:EMAILJS_PUBLIC_KEY});
  document.head.appendChild(s);
})();

async function enviarEmailCliente(emailDestino, asunto, cuerpo){
  if(!emailDestino||!emailDestino.includes('@')) return false;
  if(EMAILJS_SERVICE_ID==='PENDIENTE'||EMAILJS_TEMPLATE_ID==='PENDIENTE'||EMAILJS_PUBLIC_KEY==='PENDIENTE'){
    console.warn('[EmailJS] Configurar SERVICE_ID, TEMPLATE_ID y PUBLIC_KEY en js/emailnotif.js');
    return false;
  }
  try{
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      email_cliente: emailDestino,
      asunto,
      cuerpo,
      remitente: 'Alejandro Carvajal CAD/CAM',
      reply_to:  'jackalejandroc@gmail.com'
    });
    return true;
  }catch(e){
    console.warn('[EmailJS] Error:', e.text||e.message);
    return false;
  }
}

/* ── EMAILS PREDEFINIDOS AL CLIENTE ── */

/** Confirmación de recepción del caso */
function email_nuevoCaso(emailCliente, codigo, servicio){
  const asunto = `✅ Caso recibido — ${codigo} | Alejandro Carvajal CAD/CAM`;
  const cuerpo =
`Hola,

Confirmamos que recibimos tu caso de diseño CAD.

📋 Código de caso: ${codigo}
🎨 Servicio: ${servicio}
⏱ Tiempo estimado: 15 min – 48h según complejidad

Próximo paso: te notificaremos cuando confirmemos tu pago para iniciar el diseño.

Puedes hacer seguimiento de tu caso en:
👉 https://alejandrocadcam.pages.dev/app/client-panel

Si tienes dudas escríbenos: +57 321 958 1949

— Alejandro Carvajal CAD/CAM
alejandrocadcam.pages.dev`;
  return enviarEmailCliente(emailCliente, asunto, cuerpo);
}

/** Pago confirmado — diseño iniciado */
function email_pagoConfirmado(emailCliente, codigo){
  const asunto = `💳 Pago confirmado — ${codigo} | Diseño en proceso`;
  const cuerpo =
`Hola,

Tu pago fue verificado y confirmado. ¡Ya iniciamos el diseño de tu caso!

📋 Caso: ${codigo}
⏱ Te avisaremos cuando el diseño esté listo para tu revisión.

Seguimiento:
👉 https://alejandrocadcam.pages.dev/app/client-panel

— Alejandro Carvajal CAD/CAM`;
  return enviarEmailCliente(emailCliente, asunto, cuerpo);
}

/** Diseño listo para revisar */
function email_disenoListo(emailCliente, codigo, revision){
  const asunto = `🎨 Tu diseño está listo para revisar — ${codigo} (Rev ${revision})`;
  const cuerpo =
`Hola,

¡Tu diseño CAD está listo! Por favor revísalo y aprueba o solicita cambios.

📋 Caso: ${codigo}
🔄 Revisión: ${revision} de 2 (hasta 2 revisiones sin costo)

Para ver el diseño y tomar una decisión:
👉 https://alejandrocadcam.pages.dev/app/client-panel

Una vez lo apruebes, recibirás el archivo STL listo para producir.

— Alejandro Carvajal CAD/CAM`;
  return enviarEmailCliente(emailCliente, asunto, cuerpo);
}

/** Diseño aprobado — STL disponible */
function email_stlListo(emailCliente, codigo){
  const asunto = `📦 STL listo para descargar — ${codigo} | Alejandro Carvajal CAD/CAM`;
  const cuerpo =
`Hola,

¡Excelente! Tu diseño fue aprobado y el archivo STL ya está disponible para descargar.

📋 Caso: ${codigo}
⬇️ Descarga tu STL aquí:
👉 https://alejandrocadcam.pages.dev/app/client-panel

El archivo está disponible por 24 horas. Si necesitas descargarlo nuevamente escríbenos.

¡Gracias por confiar en Alejandro Carvajal CAD/CAM!

— Alejandro Carvajal
jackalejandroc@gmail.com · +57 321 958 1949`;
  return enviarEmailCliente(emailCliente, asunto, cuerpo);
}

/** Cambios aplicados — nueva versión lista */
function email_cambiosAplicados(emailCliente, codigo, revision){
  const asunto = `✏️ Cambios aplicados — ${codigo} (Rev ${revision}) lista para revisar`;
  const cuerpo =
`Hola,

Aplicamos los cambios que solicitaste. Tu diseño actualizado ya está disponible.

📋 Caso: ${codigo}
🔄 Esta es la revisión ${revision} de 2

Por favor revisa y aprueba:
👉 https://alejandrocadcam.pages.dev/app/client-panel

— Alejandro Carvajal CAD/CAM`;
  return enviarEmailCliente(emailCliente, asunto, cuerpo);
}
