import { Client } from "colyseus.js";

const currentUrl = window.location.host;

// Vérification si l'URL utilise HTTPS
const isHttps = window.location.protocol === "https:";

// Transformation de l'URL en une URL de socket
const socketUrl = (isHttps ? "wss://" : "ws://") + currentUrl;

const client = new Client(
  import.meta.env.DEV ? import.meta.env.VITE_SERVER_SOCKET_URL : socketUrl
);

export default client;
