---
title: "プラットフォームの構成"
code: []
scrollActiveLine: []
---

プラグインのインストールには、特別な設定は必要ありません。他のプラグインと同様にnpmからインストールし、 `sync` を実行するだけです。

```bash
npm install @capacitor-community/stripe
npx cap sync
```

## Androidの構成

`android/app/src/main/java/**/**/MainActivity.java` の初期化リストにプラグインを追加します：

```diff java:android/app/src/main/java/**/**/MainActivity.java
  package io.ionic.starter;

  import android.os.Bundle;
+ import com.getcapacitor.BridgeActivity;

  public class MainActivity extends BridgeActivity {
+     @Override
+     public void onCreate(Bundle savedInstanceState) {
+         super.onCreate(savedInstanceState);
+         registerPlugin(com.getcapacitor.community.stripe.StripePlugin.class);
+     }
  }
```

そして、プロジェクトの `android/variables.gradle` を更新します。

```diff
-    minSdkVersion = 22
-    compileSdkVersion = 33
+    minSdkVersion = 26
+    compileSdkVersion = 34
```

And add next block to `android/app/build.gradle`.

```diff
+ buildscript {
+   ext.kotlin_version = '2.0.+'
+   repositories {
+       google()
+       mavenCentral()
+   }
+   dependencies {
+     classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
+   }
+ }
+ apply plugin: 'kotlin-android'
```

## iOS configuration

```diff plist:ios/App/App/Info.plist
  	<key>UIViewControllerBasedStatusBarAppearance</key>
	  <true/>
    
+   <key>NSCameraUsageDescription</key>
+   <string>Need camera access for read credit card.</string>
  </dict>
```
In iOS, the plugin will be loaded automatically without any configuration.


## Webの構成

- [Vanila JS Quick start](/docs/vanilla-js)
- [Angular Quick start](/docs/angular)
- [React Quick start](/docs/react)
