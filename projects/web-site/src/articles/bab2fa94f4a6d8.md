---
title: "Two Snags When Updating a Static Prerender Site to Angular 19"
description: "While upgrading Angular prerender sites to v19, I hit a TS2315 Http2ServerResponse generic error fixed by reinstalling node_modules and Sass @import deprecation warnings addressed with sass-migrator."
zennSlug: bab2fa94f4a6d8
emoji: "🦔"
---

These sites use Angular prerender and are hosted as static sites:

https://benaton.net/

https://concent-market.com/

The owner updates content on GitHub. With raw HTML, it is easy to accidentally delete a `>`; I have them edit TypeScript files instead so type checking fails when something breaks. Updates look like this:

https://github.com/le-benaton/website/blob/main/src/data/news.ts#L1-L12

Most other static sites I maintain are Angular as well. With few non-Angular dependencies, I ran `ng update` to Angular 19 right away. Here are two places I got stuck.

## 1. ✘ [ERROR] TS2315: Type 'Http2ServerResponse' is not generic. [plugin angular-compiler]

```
✘ [ERROR] TS2315: Type 'Http2ServerResponse' is not generic. [plugin angular-compiler]

    node_modules/@angular/ssr/node/index.d.ts:190:100:
      190 │ ...rResponse | Http2ServerResponse<Http2ServerRequest>): Promise<...
```

A type error. It looked like stale dependencies; reinstalling `node_modules` fixed it.

```bash
% rm -r -f node_modules package-lock.json && npm i
```

## 2. Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

This is not a hard error, but Dart Sass now warns that current `@import` behavior will be removed in 3.0.0. Details are here:

https://sass-lang.com/documentation/breaking-changes/import/

The `sass-migrator` package migrates files that trigger the warning:

```
$ npm install -g sass-migrator
$ sass-migrator module --migrate-deps your-entrypoint.scss
```

If you only used `@import` like plain CSS, this migration is usually enough. If you relied heavily on mixins and Sass variables, it may be worth planning a move toward CSS variables and related rewrites.

See you next time.
