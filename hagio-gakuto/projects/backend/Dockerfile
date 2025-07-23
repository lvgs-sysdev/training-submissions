FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
# TypeScriptをビルドして実行する場合
RUN npm run build
CMD node-pg-migrate up && node dist/app.js