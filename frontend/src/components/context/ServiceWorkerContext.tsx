import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import _ from "lodash";

interface IServiceWorkerContext {
  serviceWorker: ServiceWorker | null;
  cacheUrls: (urls: Array<string>) => void;
}

const initialContextValues = {
  serviceWorker: null,
  cacheUrls: (urls: Array<string>) => {},
};

type State = {};
const initialState = {};

export const ServiceWorkerContext =
  React.createContext<IServiceWorkerContext>(initialContextValues);

export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const serviceWorker = useRef<ServiceWorker | null>(null);

  const cacheUrls = useCallback((urls: Array<string>) => {
    if (serviceWorker.current) {
      serviceWorker.current.postMessage({
        type: "CACHE_URLS",
        urls,
      });
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("install", (event) => {
        console.log("Service worker installed");
      });

      if (navigator.serviceWorker.controller) {
        console.log("Service worker already registered");
      }

      serviceWorker.current = navigator.serviceWorker.controller;
    }
  }, []);

  return (
    <ServiceWorkerContext.Provider
      value={{ serviceWorker: serviceWorker.current, cacheUrls }}
    >
      {children}
    </ServiceWorkerContext.Provider>
  );
}
