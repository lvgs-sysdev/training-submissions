### テーブル構造

### 1. users (ユーザー情報)

| id          | email            | hashed_password | user_name   | profile_image_url | created_at | updated_at |
| :---------- | :--------------- | :-------------- | :---------- | :---------------- | :--------- | :--------- |
| UUID        | VARCHAR(255)     | VARCHAR(255)    | VARCHAR(50) | VARCHAR(255)      | TIMESTAMP  | TIMESTAMP  |
| Primary Key | UNIQUE, NOT NULL | NOT NULL        | NOT NULL    | NULL              | NOT NULL   | NOT NULL   |

---

### 2. restaurants (店舗情報)

| id          | name         | address      | latitude | longitude | genre_id    | image_url    | budget | opening_hours | average_rating | review_count | created_at | updated_at |
| :---------- | :----------- | :----------- | :------- | :-------- | :---------- | :----------- | :----- | :------------ | :------------- | :----------- | :--------- | :--------- |
| UUID        | VARCHAR(100) | VARCHAR(255) | FLOAT    | FLOAT     | INT         | VARCHAR(255) | INT    | VARCHAR(100)  | FLOAT          | INT          | TIMESTAMP  | TIMESTAMP  |
| Primary Key | NOT NULL     | NOT NULL     | NOT NULL | NOT NULL  | Foreign Key | NULL         | NULL   | NULL          | Default 0      | Default 0    | NOT NULL   | NOT NULL   |

---

### 3. reviews (口コミ情報)

| id          | user_id     | restaurant_id | score    | comment | image_url    | visit_date | created_at | updated_at |
| :---------- | :---------- | :------------ | :------- | :------ | :----------- | :--------- | :--------- | :--------- |
| UUID        | UUID        | UUID          | FLOAT    | TEXT    | VARCHAR(255) | DATE       | TIMESTAMP  | TIMESTAMP  |
| Primary Key | Foreign Key | Foreign Key   | NOT NULL | NULL    | NULL         | NULL       | NOT NULL   | NOT NULL   |

---

### 4. genres (ジャンルマスタ)

| id          | name             | created_at | updated_at |
| :---------- | :--------------- | :--------- | :--------- |
| BIGINT      | VARCHAR(50)      | TIMESTAMP  | TIMESTAMP  |
| Primary Key | UNIQUE, NOT NULL | NOT NULL   | NOT NULL   |

---

### ソート・絞り込み機能

| ソート種別           | 概要                                   | 技術的実装 / DB 処理                                                                                          |
| :------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **現在地から近い順** | ユーザーの現在位置から近い店舗順に表示 | `restaurants`テーブルの`latitude`/`longitude`と、Geolocation API で取得した現在地を用いて距離を計算しソート。 |
| **評価が高い順**     | ユーザー評価の平均点が高い順に表示     | `restaurants`テーブルの`average_rating`カラムを用いて`ORDER BY DESC`で取得。                                  |
| **口コミ数が多い順** | 口コミの投稿数が多い順に表示           | `restaurants`テーブルの`review_count`カラムを用いてソート。                                                   |
| **登録が新しい順**   | マイページへの登録日時が新しい順に表示 | `reviews`テーブルの`created_at`を用いて、ユーザーごとの履歴を時系列順に取得。                                 |

###　ディレクトリ構成

```

my-tabelog-clone/
├── prisma/ # Prisma 関連（DB スキーマ・マイグレーション）
│ ├── migrations/ # マイグレーション履歴
│ └── schema.prisma # Prisma スキーマ定義
├── public/ # 静的ファイル（画像・SVG 等）
│ └── images/
├── src/
│ ├── app/ # Next.js App Router（ページ・API ルート）
│ │ ├── \_components/ # ページ専用の UI 部品
│ │ ├── api/ # API ルート
│ │ ├── auth/ # 認証関連ページ
│ │ ├── search/ # 検索ページ
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── page.tsx # トップページ
│ ├── features/ # ドメインごとのロジック
│ ├── generated/ # 自動生成ファイル（例: Prisma Client）
│ ├── lib/ # 共通ライブラリ
│ └── shared/ # 共通部品・ロジック
│ ├── api/ # API 呼び出し用関数
│ ├── components/ # 再利用 UI 部品
│ ├── hooks/ # カスタムフック
│ ├── lib/ # 共通ライブラリ
│ └── utils/ # 汎用ユーティリティ
├── .env # 環境変数
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md

```

### 主な役割

- `prisma/` … DB スキーマ・マイグレーション管理
- `public/` … 画像や静的ファイル
- `src/app/` … ページ・API ルート（App Router 構成）
- `src/shared/components/` … 再利用可能な UI コンポーネント
- `src/shared/hooks/` … カスタムフック
- `src/shared/lib/` … Prisma クライアント等の共通ライブラリ
- `src/shared/utils/` … 汎用ユーティリティ関数
- `src/features/` … ドメインごとのロジック
- `src/generated/` … 自動生成ファイル（Prisma Client 等）

```

```
