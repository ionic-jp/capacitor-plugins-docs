---
title: "PaymentFlow"
code: ["/docs/stripe/payment-flow/payment-flow.ts.md"]
scrollActiveLine: [
  {id: "", activeLine: {}},
  {id: "1.-createpaymentflow", activeLine: {['payment-flow.ts']: [7, 16]}},
  {id: "2.-presentpaymentflow", activeLine: {['payment-flow.ts']: [16, 20]}},
  {id: "3.-confirmpaymentflow", activeLine: {['payment-flow.ts']: [20, 25]}},
  {id: "4.-addlistener", activeLine: {['payment-flow.ts']: [3, 6]}}
]
---

With PaymentFlow, you can make payments in two steps flow. When the user presses the submit button, the system only gets the card information, and puts it in a pending state. After that, when the program executes the confirmation method, the payment is executed. In most cases, it is used in a flow that is interrupted by a final confirmation screen.

This method can be used for both immediate payment with `PaymentIntent`, and future payments with `SetupIntent`.

Don't know what these Intent is? Learn it first at the official Stripe website.

__PaymentIntent:__
https://stripe.com/docs/payments/payment-intents

__SetupIntent:__
https://stripe.com/docs/payments/save-and-reuse?platform=web


## 🐾 Implements
### 1.  createPaymentFlow

This method is settings for PaymentFlow. Before use, you should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you will use `HTTPClient` , `Axios` , `Ajax` , and so on. Here is example of Angular HttpClient. This method will get `paymentIntent`, `ephemeralKey`, and `ephemeralKey`.

Stripe provide how to implement backend:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

After that, you set these key to `createPaymentFlow` method. You will need to prepare either paymentIntentClientSecret or setupIntentClientSecret and set it in the method.

```ts
import { Stripe, PaymentFlowEventsEnum } from '@capacitor-community/stripe';

(async () => {
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
})();
```

You can use options of `CreatePaymentFlowOption` on `createPaymentFlow`.

!::createPaymentFlow::

Props `paymentIntentClientSecret` or `setupIntentClientSecret`, and `customerId`, `customerEphemeralKeySecret` are __required__. And be able to [set style](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-flowcontroller) `alwaysLight` or `alwaysDark`, prepare [ApplePay](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-apple-pay) and [GooglePay](https://stripe.com/docs/payments/accept-a-payment?platform=android&ui=payment-sheet#android-google-pay) on PaymentFlow.

!::CreatePaymentFlowOption::

### 2. presentPaymentFlow

When you do `presentPaymentFlow` method, plugin present PaymentFlow and get card information. This method must do after `createPaymentFlow`.

```ts
(async () => {
  // Present PaymentFlow. **Not completed yet.**
  const presentResult = await Stripe.presentPaymentFlow();
  console.log(result); // { cardNumber: "●●●● ●●●● ●●●● ****" }
})();
```

You can get `{ cardNumber: string; }` from `presentPaymentFlow`.

!::presentPaymentFlow::

In do PaymentSheet, `presentPaymentSheet` method get result. __But in PaymentFlow, `presentPaymentFlow` method is progress.__

### 3. confirmPaymentFlow

```ts
(async () => {
  // Confirm PaymentFlow. Completed.
  const confirmResult = await Stripe.confirmPaymentFlow();
  if (result.paymentResult === PaymentFlowEventsEnum.Completed) {
    // Happy path
  }
})();
```

`PaymentFlowResultInterface` is created from Enum of `PaymentFlowEventsEnum`. So you should import and check result.

!::PaymentFlowResultInterface::

### 4. addListener

Method of PaymentFlow notify any listeners. If you want to get event of payment process is 'Completed', you should add `PaymentFlowEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of PaymentFlow
Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
  console.log('PaymentFlowEventsEnum.Completed');
});
```

The event name you can use is `PaymentFlowEventsEnum`.

!::PaymentFlowEventsEnum::

## 📖 Reference
See the Stripe Documentation for more information. This plugin is wrapper, so there information seems useful for you.

### Complete the payment in your own UI(iOS)
This plugin use PaymentSheet.FlowController on `pod 'Stripe'`:

https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#ios-flowcontroller

### Complete the payment in your own UI(Android)
This plugin use PaymentSheet.FlowController on `com.stripe:stripe-android`:

https://stripe.com/docs/payments/accept-a-payment?platform=android&ui=payment-sheet#android-flowcontroller
