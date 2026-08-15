---
title: no-reactive-forms
---

# @rdlabo/rules/no-reactive-forms

> Angular Reactive Formsを禁止し、Signal Formsを推奨する。

`@angular/forms/signals` を優先するため、Angular Reactive FormsのAPIとテンプレートバインディングを禁止します。

このルールは `ReactiveFormsModule`、型付き・型なしのcontrol/group/array/builder、reactive directive、`Validators`、および `@angular/forms` からの関連importを拒否します。名前付きAPI検査を迂回できるため、名前空間importとdefault importも拒否します。テンプレートでは `formControl`、`formControlName`、`formGroup`、`formGroupName`、`formArrayName` を拒否します。

`FormsModule` と `ngModel` は意図的にこのルールの対象外です。それらのバインディングには `no-template-driven-forms` を使います。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/no-reactive-forms.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/no-reactive-forms.ts)
