---
title: 'はじめに'
code: []
scrollActiveLine: []
---

## 概要

Android、iOS、Web向けのFacebook LoginとFacebook App Eventsを提供するCapacitor Communityプラグインです。AndroidとiOSではネイティブのMeta SDK、WebではFacebook JavaScript SDKを使用します。

## 機能

- Facebookへのログインとログアウト、ネイティブでのデータアクセス再認証
- 現在のアクセストークン取得
- Facebook Graph APIによるプロフィール取得
- 文字列・数値パラメータに対応したFacebook App Events
- ネイティブのApp Eventと広告主向け設定

## クイックスタート

[インストール](#インストール)と各プラットフォームの設定を完了したあと、アプリに必要な権限をリクエストします。

```ts
import { FacebookLogin } from '@capacitor-community/facebook-login';

const result = await FacebookLogin.login({ permissions: ['email'] });

if (result.accessToken) {
  console.log('Facebook login completed.');
}
```

## インストール

このプラグインはCapacitor 8、iOS 15以降、Android API 24以降を対象としています。CocoaPodsとSwift Package Managerの両方で、ネイティブFacebook SDKへの依存関係を宣言します。

```bash
npm install @capacitor-community/facebook-login
npx cap sync
```

Capacitorのメジャーバージョンと一致するプラグインのメジャーバージョンをインストールしてください。

| Capacitor | Plugin |
| --------- | ------ |
| 8         | 8.x    |
| 7         | 7.x    |
| 6         | 6.x    |

プラグインを呼び出す前に、[設定](/docs/configuration)に記載されたネイティブとWebの必須設定を完了してください。

## ドキュメント

まず[設定](/docs/configuration)を行い、実装する機能に応じたガイドを参照してください。メソッドのシグネチャと生成された型情報は[API](/docs/api)にあります。

- [設定](/docs/configuration) — Metaアプリの設定とAndroid・iOS・Web SDKのセットアップ
- [認証](/docs/authentication) — ログイン、ログアウト、現在のトークン、プロフィール項目、再認証、プラットフォーム差異
- [App Events](/docs/app-events) — カスタムイベント、パラメータ、自動イベント記録、広告主向け設定
