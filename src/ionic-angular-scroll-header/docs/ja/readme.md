---
title: '@rdlabo/ionic-angular-scroll-header'
---

# @rdlabo/ionic-angular-scroll-header

Header と連動してスクロールするためのディレクティブです。

## インストール

```bash
npm install @rdlabo/ionic-angular-scroll-header
```

ディレクティブ用の CSS をインポートします。

```diff
+ @import '@rdlabo/ionic-angular-scroll-header/css/scroll-header.directive.css';

+ /* If you use cdk virtual scroll */
+ cdk-virtual-scroll-viewport {
+   width: 100%;
+   height: 100%;
+   .cdk-virtual-scroll-content-wrapper {
+     padding-top: inherit;
+   }
+ }
```

## 使い方

### IonContent のスクロール

- Demo: https://rdlabo-ionic-angular-library.netlify.app/main/scroll-header
- Source: https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/demo/src/app/scroll-header/scroll-header.page.html

```ts
import { ScrollHeaderDirective } from '@rdlabo/ionic-angular-scroll-header';
@Component({
  ...
  imports: [
    ScrollHeaderDirective
  ],
})
```

```html
<ion-header class="hidden"><ion-toolbar></ion-toolbar></ion-header>
<!-- set hidden header for safe-area -->
<ion-content rdlaboScrollHeader>
  <ion-header>
    <ion-toolbar>...</ion-toolbar>
    <!-- Default Header for display -->
  </ion-header>
  ...Your Content
</ion-content>
```

### CdkVirtualScroll（Angular Material）のスクロール

- Demo: https://rdlabo-ionic-angular-library.netlify.app/main/virtual-scroll-header
- Source: https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/demo/src/app/virtual-scroll-header/virtual-scroll-header.page.html

```ts
import { VirtualScrollHeaderDirective } from '@rdlabo/ionic-angular-scroll-header';

@Component({
  ...
  imports: [
    VirtualScrollHeaderDirective
  ],
})
```

```html
<ion-header class="hidden"><ion-toolbar></ion-toolbar></ion-header>
<!-- set hidden header for safe-area -->
<ion-content rdlaboVirtualScrollHeader>
  <ion-header>
    <ion-toolbar>...</ion-toolbar>
    <!-- Default Header for display -->
  </ion-header>
  <cdk-virtual-scroll-viewport
    minBufferPx="900"
    maxBufferPx="1350"
    [itemSize]="44"
    class="ion-content-scroll-host"
  >
    ...Your Content
  </cdk-virtual-scroll-viewport>
</ion-content>
```

### Fix https://github.com/angular/components/issues/27104

> bug(COMPONENT): CDK Virtual Scroller jump back/flickers to items on top #27104

```ts
import { FixVirtualScrollElementDirective } from '@rdlabo/ionic-angular-scroll-header';

@Component({
  ...
  imports: [
  FixVirtualScrollElementDirective
  ],
})
```

```html
<ion-content>
  <cdk-virtual-scroll-viewport
    rdlaboFixVirtualScrollElement
    minBufferPx="900"
    maxBufferPx="1350"
    [itemSize]="44"
    class="ion-content-scroll-host"
  >
    ...Your Content
  </cdk-virtual-scroll-viewport>
</ion-content>
```

# FAQ

## セーフエリア用に hidden な Header を設定する必要があるのはなぜですか？

もちろん、次のように ion-content にセーフエリアを設定することもできます。

```css
ion-content {
  padding-top: var(--ion-safe-area-top, 0);
}
```

ただし、セーフエリアのために ion-header と ion-toolbar を明示的に置く方が望ましいと考えました。

## Scroll に追従して隠れる Header とは別に、常に表示される Header も必要です

可能です。クラス名に `native-header` を追加すると、2 つの Header をよりスムーズに扱えます。

```diff
- <ion-header class="hidden"><ion-toolbar></ion-toolbar></ion-header>
+ <ion-header class="native-header">
+   <ion-toolbar><ion-title>Native Header</ion-title></ion-toolbar>
+ </ion-header>
```
