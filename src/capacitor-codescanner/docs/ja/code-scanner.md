---
title: CodeScanner
code: []
scrollActiveLine: []
---

`CodeScanner` はネイティブのスキャナーモーダルを開き、スキャン結果を届けます。[インストール](/docs/readme#インストール) のあとで呼び出します。最初の検出を取りこぼさないよう、`present` より前に `addListener` を登録します。

## present

```typescript
import { CodeScanner } from '@rdlabo/capacitor-codescanner';

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

`isMulti: true` だとモーダルを開いたまま複数コードをスキャンできます。オプションのフィールドは [API](/docs/api#scanneroption) ページにあります。

> **v8.0.3の既知の制限:** 公開TypeScriptインターフェースには `metadataObjectTypes` が定義されていますが、native実装は従来の `CodeTypes` キーを読み取ります。従来キーは `ScannerOption` に含まれないため、このリリースではコード種別による絞り込みを省略してください。

## addListener

```typescript
import { CodeScanner } from '@rdlabo/capacitor-codescanner';

const handle = await CodeScanner.addListener('CodeScannerCatchEvent', (event) => {
  console.log('Scanned code:', event.code);
});

await handle.remove();
```

ペイロードは `{ code: string }` です。シグネチャは [API](/docs/api) ページにあります。
