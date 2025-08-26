#!/bin/sh
# スクリプトが途中で失敗したら、そこで処理を中断する
set -e

# Prismaのマイグレーションを実行
# `migrate deploy`は、本番環境やCI/CDで使うための非対話的なコマンドです
echo "Running database migrations..."
npx prisma migrate deploy

# スクリプトの引数として渡されたコマンドを実行する
# (DockerfileのCMDで指定された "npm start" が実行される)
exec "$@"