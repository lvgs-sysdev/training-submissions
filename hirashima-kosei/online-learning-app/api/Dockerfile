FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app ./

RUN npm rebuild && npm prune --production

RUN npm rebuild && npm prune --production

EXPOSE 5050 

CMD ["node", "src/server.js"]
