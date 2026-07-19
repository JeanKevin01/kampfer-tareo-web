# kampfer-tareo-web

App de campo del sistema KAMPFER: registro de tareo con QR desde el celular del supervisor
(login → OTM → cuadrilla → HH por partida → enviar → fotos del avance). Diseñada para cero
fricción en obra y **funciona sin señal** (PWA offline-first desde F4, 2026-07-19).

## Archivos

- `index.html` — la app de campo (HTML+JS inline). **Es donde se capturan las HH.**
  Incluye el outbox offline (IndexedDB) y los catálogos cacheados (localStorage).
- `sw.js` — service worker: la app abre sin señal; nunca intercepta llamadas al API.
- `jsqr.js` — librería del scanner QR vendorizada (el scanner funciona offline).
- `manifest.json` + `icon-192.png` / `icon-512.png` / `apple-touch-icon.png` — instalable
  en Android e iOS ("Agregar a pantalla de inicio").

## Offline (F4)

Enviar SIEMPRE guarda primero en el teléfono y luego intenta la red. Sin señal: chip "⏳ N"
discreto; la cola sincroniza sola al reconectar, al abrir la app y cada 60 s. Reintentos
seguros por idempotencia del API (tareo por supervisor+OTM+fecha; reportes por `id_local`).
El login necesita señal una vez; después el token de supervisor dura 7 días.

## Configuración

La URL del API está en `index.html` (`const API`) **y** en `sw.js` (`API_HOST`).

## Deploy

Sitio estático servido desde el VPS con Coolify (deploy manual). Tras cada deploy, correr la
prueba de fuego: modo avión → tarear + reportar con foto → reconectar → todo llega UNA sola vez.
