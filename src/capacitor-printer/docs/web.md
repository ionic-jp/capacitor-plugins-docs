---
title: 'Web'
code: []
scrollActiveLine: []
---

# Web

Present the system print UI for the current WebView content. Only Android and iOS. Call this after [Installation](/docs/readme#installation). Print a PDF or other file with [PDF](/docs/pdf).

```ts
import { Printer } from '@rdlabo/capacitor-printer';

await Printer.printWebView({ name: 'Document' });
```

`name` is the print job name and defaults to `'Document'`.

<!-- !::printWebView:: -->

<!-- !::PrintWebViewOptions:: -->
