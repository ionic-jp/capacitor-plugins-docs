---
title: 'Getting Started'
code: []
scrollActiveLine: []
---

## Overview

Capacitor community plugin for native AdMob. This plugin wraps the Google Mobile Ads SDK for iOS and Android so you can display banner, interstitial, rewarded, rewarded interstitial, and app open ads in Capacitor apps.

## Features

- Banner ads (including adaptive banners)
- Interstitial ads
- Rewarded video ads
- Rewarded interstitial ads
- App open ads
- Google User Messaging Platform (UMP) consent support
- App Tracking Transparency (iOS tracking permission) helpers

### Choose by advertising goal

| Goal                                                              | Ad format                 | Guide                                      |
| ----------------------------------------------------------------- | ------------------------- | ------------------------------------------ |
| Keep an ad visible alongside app content                          | Banner                    | [Banner Ads](./docs/banner.md)             |
| Show a full-screen ad at a natural break without granting a reward | Interstitial              | [Interstitial Ads](./docs/interstitial.md) |
| Offer a dedicated rewarded experience                             | Rewarded                  | [Rewarded Ads](./docs/rewarded.md)         |
| Offer a reward at a natural transition                            | Rewarded interstitial     | [Rewarded Ads](./docs/rewarded.md)         |
| Monetize an app-open experience                                   | App Open                  | [App Open Ads](./docs/app-open.md)         |

## Quick start

After [Installation](#installation), initialize the SDK, request consent, and show a banner:

```ts
import { AdMob, AdmobConsentStatus, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

async function startAdMob() {
  await AdMob.initialize();

  let consentInfo = await AdMob.requestConsentInfo();
  if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
    consentInfo = await AdMob.showConsentForm();
  }

  if (!consentInfo.canRequestAds) {
    return;
  }

  const options: BannerAdOptions = {
    adId: 'YOUR_AD_UNIT_ID',
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
  };
  await AdMob.showBanner(options);
}
```

The banner sits on the native screen above the WebView, so it can cover your HTML. See [Banner Ads](./docs/banner.md) to inset your layout. Details: [Configuration](./docs/configuration.md), [Consent](./docs/consent.md), and the per-format guides.

## Installation

This plugin already ships Google Mobile Ads SDK. Install the package, then add your AdMob **application** ID in AndroidManifest / Info.plist. Google's Get started guides for [Android](https://developers.google.com/admob/android/quick-start) and [iOS](https://developers.google.com/admob/ios/quick-start) explain app IDs and SKAdNetwork identifiers (Apple's ad conversion IDs); do not add a second Mobile Ads dependency.

This plugin targets `@capacitor-community/admob` **v8** and Capacitor 8. It supports iOS 15 or later and Android API 24 or later.

```bash
npm install @capacitor-community/admob
npx cap sync
```

If you still use Capacitor 7, install `@capacitor-community/admob@7`.

### Google Mobile Ads SDK versions

This major version pins Google Mobile Ads SDK **25.4.x** on Android and **13.6.0** on iOS (Swift Package Manager and CocoaPods). Leave those versions unless you have a specific need. Google's [Next-Gen SDK for Android](https://developers.google.com/admob/android/next-gen) waits until the next plugin major. See [Migration](./docs/migration.md) for the policy behind the pins.

### Android configuration

In `android/app/src/main/AndroidManifest.xml`, add the following under `<application>`:

```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="@string/admob_app_id" />
```

In `android/app/src/main/res/values/strings.xml`:

```xml
<string name="admob_app_id">[APP_ID]</string>
```

Replace `[APP_ID]` with your AdMob **application** ID, not an ad unit ID.

#### Variables

You can leave these unset. Override them in your app's `variables.gradle` only when you need a specific artifact version:

| Variable                       | Artifact                                         | Default  |
| ------------------------------ | ------------------------------------------------ | -------- |
| `playServicesAdsVersion`       | `com.google.android.gms:play-services-ads`       | `25.4.+` |
| `userMessagingPlatformVersion` | `com.google.android.ump:user-messaging-platform` | `4.0.0`  |
| `androidxCoreKTXVersion`       | `androidx.core:core-ktx`                         | `1.15.0` |

### iOS configuration

Add the following inside the outermost `<dict>` in `ios/App/App/Info.plist`:

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

Replace `[APP_ID]` with your AdMob application ID, and describe your actual tracking use in `NSUserTrackingUsageDescription`.

The `SKAdNetworkItems` snippet includes Google's own identifier. Add the other IDs from Google's [iOS setup guide](https://developers.google.com/admob/ios/quick-start#update_your_infoplist).

### Troubleshooting

If CocoaPods cannot resolve `Google-Mobile-Ads-SDK`:

```text
[error] Error running update: Analyzing dependencies
[!] CocoaPods could not find compatible versions for pod "Google-Mobile-Ads-SDK":
```

Run `pod repo update` in `ios/`, then `npx cap sync ios` again.

## Documentation

Start with [Installation](#installation) above, then [Configuration](./docs/configuration.md) and [Consent](./docs/consent.md) before loading ads. Pick an ad format from the table above. The same guides are also on the [documentation site](https://docs.rdlabo.dev/projects/capacitor-admob) (English and Japanese). If you opened this README on npm, use that site for the guides — the `docs/` files live in the GitHub repository. Method signatures are in the API section below.

- [Configuration](./docs/configuration.md) — `AdMob.initialize` and SDK options.
- [Consent](./docs/consent.md) — privacy consent and iOS tracking authorization.
- [Banner Ads](./docs/banner.md) — banner options, lifecycle, and events.
- Full-screen ads:
  - [Interstitial Ads](./docs/interstitial.md) — load, show, and multiple prepared ads.
  - [Rewarded Ads](./docs/rewarded.md) — rewarded video, rewarded interstitial, and server-side verification.
- [App Open Ads](./docs/app-open.md) — load and present on foreground transitions.
- [Ad Events](./docs/events.md) — shared lifecycle events, errors, and revenue data.
- [Testing](./docs/testing.md) — demo ad units, test devices, and consent testing.
- [Migration Guide](./docs/migration.md) — historical notes when upgrading from older plugin versions.
