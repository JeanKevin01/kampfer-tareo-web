# kampfer-tareo-web

App de campo del sistema KAMPFER: registro de tareo con QR desde el celular del supervisor
(login → OTM → cuadrilla → HH por partida → enviar). Diseñada para cero fricción en obra.

## Archivos

- `index.html` — la app de campo (HTML+JS inline, ~1,500 líneas). **Es donde se capturan las HH.**
- `admin.html` — consola admin legacy (predecesora del panel React; se deprecará en el corte v2).
- `manifest.json` — manifest PWA básico (ícono SVG inline; iOS lo ignora — se corrige en v2).

## Configuración

La URL del API está en `index.html` (`const API`, línea ~498) y `admin.html` (~449).

## Deploy

Sitio estático servido desde el VPS con Coolify (deploy manual).

## Futuro (F4 del PLAN_MAESTRO): reescritura offline-first

La v2 (carpeta `v2/`, Preact + vite-plugin-pwa + IndexedDB) conservará la UX sin fricción y añadirá:
catálogos offline, outbox con reintentos (hoy, sin señal, el tareo del día se pierde — defecto más
grave del sistema), manifest con íconos PNG y `VITE_API_URL` por entorno.
