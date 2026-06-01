# Copilot Review Instructions

このリポジトリはジュニアエンジニア向けの学習課題リポジトリです。
レビューは「正しさの指摘」だけでなく、**学習者の現在地に合わせた教育的フィードバック**を目的としています。

## リポジトリ構成

```
/
├── {username}/          # 学習者ごとのディレクトリ
│   ├── phase1/          # HTML/CSS課題（Figmaデザイン再現）
│   ├── phase2/          # ブログ構築（Node.js + Express）
│   └── phase3/          # 自由制作アプリケーション
└── .github/
    └── instructions/    # フェーズ別レビュー指針
```

## レビューの基本方針

- 学習者を萎縮させる断定的な否定表現は避ける
- 指摘には必ず「なぜそれが問題か」の理由を添える
- 1つのPRで指摘する数は多くても5〜7点に絞る（全て列挙しない）
- 修正必須の指摘と、参考情報として伝える指摘を明確に区別する
- 「次に調べると良いキーワード」を1〜2個添えて学習の足がかりにする

## フェーズ別の詳細指針

各フェーズのレビュー詳細は以下を参照してください。

- Phase 1（HTML/CSS）: `.github/instructions/phase1-html-css.instructions.md`
- Phase 2（ブログ構築）: `.github/instructions/phase2-backend.instructions.md`
- Phase 3（自由制作）: `.github/instructions/phase3-app.instructions.md`
