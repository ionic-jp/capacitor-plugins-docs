---
title: 'Consent'
code: []
scrollActiveLine: []
---

Request privacy information before loading ads. The plugin exposes Google's User Messaging Platform (UMP) and iOS App Tracking Transparency status through one API.

Before using UMP, create the required GDPR and IDFA messages in your AdMob account.

## Request consent

```ts
import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';

await AdMob.initialize();

let consentInfo = await AdMob.requestConsentInfo();
if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
  consentInfo = await AdMob.showConsentForm();
}

if (consentInfo.canRequestAds) {
  // Ads may now be requested.
}
```

Use `canRequestAds` as the decision point. A consent form may be unavailable or unnecessary depending on the user and configured messages.

## iOS tracking authorization

On iOS, inspect the authorization status and request it only when it is undetermined. The request is a no-op on Android and web.

```ts
const tracking = await AdMob.trackingAuthorizationStatus();
if (tracking.status === 'notDetermined') {
  await AdMob.requestTrackingAuthorization();
}
```

## Privacy options

If your privacy message requires an entry point, expose a settings action that calls:

```ts
await AdMob.showPrivacyOptionsForm();
```

`resetConsentInfo()` is intended for testing. Do not use it to clear a production user's consent choice.

## Test a geography

```ts
import { AdMob, AdmobConsentDebugGeography } from '@capacitor-community/admob';

const consentInfo = await AdMob.requestConsentInfo({
  debugGeography: AdmobConsentDebugGeography.EEA,
  testDeviceIdentifiers: ['YOUR_TEST_DEVICE_ID'],
});
```

Debug geography settings must only be used with registered test devices.
