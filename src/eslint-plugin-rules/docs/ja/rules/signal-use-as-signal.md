---
title: signal-use-as-signal
---

# @rdlabo/rules/signal-use-as-signal

> このプラグインは、SignalをSignalとして正しく使うかを検査します。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。
> - ✒️ [コマンドライン](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)の `--fix` オプションで、このルールが報告する問題の一部を自動修正できます。

このルールは、Signalが通常のプロパティとして誤って使われることを防ぎます。

## ルール詳細

❌ 誤り: Signalを通常のプロパティとして使う

```ts
@Component()
export class SigninPage {
  readonly #id = signal<number>(undefined);

  useMethod() {
    if (this.#id) {
      // error
      this.#id() = 1; // error
    }
  }
}
```

✅ 正しい: Signalを適切に使う

```ts
@Component()
export class SigninPage {
  readonly #id = signal<number>(undefined);

  useMethod() {
    if (this.#id()) {
      this.#id.set(1); // error
    }
  }
}
```

✅ 正しい: Signal参照をpropsとして渡す

Signalを値として読むのではなく、Signal自体を渡す場合は `()` は不要です。

```ts
@Component()
export class SigninPage {
  readonly food = signal<number>(0);

  openPreview() {
    // componentProps / modal launcher などへ参照渡し
    launchModal({ food: this.food });
    const food = this.food;
    return this.food;
  }
}
```

## オプション

オプションなし。

## 未対応パターン

このルールはネストしたSignalパターンに対応していません。例えば次のとおりです。

```ts
@Component({...})
export class TestComponent {
  nestedSignal = signal({
    child: signal<number>(0)
  });

  ngOnInit() {
    if (this.nestedSignal().child) {  // Incorrect: missing function call
      ...
    }
  }
}
```

ネストしたSignalが関数呼び出しで正しくアクセスされていない場合を、このルールは検出できません。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/signal-use-as-signal.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/signal-use-as-signal.ts)
