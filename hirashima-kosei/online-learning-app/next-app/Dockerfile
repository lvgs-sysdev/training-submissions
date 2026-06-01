FROM node:20-alpine AS builder

ARG BUILD_MODE="development"

ENV DATABASE_URL="mysql://user:P@ssw0rd@db:3306/online_learning_app"
ENV DIRECT_DATABASE_URL="mysql://root:P@ssw0rd@db:3306/online_learning_app"

WORKDIR /app
COPY package*.json ./
RUN npm ci

RUN apk add --no-cache bash curl

RUN curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it \
    && chmod +x /usr/local/bin/wait-for-it

COPY prisma ./prisma 
COPY . .

RUN npx prisma generate

RUN if [ "$BUILD_MODE" = "production" ]; then \
        NEXT_PUBLIC_FASTIFY_API_BASE_URL=https://k.hirashima.training-submissions.sysdev.lvms.jp/fastify \
        NEXT_PUBLIC_NEXT_API_BASE_URL=https://k.hirashima.training-submissions.sysdev.lvms.jp/api \
        npm run build; \
    else \
        NEXT_PUBLIC_FASTIFY_API_BASE_URL=http://localhost/fastify \
        NEXT_PUBLIC_NEXT_API_BASE_URL=http://localhost/api \
        npm run build; \
    fi

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY prisma ./prisma 
COPY entrypoint.sh ./

RUN apk add --no-cache bash curl
RUN curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it \
    && chmod +x /usr/local/bin/wait-for-it

RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["/app/entrypoint.sh"]
