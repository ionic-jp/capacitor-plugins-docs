---
title: '同意管理'
code: []
scrollActiveLine: []
---

広告をロードする前にプライバシー情報を取得します。このプラグインは Google User Messaging Platform（UMP）と iOS App Tracking Transparency の状態を共通 API で提供します。

UMP を使う前に、AdMob アカウントで必要な GDPR・IDFA メッセージを作成します。

## 同意を取得する

```ts
import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';

await AdMob.initialize();

let consentInfo = await AdMob.requestConsentInfo();
if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
  consentInfo = await AdMob.showConsentForm();
}

if (consentInfo.canRequestAds) {
  // 広告をリクエストできます。
}
```

`canRequestAds` を広告リクエスト可否の判定に使います。

## iOS のトラッキング許可

```ts
const tracking = await AdMob.trackingAuthorizationStatus();
if (tracking.status === 'notDetermined') {
  await AdMob.requestTrackingAuthorization();
}
```

Android と Web では許可リクエストは何も行いません。

## プライバシーオプション

必要な場合は設定画面などから次を呼び出せるようにします。

```ts
await AdMob.showPrivacyOptionsForm();
```

`resetConsentInfo()` はテスト用です。本番ユーザーの同意選択の消去に使わないでください。

## 地域を指定したテスト

```ts
import { AdMob, AdmobConsentDebugGeography } from '@capacitor-community/admob';

await AdMob.requestConsentInfo({
  debugGeography: AdmobConsentDebugGeography.EEA,
  testDeviceIdentifiers: ['YOUR_TEST_DEVICE_ID'],
});
```

デバッグ用の地域設定は登録済みのテストデバイスでのみ使います。
