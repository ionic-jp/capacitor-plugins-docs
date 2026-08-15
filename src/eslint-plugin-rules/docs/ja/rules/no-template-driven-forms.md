---
title: no-template-driven-forms
---

# @rdlabo/rules/no-template-driven-forms

> 明示的に許可した要素上の `ngModel` バインディングを除き、template-driven formsを禁止する。

Signal Formsに適さないIonic Viewバインディングとして、要素名が明示的に許可されていない限り `ngModel` を禁止します。`ngForm` と `ngModelGroup` は常に拒否されます。

```js
'@rdlabo/rules/no-template-driven-forms': [
  'error',
  {
    allowedElements: [
      'ion-searchbar',
      'ion-segment',
      'ion-radio-group',
      'ion-select',
      'ion-range',
      'ion-toggle',
      'ion-checkbox',
      'ion-input-otp',
    ],
  },
];
```

許可要素は相互運用のための例外であり、template-driven formsの利用を推奨するものではありません。送信フォームは、許可要素を含んでいてもSignal Formsを使うべきです。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/no-template-driven-forms.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/no-template-driven-forms.ts)
