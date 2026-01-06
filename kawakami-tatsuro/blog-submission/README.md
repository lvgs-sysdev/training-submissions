# DB環境構築手順
- MySQLでのDBの作成
``` bash
mysql -u root -p

CREATE DATABASE blog_app;
```
- テーブルと初期データの作成
``` bash
mysql -u root -p blog_app < schema.sql
```