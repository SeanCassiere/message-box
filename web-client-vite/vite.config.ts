import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     sourcemap: true,
//   },
// });

export default defineConfig(({ mode }) => ({
  plugins: mode === "development" ? [react(), eslintPlugin()] : [],
  build: {
    sourcemap: true,
  },
}));
