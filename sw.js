// ═══════════════════════════════════════════════════════════════
// sw.js — service worker de la app de campo KAMPFER (F4.1)
//
// Objetivo: que la app ABRA sin señal (shell offline). Los DATOS
// offline los maneja la propia app (localStorage catálogo + outbox
// en IndexedDB) — este SW jamás intercepta llamadas al API.
//
// Estrategias:
//  · index.html (navegaciones): network-first con timeout de 4 s y
//    fallback al caché. Cada respuesta buena refresca el caché, así
//    los deploys se propagan SOLOS sin subir la versión de este SW.
//  · Estáticos locales (jsqr.js, íconos, manifest): cache-first.
//  · Fuentes de Google: cache-first (tras la primera visita con red
//    la tipografía queda disponible offline; si no está, el CSS cae
//    a la fuente del sistema y la app sigue usable).
// ═══════════════════════════════════════════════════════════════
const CACHE = 'kampfer-campo-v1'
const API_HOST = 'api.apps1.astraera.space'
const PRECACHE = ['/', '/index.html', '/jsqr.js', '/manifest.json',
                  '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

function conTimeout(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
  ])
}

async function networkFirst(req, cacheKey) {
  const cache = await caches.open(CACHE)
  try {
    const res = await conTimeout(fetch(req), 4000)
    if (res && res.ok) cache.put(cacheKey, res.clone())
    return res
  } catch {
    const hit = await cache.match(cacheKey)
    if (hit) return hit
    throw new Error('offline sin caché')
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(req)
  if (hit) return hit
  const res = await fetch(req)
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone())
  return res
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET') return           // POST/PUT → red directa
  if (url.hostname === API_HOST) return            // el API NUNCA se cachea aquí
  if (e.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    e.respondWith(networkFirst(e.request, '/index.html'))
    return
  }
  if (url.origin === location.origin ||
      url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(e.request))
  }
})
