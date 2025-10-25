import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        // iframe entry point: needed for both dev and prod
        // This tells Vite to bundle ViewportFrameContent.tsx as a separate entry
        iframe: resolve(__dirname, "iframe-viewport.html"),
      },
    },
  },
});
