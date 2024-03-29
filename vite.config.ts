import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  esbuild: {
    jsxInject: `import React from 'react'`, // automatically import React in jsx files
  },
  server: {
    port: 4000,
  },
  publicDir: "./src/public",
});
