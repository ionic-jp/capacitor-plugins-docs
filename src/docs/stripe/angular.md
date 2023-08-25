---
title: "Angular Quick start"
code: []
scrollActiveLine: []
---

We can initialize this plugin by calling the `Stripe.initialize` method.

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

## Work for Web Browser

:::message
This feature is experimental. Please tested and feedback. If you want to contribute UI, Animation or create issue, move to https://github.com/stripe-elements/stripe-elements .
:::

```bash
npm install stripe-pwa-elements
```

And `defineCustomElements()` called once during the bootstrapping of your application.


```diff ts:src/main.ts
  import { enableProdMode } from '@angular/core';
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  import { AppModule } from './app/app.module';
  import { environment } from './environments/environment';

+ import { defineCustomElements } from 'stripe-pwa-elements/loader';

  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
+   .then(() => defineCustomElements(window))
    .catch(err => console.log(err));
```
