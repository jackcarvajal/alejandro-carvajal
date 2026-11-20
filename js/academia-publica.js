/* Academia pública (academia.html + curso.html): lectura anónima de cursos publicados y reglas de precio.
   Solo columnas públicas (sin video_key). Todo valor de la base se escapa con ACAcad.esc. */
'use strict';
window.ACAcad = (function () {
  var SB = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWhyd3FmeXZneWFwYnd6a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzczNDksImV4cCI6MjA5MDg1MzM0OX0.9CzmFDQYeQKcbtAZoT1_n_OuJ1qPVJu3jImd938T634';
  var NIVEL = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function urlOk(u) { u = String(u || '').trim(); if (/^\/[^/\\]/.test(u)) return u; try { var x = new URL(u); return x.protocol === 'https:' ? x.href : ''; } catch (e) { return ''; } }
  function dur(seg) { seg = Number(seg) || 0; if (!seg) return ''; var h = Math.floor(seg / 3600), m = Math.round(seg % 3600 / 60); return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : Math.max(1, m) + ' min'; }
  function cop(n) { return '$' + Math.round(Number(n)).toLocaleString('es-CO') + ' COP'; }
  function usd(n) { return 'USD ' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }); }

  /* Precio solo si está cargado: COP en Colombia, USD fuera (geo = window.ACGeo o null mientras detecta). */
  function precioHtml(c, geo) {
    var hayCop = !!c.precio_cop, hayUsd = !!c.precio_usd;
    if (!hayCop && !hayUsd) return '';
    var antes = c.precio_antes_cop ? '<s>' + esc(cop(c.precio_antes_cop)) + '</s>' : '';
    if (!geo) return '<div class="cur-precio">' + (hayCop ? antes + esc(cop(c.precio_cop)) : esc(usd(c.precio_usd))) + (hayCop && hayUsd ? '<small>' + esc(usd(c.precio_usd)) + ' fuera de Colombia</small>' : '') + '</div>';
    if (geo.esColombia ? hayCop : !hayUsd) return '<div class="cur-precio">' + antes + esc(cop(c.precio_cop)) + '</div>';
    return '<div class="cur-precio">' + esc(usd(c.precio_usd)) + '</div>';
  }
  /* Precio en texto plano para JSON-LD: { price, currency } o null */
  function precioPlano(c) {
    if (c.precio_cop) return { price: String(Math.round(Number(c.precio_cop))), currency: 'COP' };
    if (c.precio_usd) return { price: String(Number(c.precio_usd)), currency: 'USD' };
    return null;
  }
  function rest(path) {
    return fetch(SB + '/rest/v1/' + path, { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON } })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
  }
  function waInscribirse(titulo) { return 'https://wa.me/573159831800?text=' + encodeURIComponent('Hola Alejandro, quiero inscribirme en el curso ' + titulo); }
  return { SB: SB, NIVEL: NIVEL, esc: esc, urlOk: urlOk, dur: dur, cop: cop, usd: usd, precioHtml: precioHtml, precioPlano: precioPlano, rest: rest, waInscribirse: waInscribirse };
})();
