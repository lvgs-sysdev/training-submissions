# 1. ベースイメージとしてNode.jsを使う
FROM node:18

# 2. 作業ディレクトリを作成
WORKDIR /app

# 3. 依存関係をインストール (package.jsonの変更時のみ再実行されるよう最適化)
COPY package*.json ./
RUN npm install

# 4. ソースコードをコピー
COPY . .

# 5. React開発サーバーのポートを公開
EXPOSE 3000

# 6. 開発サーバーを起動するコマンド
CMD [ "npm", "start" ]