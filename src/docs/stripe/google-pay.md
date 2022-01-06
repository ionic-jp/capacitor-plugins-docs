---
title: "Google Pay"
code: [
  "/docs/stripe/google-pay/strings.xml.md",
  "/docs/stripe/google-pay/android-manifest.xml.md",
  "/docs/stripe/google-pay/google-pay.ts.md"
]
scrollActiveLine: [
  {id: "", activeLine: {}},
  {id: "strings.xml", activeLine: {['strings.xml']: [6, 15]}},
  {id: "androidmanifest.xml", activeLine: {['AndroidManifest.xml']: [17, 30]}},
  {id: "1.-isgooglepayavailable", activeLine: {['google-pay.ts']: [3, 8]}},
  {id: "2.-creategooglepay", activeLine: {['google-pay.ts']: [10, 18]}},
  {id: "3.-presentgooglepay", activeLine: {['google-pay.ts']: [18, 24]}},
  {id: "4.-addlistener", activeLine: {['google-pay.ts']: [8, 10]}}
]
---

Google Payを使えば、ワンフローで即時決済が可能です。詳しい設定は以下をご確認ください：

https://stripe.com/docs/google-pay

## 🐾 実装ガイド

### Prepare settings
Google Payを利用するためには、いくつかの設定が必要です。

#### strings.xml

`android/app/src/main/res/values/strings.xml` に以下の値を追加します。

- publishable_key(Stripe's publoshable key)
- enable_google_pay
- country_code
- merchant_display_name
- google_pay_is_testing

これらの設定は、プラグインを初期化する前にGooglePayの処理を行う必要があるため、別途設定します。

```xml
<string name="publishable_key">Your Publishable Key</string>
<bool name="enable_google_pay">true</bool>
<string name="country_code">US</string>
<string name="merchant_display_name">Widget Store</string>
<bool name="google_pay_is_testing">true</bool>
```

#### AndroidManifest.xml

`android/app/src/main/AndroidManifest.xml` の `manifest > application` 以下にXML要素を追加します。これらは strings.xml に設定した値が呼び出されます。

```xml
<meta-data
  android:name="com.getcapacitor.community.stripe.publishable_key"
  android:value="@string/publishable_key"/>

<meta-data
  android:name="com.getcapacitor.community.stripe.enable_google_pay"
  android:value="@bool/enable_google_pay"/>

<meta-data
  android:name="com.google.android.gms.wallet.api.enabled"
  android:value="true" />

<meta-data
  android:name="com.getcapacitor.community.stripe.country_code"
  android:value="@string/country_code"/>

<meta-data
  android:name="com.getcapacitor.community.stripe.merchant_display_name"
  android:value="@string/merchant_display_name"/>

<meta-data
  android:name="com.getcapacitor.community.stripe.google_pay_is_testing"
  android:value="@bool/google_pay_is_testing"/>
```


### 1. isGooglePayAvailable
まず、ユーザのデバイスでGooglePayが使えるかどうか確認します。

```ts
import { Stripe, GooglePayEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Check to be able to use Google Pay on device
  const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use GooglePay
    return;
  }
})();
```

このメソッドは `resolve(): void` か `reject('Not implemented on Device.')` を返却します。

!::isGooglePayAvailable::


### 2. createGooglePay

バックエンドエンドポイントに接続し、それぞれのキーを取得する必要があります。これは本プラグインでは「できない」機能です。そのため、 `HTTPClient` や `Axios` 、 `Ajax` などの機能を利用することができます。

Stripeは、バックエンドの実装方法を提供します:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

その後、これらのキーを `createGooglePay` メソッドに設定します。

```ts
(async () => {
  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare GooglePay
  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,
  });
})();
```

!::createGooglePay::


`createGooglePay` では `CreateGooglePayOption` が利用できます。

!::CreateApplePayOption::

### 3. presentGooglePay

`createGooglePay` はシングルフローです。 `confirm` メソッドを必要としません。

```ts
(async () => {
  // Present GooglePay
  const result = await Stripe.presentGooglePay();
  if (result.paymentResult === GooglePayEventsEnum.Completed) {
    // Happy path
  }
})();
```

!::presentGooglePay::

`presentGooglePay` の返り値から `GooglePayResultInterface` を取得することができます。
`GooglePayResultInterface` は `GooglePayEventsEnum` から作成されています。したがって、インポートして結果を確認する必要があります。

!::GooglePayResultInterface::

### 4. addListener

Google Payのメソッドはリスナーを通知します。もし、支払い処理が完了したときのイベントを取得したい場合は、 `Stripe` オブジェクトに `GooglePayEventsEnum.Completed` リスナーを追加する必要があります。

```ts
// be able to get event of GooglePay
Stripe.addListener(GooglePayEventsEnum.Completed, () => {
  console.log('GooglePayEventsEnum.Completed');
});
```

使用できるイベント名は `GooglePayEventsEnum` にあります。

!::GooglePayEventsEnum::


## 📖 Reference
詳しくはStripeのドキュメントをご覧ください。このプラグインはラッパーなので、詳しい情報はStripeのドキュメンテーションが役立ちます。

### GooglePay(Android)
このプラグインの GooglePayLauncher は `com.stripe:stripe-android` を利用しています。

https://stripe.com/docs/google-pay
