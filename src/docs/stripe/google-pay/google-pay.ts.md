---
file: "google-pay.ts"
---

```ts
import { Stripe, GooglePayEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Check to be able to use GooglePay on device
  const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use GooglePay
    return;
  }
  
  Stripe.addListener(GooglePayEventsEnum.Completed, () => {
    console.log('GooglePayEventsEnum.Completed');
  });
  
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
