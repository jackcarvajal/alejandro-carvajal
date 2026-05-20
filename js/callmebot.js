/**
 * Callmebot — Notificaciones automáticas a WhatsApp de Alejandro
 * Documentación: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *
 * ACTIVACIÓN (una sola vez):
 * 1. Abre WhatsApp
 * 2. Envía "I allow callmebot to send me messages" al +34 644 59 75 34
 * 3. Recibirás tu apikey — reemplaza CALLMEBOT_APIKEY abajo
 */

const CALLMEBOT_PHONE  = '573219581949'; // WhatsApp Alejandro
const CALLMEBOT_APIKEY = 'PENDIENTE';    // ← reemplazar con tu apikey de Callmebot

/**
 * Envía notificación WA a Alejandro via Callmebot
 * @param {string} mensaje - Texto del mensaje (máx 1000 chars)
 */
async function notifAlejandro(mensaje) {
  if (!CALLMEBOT_APIKEY || CALLMEBOT_APIKEY === 'PENDIENTE') {
    console.warn('[Callmebot] API key no configurada. Activa Callmebot primero.');
    return false;
  }
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(mensaje)}&apikey=${CALLMEBOT_APIKEY}`;
    await fetch(url, { mode: 'no-cors' });
    return true;
  } catch(e) {
    console.warn('[Callmebot] Error:', e.message);
    return false;
  }
}

/* ── MENSAJES PREDEFINIDOS ── */

/** Cliente envió un caso nuevo */
function notif_nuevoCaso(codigo, servicio, cliente) {
  return notifAlejandro(
    `🔔 *NUEVO CASO* — ${codigo}\n` +
    `👤 Cliente: ${cliente}\n` +
    `🎨 Servicio: ${servicio}\n` +
    `⏱ SLA: 15 min básico / 1h complejo\n` +
    `👉 Admin: alejandrocadcam.pages.dev/app/admin-panel`
  );
}

/** Cliente subió comprobante de pago */
function notif_pagoSubido(codigo, cliente, total) {
  return notifAlejandro(
    `💳 *COMPROBANTE RECIBIDO* — ${codigo}\n` +
    `👤 Cliente: ${cliente}\n` +
    `💰 Total: $${total} USD\n` +
    `✅ Acción: Verificar y confirmar pago\n` +
    `👉 Admin: alejandrocadcam.pages.dev/app/admin-panel`
  );
}

/** Cliente aprobó el diseño */
function notif_disenoAprobado(codigo, cliente) {
  return notifAlejandro(
    `✅ *DISEÑO APROBADO* — ${codigo}\n` +
    `👤 Cliente: ${cliente}\n` +
    `📦 Acción: Entregar STL final y liberar descarga\n` +
    `👉 Admin: alejandrocadcam.pages.dev/app/admin-panel`
  );
}

/** Cliente solicitó cambios */
function notif_cambiosSolicitados(codigo, cliente, notas, revision) {
  return notifAlejandro(
    `✏️ *CAMBIOS SOLICITADOS* — ${codigo} (Rev ${revision}/2)\n` +
    `👤 Cliente: ${cliente}\n` +
    `📝 Notas: ${notas}\n` +
    `⏱ Responder en ${revision >= 2 ? '1h' : '15 min'}\n` +
    `👉 Admin: alejandrocadcam.pages.dev/app/admin-panel`
  );
}

/** Cliente subió fotos de feedback */
function notif_fotosSubidas(codigo, cliente, numFotos) {
  return notifAlejandro(
    `📸 *FOTOS DE FEEDBACK* — ${codigo}\n` +
    `👤 Cliente: ${cliente}\n` +
    `🖼 ${numFotos} foto(s) subida(s) para revisión\n` +
    `👉 Admin: alejandrocadcam.pages.dev/app/admin-panel`
  );
}

/** Recordatorio SLA vencido (llamar manualmente si necesario) */
function notif_slaVencido(codigo, servicio, minutos) {
  return notifAlejandro(
    `🚨 *SLA VENCIDO* — ${codigo}\n` +
    `🎨 Servicio: ${servicio}\n` +
    `⏰ Han pasado ${minutos} minutos sin respuesta\n` +
    `👉 Admin: alejandrocadcam.pages.dev/app/admin-panel`
  );
}
