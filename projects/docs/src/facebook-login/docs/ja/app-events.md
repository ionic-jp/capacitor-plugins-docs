---
title: 'App Events'
code: []
scrollActiveLine: []
---

Facebook App Eventsを記録する前に[設定](/docs/configuration)を完了してください。

## プラットフォームごとの動作

| Method                             | Android                 | iOS  | Web          |
| ---------------------------------- | ----------------------- | ---- | ------------ |
| `logEvent`                         | 対応                    | 対応 | 対応         |
| `setAutoLogAppEventsEnabled`       | Promiseがpendingのまま  | 対応 | 何もしない   |
| `setAdvertiserTrackingEnabled`     | 未実装                  | 対応 | 何もしない   |
| `setAdvertiserIDCollectionEnabled` | Promiseがpendingのまま  | 対応 | 何もしない   |

## イベントを記録する

```ts
import { FacebookLogin } from '@capacitor-community/facebook-login';

await FacebookLogin.logEvent({
  eventName: 'completed_tutorial',
  parameters: {
    content_name: 'Getting Started',
    step: 3,
  },
});
```

parameterの値には文字列または数値を指定します。それ以外の型はpublic APIに含まれず、ネイティブ実装では無視されます。

## 自動イベントと広告主向け設定

iOSでは次の設定をawaitできます。

```ts
await FacebookLogin.setAutoLogAppEventsEnabled({ enabled: true });
await FacebookLogin.setAdvertiserIDCollectionEnabled({ enabled: true });
await FacebookLogin.setAdvertiserTrackingEnabled({ enabled: true });
```

iOSアプリで必要な場合は、広告トラッキングを有効にする前にApp Tracking Transparencyの許可を別途リクエストしてください。

Androidでは`setAutoLogAppEventsEnabled`と`setAdvertiserIDCollectionEnabled`が指定値を適用しますが、現在は返されるPromiseがpendingのままになります。`setAdvertiserTrackingEnabled`はAndroidでは未実装です。Webでは3つのメソッドとも何も行いません。
