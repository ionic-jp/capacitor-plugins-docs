---
title: "Configuration platform"
code: []
scrollActiveLine: []
---

No special settings are required to install the plugin. Just install it from npm like any other plugin, and run `sync`.

```bash
npm install @capacitor-community/stripe
npx cap sync
```

## Android configuration

In file `android/app/src/main/java/**/**/MainActivity.java`, add the plugin to the initialization list:

```diff java:android/app/src/main/java/**/**/MainActivity.java
  package io.ionic.starter;

  import android.os.Bundle;
+ import com.getcapacitor.BridgeActivity;

  public class MainActivity extends BridgeActivity {
+     @Override
+     public void onCreate(Bundle savedInstanceState) {
+         super.onCreate(savedInstanceState);
+         registerPlugin(com.getcapacitor.community.stripe.StripePlugin.class);
+     }
  }
```

## iOS configuration

In iOS, the plugin will be loaded automatically without any configuration.


## Web configuration

:::message
This feature is experimental. Please tested and feedback. If you want to contribute UI, Animation or create issue, move to https://github.com/stripe-elements/stripe-elements .
:::

If we are using anything other than React, we need to install the UI element library.
If using React, we don't have to install it because the `CapacitorStripeProvider` component bundles this library.

```bash
npm install @stripe-elements/stripe-elements
```

### Vanilla JS

And `defineCustomElements()` called once during the bootstrapping of your application.

```diff ts
+ import { defineCustomElements } from '@stripe-elements/stripe-elements/loader';
+ defineCustomElements();
```

`@stripe-elements/stripe-elements` is created with StencilJS. If you can't understand where defined, please check these docs:

https://stenciljs.com/docs/overview

### Angular

```diff ts:src/main.ts
  import { enableProdMode } from '@angular/core';
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  import { AppModule } from './app/app.module';
  import { environment } from './environments/environment';

+ import { defineCustomElements } from '@stripe-elements/stripe-elements/loader';

  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
+   .then(() => defineCustomElements(window))
    .catch(err => console.log(err));
```

### React

Nothing.