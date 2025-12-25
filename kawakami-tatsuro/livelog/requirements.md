# ライブ記録アプリ 仕様書

## 1. プロジェクト概要

### コンセプト
ライブ・コンサートの参加記録をSNSライクなUIで投稿・管理できるWebアプリケーション。

### ターゲットユーザー
* 自分のようなライブによく行く音楽好き

### 解決する課題
* ライブに特化した記録アプリがない


## 2. 技術スタック (Tech Stack)

### Frontend & Backend
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, shadcn/ui
* **Architecture:** Feature-based Architecture (機能単位アーキテクチャ)

### Database & Infrastructure
* **Database:** MySQL
* **Driver:** `mysql2` (Raw SQLを使用。ORMは**不使用**)

### External Services
* **Spotify Web API:** 楽曲・アーティスト情報の検索・取得


## 3. ディレクトリ構成 (Directory Structure)

```text
src/
├── app/                 # Next.js App Router（ページコンポーネント）
│   ├── (auth)/          # 認証関連
│   │   ├── login/       # ログイン
│   │   └── register/    # 新規会員登録
│   │
│   └── (main)/          # メイン機能（丸括弧で閉じているのでルーティングには影響しない）
│       ├── account/     # アカウント情報
│       ├── post/        # 投稿関連
│       └── user/        # ユーザープロフィール
│
├── features/            # 機能単位モジュール
│   ├── account/         # アカウント情報表示・編集機能
│   ├── auth/            # 認証機能
│   ├── post/            # 投稿機能
│   └── user/            # ユーザー機能
│
├── components/          # 共通UI部品
│   └── ui/              # shadcn/uiのコンポーネント
├── lib/                 # 共通基盤 (DB, Spotify等)
├── proxy.ts             # 未ログインユーザーの特定ページへのアクセス制限等（旧 middleware.ts）
└── types/               # 共通の型定義
```

## 4. 機能・画面一覧

| No. | 機能名 | 機能概要 | 画面名 | 画面詳細 | パス |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **新規登録** | ユーザーIDとパスワードを登録する | **新規登録画面** | ユーザーアカウントの新規作成を行う | `/register` |
| 2 | **ログイン** | ユーザーIDとパスワードを入力する（JWTを用いた認証を行う） | **ログイン画面** | ユーザーがログインする | `/login` |
| 3 | **投稿一覧表示** | ユーザーらの投稿がタイムラインとして表示される。<br>投稿には、ユーザー名、プロフィール画像、ライブの日付、アーティスト名、そのライブの1曲、投稿日時等が含まれる | **トップページ** | 最新の投稿、検索欄が表示される | `/` |
| 4 | **投稿検索** | アーティスト名で投稿を検索する | **投稿検索** | 検索欄が表示され、artistsテーブルに存在するアーティストを検索することができる | - |
| 5 | **投稿検索結果表示** | 上記で投稿を検索した結果を表示する | **投稿検索結果表示画面** | 検索条件に合致した投稿が表示される | `/post/search?q=[id]` |
| 6 | **ポスト投稿** | ポストを作成する | **ポスト投稿画面** | ポスト内容の入力欄、アーティスト、曲の検索欄が表示される | `/post` |
| 7 | **ポスト編集** | 過去の自分のポストの内容を編集する | **ポスト編集画面** | 投稿記事を編集できる | `/post/edit/[id]` |
| 8 | **ユーザープロフィール表示** | ユーザー名、投稿一覧を表示する | **ユーザープロフィール画面** | ユーザー情報、投稿一覧が表示され、ユーザー名は編集することができる | `/user/[id]` |
| 9 | **ユーザー情報閲覧・編集** | ユーザー名、メールアドレスを確認・編集する | **ユーザー情報画面** | Editボタンを押下すると編集モードに切り替わり、インラインで編集をすることができる | `/account` |
| 10 | **いいね機能** | 好きなポストにいいねをする。<br>いいねをしていない状態でボタンをクリックするといいね、逆でいいねを削除 | **ポストが表示されている画面すべて** | - | - |

## 5. データベース構成 (Database Schema)

### Users テーブル
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **id** | INT | PK, AUTO_INCREMENT | |
| **user_name** | VARCHAR(30) | NOT NULL | |
| **email** | VARCHAR(255) | NOT NULL, UNIQUE | |
| **password** | VARCHAR(255) | NOT NULL | |
| **pic_path** | VARCHAR(255) | | Profile Picture |
| **created_at** | DATETIME | DEFAULT CURRENT_TIMESTAMP | |
| **updated_at** | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

### Posts テーブル
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **id** | INT | PK, AUTO_INCREMENT | |
| **user_id** | INT | FK, NOT NULL | References Users(id) |
| **content** | TEXT | | Content |
| **track_id** | INT | FK, NOT NULL | References Tracks(id) |
| **show_date** | DATE | NOT NULL | |
| **created_at** | DATETIME | DEFAULT CURRENT_TIMESTAMP | |

### Tracks テーブル
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **id** | INT | PK, AUTO_INCREMENT | |
| **spotify_id** | VARCHAR(50) | NOT NULL | Spotify Track ID |
| **artist_id** | INT | FK, NOT NULL | References Artists(id) |
| **title** | VARCHAR(255) | NOT NULL | Track Title |
| **created_at** | DATETIME | DEFAULT CURRENT_TIMESTAMP | |

### Artists テーブル
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **id** | INT | PK, AUTO_INCREMENT | |
| **spotify_id** | VARCHAR(50) | NOT NULL | Spotify Artist ID |
| **artist_name** | VARCHAR(255) | NOT NULL | Artist Name |
| **created_at** | DATETIME | DEFAULT CURRENT_TIMESTAMP | |

### Likes テーブル
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **user_id** | INT | PK, FK | References Users(id) |
| **post_id** | INT | PK, FK | References Posts(id) |
| **created_at** | DATETIME | DEFAULT CURRENT_TIMESTAMP | |
