---
title: "Firebase Admin Auth Worked on Cloudflare Workers—Why I Still Verify ID Tokens With jose"
description: "Compare firebase-admin, @hono/firebase-auth, and jose on Workers; keep a small verifier aligned with Firebase's official JWT checks."
zennSlug: workers-hono-firebase-id-token
emoji: "🔥"
---

When I migrated from NestJS to Hono + Cloudflare Workers, I assumed the Firebase Admin SDK would not work. Workers are not Node.js itself, and I thought `nodejs_compat` could not run `fs`-related paths that load service accounts or Application Default Credentials.

In my app, frontend and backend are split by a REST API. The frontend logs in with the Firebase SDK and sends the ID token as `Authorization: Bearer`. The backend only verifies signature and claims and receives `uid`; it does not handle login or Firebase user management.

For migration I delegated crypto to `jose`, which runs on Web Crypto, and put Firebase-specific verification rules in a small verifier. Workers' Node.js compatibility has expanded, though. Ordinary `verifyIdToken(token)` does not need a service account either. I re-tested whether my original assumption was wrong with current `firebase-admin`.

# How far the official SDK got

With `firebase-admin` 14.2.0 and Wrangler 4.120.0, I verified local workerd and Cloudflare production runtime. Firebase Admin Auth behaved as follows.

| Check | Result | Used in my app |
| --- | --- | --- |
| `verifyIdToken(token)` | Works locally and in production without credentials | Yes |
| Real `kid` with fake signature | Rejected as `invalid signature` locally and in production | Tests only |
| `verifyIdToken(token, true)` | Works locally and in production with service account JSON | No |
| `getUser()` | Works locally and in production with service account JSON | No |

Using ID tokens issued in my running dev environment, I confirmed `uid`, `aud`, and `iss` matched on both local and Cloudflare production. Revocation checks and user fetch need Google Auth credentials; for those checks I passed service account JSON explicitly.

## The boundary without extra flags is `2025-08-15`

`nodejs_compat` behavior depends on `compatibility_date`, not just the flag. With the same code and a real Firebase ID token, rolling the date back gave:

| Setting | Bundle | `verifyIdToken()` |
| --- | --- | --- |
| No `nodejs_compat` (`2026-08-08`) | Fail | Cannot run |
| `nodejs_compat` + `2024-09-22` | Fail | Cannot run |
| `nodejs_compat` + `2024-09-23`–`2025-08-14` | Success | Fails with `https.request is not implemented yet` |
| `nodejs_compat` + `2025-08-15` or later | Success | Success |

`2024-09-23` enables `nodejs_compat_v2` automatically so Firebase Admin SDK can bundle. ID token verification, however, fetches Google's public keys through Node.js HTTP client APIs. `enable_nodejs_http_modules`, which enables `http.get()` and `http.request()`, applies automatically from `2025-08-15` onward.

What blocked me before was not signature verification but the Node.js HTTP client API used to fetch public keys. My `compatibility_date = "2025-09-23"` works because it passes the `2025-08-15` boundary.

If you keep an older compatibility date, I also succeeded verifying real tokens with `enable_nodejs_http_modules` explicitly set at `2024-09-23`. Cloudflare still recommends the latest Wrangler and compatibility date.

