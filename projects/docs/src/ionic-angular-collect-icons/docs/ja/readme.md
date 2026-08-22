---
title: 'はじめに'
code: []
scrollActiveLine: []
---

## これは何ですか？

このライブラリは、プロジェクト内の ionIcons を一意にまとめ、エクスポート用の ionIcons ファイルを生成するために使います。小さなプロジェクトでは、毎回 `addIcons()` を管理するのが難しいため、自動化しました。

- 開発時: `addIcons` に全アイコンを追加することで、ストレスのない開発ができます。
- 本番時: ビルド前にテンプレートで使われている ionIcon を自動収集・更新します。

もちろん、バンドルサイズ削減を最大化するには、各コンポーネントの遅延読み込み時に最小限のアイコンだけを読み込むことが重要です。これは開発速度を優先するための妥協案です。

このプロジェクトは [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) を基にしています。

## 要件

- Node.js >= 22
- Ionic Angular >= 9.0.0
- Angular >= 18.0.0
- TypeScript >= 5.4.0
- ionicons >= 8.0.0
- @angular-eslint/template-parser 21 または 22


## クイックスタート

[インストール](#インストール) のあと、`addIcons` を初期化し、本番ビルド前にアイコンを収集します。

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

詳細は [初期化](/docs/initialize) と [使い方](/docs/usage) です。

## Ionic Angular 8からの移行

アプリケーションの変更をcommitしてから、アプリケーションrootでIonic公式のmigration toolを実行します。

```bash
npx @ionic/migrate
```

安全に自動化できる変更が適用され、手動確認が必要な項目が表示されます。完了後にこのpackageを更新し、残りの確認事項は[Ionic Angular 9への移行](/docs/migration)を参照してください。

## インストール

```bash
npm install --save-dev \
  @rdlabo/ionic-angular-collect-icons \
  @angular-eslint/template-parser@^21
```

Angular ESLint 22を使うprojectでは、代わりに `@angular-eslint/template-parser@^22` を指定してください。parserはpeer dependencyのため、collectorはアプリケーションと同じ世代のAngular template parserを使います。

## ドキュメント

上の [インストール](#インストール) から始め、[初期化](/docs/initialize) と [使い方](/docs/usage) を見てください。

- [初期化](/docs/initialize) — `addIcons` の自動または手動配線。
- [使い方](/docs/usage) — 本番ビルド前のコレクター実行。
- [移行](/docs/migration) — 既存projectをIonic Angular 9へ移行する。
- [CLI オプション](/docs/options) — `--dry-run`、`--initialize`、パス。
- [FAQ](/docs/faq) — テスト、バインディング、`main.ts`。
