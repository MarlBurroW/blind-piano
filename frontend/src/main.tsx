import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { MidiProvider } from "./components/context/MidiContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MidiProvider>
    <App />
  </MidiProvider>
);
