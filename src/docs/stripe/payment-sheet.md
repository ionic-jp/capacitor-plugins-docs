---
title: "PaymentSheet"
code: ["/docs/stripe/payment-sheet/payment-sheet.ts.md"]
scrollActiveLine: []
---

With PaymentSheet, you can make payments in a single flow. As soon as the User presses the payment button, the payment is completed. (If you want user have some flow after that, please use `paymentFlow` method)

This method can be used for both immediate payment with `PaymentIntent`, and recurring payments with `SetupIntent`.

Don't know what these Intent is? Learn it first at the official Stripe website.

---

- PaymentIntent: [stripe.com/docs/payments/payment-intents](https://stripe.com/docs/payments/payment-intents)
- SetupIntent: [stripe.com/docs/payments/save-and-reuse](https://stripe.com/docs/payments/save-and-reuse?platform=web)

---

This guide will show you an easy way to make instant payments.

## 1. createPaymentSheet

This method is settings for PaymentSheet. You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you will use `HTTPClient` , `Axios` , `Ajax` , and so on. Here is example of Angular HttpClient. This method can get `paymentIntent`, `ephemeralKey`, and `ephemeralKey`.

After that, you set these key to `createPaymentSheet` method.

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
    customerEphemeralKeySecret: ephemeralKey,
  });
}
```

## 2. presentPaymentSheet

When you do `presentPaymentSheet` method, plugin present PaymentSheet and get result.

```ts
export async function present(): Promise<void> {
  const result = await Stripe.presentPaymentSheet();
}
```
