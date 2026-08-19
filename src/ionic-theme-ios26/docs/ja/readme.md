---
title: 'はじめに'
code: []
scrollActiveLine: []
---

IonicアプリケーションにiOS26デザインシステムを適用するCSS/JSテーマライブラリです。

![iOS 26テーマを適用したIonic画面。Liquid Glassのタブバー、リスト、コントロール](https://raw.githubusercontent.com/rdlabo-dev/ionic-theme-ios26/v2.3.2/screenshots/ios26.png)

DEMOはこちら: https://ionic-theme-ios26.netlify.app/

## 概要

このライブラリは、IonicアプリケーションにiOS26デザインシステムをもたらすCSS/JSファイルを提供します。Ionicコンポーネントの見た目を、最新のiOS26デザインガイドラインに合わせて更新します。

Android Design（Material Design 3）テーマも作成中です。ぜひチェックしてください！

👉️[rdlabo-dev/ionic-theme-md3](https://github.com/rdlabo-dev/ionic-theme-md3)


## クイックスタート

[インストール](#インストール) のあと、テーマ CSS をインポートします。詳細は下のインストールです。

## インストール

これはIonicプロジェクトを拡張するためのCSSテーマです。単体では動作しないため、Ionic Frameworkと一緒に使ってください。

```bash
npm install @rdlabo/ionic-theme-ios26
```

Note: **@ionic/core@ < 8.8.1 を使う場合は**、@rdlabo/ionic-theme-ios26@2.2.1 を使ってください。

プロジェクトのメインCSSファイル（例: `src/styles.scss`）でテーマをインポートします。

```css
@import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';

/**
 * This file is to eliminate the impact of class name changes for iOS26.
 * For example, `ion-buttons ion-button[fill=default]` is not normally implemented, but may be required for iOS26.
 * This file is to eliminate such effects.
 * Note: This is not include `@rdlabo/ionic-theme-md3`
 */
@import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';

/**
 * If you will use the design of ion-item-group with ion-list on Android as well, import it.
 * More info: https://github.com/rdlabo-dev/ionic-theme-ios26/blob/v2.3.2/USING_ION_ITEM_GROUP.md
 * Note: This is include `@rdlabo/ionic-theme-md3`
 * @import '@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css';
 */

/*
 * Support Dark Mode
 * We support Ionic Dark Mode. More information is here: https://ionicframework.com/docs/theming/dark-mode
 * use Always:    @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-always.css'
 * use System:    @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css'
 * use CSS Class: @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-class.css'
 */
```

次に、iOS 26向けのアニメーションを設定します。Ionicの設定オプションに次を追加してください。

```ts
import { isPlatform } from '@ionic/core'; // or @ionic/angular/standalone, @ionic/react, @ionic/vue
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';

// Angular
provideIonicAngular({
    ...
    navAnimation: isPlatform('ios') ? iosTransitionAnimation: undefined,
    popoverEnter: isPlatform('ios') ? popoverEnterAnimation: undefined,
    popoverLeave: isPlatform('ios') ? popoverLeaveAnimation: undefined,
});

// React
setupIonicReact({
    ...
    navAnimation: isPlatform('ios') ? iosTransitionAnimation: undefined,
    popoverEnter: isPlatform('ios') ? popoverEnterAnimation: undefined,
    popoverLeave: isPlatform('ios') ? popoverLeaveAnimation: undefined,
});

// Vue
createApp(App)
    .use(IonicVue, {
        ...
        navAnimation: isPlatform('ios') ? iosTransitionAnimation: undefined,
        popoverEnter: isPlatform('ios') ? popoverEnterAnimation: undefined,
        popoverLeave: isPlatform('ios') ? popoverLeaveAnimation: undefined,
})
```


## ドキュメント

上の [インストール](#インストール) から始め、inset リストでは [ion-item-groupの使用方法](/docs/using-ion-item-group) を見てください。

- [ion-item-groupの使用方法](/docs/using-ion-item-group) — inset リストに必要なマークアップ。
- [機能](/docs/features) — CSS 変数、`.ios26-disabled`、Liquid Glass。
- [実験的なアニメーション](/docs/experimental-animation) — タブバーと Searchable。
- [iOS 18](/docs/ios-18) — iOS 26 だけでテーマを読む。
- [移行](/docs/migration) — コンポーネント単位の import とダークモード。
