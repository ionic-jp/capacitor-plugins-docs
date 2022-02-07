---
title: "Initialize to your project"
code: []
scrollActiveLine: []
---

First, you will import `Stripe` object from `@capacitor-community/stripe`. After that, you should do `initialize` method with `StripeInitializationOptions`. `StripeInitializationOptions` require your publishableKey.

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

Don't you have the publishableKey? If so, first register as a member and acquire it.

https://dashboard.stripe.com/register


## Example

These are implementation examples of each JavaScript framework.

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

### React

When we are using the `CapacitorStripeProvider` component, we don't have to initialize manually.