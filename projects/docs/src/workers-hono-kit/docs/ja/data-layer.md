---
title: データ層
---

DB helperは `@rdlabo/workers-hono-kit/db` からimportします。このentry pointには `drizzle-orm` と `mysql2` が必要です。

## Hyperdrive database

`createHyperdriveDatabase()` はHyperdrive bindingからprimary・replica接続を遅延作成します。readはreplica query runner、write・transactionはprimary Drizzleを使います。invocation終了時の接続cleanupはWorkersが所有します。

```ts
import { createHyperdriveDatabase } from '@rdlabo/workers-hono-kit/db';
import { drizzle } from 'drizzle-orm/mysql2';

const db = createHyperdriveDatabase({
  primaryHyperdrive: env.DB_PRIMARY,
  replicaHyperdrive: env.DB_REPLICA,
  createOrm: (primary) => drizzle(primary, { schema }),
});

const rows = await db.read<Item>('SELECT * FROM items WHERE id = ?', [id]);
await db.write((dz) => dz.insert(items).values(input));
await db.transaction((tx) => tx.insert(items).values(input));
```

低レベルmysql2接続には `hyperdriveConnectionOptions()` を利用します。JavaScript Date変換の既定timezoneは `+09:00` ですが、MySQL session timezoneは変更しません。

## Write・retry

- `retryWhenDeadlock()` は `ER_LOCK_DEADLOCK` をexponential backoffでretryします。
- `insertIdOf()`、`affectedRowsOf()`、`insertedIdsOf()` はmysql2 write resultを正規化します。
- `withMysqlConnections()` はprimary・replica接続を並列で開きます。

## Drizzle・JST helper

共通columnには `jstTimestamp`、`jstDatetime`、`jstDate`、`decimalNumber` を使います。Custom timestamp typeは `.onUpdateNow()` を持たないため、更新時刻には `jstOnUpdateNow()` を組み合わせます。

`/business-time` entry pointはinstantとbusiness dateをJSTで変換します。

```ts
import { addBusinessDays, toBusinessDateTime } from '@rdlabo/workers-hono-kit/business-time';

toBusinessDateTime(new Date('2026-07-05T21:00:00Z'));
// '2026-07-06 06:00:00'

addBusinessDays('2026-07-06', 3);
// '2026-07-09'
```
