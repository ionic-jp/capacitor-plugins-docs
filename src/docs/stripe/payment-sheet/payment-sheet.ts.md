---
file: "payment-sheet.ts"
---

```ts
import { Stripe, PaymentSheetEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // be able to get event of PaymentSheet
  Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
    console.log('PaymentSheetEventsEnum.Completed');
  });
  
  // Connect to your backend endpoint, and get every key.
  const { paymentIntent, ephemeralKey, customer } = await this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

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