import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from "./package.json";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    // Electron 40 usa Chromium ~114 (boa compatibilidade)
    target: "chrome114",
  },
}));
