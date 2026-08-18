---
title: '同意管理'
code: []
scrollActiveLine: []
---

広告をロードする前にプライバシー情報を取得します。このプラグインは Google の User Messaging Platform（UMP）と iOS の App Tracking Transparency を共通 API で提供します。

UMP を使う前に、AdMob で [GDPR メッセージ](https://support.google.com/admob/answer/10113207) を作成します。[広告主識別子（IDFA）メッセージ](https://support.google.com/admob/answer/10115027) も設定できます。IDFA メッセージを公開している場合、UMP が explainer と App Tracking Transparency のダイアログを出します。そのときは `requestTrackingAuthorization()` を呼ばないでください。

## 同意を取得する

1. `AdMob.initialize()` を呼びます。[設定](/docs/configuration) を参照してください。
2. `AdMob.requestConsentInfo()` を呼びます。
3. 必要な場合は `AdMob.showConsentForm()` を呼びます。
4. `consentInfo.canRequestAds` が `true` のときだけ広告をロードします。

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

広告リクエスト可否の判定には `canRequestAds` を使います。設定したメッセージとユーザーによっては、同意フォームが不要または利用できないことがあります。

## iOS のトラッキング許可

UMP の IDFA メッセージを**使わない**場合だけ、状態が `notDetermined` のときに App Tracking Transparency を自分でリクエストします。AdMob で IDFA メッセージを設定している場合はこの節をスキップしてください。UMP がそのダイアログを出します。

```ts
const tracking = await AdMob.trackingAuthorizationStatus();
if (tracking.status === 'notDetermined') {
  /**
   * If you want to explain tracking before the iOS dialog,
   * present your own UI here, then continue.
   */
  await AdMob.requestTrackingAuthorization();
}
```

`requestTrackingAuthorization()` は Android、Web、iOS 14 未満では何もしません。

## プライバシーオプション

プライバシーメッセージがアプリ内の入口を必要とする場合は、設定画面などから次を呼び出せるようにします。

```ts
await AdMob.showPrivacyOptionsForm();
```

`resetConsentInfo()` はテスト用です。本番ユーザーの同意選択の消去に使わないでください。

デバッグ用の地域設定とテストデバイス ID は [テスト](/docs/testing) を参照してください。
