---
title: API
---

`@rdlabo/capacitor-docgen` v0.4.1 が公開するprogrammatic APIのリファレンスです。

## 生成

#### `function` generate

`(opts: DocsGenerateOptions) => Promise<DocsGenerateResults>`

TypeScript projectまたはinput fileを解析し、必要に応じてREADMEとJSONを出力します。

#### `function` parse

`(opts: DocsParseOptions) => (api: string) => DocsData`

指定したPlugin API名から解析結果を取得する関数を生成します。

## 出力

#### `function` outputReadme

`(readmeFilePath: string, data: DocsData) => Promise<void>`

README内のdocgen placeholderを更新します。

#### `function` outputJson

`(jsonFilePath: string, data: DocsData) => Promise<void>`

解析したドキュメントmodelをJSONとして出力します。

#### `function` replaceMarkdownPlaceholders

`(content: string, data: DocsData) => string`

`<docgen-index>` と `<docgen-api>` を置換したMarkdownを返します。

## CLI

#### `function` run

`(config: { cwd: string; args: string[] }) => Promise<void>`

明示したworking directoryとargument listでdocgen commandを実行します。

## Option

#### `interface` DocsParseOptions

| Prop               | Type       | Description                         |
| ------------------ | ---------- | ----------------------------------- |
| **`tsconfigPath`** | `string`   | 任意のTypeScript設定file pathです。 |
| **`inputFiles`**   | `string[]` | 任意のsource file一覧です。         |

#### `interface` DocsGenerateOptions

| Prop                   | Type       | Description                         |
| ---------------------- | ---------- | ----------------------------------- |
| **`api`**              | `string`   | Primary Plugin interface名です。    |
| **`tsconfigPath`**     | `string`   | 任意のTypeScript設定file pathです。 |
| **`inputFiles`**       | `string[]` | 任意のsource file一覧です。         |
| **`outputJsonPath`**   | `string`   | 任意のJSON出力pathです。            |
| **`outputReadmePath`** | `string`   | 任意のREADME出力pathです。          |

#### `interface` DocsGenerateResults

`DocsGenerateOptions` に解析結果 `data: DocsData` を加えた型です。

## ドキュメントmodel

#### `interface` DocsData

| Prop                | Type                    | Description                          |
| ------------------- | ----------------------- | ------------------------------------ |
| **`api`**           | `DocsInterface \| null` | Primary Plugin APIです。             |
| **`interfaces`**    | `DocsInterface[]`       | 解析したinterfaceです。              |
| **`typeAliases`**   | `DocsTypeAlias[]`       | 解析したtype aliasです。             |
| **`enums`**         | `DocsEnum[]`            | 解析したenumです。                   |
| **`pluginConfigs`** | `DocsConfigInterface[]` | 解析したCapacitor設定interfaceです。 |
