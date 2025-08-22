# ベースとなるNode.jsのバージョンを指定
FROM --platform=linux/arm64 node:20

# コンテナ内の作業ディレクトリを作成
WORKDIR /usr/src/app

# 依存関係をインストール
# package.jsonとlockファイルを先にコピーして、変更がない限りキャッシュを利用する
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

#  Next.jsが使うポートを開放
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]