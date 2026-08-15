---
title: はじめに
---

`@rdlabo/workers-hono-kit` はCloudflare Workers上のHono向けインフラストラクチャhelperです。ドメインロジック、DB schema、アプリ固有ポリシーは利用側に残します。

```sh
npm install @rdlabo/workers-hono-kit
```

使用する機能に必要なpeer dependencyだけを追加します。

```sh
# HTTP、validation、Firebase、AWS
npm install hono zod @hono/zod-validator jose aws4fetch

# Data layerとtesting
npm install drizzle-orm mysql2

# AI Gateway
npm install ai ai-gateway-provider
```

Stripeはkitの直接依存です。パッケージは型宣言付きのcompiled ESMで、`fetch`、`crypto.subtle`、`Response`などWeb標準APIを使います。toolingにはNode.js 20以降が必要です。

## エントリポイント

| Import                                   | 責務                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `@rdlabo/workers-hono-kit`               | HTTP、認証、エラー、Firebase、AWS、AI、Stripe、KV、Queue、Realtime基本機能 |
| `@rdlabo/workers-hono-kit/db`            | Hyperdrive、MySQL、Drizzle、migration、JST column                          |
| `@rdlabo/workers-hono-kit/business-time` | JST business date・datetime                                                |
| `@rdlabo/workers-hono-kit/offline`       | Offline replica wire、cursor、journal、互換性契約                          |
| `@rdlabo/workers-hono-kit/realtime`      | Durable Object WebSocket・retry helper                                     |
| `@rdlabo/workers-hono-kit/testing`       | Test DB、認証helper、fake、Stripe fixture                                  |

Subpath importにより、任意のDB・testing依存をroot runtimeから分離します。
