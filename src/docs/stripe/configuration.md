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

:::message
この機能は実験的なものです。テストとフィードバックをお願いします。UIやアニメーションを提供したい場合や、課題を作成したい場合は、以下のページに移動してください。 https://github.com/stripe-elements/stripe-elements
:::

```bash
npm install @stripe-elements/stripe-elements
```

アプリの起動時に1度だけ、 `defineCustomElements()` を呼び出して実行します。

```diff ts
+ import { defineCustomElements } from '@stripe-elements/stripe-elements/loader';
+ defineCustomElements();
```

`@stripe-elements/stripe-elements` は StencilJS で作成されました。どこで定義するかわからない場合は、こちらのドキュメントをご覧ください。

https://stenciljs.com/docs/overview

### Angular

```diff ts:src/main.ts
  import { enableProdMode } from '@angular/core';
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  import { AppModule } from './app/app.module';
  import { environment } from './environments/environment';

+ import { defineCustomElements } from '@stripe-elements/stripe-elements/loader';

  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
+   .then(() => defineCustomElements(window))
    .catch(err => console.log(err));
```