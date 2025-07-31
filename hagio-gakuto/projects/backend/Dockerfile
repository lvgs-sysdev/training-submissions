# --- ビルドステージ ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# 開発用も含めて全てインストール
RUN npm install
COPY . .
RUN npm run build

# --- 本番ステージ ---
FROM node:18-alpine
WORKDIR /usr/src/app
# package.jsonをコピー
COPY package*.json ./
# 本番で必要な依存関係のみインストール
RUN npm install --omit=dev
# ビルドステージから成果物をコピー
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/migrations ./migrations
COPY --from=builder /usr/src/app/.env .

EXPOSE 4000
# コンテナ起動時にマイグレーションを実行してから、サーバーを起動
CMD [ "sh", "-c", "npm run migrate up && npm start" ]