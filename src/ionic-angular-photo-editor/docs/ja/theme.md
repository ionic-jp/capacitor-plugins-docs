---
title: 'テーマ'
code: []
scrollActiveLine: []
---

[インストール](/docs/readme#インストール) のあと、エディターの色を上書きします。

デフォルトの色は設定済みですが、上書きできます: https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/photo-editor/src/lib/pages/core.scss

## 上書き方法

```scss
:root {
  --ion-photo-editor-background: #2a2a2a;
  --ion-photo-editor-background-tint: #414141;

  --ion-photo-editor-color: #f0f0f0;
  --ion-photo-editor-color-tint: #dbdbdb;

  --ion-photo-editor-primary: #4d8dff;
  --ion-photo-editor-danger: #f24c58;
  --ion-photo-editor-success: #2dd55b;
}
```
