---
title: はじめに
---

開発依存関係としてプラグインをインストールします。

```sh
npm install --save-dev @rdlabo/eslint-plugin-rules
```

パッケージルートはAngular・Ionic向けルールを公開します。これらを使う場合は `@angular-eslint/template-parser` と `@ionic/core` もインストールしてください。Angular・Ionicに依存しないTypeScriptプロジェクトでは、両者を読み込まない `/typescript` エントリポイントを利用できます。

## 要件

| パッケージ                        | 対応バージョン                 |
| --------------------------------- | ------------------------------ |
| Node.js                           | 20以降                         |
| ESLint                            | 9以降                          |
| `@typescript-eslint/utils`        | 8.33以上9未満                  |
| `@angular-eslint/template-parser` | テンプレートルール利用時は21.x |
| `@ionic/core`                     | Ionicルール利用時は8.x         |

## エントリポイントを選ぶ

- Angular・Ionicアプリでは `@rdlabo/eslint-plugin-rules` を使います。
- バックエンドなどの汎用TypeScriptでは `@rdlabo/eslint-plugin-rules/typescript` を使います。

推奨プリセットはESLint Flat Config向けです。TypeScriptとHTMLの対象指定を維持するため、設定のトップレベルへ追加します。

次は[設定](/eslint-plugin-rules/docs/configuration)で推奨プリセットまたは個別ルールを有効にします。
