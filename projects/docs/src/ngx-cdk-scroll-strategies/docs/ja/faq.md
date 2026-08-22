---
title: 'FAQ'
code: []
scrollActiveLine: []
---

### なぜ `autosize` ディレクティブを使わないのですか？

`autosize` ディレクティブは平均アイテムサイズを使います。「アイテムサイズが変わる」「アイテムが削除される」には対応していません。アイテムサイズのキャッシュを持たないためです。

https://github.com/angular/components/blob/main/src/cdk-experimental/scrolling/auto-size-virtual-scroll.ts#L49C3-L59

動的サイズを指定できるため、より柔軟なアプリケーション設計が可能です。
