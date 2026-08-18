---
title: 'Ad Events'
code: []
scrollActiveLine: []
---

Register event listeners before loading or showing an ad so that the first lifecycle and impression events are not missed.

`AdMob.addListener` returns a handle. Await the registration, then call `remove()` when the owning screen is destroyed:

```ts
import { AdMob, BannerAdPluginEvents } from '@capacitor-community/admob';

const handle = await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
  console.log('Banner loaded');
});

await handle.remove();
```

## Common lifecycle events

| Event                     | Emitted when                                           |
| ------------------------- | ------------------------------------------------------ |
| `Loaded`                  | The ad finished loading and is ready to show.          |
| `FailedToLoad`            | The ad could not load. Check `AdMobError` for details. |
| `Showed` / `Opened`       | The ad became visible to the user.                     |
| `FailedToShow`            | A loaded ad failed to display.                         |
| `Dismissed` / `Closed`    | The user closed the full-screen ad or overlay.         |
| `Rewarded`                | The user earned the advertised reward.                 |
| `SizeChanged`             | Banner dimensions changed.                             |
| `AdImpression` / `AdPaid` | An impression was recorded. See revenue events below.  |

`FailedToLoad` and `FailedToShow` listeners receive an `AdMobError` with `code` and `message`.

## Impression-level revenue

Full-screen formats emit `AdMobRevenueData` on their `AdImpression` event. Banners emit the same payload on `AdPaid`. Banner `AdImpression` has no payload; it only signals that an impression was recorded.

| Prop           | Type               | Description                                                                                 |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| `adUnitId`     | `string`           | Ad unit associated with the paid event.                                                     |
| `valueMicros`  | `number`           | Value in micros; `1_000_000` micros equals one unit of `currencyCode`.                      |
| `currencyCode` | `string`           | ISO 4217 currency code for `valueMicros`.                                                   |
| `precision`    | `AdValuePrecision` | How precise the reported value is (`Unknown`, `Estimated`, `PublisherProvided`, `Precise`). |
| `networkName`  | `string`           | Mediation adapter class name, or an empty string when unavailable.                          |
| `impressionId` | `string`           | Response identifier for the impression, or an empty string when unavailable.                |

See [Banner Ads](/docs/banner), [Full-screen Ads](/docs/full-screen-ads), and [App Open Ads](/docs/app-open). Method and enum signatures are in the [API](/docs/api).
