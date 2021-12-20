---
file: "payment-flow.ts"
---

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

export async function present(): Promise<void> {
  const result = await Stripe.presentPaymentFlow();
  console.log(result); // { cardNumber: "●●●● ●●●● ●●●● ****" }
}

export async function present(): Promise<void> {
  const result = await Stripe.confirmPaymentFlow();
}
```
