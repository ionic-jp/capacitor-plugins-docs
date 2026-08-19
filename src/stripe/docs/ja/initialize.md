---
title: "プロジェクトで初期化する"
code: []
scrollActiveLine: []
---

`Stripe` をインポートし、[公開可能キー](https://dashboard.stripe.com/apikeys)を指定して `initialize` を呼び出します。JavaScript ランタイムごとに一度、支払い UI を作成・表示する前に実行してください。

```ts
import { Stripe } from '@capacitor-community/stripe';

export async function initialize(): Promise<void> {
  await Stripe.initialize({
    publishableKey: 'Your Publishable Key',
  });
}
```

!::initialize::
!::StripeInitializationOptions::

[Stripe Dashboard](https://dashboard.stripe.com/register) で公開可能キーを作成します。シークレットキーをクライアントへ配布してはいけません。

## Stripe Connect

[連結アカウント](https://stripe.com/docs/connect/authentication)に対してプラグイン API を呼び出すには、任意の `stripeAccount` を設定します。

```ts
await Stripe.initialize({
  publishableKey: 'Your Publishable Key',
  stripeAccount: 'acct_xxxxxxxxxxxxx',
});
```

Android の Google Pay は、アプリケーションメタデータの `com.getcapacitor.community.stripe.stripe_account` も読み取れます。[Google Pay](/docs/google-pay)を参照してください。

## handleURLCallback

`handleURLCallback` は iOS 専用です。PaymentSheet または PaymentFlow の `returnURL` と組み合わせ、利用者が銀行ページから戻った後に Stripe が [3D Secure](https://stripe.com/docs/payments/3d-secure#return-url) を完了できるようにします。

```ts
await Stripe.createPaymentSheet({
  paymentIntentClientSecret,
  returnURL: 'your-app://stripe-redirect',
});

// iOS の URL オープンハンドラーから、返された URL を渡して呼び出します。
await Stripe.handleURLCallback({ url });
```

!::handleURLCallback::
!::StripeURLHandlingOptions::

このメソッドは Android と Web では未実装です。Stripe が URL を処理しなかった場合、Promise は拒否されるため、通常のディープリンク処理を続けてください。

## 使用例

### Angular

ルートコンポーネントから初期化します。[Angular](/docs/angular)を参照してください。

```ts:src/app/app.component.ts
import { Component } from '@angular/core';
import { Stripe } from '@capacitor-community/stripe';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    void Stripe.initialize({
      publishableKey: 'Your Publishable Key',
    });
  }
}
```

### React

`CapacitorStripeProvider` がプラグインを初期化します。[React](/docs/react)を参照してください。
