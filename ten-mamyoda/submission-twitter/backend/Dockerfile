# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# package.json と package-lock.json を先にコピーして依存関係をインストール
COPY package*.json ./
RUN npm install 

# ソースコードをコピー
COPY . .

# TypeScript をビルド
RUN npx tsc

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# 依存関係をコピー（production のみ）
COPY --from=build /app/node_modules ./node_modules

# ビルド済み JS をコピー
COPY --from=build /app/dist ./dist

# publicフォルダを明示的にコピー
COPY public ./public

# ポート
EXPOSE 3000

# 本番用の実行
CMD ["node", "dist/server.js"]
