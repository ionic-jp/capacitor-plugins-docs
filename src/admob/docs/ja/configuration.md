---
title: '設定'
code: []
scrollActiveLine: []
---

AdMob をインストールし、Capacitor のネイティブプロジェクトを同期します。

```bash
npm install @capacitor-community/admob
npx cap sync
```

このドキュメントは `@capacitor-community/admob` **v8.1.0** と Capacitor 8 を対象にしています。iOS 15 以降、Android API 24 以降に対応します。

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

| Gradle 変数              | デフォルト |
| ------------------------ | ---------- |
| `playServicesAdsVersion` | `25.4.+`   |
| `androidxCoreKTXVersion` | `1.15.0`   |

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
<string>パーソナライズされた広告を表示するために使用します。</string>
```

`[APP_ID]` を AdMob アプリ ID に置き換え、`NSUserTrackingUsageDescription` に実際の利用目的を記載します。

## 初期化

同意情報の取得や広告ロードの前に、`initialize` を一度呼び出します。開発中は Google のテスト広告ユニットを使ってください。

```ts
import { AdMob } from '@capacitor-community/admob';

await AdMob.initialize({
  testingDevices: ['YOUR_TEST_DEVICE_ID'],
  initializeForTesting: true,
});
```
