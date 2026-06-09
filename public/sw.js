/* eslint-disable no-restricted-globals */
/**
 * Service Worker — Saúde & Bem PWA (Fase 4.0)
 * Cache de assets estáticos; navegação network-first com fallback offline.
 */

const CACHE_VERSION = "saude-bem-pwa-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
  "/offline",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
  "/icon.png",
  "/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable.png",
  "/icons/apple-touch-icon.png",
  "/logo-saude-bem.png",
];

const STATIC_DESTINATIONS = ["style", "script", "font", "image"];

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isApiOrAuth(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/auth/")) return true;
  if (url.hostname.includes("supabase.co")) return true;
  return false;
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (url.pathname.startsWith("/icons/")) return true;
  if (url.pathname.startsWith("/brand/")) return true;
  if (/\.(css|js|woff2?|png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname)) {
    return true;
  }
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    return true;
  }
  return STATIC_DESTINATIONS.includes(request.destination);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (isApiOrAuth(request)) return;

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStatic(request));
    return;
  }
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offlinePage =
      (await caches.match("/offline")) ||
      (await caches.match("/offline.html"));
    if (offlinePage) return offlinePage;

    return new Response("Você está offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function cacheFirstStatic(request) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response));
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(request) || Response.error();
  }
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
