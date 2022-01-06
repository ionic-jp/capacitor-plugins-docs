---
file: "apple-pay.ts"
---

```ts
import { Stripe, ApplePayEventsEnum } from '@capacitor-community/stripe';

(async() => {
  // Check to be able to use Apple Pay on device
  const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use Google Pay
    return;
  }

  // be able to get event of Apple Pay
  Stripe.addListener(ApplePayEventsEnum.Completed, () => {
    console.log('ApplePayEventsEnum.Completed');
  });
  
  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare Apple Pay
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

  // Present Apple Pay
  const result = await Stripe.presentApplePay();
  if (result.paymentResult === ApplePayEventsEnum.Completed) {
    // Happy path
  }
})();
　
```
