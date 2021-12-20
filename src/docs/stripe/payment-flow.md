---
title: "PaymentFlow"
code: []
scrollActiveLine: []
---

With PaymentFlow, you can make payments in two steps flow. And you can use setupIntent.

## 1.  createPaymentFlow

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.
Backend structure is here: https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

You will need to prepare either paymentIntentClientSecret or setupIntentClientSecret and set it in the method.

```ts
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

export async function create(): Promise<void> {
  /**
   * Connect to your backend endpoint, and get every key.
   */
  const { paymentIntent, ephemeralKey, customer } = await this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);
  
  Stripe.createPaymentFlow({
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    // setupIntentClientSecret: setupIntent,
    // merchantDisplayName: 'Your App Name or Company Name',
    // customerEphemeralKeySecret: ephemeralKey,
    // style: 'alwaysDark',
  });
}
```

## 2. presentPaymentFlow

present in `presentPaymentFlow` is not submit method. You need to confirm method.

```ts
export async function present(): Promise<void> {
  const result = await Stripe.presentPaymentFlow();
  console.log(result); // { cardNumber: "●●●● ●●●● ●●●● ****" }
}
```

## 3. confirmPaymentFlow

```ts
export async function present(): Promise<void> {
  const result = await Stripe.confirmPaymentFlow();
}
```