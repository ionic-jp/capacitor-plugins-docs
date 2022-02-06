---
title: "React Quick start"
code: []
scrollActiveLine: []
---

We can use `CapacitorStripeProvider` to initialize this plugin:

:::message
If you are using the `v3.4.x` or older, please upgrade the `@capacitor/stripe` to newer than `v3.5.0`.
:::

```tsx: App.tsx 
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

## Use the Stripe client

We can get the initialized Stripe client by using the `useCapacitorStripe`. hook.

```ts
import { useCapacitorStripe } from '@capacitor-community/stripe/dist/esm/react/provider';

export const PaymentSheet: React.FC = () => {
  const { stripe } = useCapacitorStripe();
...
}
```


This `stripe` Object is instead of `Stripe` object from `@capacitor-community/stripe` method. So if you want use `createPaymentSheet` method, you can write:

```tsx
export const PaymentSheet: React.FC = () => {
  const { stripe } = useCapacitorStripe();
  return (
    <button onClick={async () => {
      await stripe.createPaymentSheet({
        ...
      })
    }}>
      Pay
    </button>
  )
}
```

Of course, You can write without React Hooks. Are you interested in using React Hooks? So please check demo code:
https://github.com/capacitor-community/stripe/tree/master/demo/react

## Hook API
### `useCapacitorStripe` 

!::CapacitorStripeContext::