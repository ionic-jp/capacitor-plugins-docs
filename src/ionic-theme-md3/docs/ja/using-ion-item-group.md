---
title: ion-item-groupの使用方法
---

# MD3テーマでの `ion-item-group` の使用方法

MD3テーマは `@rdlabo/ionic-theme-ios26` と同じinset listのmarkupに対応しているため、Ionic modeをまたいで1つのtemplateを共有できます。この共有patternをopt-inするときに `ion-item-group` を追加します。

## 必要になる条件

次の両方に該当するときだけ必要です。

- `ion-list` の `inset` propertyを有効にしている
- iOS 26 packageの任意stylesheet `md-ion-list-inset.css` をimportしている

この場合はlist itemを `ion-item-group` で囲み、list headerはgroupの外に置きます。

## 実装例

```diff
  <ion-list inset=true>
    <ion-list-header><ion-label>Label</ion-label></ion-list-header>
+   <ion-item-group>
      <ion-item>...</ion-item>
      <ion-item>...</ion-item>
+   </ion-item-group>
  </ion-list>
```

## Import

```css
@import '@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css';
```

このstylesheetは `ion-list` の背景を透明にし、背景を `ion-item-group` に持たせます。これにより `ion-list-header` を独立した要素として扱いながら、iOS 26とMD3でmarkupを共有できます。
