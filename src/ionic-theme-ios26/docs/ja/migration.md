---
title: '移行'
code: []
scrollActiveLine: []
---

段階的な移行のために、テーマ全体のファイルではなく個別コンポーネントをインポートして、iOS26テーマを選択的に適用できます。

```css
@import '@rdlabo/ionic-theme-ios26/dist/css/utils/translucent';
@import '@rdlabo/ionic-theme-ios26/dist/css/components/ion-action-sheet';
@import '@rdlabo/ionic-theme-ios26/dist/css/components/ion-alert';
@import '@rdlabo/ionic-theme-ios26/dist/css/components/ion-button';
...
```

### 個別コンポーネントでのダークモード

個別コンポーネントをダークモード対応でインポートする場合は、CSSではなくSCSSを使います。`Always`、`System`、`Class` モードでセレクタが異なるためです。

> **Note**: 現時点では、`ion-button` にのみ個別のダークモードスタイルが適用されています。

Always（常時ダークモード）:

```scss
@use '@rdlabo/ionic-theme-ios26/src/styles/utils/theme-dark';

:root {
  @include theme-dark.default-variables;
}
@include theme-dark.ion-button;
@include theme-dark.ion-fab;
@include theme-dark.ion-tabs;
@include theme-dark.ion-segment;
```

System（システム設定に追従）:

```scss
@use '@rdlabo/ionic-theme-ios26/src/styles/utils/theme-dark';

@media (prefers-color-scheme: dark) {
  :root {
    @include theme-dark.default-variables;
  }
  @include theme-dark.ion-button;
  @include theme-dark.ion-fab;
  @include theme-dark.ion-tabs;
  @include theme-dark.ion-segment;
}
```

Class（CSSクラスで切り替え）:

```scss
@use '@rdlabo/ionic-theme-ios26/src/styles/utils/theme-dark';

.ion-palette-dark {
  @include theme-dark.default-variables;
  @include theme-dark.ion-button;
  @include theme-dark.ion-fab;
  @include theme-dark.ion-tabs;
  @include theme-dark.ion-segment;
}
```
