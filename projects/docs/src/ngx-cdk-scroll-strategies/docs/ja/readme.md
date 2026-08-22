---
title: 'はじめに'
code: []
scrollActiveLine: []
---

## 概要

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

## 機能

### 目的から選ぶ

| 目的 | ガイド |
| --- | --- |
| 各アイテムの高さを指定する | [シンプルな使い方](/docs/simple) |
| アイテムコンポーネントの高さを測る | [応用的な使い方](/docs/advanced) |
| チャット型のリバーススクロール | [リバーススクロール](/docs/reverse) |

## クイックスタート

[インストール](#インストール) のあと、`[itemSize]` の代わりに `[itemDynamicSizes]` をバインドします。[シンプルな使い方](/docs/simple) を見てください。

## インストール

```bash
npm install @rdlabo/ngx-cdk-scroll-strategies
```


## ドキュメント

上の [インストール](#インストール) から始め、ガイドを選んでください。

- [シンプルな使い方](/docs/simple) — アイテムごとの高さ。
- [応用的な使い方](/docs/advanced) — 計測したアイテムコンポーネント。
- [リバーススクロール](/docs/reverse) — チャット型リスト。
- [FAQ](/docs/faq) — `autosize` を使わない理由。
