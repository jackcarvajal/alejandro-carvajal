# VERIFICAR — Protocolo Alejandro CAD/CAM
> Qué hacer TÚ después de cada cambio de Claude.

---

## ANTES DE VERIFICAR (siempre)
1. Espera ~2 min a que Cloudflare despliegue
2. Abre **ventana incógnito** (`Ctrl+Shift+N`)
3. Ve directo a la URL del cambio

---

## LO QUE ME DEBES REPORTAR

**Si algo NO funciona:**
```
- URL exacta donde falla
- Qué ves (error, pantalla en blanco, elemento faltante)
- Dispositivo: PC / móvil
- Navegador: Chrome / Safari / otro
```
**Si funciona:** `"OK"` es suficiente.

---

## CHECKLISTS POR TIPO DE CAMBIO

### Chatbot IA
- [ ] Abrir chat (ícono robot en esquina)
- [ ] Escribir "¿cuánto cuesta una corona?" — ¿responde en español?
- [ ] Si falla: verificar `GEMINI_API_KEY` en Cloudflare Env Vars → redesplegar

### Artículos (blog)
- [ ] `alejandrocadcam.pages.dev/blog` — ¿carga la lista?
- [ ] Click en un artículo — ¿abre `/article?id=...`?
- [ ] ¿El contenido (texto, tablas) se ve correctamente?

### Flujo de pedido (flujo-diseno)
- [ ] Seleccionar tipo → material → cantidad — ¿actualiza el total en USD?
- [ ] Rellenar formulario → Enviar — ¿aparece recibo?
- [ ] Verificar en Supabase tabla `pedidos` → ¿llegó el registro?

### Portafolio
- [ ] `alejandrocadcam.pages.dev/portafolio` — ¿cargan los casos?
- [ ] Click en caso → `caso?id=...` — ¿abre correctamente?

### Cambio visual (CSS, layout)
- [ ] ¿Se ve el elemento donde debe estar?
- [ ] ¿Colores correctos (magenta/gold/cyan)?
- [ ] ¿Se ve bien en móvil? (redimensiona a ~375px)

---

## COMANDOS DE EMERGENCIA

**Cache viejo (ves el diseño antiguo):**
```
F12 → Application → Service Workers → Unregister → Recargar
```

**Ver último commit desplegado:**
```bash
git log --oneline -5
```

---

## SEÑALES DE ALERTA (repórtame de inmediato)
- Página en blanco o sin contenido
- Error "Failed to fetch" o "Supabase error" visible
- Bot que responde "configurado" o "dificultades" → falta `GEMINI_API_KEY`
- Formulario que no envía después de 3 intentos
- Consola con errores en rojo (F12 → Console)
