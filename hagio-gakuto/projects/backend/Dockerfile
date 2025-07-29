# -----------開発用-----------
# FROM node:18
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 4000
# # TypeScriptをビルドして実行する場合
# RUN npm run build
# CMD node-pg-migrate up && node dist/app.js

# -----------本番用-----------
# --- ビルドステージ ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- 本番ステージ ---
FROM node:18-alpine
WORKDIR /usr/src/app
# ビルドステージから必要なファイルのみコピー
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
# 本番で必要な依存関係のみインストール
RUN npm install --omit=dev
EXPOSE 4000
CMD [ "node", "dist/app.js" ]