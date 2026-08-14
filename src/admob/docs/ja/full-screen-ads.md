---
title: 'フルスクリーン広告'
code: []
scrollActiveLine: []
---

フルスクリーン広告は表示前に準備します。先にリスナーを登録し、開発中はテスト広告ユニットを使います。

## インタースティシャル

```ts
import { AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob';

await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, console.error);

const options: AdOptions = { adId: 'YOUR_AD_UNIT_ID' };
const { adUnitId } = await AdMob.prepareInterstitial(options);
await AdMob.showInterstitial({ adId: adUnitId });
```

表示メソッドの `adId` を省略すると、最後に準備した広告を表示します。複数を準備する場合は、戻り値の `adUnitId` を指定します。

## リワード

```ts
import {
  AdMob,
  AdMobRewardItem,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
  console.log('獲得した報酬', reward.amount, reward.type);
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

テスト広告ではサーバーサイド検証のコールバックは送信されません。

## リワード付きインタースティシャル

```ts
import { AdMob, RewardInterstitialAdOptions } from '@capacitor-community/admob';

const options: RewardInterstitialAdOptions = { adId: 'YOUR_AD_UNIT_ID' };
const { adUnitId } = await AdMob.prepareRewardInterstitialAd(options);
const reward = await AdMob.showRewardInterstitialAd({ adId: adUnitId });
```

ロード、表示、閉じる操作、エラー、報酬、インプレッションは各広告形式に対応するイベント enum で監視できます。
