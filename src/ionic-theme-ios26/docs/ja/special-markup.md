---
title: 特別なマークアップとクラス
---

# 特別なマークアップとクラス

ほとんどのIonicマークアップは変更せずに使えます。以下はテーマが提供し、`demo/src/app/docs` でも使用している明示的なopt-inの組み合わせです。

## Primaryのsubmit button

solidのPrimary submit buttonは、foregroundとborderの表現に `--ion-color-primary-brightness` を使います。Primary colorに対して十分なcontrastを確保できる値を定義してください。

```css
:root {
  --ion-color-primary-brightness: #96feff;
}
```

```html
<ion-button type="submit" color="primary">Submit</ion-button>
```

## 2行のinset list item

slotを指定しない `ion-label` と `ion-note` を隣接させると、2行のitemとして表示します。iOSスタイルのinset list背景を使う場合はitemを `ion-item-group` で囲み、`ion-list-header` はgroupの外に置きます。

```html
<ion-list inset="true">
  <ion-list-header>
    <ion-label>Connections</ion-label>
  </ion-list-header>
  <ion-item-group>
    <ion-item>
      <ion-label>Network &amp; internet</ion-label>
      <ion-note>Mobile, Wi-Fi, hotspot</ion-note>
    </ion-item>
  </ion-item-group>
</ion-list>
```

通常の末尾noteとして表示したい場合は、`ion-note` に `slot="end"` を指定します。

## 幅いっぱいのsegment

segment buttonを利用可能な幅に均等配置する場合は `.segment-expand` を追加します。`registerSegmentEffect` を使う場合、このclassはLiquid Glass effectのsizeも変更します。

```html
<ion-segment class="segment-expand" value="new">
  <ion-segment-button value="new"><ion-label>New</ion-label></ion-segment-button>
  <ion-segment-button value="replied"><ion-label>Replied</ion-label></ion-segment-button>
</ion-segment>
```

## Classic search bar

ThemeのdefaultはiOS 26のsearch fieldです。従来のIonic iOS search barを維持するには `.searchbar-classic` を追加します。Toolbar固有のlayout ruleを適用するため、`ion-toolbar` の中に配置してください。

```html
<ion-toolbar>
  <ion-searchbar class="searchbar-classic"></ion-searchbar>
</ion-toolbar>
```

## Themeを無効にする

個別のIonic componentで標準のiOS styleを維持する場合は `.ios26-disabled` を追加します。

```html
<ion-button class="ios26-disabled">Standard Ionic button</ion-button>
```

Inset listの背景modelについては [ion-item-groupの使用方法](/docs/using-ion-item-group) を参照してください。
