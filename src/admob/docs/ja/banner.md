---
title: 'バナー広告'
code: []
scrollActiveLine: []
---

バナー広告はネイティブビューの一部に表示されます。最初のロード・サイズ変更イベントを取りこぼさないよう、`showBanner` より前にリスナーを登録します。

```ts
import {
  AdMob,
  AdMobBannerSize,
  BannerAdOptions,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

const handles = await Promise.all([
  AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    console.log('バナーをロードしました');
  }),
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    console.log(size.width, size.height);
  }),
  AdMob.addListener(BannerAdPluginEvents.FailedToLoad, console.error),
]);

const options: BannerAdOptions = {
  adId: 'YOUR_AD_UNIT_ID',
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  margin: 0,
};

await AdMob.showBanner(options);
```

## ライフサイクル

- `hideBanner()` は現在のバナーを一時的に隠します。
- `resumeBanner()` は隠したバナーを再表示します。
- `removeBanner()` はバナーを削除します。

画面を破棄するときはリスナーとバナーを解放します。

```ts
for (const handle of handles) {
  await handle.remove();
}
await AdMob.removeBanner();
```

`BannerAdPluginEvents.AdPaid` はインプレッション単位の `AdMobRevenueData` を通知します。
