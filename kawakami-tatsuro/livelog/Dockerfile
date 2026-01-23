# ベースイメージ
FROM node:25.2.1

# 作業ディレクトリ
WORKDIR /app

# 依存関係を先にコピー
COPY package.json package-lock.json ./

RUN npm install

# 残りのソースコードのコピー
COPY . .

RUN --mount=type=secret,id=env_file,target=.env \
    set -a && . ./.env && set +a && \
    npm run build

# コンテナが起動した際に実行するコマンド
CMD ["npm", "run", "start"]
