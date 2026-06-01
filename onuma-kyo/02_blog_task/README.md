# 環境構築手順

1. `onuma-kyo/02_blog_task`ディレクトリまで移動
2. `.env.example`をコピーして、`.env`を作成
3. `.env`各種環境変数を設定する
4. `onuma-kyo/02_blog_task/sql`ディレクトリまで移動
5. 下記コマンドで初期スキーマを構築
    ```
    bash 01_migration.sh
    ```
6. 下記コマンドで初期データを投入
    ```
    bash 02_initial_data.sh
    ```
7. `npm run dev`ローカルサーバー起動