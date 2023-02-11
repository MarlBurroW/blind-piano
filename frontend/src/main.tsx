import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import client from "./services/colyseus";
import i18next from "./services/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
