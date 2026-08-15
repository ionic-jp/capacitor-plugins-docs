---
title: restrict-try-block
---

# @rdlabo/rules/restrict-try-block

> tryブロック内のPromise・RxJS・Angular Signalコンテキスト、`Promise.resolve()` による逃げ道、物理行数を制限する。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

`try` ブロック内の非同期/リアクティブ処理と物理コード行数を制限します。

## ルール詳細

このルールは `try` を同期例外向けの小さな境界として保ちます。デフォルトでは次を報告します。

- `await`、およびTypeScript型がPromiseライクな式
- `Promise.resolve()` 呼び出し全般。同期例外をPromise rejectionへ変換するチェーンも含む
- 型または基底型が `rxjs` パッケージで宣言された式。`Observable` と `Subject` の派生を含む
- Angularの `computed()` および `effect()` コールバック内の `try` 文
- 物理コード行が3行を超える `try` 本体

`try` 固有の検査では `try` 本体だけを見ます。`catch` と `finally` は対象外です。ネストした関数・クラス・ネストした `try` は別の実行境界であり、外側の `try` には帰属しません。`Promise.resolve()` の検査はファイル全体に適用されます。

Promiseのrejectionは通常、`.catch()` のようなPromiseエラー境界で扱うべきです。同期失敗をrejectionチャネルへ移すために `Promise.resolve()` でその境界を作り出さないでください。

```ts
// incorrect
Promise.resolve()
  .then(() => fallibleSynchronousWork())
  .catch(handleError);
```

同期の `try` 境界は小さく保ち、その失敗を扱う責務のある層に置きます。`Promise.resolve(value)` で正規化するのではなく、値または既存のPromiseをそのまま返します。

RxJSのエラーは、`catchError()` や明示的なsubscriberのエラーハンドラなど、Observableのエラーチャネルで扱います。

PromiseライクとRxJSの型検出は、利用可能な場合にTypeScriptの型情報を使います。typed lintingがない場合、型依存の検査はESLintを止めずにスキップされ、構文ベースの `await`、`Promise.resolve()`、Angular Signalコンテキスト、`maxLines` の検査は引き続き動作します。完全な強制にはtyped lintingを設定します。例えば次のとおりです。

```js
languageOptions: {
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
},
```

## オプション

```js
{
  allowPromise: false,
  allowPromiseResolve: false,
  allowRxjs: false,
  allowInSignal: false,
  maxLines: 3,
}
```

- `allowPromise`: `try` 内のPromiseライク処理と `await` を許可する。
- `allowPromiseResolve`: ファイル全体の専用 `Promise.resolve()` 検査を無効化する。`try` 本体内では、呼び出しが独立してPromiseライク処理でもあるため、`allowPromise: true` も必要になる。
- `allowRxjs`: `rxjs` で宣言された型に裏打ちされた値と操作を許可する。`Observable`、`Subject`、およびそのサブクラスを含む。
- `allowInSignal`: インラインのAngular `computed()` / `effect()` コールバック内の `try` を許可する。`@angular/core` からのエイリアスと名前空間importを認識する。ネストした関数・クラス本体は別の実行境界である。
- `maxLines`: `try` 本体の最大物理コード行数。サイズ検査を無効にする場合は `false`。

`allowPromise: false` と `allowRxjs: false` は、typed lintingが設定されているときに完全に強制されます。型情報がない場合、それらのカテゴリでは `await` のような構文ベースの検査だけが残ります。

`Promise.resolve()` の検査は、シャドウされていないグローバル `Promise` と明示的な `globalThis.Promise`（静的ブラケット記法を含む）を認識します。エイリアスは意図的に追いません。ローカル宣言・importされた `Promise` という名前の値や、ローカルでシャドウされた `globalThis` は組み込みAPIとしては扱いません。

`maxLines` では、外側の波括弧・コメント・空行を除外します。その他のトークンを含む一意の物理行を1回だけ数えます。内側の波括弧と複数行トークンは数えるため、フォーマットは意図的に結果へ影響します。境界を論理的にも見た目にも小さく保つためです。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/restrict-try-block.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/restrict-try-block.ts)
