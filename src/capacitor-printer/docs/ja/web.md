---
title: Web
code: []
scrollActiveLine: []
---

現在の WebView 内容のシステム印刷 UI を出します。Android と iOS のみです。[インストール](/docs/readme#インストール) のあとで呼び出します。PDF などのファイルを印刷する場合は [PDF](/docs/pdf) です。

```ts
import { Printer } from '@rdlabo/capacitor-printer';

await Printer.printWebView({ name: 'Document' });
```

`name` は印刷ジョブ名で、既定値は `'Document'` です。シグネチャは [API](/docs/api#printwebview) ページにあります。
