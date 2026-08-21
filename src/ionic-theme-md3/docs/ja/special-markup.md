---
title: 特別なマークアップ
---

# 特別なマークアップ

ほとんどのIonicマークアップは変更せずに使えます。以下は `demo/src/app/docs` でも使用している明示的なopt-inの組み合わせで、同じtemplateを `@rdlabo/ionic-theme-ios26` でも使う場合に役立ちます。

## 2行のinset list item

slotを指定しない `ion-label` と `ion-note` を隣接させると、2行のitemとして表示します。通常の末尾noteとして表示したい場合は、`ion-note` に `slot="end"` を指定します。

```html
<ion-list inset="true">
  <ion-item>
    <ion-label>Network &amp; internet</ion-label>
    <ion-note>Mobile, Wi-Fi, hotspot</ion-note>
  </ion-item>
</ion-list>
```

Applicationが `@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css` をimportしている場合は、list itemを `ion-item-group` で囲み、`ion-list-header` はgroupの外に置きます。

```html
<ion-list inset="true">
  <ion-list-header><ion-label>Connections</ion-label></ion-list-header>
  <ion-item-group>
    <ion-item>
      <ion-label>Network &amp; internet</ion-label>
      <ion-note>Mobile, Wi-Fi, hotspot</ion-note>
    </ion-item>
  </ion-item-group>
</ion-list>
```

必要なimportと背景modelは [ion-item-groupの使用方法](/docs/using-ion-item-group) を参照してください。
