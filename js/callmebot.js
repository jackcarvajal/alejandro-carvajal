/**
 * Avisos a Alejandro por WhatsApp desde el portal del cliente.
 *
 * Este archivo es PÚBLICO (lo descarga el navegador): aquí no va ningún número ni apikey.
 * Los avisos salen por /api/notify-staff (servidor): los números y las apikeys de CallMeBot viven en las
 * variables de Cloudflare (STAFF_1..3_PHONE / _APIKEY) y, si el WhatsApp no sale, llega por correo.
 *
 * Hasta el 23-nov-2026 este archivo llamaba a CallMeBot directo con una apikey 'PENDIENTE' → los avisos de
 * comprobante subido, diseño aprobado y cambios pedidos del portal NUNCA salían.
 */

function avisarEquipo(datos) {
  try {
    return fetch('/api/notify-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      keepalive: true
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  } catch (e) { return Promise.resolve(false); }
}

/* ── MENSAJES PREDEFINIDOS (mismos nombres que usan las páginas) ── */

/** Caso nuevo: flujo-diseno ya avisa por /api/notify-staff con todos los datos → aquí no se repite. */
function notif_nuevoCaso() { return Promise.resolve(true); }

/** Cliente subió comprobante de pago */
function notif_pagoSubido(codigo, cliente, total) {
  return avisarEquipo({
    tipo: 'Comprobante de pago recibido', codigo: codigo, doctor: cliente, servicio: 'Pago',
    contexto: 'Total: ' + (total || '—') + ' USD · Verificar y confirmar el pago'
  });
}

/** Cliente aprobó el diseño */
function notif_disenoAprobado(codigo, cliente) {
  return avisarEquipo({
    tipo: 'Diseño aprobado', codigo: codigo, doctor: cliente, servicio: 'Diseño',
    contexto: 'Entregar el STL final y liberar la descarga'
  });
}

/** Cliente solicitó cambios */
function notif_cambiosSolicitados(codigo, cliente, notas, revision) {
  return avisarEquipo({
    tipo: 'Cambios solicitados (rev ' + revision + '/2)', codigo: codigo, doctor: cliente, servicio: 'Diseño',
    contexto: 'Notas: ' + (notas || '—') + ' · Responder en ' + (revision >= 2 ? '1 h' : '15 min')
  });
}

/** Cliente subió fotos de feedback */
function notif_fotosSubidas(codigo, cliente, numFotos) {
  return avisarEquipo({
    tipo: 'Fotos de feedback', codigo: codigo, doctor: cliente, servicio: 'Feedback',
    contexto: (numFotos || 1) + ' foto(s) para revisión'
  });
}

/** Recordatorio SLA vencido */
function notif_slaVencido(codigo, servicio, minutos) {
  return avisarEquipo({
    tipo: 'SLA vencido', codigo: codigo, doctor: 'Sistema', servicio: servicio,
    contexto: 'Han pasado ' + minutos + ' minutos sin respuesta'
  });
}
