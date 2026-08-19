---
title: 'はじめに'
code: []
scrollActiveLine: []
---

## 概要

## これは何ですか？

このライブラリは、プロジェクト内の ionIcons を一意にまとめ、エクスポート用の ionIcons ファイルを生成するために使います。小さなプロジェクトでは、毎回 `addIcons()` を管理するのが難しいため、自動化しました。

- 開発時: `addIcons` に全アイコンを追加することで、ストレスのない開発ができます。
- 本番時: ビルド前にテンプレートで使われている ionIcon を自動収集・更新します。

もちろん、バンドルサイズ削減を最大化するには、各コンポーネントの遅延読み込み時に最小限のアイコンだけを読み込むことが重要です。これは開発速度を優先するための妥協案です。

このプロジェクトは [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) を基にしています。

## 要件

- Node.js >= 20
- ionicons >= 6.0.0


## クイックスタート

[インストール](#インストール) のあと、`addIcons` を初期化し、本番ビルド前にアイコンを収集します。

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

詳細は [初期化](/docs/initialize) と [使い方](/docs/usage) です。

## インストール

```bash
npm install @rdlabo/ionic-angular-collect-icons --save-dev
```

## ドキュメント

上の [インストール](#インストール) から始め、[初期化](/docs/initialize) と [使い方](/docs/usage) を見てください。

- [初期化](/docs/initialize) — `addIcons` の自動または手動配線。
- [使い方](/docs/usage) — 本番ビルド前のコレクター実行。
- [CLI オプション](/docs/options) — `--dry-run`、`--initialize`、パス。
- [FAQ](/docs/faq) — テスト、バインディング、`main.ts`。
