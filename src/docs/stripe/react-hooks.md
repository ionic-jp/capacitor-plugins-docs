---
title: "React Hooksを使う"
code: []
scrollActiveLine: []
---

v3.5.0から `@capacitor-community/plugin` にReact Hooksが追加されました。`Stripe` オブジェクトの代わりに `CapacitorStripeProvider` を使用することができます:

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
もし利用しているのがtypescript@4.5以上の場合、次のように書くことができます:
`import { useCapacitorStripe } from '@capacitor-community/stripe/react';`
:::

その後、これらの値を `useCapacitorStripe` から取得することができます。

```ts
import { useCapacitorStripe } from '@capacitor-community/stripe/dist/esm/react/provider';

export const PaymentSheet: React.FC = () => {
  const { stripe, isApplePayAvailable, isGooglePayAvailable } = useCapacitorStripe();
...
}
```

!::CapacitorStripeContext::

この `stripe` オブジェクトは `@capacitor-community/stripe` メソッドの `Stripe` オブジェクトの代わりとなるものです。したがって、`createPaymentSheet`メソッドを使用したい場合は、次のように記述します。

```ts
const { stripe } = useCapacitorStripe();
await stripe.createPaymentSheet({
  ...
})
```

もちろん、React Hooksがなくても書くことはできます。React Hooksを使った記法に興味がありますか？その場合、ぜひデモコードをご覧ください:
https://github.com/capacitor-community/stripe/tree/master/demo/react