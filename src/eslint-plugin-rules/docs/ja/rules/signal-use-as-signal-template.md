---
title: signal-use-as-signal-template
---

# @rdlabo/rules/signal-use-as-signal-template

> テンプレートでAngular Signalにアクセスするとき `()` を要求する
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

このルールは、テンプレートでSignalを関数呼び出し構文 `()` で正しくアクセスすることを要求します。AngularのSignalは現在値を得るために呼び出す必要がある関数だからです。

## ルール詳細

❌ 誤り: 関数呼び出し構文なしでSignalを使う

```ts
@Component({
  template: `
    <div>{{ count }}</div>
    <div>{{ count.signal }}</div>
    <div>{{ count + 1 }}</div>
    @if (count) {
      <div>{{ count }}</div>
    }
    @switch (count) {
      @case (0) {
        <div>Zero</div>
      }
    }
    @defer (on viewport) {
      <div>{{ count }}</div>
    }
  `,
})
export class TestComponent {
  count = signal(0);
}
```

✅ 正しい: 関数呼び出し構文でSignalを使う

```ts
@Component({
  template: `
    <div>{{ count() }}</div>
    <div>{{ count() + 1 }}</div>
    <div>{{ count() > 0 ? 'Positive' : 'Zero' }}</div>
    @if (count()) {
      <div>{{ count() | async }}</div>
    }
    @switch (count()) {
      @case (0) {
        <div>Zero</div>
      }
      @case (1) {
        <div>One</div>
      }
      @default {
        <div>Other</div>
      }
    }
    @defer (on viewport) {
      <div>{{ count() }}</div>
    }
  `,
})
export class TestComponent {
  count = signal(0);
}
```

✅ 正しい: Signal参照をinput bindingとして渡す

BoundAttributeでSignal名だけを渡す場合は、Signal参照のprops渡しとして許可されます。

```ts
@Component({
  template: `<child [inventorySignal]="inventorySignal"></child>`,
})
export class TestComponent {
  inventorySignal = signal(0);
}
```

値として演算する場合は `()` が必要です。

```ts
// ❌
<child [disabled]="count > 0"></child>
// ✅
<child [disabled]="count() > 0"></child>
```

## オプション

オプションなし。

## 未対応パターン

このルールはネストしたSignalパターンに対応していません。例えば次のとおりです。

```ts
@Component({
  template: `
    <div>{{ nestedSignal().child() }}</div>
    // Correct usage
    <div>{{ nestedSignal().child }}</div>
    // Incorrect: missing function call
  `,
})
export class TestComponent {
  nestedSignal = signal({
    child: signal<number>(0),
  });
}
```

ネストしたSignalが関数呼び出しで正しくアクセスされていない場合を、このルールは検出できません。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/signal-use-as-signal-template.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/signal-use-as-signal-template.ts)
