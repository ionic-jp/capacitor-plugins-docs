---
title: '@rdlabo/capacitor-codescanner'
---

# @rdlabo/capacitor-codescanner

コードスキャナー向けの Capacitor プラグインです。

特定のユースケース向けに作られたバーコードリーダーです。他の Capacitor バーコードリーダープラグインと異なり、このプラグインはモーダルを開き、その中でスキャンを行います。そのため、Web アセットを操作する必要はありません。

## インストール

```bash
npm install @rdlabo/capacitor-codescanner
npx cap sync
```


## 使い方

```typescript
import { CodeScanner } from '@rdlabo/capacitor-codescanner';

// Scan a QR code
const scanQRCode = async () => {
  await CodeScanner.addListener('CodeScannerCatchEvent', (event) => {
    console.log('Scanned code:', event.code);
  });

  await CodeScanner.present({
    detectionWidth: 0.6,
    detectionHeight: 0.15,
    isMulti: false,
  });
};

// Continuously scan codes
const scanMultipleCodes = async () => {
  await CodeScanner.addListener('CodeScannerCatchEvent', (event) => {
    console.log('Scanned code:', event.code);
  });

  await CodeScanner.present({
    detectionWidth: 0.8,
    detectionHeight: 0.2,
    isMulti: true,
  });
};
```

> **v8.0.3の既知の制限:** 公開TypeScriptインターフェースには `metadataObjectTypes` が定義されていますが、native実装は従来の `CodeTypes` キーを読み取ります。従来キーは `ScannerOption` に含まれないため、このリリースではコード種別による絞り込みを省略してください。

## 機能

- **自動ライト制御**: スキャナー開始時にフラッシュライトが自動で点灯します
- **バイブレーション**: コード検出時にバイブレーションでフィードバックします
- **検出エリア表示**: 検出エリアを赤い枠で視覚的に表示します
- **検出コードのハイライト**: 検出したコードを赤い枠でハイライトします
- **閉じるボタン**: 左上の「✕」ボタンでスキャナーを閉じられます
- **複数スキャンモード**: `isMulti: true` で複数コードを連続スキャンできます


## API

<docgen-index>

* [`present(...)`](#present)
* [`addListener('CodeScannerCatchEvent', ...)`](#addlistenercodescannercatchevent-)
* [インターフェース](#interfaces)
* [型エイリアス](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### present(...)

```typescript
present(scannerOption: ScannerOption) => Promise<void>
```

| パラメータ          | 型                                                      |
| ------------------- | ------------------------------------------------------- |
| **`scannerOption`** | <code><a href="#scanneroption">ScannerOption</a></code> |

--------------------


### addListener('CodeScannerCatchEvent', ...)

```typescript
addListener(eventName: 'CodeScannerCatchEvent', listenerFunc: (event: { code: string; }) => void) => Promise<PluginListenerHandle>
```

| パラメータ         | 型                                                 |
| ------------------ | -------------------------------------------------- |
| **`eventName`**    | <code>'CodeScannerCatchEvent'</code>               |
| **`listenerFunc`** | <code>(event: { code: string; }) =&gt; void</code> |

**戻り値:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### インターフェース


#### ScannerOption

| プロパティ                | 型                                 | 説明                                                                                                                            |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **`detectionWidth`**      | <code>number</code>                |                                                                                                                                 |
| **`detectionHeight`**     | <code>number</code>                |                                                                                                                                 |
| **`enableCloseButton`**   | <code>boolean</code>               | スキャンエリア左上の閉じるボタンを有効にする（デフォルト: true）                                                                |
| **`sheetScreenRatio`**    | <code>number</code>                | スキャンエリア（シートモーダルサイズ）の画面に対する比率を指定します。デフォルトは Android で 0.9、iOS で 1（pageSheet）です。 |
| **`metadataObjectTypes`** | <code>MetadataObjectTypes[]</code> | 認識するコード種別を指定します（デフォルト: ["qr", "code39", "ean13"]）                                                         |
| **`isMulti`**             | <code>boolean</code>               | 複数スキャンモードを有効にする（デフォルト: false）                                                                             |
| **`enableAutoLight`**     | <code>boolean</code>               | 暗い環境で自動ライトを有効にする（デフォルト: true）                                                                            |


#### PluginListenerHandle

| プロパティ   | 型                                        |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### 型エイリアス


#### MetadataObjectTypes

<code>'aztec' | 'code128' | 'code39' | 'code39Mod43' | 'code93' | 'dataMatrix' | 'ean13' | 'ean8' | 'face' | 'interleaved2of5' | 'itf14' | 'pdf417' | 'qr' | 'upce' | 'catBody' | 'dogBody' | 'humanBody' | 'salientObject'</code>

</docgen-api>
