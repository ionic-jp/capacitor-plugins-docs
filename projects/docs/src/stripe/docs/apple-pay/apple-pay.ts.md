---
file: "apple-pay.ts"
---

```ts
import { firstValueFrom } from 'rxjs';
import { ApplePayEventsEnum, Stripe } from '@capacitor-community/stripe';

(async () => {
  try {
    await Stripe.isApplePayAvailable();
  } catch {
    return;
  }

  Stripe.addListener(ApplePayEventsEnum.Completed, () => {
    console.log('ApplePayEventsEnum.Completed');
  });

  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await firstValueFrom(this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'intent', {}));

  // Prepare Apple Pay
  await Stripe.createApplePay({
    paymentIntentClientSecret: paymentIntent,
    paymentSummaryItems: [{
      label: 'Product Name',
      amount: 1099.00
    }],
    merchantIdentifier: 'merchant.com.getcapacitor.stripe',
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
