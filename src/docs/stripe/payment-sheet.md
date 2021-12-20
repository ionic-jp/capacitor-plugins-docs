---
title: "PaymentSheet"
code: []
scrollActiveLine: []
---

With PaymentSheet, you can make instant payments in a single flow.

## 1. createPaymentSheet

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.
Backend structure is here: https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

```ts
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

export async function createPaymentSheet(): Promise<void> {
  /**
   * Connect to your backend endpoint, and get every key.
   */
  const { paymentIntent, ephemeralKey, customer } = await this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);
  
  Stripe.createPaymentSheet({
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    // merchantDisplayName: 'Your App Name or Company Name',
    // customerEphemeralKeySecret: ephemeralKey,
    // style: 'alwaysDark',
  });
}
```


## 2. presentPaymentSheet

present in `PaymentSheet` is single flow. You don't need to confirm method.

```ts
export async function present(): Promise<void> {
  const result = await Stripe.presentPaymentSheet();
}
```
