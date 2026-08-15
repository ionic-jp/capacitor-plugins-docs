---
title: '@rdlabo/ngx-cdk-scroll-strategies'
---

# @rdlabo/ngx-cdk-scroll-strategies

`@angular/cdk/scrolling` 向けの動的なアイテムサイズのストラテジーです。Virtual Scroll で使う配列の各アイテムサイズを個別に指定できます。リポジトリ名に “Ionic” が含まれていますが、このストラテジーは Angular のみで動作します。

シンプルなコーディング概念は次のとおりです。

```html
<cdk-virtual-scroll-viewport
  [itemDynamicSizes]="[{ itemSize: 100 } , { itemSize: 80} , { itemSize: 90 } , { itemSize: 100}]"
>
  <div *cdkVirtualFor="let item of [100, 80, 90, 100]; trackBy: trackByFn" [style.height.px]="item">
    itemSize: {{ item }}
  </div>
</cdk-virtual-scroll-viewport>
```

`[itemSize]` や `[autosize]` ディレクティブの代わりに `[itemDynamicSizes]` ディレクティブを使います。`[itemDynamicSizes]` の値の型は `itemDynamicSize[]` です。

すべてのデータアイテムに対し、同じ順序で対応する `itemDynamicSizes` のエントリが 1 つ必要です。各 `itemSize` は 0 より大きい有限の数値でなければなりません。Angular がデータとサイズのシグナルを別ターンで更新した場合、ストラテジーは長さが一致するまで最後の完全なジオメトリを保持し、未知の高さは推定しません。

このライブラリは、主に次のブログを基にしています: https://dev.to/georgii/virtual-scrolling-of-content-with-variable-height-with-angular-3a52

## インストール

```bash
npm install @rdlabo/ngx-cdk-scroll-strategies
```

## 使い方

### シンプルな使い方

> 基本的な利用例です。

- Demo: https://rdlabo-ionic-angular-library.netlify.app/main/scroll-strategies/simple
- Source: https://github.com/rdlabo-dev/ionic-angular-library/tree/v21.6.2/projects/demo/src/app/scroll-strategies/pages/scroll-simple

```ts
import { CdkDynamicSizeVirtualScroll, itemDynamicSize } from '@rdlabo/ngx-cdk-scroll-strategies';

@Component({
  ...
  imports: [
    CdkDynamicSizeVirtualScroll
  ],
})
export class ScrollStrategiesPage implements OnInit {
  readonly items = signal<itemDynamicSize[]>([]);
  readonly dynamicSize = computed<itemDynamicSize[]>(() => {
    return this.items().map((item) => ({ trackId: item.trackId, itemSize: item.itemSize }));
  });
}
```

```html
<cdk-virtual-scroll-viewport
  [itemDynamicSizes]="dynamicSize()"
  minBufferPx="900"
  maxBufferPx="1350"
>
  <div
    *cdkVirtualFor="let item of items(); trackBy: trackByFn"
    class="dynamic-item"
    [style.height.px]="item.itemSize"
  >
    itemSize: {{ item.itemSize }}
  </div>
</cdk-virtual-scroll-viewport>
```

それ以外は `@angular/cdk/scrolling` と同じように動作します。

### 応用的な使い方

> 実践的なデモです。スクロールアイテムを別コンポーネントにし、各コンポーネントの高さを取得します。
> Angular の基礎知識がないと難しい内容です。

- Demo: https://rdlabo-ionic-angular-library.netlify.app/main/scroll-strategies/advanced
- Source: https://github.com/rdlabo-dev/ionic-angular-library/tree/v21.6.2/projects/demo/src/app/scroll-strategies/pages/scroll-advanced

### リバースな使い方

> WeChat のようなリバーススクロールのデモです。

- Demo: https://rdlabo-ionic-angular-library.netlify.app/main/scroll-strategies/reverse
- Source: https://github.com/rdlabo-dev/ionic-angular-library/tree/v21.6.2/projects/demo/src/app/scroll-strategies/pages/scroll-reverse

リバーススクロールの場合は、`cdk-virtual-scroll-viewport` タグに `isReverse` ディレクティブを追加します。

```html
<cdk-virtual-scroll-viewport
  [itemDynamicSizes]="dynamicSize()"
  [isReverse]="true"
  minBufferPx="900"
  maxBufferPx="1350"
>
  <div class="reverse-items">
    <div
      *cdkVirtualFor="let item of items(); trackBy: trackByFn"
      class="dynamic-item"
      [style.height.px]="item.itemSize"
    >
      itemSize: {{ item.itemSize }}
    </div>
  </div>
</cdk-virtual-scroll-viewport>
```

`styles.css` のようなグローバル CSS ファイルで、`cdk-virtual-scroll-viewport.reverse-scroll` に CSS を追加します。

```css
cdk-virtual-scroll-viewport {
  width: 100%;
  height: 100%;

  /* .reverse-scroll class is added from this directive. */
  &.reverse-scroll {
    display: flex;
    flex-direction: column-reverse;

    .cdk-virtual-scroll-content-wrapper {
      top: auto;
      bottom: 0;
    }
  }
}
```

さらにアイテムのラッパーを追加します。`div.reverse-items` クラスは一例です。自由に決めて構いません。

```css
div.reverse-items {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;

  position: relative;
  bottom: 0;
}
```

**リバーススクロールでは、CdkVirtualScrollViewport の measureScrollOffset は動作しません。このディレクティブの scrollOffset を使ってください。**
https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/scroll-strategies/src/lib/dynamic-size-virtual-scroll-strategy.ts

リバースレイアウトはネイティブの負の `scrollTop` 値を使います。`scrollToIndex()` は通常どおり論理的なアイテムインデックスを受け取り、その累積オフセットを内部でネイティブ座標に変換します。

### オプション

このパッケージには、Virtual Scroll での開発を簡単にする Helper Service が含まれています。

```ts
import { DynamicSizeVirtualScrollService } from '@rdlabo/ngx-cdk-scroll-strategies';
```

詳細はこちら: https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/scroll-strategies/src/lib/dynamic-size-virtual-scroll.service.ts

## FAQ

### なぜ `autosize` ディレクティブを使わないのですか？

`autosize` ディレクティブは平均アイテムサイズを使います。「アイテムサイズが変わる」「アイテムが削除される」には対応していません。アイテムサイズのキャッシュを持たないためです。

https://github.com/angular/components/blob/main/src/cdk-experimental/scrolling/auto-size-virtual-scroll.ts#L49C3-L59

動的サイズを指定できるため、より柔軟なアプリケーション設計が可能です。
