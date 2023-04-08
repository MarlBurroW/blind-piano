import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { useLocalStorage } from "usehooks-ts";

import { ICachableResource } from "../../../../common/types";
import instrumentManager from "../../classes/InstrumentManager";
import { CacheModal } from "../modals/CacheModal";

interface IServiceWorkerContext {
  serviceWorker: ServiceWorker | null;
  openCacheModal: () => void;
  cacheStatus: {
    cached: number;
    notCached: number;
  } | null;
}

const initialContextValues = {
  serviceWorker: null,
  openCacheModal: () => {},
  cacheStatus: null,
};

export type State = {
  isCacheModalOpen: boolean;
  running: boolean;
  completed: boolean;
  progress: number;
  total: number;
  nextResource: ICachableResource | null;
  latestResource: ICachableResource | null;
  cachedCount: number;
  errorCount: number;
  size: number;
  checking: boolean;
  cacheStatus: {
    cached: number;
    notCached: number;
  } | null;
  errors: Array<{
    resource: ICachableResource;
    error: string;
  }>;
};

const initialState = {
  isCacheModalOpen: false,
  running: false,
  progress: 0,
  completed: false,
  nextResource: null,
  latestResource: null,
  total: 0,
  size: 0,
  cachedCount: 0,
  errorCount: 0,
  cacheStatus: null,
  checking: false,
  errors: [],
};

export const ServiceWorkerContext =
  React.createContext<IServiceWorkerContext>(initialContextValues);

export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const [state, setState] = useImmer<State>(initialState);

  const serviceWorkerRef = useRef<ServiceWorker | null>(null);

  const [askDisabled] = useLocalStorage<boolean>("cache-ask-disabled", false);

  const cachableResources = useMemo(() => {
    return instrumentManager.getCachableResources();
  }, [instrumentManager]);

  const startCaching = useCallback(() => {
    serviceWorkerRef.current?.postMessage({
      type: "START_CACHING",
      resources: cachableResources,
    });
  }, []);

  const openCacheModal = useCallback(() => {
    if (state.cacheStatus) {
      if (state.cacheStatus.notCached > 0 && !askDisabled) {
        setState(draft => {
          draft.isCacheModalOpen = true;
        });
      }
    }
  }, [state.cacheStatus, askDisabled, setState]);

  function checkCachedResources() {
    setState(draft => {
      draft.checking = true;
    });

    return new Promise((resolve, reject) => {
      serviceWorkerRef.current?.postMessage({
        type: "CHECK_CACHED_RESOURCES",
        resources: cachableResources,
      });

      function onResult(event: any) {
        if (event.data.type === "CHECK_CACHED_RESOURCES_RESULT") {
          setState(draft => {
            draft.cacheStatus = event.data.payload;
            draft.checking = false;
          });
          resolve(event.data.payload);
        }

        navigator.serviceWorker.addEventListener("message", onResult);
      }

      navigator.serviceWorker.addEventListener("message", onResult);
    });
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const onControllerChange = () => {
        serviceWorkerRef.current = navigator.serviceWorker.controller;
      };

      navigator.serviceWorker.addEventListener(
        "controllerchange",
        onControllerChange
      );

      if (navigator.serviceWorker.controller) {
        serviceWorkerRef.current = navigator.serviceWorker.controller;
      }

      function onMessage(event: any) {
        if (event.data.type === "CACHE_STARTED") {
          setState(draft => {
            draft.running = true;
            draft.progress = event.data.payload.progress;
            draft.total = event.data.payload.total;
          });
        } else if (event.data.type === "CACHE_PROGRESS") {
          setState(draft => {
            draft.progress = event.data.payload.progress;
            draft.latestResource = event.data.payload.latestResource;
            draft.nextResource = event.data.payload.nextResource;
            draft.cachedCount = event.data.payload.cachedCount;
            draft.errorCount = event.data.payload.errorCount;
            draft.total = event.data.payload.total;
            draft.size = event.data.payload.size;
          });
        } else if (event.data.type === "CACHE_COMPLETE") {
          setState(draft => {
            draft.running = false;
            draft.completed = true;
            draft.progress = event.data.payload.progress;
            draft.cachedCount = event.data.payload.cachedCount;
            draft.errorCount = event.data.payload.errorCount;
            draft.total = event.data.payload.total;
            draft.size = event.data.payload.size;
          });

          toast.success(
            t("notification_messages.cached_completed", {
              count: event.data.payload.cachedCount,
              total: event.data.payload.total,
            })
          );

          checkCachedResources();
        } else if (event.data.type === "CACHE_ERROR") {
          setState(draft => {
            draft.errors.push({
              resource: event.data.payload.resource,
              error: event.data.payload.error,
            });
          });
        } else if (event.data.type === "CHECK_CACHED_RESOURCES_RESULT") {
          setState(draft => {
            draft.cacheStatus = event.data.payload;
          });
        } else if (event.data.type === "SERVICE_WORKER_ACTIVATED") {
          checkCachedResources();
        }
      }

      checkCachedResources();
      navigator.serviceWorker.addEventListener("message", onMessage);
    }
  }, []);

  return (
    <ServiceWorkerContext.Provider
      value={{
        cacheStatus: state.cacheStatus,
        serviceWorker: serviceWorkerRef.current,
        openCacheModal,
      }}
    >
      <CacheModal
        onStartCaching={startCaching}
        onClose={() =>
          setState(draft => {
            draft.isCacheModalOpen = false;
          })
        }
        cachingState={state}
        isOpen={state.isCacheModalOpen}
      />

      <>{children}</>
    </ServiceWorkerContext.Provider>
  );
}