[Cloudflare official: Node.js HTTP compatibility flags](https://developers.cloudflare.com/workers/runtime-apis/nodejs/http/#compatibility-flags)

This is from switching dates with current Wrangler and Firebase Admin SDK, not reproducing every old SDK version. I confirmed production runtime at `2026-08-08`.

Comparing Workers that only verify ID tokens with `wrangler deploy --dry-run`, bundle size was:

| Implementation | Total Upload | gzip |
| --- | ---: | ---: |
| `firebase-admin` 14.2.0 | 1,336.24 KiB | 251.30 KiB |
| `@hono/firebase-auth` 1.4.2 + Hono | 145.08 KiB | 33.65 KiB |
| `jose` 6.2.3 | 47.98 KiB | 10.98 KiB |

The three verification Workers are measured values; `@hono/firebase-auth` includes Hono itself. This is not a speed comparison. Workers deploy limits are 3 MB compressed on Free and 10 MB on Paid, so using ~251 KiB vs ~11 KiB for auth alone affects headroom for other dependencies.

[Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/#worker-size)

I verified Firebase Admin Auth only—not Firestore, Messaging, or Storage. Still, "Firebase Admin Auth does not work on Workers" does not match the current combination.

# Why I kept the `jose` version

Hono has `@hono/firebase-auth` 1.4.2. The name sounds like an official Firebase SDK adapter, but the README marks it as third-party middleware and it uses `firebase-auth-cloudflare-workers` internally.

That implementation verifies ID tokens with Web standard APIs only and can cache public keys in Workers KV. It also verified valid ID tokens from the same dev environment correctly.

[@hono/firebase-auth README](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)

All three can verify ID tokens. The difference is not "does it work?" but how well each fits what my backend is responsible for.

| Option | Decision for this setup |
| --- | --- |
| `firebase-admin` | Official SDK. Strong if you need revocation checks or user management; overkill here |
| `@hono/firebase-auth` | Lightweight for Workers. Strong if you want it closed as Hono middleware |
| `jose` + shared verifier | Chosen because ID token verification alone can stay independent of Hono and shared across services |

If each request only needs public-key ID token verification, pulling Admin SDK's Node dependency graph into the auth path has little benefit. `@hono/firebase-auth` also meets requirements, but I kept the `jose` version to share an existing `FirebaseVerifier` interface and tests independent of Hono.

Firebase also publishes verification conditions for third-party JWT libraries. I did not guess a custom spec—I implemented official conditions with `jose` and fixed what tests can cover.

[Firebase official: Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library)

# Verifying ID tokens on Workers

Decoding a JWT is not enough—you need signature, issuer, and audience before it counts as authentication.

## Decode alone is not authentication

Split a JWT on `.` and base64url-decode the payload and you can read it. That does not verify the signature. An attacker could craft a token with arbitrary `sub` or `email`.

At minimum you need:

- Header `alg` is `RS256`
- Signature is valid with Google's public key for `kid`
- `aud` is your Firebase project ID
- `iss` is `https://securetoken.google.com/<projectId>`
- `exp` is in the future
- `iat` and `auth_time` are not in the future
- `sub` is non-empty and at most 128 characters

Firebase publishes verification conditions for third-party libraries, so I used those as the basis for implementation and tests.

## Use a remote JWK set

Firebase ID token signing keys rotate. I do not pin public keys in source; I fetch from Google's JWK endpoint.

```ts
import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/' +
      'securetoken@system.gserviceaccount.com',
  ),
);
```

Firebase's third-party verification guide lists an x509 public key URL. This implementation passes Google's JWK endpoint that returns the same securetoken signing keys to `jose`. `createRemoteJWKSet()` resolves the key for `kid` and caches fetch results.

## Always pin issuer and audience

A signature valid with Google's key does not guarantee a token for your project.

```ts
async function verifyIdToken(idToken: string, projectId: string) {
  const now = Math.floor(Date.now() / 1000);

  const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ['RS256'],
    requiredClaims: ['exp'],
    currentDate: new Date(now * 1000),
    clockTolerance: 0,
  });

  if (
    !payload.sub ||
    typeof payload.sub !== 'string' ||
    payload.sub.length > 128
  ) {
    throw new Error('invalid subject');
  }
  if (!Number.isFinite(payload.exp)) {
    throw new Error('invalid exp');
  }
  if (
    typeof payload.iat !== 'number' ||
    !Number.isFinite(payload.iat) ||
    payload.iat > now
  ) {
    throw new Error('invalid iat');
  }
  if (
    typeof payload.auth_time !== 'number' ||
    !Number.isFinite(payload.auth_time) ||
    payload.auth_time > now
  ) {
    throw new Error('invalid auth_time');
  }

  return { ...payload, uid: payload.sub };
}
```

My first version checked signature, issuer, audience, and expiry and stopped there. Comparing with official conditions, I also had to reject empty subject, future `iat`, and future `auth_time` explicitly. workers-hono-kit 0.9.6 adds this timestamp validation in my shared package.

## Minimal setup as a library

So I do not rewrite verification every time, the verifier lives in `@rdlabo/workers-hono-kit`. For ID token verification alone, no service account is required.

```bash
npm install @rdlabo/workers-hono-kit
```

```ts
import { createRemoteFirebaseVerifier } from '@rdlabo/workers-hono-kit';

const verifier = createRemoteFirebaseVerifier('my-firebase-project-id');
const decoded = await verifier.verifyIdToken(idToken);

console.log(decoded.uid);
```

`createRemoteFirebaseVerifier()` reuses Google's remote JWK set and a per-project verifier within an isolate. It is token verification only—no `getUser()` or `deleteUser()`. That limited responsibility fits this backend.

[workers-hono-kit remote verifier](https://github.com/rdlabo-dev/workers-hono-kit/blob/main/src/firebase/remote-verifier.ts)

## Close it in Hono middleware

Reading Bearer tokens in each route leads to missed verification. I verify in Hono middleware and use only `uid` on Context afterward.

```ts
app.use('/api/*', async (c, next) => {
  const authorization = c.req.header('authorization');
  const token = authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return c.json({ message: 'Unauthorized' }, 401);

  try {
    const decoded = await verifier.verifyIdToken(token);
    c.set('firebaseUid', decoded.uid);
    await next();
  } catch {
    return c.json({ message: 'Unauthorized' }, 401);
  }
});
```

Do not return token contents or verification errors directly to clients. Internal logs should not print the JWT itself.

# What verification alone does not decide

Even with signature verification implemented, whether to include revocation checks and how to test are separate decisions.

## Revocation is a different problem

Public-key JWT verification checks signature and claims offline. It does not include revoked-token checks like Admin SDK's `verifyIdToken(token, true)`.

If you must reflect forced logout or post-password-change invalidation immediately, you need extra online checks—querying Firebase user state or maintaining your own session version. That adds external I/O on every auth request.

What this backend guarantees is verification of signature and claims on the JWT received in the request. I did not include immediate token revocation in auth requirements and did not adopt per-request online checks against Firebase user state. That boundary is a choice in my app, not something `jose` decides automatically.

If you need revocation checks or multiple Admin features, the official SDK lets you avoid owning that implementation. This article's approach fits when each request only needs ID token verification and you can pin verification claims in tests. In exchange for size, you accept responsibility to track conditions the Admin SDK would have handled implicitly.

## Generate keys in tests

Calling the real Google JWK endpoint from unit tests ties you to network and key rotation. In tests I generate an RSA key pair, sign Firebase-shaped tokens with the private key, and inject the public key into the verifier.

Boundaries I verify:

- Valid token
- Wrong project `aud` / `iss`
- Expired or missing / non-finite `exp`
- `sub` longer than 128 characters
- Missing, future, or non-finite `iat`
- Missing, future, or non-finite `auth_time`

# Summary

The frontend logs in; the backend only verifies the ID token received over REST. That is this setup.

Current `firebase-admin` verified valid tokens, revocation checks, and `getUser()` on both local workerd and Cloudflare production. `@hono/firebase-auth` also verified the same tokens. You do not need a separate implementation solely because "Firebase Admin Auth does not work on Workers."

I still kept the `jose` version to keep only what the Workers auth path needs small, aligned with official verification conditions. It matched an interface independent of Hono, reuse across services, a bundle that consumes less of the deploy limit, and injectable keys in tests.

A JWT is not safe with signature alone, nor with decode alone. Verify Google's rotating keys, project-specific issuer/audience, time claims, and subject—and treat revocation as a separate requirement.

What I shrank, I also own: conditions the Admin SDK would have guarded implicitly.

See you next time.
