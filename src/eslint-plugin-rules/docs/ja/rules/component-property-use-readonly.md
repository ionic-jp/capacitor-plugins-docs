---
title: component-property-use-readonly
---

# @rdlabo/rules/component-property-use-readonly

> プロパティをreadonlyにすべきときに警告する
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。
> - ✒️ [コマンドライン](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)の `--fix` オプションで、このルールが報告する問題の一部を自動修正できます。

このルールは、不変であるべきAngularコンポーネントのプロパティに `readonly` 修飾子の使用を強制します。予期しない変更を防ぎ、コンポーネントの状態管理をより安全にします。

## ルール詳細

❌ 誤り: `readonly` 修飾子のないプロパティ

```ts
@Component({
  selector: 'app-example',
  template: '<div>example</div>',
})
export class ExampleComponent {
  x = 1;
  public y = 2;
  private z = 3;
  protected w = 4;
  #secret = 42;
  static a = 1;
  ['foo'] = 1;
  @Input() i = 8;
  h: number;
}
```

✅ 正しい: `readonly` 修飾子付きのプロパティ

```ts
@Component({
  selector: 'app-example',
  template: '<div>example</div>',
})
export class ExampleComponent {
  readonly x = 1;
  public readonly y = 2;
  private readonly z = 3;
  protected readonly w = 4;
  readonly #secret = 42;
  static readonly a = 1;
  readonly ['foo'] = 1;
  @Input() readonly i = 8;
  readonly h: number;
}
```

## ルール設定

```json
{
  "rules": {
    "@rdlabo/rules/component-property-use-readonly": [
      "error",
      {
        "ignorePrivateProperties": true
      }
    ]
  }
}
```

## オプション

```ts
const options: {
  ignorePrivateProperties?: boolean; // Whether to ignore private properties (default: false)
};
```

### ignorePrivateProperties

`true` にすると、ソフトプライベートプロパティ（`private` 修飾子）とハードプライベートプロパティ（`#` 接頭辞）の両方を無視します。プライベートプロパティは通常コンポーネント外からアクセスされないため、`readonly` 修飾子の重要度が下がる場合に有用です。

❌ 誤り: `ignorePrivateProperties: true` なしのプライベートプロパティ

```ts
@Component({
  selector: 'app-example',
  template: '<div>example</div>',
})
export class ExampleComponent {
  private privateProp = 1; // error
  #secretProp = 2; // error
}
```

✅ 正しい: `ignorePrivateProperties: true` ありのプライベートプロパティ

```ts
// .eslintrc.json
{
  "rules": {
    "@rdlabo/rules/component-property-use-readonly": [
      "error",
      {
        "ignorePrivateProperties": true
      }
    ]
  }
}

// Component code
@Component({
  selector: 'app-example',
  template: '<div>example</div>',
})
export class ExampleComponent {
  private privateProp = 1; // no error
  #secretProp = 2; // no error
  public publicProp = 3; // still requires readonly
}
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/component-property-use-readonly.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/component-property-use-readonly.ts)
