---
title: 'Banner Ads'
code: []
scrollActiveLine: []
---

Banner ads occupy part of the native view. Register listeners before calling `showBanner` so the first load and size events are not missed.

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
    console.log('Banner loaded');
  }),
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    console.log('Banner size', size.width, size.height);
  }),
  AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
    console.error(error);
  }),
]);

const options: BannerAdOptions = {
  adId: 'YOUR_AD_UNIT_ID',
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  margin: 0,
  // isTesting: true,
};

await AdMob.showBanner(options);
```

## Lifecycle

- `hideBanner()` temporarily hides the current banner.
- `resumeBanner()` shows a hidden banner again.
- `removeBanner()` removes it. Call `showBanner()` to create another one.

Release listener handles when the owning screen is destroyed:

```ts
for (const handle of handles) {
  await handle.remove();
}
await AdMob.removeBanner();
```

`BannerAdPluginEvents.AdPaid` emits impression-level `AdMobRevenueData`; full-screen formats emit the same data through their `AdImpression` event.
