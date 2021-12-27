---
file: "apple-pay.ts"
---

```ts
import { Stripe, ApplePayEventsEnum } from '@capacitor-community/stripe';

(async() => {
  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare ApplePay
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

  // Present ApplePay
  const result = await Stripe.presentApplePay();
  if (result.paymentResult === ApplePayEventsEnum.Completed) {
    // Happy path
  }
})();
　
```
