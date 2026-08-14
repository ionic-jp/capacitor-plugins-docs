---
title: 'Configuration'
code: []
scrollActiveLine: []
---

Install AdMob and synchronize the native Capacitor projects.

```bash
npm install @capacitor-community/admob
npx cap sync
```

This documentation targets `@capacitor-community/admob` **v8.1.0** and Capacitor 8. The plugin supports iOS 15 or later and Android API 24 or later.

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

The plugin uses these optional Gradle project variables:

| Variable                 | Default  |
| ------------------------ | -------- |
| `playServicesAdsVersion` | `25.4.+` |
| `androidxCoreKTXVersion` | `1.15.0` |

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

## Initialize

Call `initialize` once before requesting consent information or loading ads. Use Google-provided test ad units while developing. If you must test production-like ads, pass your test device IDs.

```ts
import { AdMob } from '@capacitor-community/admob';

await AdMob.initialize({
  testingDevices: ['YOUR_TEST_DEVICE_ID'],
  initializeForTesting: true,
});
```

Google Mobile Ads SDK APIs and versions are intentionally pinned for the current plugin major to avoid behavior changes. Review the plugin release notes before overriding native SDK versions.
