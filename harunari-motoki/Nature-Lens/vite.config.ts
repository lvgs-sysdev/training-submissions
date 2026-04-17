import { defineConfig } from "vite";

export default defineConfig({
  // HTMLファイルが置いてある場所を指定します
  root: ".",
  // ビルドした後の出力先（サーバーが読み込む場所）
  build: {
    outDir: "../../dist/frontend/",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/scanResult": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/register": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/login": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
