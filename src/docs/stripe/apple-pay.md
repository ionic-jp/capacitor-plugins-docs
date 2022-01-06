---
title: "ApplePay"
code: ["/docs/stripe/apple-pay/apple-pay.ts.md"]
scrollActiveLine: [
{id: "", activeLine: {}},
{id: "1.-isapplepayavailable", activeLine: {['apple-pay.ts']: [3, 8]}},
{id: "2.-createapplepay", activeLine: {['apple-pay.ts']: [13, 26]}},
{id: "3.-presentapplepay", activeLine: {['apple-pay.ts']: [26, 33]}},
{id: "4.-addlistener", activeLine: {['apple-pay.ts']: [8, 13]}}
]
---


With Apple Pay, you can make instant payments in a single flow. Please check settings:

https://stripe.com/docs/apple-pay

## 🐾 Implements Guide
### Prepare settings
For using Apple Pay, you need some settings.

- Register for an Apple Merchant ID
- Create a new Apple Pay certificate
- Integrate with Xcode

Detail information is here: 

https://stripe.com/docs/apple-pay#merchantid

If these are not done correctly and are different from the options given to `createApplePay`, this method will not be able to run.

### 1. isApplePayAvailable
First, you should check to be able to use Apple Pay on device.

```ts
import { Stripe, ApplePayEventsEnum } from '@capacitor-community/stripe';

(async() => {
  // Check to be able to use Apple Pay on device
  const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use Google Pay
    return;
  }
})();
```

This method return `resolve(): void` or `reject('Not implemented on Device.')`.

!::isApplePayAvailable::


### 2. createApplePay

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.

Stripe provide how to implement backend:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

After that, you set these key to `createApplePay` method.

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


You can use options of `CreateApplePayOption` on `createApplePay`. `merchantIdentifier`  must be the same as the value registered in [Apple Developer Website](https://developer.apple.com/account/resources/identifiers/add/merchant).

!::CreateApplePayOption::

### 3. presentApplePay

present in `createApplePay` is single flow. You don't need to confirm method.

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

`ApplePayResultInterface` is created from Enum of `ApplePayEventsEnum`. So you should import and check result.

!::ApplePayResultInterface::

### 4. addListener

Method of Apple Pay notify any listeners. If you want to get event of payment process is 'Completed', you should add `ApplePayEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of Apple Pay
Stripe.addListener(ApplePayEventsEnum.Completed, () => {
  console.log('ApplePayEventsEnum.Completed');
});
```

The event name you can use is `ApplePayEventsEnum`.

!::ApplePayEventsEnum::


## 📖 Reference
See the Stripe Documentation for more information. This plugin is wrapper, so there information seems useful for you.

### Apple Pay(iOS)
This plugin use STPApplePayContext on `pod 'Stripe'`:

https://stripe.com/docs/apple-pay
