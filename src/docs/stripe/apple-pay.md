---
title: "ApplePay"
code: []
scrollActiveLine: []
---


With Apple Pay, you can make instant payments in a single flow. Please check settings: https://stripe.com/docs/apple-pay#merchantid

## 1. createApplePay

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.
Backend structure is here: https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

```ts
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

export async function createApplePay(): Promise<void> {
  /**
   * Connect to your backend endpoint, and get every key.
   */
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

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
}
```

## 2. presentApplePay

present in `createApplePay` is single flow. You don't need to confirm method.

```ts
export async function present(): Promise<void> {
  const result = await Stripe.presentApplePay();
}
```