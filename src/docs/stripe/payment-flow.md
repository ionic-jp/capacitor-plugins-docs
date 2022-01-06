---
title: "PaymentFlow"
code: ["/docs/stripe/payment-flow/payment-flow.ts.md"]
scrollActiveLine: [
  {id: "", activeLine: {}},
  {id: "1.-createpaymentflow", activeLine: {['payment-flow.ts']: [7, 16]}},
  {id: "2.-presentpaymentflow", activeLine: {['payment-flow.ts']: [16, 20]}},
  {id: "3.-confirmpaymentflow", activeLine: {['payment-flow.ts']: [20, 25]}},
  {id: "4.-addlistener", activeLine: {['payment-flow.ts']: [3, 6]}}
]
---

PaymentFlowを使えば、2ステップのフローで決済が可能です。ユーザーが `submit` ボタンを押すと、システムはカード情報のみを取得し、保留状態にします。その後、プログラムが `confirm` メソッドを実行すると、決済が実行されます。多くの場合、クレジットカード情報入力後に最終確認画面が表示されるフローで使用されます。

このメソッドは `PaymentIntent` による即時決済と `SetupIntent` による将来の決済の両方に使用することができます。

これらのIntentが何なのかご存知ないですか？まずはStripeの公式サイトで学んでみてください。

__PaymentIntent:__
https://stripe.com/docs/payments/payment-intents

__SetupIntent:__
https://stripe.com/docs/payments/save-and-reuse?platform=web


## 🐾 Implements
### 1.  createPaymentFlow

このメソッドはPaymentFlowのための設定です。使用する前に、バックエンドのエンドポイントに接続し、それぞれのキーを取得する必要があります。これは、このプラグインには「ない」機能です。そのため、 `HTTPClient` 、 `Axios` 、 `Ajax` などを使用することになります。以下は、AngularのHttpClientの例です。この例では、`paymentIntent`、`ephemeralKey`、`ephemeralKey`を取得しています。

Stripeはバックエンドの実装方法を提供しています:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

その後、これらのキーを `createPaymentFlow` メソッドで利用します。 `paymentIntentClientSecret` または `setupIntentClientSecret` のいずれかを用意し、メソッドに設定する必要があります。

```ts
import { Stripe, PaymentFlowEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Connect to your backend endpoint, and get every key.
  const {paymentIntent, ephemeralKey, customer} = await this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare PaymentFlow with CreatePaymentFlowOption.
  Stripe.createPaymentFlow({
    paymentIntentClientSecret: paymentIntent,
    // setupIntentClientSecret: setupIntent,
    customerEphemeralKeySecret: ephemeralKey,
    customerId: customer,
  });
})();
```

`createPaymentFlow` は `CreatePaymentFlowOption` のオプションを使用することができます。

!::createPaymentFlow::

プロパティ `paymentIntentClientSecret` と `setupIntentClientSecret` のどちらかと、 `customerId`, `customerEphemeralKeySecret` は __必須__ です。また、 [デザインを設定して](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-flowcontroller) `alwaysLight` か `alwaysDark` にすることもできます。 [ApplePay](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-apple-pay) や [GooglePay](https://stripe.com/docs/payments/accept-a-payment?platform=android&ui=payment-sheet#android-google-pay) を PaymentFlowで設定することもできます。

!::CreatePaymentFlowOption::

### 2. presentPaymentFlow

`presentPaymentFlow` メソッドを実行すると、プラグインはPaymentFlowを提示し、結果を取得します。このメソッドは `createPaymentFlow` の後に実行する必要があります。

```ts
(async () => {
  // Present PaymentFlow. **Not completed yet.**
  const presentResult = await Stripe.presentPaymentFlow();
  console.log(result); // { cardNumber: "●●●● ●●●● ●●●● ****" }
})();
```

あなたはユーザが正常に承認した場合、 `presentPaymentFlow` の結果として  `{ cardNumber: string; }` を取得することができます。

!::presentPaymentFlow::

PaymentSheetでは `presentPaymentSheet` メソッドでプロセスが終了します。 __しかしPaymentFlowでは `presentPaymentFlow` メソッドはまだ決済プロセスの途中です。__

### 3. confirmPaymentFlow

```ts
(async () => {
  // Confirm PaymentFlow. Completed.
  const confirmResult = await Stripe.confirmPaymentFlow();
  if (result.paymentResult === PaymentFlowEventsEnum.Completed) {
    // Happy path
  }
})();
```

`PaymentFlowEventsEnum` の返り値から `PaymentFlowResultInterface` を取得することができます。

!::PaymentFlowResultInterface::

### 4. addListener

PaymentFlowのメソッドはリスナーを通知します。もし、支払い処理が完了したときのイベントを取得したい場合は、 `Stripe` オブジェクトに `PaymentFlowEventsEnum.Completed` リスナーを追加する必要があります。

```ts
// be able to get event of PaymentFlow
Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
  console.log('PaymentFlowEventsEnum.Completed');
});
```

使用できるイベント名は `PaymentFlowEventsEnum` にあります。

!::PaymentFlowEventsEnum::

## 📖 Reference
詳しくはStripeのドキュメントをご覧ください。このプラグインはラッパーなので、詳しい情報はStripeのドキュメンテーションが役立ちます。

### 独自のUIで支払いを完了する(iOS)
このプラグインの PaymentSheet は `pod 'Stripe'` を利用しています。

https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-flowcontroller

### 独自のUIで支払いを完了する(Android)
このプラグインの PaymentSheet は`com.stripe:stripe-android` を利用しています。

https://stripe.com/docs/payments/accept-a-payment?platform=android&ui=payment-sheet#android-flowcontroller
