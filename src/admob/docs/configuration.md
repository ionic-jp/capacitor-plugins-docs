---
title: 'Configuration'
code: []
scrollActiveLine: []
---

Install the Capacitor plugin (it already ships Google Mobile Ads SDK), add your AdMob application ID, then call `initialize` before requesting ads. Google's Get started guides for [Android](https://developers.google.com/admob/android/quick-start) and [iOS](https://developers.google.com/admob/ios/quick-start) explain app IDs and SKAdNetwork identifiers; do not add a second Mobile Ads dependency.

Install AdMob and synchronize the native Capacitor projects.

```bash
npm install @capacitor-community/admob
npx cap sync
```

This documentation targets `@capacitor-community/admob` **v8.1.0** and Capacitor 8. The plugin supports iOS 15 or later and Android API 24 or later. If you still use Capacitor 7, install `@capacitor-community/admob@7`.

Then add the Android and iOS application ID entries below. Call `initialize` before [consent](/docs/consent) or loading ads.

## Android

Add your AdMob application ID under `<application>` in `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="@string/admob_app_id" />
```

Then define the value in `android/app/src/main/res/values/strings.xml`:

```xml
<string name="admob_app_id">[APP_ID]</string>
```

Replace `[APP_ID]` with the application ID from AdMob, not an ad unit ID.

You can leave these Gradle variables unset. Override them in your app's `variables.gradle` only when you need a specific artifact version:

| Variable                       | Artifact                                         | Default  |
| ------------------------------ | ------------------------------------------------ | -------- |
| `playServicesAdsVersion`       | `com.google.android.gms:play-services-ads`       | `25.4.+` |
| `userMessagingPlatformVersion` | `com.google.android.ump:user-messaging-platform` | `4.0.0`  |
| `androidxCoreKTXVersion`       | `androidx.core:core-ktx`                         | `1.15.0` |

## iOS

Add the following keys inside the outermost `<dict>` in `ios/App/App/Info.plist`:

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

Replace `[APP_ID]` with your AdMob application ID and describe your actual tracking use in `NSUserTrackingUsageDescription`.

The `SKAdNetworkItems` snippet includes Google's own identifier. Add the other IDs from Google's [iOS setup guide](https://developers.google.com/admob/ios/quick-start#update_your_infoplist).

If CocoaPods cannot resolve `Google-Mobile-Ads-SDK`, run `pod repo update` in `ios/`, then `npx cap sync ios` again.

## Initialize

Call `initialize` once before requesting consent information or loading ads.

```ts
import { AdMob } from '@capacitor-community/admob';

await AdMob.initialize();
```

During development, prefer Google [demo ad units](https://developers.google.com/admob/android/test-ads#demo_ad_units). To test production-like ads on a physical device, register that device as described in [Testing](/docs/testing). Do not ship `initializeForTesting: true` in production.

!::AdMobInitializationOptions::

Per-ad options such as `isTesting`, `npa` (non-personalized ads), and `immersiveMode` are set on each ad request, not on `initialize`.

This major version pins Google Mobile Ads SDK **25.4.x** on Android and **13.6.0** on iOS. Leave those versions unless you have a specific need. Google's [Next-Gen SDK for Android](https://developers.google.com/admob/android/next-gen) waits until the next plugin major.
