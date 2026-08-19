---
title: 'Getting Started'
code: []
scrollActiveLine: []
---

Capacitor Brother Print is a native Brother Print SDK implementation for iOS and Android. It supports the following models.

**This plugin is still in RC (release candidate).**

**Brother Print SDK is incompatible with CocoaPods and requires iOS 14 minimum from Brother, so it does not work with CocoaPods at this time. Use Swift Package Manager.**

## Supported models

Product links are Amazon Associates links. Purchases through these links help support development. Thank you.

| Product                               | Model        | iOS/WiFi | iOS/BT | iOS/BLE | Android/USB | Android/WiFi | Android/BT | Android/BLE |
| ------------------------------------- | ------------ | -------- | ------ | ------- | ----------- | ------------ | ---------- | ----------- |
| QL-810W                               | QL_810W      | ✗        | ✗      | ✗       | ◯           | ✗            | ✗          | ✗           |
| [QL-820NWB](https://amzn.to/3BXQ1aj)  | QL_820NWB    | ◯        | ※1     | ✗       | △           | ◯            | △          | ✗           |
| [QL-820NWBc](https://amzn.to/4fjhUIe)  | QL_820NWB    | ◯        | ※2     | ✗       | ✗           | ◯            | ◯          | ✗           |
| [TD-2320D](https://amzn.to/48EFCN3)   | TD_2320D_203 | ✗        | ✗      | ✗       | △           | ✗            | ✗          | ✗           |
| [TD-2350D](https://amzn.to/48ma6TK)   | TD_2350D_300 | ◯        | △      | △       | ◯           | ◯            | ◯          | △           |

Amazon Associates: **https://amzn.to/3AiiOFT**

**Notes**

|     | description                |
| --- | -------------------------- |
| ◯   | Supported and tested       |
| △   | Implemented but not tested |
| -   | Plugin is not supported    |
| ✗   | Device is not supported    |
| BT  | Bluetooth                  |
| BLE | Bluetooth Low Energy       |

※1 The Bluetooth edition is older and cannot connect on iOS. See: https://okbizcs.okwave.jp/brother/qa/q9932082.html

※2 QL-820NWBc iOS/BT is implemented but correctness is unknown. Brother's official app also fails, so it is unclear whether the issue is in this implementation.

## Installation

```
% npm install @rdlabo/capacitor-brotherprint
```

See [Installation](/docs/installation) for SDK placement and permissions.

## Usage

See [Search](/docs/search), [Print](/docs/print), and [Events](/docs/events).
