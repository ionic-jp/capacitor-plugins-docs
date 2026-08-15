---
title: no-component-writable-signal
---

# @rdlabo/rules/no-component-writable-signal

> 書き込み可能なComponent状態はViewModelに置く。ただしAngular Signal Formsの `form()` に渡すmodelは例外とする。

書き込み可能なComponent状態をViewModelに置きます。Componentローカルの `signal()` と `linkedSignal()` は、`profileForm = form(this.model)` のようにSignal Formsのフィールド初期化へ直接渡すmodelプロパティでない限り拒否されます。

```ts
readonly model = signal({ name: '' });
readonly profileForm = form(this.model); // valid

readonly isLoading = signal(false); // invalid: move to ViewModel
```

`computed()` と `effect()` は引き続きComponentの責務であり、このルールでは制限しません。Component以外のクラスは無視します。

`@angular/core` および `@angular/forms/signals` からの名前付きエイリアスと名前空間importに対応します。同名のローカルヘルパーは、ルールがimport元を検証するため無視されます。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/no-component-writable-signal.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/no-component-writable-signal.ts)
