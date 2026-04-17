import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // 💡 React以外のJSX（自作h関数）もコンパイル対象に含める設定
      jsxRuntime: "classic",
    }),
  ],
  // esbuild: {
  //   jsxFactory: "h",
  //   jsxFragment: "Fragment",
  // },
  server: {
    port: 5173,
    host: "0.0.0.0", // 💡 これを入れないとAWSの外部からアクセスできません！
    proxy: {
      "/auth": "http://backend:3000", // 💡 コンテナ名で指定する
      "/posts": "http://backend:3000",
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
      // /uploads で始まる画像リクエストもバックエンドへ転送！ 💡
      "/uploads": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
  },
});
