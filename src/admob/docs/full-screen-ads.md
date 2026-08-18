---
title: 'Full-screen Ads'
code: []
scrollActiveLine: []
---

Full-screen ads cover the host app. Google documents three formats this plugin wraps: [interstitial](https://developers.google.com/admob/android/interstitial), [rewarded](https://developers.google.com/admob/android/rewarded), and [rewarded interstitial](https://developers.google.com/admob/android/rewarded-interstitial) ([iOS interstitial](https://developers.google.com/admob/ios/interstitial), [rewarded](https://developers.google.com/admob/ios/rewarded), [rewarded interstitial](https://developers.google.com/admob/ios/rewarded-interstitial)).

Prepare the ad before showing it. Register listeners first, use test ad units during development, and show ads only at a natural break in the experience. Shared load, show, and revenue events are listed on [Ad Events](/docs/events).

## Interstitial

Interstitial ads are full-screen ads shown at a natural transition, such as between activities or game levels. The user can tap through or close the ad and return to the app.

Use an interstitial when the user should not receive an in-app reward.

```ts
import {
  AdLoadInfo,
  AdMob,
  AdMobRevenueData,
  AdOptions,
  InterstitialAdPluginEvents,
} from '@capacitor-community/admob';

await AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
  console.log('Interstitial loaded', info.adUnitId);
});
await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, console.error);
await AdMob.addListener(InterstitialAdPluginEvents.AdImpression, (data: AdMobRevenueData) => {
  console.log(data);
});

const options: AdOptions = {
  adId: 'YOUR_AD_UNIT_ID',
  // isTesting: true,
  // npa: true,
  // immersiveMode: true,
};
const { adUnitId } = await AdMob.prepareInterstitial(options);
await AdMob.showInterstitial({ adId: adUnitId });
```

When no `adId` is passed to `showInterstitial()`, the most recently prepared ad is shown. Passing the returned `adUnitId` lets you select a specific ad when several are prepared:

```ts
await AdMob.prepareInterstitial({ adId: 'ca-app-pub-xxx/interstitial-1' });
await AdMob.prepareInterstitial({ adId: 'ca-app-pub-xxx/interstitial-2' });

await AdMob.showInterstitial({ adId: 'ca-app-pub-xxx/interstitial-1' });
```

## Rewarded

Rewarded ads let you give in-app items for interacting with video ads, playable ads, or surveys.

Treat rewarded ads as a reward flow. Grant the reward only from the returned result or the `Rewarded` event, not from `Dismissed`.

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

Server-side verification (SSV) lets your backend confirm that a reward was earned. See Google's [SSV documentation](https://support.google.com/admob/answer/9603226). Callbacks fire only for production ads; test ads do not invoke your SSV endpoint. For local validation of the `ssv` payload, you can send a mock request after `RewardAdPluginEvents.Rewarded`. Replace `ENVIRONMENT_IS_DEVELOPMENT` with your own development flag:

```ts
const userId = 'USER_ID';
const customData = JSON.stringify({ placement: 'bonus' });

await AdMob.addListener(RewardAdPluginEvents.Rewarded, async () => {
  if (!ENVIRONMENT_IS_DEVELOPMENT) {
    return;
  }
  try {
    const params = new URLSearchParams({
      ad_network: 'TEST',
      ad_unit: 'TEST',
      custom_data: customData,
      reward_amount: 'TEST',
      reward_item: 'TEST',
      timestamp: 'TEST',
      transaction_id: 'TEST',
      user_id: userId,
      signature: 'TEST',
      key_id: 'TEST',
    });
    await fetch(`https://your-staging-ssv-endpoint?${params.toString()}`);
  } catch (err) {
    console.error(err);
  }
});
```

## Rewarded interstitial

Rewarded interstitial ads are incentivized full-screen ads that appear during natural app transitions. Unlike rewarded video, the user does not opt in first.

Use a rewarded interstitial when the rewarded experience belongs at a natural transition in the app.

```ts
import { AdMob, RewardInterstitialAdOptions } from '@capacitor-community/admob';

const options: RewardInterstitialAdOptions = { adId: 'YOUR_AD_UNIT_ID' };
const { adUnitId } = await AdMob.prepareRewardInterstitialAd(options);
const reward = await AdMob.showRewardInterstitialAd({ adId: adUnitId });
```

!::AdOptions::

!::RewardAdOptions::

!::RewardInterstitialAdOptions::

See [Testing](/docs/testing) for `isTesting`. Listen to the matching event enum: `InterstitialAdPluginEvents`, `RewardAdPluginEvents`, or `RewardInterstitialAdPluginEvents`.
