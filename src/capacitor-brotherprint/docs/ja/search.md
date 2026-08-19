---
title: Search
code: []
scrollActiveLine: []
---

Search は近くの Brother プリンターを探します。結果は [Events](/docs/events) の `onPrinterAvailable` で届きます。[インストール](/docs/readme#インストール) のあとで呼び出します。

## search

戻り値は `void` です。プリンターはイベントから集めます。

```typescript
import { BrotherPrint, BRLMPrinterPort } from '@rdlabo/capacitor-brotherprint';

await BrotherPrint.search({
  port: BRLMPrinterPort.wifi,
  searchDuration: 15, // seconds
});
```

`searchDuration` は `wifi` と `bluetoothLowEnergy` で使います。`usb` は Android のみです。見つからない場合はエラーにはならず、プリンターも届きません。シグネチャは [API](/docs/api#brlmsearchoption) ページにあります。

## isChannelAvailable

最後の `BRLMChannelResult` を保存している場合、[Print](/docs/print) の前にそのチャネルがまだ使えるかを確認できます。

```typescript
import { BrotherPrint } from '@rdlabo/capacitor-brotherprint';
import type { BRLMChannelResult } from '@rdlabo/capacitor-brotherprint';

const checkChannel = async (lastPrinter: BRLMChannelResult) => {
  const { result } = await BrotherPrint.isChannelAvailable(lastPrinter);
  if (!result) {
    await BrotherPrint.search({
      port: lastPrinter.port,
      searchDuration: 15,
    });
  }
};
```

シグネチャは [API](/docs/api#ischannelavailableresult) ページにあります。

## cancelSearchWiFiPrinter / cancelSearchBluetoothPrinter

探索はもともとタイムアウトします。複数の `search` `port` を同時に走らせ、片方だけ自分で止めたいとき使います。

```typescript
import { BrotherPrint } from '@rdlabo/capacitor-brotherprint';

await BrotherPrint.cancelSearchWiFiPrinter();
await BrotherPrint.cancelSearchBluetoothPrinter();
```
