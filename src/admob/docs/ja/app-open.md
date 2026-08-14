---
title: 'アプリ起動時広告'
code: []
scrollActiveLine: []
---

アプリ起動時広告はフォアグラウンドへの復帰時に表示する広告です。事前にロードし、利用可能なことを確認してから表示します。

```ts
import {
  AdLoadInfo,
  AdMob,
  AppOpenAdOptions,
  AppOpenAdPluginEvents,
} from '@capacitor-community/admob';

await AdMob.addListener(AppOpenAdPluginEvents.Loaded, (info: AdLoadInfo) => {
  console.log('ロード完了', info.adUnitId);
});
await AdMob.addListener(AppOpenAdPluginEvents.FailedToLoad, console.error);
await AdMob.addListener(AppOpenAdPluginEvents.FailedToShow, console.error);

const options: AppOpenAdOptions = { adId: 'YOUR_AD_UNIT_ID' };
const { adUnitId } = await AdMob.loadAppOpen(options);
const { value: isLoaded } = await AdMob.isAppOpenLoaded({ adId: adUnitId });
if (isLoaded) {
  await AdMob.showAppOpen({ adId: adUnitId });
}
```

開発中は `adId` に Google が提供するアプリ起動時広告用のテスト広告ユニット ID を指定します。`AppOpenAdOptions` に `isTesting` オプションはありません。

`Closed` イベントでアプリのフローを再開し、次の広告をロードします。広告のロード待ちで起動を無期限にブロックしないでください。
