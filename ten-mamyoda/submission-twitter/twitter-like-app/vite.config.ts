import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // バックエンドのURL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,                  // describe / it / expect をグローバルに
    environment: 'jsdom',           // React Testing Library 用に jsdom
    setupFiles: './src/setupTests.ts' // jest-dom を読み込む
  },
});
