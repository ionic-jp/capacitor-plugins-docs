---
title: ionic-attr-type-check
---

# @rdlabo/rules/ionic-attr-type-check

> Ionicコンポーネントの非string属性への文字列値を禁止し、適切なproperty bindingを提案する。boolean・number・object型属性に対応する。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。
> - ✒️ [コマンドライン](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)の `--fix` オプションで、このルールが報告する問題の一部を自動修正できます。

このルールは、Ionicコンポーネントのテンプレートで非string属性（boolean、number、object、complex）に文字列値が割り当てられている箇所を検出し、適切なproperty bindingを提案することで、TypeScriptのビルドエラーを防ぎます。

## ルール詳細

このルールは、Ionicコンポーネントのテンプレートで非string属性（boolean、number、object、complex）に文字列値が割り当てられている箇所を検出します。

❌ 誤り: 非string属性に文字列値を使う

```html
<ion-item button="true"></ion-item>
<ion-list inset="true"></ion-list>
<ion-progress-bar value="50"></ion-progress-bar>
<input disabled="false"></input>
<button readonly="1"></button>
```

✅ 正しい: property bindingを使う

```html
<ion-item [button]="true"></ion-item>
<ion-list [inset]="true"></ion-list>
<ion-progress-bar [value]="50"></ion-progress-bar>
<input [disabled]="false"></input>
<button [readonly]="true"></button>
```

## オプション

オプションなし。

## サポートする属性型

このルールはIonicコンポーネントの型定義から非string属性を自動で特定し、次のような属性を検出します。

### Ionicコンポーネント属性の例

- `ion-item`: `button`, `disabled`, `detail`
- `ion-list`: `inset`, `lines`
- `ion-button`: `disabled`, `expand`, `fill`, `strong`
- `ion-checkbox`: `checked`, `disabled`, `indeterminate`
- `ion-toggle`: `checked`, `disabled`
- `ion-radio`: `checked`, `disabled`
- `ion-input`: `disabled`, `readonly`, `required`
- `ion-textarea`: `disabled`, `readonly`, `required`
- `ion-select`: `disabled`, `multiple`, `required`
- `ion-datetime`: `disabled`, `readonly`
- `ion-range`: `disabled`, `pin`, `snaps`
- `ion-segment`: `disabled`
- `ion-slides`: `pager`, `scrollbar`
- `ion-tab`: `selected`
- `ion-menu`: `disabled`, `swipeGesture`
- `ion-modal`: `animated`, `backdropDismiss`, `showBackdrop`
- `ion-popover`: `animated`, `backdropDismiss`, `showBackdrop`
- `ion-alert`: `animated`, `backdropDismiss`
- `ion-loading`: `animated`, `backdropDismiss`
- `ion-toast`: `animated`
- `ion-action-sheet`: `animated`, `backdropDismiss`

## エラーメッセージ

このルールは次のメッセージを表示します。

```
boolean attribute 'button' should not have a string value 'true'. Use property binding [button]="true" instead.
number attribute 'value' should not have a string value '50'. Use property binding [value]="50" instead.
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/ionic-attr-type-check.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/ionic-attr-type-check.ts)
