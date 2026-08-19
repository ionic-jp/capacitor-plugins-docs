---
title: '機能'
code: []
scrollActiveLine: []
---

CSS 変数、オプトアウトクラス、Liquid Glass mixin です。リストのマークアップは [ion-item-groupの使用方法](/docs/using-ion-item-group) を見てください。

### CSS変数

ライブラリのデフォルトスタイルをデザインに合わせてカスタマイズできるよう、いくつかのCSS変数が用意されています。詳細はこのファイルを参照してください:
https://github.com/rdlabo-dev/ionic-theme-ios26/blob/v2.3.2/src/styles/default-variables.scss

### `.ios26-disabled` クラス

特定のコンポーネントでiOS26テーマを無効にするには、`.ios26-disabled` クラスを追加します。

```html
<!-- iOS26 theme applied -->
<ion-button>iOS26 Design</ion-button>

<!-- Standard Ionic iOS styling -->
<ion-button class="ios26-disabled">Standard Ionic Design</ion-button>
```

### Liquid Glass Mixin

liquid glass mixinを使うには、メインパッケージからSCSSファイルをインポートします。

```scss
@use '@rdlabo/ionic-theme-ios26/src/styles/utils/api.scss';

ion-textarea label.textarea-wrapper {
  @include api.glass-background;
}
```

### 追加デザイン

iOS26デザインへの忠実度をさらに高めるため、このライブラリが提供する追加デザインを実装できます。詳細は次を参照してください:

https://ionic-theme-ios26.netlify.app/main/docs
