---
title: 'iOS 18'
code: []
scrollActiveLine: []
---

### iOS 18でテーマファイルの読み込みを防ぐ方法

テーマファイルをユーザーの端末がiOS 26のときだけ読み込みたい場合（iOS 18のユーザーにはデフォルトのIonic iOSテーマを使わせる場合）、`import` に supports-condition を追加することで実現できます。

```css
@import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css' supports(text-wrap: pretty);
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css' supports(text-wrap: pretty);
@import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css'
  supports(text-wrap: pretty);
@import '@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css' supports(text-wrap: pretty);
```
