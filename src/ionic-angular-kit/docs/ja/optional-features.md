---
title: 任意機能
---

任意機能はsecondary entry pointを使い、利用しないNative plugin・SDKがアプリへ入らないようにします。

## Theme・Review

`provideKitTheme()` と `KitThemeController` はuser設定を永続化し、overrideされるまでは `prefers-color-scheme` に追従し、アプリ指定のpalette classを切り替え、Android Status Barを同期します。

```ts
provideKitTheme({
  storageKey: 'theme',
  darkClasses: ['ion-palette-dark'],
  lightClasses: ['ion-palette-light'],
});
```

`/review` から `kitRequestReview()` をimportすると、アプリが指定した期間に一度だけNative Review Dialogを要求します。Webでは何もしません。

## Printer

`/printer` entry pointにはDOM-to-PNG、画像回転、Brother Print設定、複数pageのlabel layout、PDF生成のpure helperがあります。Paper選択UI、Loading Overlay、Storage、Transport、copy policyは利用側アプリが所有します。

## Firebase認証

`/auth-firebase` entry pointは `provideKitFirebase()` で `firebase/auth` を初期化し、`KIT_FIREBASE_AUTH` と `kitSignIn`、`kitSignUp`、`kitSignOut`、`kitResolveAuthStatus`、`kitReauthWithRetry` などのflow helperを公開します。

KitはUIを実行しません。Loading、Navigation、Error表示はhookを通じてアプリへ戻します。Social providerは `/auth-firebase/social` にさらに分離されています。

## Live Update

`/live-update` の `provideLiveUpdateReadiness()` はAngularのstable、最初のroute完了、1 animation frameを待ってからCapawesome `LiveUpdate.ready()` を呼びます。Webでは何もしません。

Live Updateが置き換えるのは既存Native BinaryのWeb層だけです。Native code、Capacitor設定、plugin versionの変更にはStore Buildと新しいbuild-number固有channelが必要です。
