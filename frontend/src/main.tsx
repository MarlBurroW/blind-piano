import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import client from "./services/colyseus";
import i18next from "./services/i18n";
import whyDidYouRender from "@welldone-software/why-did-you-render";

import { MidiProvider } from "./components/context/MidiContext";

if (process.env.NODE_ENV === "development") {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MidiProvider>
    <App />
  </MidiProvider>
);
