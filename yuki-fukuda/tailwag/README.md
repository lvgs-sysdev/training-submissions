# 1. データベースの初期化

mysql -u root -p your_db_name < src/shared/database/schema.sql
mysql -u root -p your_db_name < src/shared/database/seed.sql

# 2. ディレクトリ構成

tail.wag/
├── backend
│ ├── modules
│ │ ├── auth
│ │ ├── breeds
│ │ ├── feed
│ │ ├── follows
│ │ ├── mypage
│ │ └── users
│ ├── plugins
│ │ └── authenticate.ts
│ ├── server.ts
│ └── shared
│ └── database
├── frontend
│ ├── package-lock.json
│ ├── package.json
│ ├── src
│ │ ├── app.ts
│ │ ├── auth
│ │ ├── feed
│ │ ├── mypage
│ │ └── utils
│ └── tsconfig.json
├── package-lock.json
├── package.json
├── public
│ ├── auth
│ │ ├── login
│ │ └── register
│ ├── css
│ │ ├── auth.css
│ │ ├── mypage.css
│ │ ├── posts.css
│ │ ├── style.css
│ │ └── timeline.css
│ ├── dist
│ │ ├── app.js
│ │ ├── app.js.map
│ │ ├── auth
│ │ ├── feed
│ │ ├── mypage
│ │ └── utils
│ ├── feed
│ │ └── timeline.html
│ ├── images
│ ├── index.html
│ ├── mypage
│ │ └── mypage.html
│ └── uploads
│ └── profile-9-1775454912832.webp
├── README.md
└── tsconfig.json
