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

In ios, the plugin will be loaded automatically without any configuration.


## Web configuration

:::message
This feature is experimental. Please tested and feedback. If you want to contribute UI, Animation or create issue, move to https://github.com/stripe-elements/stripe-elements .
:::

```bash
npm install @stripe-elements/stripe-elements
```

And `defineCustomElements()` called once during the bootstrapping of your application.

```diff ts
+ import { defineCustomElements } from '@stripe-elements/stripe-elements/loader';
+ defineCustomElements();
```

`@stripe-elements/stripe-elements` is created with StencilJS. If you can't understand where defined, please check these docs:

- Angular: https://stenciljs.com/docs/angular/
- React: https://stenciljs.com/docs/react
- Vue: https://stenciljs.com/docs/vue