---
title: '設定'
code: []
scrollActiveLine: []
---

Google Mobile Ads SDK と AdMob アプリ ID を入れ、広告リクエストの前に SDK を初期化します。手順は Google の Get started（[Android](https://developers.google.com/admob/android/quick-start?hl=ja) / [iOS](https://developers.google.com/admob/ios/quick-start?hl=ja)）を見てください。このページは Capacitor プラグインのインストールと `initialize` です。

AdMob をインストールし、Capacitor のネイティブプロジェクトを同期します。

```bash
npm install @capacitor-community/admob
npx cap sync
```

このドキュメントは `@capacitor-community/admob` **v8.1.0** と Capacitor 8 を対象にしています。iOS 15 以降、Android API 24 以降に対応します。Capacitor 7 を使う場合は `@capacitor-community/admob@7` をインストールします。

続けて、以下の Android / iOS のアプリ ID を追加します。広告のロードや [同意管理](/docs/consent) の前に `initialize` を呼び出します。

## Android

`android/app/src/main/AndroidManifest.xml` の `<application>` 内に AdMob アプリ ID を追加します。

```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="@string/admob_app_id" />
```

`android/app/src/main/res/values/strings.xml` に値を定義します。

```xml
<string name="admob_app_id">[APP_ID]</string>
```

`[APP_ID]` は広告ユニット ID ではなく、AdMob のアプリ ID に置き換えます。

次の Gradle 変数は未設定のままで構いません。特定のアーティファクト版が必要なときだけ、アプリの `variables.gradle` で上書きします。

| 変数                           | アーティファクト                                 | デフォルト |
| ------------------------------ | ------------------------------------------------ | ---------- |
| `playServicesAdsVersion`       | `com.google.android.gms:play-services-ads`       | `25.4.+`   |
| `userMessagingPlatformVersion` | `com.google.android.ump:user-messaging-platform` | `4.0.0`    |
| `androidxCoreKTXVersion`       | `androidx.core:core-ktx`                         | `1.15.0`   |

## iOS

`ios/App/App/Info.plist` の最外層 `<dict>` 内に追加します。

```xml
<key>GADIsAdManagerApp</key>
<true/>
<key>GADApplicationIdentifier</key>
<string>[APP_ID]</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads to you.</string>
```

`[APP_ID]` を AdMob アプリ ID に置き換え、`NSUserTrackingUsageDescription` に実際の利用目的を記載します。

`SKAdNetworkItems` の例は Google 自身の identifier だけです。残りの ID は Google の [iOS セットアップガイド](https://developers.google.com/admob/ios/quick-start#update_your_infoplist) から追加します。

CocoaPods が `Google-Mobile-Ads-SDK` を解決できない場合は、`ios/` で `pod repo update` を実行してから `npx cap sync ios` を再実行します。

## 初期化

同意情報の取得や広告ロードの前に、`initialize` を一度呼び出します。

```ts
import { AdMob } from '@capacitor-community/admob';

await AdMob.initialize();
```

開発中は Google の [デモ広告ユニット](https://developers.google.com/admob/android/test-ads#demo_ad_units) を使ってください。実機で本番に近い広告を試す場合は [テスト](/docs/testing) の手順でデバイスを登録します。本番に `initializeForTesting: true` を入れないでください。

!::AdMobInitializationOptions::

`isTesting`、`npa`（非パーソナライズ広告）、`immersiveMode` などの広告単位のオプションは `initialize` ではなく各リクエストに付けます。

このメジャーでは Android の Google Mobile Ads SDK を **25.4.x**、iOS を **13.6.0** に固定しています。必要がない限り上書きしないでください。Android 向け [Next-Gen SDK](https://developers.google.com/admob/android/next-gen) は次のプラグインメジャーまで待ちます。
