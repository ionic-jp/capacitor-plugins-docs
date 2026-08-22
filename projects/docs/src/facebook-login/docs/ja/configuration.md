---
title: '設定'
code: []
scrollActiveLine: []
---

[Meta App Dashboard](https://developers.facebook.com/apps/)でアプリを作成または選択し、Facebook Loginを有効にして、Capacitorアプリが対応する各プラットフォームを設定します。

このプラグインはCapacitor 8、iOS 15以降、Android API 24以降を対象としています。ネイティブFacebook SDKへの依存関係はプラグインが宣言するため、別のFacebook SDK依存関係を追加しないでください。

## Android

`android/app/src/main/AndroidManifest.xml`の`<application>`内に次を追加します。

```xml
<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id" />
<meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token" />
```

`android/app/src/main/res/values/strings.xml`には次を追加します。

```xml
<string name="facebook_app_id">[APP_ID]</string>
<string name="facebook_client_token">[CLIENT_TOKEN]</string>
```

`[APP_ID]`と`[CLIENT_TOKEN]`をMetaアプリの値に置き換えます。Meta App DashboardにAndroidのパッケージ名、Activity class、release/debug key hashを追加してください。詳しくはMetaの[Androidスタートガイド](https://developers.facebook.com/docs/android/getting-started)を参照してください。

### Android変数

特定のSDKバージョンが必要な場合に限り、アプリの`variables.gradle`で次を上書きします。

| Variable             | Artifact                              | Default  |
| -------------------- | ------------------------------------- | -------- |
| `facebookSDKVersion` | `com.facebook.android:facebook-login` | `18.3.0` |

## iOS

プラグインはCocoaPodsとSwift Package Managerの依存関係として`FBSDKCoreKit`と`FBSDKLoginKit`を宣言します。Facebook iOS SDKを別途追加しないでください。

CocoaPodsの依存関係は`~> 18.1`を使用し、Swift Package Managerは`18.1.0`以上、次のメジャーバージョン未満を解決します。

`ios/App/App/AppDelegate.swift`でSDKを初期化し、ログインcallback URLを転送します。

```swift
import UIKit
import Capacitor
import FBSDKCoreKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )
        return true
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        if ApplicationDelegate.shared.application(
            app,
            open: url,
            sourceApplication: options[.sourceApplication] as? String,
            annotation: options[.annotation]
        ) {
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }
}
```

`ios/App/App/Info.plist`の最も外側の`<dict>`内に次を追加します。

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>fb[APP_ID]</string>
    </array>
  </dict>
</array>
<key>FacebookAppID</key>
<string>[APP_ID]</string>
<key>FacebookClientToken</key>
<string>[CLIENT_TOKEN]</string>
<key>FacebookDisplayName</key>
<string>[APP_NAME]</string>
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>fbapi</string>
  <string>fbapi20130214</string>
  <string>fbapi20130410</string>
  <string>fbapi20130702</string>
  <string>fbapi20131010</string>
  <string>fbapi20131219</string>
  <string>fbapi20140410</string>
  <string>fbapi20140116</string>
  <string>fbapi20150313</string>
  <string>fbapi20150629</string>
  <string>fbapi20160328</string>
  <string>fbauth</string>
  <string>fb-messenger-share-api</string>
  <string>fbauth2</string>
  <string>fbshareextension</string>
</array>
```

すべてのplaceholderをMetaアプリの値に置き換えます。Meta App DashboardのiOSプラットフォームにbundle IDを追加してください。詳しくはMetaの[iOSログインガイド](https://developers.facebook.com/docs/facebook-login/ios)を参照してください。

## Web

DOMが利用可能になってから、ほかのプラグインメソッドを呼び出す前にFacebook JavaScript SDKを初期化します。

```ts
import { FacebookLogin } from '@capacitor-community/facebook-login';

await FacebookLogin.initialize({
  appId: '[APP_ID]',
  locale: 'en_US',
});
```

AndroidとiOSではSDKをネイティブ側で設定するため、`initialize`は何も行いません。Webでoptionを省略した場合、Graph APIは`v26.0`、localeは`en_US`が既定値です。詳しくはMetaの[Webログインガイド](https://developers.facebook.com/docs/facebook-login/web)を参照してください。

## 次のステップ

- [認証](/docs/authentication)
- [App Events](/docs/app-events)
