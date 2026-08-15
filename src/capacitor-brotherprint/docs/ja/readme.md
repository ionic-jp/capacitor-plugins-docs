---
title: '@rdlabo/capacitor-brotherprint'
---

# @rdlabo/capacitor-brotherprint

Capacitor Brother Print は、iOS と Android 向けのネイティブ Brother Print SDK 実装です。次のモデルをサポートします。

**このプラグインはまだ RC（リリース候補）段階です。**

**iOS 15以降が必要です。Brother SDKはCocoaPodsやSwift Package Managerでは配布されていないため、SDKをダウンロードし、以下の手順でXCFrameworkをローカルパッケージとして公開してください。このプラグインは、どちらのパッケージマネージャーを使うCapacitorプロジェクトにも対応します。**

## 対応モデル

各製品リンクは Amazon アフィリエイトリンクです。これらのリンクから購入いただけると大変ありがたく、**開発コストの支援**につながります。ありがとうございます！

| 製品                                  | モデル       | iOS/WiFi | iOS/BT | iOS/BLE | Android/USB | Android/WiFi | Android/BT | Android/BLE |
| ------------------------------------- | ------------ | -------- | ------ | ------- | ----------- | ------------ | ---------- | ----------- |
| QL-810W                               | QL_810W      | ✗        | ✗      | ✗       | ◯           | ✗            | ✗          | ✗           |
| [QL-820NWB](https://amzn.to/3BXQ1aj)  | QL_820NWB    | ◯        | ※1     | ✗       | △           | ◯            | △          | ✗           |
| [QL-820NWBc](https://amzn.to/4fjhUIe) | QL_820NWB    | ◯        | ※2     | ✗       | ✗           | ◯            | ◯          | ✗           |
| [TD-2320D](https://amzn.to/48EFCN3)   | TD_2320D_203 | ✗        | ✗      | ✗       | △           | ✗            | ✗          | ✗           |
| [TD-2350D](https://amzn.to/48ma6TK)   | TD_2350D_300 | ◯        | △      | △       | ◯           | ◯            | ◯          | △           |

Amazon アフィリエイトリンク:　**https://amzn.to/3AiiOFT**

**補足**

|     | 説明                       |
| --- | -------------------------- |
| ◯   | 対応済みでテスト済み       |
| △   | 実装済みだが未テスト       |
| -   | プラグイン未対応           |
| ✗   | デバイス未対応             |
| BT  | Bluetooth                  |
| BLE | Bluetooth Low Energy       |

※1 Bluetooth のバージョンが低いため、iOS では接続できません。参考: https://okbizcs.okwave.jp/brother/qa/q9932082.html

※2 QL-820NWBc の iOS/BT 実装はありますが、正しく動作するかは不明です。Brother 公式アプリでもうまく動かないため、実装の問題かどうかははっきりしません。

## インストール方法

```
% npm install @rdlabo/capacitor-brotherprint
```

## Brother SDK の初期化

### Android の設定

1. Capacitor プロジェクトの android フォルダに次のファイルを配置します:

- `android/BrotherPrintLibrary/BrotherPrintLibrary.aar`
- `android/BrotherPrintLibrary/build.gradle`

`BrotherPrintLibrary.aar` は Brother Print SDK ライブラリで、Brother のサイトからダウンロードできます: https://support.brother.co.jp/j/s/es/dev/ja/mobilesdk/android/index.html?c=jp&lang=ja&navi=offall&comple=on&redirect=on#ver4

2. `android/BrotherPrintLibrary/build.gradle` ファイルに、次の内容を含めます:

```
configurations.maybeCreate('default')
artifacts.add('default', file('BrotherPrintLibrary.aar'))
```

3. `android/settings.gradle` を開き、次の行を追加します:

```
include ':BrotherPrintLibrary'
project(':BrotherPrintLibrary').projectDir = new File('./BrotherPrintLibrary/')
```

これらの手順で、Brother Print SDK を Capacitor Android プロジェクトに統合できます。

### iOS の設定

1. Capacitor プロジェクトの ios フォルダに次のファイルを配置します:

- `ios/LocalPackages/BRLMPrinterKit/Sources/BRLMPrinterKit.xcframework`
- `ios/LocalPackages/BRLMPrinterKit/BRLMPrinterKit.podspec`
- `ios/LocalPackages/BRLMPrinterKit/Package.swift`

`BRLMPrinterKit.xcframework` は Brother Print SDK ライブラリで、Brother のサイトからダウンロードできます: https://support.brother.co.jp/j/s/es/dev/ja/mobilesdk/ios/index.html?c=jp&lang=ja&navi=offall&comple=on&redirect=on#ver4

`BRLMPrinterKit.podspec` の内容は次のとおりです:

```podspec
Pod::Spec.new do |s|
  s.name             = 'BRLMPrinterKit'
  s.version          = '4.12.0'
  s.homepage         = 'https://support.brother.co.jp/j/s/support/html/mobilesdk/index.html'
  s.source           = { :path => './Sources' }
  s.summary          = "Pod for the BRLMPrinterKit / Brother's printers"
  s.description      = "This project is only a Pod for the Brother SDK v#{s.version}"
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Masahiko Sakakibara' => 'sakakibara@rdlabo.jp' }
  s.ios.deployment_target = '15.0'
  s.ios.vendored_frameworks = 'Sources/BRLMPrinterKit.xcframework'
  s.pod_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
  s.user_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
end
```

`Package.swift` の内容は次のとおりです:

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "BRLMPrinterKit",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(name: "BRLMPrinterKit", targets: ["BRLMPrinterKit"])
    ],
    targets: [
        .binaryTarget(
            name: "BRLMPrinterKit",
            path: "Sources/BRLMPrinterKit.xcframework"
        )
    ]
)
```

2. CapacitorプロジェクトでCocoaPodsを使う場合は、`ios/App/Podfile` を更新します。

```diff
  target 'App' do
    capacitor_pods
    # Add your Pods here
+   pod 'BRLMPrinterKit', :path => '../LocalPackages/BRLMPrinterKit'
  end
```

その後、`ios` ディレクトリで `pod update` を実行します。Swift Package Managerを使う場合は、代わりに上記のローカル `Package.swift` が使われます。パッケージを配置した後に `npx cap sync ios` を実行してください。

## 権限の設定

### Android の設定

`AndroidManifest.xml` を更新して、次の権限を含めます:

```diff
- <manifest xmlns:android="http://schemas.android.com/apk/res/android">
+ <manifest xmlns:android="http://schemas.android.com/apk/res/android"
+    xmlns:tools="http://schemas.android.com/tools">
...
+     <!-- For Bluetooth -->
+     <uses-permission android:name="android.permission.BLUETOOTH" />
+     <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
+     <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

+     <!-- For Bluetooth Low Energy, Android 11 and earlier-->
+     <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
+     <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

+     <!-- For Bluetooth Low Energy, Android 12 and later -->
+     <uses-permission android:name="android.permission.BLUETOOTH_SCAN"
+         android:usesPermissionFlags="neverForLocation"
+         tools:targetApi="s" />
```

詳細はこちら: https://support.brother.co.jp/j/s/support/html/mobilesdk/guide/getting-started/getting-started-android.html

### iOS の設定

`Info.plist` を更新して、次の権限を含めます:

```diff
+ <key>NSBluetoothAlwaysUsageDescription</key>
+ <string>【Why use Bluetooth for your app.】</string>
+ <key>NSBluetoothPeripheralUsageDescription</key>
+ <string>【Why use Bluetooth for your app.】</string>
+ <key>NSBonjourServices</key>
+ <array>
+ 	<string>_pdl-datastream._tcp</string>
+ 	<string>_printer._tcp</string>
+ 	<string>_ipp._tcp</string>
+ </array>
+ <key>NSLocalNetworkUsageDescription</key>
+ <string>【Why use WiFi for your app.】</string>
+ <key>UISupportedExternalAccessoryProtocols</key>
+ <array>
+ 	<string>com.brother.ptcbp</string>
+ </array>
```

詳細はこちら: https://support.brother.co.jp/j/s/support/html/mobilesdk/guide/getting-started/getting-started-ios.html

## 使い方

```typescript
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import type { PluginListenerHandle } from '@capacitor/core';
import {
  BrotherPrint,
  BrotherPrintEventsEnum,
  BRLMPrinterLabelName,
  BRLMPrinterModelName,
  BRLMPrinterPort,
} from '@rdlabo/capacitor-brotherprint';
import type {
  BRLMChannelResult,
  BRLMPrintOptions,
} from '@rdlabo/capacitor-brotherprint';

@Component({
  selector: 'brother-print',
  templateUrl: 'brother.component.html',
  styleUrls: ['brother.component.scss'],
})
export class BrotherComponent implements OnInit, OnDestroy {
  readonly #listenerHandlers: PluginListenerHandle[] = [];
  readonly printers = signal<BRLMChannelResult[]>([]);

  async ngOnInit() {
    this.#listenerHandlers.push(
      await BrotherPrint.addListener(BrotherPrintEventsEnum.onPrint, () => {
        console.log('onPrint');
      }),
    );
    this.#listenerHandlers.push(
      await BrotherPrint.addListener(
        BrotherPrintEventsEnum.onPrintError,
        info => {
          console.log('onPrintError');
        },
      ),
    );
    this.#listenerHandlers.push(
      await BrotherPrint.addListener(
        BrotherPrintEventsEnum.onPrintFailedCommunication,
        info => {
          console.log('onPrintFailedCommunication');
        },
      ),
    );
    this.#listenerHandlers.push(
      await BrotherPrint.addListener(
        BrotherPrintEventsEnum.onPrinterAvailable,
        printer => {
          this.printers.update(prev => [...prev, printer]);
        },
      ),
    );
  }

  async ngOnDestroy() {
    this.#listenerHandlers.forEach(handler => handler.remove());
  }

  async searchPrinter(port: BRLMPrinterPort) {
    // This method return void. Get the printer list by listening to the event.
    await BrotherPrint.search({
      port,
      searchDuration: 15, // seconds
    });
  }

  print() {
    if (this.printers().length === 0) {
      console.error('No printer found');
      return;
    }

    const defaultPrintSettings: BRLMPrintOptions = {
      modelName: BRLMPrinterModelName.QL_820NWB,
      labelName: BRLMPrinterLabelName.RollW62,
      encodedImage: 'base64 removed mime-type', // base64
      numberOfCopies: 1, // default 1
      autoCut: true, // default true
    };

    BrotherPrint.printImage({
      ...defaultPrintSettings,
      ...{
        port: this.printers()[0].port,
        channelInfo: this.printers()[0].channelInfo,
      },
    });
  }
}
```

完全なコードはデモを参照してください:
https://github.com/rdlabo-dev/capacitor-brotherprint/blob/v8.1.1/demo/src/app/home/home.page.ts

## API

<docgen-index>

* [`printImage(...)`](#printimage)
* [`search(...)`](#search)
* [`isChannelAvailable(...)`](#ischannelavailable)
* [`cancelSearchWiFiPrinter()`](#cancelsearchwifiprinter)
* [`cancelSearchBluetoothPrinter()`](#cancelsearchbluetoothprinter)
* [`addListener(BrotherPrintEventsEnum.onPrinterAvailable, ...)`](#addlistenerbrotherprinteventsenumonprinteravailable-)
* [`addListener(BrotherPrintEventsEnum.onPrint, ...)`](#addlistenerbrotherprinteventsenumonprint-)
* [`addListener(BrotherPrintEventsEnum.onPrintFailedCommunication, ...)`](#addlistenerbrotherprinteventsenumonprintfailedcommunication-)
* [`addListener(BrotherPrintEventsEnum.onPrintError, ...)`](#addlistenerbrotherprinteventsenumonprinterror-)
* [インターフェース](#interfaces)
* [型エイリアス](#type-aliases)
* [列挙型](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### printImage(...)

```typescript
printImage(options: BRLMPrintOptions) => Promise<void>
```

| パラメータ    | 型                                                            |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#brlmprintoptions">BRLMPrintOptions</a></code> |

--------------------


### search(...)

```typescript
search(option: BRLMSearchOption) => Promise<void>
```

プリンターを検索します。見つからない場合は空配列を返します（エラーではありません）。

| パラメータ   | 型                                                            |
| ------------ | ------------------------------------------------------------- |
| **`option`** | <code><a href="#brlmsearchoption">BRLMSearchOption</a></code> |

--------------------


### isChannelAvailable(...)

```typescript
isChannelAvailable(option: BRLMChannelResult) => Promise<isChannelAvailableResult>
```

最後に接続した <a href="#brlmchannelresult">BRLMChannelResult</a> を保存している場合、
現在利用可能かどうかを検証できます。

| パラメータ   | 型                                                              |
| ------------ | --------------------------------------------------------------- |
| **`option`** | <code><a href="#brlmchannelresult">BRLMChannelResult</a></code> |

**戻り値:** <code>Promise&lt;<a href="#ischannelavailableresult">isChannelAvailableResult</a>&gt;</code>

--------------------


### cancelSearchWiFiPrinter()

```typescript
cancelSearchWiFiPrinter() => Promise<void>
```

基本的にはタイムアウトするため、使う必要はありません。複数の connectType 検索を同時に実行し、いずれかを手動でタイムアウトさせたいときに使います。

--------------------


### cancelSearchBluetoothPrinter()

```typescript
cancelSearchBluetoothPrinter() => Promise<void>
```

基本的にはタイムアウトするため、使う必要はありません。複数の connectType 検索を同時に実行し、いずれかを手動でタイムアウトさせたいときに使います。

--------------------


### addListener(BrotherPrintEventsEnum.onPrinterAvailable, ...)

```typescript
addListener(eventName: BrotherPrintEventsEnum.onPrinterAvailable, listenerFunc: (printers: BRLMChannelResult) => void) => Promise<PluginListenerHandle>
```

デバイスに接続できるプリンターを見つけます。

| パラメータ         | 型                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code><a href="#brotherprinteventsenum">BrotherPrintEventsEnum.onPrinterAvailable</a></code> |
| **`listenerFunc`** | <code>(printers: <a href="#brlmchannelresult">BRLMChannelResult</a>) =&gt; void</code>       |

**戻り値:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener(BrotherPrintEventsEnum.onPrint, ...)

```typescript
addListener(eventName: BrotherPrintEventsEnum.onPrint, listenerFunc: () => void) => Promise<PluginListenerHandle>
```

印刷成功イベント

| パラメータ         | 型                                                                                |
| ------------------ | --------------------------------------------------------------------------------- |
| **`eventName`**    | <code><a href="#brotherprinteventsenum">BrotherPrintEventsEnum.onPrint</a></code> |
| **`listenerFunc`** | <code>() =&gt; void</code>                                                        |

**戻り値:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener(BrotherPrintEventsEnum.onPrintFailedCommunication, ...)

```typescript
addListener(eventName: BrotherPrintEventsEnum.onPrintFailedCommunication, listenerFunc: (info: ErrorInfo) => void) => Promise<PluginListenerHandle>
```

プリンターへの接続に失敗しました。
例: Bluetooth がオフ、プリンターがオフ、など。

| パラメータ         | 型                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code><a href="#brotherprinteventsenum">BrotherPrintEventsEnum.onPrintFailedCommunication</a></code> |
| **`listenerFunc`** | <code>(info: <a href="#errorinfo">ErrorInfo</a>) =&gt; void</code>                                   |

**戻り値:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener(BrotherPrintEventsEnum.onPrintError, ...)

```typescript
addListener(eventName: BrotherPrintEventsEnum.onPrintError, listenerFunc: (info: ErrorInfo) => void) => Promise<PluginListenerHandle>
```

印刷に失敗しました。

| パラメータ         | 型                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------- |
| **`eventName`**    | <code><a href="#brotherprinteventsenum">BrotherPrintEventsEnum.onPrintError</a></code> |
| **`listenerFunc`** | <code>(info: <a href="#errorinfo">ErrorInfo</a>) =&gt; void</code>                     |

**戻り値:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### インターフェース


#### PluginListenerHandle

| プロパティ   | 型                                        |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### 型エイリアス


#### BRLMPrintOptions

<code>{ encodedImage: string; /** * Should use enum <a href="#brlmprintermodelname">BRLMPrinterModelName</a> */ modelName: <a href="#brlmprintermodelname">BRLMPrinterModelName</a>; } & <a href="#partial">Partial</a>&lt;<a href="#brlmchannelresult">BRLMChannelResult</a>&gt; & (<a href="#brlmprinterqlmodelsettings">BRLMPrinterQLModelSettings</a> | <a href="#brlmprintertdmodelsettings">BRLMPrinterTDModelSettings</a>)</code>


#### Partial

T のすべてのプロパティをオプショナルにします

<code>{
 [P in keyof T]?: T[P];
 }</code>


#### BRLMChannelResult

<code>{ port: <a href="#brlmprinterport">BRLMPrinterPort</a>; modelName: string; serialNumber: string; macAddress: string; nodeName: string; location: string; /** * This need to connect to the printer. * wifi: IP Address * bluetooth: macAddress * bluetoothLowEnergy: modelName for bluetoothLowEnergy */ channelInfo: string; }</code>


#### BRLMPrinterQLModelSettings

<code>{ /** * Should use enum <a href="#brlmprinterlabelname">BRLMPrinterLabelName</a> */ labelName: <a href="#brlmprinterlabelname">BRLMPrinterLabelName</a>; } & <a href="#brlmprintersettings">BRLMPrinterSettings</a></code>


#### BRLMPrinterSettings

これらはオプションです。設定しない場合、プリンターがデフォルト値を割り当てます。

<code>{ /** * The number of copies you print. */ numberOfCopies?: <a href="#brlmprinternumberofcopies">BRLMPrinterNumberOfCopies</a>; /** * Whether the auto-cut is enabled or not. If true, your printer cut the paper each page. */ autoCut?: <a href="#brlmprinterautocuttype">BRLMPrinterAutoCutType</a>; /** * A scale mode that specifies how your data is scaled in a print area of your printer. */ scaleMode?: <a href="#brlmprinterscalemode">BRLMPrinterScaleMode</a>; /** * A scale value. This is effective when ScaleMode is ScaleValue. */ scaleValue?: <a href="#brlmprinterscalevaluetype">BRLMPrinterScaleValueType</a>; /** * A way to rasterize your data. */ halftone?: <a href="#brlmprinterhalftone">BRLMPrinterHalftone</a>; /** * A threshold value. This is effective when the Halftone is Threshold. */ halftoneThreshold?: <a href="#brlmprinterhalftonethresholdtype">BRLMPrinterHalftoneThresholdType</a>; /** * An image rotation that specifies the angle in which your data is placed in the print area. Rotation direction is clockwise. */ imageRotation?: <a href="#brlmprinterimagerotation">BRLMPrinterImageRotation</a>; /** * A vertical alignment that specifies how your data is placed in the printable area. */ verticalAlignment?: <a href="#brlmprinterverticalalignment">BRLMPrinterVerticalAlignment</a>; /** * A horizontal alignment that specifies how your data is placed in the printable area. */ horizontalAlignment?: <a href="#brlmprinterhorizontalalignment">BRLMPrinterHorizontalAlignment</a>; /** * A compress mode that specifies how to compress your data. * note: This is ios only. */ compressMode?: <a href="#brlmprintercompressmode">BRLMPrinterCompressMode</a>; /** * A priority that is print speed or print quality. Whether or not this has an effect is depend on your printer. */ printQuality?: <a href="#brlmprinterprintquality">BRLMPrinterPrintQuality</a>; }</code>


#### BRLMPrinterNumberOfCopies

<code>number</code>


#### BRLMPrinterAutoCutType

<code>boolean</code>


#### BRLMPrinterScaleValueType

<code>number</code>


#### BRLMPrinterHalftoneThresholdType

<code>number</code>


#### BRLMPrinterTDModelSettings

<code>{ /** * Should use enum BRLMPrinterCustomPaperType */ paperType: <a href="#brlmprintercustompapertype">BRLMPrinterCustomPaperType</a>; /** * The width of the label. For example, the RD-U04J1 is 60.0 wide. */ tapeWidth: number; /** * The length of the label. For example, the RD-U04J1 is 60.0 wide. */ tapeLength: number; /** * It is the difference between a sticker and a mount. * For example, the RD-U04J1 is `1.0, 2.0, 1.0, 2.0` */ marginTop: number; marginRight: number; marginBottom: number; marginLeft: number; /** * The spacing between seals. For example, the RD-U04J1 is 0.2. */ gapLength: number; paperMarkPosition: number; paperMarkLength: number; /** * Should use enum BRLMPrinterCustomPaperUnit. * For example, the RD-U04J1 is mm. */ paperUnit: <a href="#brlmprintercustompaperunit">BRLMPrinterCustomPaperUnit</a>; }</code>


#### BRLMSearchOption

<code>{ /** * 'usb' is android only, and now developing. */ port: <a href="#brlmprinterport">BRLMPrinterPort</a>; /** * searchDuration is the time to end search for devices. * default is 15 seconds. * use only port is 'wifi' or 'bluetoothLowEnergy'. */ searchDuration: number; }</code>


#### isChannelAvailableResult

<code>{ result: boolean; }</code>


#### ErrorInfo

<code>{ message: string; code: number; }</code>


### 列挙型


#### BRLMPrinterModelName

| メンバー           | 値                          |
| ------------------ | --------------------------- |
| **`QL_800`**       | <code>'QL_800'</code>       |
| **`QL_810W`**      | <code>'QL_810W'</code>      |
| **`QL_820NWB`**    | <code>'QL_820NWB'</code>    |
| **`TD_2320D_203`** | <code>'TD_2320D_203'</code> |
| **`TD_2030AD`**    | <code>'TD_2030AD'</code>    |
| **`TD_2350D_300`** | <code>'TD_2350D_300'</code> |


#### BRLMPrinterPort

| メンバー                 | 値                                |
| ------------------------ | --------------------------------- |
| **`usb`**                | <code>'usb'</code>                |
| **`wifi`**               | <code>'wifi'</code>               |
| **`bluetooth`**          | <code>'bluetooth'</code>          |
| **`bluetoothLowEnergy`** | <code>'bluetoothLowEnergy'</code> |


#### BRLMPrinterLabelName

| メンバー              | 値                             | 説明          |
| --------------------- | ------------------------------ | ------------- |
| **`DieCutW17H54`**    | <code>'DieCutW17H54'</code>    |               |
| **`DieCutW17H87`**    | <code>'DieCutW17H87'</code>    |               |
| **`DieCutW23H23`**    | <code>'DieCutW23H23'</code>    |               |
| **`DieCutW29H42`**    | <code>'DieCutW29H42'</code>    |               |
| **`DieCutW29H90`**    | <code>'DieCutW29H90'</code>    |               |
| **`DieCutW38H90`**    | <code>'DieCutW38H90'</code>    |               |
| **`DieCutW39H48`**    | <code>'DieCutW39H48'</code>    |               |
| **`DieCutW52H29`**    | <code>'DieCutW52H29'</code>    |               |
| **`DieCutW62H29`**    | <code>'DieCutW62H29'</code>    |               |
| **`DieCutW62H60`**    | <code>'DieCutW62H60'</code>    |               |
| **`DieCutW62H75`**    | <code>'DieCutW62H75'</code>    |               |
| **`DieCutW62H100`**   | <code>'DieCutW62H100'</code>   |               |
| **`DieCutW60H86`**    | <code>'DieCutW60H86'</code>    |               |
| **`DieCutW54H29`**    | <code>'DieCutW54H29'</code>    |               |
| **`DieCutW102H51`**   | <code>'DieCutW102H51'</code>   |               |
| **`DieCutW102H152`**  | <code>'DieCutW102H152'</code>  |               |
| **`DieCutW103H164`**  | <code>'DieCutW103H164'</code>  |               |
| **`RollW12`**         | <code>'RollW12'</code>         |               |
| **`RollW29`**         | <code>'RollW29'</code>         |               |
| **`RollW38`**         | <code>'RollW38'</code>         |               |
| **`RollW50`**         | <code>'RollW50'</code>         |               |
| **`RollW54`**         | <code>'RollW54'</code>         |               |
| **`RollW62`**         | <code>'RollW62'</code>         |               |
| **`RollW62RB`**       | <code>'RollW62RB'</code>       |               |
| **`RollW102`**        | <code>'RollW102'</code>        |               |
| **`RollW103`**        | <code>'RollW103'</code>        |               |
| **`DTRollW90`**       | <code>'DTRollW90'</code>       |               |
| **`DTRollW102`**      | <code>'DTRollW102'</code>      |               |
| **`DTRollW102H51`**   | <code>'DTRollW102H51'</code>   |               |
| **`DTRollW102H152`**  | <code>'DTRollW102H152'</code>  |               |
| **`RoundW12DIA`**     | <code>'RoundW12DIA'</code>     |               |
| **`RoundW24DIA`**     | <code>'RoundW24DIA'</code>     |               |
| **`RoundW58DIA`**     | <code>'RoundW58DIA'</code>     |               |
| **`RDDieCutW60H60`**  | <code>'RDDieCutW60H60'</code>  | TD シリーズ向け |
| **`RDDieCutW50H30`**  | <code>'RDDieCutW50H30'</code>  |               |
| **`RDDieCutW40H60`**  | <code>'RDDieCutW40H60'</code>  |               |
| **`RDDieCutW40H50`**  | <code>'RDDieCutW40H50'</code>  |               |
| **`RDDieCutW40H40`**  | <code>'RDDieCutW40H40'</code>  |               |
| **`RDDieCutW30H30`**  | <code>'RDDieCutW30H30'</code>  |               |
| **`RDDieCutW50H35`**  | <code>'RDDieCutW50H35'</code>  |               |
| **`RDDieCutW60H80`**  | <code>'RDDieCutW60H80'</code>  |               |
| **`RDDieCutW60H100`** | <code>'RDDieCutW60H100'</code> |               |


#### BRLMPrinterScaleMode

| メンバー             | 値                            |
| -------------------- | ----------------------------- |
| **`ActualSize`**     | <code>'ActualSize'</code>     |
| **`FitPageAspect`**  | <code>'FitPageAspect'</code>  |
| **`FitPaperAspect`** | <code>'FitPaperAspect'</code> |
| **`ScaleValue`**     | <code>'ScaleValue'</code>     |


#### BRLMPrinterHalftone

| メンバー             | 値                            |
| -------------------- | ----------------------------- |
| **`Threshold`**      | <code>'Threshold'</code>      |
| **`ErrorDiffusion`** | <code>'ErrorDiffusion'</code> |
| **`PatternDither`**  | <code>'PatternDither'</code>  |


#### BRLMPrinterImageRotation

| メンバー        | 値                       |
| --------------- | ------------------------ |
| **`Rotate0`**   | <code>'Rotate0'</code>   |
| **`Rotate90`**  | <code>'Rotate90'</code>  |
| **`Rotate180`** | <code>'Rotate180'</code> |
| **`Rotate270`** | <code>'Rotate270'</code> |


#### BRLMPrinterVerticalAlignment

| メンバー     | 値                    |
| ------------ | --------------------- |
| **`Top`**    | <code>'Top'</code>    |
| **`Center`** | <code>'Center'</code> |
| **`Bottom`** | <code>'Bottom'</code> |


#### BRLMPrinterHorizontalAlignment

| メンバー     | 値                    |
| ------------ | --------------------- |
| **`Left`**   | <code>'Left'</code>   |
| **`Center`** | <code>'Center'</code> |
| **`Right`**  | <code>'Right'</code>  |


#### BRLMPrinterCompressMode

| メンバー    | 値                   |
| ----------- | -------------------- |
| **`None`**  | <code>'None'</code>  |
| **`Tiff`**  | <code>'Tiff'</code>  |
| **`Mode9`** | <code>'Mode9'</code> |


#### BRLMPrinterPrintQuality

| メンバー   | 値                  |
| ---------- | ------------------- |
| **`Best`** | <code>'Best'</code> |
| **`Fast`** | <code>'Fast'</code> |


#### BRLMPrinterCustomPaperType

| メンバー            | 値                           |
| ------------------- | ---------------------------- |
| **`rollPaper`**     | <code>'rollPaper'</code>     |
| **`dieCutPaper`**   | <code>'dieCutPaper'</code>   |
| **`markRollPaper`** | <code>'markRollPaper'</code> |


#### BRLMPrinterCustomPaperUnit

| メンバー   | 値                  |
| ---------- | ------------------- |
| **`mm`**   | <code>'mm'</code>   |
| **`inch`** | <code>'inch'</code> |


#### BrotherPrintEventsEnum

| メンバー                         | 値                                        |
| -------------------------------- | ----------------------------------------- |
| **`onPrinterAvailable`**         | <code>'onPrinterAvailable'</code>         |
| **`onPrint`**                    | <code>'onPrint'</code>                    |
| **`onPrintFailedCommunication`** | <code>'onPrintFailedCommunication'</code> |
| **`onPrintError`**               | <code>'onPrintError'</code>               |

</docgen-api>
