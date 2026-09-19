# SECURITY — Alejandro Carvajal CAD/CAM (alejandrocadcam.com)

Postura de seguridad y resistencia post-cuántica · Security posture & post-quantum readiness
Última auditoría de código / Last code audit: **2026-09-19** (Claude Opus 4.8, análisis estático + prueba RLS en vivo).

Comparte proyecto Supabase (`zgihrwqfyvgyapbwzkvw`) con PRODIGY Lab Dental, separado por la columna `negocio`.

---

## 🇪🇸 Resumen (Español)

Arquitectura: sitio estático en **Cloudflare Pages** + **Cloudflare Functions** + **Supabase** (Postgres/PostgREST/RLS/Auth). Sin servidor propio.

### Resultado de la auditoría — TODO PASA
| Control | Estado | Detalle |
|---|---|---|
| Secretos en cliente | ✅ | Ninguno. `service_role` solo en `functions/api/*` desde env vars. Cliente usa anon key pública (`role:anon`). |
| RLS (probado en vivo) | ✅ | La anon key lee **0 filas** de `pedidos`, `solicitudes_scanner`, `newsletter_subscribers`. Solo `casos_portafolio` público es legible (correcto). |
| CORS | ✅ | Allowlist por origen; sin wildcard en endpoints con datos. |
| Autorización de roles | ✅ | `app_metadata` / email allowlist, nunca `user_metadata`. |
| XSS | ✅ | `escH()`/`textContent` para datos externos en innerHTML. |
| Cabeceras | ✅ | CSP, HSTS `max-age=63072000; includeSubDomains; preload`, nosniff, X-Frame-Options, Referrer-Policy. |
| Aislamiento por negocio | ✅ | Consultas filtran `negocio` en las 5 tablas compartidas. |

### Resistencia cuántica
- TLS (RSA/ECDSA, vulnerable a Shor) lo gestiona **Cloudflare**, que ya negocia **llave híbrida post-cuántica** (X25519 + **ML-KEM/Kyber**) automáticamente.
- **Datos en reposo** en Supabase: cifrado **AES-256** (cuántico-resistente). **En tránsito**: TLS post-cuántico.
- Sin cripto asimétrica propia. `crypto.getRandomValues` para IDs; `Math.random` solo UI.

### Pendiente (config, no código)
- Cloudflare SSL/TLS: **TLS 1.3 mínimo** + **Post-Quantum** activo. Mantener **HSTS preload**.

---

## 🇬🇧 Summary (English, technical)

Static site on **Cloudflare Pages** + edge **Functions** + **Supabase**. Client is untrusted; privileged writes go through Functions (service-role, env-injected) or RLS-guarded RPCs.

### Findings — all PASS (SAST + live RLS probe, 2026-09-19)
- **Secrets**: none client-side; `service_role` only as `env.SUPABASE_SERVICE_KEY` in `functions/api/*`. Client uses anon JWT (`role:anon`).
- **RLS (live-verified)**: anon `SELECT` on `pedidos`, `solicitudes_scanner`, `newsletter_subscribers` returns **0 rows** (PII/leads protected). Only public `casos_portafolio` is readable, by design.
- **CORS**: origin allowlist with canonical-origin fallback; no reflected wildcard on data endpoints.
- **AuthZ**: role checks via `app_metadata`/email allowlist; `user_metadata` display-only.
- **XSS**: DB/external data HTML-escaped or `textContent` before `innerHTML`.
- **Transport headers**: HSTS (2y, preload), strict CSP, nosniff, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`.

### Post-quantum posture
- TLS handshake terminated by **Cloudflare**, which negotiates **hybrid PQ key exchange** (X25519 + **ML-KEM/Kyber**, NIST FIPS 203) with capable clients — automatic.
- Supabase **data at rest**: **AES-256** (quantum-resistant symmetric); **in transit**: post-quantum TLS.
- No bespoke asymmetric crypto in first-party code. CSPRNG for identifiers; `Math.random` confined to non-security UI.

### Recommended config actions (dashboard, not code)
- Cloudflare SSL/TLS → **minimum TLS 1.3**; confirm **Post-Quantum** key agreement. Keep domain in **HSTS preload**.

### Reporting a vulnerability
WhatsApp **+57 321 958 1949** with reproduction steps. No live exploitation of production without written authorization.

---

*Nota / Note:* auditoría a nivel de **código** (SAST) + prueba RLS de lectura. No sustituye un pentest dinámico autorizado (DAST). / Code-level audit + RLS read probe; does not replace an authorized dynamic pentest.
