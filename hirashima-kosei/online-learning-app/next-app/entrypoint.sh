#!/bin/sh
set -e

echo "Waiting for DB to be ready..."
/usr/local/bin/wait-for-it db:3306 --timeout=60 --strict -- echo "DB is up!"

echo "Running Prisma migrations (or pushing schema)..."
if ! npx prisma migrate deploy; then
  echo "No migrations found or migrate failed; pushing schema with prisma db push..."
  npx prisma db push
fi

echo "Generating Prisma Client..."
npx prisma generate

echo "Waiting for Fastify API to be ready..."
/usr/local/bin/wait-for-it api:5050 --timeout=45 --strict -- echo "Fastify API is up!"

echo "Starting Next.js server..."
exec npm run start -- -H 0.0.0.0 -p 3000
