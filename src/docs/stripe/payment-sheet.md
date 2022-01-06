---
title: "PaymentSheet"
code: ["/docs/stripe/payment-sheet/payment-sheet.ts.md"]
scrollActiveLine: [
  {id: "", activeLine: {}},
  {id: "1.-createpaymentsheet", activeLine: {['payment-sheet.ts']: [7, 15]}},
  {id: "2.-presentpaymentsheet", activeLine: {['payment-sheet.ts']: [16, 20]}},
  {id: "3.-addlistener", activeLine: {['payment-sheet.ts']: [3, 6]}}
]
---

PaymentSheetを使えば、1つのフローで決済を行うことができます。ユーザーが支払いボタンを押せば、すぐに支払いが完了します。(もし、この後に何らかのフローが必要な場合は、`paymentFlow` メソッドを使用してください）。

このメソッドには `PaymentIntent` が必要です。 `PaymentIntent` が何であるかご存知ない場合は、まずはStripeの公式サイトで学んでください。

__PaymentIntent:__
https://stripe.com/docs/payments/payment-intents

このガイドでは、 `PaymentIntent` を簡単に取得できる方法を紹介します。

## 🐾 Implements
### 1. createPaymentSheet

このメソッドはPaymentSheetのための設定です。使用する前に、バックエンドのエンドポイントに接続し、それぞれのキーを取得する必要があります。これは、このプラグインには「ない」機能です。そのため、 `HTTPClient` 、 `Axios` 、 `Ajax` などを使用することになります。以下は、AngularのHttpClientの例です。この例では、`paymentIntent`、`ephemeralKey`、`ephemeralKey`を取得しています。

Stripeはバックエンドの実装方法を提供しています:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

その後、これらのキーを `createPaymentSheet` メソッドで利用します。

```ts
import { Stripe, PaymentSheetEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Connect to your backend endpoint, and get every key.
  const { paymentIntent, ephemeralKey, customer } = await this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // prepare PaymentSheet with CreatePaymentSheetOption.
  await Stripe.createPaymentSheet({
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
  });
})();
```

`createPaymentSheet` は `CreatePaymentSheetOption` のオプションを使用することができます。

!::createPaymentSheet::

プロパティ `paymentIntentClientSecret`, `customerId`, `customerEphemeralKeySecret` は __必須__ です。また、 [デザインを設定して](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-flowcontroller) `alwaysLight` か `alwaysDark` にすることもできます。 [ApplePay](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-apple-pay) や [GooglePay](https://stripe.com/docs/payments/accept-a-payment?platform=android&ui=payment-sheet#android-google-pay) を PaymentSheetで設定することもできます。

!::CreatePaymentSheetOption::

### 2. presentPaymentSheet

`presentPaymentSheet` メソッドを実行すると、プラグインはPaymentSheetを提示し、結果を取得します。このメソッドは `createPaymentSheet` の後に実行する必要があります。

```ts
(async () => {
  // present PaymentSheet and get result.
  const result = await Stripe.presentPaymentSheet();
  if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
    // Happy path
  }
})();
```

`presentPaymentSheet` の返り値から `PaymentSheetResultInterface` を取得することができます。

!::presentPaymentSheet::

`PaymentSheetResultInterface` は `PaymentSheetEventsEnum` から作成されています。したがって、インポートして結果を確認する必要があります。

!::PaymentSheetResultInterface::

### 3. addListener

PaymentSheetのメソッドはリスナーを通知します。もし、支払い処理が完了したときのイベントを取得したい場合は、 `Stripe` オブジェクトに `PaymentSheetEventsEnum.Completed` リスナーを追加する必要があります。

```ts
// be able to get event of PaymentSheet
Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
  console.log('PaymentSheetEventsEnum.Completed');
});
```

使用できるイベント名は `PaymentSheetEventsEnum` です。

!::PaymentSheetEventsEnum::

## 📖 Reference
詳しくはStripeのドキュメントをご覧ください。このプラグインはラッパーなので、詳しい情報はStripeのドキュメンテーションが役立ちます。

### 支払いを受け付ける(iOS)
このプラグインの PaymentSheet は `pod 'Stripe'` を利用しています。

https://stripe.com/docs/payments/accept-a-payment?platform=ios

### 支払いを受け付ける(Android)
このプラグインの PaymentSheet は`com.stripe:stripe-android` を利用しています。

https://stripe.com/docs/payments/accept-a-payment?platform=android
