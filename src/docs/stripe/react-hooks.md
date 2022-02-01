---
title: "Use React Hooks"
code: []
scrollActiveLine: []
---

Since v3.5.0, `@capacitor-community/plugin` has React Hooks. You can use `CapacitorStripeProvider` instead of `Stripe` Object:

```diff tsx: App.tsx 
import { CapacitorStripeProvider } from '@capacitor-community/stripe/dist/esm/react/provider';

const App: React.FC = () => (
  <CapacitorStripeProvider
    publishableKey="Your Publishable Key"
    fallback={<p>Loading...</p>}
  >
    <IonApp>
    ...
    </IonApp>
  </CapacitorStripeProvider>
);

export default App;
```
:::message
If you use typescript@4.5, you can write:
`import { useCapacitorStripe } from '@capacitor-community/stripe/react';`
:::

After that, you can get these values from `useCapacitorStripe`.

```ts
import { useCapacitorStripe } from '@capacitor-community/stripe/dist/esm/react/provider';

export const PaymentSheet: React.FC = () => {
  const { stripe, isApplePayAvailable, isGooglePayAvailable } = useCapacitorStripe();
...
}
```

!::CapacitorStripeContext::

This `stripe` Object is instead of `Stripe` object from `@capacitor-community/stripe` method. So if you want use `createPaymentSheet` method, you can write:

```ts
const { stripe } = useCapacitorStripe();
await stripe.createPaymentSheet({
  ...
})
```

Of course, You can write without React Hooks. Are you interested in using React Hooks? So please check demo code:
https://github.com/capacitor-community/stripe/tree/master/demo/react