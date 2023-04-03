// service-worker.ts
// This is a module
/// <reference lib="WebWorker" />

interface ExtendedServiceWorkerGlobalScope extends ServiceWorkerGlobalScope {
  clients: Clients;
}

declare var self: ExtendedServiceWorkerGlobalScope;

import { ICachableResource } from "../../common/types";

const CACHE_NAME = "v1";

self.addEventListener("install", (event) => {
  sendMessageToClients({
    type: "SERVICE_WORKER_INSTALLING",
  });
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());

  sendMessageToClients({
    type: "SERVICE_WORKER_ACTIVATED",
  });
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "START_CACHING") {
    // Démarrer la mise en cache des ressources

    cacheResources(event.data.resources);
  } else if (event.data && event.data.type === "CHECK_CACHED_RESOURCES") {
    console.log("checking cached resources");

    areResourcesCached(event.data.resources).then((result) => {
      sendMessageToClients({
        type: "CHECK_CACHED_RESOURCES_RESULT",
        payload: result,
      });
    });
  }
});

async function sendMessageToClients(message: any) {
  const clientsList = await self.clients.matchAll();
  console.log(clientsList);
  clientsList.forEach((client) => {
    client.postMessage(message);
  });
}

const areResourcesCached = async (cachableResources: ICachableResource[]) => {
  let cachedCount = 0;
  let notCachedCount = 0;

  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    cachableResources.map(async (resource) => {
      const cached = await cache.match(resource.url);

      if (cached) {
        cachedCount++;
      } else {
        notCachedCount++;
      }
    })
  );

  return {
    cached: cachedCount,
    notCached: notCachedCount,
  };
};

async function cacheResources(resources: Array<ICachableResource>) {
  const cache = await caches.open(CACHE_NAME);
  let cachedCount = 0;
  let errorCount = 0;
  let size = 0;

  sendMessageToClients({
    type: "CACHE_STARTED",
    payload: {
      progress: 0,
      latestResource: null,
      nextResource: resources[0],
      total: resources.length,
    },
  });
  const BATCH_SIZE = 10; // Ajustez cette valeur en fonction de vos besoins

  const processBatch = async (batch: ICachableResource[]) => {
    return Promise.all(
      batch.map(async (resource) => {
        try {
          const response = await fetch(resource.url);
          await cache.put(resource.url, response);
          size += Number(response.headers.get("content-length")) || 0;
          cachedCount++;
        } catch (error) {
          errorCount++;
          sendMessageToClients({
            type: "CACHE_ERROR",
            payload: {
              resource: resource,
              error: error,
            },
          });
        } finally {
          const currentIndex = resources.indexOf(resource);
          sendMessageToClients({
            type: "CACHE_PROGRESS",
            payload: {
              progress: (currentIndex + 1) / resources.length,
              latestResource: resource,
              nextResource: resources[currentIndex + 1],
              size: size,
              total: resources.length,
              cachedCount,
              errorCount,
            },
          });
        }
      })
    );
  };

  for (let i = 0; i < resources.length; i += BATCH_SIZE) {
    const batch = resources.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }

  sendMessageToClients({
    type: "CACHE_COMPLETE",
    payload: {
      cachedCount,
      errorCount,
      size: size,
      progress: 1,
      total: resources.length,
    },
  });
}
