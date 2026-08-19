---
title: '使い方'
code: []
scrollActiveLine: []
---

本番ビルドの前にコレクターを実行します。[初期化](/docs/initialize) のあとです。

```bash
npx @rdlabo/ionic-angular-collect-icons
```

### 実行を自動化する

本番ビルドの前に毎回コマンドを実行するのは非効率なので、npm スクリプトに入れて自動化します。例:

```diff
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
+   "prebuild": "npx @rdlabo/ionic-angular-collect-icons",
```

> [!WARNING]
> この方法は、npm スクリプトを使わない本番ビルドでは利用できません。
