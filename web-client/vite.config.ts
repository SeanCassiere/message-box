import { defineConfig } from "vite";
import * as fs from "fs";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

// to run the dev server with HTTPS, the .pem files need to be placed in the .cert directory
// brew install mkcert
// brew install nss
// mkcert -install
// npm run cert (this is to create the certs in the .cert directory)
export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    https:
      mode === "development"
        ? {
            key: fs.readFileSync("./.cert/key.pem"),
            cert: fs.readFileSync("./.cert/cert.pem"),
          }
        : false,
  },
  plugins: mode === "development" ? [react(), eslintPlugin()] : [react()],
  build: {
    sourcemap: true,
  },
}));
