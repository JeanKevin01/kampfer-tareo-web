# CLAUDE.md — kampfer-tareo-web

Responder en español. App de campo (tareo QR) del sistema KAMPFER.

## Regla #1: la UX sin fricción es INTOCABLE

`index.html` existe para que el supervisor envíe el tareo del día en <2 minutos con guantes y bajo
sol: máximo 5 pantallas, botones ≥48px, cuadrilla recordada por OTM, vibración de confirmación.
Cualquier cambio que agregue pasos o fricción al registro está prohibido.

## Estado y plan

- `index.html` (~1,515 líneas, JS inline): SIN soporte offline — si el envío falla, el tareo se
  pierde. La solución es la reescritura v2 (tarea F4 del PLAN_MAESTRO, en `Analisis Claude/` del
  workspace): Preact + vite-plugin-pwa + IndexedDB con outbox e idempotencia por
  (supervisor, otm, fecha). NO parchar offline sobre el index.html actual salvo pedido explícito.
- `admin.html`: legacy duplicado del panel React. Se retira del deploy en el corte v2 (F4.3).
  No invertir en él.
- API hardcodeada: `index.html:498` y `admin.html:449` (`https://api.apps1.astraera.space`).
  En v2 pasa a `VITE_API_URL`.
- Deploy: estático en Coolify (manual). Sin build step hoy.
- Commits convencionales `tipo(scope): descripción` en español.
