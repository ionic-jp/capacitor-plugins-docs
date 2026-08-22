---
title: 設定
---

## Angular・Ionic

プラグインを登録し、推奨設定をトップレベルで展開してから、プロジェクトで使うAngular・TypeScript設定を追加します。

```js
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const rdlabo = require('@rdlabo/eslint-plugin-rules');

module.exports = tseslint.config(
  {
    plugins: { '@rdlabo/rules': rdlabo },
  },
  ...rdlabo.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
```

`rdlabo.configs.recommended` をスコープ付き `extends` の内側へ置かないでください。`typescript-eslint` のconfig helperがプリセット内部の `files` を置き換え、TypeScript専用ルールがテンプレートへ適用される可能性があります。

## 汎用TypeScript

```js
import tseslint from 'typescript-eslint';
import rdlabo from '@rdlabo/eslint-plugin-rules/typescript';

export default tseslint.config({
  files: ['**/*.ts'],
  plugins: { '@rdlabo/rules': rdlabo },
  rules: {
    '@rdlabo/rules/deny-soft-private-modifier': 'error',
    '@rdlabo/rules/restrict-try-block': [
      'error',
      {
        allowPromise: false,
        allowPromiseResolve: true,
        allowRxjs: false,
        allowInSignal: false,
        maxLines: 3,
      },
    ],
  },
});
```

`restrict-try-block` のPromise・RxJS検査をすべて有効にするにはtyped lintingが必要です。

## 推奨プリセット

TypeScriptではSignal、Component境界、ライフサイクル、Overlay、Ionic 9 standalone import、readonly、tryブロックの共通ルールを有効にします。HTMLではIonic属性型、禁止Overlay要素、非同期操作の二重実行防止、iOS 26・MD3向けのgroup化されたlist構造を有効にします。

非推奨の `deny-constructor-di` はプリセットに含まれません。Angularの `inject()` migrationを利用してください。
