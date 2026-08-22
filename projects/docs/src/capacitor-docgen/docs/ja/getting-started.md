---
title: はじめに
---

`@rdlabo/capacitor-docgen` は、Ionicの [`@capacitor/docgen`](https://github.com/ionic-team/capacitor-docgen) を独立して保守・強化しているforkです。本家のCLI、Markdown placeholder、出力helper、export functionを維持しながら、parser resultと生成内容をinterface継承に対応させます。

このドキュメントでは、現在npmで公開されている `@rdlabo/capacitor-docgen@0.4.1` と本家 `@capacitor/docgen@0.3.1` を固定して比較します。このforkはIonic公式パッケージではありません。

## インストール

```sh
npm install --save-dev @rdlabo/capacitor-docgen
```

本家と同じ `docgen` command・flagを使用します。

```sh
npx docgen --api MyPlugin --output-readme README.md --output-json dist/docs.json
```

入力READMEには、docgenが更新するplaceholderをあらかじめ配置します。

```md
<docgen-index></docgen-index>

<docgen-api></docgen-api>
```

両パッケージは同じ `docgen` binaryを公開するため、1つのプロジェクトへ両方を直接インストールしないでください。継承したinterface memberを生成ドキュメントへ含める必要がある場合にforkを選びます。

## 継承対応の強化

本家はinterfaceに直接書かれたmemberだけを記録します。forkはTypeScriptの `extends` clauseも読み、解決したbase interfaceのmethod・propertyを追加します。

```ts
export interface SharedOptions {
  requestId?: string;
}

export interface CreateOptions extends SharedOptions {
  value: string;
}

export interface MyPlugin {
  create(options: CreateOptions): Promise<void>;
}
```

forkが生成する `CreateOptions` tableには、`value` と `requestId` の両方が含まれます。baseをinterface参照のtype aliasで指定した場合も、そのaliasを解決できます。

公開済みfork READMEには `@extends` JSDoc tagを追加するよう書かれていますが、この説明はv0.4.1の実装に対して古くなっています。実装はTypeScriptのheritage clauseを直接読み、継承解決にJSDoc tagを使いません。正しいTypeScriptの `extends` を記述してください。`@extends` tagは不要です。

変更対象と現在の制約は[本家との差分](./upstream-differences)を参照してください。

## 固定した正本

- [fork parser v0.4.1](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/src/parse.ts)
- [fork public types v0.4.1](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/src/types.ts)
- [本家parser v0.3.1](https://github.com/ionic-team/capacitor-docgen/blob/v0.3.1/src/parse.ts)
- [本家public types v0.3.1](https://github.com/ionic-team/capacitor-docgen/blob/v0.3.1/src/types.ts)
