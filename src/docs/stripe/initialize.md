---
title: "Initialize"
code: []
scrollActiveLine: []
---

まず、 `@capacitor-community/stripe` から `Stripe` をインポートして、そのあと `StripeInitializationOptions` をつかって `initialize` メソッドを実行します。
`StripeInitializationOptions` はあなたの publishableKey が必須で必要です。

```ts
import { Stripe } from '@capacitor-community/stripe';

export async function initialize(): Promise<void> {
  Stripe.initialize({
    publishableKey: "Your Publishable Key",
  });
}
```

!::initialize::

!::StripeInitializationOptions::

publishableKey を持っていませんか？もしその場合、まずStripeでアカウント登録してこれを手に入れる必要があります。

https://dashboard.stripe.com/register


## Example

JavaScriptフレームワークでの実装例をご紹介します。

### Angular

```diff ts: app.component.ts
  import { Component } from '@angular/core';
+ import { Stripe } from '@capacitor-community/stripe';

  @Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
  })
  export class AppComponent {
    constructor() {
+     Stripe.initialize({
+       publishableKey: 'Your Publishable Key',
+     });
    }
  }
```