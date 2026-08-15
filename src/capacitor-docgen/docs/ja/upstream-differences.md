---
title: 本家との差分
---

この比較は、npmで公開されている `@rdlabo/capacitor-docgen@0.4.1` と `@capacitor/docgen@0.3.1` を対象にします。forkはIonicのprojectを基にしていますが、rdlaboが別パッケージとして公開・保守しています。

## 互換性の概要

| 項目                           | 本家 0.3.1                                                                                              | rdlabo fork 0.4.1                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Package                        | `@capacitor/docgen`                                                                                     | `@rdlabo/capacitor-docgen`             |
| Binary                         | `docgen`                                                                                                | `docgen`                               |
| CLI flag                       | `--api` (`-a`)、`--output-readme` (`-r`)、`--output-json` (`-j`)、`--project` (`-p`)、`--silent` (`-s`) | 同じ                                   |
| README placeholder             | `<docgen-index>`, `<docgen-api>`                                                                        | 同じ                                   |
| Core export                    | `generate`、`parse`、output helper、`run`、public type                                                  | 同じ                                   |
| Interface継承metadata          | 公開しない                                                                                              | `DocsInterface.extends: string[]`      |
| 継承method・property           | 展開しない                                                                                              | 解決したbase interface objectから追加  |
| Primary APIの継承              | APIに直接宣言したmemberのみ                                                                             | 解決したbase objectのmemberをAPIへ追加 |
| Type alias経由のbase interface | 継承解決には使わない                                                                                    | aliasの `complexTypes` からbaseを検索  |

公開tarballでは、CLI解析、生成、Markdown処理、出力format、TypeScript program作成のcompiled moduleがbyte単位で一致しています。振る舞いを変更する実装は `dist/parse.js` に限定され、public declarationの変更は `dist/types.d.ts` にあります。Package metadataとREADMEも異なります。

## Parserが追加する処理

forkはtop-level interfaceごとに、TypeScriptのheritage expressionを `DocsInterface.extends` へ保存します。そのinterfaceをdocgenが収集するとき、次の処理を行います。

1. parsed interfaceと直接一致するbase名を維持する。
2. 一致するtype aliasを参照先の `complexTypes` へ解決する。
3. 解決結果に一致するbase interfaceを探す。
4. base interface objectがその時点で持つmethod・propertyを派生interfaceへ追加する。

v0.4.1からはprimary API interfaceにも同じ収集処理が適用されるため、plugin APIがbase plugin interfaceのmethodを継承できます。v0.4.0ではsupporting interfaceだけが展開対象でした。

## 出力上の違い

派生options interfaceに対し、本家はそのinterfaceへ直接宣言したmemberだけを出力します。forkはそれらに続けて、解決したbase interface objectがその時点で持つmemberを出力します。そのためraw JSONと生成Markdown tableの両方に継承memberが含まれ、programmatic resultには `extends` arrayも加わります。

収集処理は共有されたparsed interface objectをin-placeで更新します。別のAPI memberによってbase interfaceが先に収集・展開されると、後から派生interfaceがそのbaseを使う時点で、base objectにはコピー済みのancestor memberが含まれています。その間接memberも派生interfaceへ伝播するため、1回の処理でheritage chain全体を再帰的に辿る実装ではありませんが、出力はmemberの収集順に依存する場合があります。

CLI flag、placeholder置換、heading生成、JSON writer、export functionは、それ以外について本家の振る舞いを維持します。

## 現在の境界

この強化は小さなparser拡張であり、TypeScriptの型を完全にflattenするものではありません。

- 1回の収集処理で多段heritage chain全体を再帰展開しません。ただしin-place更新により、先に展開されたbaseはコピー済みのancestor memberを後続の派生interfaceへ渡します。baseが先に収集されなければ、同じ派生interfaceが受け取るのはbaseに元から直接宣言されたmemberだけです。
- 子とbaseに同名memberがある場合、名前による上書き解決を行いません。object identityで重複除去するため、両方が出力される場合があります。
- Heritageの照合はparsed top-level interfaceの名前を基準にします。Qualified expressionやdeclaration mergingはこの強化では正規化しません。
- 本家0.3.1と同じTypeScript `~4.2.4` parser dependency、Node.js `>=18` engine declarationを維持します。
- 両パッケージが同じ `docgen` binaryを公開するため、併用ではなく代替パッケージとして選択します。

将来のfork releaseで振る舞いが変わった場合に比較も更新されるよう、両方の収集順を含むこの境界をドキュメントリポジトリのcontract testで固定します。

## Releaseの系譜

- fork v0.3.xで、別パッケージ `@rdlabo/capacitor-docgen` と初期の継承処理を導入しました。
- fork v0.4.0でTypeScript heritage clauseによる継承検出へ切り替え、`DocsInterface.extends`、interface alias解決、継承method・propertyの展開を追加しました。
- fork v0.4.1でprimary API interfaceにも継承展開を適用しました。

後続versionを評価するときは、固定した[fork v0.4.1 source](https://github.com/rdlabo-dev/capacitor-docgen/tree/v0.4.1)と[本家v0.3.1 source](https://github.com/ionic-team/capacitor-docgen/tree/v0.3.1)を確認してください。
