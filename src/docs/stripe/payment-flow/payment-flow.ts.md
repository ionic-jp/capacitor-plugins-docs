---
file: "payment-flow.ts"
---

```ts
import { Stripe, PaymentFlowEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // be able to get event of PaymentFlow
  Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
    console.log('PaymentFlowEventsEnum.Completed');
  });
  
  // Connect to your backend endpoint, and get every key.
  const {paymentIntent, ephemeralKey, customer} = await this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare PaymentFlow with CreatePaymentFlowOption.
  Stripe.createPaymentFlow({
    paymentIntentClientSecret: paymentIntent,
    // setupIntentClientSecret: setupIntent,
    customerEphemeralKeySecret: ephemeralKey,
    customerId: customer,
  });

  // Present PaymentFlow. **Not completed yet.**
  const presentResult = await Stripe.presentPaymentFlow();
  console.log(result); // { cardNumber: "●●●● ●●●● ●●●● ****" }

  // Confirm PaymentFlow. Completed.
  const confirmResult = await Stripe.confirmPaymentFlow();
  if (result.paymentResult === PaymentFlowEventsEnum.Completed) {
    // Happy path
  }
})();
　
```
