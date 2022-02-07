---
title: "React Quick start"
code: []
scrollActiveLine: []
---

このプラグインをインストールするために、`CapacitorStripeProvider`を使用することができます:

:::message
もし `v3.4.x` かそれ以下のバージョンを利用してる場合は、 `@capacitor/stripe` を `v3.5.0` 以上の最新版にアップグレードしてください。
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
もし利用しているのがtypescript@4.5以上の場合、次のように書くことができます:
`import { useCapacitorStripe } from '@capacitor-community/stripe/react';`
:::

## Use the Stripe client

`UseCapacitorStripe` hookを使用することで、インストールされたStripeクライアントを取得することができます。

```ts
import { useCapacitorStripe } from '@capacitor-community/stripe/dist/esm/react/provider';

export const PaymentSheet: React.FC = () => {
  const { stripe } = useCapacitorStripe();
...
}
```


この `stripe` オブジェクトは `@capacitor-community/stripe` メソッドの `Stripe` オブジェクトの代わりとなるものです。したがって、`createPaymentSheet`メソッドを使用したい場合は、次のように記述します。

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

もちろん、React Hooksがなくても書くことはできます。React Hooksを使うことに興味があるという方は、デモコードをご覧ください:
https://github.com/capacitor-community/stripe/tree/master/demo/react

## Hook API
### `useCapacitorStripe`

!::CapacitorStripeContext::
