---
file: "google-pay.ts"
---

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

export async function present(): Promise<void> {
  const result = await Stripe.presentApplePay();
}
```
