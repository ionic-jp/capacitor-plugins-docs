---
title: はじめに
---

`@rdlabo/ionic-angular-kit` はIonic Angularアプリ向けの共有アプリケーション基盤です。製品固有の画面、ドメインポリシー、翻訳は利用側アプリに残します。

```sh
npm install @rdlabo/ionic-angular-kit
```

## 要件

| Package                        | 対応version |
| ------------------------------ | ----------- |
| Angular                        | 21.x        |
| Ionic Angular                  | 8.x         |
| RxJS                           | 7.8.x       |
| Capacitor core・feature plugin | 6.x〜8.x    |

Storageを使う場合は `@ionic/storage-angular` をinstallします。ほかのpeer dependencyはfeature単位です。選択したentry pointが使うCapacitor、Firebase、印刷、Live Update packageだけを追加してください。

## Entry point

| Import                                    | 役割                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `@rdlabo/ionic-angular-kit`               | Storage、Overlay、Guard、HTTP、Realtime、Directive、Keyboard、Utility |
| `@rdlabo/ionic-angular-kit/offline`       | スコープ付きLocal Replica、Outbox、Pull、Replay、Request Policy       |
| `@rdlabo/ionic-angular-kit/theme`         | Light/Dark Theme永続化とNative Status Bar同期                         |
| `@rdlabo/ionic-angular-kit/review`        | 頻度制御付きNative In-App Review                                      |
| `@rdlabo/ionic-angular-kit/printer`       | DOM-to-PNG、Brother Label、PDF helper                                 |
| `@rdlabo/ionic-angular-kit/auth-firebase` | Firebase依存配線と認証Flow                                            |
| `@rdlabo/ionic-angular-kit/live-update`   | Capawesome Live Update readiness provider                             |

Secondary entry pointにより、任意のNative依存・SDKをcore bundleから分離します。

## 必要な機能だけを設定する

多くの機能はproviderのcallbackを通じ、route、文言、credential、アプリ固有の副作用をKit外に保ちます。まず[Storage・Overlay](/ionic-angular-kit/docs/storage-overlays)を設定し、必要に応じて認証、Offline、Native機能を追加してください。
