---
title: 'はじめに'
code: []
scrollActiveLine: []
---

Capacitor アプリからファイルまたは現在の WebView を印刷します。

このプラグインは iOS と Android のネイティブ印刷 UI をラップします。アプリ内で生成した PDF などのローカルファイル、または現在の WebView の内容を印刷できます。

## インストール

```bash
npm install @rdlabo/capacitor-printer
npx cap sync
```

## 使い方

ファイルの印刷は [PDF](/docs/pdf)、現在の WebView の印刷は [Web](/docs/web) です。

## いつ使うか

アプリがシステムの印刷ダイアログを出す必要があるときに使います。例:

- レシートや請求書を PDF として印刷する
- アプリ内で生成したレポートを印刷する
- 現在のページ内容を印刷する

## プラットフォーム

- **iOS と Android**: `printFile` と `printWebView` の両方に対応します。
- **Web**: ブラウザがすでに `window.print()` を提供するため非対応です。
