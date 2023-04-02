import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableMapSet } from "immer";
import { MidiProvider } from "./components/context/MidiContext";
import { ServiceWorkerProvider } from "./components/context/ServiceWorkerContext";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ServiceWorkerProvider>
    <MidiProvider>
      <App />
    </MidiProvider>
  </ServiceWorkerProvider>
);
