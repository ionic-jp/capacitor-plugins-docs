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

## iOSの構成

iOSの場合、設定なしで自動的にプラグインが読み込まれます。


## Webの構成

- [Vanila JS Quick start](/docs/vanilla-js)
- [Angular Quick start](/docs/angular)
- [React Quick start](/docs/react)
