---
title: "Configuration platform"
code: []
scrollActiveLine: []
---

No special settings are required to install the plugin. Just install it from npm like any other plugin, and run `sync`.

```bash
npm install @capacitor-community/stripe
npx cap sync
```

## Android configuration

In file `android/app/src/main/java/**/**/MainActivity.java`, add the plugin to the initialization list:

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

## iOS configuration

```diff plist:ios/App/App/Info.plist
  	<key>UIViewControllerBasedStatusBarAppearance</key>
	  <true/>
    
+   <key>NSCameraUsageDescription</key>
+   <string>Need camera access for read credit card.</string>
  </dict>
```
In iOS, the plugin will be loaded automatically without any configuration.


## Web configuration

- [Vanila JS Quick start](/docs/vanilla-js)
- [Angular Quick start](/docs/angular)
- [React Quick start](/docs/react)
