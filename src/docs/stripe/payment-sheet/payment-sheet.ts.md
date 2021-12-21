---
file: "payment-sheet.ts"
---

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

export async function present(): Promise<void> {
  const result = await Stripe.presentPaymentSheet();
}
```
