---
file: "google-pay.ts"
---

```ts
import { firstValueFrom } from 'rxjs';
import { GooglePayEventsEnum, Stripe } from '@capacitor-community/stripe';

(async () => {
  try {
    await Stripe.isGooglePayAvailable();
  } catch {
    return;
  }

  Stripe.addListener(GooglePayEventsEnum.Completed, () => {
    console.log('GooglePayEventsEnum.Completed');
  });

  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await firstValueFrom(this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'intent', {}));

  // Prepare Google Pay
  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,

    // Web only. Google Pay on Android App doesn't need
    paymentSummaryItems: [{
      label: 'Product Name',
      amount: 1099.00
    }],
    merchantIdentifier: 'merchant.com.getcapacitor.stripe',
    countryCode: 'US',
    currency: 'USD',
  });

  // Present Google Pay
  const result = await Stripe.presentGooglePay();
  if (result.paymentResult === GooglePayEventsEnum.Completed) {
    // Happy path
  }
})();
```
