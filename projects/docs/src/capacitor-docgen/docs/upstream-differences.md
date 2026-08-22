---
title: Differences from Upstream
---

This comparison covers the published npm packages `@rdlabo/capacitor-docgen@0.4.1` and `@capacitor/docgen@0.3.1`. The fork is based on the Ionic project, but is published and maintained separately by rdlabo.

## Compatibility summary

| Surface                             | Upstream 0.3.1                                                                                          | rdlabo fork 0.4.1                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Package                             | `@capacitor/docgen`                                                                                     | `@rdlabo/capacitor-docgen`                            |
| Binary                              | `docgen`                                                                                                | `docgen`                                              |
| CLI flags                           | `--api` (`-a`), `--output-readme` (`-r`), `--output-json` (`-j`), `--project` (`-p`), `--silent` (`-s`) | Same                                                  |
| README placeholders                 | `<docgen-index>`, `<docgen-api>`                                                                        | Same                                                  |
| Core exports                        | `generate`, `parse`, output helpers, `run`, public types                                                | Same                                                  |
| Interface heritage metadata         | Not exposed                                                                                             | `DocsInterface.extends: string[]`                     |
| Inherited methods and properties    | Not expanded                                                                                            | Appended from resolved base interface objects         |
| Primary API inheritance             | Only directly declared API members                                                                      | Resolved base object members are appended to the API  |
| Base interface through a type alias | Not resolved for inheritance                                                                            | Alias `complexTypes` are used to find base interfaces |

The published tarballs have byte-identical compiled modules for CLI parsing, generation, Markdown handling, output formatting, and TypeScript program creation. The behavioral implementation changes are confined to `dist/parse.js`; the public declaration change is in `dist/types.d.ts`. Package metadata and README content also differ.

## What the parser adds

For each top-level interface, the fork stores the text of its TypeScript heritage expressions in `DocsInterface.extends`. When docgen collects that interface, it:

1. keeps a base name that directly matches a parsed interface;
2. resolves a matching type alias to its referenced `complexTypes`;
3. finds the resulting base interfaces; and
4. appends the methods and properties currently held by those base interface objects to the derived interface.

Since v0.4.1 the same collection runs for the primary API interface, so a plugin API can inherit methods from a base plugin interface. In v0.4.0 the flattening occurred only for supporting interfaces.

## Observable output

Given a derived options interface, upstream emits only members declared directly on that interface. The fork emits those members followed by the members currently present on its resolved base interface object. Raw JSON and the generated Markdown table therefore contain inherited members, and the programmatic result includes the `extends` array.

Collection mutates the shared parsed interface objects in place. If another API member causes a base interface to be collected and expanded first, that base object already contains copied ancestor members when a later derived interface uses it. Those indirect members then propagate to the derived interface. Output can therefore depend on member collection order even though the code does not recursively walk the entire heritage chain in one operation.

The existing CLI flags, placeholder replacement, heading generation, JSON writer, and exported functions otherwise keep upstream behavior.

## Current boundaries

The enhancement is intentionally a small parser extension, not full TypeScript type flattening:

- It does not recursively flatten an entire multi-level heritage chain in one collection operation. However, in-place mutation means a base expanded earlier can pass its already-copied ancestor members to a later derived interface; without that earlier collection, the same derived interface receives only the base's original direct members.
- A child member that overrides a base member is not reconciled by name. Both entries can appear because deduplication uses object identity.
- Heritage matching is name-based against parsed top-level interfaces. Qualified expressions and declaration merging are not normalized by the enhancement.
- The package still uses the same TypeScript `~4.2.4` parser dependency and Node.js `>=18` engine declaration as upstream 0.3.1.
- Both packages expose the same `docgen` binary, so they should be alternatives rather than simultaneous direct dependencies.

These boundaries, including both collection orders, are contract-tested in this documentation repository so the comparison changes when a future fork release changes behavior.

## Release lineage

- Fork v0.3.x introduced the separately published `@rdlabo/capacitor-docgen` package and early inheritance handling.
- Fork v0.4.0 switched inheritance discovery to TypeScript heritage clauses, added `DocsInterface.extends`, resolved interface aliases, and expanded inherited methods and properties.
- Fork v0.4.1 applied inheritance expansion to the primary API interface as well.

Review the pinned [fork v0.4.1 source](https://github.com/rdlabo-dev/capacitor-docgen/tree/v0.4.1) and [upstream v0.3.1 source](https://github.com/ionic-team/capacitor-docgen/tree/v0.3.1) when evaluating later versions.
