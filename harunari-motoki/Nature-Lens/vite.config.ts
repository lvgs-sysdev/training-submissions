import { defineConfig } from "vite";

export default defineConfig({
  // HTMLファイルが置いてある場所を指定します
  root: "src/frontendScript/",
  // ビルドした後の出力先（サーバーが読み込む場所）
  build: {
    outDir: "./dist/frontend/",
  },
});
