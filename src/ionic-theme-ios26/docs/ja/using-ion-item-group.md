---
title: ion-item-groupの使用方法
---

# ion-item-groupの使用方法

このテーマは、Ionic Frameworkアプリケーションを可能な限りiOS 26デザインに近づけることを目指しています。多くの場合、既存のIonicコードをそのまま使えますが、**特定の条件下でのみ** `ion-item-group` の追加が必要です。

## `ion-item-group` が必要な場合

次の条件を満たす場合にのみ必要です:

- `ion-list` で `inset` プロパティを有効にしている

この条件に当てはまる場合のみ、リスト項目を `ion-item-group` で囲む必要があります。

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

## なぜこの変更が必要か

### 背景: iOSデザイン再現の課題

Ionic Frameworkのデフォルトでは、`ion-list` に背景色があり、`ion-list-header` はリストの一部として扱われます。しかし、この構造では **iOSのネイティブなデザインパターン** を正確に再現できません。

![ion-list の inset 背景比較。ion-item-group が必要な理由を示す図](https://raw.githubusercontent.com/rdlabo-dev/ionic-theme-ios26/v2.3.2/screenshots/why-ion-list-inset.png)

### 解決策: 背景色の分離

iOSデザインを忠実に再現するため、このテーマは次の変更を行います:

- `ion-list` の背景色を透明にする
- 背景色を `ion-item-group` に委ねる

この変更により、`ion-list-header` を独立した要素として扱え、ネイティブなiOSの見た目を実現できます。

## Material Designで同じデザインを使う

同じデザインパターンをMaterial Designテーマでも使いたい場合は、次のCSSをインポートします:

```css
@import '@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css';
```

これにより、Material Designテーマにも同じ `ion-item-group` パターンが適用されます。

## まとめ

- **ほとんどの場合**: 既存のIonicコードをそのまま使えます
- **特定条件のみ**: `ion-list` で `inset` を使う場合にのみ `ion-item-group` が必要です
- **目的**: iOS 26のネイティブなデザインパターンを正確に再現するため
