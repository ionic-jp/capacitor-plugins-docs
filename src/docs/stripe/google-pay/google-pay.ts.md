---
file: "google-pay.ts"
---

```ts
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

export async function createGooglePay(): Promise<void> {
  /**
   * Connect to your backend endpoint, and get every key.
   */
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,
  });
}

export async function present(): Promise<void> {
  const result = await Stripe.presentApplePay();
}
```
