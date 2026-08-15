---
title: '@rdlabo/ionic-theme-md3'
---

# Ionic Theme Material Design 3

IonicアプリケーションにMaterial Design 3デザインシステムを適用するCSS/JSテーマライブラリです。

![Material Design 3テーマを適用したIonic画面。更新されたコンポーネントとナビゲーション](https://raw.githubusercontent.com/rdlabo-dev/ionic-theme-md3/v1.1.0/screenshots/md3.png)

DEMOはこちら: https://ionic-theme-md3.netlify.app/

## 概要

このライブラリは、IonicアプリケーションにMaterial Design 3デザインシステムをもたらすCSS/JSファイルを提供します。Ionicコンポーネントの見た目を、最新のMaterial Design 3ガイドラインに合わせて更新します。

このプロジェクトはIonicのコアコンセプトに可能な限り沿いながら、`@rdlabo/ionic-theme-ios26` との互換性を特に重視しています。Ionicが単一のHTML構造からiosテーマでもmdテーマでも美しいスタイルを提供するのと同じように、このテーマと `@rdlabo/ionic-theme-ios26` が十分に互換であることを目指しています。

`@rdlabo/ionic-theme-ios26` をまだご存じでない方は、ぜひ試してみてください！

👉️[rdlabo-dev/ionic-theme-ios26](https://github.com/rdlabo-dev/ionic-theme-ios26)

### 関連プロジェクト

より包括的なMaterial Design 3実装が必要な場合は、次も参考になるかもしれません:

- **[md3-for-ionic](https://github.com/danielkleebinder/md3-for-ionic)** by danielkleebinder

> **Note:** このテーマは Ionic の設計方針と `@rdlabo/ionic-theme-ios26` との互換性を目的に作られており、厳密で完全な MD3 再現を意図したものではありません。

## セットアップ

これはIonicプロジェクトを拡張するためのCSSテーマです。単体では動作しないため、Ionic Frameworkと一緒に使ってください。

```bash
npm install @rdlabo/ionic-theme-md3
```

Note: **@ionic/core@ < 8.8.0 を使う場合は**、@rdlabo/ionic-theme-md3@1.0.2 を使ってください。

プロジェクトのメインCSSファイル（例: `src/styles.scss`）でテーマをインポートします。

```css
@import '@rdlabo/ionic-theme-md3/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

次に、MD3向けのアニメーションを設定します。Ionicの設定オプションに次を追加してください。

```ts
import { isPlatform } from '@ionic/core'; // or @ionic/angular/standalone, @ionic/react, @ionic/vue
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

// Angular
provideIonicAngular({
    ...
    navAnimation: isPlatform('ios') ? undefined: mdTransitionAnimation,
});

// React
setupIonicReact({
    ...
    navAnimation: isPlatform('ios') ? undefined: mdTransitionAnimation,
});

// Vue
createApp(App)
    .use(IonicVue, {
        ...
        navAnimation: isPlatform('ios') ? undefined: mdTransitionAnimation,
})
```

## 開発とテスト

### デモアプリケーション

`demo/` ディレクトリには、テーマのテストとデモ用のAngularアプリケーションが含まれます。デモを実行するには:

```bash
cd demo
npm install
npm start
```

### 視覚的回帰テスト

全コンポーネントで一貫したスタイルを保証するため、視覚的回帰テストにPlaywrightを使っています。テストスイートは、ライトモードとダークモードの全ルートのスクリーンショットを自動で取得します。

#### テストの実行

```bash
cd demo

# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# Update baseline screenshots (when intentionally changing UI)
npm run test:e2e:update
```
