---
title: API
---

Public entry-point map for `@rdlabo/workers-hono-kit` v0.10.6. Import from the narrowest entry point so Worker bundles include only the required infrastructure.

## Entry points

#### `module` @rdlabo/workers-hono-kit

Core HTTP, authentication, Firebase verification, AWS signing, error handling, pagination, validation, logging, and middleware exports.

#### `module` @rdlabo/workers-hono-kit/db

Drizzle configuration, secret resolution, decimal and JST column helpers, baseline migrations, and guarded-payment recovery.

#### `module` @rdlabo/workers-hono-kit/business-time

Branded business date and datetime values with parsing, formatting, day-boundary, date arithmetic, and age calculations.

#### `module` @rdlabo/workers-hono-kit/offline

Snapshot cursors, journal retention and mutation helpers, and offline wire-compatibility negotiation.

#### `module` @rdlabo/workers-hono-kit/realtime

Cloudflare Durable Object WebSocket upgrade, hibernation, broadcast, close, retry, invocation, and protocol helpers.

#### `module` @rdlabo/workers-hono-kit/testing

Database, Firebase, authentication, Stripe fixture, KV, Queue, and configurable-fake utilities for deterministic tests.
