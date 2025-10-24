import { defineConfig } from "vite";
import { resolve } from "path";
// import react from '@vitejs/plugin-react-swc'
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        iframe: resolve(__dirname, "iframe-viewport.html"),
      },
    },
  },
});
