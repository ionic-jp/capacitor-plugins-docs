---
title: '移行'
code: []
scrollActiveLine: []
---

アップグレード対象のversionに対応するsectionを参照してください。各sectionには、アプリケーションのコードまたは設定の変更が必要な項目のみを記載しています。

## 2.0.0への移行

### `.header-item-group` を `.item-group-header` に変更する

section headerとして使う `ion-item-group` のclass名を、対象elementとの一貫性を保つため変更しました。アプリケーションのtemplateとstyleにある `.header-item-group` をすべて置き換えてください。

```diff
- <ion-item-group class="header-item-group">
+ <ion-item-group class="item-group-header">
    ...
  </ion-item-group>
```

旧classはthemeでstyleされなくなりました。この変更は、`@rdlabo/ionic-theme-ios26` と共有するmarkupにも適用されます。
