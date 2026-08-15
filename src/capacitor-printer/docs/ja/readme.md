---
title: '@rdlabo/capacitor-printer'
---

# @rdlabo/capacitor-printer

Capacitor 向けプリンタープラグインです

## インストール

```bash
npm install @rdlabo/capacitor-printer
npx cap sync
```

## API

<docgen-index>

* [`printFile(...)`](#printfile)
* [`printWebView(...)`](#printwebview)
* [インターフェース](#interfaces)
* [型エイリアス](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### printFile(...)

```typescript
printFile(options: PrintFileOptions) => Promise<void>
```

ファイルを印刷するための印刷 UI を表示します。

Promise は OS がソースファイルを必要としなくなったあとに解決されるため、`finally` ブロックでファイルを安全に削除できます。

Android と iOS でのみ利用できます。

| パラメータ    | 型                                                            |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#printfileoptions">PrintFileOptions</a></code> |

--------------------


### printWebView(...)

```typescript
printWebView(options?: PrintOptions | undefined) => Promise<void>
```

WebView の内容を印刷するための印刷 UI を表示します。

| パラメータ    | 型                                                    |
| ------------- | ----------------------------------------------------- |
| **`options`** | <code><a href="#printoptions">PrintOptions</a></code> |

--------------------


### インターフェース


#### PrintFileOptions

| プロパティ     | 型                  | 説明                                                                                                                                    |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`path`**     | <code>string</code> | ファイルへのパス。Android はファイルパス、`file://` URL、`content://` URL に対応。iOS はファイルパスとローカル `file://` URL に対応。 |
| **`mimeType`** | <code>string</code> | ファイルの MIME タイプ。Android でのみ使用されます。                                                                                    |


#### PrintOptions

| プロパティ | 型                  | 説明                       | デフォルト              |
| ---------- | ------------------- | -------------------------- | ----------------------- |
| **`name`** | <code>string</code> | 印刷ジョブの名前です。     | <code>'Document'</code> |


### 型エイリアス


#### PrintWebViewOptions

<code><a href="#printoptions">PrintOptions</a></code>

</docgen-api>
