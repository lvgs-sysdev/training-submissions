FROM node:24-slim
WORKDIR /app
#ライブラリのインストール
COPY package*.json ./ 
RUN npm install --omit=dev
#ビルド済みの成果物をコンテナにコピー
COPY dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
