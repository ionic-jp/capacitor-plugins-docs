---
title: 'バナー広告'
code: []
scrollActiveLine: []
---

バナー広告は WebView の上にあるネイティブ画面に表示されます。最初のロードとサイズ変更を取りこぼさないよう、`showBanner` より前にリスナーを登録します。

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

| オプション  | 説明                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------- |
| `adId`      | バナーの広告ユニット ID。                                                                   |
| `adSize`    | バナーサイズ。新規導入では `ADAPTIVE_BANNER` を推奨します。デフォルトは `ADAPTIVE_BANNER`。 |
| `position`  | `TOP_CENTER`、`CENTER`、`BOTTOM_CENTER`。デフォルトは `TOP_CENTER`。                        |
| `margin`    | 論理ピクセル（dp / point）の余白。`BOTTOM_CENTER` は下、`TOP_CENTER` は上の余白です。       |
| `isTesting` | Google のテスト広告をリクエストします。[テスト](/docs/testing) を参照してください。         |
| `npa`       | 非パーソナライズ広告をリクエストします。                                                    |

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
