---
title: 'はじめに'
code: []
scrollActiveLine: []
---

ユーザーがスクリーンショットを撮ったときに Capacitor アプリへ通知します。

このプラグインは iOS と Android のスクリーンショットを監視し、Capacitor のイベントリスナー経由で Web 層へ届けます。分析、セキュリティ確認、コンテンツ保護のフローに使えます。

## インストール

```bash
npm install @rdlabo/capacitor-screenshot-event
npx cap sync
```

```ts
(() => {
  ScreenshotEvent.addListener('userDidTakeScreenshot', () => {
    // Notice take screenshot
  });

  // Start watch take event
  ScreenshotEvent.startWatchEvent();
})();
```

## 使い方

監視、処理、停止は [ScreenshotEvent](/docs/screenshot-event) です。

## いつ使うか

アプリ内でスクリーンショットに反応したいときに使います。例:

- 撮影後に確認や警告を出す
- 分析や監査のためにイベントを記録する
- 機密コンテンツをぼかすなど UI を変える

## プラットフォーム

- **iOS**: `UIApplication.userDidTakeScreenshotNotification` を使います。
- **Android**: メディアストアのコンテンツ変更を監視します。
- **Web**: ブラウザがスクリーンショットイベントを公開しないため非対応です。
