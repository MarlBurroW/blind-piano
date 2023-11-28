import { enableMapSet } from "immer";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";

import App from "./App";
import { MidiProvider } from "./components/context/MidiContext";
import { ServiceWorkerProvider } from "./components/context/ServiceWorkerContext";
import "./index.css";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ServiceWorkerProvider>
    <MidiProvider>
      <App />
    </MidiProvider>
  </ServiceWorkerProvider>
);
