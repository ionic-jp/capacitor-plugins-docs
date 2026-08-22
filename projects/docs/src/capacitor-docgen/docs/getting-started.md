---
title: Getting Started
---

`@rdlabo/capacitor-docgen` is an independently maintained enhancement fork of Ionic's [`@capacitor/docgen`](https://github.com/ionic-team/capacitor-docgen). It keeps the upstream CLI, Markdown placeholders, output helpers, and exported functions, while extending the parser result and generated content with interface inheritance.

The comparison in these docs is pinned to `@rdlabo/capacitor-docgen@0.4.1` and upstream `@capacitor/docgen@0.3.1`, the current npm releases. It does not imply that the fork is an official Ionic package.

## Install

```sh
npm install --save-dev @rdlabo/capacitor-docgen
```

Use the same `docgen` command and flags as upstream:

```sh
npx docgen --api MyPlugin --output-readme README.md --output-json dist/docs.json
```

The input README must already contain the placeholders that docgen updates:

```md
<docgen-index></docgen-index>

<docgen-api></docgen-api>
```

Do not install both packages as direct dependencies in one project: both publish the `docgen` binary. Choose the fork when inherited interface members must appear in generated documentation.

## Inheritance enhancement

Upstream records only the members written directly in an interface. The fork also reads a TypeScript `extends` clause and appends methods and properties from the resolved base interface.

```ts
export interface SharedOptions {
  requestId?: string;
}

export interface CreateOptions extends SharedOptions {
  value: string;
}

export interface MyPlugin {
  create(options: CreateOptions): Promise<void>;
}
```

With the fork, the generated `CreateOptions` table contains both `value` and `requestId`. The fork can also resolve a base named through a type alias when that alias points to an interface.

The released fork README says to add an `@extends` JSDoc tag. That instruction is stale for v0.4.1: the implementation reads the TypeScript heritage clause directly and does not use the tag to resolve inheritance. Write valid TypeScript `extends`; an `@extends` tag is not required.

See [Differences from upstream](./upstream-differences) for the exact changed surfaces and current limitations.

## Pinned sources

- [Fork parser v0.4.1](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/src/parse.ts)
- [Fork public types v0.4.1](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/src/types.ts)
- [Upstream parser v0.3.1](https://github.com/ionic-team/capacitor-docgen/blob/v0.3.1/src/parse.ts)
- [Upstream public types v0.3.1](https://github.com/ionic-team/capacitor-docgen/blob/v0.3.1/src/types.ts)
