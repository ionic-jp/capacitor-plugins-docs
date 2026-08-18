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

バナーは WebView の上のネイティブオーバーレイです。Ionic は `ion-content` を自動では縮めません。

`BOTTOM_CENTER` では `ion-router-outlet` の `bottom` を `size.height` にします。シートが隠れないよう `ion-modal` にも同じオフセットを付けます。高さが `0` のときはオフセットを戻します。

```ts
import { AdMob, BannerAdPluginEvents } from '@capacitor-community/admob';

const outlet = document.querySelector<HTMLElement>('ion-router-outlet');

await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
  const offset = size.height > 0 ? `${size.height}px` : '0px';
  if (outlet) {
    outlet.style.bottom = offset;
  }
  document.querySelectorAll<HTMLElement>('ion-modal').forEach((modal) => {
    modal.style.bottom = offset;
  });
  document.documentElement.style.setProperty('--admob-banner-height', offset);
});
```

`ion-tab-bar` が outlet の兄弟（よくある `ion-tabs` 構成）なら、同じ変数でタブバーを上げてバナーに隠れないようにします。

```css
ion-tab-bar {
  margin-bottom: var(--admob-banner-height, 0px);
}
```

`TOP_CENTER` では `bottom` ではなく `top` を設定します。キーボード表示中は `hideBanner()`、閉じたら `resumeBanner()` にすると、キーボードとバナーが重なりません。

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
