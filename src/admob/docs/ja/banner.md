---
title: 'バナー広告'
code: []
scrollActiveLine: []
---

バナー広告はアプリ画面の一部を占める長方形の広告です。ユーザーがアプリを操作しているあいだも画面に残せます。通常は上下に固定します。形式の説明は Google のバナー広告ガイド（[Android](https://developers.google.com/admob/android/banner?hl=ja) / [iOS](https://developers.google.com/admob/ios/banner?hl=ja)）を見てください。

このプラグインでは WebView の上にあるネイティブ画面に描画します。最初のロードとサイズ変更を取りこぼさないよう、`showBanner` より前にリスナーを登録します。

```ts
import {
  AdMob,
  AdMobBannerSize,
  AdMobRevenueData,
  BannerAdOptions,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

const handles = await Promise.all([
  AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    console.log('Banner loaded');
  }),
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    console.log('Banner size', size.width, size.height);
  }),
  AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
    console.error(error);
  }),
  AdMob.addListener(BannerAdPluginEvents.AdPaid, (data: AdMobRevenueData) => {
    // Forward impression-level revenue to your analytics provider.
    console.log(data);
  }),
]);

const options: BannerAdOptions = {
  adId: 'YOUR_AD_UNIT_ID',
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  margin: 0,
  // isTesting: true,
  // npa: true,
};
await AdMob.showBanner(options);
```

バナーがアプリのコンテンツを隠さないよう、`SizeChanged` でレイアウトの余白を確保します。非表示・削除・ロード失敗時は幅と高さがどちらも `0` になることがあります。

## Ionic: バナーとコンテンツを重ねない

バナーは WebView の上のネイティブオーバーレイです。Ionic は `ion-content` を自動では縮めません。[Angular デモ](https://github.com/capacitor-community/admob/tree/main/demo/angular) は `SizeChanged` を購読し、`ion-router-outlet` に margin を付けます（[`BannerViewportService`](https://github.com/capacitor-community/admob/blob/main/demo/angular/src/app/shared/banner-viewport.service.ts)）。

```ts
import { AdMob, BannerAdPluginEvents } from '@capacitor-community/admob';

const outlet = document.querySelector<HTMLElement>('ion-router-outlet');

await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
  if (!outlet) {
    return;
  }
  outlet.style.marginTop = '';
  outlet.style.marginBottom = '';
  if (size.height === 0) {
    return;
  }
  const safeAreaBottom = window.getComputedStyle(document.body).getPropertyValue('--ion-safe-area-bottom');
  outlet.style.marginBottom = `calc(${safeAreaBottom} + ${size.height}px)`;
});
```

このスニペットはデモの下バナーと同じです。`TOP_CENTER` ではデモは `marginTop` を `${size.height}px` にします。`hideBanner` / `removeBanner` は margin を消し、`resumeBanner` は戻します。

!::BannerAdOptions::

`isTesting` は [テスト](/docs/testing) を参照してください。

## ライフサイクル

- `hideBanner()` は現在のバナーを一時的に隠します。
- `resumeBanner()` は隠したバナーを再表示します。
- `removeBanner()` はバナーを破棄します。作り直すときは `showBanner()` を呼びます。

画面を破棄するときはリスナーとバナーを解放します。

```ts
for (const handle of handles) {
  await handle.remove();
}
await AdMob.removeBanner();
```

バナーのインプレッション単位の売上は `BannerAdPluginEvents.AdPaid` で通知されます。フルスクリーン形式は同じ `AdMobRevenueData` を `AdImpression` で出します。[広告イベント](/docs/events) を参照してください。
