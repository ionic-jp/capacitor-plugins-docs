---
title: "I Was Doing Rich Programming — How Implementation Changes on Cloudflare Workers"
description: "Moving NestJS on EC2 to Hono on Cloudflare Workers made hidden costs visible: bundle size, 128 MB memory, subrequests, CPU time, Durable Object duration, and KV operations."
zennSlug: cloudflare-workers-after-rich-programming
emoji: "💸"
---

Until I moved to Cloudflare, I did not realize I had been doing rich programming.

I moved NestJS running on EC2 to Hono + Cloudflare Workers. RDS stayed as-is; ElastiCache's role moved to the Cloudflare side.

Install large SDKs. Load entire responses into memory. Wait for DB `SELECT`s in sequence. Run Cron jobs that finish every record. Keep SSE connections open. Read ElastiCache keys many times.

None of this is unusual. On my AWS setup it worked normally, and I had no reason to fix it. Server and cluster monthly costs absorbed it all.

On Cloudflare, each habit got a price tag: bundle size, 128 MB memory, network round trips, CPU time, Durable Objects duration, KV operations. Implementation weight that melted into the monthly bill suddenly became visible.

I was not trying to waste money. I was simply in a world where I did not need to count. I had been doing rich programming.

# Turning away from rich programming

Through the Cloudflare migration, I revisit five implementation habits whose accounting changed.

## 1. Choose packages by runtime and responsibility

If there is an official SDK, install it. A normal decision. Auth, retries, types, and bundled operations come together; even unused features barely changed the EC2 invoice. `npm install` was a chore more than a design choice.

Workers run on V8 isolates centered on Web standard APIs, not Node.js processes. Even with `nodejs_compat`, it is not Node.js itself, and some imports are stubs only. I do not trust install and build; I run the code paths I actually use on Workers first, then compare capacity and responsibility.

### Measure bundle size and choose

Workers have a compressed Worker size limit. As of August 2026, the Free plan is 3 MB and the Paid plan is 10 MB. Unlike a frontend bundle that users download every time, this is the budget for the entire deploy artifact.

Measuring a minimal Worker that only verifies ID tokens, gzip sizes looked like this:

| Implementation | gzip |
| --- | ---: |
| `firebase-admin` 14.2.0 | 251.30 KiB |
| `@hono/firebase-auth` 1.4.2 + Hono | 33.65 KiB |
| `jose` 6.2.3 | 10.98 KiB |

For a single AWS Secrets Manager operation, `@aws-sdk/client-secrets-manager` was 70.64 KiB and `aws4fetch` was 8.31 KiB.

All fit within the limit. So this is not "firebase-admin is heavy, therefore forbidden." It is how much budget remains for the rest of the application after auth alone, or after one AWS API.

So I choose from the responsibility the backend bears, not the package name. If I need Firebase user management, Admin SDK; if I only need ID token signature and claim verification, `jose`. For AWS, if I only need a few operations, SigV4 `fetch()`, and I narrow what I own for retries and protocol tracking myself.

### Small is not automatically right

Dropping an SDK means owning retries and spec tracking myself. I choose in this order: does it run on Workers, is the responsibility needed, can I maintain it — not smallest first.

## 2. Memory is a pass-through, not spare room

If memory is available, put cache and arrays there. Also a normal decision. If it runs out, use a bigger instance. Add shelves and the room looks wider without tidying.

### 128 MB is shared per isolate across requests

Workers memory limits are 128 MB per isolate on both Free and Paid. The same isolate may handle multiple requests; module scope is not exclusive to a single request.

So I separated things that may disappear when shared, request-local state, and state that must survive across requests. I do not put the current user in globals, and I do not reuse DB connections in an ordinary Worker.

### Stop reading everything before responding

Loading a large file into `arrayBuffer()` at once can hold input and output simultaneously. Stream what can be streamed. If I do not need to read everything, I do not. I think of memory as a pass-through, not storage.

## 3. Execution time is about shape, not length

On EC2 I looked at whether processing finished. On Workers I separate CPU time from time waiting on externals.

### Separate CPU time from elapsed time

Workers CPU time does not include network time waiting on `fetch()` or DB queries. So "DB wait immediately hits the CPU limit" is not correct.

