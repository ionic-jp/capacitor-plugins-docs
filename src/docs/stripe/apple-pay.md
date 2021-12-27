---
title: "ApplePay"
code: ["/docs/stripe/apple-pay/apple-pay.ts.md"]
scrollActiveLine: []
---


With ApplePay, you can make instant payments in a single flow. Please check settings:

https://stripe.com/docs/apple-pay#merchantid

## 🐾 Implements
### 1. createApplePay

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.

Stripe provide how to implement backend:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

After that, you set these key to `createApplePay` method.

```ts
import { Stripe, ApplePayEventsEnum } from '@capacitor-community/stripe';

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


You can use options of `CreateApplePayOption` on `createApplePay`. `merchantIdentifier`  must be the same as the value registered in [Apple Developer Website](https://developer.apple.com/account/resources/identifiers/add/merchant).

!::CreateApplePayOption::

### 2. presentApplePay

present in `createApplePay` is single flow. You don't need to confirm method.

```ts
(async() => {
  // Present ApplePay
  const result = await Stripe.presentApplePay();
  if (result.paymentResult === ApplePayEventsEnum.Completed) {
    // Happy path
  }
})();
```

!::presentApplePay::

`ApplePayResultInterface` is created from Enum of `ApplePayEventsEnum`. So you should import and check result.

!::ApplePayResultInterface::

### 3. addListener

Method of ApplePay notify any listeners. If you want to get event of payment process is 'Completed', you should add `ApplePayEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of PaymentSheet
Stripe.addListener(ApplePayEventsEnum.Completed, () => {
  console.log('ApplePayEventsEnum.Completed');
});
```

The event name you can use is `ApplePayEventsEnum`.

!::ApplePayEventsEnum::


## 📖 Reference
See the Stripe Documentation for more information. This plugin is wrapper, so there information seems useful for you.

### ApplePay(iOS)
This plugin use STPApplePayContext on `pod 'Stripe'`:

https://stripe.com/docs/apple-pay
