---
title: 'はじめに'
code: []
scrollActiveLine: []
---

Capacitor Brother Print は、iOS と Android 向けのネイティブ Brother Print SDK 実装です。次のモデルをサポートします。

**このプラグインはまだ RC（リリース候補）段階です。**

**Brother Print SDK は CocoaPods と非互換で、Minimum Developments が iOS 14 のため、現時点では動作しません。Swift Package Manager を使ってください。**

## 対応モデル

各製品リンクは Amazon アソシエイトです。これらのリンクから購入いただけると開発費の支援になります。ありがとうございます。

| Product                               | Model        | iOS/WiFi | iOS/BT | iOS/BLE | Android/USB | Android/WiFi | Android/BT | Android/BLE |
| ------------------------------------- | ------------ | -------- | ------ | ------- | ----------- | ------------ | ---------- | ----------- |
| QL-810W                               | QL_810W      | ✗        | ✗      | ✗       | ◯           | ✗            | ✗          | ✗           |
| [QL-820NWB](https://amzn.to/3BXQ1aj)  | QL_820NWB    | ◯        | ※1     | ✗       | △           | ◯            | △          | ✗           |
| [QL-820NWBc](https://amzn.to/4fjhUIe)  | QL_820NWB    | ◯        | ※2     | ✗       | ✗           | ◯            | ◯          | ✗           |
| [TD-2320D](https://amzn.to/48EFCN3)   | TD_2320D_203 | ✗        | ✗      | ✗       | △           | ✗            | ✗          | ✗           |
| [TD-2350D](https://amzn.to/48ma6TK)   | TD_2350D_300 | ◯        | △      | △       | ◯           | ◯            | ◯          | △           |

Amazon アソシエイト:　**https://amzn.to/3AiiOFT**

**補足**

|     | description                |
| --- | -------------------------- |
| ◯   | Supported and tested       |
| △   | Implemented but not tested |
| -   | Plugin is not supported    |
| ✗   | Device is not supported    |
| BT  | Bluetooth                  |
| BLE | Bluetooth Low Energy       |

※1 Bluetooth の版が古く、iOS では接続できません。参照: https://okbizcs.okwave.jp/brother/qa/q9932082.html

※2 QL-820NWBc の iOS/BT 実装は入っていますが、正しく動くかは不明です。Brother 公式アプリでもうまく動かないため、実装の問題かは切り分けられていません。

## インストール

```
% npm install @rdlabo/capacitor-brotherprint
```

SDK の配置と権限の詳細は [Installation](/docs/installation) です。

## 使い方

[Search](/docs/search)、[Print](/docs/print)、[Events](/docs/events) を見てください。
