---
title: Print
code: []
scrollActiveLine: []
---

`printImage` は base64 画像を Brother プリンターへ送ります。[インストール](/docs/readme#インストール) のあとで呼び出します。プリンターの探索は [Search](/docs/search)、印刷結果は [Events](/docs/events) です。

```typescript
import {
  BrotherPrint,
  BRLMPrinterLabelName,
  BRLMPrinterModelName,
  BRLMPrinterPort,
} from '@rdlabo/capacitor-brotherprint';
import type { BRLMPrintOptions } from '@rdlabo/capacitor-brotherprint';

const printImage = async () => {
  const options: BRLMPrintOptions = {
    modelName: BRLMPrinterModelName.QL_820NWB,
    labelName: BRLMPrinterLabelName.RollW62,
    encodedImage: 'base64 removed mime-type',
    numberOfCopies: 1,
    autoCut: true,
    port: BRLMPrinterPort.wifi,
    channelInfo: '192.168.0.10',
  };

  await BrotherPrint.printImage(options);
};
```

`port` と `channelInfo` は `onPrinterAvailable` の結果から取ります。完全なページはデモを見てください:

https://github.com/rdlabo-dev/capacitor-brotherprint/blob/v8.1.1/demo/src/app/home/home.page.ts

!::printImage::

!::BRLMPrintOptions::
