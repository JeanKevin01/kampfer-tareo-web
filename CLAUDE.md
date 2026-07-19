# CLAUDE.md — kampfer-tareo-web

Responder en español. App de campo (tareo QR) del sistema KAMPFER — **PWA offline-first desde F4**.

## Regla #1: la UX sin fricción es INTOCABLE

`index.html` existe para que el supervisor envíe el tareo del día en <2 minutos con guantes y bajo
sol: máximo 5 pantallas, botones ≥48px, cuadrilla recordada por OTM, vibración de confirmación.
El offline es INVISIBLE: enviar guarda primero en el teléfono (outbox) y sincroniza solo; el único
rastro visible es el chip "⏳ N" y el banner 📴. Cualquier cambio que agregue pasos o fricción al
registro está prohibido.

## Arquitectura (decisión de Jean 2026-07-19: evolución del index.html, NO reescritura Preact)

- `index.html` (~1,9k líneas, JS inline, sin build step): pantallas s1–s8 + login.
  Flujo secuencial del día: tareo (s5→s6→s7) → s7 ofrece «📷 AGREGAR FOTOS» → s8 → vuelve a s7.
- `sw.js`: shell offline. index.html network-first (4 s timeout, fallback caché — los deploys
  se propagan SOLOS, sin subir versión); estáticos y fuentes cache-first; **jamás intercepta el API**.
- Outbox en IndexedDB (`kampfer-campo`/store `outbox`): tipos `tareo|reporte|nc|cuadrilla`.
  Sincroniza al volver la señal, al abrir la app y cada 60 s; backoff 2/4/8/16 s.
  Idempotencia servidor: tareo por (sup,OTM,fecha) REEMPLAZA; reportes por `id_local` UUID (0029);
  nc trata 409 como ya-aplicada; cuadrilla reemplaza por (sup,OTM,nombre).
  Errores 4xx = "fatal": quedan en la cola con ⚠ para descartar manualmente (no se auto-reintentan).
- Catálogos en localStorage (`kp_*`) con `fetchT` (timeout 8 s → cae al caché con señal débil).
- `jsqr.js` vendorizado (no CDN). Íconos: icon-192/512.png + apple-touch-icon.png.
- Token: el rol supervisor dura 7 días (API `TOKEN_TTL_SUPERVISOR_SEG`) — login solo necesita señal
  una vez por semana.
- API hardcodeada en `index.html` (const API) y en `sw.js` (API_HOST): cambiar AMBOS si cambia el dominio.
- Deploy: estático en Coolify (manual). Probar SIEMPRE la prueba de fuego: modo avión → tarear +
  reportar con foto → reconectar → todo llega UNA vez.
- Commits convencionales `tipo(scope): descripción` en español.
