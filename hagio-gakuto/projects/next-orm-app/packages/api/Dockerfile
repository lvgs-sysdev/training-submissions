FROM node:18
WORKDIR /usr/src/app

# ★ 修正点: pnpm-lock.yamlを削除
COPY package.json ./

RUN npm install -g pnpm && pnpm install
COPY . .
CMD ["pnpm", "run", "dev"]