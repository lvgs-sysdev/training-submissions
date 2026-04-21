import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "../../dist/frontend/",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
