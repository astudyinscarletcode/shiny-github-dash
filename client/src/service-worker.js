/**
 * A very simple ServiceWorker that caches the
 * site for offline use.
 */

// Keep track of the cache.
let CACHE_VERSION = '1'
let STATIC_CACHE = 'static'

let expectedCaches = [CACHE_VERSION, STATIC_CACHE]

self.addEventListener('install', (event) => {
    // Store some files on first load.
  function onInstall () {
    return caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll([
              '/main.min.js',
              '/index.html',
              '/assets/favicon.ico'
            ]))
  }

  event.waitUntil(onInstall(event))
})

// Clear out the cache if service worker is updated.
self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys()
          .then((keys) => Promise.all(
              keys.map((key) => {
                if (!expectedCaches.includes(key)) {
                  return caches.delete(key)
                }
              })
          ))
  )
})

 /**
   * Listen for push-notifications.
   */
  self.addEventListener('push', (event) => {
    console.info('Event: Push')
    console.log(event)
    let title = 'Event'
    let body = {
      body: 'so',
      tag: 'shiny'
    }
    event.waitUntil(
      self.registration.showNotification(title, body)
    )
  })

// Handle fetch events by first asking the network, then sending back the cached resource if available.
self.addEventListener('fetch', (event) => {
  function onFetch (event) {
    let request = event.request

    event.respondWith(
          fromNetwork(event.request, 1000)
              .then((response) => {
                if (response.type === 'opaqueredirect') {
                      // Do not cache redirects, follow them.
                  return Promise.reject(event)
                }

                return addToCache(CACHE_VERSION, request, response)
              })
              .catch(() => fetchFromCache(event))
              .catch(() => fetch(request)))
  }

  // Add responses to cache to fetch later.
  function addToCache (cacheKey, request, response) {
    if (response.ok) {
      let copy = response.clone() // Copy the response as to not use it up.
      caches.open(cacheKey).then((cache) => {
        cache.put(request, copy)
      })

      return response
    }
  }

  // Get responses from cache.
  function fetchFromCache (fetchevent) {
    return caches.match(fetchevent.request).then((response) => {
      if (!response) {
        throw Error(`${event.request.url} not found in cache`)
      }

      return response
    })
  }

  // Get response from network.
  function fromNetwork (request, timeout) {
    return new Promise((resolve, reject) => {
      let timeoutId = setTimeout(reject, timeout)

      fetch(request)
              .then((response) => {
                clearTimeout(timeoutId)
                resolve(response)
              })
              .catch((err) => {
                reject(err)
              })
    })
  }

  // Use cache first if GET request.
  if (isCacheable(event.request)) {
    onFetch(event)
  }

  // Do not intervene with github,socket, or anything that isn't a GET request.
  function isCacheable (request) {
    let parsedURL = new URL(request.url)

    let isGithub = parsedURL.origin.includes('github')
    let isLogin = parsedURL.pathname.includes('login')
    let isSocket = parsedURL.pathname.includes('socket.io')
    let isGET = request.method === 'GET'

    return ((!(isGithub || isSocket || isLogin)) && isGET)
  }
})
