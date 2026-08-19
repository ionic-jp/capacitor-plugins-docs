---
title: Getting Started
code: []
scrollActiveLine: []
---

## Overview

This is strategies of dynamic item size for `@angular/cdk/scrolling`. This allows you set specify each item size in the array to be used for Virtual Scroll. Although the repository name includes “Ionic” this strategy only works with Angular.

This is a simple coding concept:

```html
<cdk-virtual-scroll-viewport
  [itemDynamicSizes]="[{ itemSize: 100 } , { itemSize: 80} , { itemSize: 90 } , { itemSize: 100}]"
>
  <div *cdkVirtualFor="let item of [100, 80, 90, 100]; trackBy: trackByFn" [style.height.px]="item">
    itemSize: {{ item }}
  </div>
</cdk-virtual-scroll-viewport>
```

Use `[itemDynamicSizes]` directive instead of `[itemSize]` or `[autosize]` directive. `[itemDynamicSizes]` value's type is `itemDynamicSize[]`.

Every data item must have one corresponding `itemDynamicSizes` entry in the same order. Each `itemSize` must be a finite number greater than zero. If Angular updates the data and size signals in separate turns, the strategy keeps the last complete geometry until their lengths match; it never estimates unknown heights.

This library is based largely on this blog: https://dev.to/georgii/virtual-scrolling-of-content-with-variable-height-with-angular-3a52

## Features

### Choose by scrolling goal

| Goal | Guide |
| --- | --- |
| Specify each item height | [Simple Usage](/docs/simple) |
| Measure item components | [Advanced Usage](/docs/advanced) |
| Reverse chat-style scrolling | [Reverse Scroll](/docs/reverse) |

## Quick start

After [Installation](#installation), bind `[itemDynamicSizes]` instead of `[itemSize]`. See [Simple Usage](/docs/simple).

## Installation

```bash
npm install @rdlabo/ngx-cdk-scroll-strategies
```


## Documentation

Start with [Installation](#installation), then pick a guide.

- [Simple Usage](/docs/simple) — per-item heights.
- [Advanced Usage](/docs/advanced) — measured item components.
- [Reverse Scroll](/docs/reverse) — chat-style reverse lists.
- [FAQ](/docs/faq) — why not `autosize`.
