# -----------開発用-----------
# # 1. ベースイメージとしてNode.jsを使う
# FROM node:18

# # 2. 作業ディレクトリを作成
# WORKDIR /app

# # 3. 依存関係をインストール (package.jsonの変更時のみ再実行されるよう最適化)
# COPY package*.json ./
# RUN npm install

# # 4. ソースコードをコピー
# COPY . .

# # 5. React開発サーバーのポートを公開
# EXPOSE 3000

# # 6. 開発サーバーを起動するコマンド
# CMD [ "npm", "start" ]


# -----------本番用-----------
# --- ビルドステージ ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- 配信用ステージ ---
FROM nginx:alpine
# ビルドステージで作成された静的ファイルをNginxの公開ディレクトリにコピー
COPY --from=build /app/build /usr/share/nginx/html
# ★ この行を追加：作成したNginx設定ファイルをコンテナにコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]