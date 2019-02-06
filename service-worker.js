/* global self, Request, URL, fetch, caches */

'use strict'

// Incrementing CACHE_VERSION will kick off the 'install' event and force previously
// cached resources to be cached again.
const CACHE_VERSION = 1

const CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
}

const URLS = [
  '/',
  'content/404.html'
]

const NOT_FOUND_URL = 'content/404.html'

function createCacheBustingRequest (url) {
  const request = new Request(url, { cache: 'reload' })

  // NOTE: `request.cache` is not supported in Chrome, so check if the option had
  // any effect.
  if ('cache' in request) {
    return request
  }

  // If `request.cache` is not supported, manually append a cache-busting param
  const bustedUrl = new URL(url, self.location.href)
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'c=' + Date.now()
  return new Request(bustedUrl)
}

async function addToCache (url) {
  // We can't use cache.add() here, since we want `url` to be the cache key but
  // the actual URL we end up requesting might include a cache-busting parameter.
  const response = await fetch(createCacheBustingRequest(url))
  if (!response.ok) {
    throw new Error(`HTTP response error for ${url}. ${response.status}`)
  }
  const cache = await caches.open(CURRENT_CACHES.offline)
  await cache.put(url, response)
}

function addAllToCache (urls) {
  return Promise.all(urls.map(url => {
    return addToCache(url)
  }))
}

self.addEventListener('install', event => {
  event.waitUntil(
    addAllToCache(URLS)
  )
})

self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES. While there is only one
  // cache in this example, the same logic will handle the case where there are
  // multiple versioned caches.
  const expectedNames = Object.values(CURRENT_CACHES)

  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.map(name => {
      if (!expectedNames.includes(name)) {
        console.log('Deleting out-of-date cache', name)
        return caches.delete(name)
      }
    }))
  })())
})

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CURRENT_CACHES.offline)
      const request = await cache.match(event.request)
      if (request && request.ok) return request
      else if (request && request.status === 404) return caches.match(NOT_FOUND_URL)
      else {
        return fetch(event.request)
          .then(response => {
            if (response.ok) {
            // if we have to fetch this request, also add it to the cache
            // but only for known files (markdown and components)
              if (/[.md$|.html$]/.test(event.request.url)) cache.put(event.request, response.clone())
              return response
            } else {
              const { url } = event.request
              console.log(`Fetch of ${url} failed, returning offline page.`)
              return caches.match(NOT_FOUND_URL)
            }
          })
          .catch(error => {
          // The catch is only triggered if fetch() throws an exception, which will
          // most likely happen due to the server being unreachable. If fetch() returns
          // a valid HTTP response with an response code in the 4xx or 5xx range, the
          // catch() will NOT be called.
            const { url } = event.request
            console.log(`Fetch of ${url} failed, returning offline page.`, error)
            return caches.match(NOT_FOUND_URL)
          })
      }
    })()
    )
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there were
  // no service worker involvement.
})
