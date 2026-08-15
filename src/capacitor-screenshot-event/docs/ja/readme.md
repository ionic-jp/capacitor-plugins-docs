---
title: '@rdlabo/capacitor-screenshot-event'
---

# @rdlabo/capacitor-screenshot-event

ユーザーがスクリーンショットを撮ったことを通知します

## インストール

```bash
npm install @rdlabo/capacitor-screenshot-event
npx cap sync
```

## 使い方

```ts
import { ScreenshotEvent } from '@rdlabo/capacitor-screenshot-event';

(() => {
  ScreenshotEvent.addListener('userDidTakeScreenshot', () => {
    // Notice take screenshot
  });

  // Start watch take event
  ScreenshotEvent.startWatchEvent();
})();
```

## API

<docgen-index>

* [`startWatchEvent()`](#startwatchevent)
* [`removeWatchEvent()`](#removewatchevent)
* [`addListener('userDidTakeScreenshot', ...)`](#addlisteneruserdidtakescreenshot-)
* [インターフェース](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### startWatchEvent()

```typescript
startWatchEvent() => Promise<void>
```

--------------------


### removeWatchEvent()

```typescript
removeWatchEvent() => Promise<void>
```

--------------------


### addListener('userDidTakeScreenshot', ...)

```typescript
addListener(eventName: 'userDidTakeScreenshot', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

| パラメータ         | 型                                   |
| ------------------ | ------------------------------------ |
| **`eventName`**    | <code>'userDidTakeScreenshot'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>           |

**戻り値:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### インターフェース


#### PluginListenerHandle

| プロパティ   | 型                                        |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

</docgen-api>
