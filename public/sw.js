/**
 * Utilboxes service worker — lets pages and tools you have opened keep
 * working with no connection.
 *
 * What it caches, and how:
 *   pages (navigations)     network first, cached copy only when offline, so a
 *                           deploy is never hidden behind a stale page
 *   /_next/static/*         cache first; these files are content-hashed, so a
 *                           cached copy can never be out of date
 *   other same-origin GETs  served from cache, refreshed in the background
 *                           (icons, fonts, the pdf.js worker and its data)
 *
 * What it never touches: other origins (ads, analytics, model and font CDNs),
 * /api/* (live lookups must be live), non-GET requests, and React Server
 * Component payloads for client-side navigation. When one of those payloads
 * fails offline, Next.js falls back to a full page load, which is served from
 * the page cache below.
 *
 * Kill switch: if this ever misbehaves, replace the fetch handler with nothing
 * and bump VERSION. The new worker activates immediately and its activate step
 * deletes every older cache.
 */
const VERSION = "v1";
const PAGES = `utilboxes-pages-${VERSION}`;
const ASSETS = `utilboxes-assets-${VERSION}`;
const PAGE_LIMIT = 80;
const ASSET_LIMIT = 400;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PAGES, ASSETS]);
      for (const key of await caches.keys()) {
        if (!keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;
  if (request.headers.has("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/** Only complete, same-origin responses are worth keeping. */
function cacheable(response) {
  return response && response.status === 200 && response.type === "basic";
}

async function put(cacheName, request, response, limit) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  // Oldest first: keys come back in insertion order.
  for (let i = 0; i < keys.length - limit; i += 1) await cache.delete(keys[i]);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (cacheable(response)) await put(PAGES, request, response.clone(), PAGE_LIMIT);
    return response;
  } catch {
    const cached = await caches.match(request, { cacheName: PAGES });
    if (cached) return cached;
    return new Response(
      "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>" +
        "<title>Offline | Utilboxes</title>" +
        "<body style='font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;line-height:1.5'>" +
        "<h1>You are offline</h1><p>This page has not been opened on this device yet, so there is no saved copy. " +
        "Pages and tools you have already opened keep working without a connection.</p>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { cacheName: ASSETS });
  if (cached) return cached;
  const response = await fetch(request);
  if (cacheable(response)) await put(ASSETS, request, response.clone(), ASSET_LIMIT);
  return response;
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { cacheName: ASSETS });
  const refresh = fetch(request)
    .then(async (response) => {
      if (cacheable(response)) await put(ASSETS, request, response.clone(), ASSET_LIMIT);
      return response;
    })
    .catch(() => cached ?? Response.error());
  return cached ?? refresh;
}
