---
title: PDF
code: []
scrollActiveLine: []
---

PDF などのファイルのシステム印刷 UI を出します。Android と iOS のみです。[インストール](/docs/readme#インストール) のあとで呼び出します。現在の WebView を印刷する場合は [Web](/docs/web) です。

```ts
import { Printer } from '@rdlabo/capacitor-printer';

const filePath = '/path/to/document.pdf';

try {
  await Printer.printFile({ path: filePath });
} finally {
  // The promise settles after the OS no longer needs the source file.
}
```

Android はファイルパス、`file://` URL、`content://` URL に対応します。iOS はファイルパスとローカル `file://` URL です。`mimeType` は Android のみです。シグネチャは [API](/docs/api#printfile) ページにあります。
