---
file: "payment-sheet.ts"
---

```ts
import { firstValueFrom } from 'rxjs';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

(async () => {
  Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
    console.log('PaymentSheetEventsEnum.Completed');
  });

  // Connect to your backend endpoint, and get every key.
  const { paymentIntent, ephemeralKey, customer } = await firstValueFrom(this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'intent', {}));

  // prepare PaymentSheet with CreatePaymentSheetOption.
  await Stripe.createPaymentSheet({
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
  });

  // present PaymentSheet and get result.
  const result = await Stripe.presentPaymentSheet();
  if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
    // Happy path
  }
})();
```
