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

With PaymentSheet, you can make payments in a single flow. As soon as the User presses the payment button, the payment is completed. (If you want user have some flow after that, please use `paymentFlow` method)

[![Image from Gyazo](https://i.gyazo.com/4356878ec43a90178ec3d831d6b47b10.gif)](https://gyazo.com/4356878ec43a90178ec3d831d6b47b10)

This method require `PaymentIntent`. Don't know what `PaymentIntent` is? Learn it first at the official Stripe website.

__PaymentIntent:__
https://stripe.com/docs/payments/payment-intents

This guide will show you an easy way to make instant payments.

## 🐾 Implements Guide
### 1. createPaymentSheet

This method is settings for PaymentSheet. Before use, you should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you will use `HTTPClient` , `Axios` , `Ajax` , and so on. Here is example of Angular HttpClient. This method will get `paymentIntent`, `ephemeralKey`, and `ephemeralKey`.

Stripe provide how to implement backend:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

After that, you set these key to `createPaymentSheet` method.

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

You can use options of `CreatePaymentSheetOption` on `createPaymentSheet`.

!::createPaymentSheet::

Props `paymentIntentClientSecret`, `customerId`, `customerEphemeralKeySecret` are __required__. And be able to [set style](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-flowcontroller) `alwaysLight` or `alwaysDark`, prepare [Apple Pay](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-apple-pay) and [GooglePay](https://stripe.com/docs/payments/accept-a-payment?platform=android&ui=payment-sheet#android-google-pay) on PaymentSheet.

!::CreatePaymentSheetOption::

### 2. presentPaymentSheet

When you do `presentPaymentSheet` method, plugin present PaymentSheet and get result. This method must do after `createPaymentSheet`.

```ts
(async () => {
  // present PaymentSheet and get result.
  const result = await Stripe.presentPaymentSheet();
  if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
    // Happy path
  }
})();
```

You can get `PaymentSheetResultInterface` from `presentPaymentSheet`.

!::presentPaymentSheet::

`PaymentSheetResultInterface` is created from Enum of `PaymentSheetEventsEnum`. So you should import and check result.

!::PaymentSheetResultInterface::

### 3. addListener

Method of PaymentSheet notify any listeners. If you want to get event of payment process is 'Completed', you should add `PaymentSheetEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of PaymentSheet
Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
  console.log('PaymentSheetEventsEnum.Completed');
});
```

The event name you can use is `PaymentSheetEventsEnum`.

!::PaymentSheetEventsEnum::

## 📖 Reference
See the Stripe Documentation for more information. This plugin is wrapper, so there information seems useful for you.

### Accept a payment(iOS)
This plugin use PaymentSheet on `pod 'Stripe'`:

https://stripe.com/docs/payments/accept-a-payment?platform=ios

### Accept a payment(Android)
This plugin use PaymentSheet on `com.stripe:stripe-android`:

https://stripe.com/docs/payments/accept-a-payment?platform=android
