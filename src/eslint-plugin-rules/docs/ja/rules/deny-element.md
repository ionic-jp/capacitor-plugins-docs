---
title: deny-element
---

# @rdlabo/rules/deny-element

> このプラグインは特定のHTMLタグの使用を禁止します。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

このルールは、インラインコンポーネントではなくControllerベースのmodalやaction sheetの利用を強制したいIonicアプリで特に有用です。

## ルール詳細

❌ 誤り: テンプレートで禁止された要素を使う

```html
<ion-modal></ion-modal>
<!-- error -->
```

✅ 正しい: `.eslintrc.json` で禁止する要素を指定するようルールを設定する

## ルール設定

```json
{
  "rules": {
    "@rdlabo/rules/deny-element": [
      "error",
      {
        "elements": ["ion-modal"]
      }
    ]
  }
}
```

## オプション

```ts
const options: {
  elements: string[]; // Array of element names to disallow
};
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/deny-element.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/deny-element.ts)
