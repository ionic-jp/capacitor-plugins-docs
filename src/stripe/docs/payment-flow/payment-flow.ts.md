---
file: "payment-flow.ts"
---

```ts
import { firstValueFrom } from 'rxjs';
import { PaymentFlowEventsEnum, Stripe } from '@capacitor-community/stripe';

(async () => {
  Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
    console.log('PaymentFlowEventsEnum.Completed');
  });

  // Connect to your backend endpoint, and get every key.
  const { paymentIntent, ephemeralKey, customer } = await firstValueFrom(this.http.post<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }>(environment.api + 'intent', {}));

  // Prepare PaymentFlow with CreatePaymentFlowOption.
  await Stripe.createPaymentFlow({
    paymentIntentClientSecret: paymentIntent,
    // setupIntentClientSecret: setupIntent,
    customerEphemeralKeySecret: ephemeralKey,
    customerId: customer,
  });

  // Collect payment details. The Intent is not confirmed yet.
  const presentResult = await Stripe.presentPaymentFlow();
  console.log(presentResult); // { cardNumber: "●●●● ●●●● ●●●● ****" }

  // Confirm PaymentFlow. Completed.
  const confirmResult = await Stripe.confirmPaymentFlow();
  if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
    // Happy path
  }
})();
```
