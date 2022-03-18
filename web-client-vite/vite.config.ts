import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     sourcemap: true,
//   },
// });

export default defineConfig(({ mode }) => ({
  plugins: mode === "development" ? [react()] : [],
  esbuild: {
    jsxInject: `import * as React from 'react'`,
  },
}));
