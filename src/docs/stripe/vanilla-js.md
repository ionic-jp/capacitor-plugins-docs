---
title: "Vanila JS Quick start"
code: []
scrollActiveLine: []
---

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

https://stenciljs.com/docs/overview