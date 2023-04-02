import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { VitePWA } from "vite-plugin-pwa";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 3000,
  },
  plugins: [
    react(),
    VitePWA({
      srcDir: "src",
      filename: "sw.ts",
      outDir: "../backend/public",
      strategies: "injectManifest",
      injectRegister: "script",

      devOptions: {
        enabled: true,
      },
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: "../backend/public",
  },
});
