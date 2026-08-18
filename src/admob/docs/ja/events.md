---
title: '広告イベント'
code: []
scrollActiveLine: []
---

最初のライフサイクルとインプレッションを取りこぼさないよう、広告のロードや表示より前にリスナーを登録します。

`AdMob.addListener` はハンドルを返します。登録を await し、画面を破棄するときに `remove()` します。

```ts
import { AdMob, BannerAdPluginEvents } from '@capacitor-community/admob';

const handle = await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
  console.log('Banner loaded');
});

await handle.remove();
```

## 共通のライフサイクルイベント

| イベント                  | 発行されるとき                                           |
| ------------------------- | -------------------------------------------------------- |
| `Loaded`                  | 広告のロードが完了し、表示できる状態になった。           |
| `FailedToLoad`            | 広告をロードできなかった。`AdMobError` を確認する。      |
| `Showed` / `Opened`       | 広告がユーザーに見えた。                                 |
| `FailedToShow`            | ロード済みの広告を表示できなかった。                     |
| `Dismissed` / `Closed`    | ユーザーがフルスクリーン広告またはオーバーレイを閉じた。 |
| `Rewarded`                | ユーザーが案内どおりの報酬を得た。                       |
| `SizeChanged`             | バナーの寸法が変わった。                                 |
| `AdImpression` / `AdPaid` | インプレッションが記録された。売上イベントは下記。       |

`FailedToLoad` と `FailedToShow` のリスナーは `code` と `message` を持つ `AdMobError` を受け取ります。

## インプレッション単位の売上

フルスクリーン形式は `AdImpression` で `AdMobRevenueData` を出します。バナーは同じペイロードを `AdPaid` で出します。バナーの `AdImpression` にペイロードはなく、インプレッションが記録されたことだけを知らせます。

| プロパティ     | 型                 | 説明                                                                     |
| -------------- | ------------------ | ------------------------------------------------------------------------ |
| `adUnitId`     | `string`           | 有料イベントに紐づく広告ユニット。                                       |
| `valueMicros`  | `number`           | マイクロ単位の価値。`1_000_000` マイクロが `currencyCode` の 1 単位。    |
| `currencyCode` | `string`           | `valueMicros` の ISO 4217 通貨コード。                                   |
| `precision`    | `AdValuePrecision` | 報告値の精度（`Unknown`、`Estimated`、`PublisherProvided`、`Precise`）。 |
| `networkName`  | `string`           | 配信したメディエーションアダプタのクラス名。不明なときは空文字。         |
| `impressionId` | `string`           | インプレッションのレスポンス識別子。不明なときは空文字。                 |

[バナー広告](/docs/banner)、[フルスクリーン広告](/docs/full-screen-ads)、[アプリ起動時広告](/docs/app-open) を参照してください。メソッドと enum のシグネチャは [API](/docs/api) にあります。
