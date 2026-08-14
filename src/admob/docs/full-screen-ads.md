---
title: 'Full-screen Ads'
code: []
scrollActiveLine: []
---

Prepare full-screen ads before showing them. Register listeners first, use test ad units during development, and show ads only at a natural break in the experience.

## Interstitial

```ts
import { AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob';

await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, console.error);

const options: AdOptions = {
  adId: 'YOUR_AD_UNIT_ID',
  // isTesting: true,
};

const { adUnitId } = await AdMob.prepareInterstitial(options);
await AdMob.showInterstitial({ adId: adUnitId });
```

When no `adId` is passed to a show method, the most recently prepared ad is shown. Passing the returned `adUnitId` lets you select a specific ad when several are prepared.

## Rewarded

Grant the reward from the `Rewarded` event or the value returned by `showRewardVideoAd`, according to your app's flow.

```ts
import {
  AdMob,
  AdMobRewardItem,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
  console.log('Reward earned', reward.amount, reward.type);
});

const options: RewardAdOptions = {
  adId: 'YOUR_AD_UNIT_ID',
  ssv: {
    userId: 'USER_ID',
    customData: JSON.stringify({ placement: 'bonus' }),
  },
};

await AdMob.prepareRewardVideoAd(options);
const reward = await AdMob.showRewardVideoAd();
```

Server-side verification callbacks are not sent for test ads.

## Rewarded interstitial

```ts
import { AdMob, RewardInterstitialAdOptions } from '@capacitor-community/admob';

const options: RewardInterstitialAdOptions = { adId: 'YOUR_AD_UNIT_ID' };
const { adUnitId } = await AdMob.prepareRewardInterstitialAd(options);
const reward = await AdMob.showRewardInterstitialAd({ adId: adUnitId });
```

Listen to the matching event enum for load, show, dismissal, failure, reward, and impression events: `InterstitialAdPluginEvents`, `RewardAdPluginEvents`, or `RewardInterstitialAdPluginEvents`.
