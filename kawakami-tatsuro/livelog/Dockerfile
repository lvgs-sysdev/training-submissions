# ベースイメージ
FROM node:25.2.1

# 作業ディレクトリ
WORKDIR /app

# 依存関係を先にコピー
COPY package.json package-lock.json ./

RUN npm install

# 残りのソースコードのコピー
COPY . .

ARG JWT_SECRET=dummy_value_for_build

ENV JWT_SECRET=$JWT_SECRET

RUN npm run build

# コンテナが起動した際に実行するコマンド
CMD ["npm", "run", "start"]
