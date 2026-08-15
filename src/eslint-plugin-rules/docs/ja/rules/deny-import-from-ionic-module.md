---
title: deny-import-from-ionic-module
---

# @rdlabo/rules/deny-import-from-ionic-module

> このプラグインは、@ionic/angular/standalone ではなく @ionic/angular からの誤ったimportを防ぎます。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。
> - ✒️ [コマンドライン](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)の `--fix` オプションで、このルールが報告する問題の一部を自動修正できます。

`@ionic/angular` と `@ionic/angular/standalone` のimportを混在させるとランタイム問題が起き得ます。ビルドは成功しても、ブラウザ実行時に失敗することがあります。このルールは一貫したimportパスを強制することで、そうした問題を防ぎます。

## ルール詳細

❌ 誤り: `@ionic/angular` からimportする

```ts
import { ModalController } from '@ionic/angular';
```

✅ 正しい: `@ionic/angular/standalone` からimportする

```ts
import { ModalController } from '@ionic/angular/standalone';
```

## オプション

オプションなし。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/deny-import-from-ionic-module.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/deny-import-from-ionic-module.ts)
