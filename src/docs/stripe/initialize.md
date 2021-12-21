---
title: "Initialize to your project"
code: []
scrollActiveLine: []
---

You can import `Stripe` object from `@capacitor-community/stripe`. After that, you should do initialize method with your publishableKey. 

```diff ts
+ import { Stripe } from '@capacitor-community/stripe';

+ export async function initialize(): Promise<void> {
+   Stripe.initialize({
+     publishableKey: "Your Publishable Key",
+   });
+ }
```

Don't you have the key? In that case, first register as a member and acquire it.

https://dashboard.stripe.com/register

## Example: Each JavaScript Framework

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