---
title: 'はじめに'
code: []
scrollActiveLine: []
---

ネイティブモーダルを開く Capacitor 向けバーコードスキャナーです。

camera-preview 系のスキャナーと違い、このプラグインはモーダル内でカメラを動かします。Web アセット側でカメラビューを管理する必要はありません。複数のバーコード種別と、連続マルチスキャンに対応します。

## インストール

```bash
npm install @rdlabo/capacitor-codescanner
npx cap sync
```

```typescript
import { CodeScanner } from '@rdlabo/capacitor-codescanner';

// 基本的なQRコードスキャン
const scanQRCode = async () => {
  await CodeScanner.addListener('CodeScannerCatchEvent', (event) => {
    console.log('スキャンされたコード:', event.code);
  });

  await CodeScanner.present({
    detectionX: 0.2,
    detectionY: 0.35,
    detectionWidth: 0.6,
    detectionHeight: 0.15,
    isMulti: false,
    CodeTypes: ['qr']
  });
};

// 複数のバーコードタイプを連続スキャン
const scanMultipleCodes = async () => {
  await CodeScanner.addListener('CodeScannerCatchEvent', (event) => {
    console.log('スキャンされたコード:', event.code);
  });

  await CodeScanner.present({
    detectionX: 0.1,
    detectionY: 0.3,
    detectionWidth: 0.8,
    detectionHeight: 0.2,
    isMulti: true,
    CodeTypes: ['qr', 'code39', 'ean13', 'code128']
  });
};
```

## 使い方

モーダルを出してスキャン結果を受け取るには [CodeScanner](/docs/code-scanner) です。

## いつ使うか

独自のカメラ UI を組まず、すぐ使えるスキャンモーダルが欲しいときに使います。向いている用途:

- レシート、商品、チケットの QR / バーコードを読む
- `isMulti: true` で 1 セッションに複数コードを集める
- Web 側でカメラ権限やプレビュー配線を避けたい

## 機能

- **自動ライト制御**: 暗い環境では既定でフラッシュを点灯します。
- **バイブレーション**: コード検出時に振動します。
- **検出エリアのオーバーレイ**: スキャン範囲を赤枠で示します。
- **検出コードのハイライト**: 検出したコードを赤枠で囲みます。
- **閉じるボタン**: 右上に既定の閉じるボタンがあります。
- **マルチスキャン**: `isMulti: true` のとき、ユーザーが閉じるまでスキャンを続けます。

## プラットフォーム

- **iOS と Android**: 完全対応です。
- **Web**: ネイティブのカメラアクセスが必要なため非対応です。
