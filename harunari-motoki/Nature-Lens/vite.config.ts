import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    //フロントエンド用のファイル　viteはindex.htmlで読み込まれるファイルのみをコンパイルする
    outDir: "dist/viteFrontend",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
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
