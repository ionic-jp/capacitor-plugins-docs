---
title: 'はじめに'
code: []
scrollActiveLine: []
---

## 概要

Header と連動してスクロールするためのディレクティブです。

## 機能

### 目的から選ぶ

| 目的 | ガイド |
| --- | --- |
| IonContent で Header を隠す・出す | [IonContent](/docs/ion-content) |
| CDK Virtual Scroll と Header を連携する | [Virtual Scroll](/docs/virtual-scroll) |
| Native Header を常時表示する | [Safe Area](/docs/safe-area) |

## クイックスタート

[インストール](#インストール) のあと、`ion-content` にディレクティブを付けます。[IonContent](/docs/ion-content) を見てください。

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


## ドキュメント

上の [インストール](#インストール) から始め、ガイドを選んでください。

- [IonContent](/docs/ion-content) — Ionic Header の Scroll 連動。
- [Virtual Scroll](/docs/virtual-scroll) — CDK Viewport とちらつき修正。
- [Safe Area](/docs/safe-area) — 非表示 Header と Native Header。
