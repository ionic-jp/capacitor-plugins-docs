---
title: テスト・運用
---

## Testing entry point

`@rdlabo/workers-hono-kit/testing` はDB peer dependencyを必要とし、production codeからは読み込みません。

| Helper                                                          | 用途                                                      |
| --------------------------------------------------------------- | --------------------------------------------------------- |
| `createTestDb()`                                                | Drizzle migrationを適用したtest DBを作る。                |
| `FakeFirebaseVerifier`                                          | 登録済みin-memory Firebase tokenを検証する。              |
| `createPoolDatabase()` / `createNoopDatabase()`                 | Test用Database実装を提供する。                            |
| `authHeaders()` / `registerFirebaseToken()` / `provisionUser()` | 認証付きroute testを準備する。                            |
| `configurableFake()`                                            | 未設定memberで明示的に失敗するpartial fakeを作る。        |
| `fakeKv()` / `fakeQueue()`                                      | In-memory Workers binding fakeを使う。                    |
| Stripe fixture factory                                          | 型付きevent、session、subscription、price、intentを作る。 |

## Queue

`sendInChunks()` はWorkers subrequest上限内にqueue sendを分割します。`processBatch()` はmessage batchを逐次処理し、同時subrequestを1に抑えます。`queueDisposition: 'discard'` を明示したerrorはack、それ以外はretryします。`createQueueErrorHandler()` はloggingと任意の最終attempt reportingを追加します。

## 運用CLI

パッケージは開発AWS credential同期、subrequest fanout検査、DB baseline作成、Realtime bundle検査、Durable Object metrics照会のcommandを公開します。Infrastructureを変更する前に、インストール済みversionのCLIを使い `--help` を確認してください。

## Trust boundary

AWS、Firebase、AI Gateway、Stripe、DB clientはアプリ側で設定します。Domain固有credential、schema、認可policyを共有kitへ置かないでください。`createRolePolicy()` はstorage非依存のrole・relation mappingに限定し、roleとpermissionの正本はアプリが所有します。
