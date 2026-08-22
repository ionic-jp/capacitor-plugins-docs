---
title: Offline・Realtime
---

## スコープ付きOffline Runtime

`/offline` entry pointはuser・partition単位のLocal Replica、Durable Outbox、cursor-based delta pull、aggregate順のreplay、optimistic mutation policy、request-policy interceptorを提供します。

外部sourceやHTTP cacheには `mode: 'readCacheOnly'` を使います。Synchronized modeはiOS・Androidで暗号化された `@capacitor-community/sqlite` を使います。現在のruntimeにはcross-tab同期lockがないため、Webではfail fastします。

Cold start時のOffline Accessは、nullでない認証provider subjectに紐づくmanifestだけを復元します。Remote処理は次の順で開始します。

1. 検証済みRemote Sessionを準備する。
2. `remote` accessを公開する。
3. Pull、Outbox Replay、Realtime処理を再開する。

`createOfflineAuthBridge()` はこの順序を `provideKitAuth()` へ接続し、consent、error UI、credential交換をアプリ側に残します。

```ts
import { createOfflineAuthBridge, isOfflineFallbackError } from '@rdlabo/ionic-angular-kit/offline';

provideKitAuth(() => ({
  authState: () => auth.state$,
  ...createOfflineAuthBridge({
    exchange: async (context) => exchangeCredential(context),
    currentAuthSubject: () => auth.currentSubject(),
    isUnavailableError,
    availability: () => auth.authorityAvailable$,
  }),
  redirects,
}));
```

明示的なsign-outでは、先に `KitAuthAccessService` をclearし、その後Offline Session cleanupをawaitします。これにより永続user dataを削除する前に処理中のleaseを無効化します。

## Realtime接続

`KitRealtimeConnection` を継承し、接続意図と `{ url, protocols }` targetを指定します。Kitがforeground・network suspension、target単位のreconnect、exponential backoff、ping/pong検出、self-echo annotation、`reconnected$` による再同期通知を所有します。

認証情報と安定した `KIT_REALTIME_CLIENT_ID` はURL parameterでなく `kitRealtimeProtocols()` によるWebSocket subprotocolで渡します。Offline対応の認証clientは `requireRemoteAccess: true` を指定し、`none`・`local` modeではsocketを閉じたままにします。
