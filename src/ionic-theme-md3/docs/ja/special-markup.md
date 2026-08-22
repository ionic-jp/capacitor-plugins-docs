---
title: 特別なマークアップ
---

# 特別なマークアップ

ほとんどのIonicマークアップは変更せずに使えます。以下は明示的なopt-inで、同じtemplateを `@rdlabo/ionic-theme-ios26` でも使う場合に役立ちます。

## 2行のinset list item

slotを指定しない `ion-label` と `ion-note` を隣接させると、2行のitemとして表示します。通常の末尾noteとして表示したい場合は、`ion-note` に `slot="end"` を指定します。

```html preview
<ion-list inset="true">
  <ion-item-group>
    <ion-item>
      <ion-label>Network &amp; internet</ion-label>
      <ion-note>Mobile, Wi-Fi, hotspot</ion-note>
    </ion-item>
  </ion-item-group>
</ion-list>
```

## square button

buttonのcornerをよりsquareにする場合は `.button-square` を追加します。text buttonとicon-only buttonの両方で使えます。

```html preview
<ion-button class="button-square" fill="solid">Continue</ion-button>
<ion-button class="button-square" fill="solid">
  <ion-icon name="add" slot="icon-only"></ion-icon>
</ion-button>
```

## inset listのsection header

`.item-group-header` を `ion-item-group` に追加すると、component demo pageの先頭で使われている中央揃えのicon、title、descriptionを表示できます。

これは導入用のgroupです。通常のlist itemは、その後に置く別の `ion-item-group` に入れてください。

```html preview
<ion-list inset="true">
  <ion-item-group class="item-group-header">
    <ion-item>
      <ion-label>
        <ion-icon name="list" style="background: var(--ion-color-primary)"></ion-icon>
        <h2>Lists</h2>
        <ion-text>Inset-list examples</ion-text>
      </ion-label>
    </ion-item>
  </ion-item-group>
  <ion-item-group>
    <ion-item><ion-label>First item</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

## Themeを無効にする

個別のIonic componentで標準のMaterial styleを維持する場合は `.md3-disabled` を追加します。

```html preview
<ion-button fill="solid">MD3 theme</ion-button> <ion-button class="md3-disabled" fill="solid">Standard Ionic</ion-button>
```
