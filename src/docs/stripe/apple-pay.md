---
title: "Apple Pay"
code: ["/docs/stripe/apple-pay/apple-pay.ts.md"]
scrollActiveLine: [
{id: "", activeLine: {}},
{id: "1.-isapplepayavailable", activeLine: {['apple-pay.ts']: [3, 8]}},
{id: "2.-createapplepay", activeLine: {['apple-pay.ts']: [13, 26]}},
{id: "3.-presentapplepay", activeLine: {['apple-pay.ts']: [26, 33]}},
{id: "4.-addlistener", activeLine: {['apple-pay.ts']: [8, 13]}}
]
---


Apple Payを使えば、ワンフローで即時決済が可能です。詳しい設定は以下をご確認ください：

https://stripe.com/docs/apple-pay

## 🐾 実装ガイド
### Prepare settings
Apple Payを利用するためには、いくつかの設定が必要です。

- AppleマーチャントIDの登録
- Apple Payの証明書を新規に作成する
- Xcodeと統合する

詳細はこちらをご覧ください：

https://stripe.com/docs/apple-pay#merchantid

もしこれらが正しく行われず、 `createApplePay` に与えられたオプションと異なる場合、このメソッドは実行することができません。

### 1. isApplePayAvailable
まず、ユーザのデバイスでApple Payが使えるかどうか確認します。

```ts
import { Stripe, ApplePayEventsEnum } from '@capacitor-community/stripe';

(async() => {
  // Check to be able to use Apple Pay on device
  const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use GooglePay
    return;
  }
})();
```

このメソッドは `resolve(): void` か `reject('Not implemented on Device.')` を返却します。

!::isApplePayAvailable::


### 2. createApplePay

バックエンドエンドポイントに接続し、それぞれのキーを取得する必要があります。これは本プラグインでは「できない」機能です。そのため、 `HTTPClient` や `Axios` 、 `Ajax` などの機能を利用することができます。

Stripeは、バックエンドの実装方法を提供します:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

その後、これらのキーを `createApplePay` メソッドに設定します。

```ts
(async() => {
  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare ApplePay
  await Stripe.createApplePay({
    paymentIntentClientSecret: paymentIntent,
    paymentSummaryItems: [{
      label: 'Product Name',
      amount: 1099.00
    }],
    merchantDisplayName: 'rdlabo',
    countryCode: 'US',
    currency: 'USD',
  });
})();
```

!::createApplePay::


`createApplePay` では、 `CreateApplePayOption` のオプションを使用することができます。 `merchantIdentifier` は [Apple Developer Website](https://developer.apple.com/account/resources/identifiers/add/merchant) で登録した値と同じである必要があります。

!::CreateApplePayOption::

### 3. presentApplePay

`createApplePay` はシングルフローです。 `confirm` メソッドを必要としません。

```ts
(async() => {
  // Present Apple Pay
  const result = await Stripe.presentApplePay();
  if (result.paymentResult === ApplePayEventsEnum.Completed) {
    // Happy path
  }
})();
```

!::presentApplePay::

`presentApplePay` の返り値から `ApplePayResultInterface` を取得することができます。
`ApplePayResultInterface` は `ApplePayEventsEnum` から作成されています。したがって、インポートして結果を確認する必要があります。

!::ApplePayResultInterface::

### 4. addListener

Apple Payのメソッドはリスナーを通知します。もし、支払い処理が完了したときのイベントを取得したい場合は、 `Stripe` オブジェクトに `ApplePayEventsEnum.Completed` リスナーを追加する必要があります。

```ts
// be able to get event of ApplePay
Stripe.addListener(ApplePayEventsEnum.Completed, () => {
  console.log('ApplePayEventsEnum.Completed');
});
```

使用できるイベント名は `ApplePayEventsEnum` にあります。

!::ApplePayEventsEnum::


## 📖 Reference
詳しくはStripeのドキュメントをご覧ください。このプラグインはラッパーなので、詳しい情報はStripeのドキュメンテーションが役立ちます。

### Apple Pay(iOS)
このプラグインの STPApplePayContext は `pod 'Stripe'` を利用しています。

https://stripe.com/docs/apple-pay
