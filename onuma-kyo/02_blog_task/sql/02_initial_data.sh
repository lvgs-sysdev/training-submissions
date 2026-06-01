#!/bin/bash
source ../.env

# ディレクトリ内のsqlファイルを実行
for file in ./initial_data/*.sql; do
    echo "Executing: $file"
    mysql -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < "$file"
done