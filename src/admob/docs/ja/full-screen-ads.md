---
title: 'フルスクリーン広告'
code: []
scrollActiveLine: []
---

フルスクリーン広告はホストアプリの画面を覆います。このプラグインが扱うのはインタースティシャル、リワード、リワード付きインタースティシャルです。公式の形式ガイドは各節にあります。

表示前に広告を準備します。先にリスナーを登録し、開発中はテスト広告ユニットを使い、体験の区切りでのみ表示します。共通のロード・表示・売上イベントは [広告イベント](/docs/events) にあります。

## インタースティシャル

インタースティシャルは、画面遷移やゲームのレベル間など自然な区切りで出すフルスクリーン広告です。ユーザーは広告先へ進むか、閉じてアプリに戻れます。形式の説明は Google のインタースティシャル広告ガイド（[Android](https://developers.google.com/admob/android/interstitial?hl=ja) / [iOS](https://developers.google.com/admob/ios/interstitial?hl=ja)）を見てください。

アプリ内報酬を渡さない自然な区切りでは、インタースティシャルを使います。

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

`showInterstitial()` に `adId` を渡さないと、最後に準備した広告を表示します。複数を準備する場合は、戻り値の `adUnitId` を指定します。

```ts
await AdMob.prepareInterstitial({ adId: 'ca-app-pub-xxx/interstitial-1' });
await AdMob.prepareInterstitial({ adId: 'ca-app-pub-xxx/interstitial-2' });

await AdMob.showInterstitial({ adId: 'ca-app-pub-xxx/interstitial-1' });
```

## リワード

リワード広告は、動画・プレイアブル・アンケートへの操作と引き換えにアプリ内アイテムを渡す形式です。形式の説明は Google のリワード広告ガイド（[Android](https://developers.google.com/admob/android/rewarded?hl=ja) / [iOS](https://developers.google.com/admob/ios/rewarded?hl=ja)）を見てください。

リワード広告は報酬フローとして扱います。報酬は戻り値または `Rewarded` イベントからのみ付与し、`Dismissed` では付与しません。

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
  // ssv: {
  //   userId: 'USER_ID',
  //   customData: JSON.stringify({ placement: 'bonus' }),
  // },
};

await AdMob.prepareRewardVideoAd(options);
const reward = await AdMob.showRewardVideoAd();
```

サーバーサイド検証（SSV）は、報酬が得られたことをバックエンドで確認するための仕組みです。Google の [SSV の説明](https://support.google.com/admob/answer/9603226?hl=ja) を見てください。コールバックは本番広告でのみ送られ、テスト広告では SSV エンドポイントは呼ばれません。`ssv` のペイロードをローカルで確認するには、`RewardAdPluginEvents.Rewarded` のあとにモックリクエストを送れます。`ENVIRONMENT_IS_DEVELOPMENT` は自分の開発用フラグに置き換えてください。

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

## リワード付きインタースティシャル

リワード付きインタースティシャルは、自然な遷移で自動表示される報酬付きフルスクリーン広告です。通常のリワードと違い、視聴のオプトインは不要です。形式の説明は Google のリワード付きインタースティシャルガイド（[Android](https://developers.google.com/admob/android/rewarded-interstitial?hl=ja) / [iOS](https://developers.google.com/admob/ios/rewarded-interstitial?hl=ja)）を見てください。

報酬体験がアプリの自然な遷移に乗る場合は、リワード付きインタースティシャルを使います。

```ts
import { AdMob, RewardInterstitialAdOptions } from '@capacitor-community/admob';

const options: RewardInterstitialAdOptions = { adId: 'YOUR_AD_UNIT_ID' };
const { adUnitId } = await AdMob.prepareRewardInterstitialAd(options);
const reward = await AdMob.showRewardInterstitialAd({ adId: adUnitId });
```

!::AdOptions::

!::RewardAdOptions::

!::RewardInterstitialAdOptions::

`isTesting` は [テスト](/docs/testing) を参照してください。ロード、表示、閉じる操作、失敗、報酬、インプレッションは `InterstitialAdPluginEvents`、`RewardAdPluginEvents`、`RewardInterstitialAdPluginEvents` のいずれかで監視します。
