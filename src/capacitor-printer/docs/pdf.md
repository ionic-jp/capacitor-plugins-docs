---
title: 'PDF'
code: []
scrollActiveLine: []
---

# PDF

Present the system print UI for a PDF or other file. Only Android and iOS. Call this after [Installation](/docs/readme#installation). Print the current WebView with [Web](/docs/web).

```ts
import { Printer } from '@rdlabo/capacitor-printer';

const filePath = '/path/to/document.pdf';

try {
  await Printer.printFile({ path: filePath });
} finally {
  // The promise settles after the OS no longer needs the source file.
}
```

Android supports file paths, `file://` URLs, and `content://` URLs. iOS supports file paths and local `file://` URLs. `mimeType` is Android-only.

<!-- !::printFile:: -->

<!-- !::PrintFileOptions:: -->