But users wait for the response, not CPU time. Even unpaid wait time does not stop the user's clock.

### A nearby DB hid serial SELECT

```ts
const user = await findUser(userId);
const status = await findStatus(userId);
const notifications = await findNotifications(userId);
```

When EC2 and RDS were in the same region, this looked fast enough. But when the Worker and DB are far apart, three `await`s mean three round trips. Cloudflare did not slow it down; a nearby DB had hidden serial processing.

I parallelize independent queries and combine SQL when reading the same set.

```ts
const [user, status, notifications] = await Promise.all([
  findUser(userId),
  findStatus(userId),
  findNotifications(userId),
]);
```

Then I use Placement to move the Worker closer to the DB. Reduce round trips first; then shrink distance.

### Do not finish all records in one Cron run

On EC2 Cron I fetched all targets and called external APIs for N records in one process. On Workers a single job has boundaries. So Cron sends IDs to a Queue, and consumers process at most 10 at a time.

Total work does not shrink. But if something fails midway, I retry at most a batch of 10, not everything. Queues may deliver duplicates rarely, so processing must tolerate duplication. I stopped heroic Cron jobs and made failure small.

### Do not leave post-response work on the process

Post-response work is the same. On EC2, `void notify()` could finish by chance because the process stayed alive. "I replied; handle the rest in the background" worked. On Workers, short best-effort work goes to `waitUntil()`; work needing retry or delivery guarantees goes to a Queue. `waitUntil()` is not a background job system.

## 4. Connections: not "can I hold them" but "who stays awake"

For notifications, keep SSE open. For the DB, hold a connection pool. On a long-lived Node.js process, both are natural.

### From SSE to WebSocket Hibernation

On EC2 I could keep SSE connected even with no notifications. The server was already awake; one quiet connection did not change the invoice.

On Workers I use a Durable Object to aggregate connections per user. But notifications are rare, and SSE prevents hibernation. For one notification per hour, it is like leaving the lights on for an hour.

So I moved to WebSocket Hibernation so the Durable Object can sleep while connections remain. WebSocket is not always the answer. What matters is who stays awake during silence.

### Do not hold a DB connection pool myself

On Node.js I kept a connection pool globally. On Workers I create a client per call and leave the RDS connection pool to Hyperdrive. I did not discard the pool; I changed where it lives.

## 5. Split ElastiCache's "read all you want, write all you want"

ElastiCache is already running, so ~30 `GET`s are fine. Also a normal decision. While the cluster holds up, one `GET` or a hundred look the same on the monthly bill. The invoice does not say "you wasted GETs this month."

### Split KV and Cache API by sharing scope

At first I moved Redis keys to KV keys as-is. A clean port — until I read the pricing table.

KV counts reads and writes per key; reading a missing key still counts as one. Access that melted into the monthly bill became metered numbers, and I started asking whether I really needed 30 reads.

Now I split by sharing scope:

| Requirement | Where |
| --- | --- |
| Regenerable if lost; fine for short use in the same colo | Cache API |
| Read from multiple colos; eventual consistency acceptable | Workers KV |
| Aggregate processing for the same ID; strongly consistent storage needed | Durable Objects |
| Source of truth for persistent data | DB |

ID sets used in list views go into one Cache API key; only what must cross colos stays in KV. Not to be stingy with KV, but so I do not port ElastiCache-hidden waste into metered billing.

# This is not poverty programming

Rich programming is not an insult. It means the platform had enough headroom that I did not need to count. The problem was carrying those habits unchanged to another platform.

Cloudflare is quite rich too. Connection pools go to Hyperdrive, short-lived cache to Cache API, retriable work to Queues. But I borrow from what it is good at instead of holding all of that in one Node.js process.

Install because there is an official SDK. Store because there is memory. Wait in sequence because the DB is close. Keep SSE because the server is awake. Read 30 times because ElastiCache exists. I did all of these. Probably many people do.

What changed in the Cloudflare migration was the lens: from "does it work" to "who holds what, where, and for how long." Doing unnecessary work is worse. An obvious conclusion — but I did not notice until the environment changed.

See you next time.
