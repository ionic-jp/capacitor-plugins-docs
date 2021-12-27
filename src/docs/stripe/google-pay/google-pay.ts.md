---
file: "google-pay.ts"
---

```ts
import { Stripe, GooglePayEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare GooglePay
  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,
  });

  // Present GooglePay
  const result = await Stripe.presentGooglePay();
  if (result.paymentResult === GooglePayEventsEnum.Completed) {
    // Happy path
  }
})();
```
