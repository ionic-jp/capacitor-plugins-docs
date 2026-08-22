# rdlabo-docs

`rdlabo-docs` is the bilingual documentation portal for rdlabo OSS. It generates static Angular pages from source packages (pinned in `package-lock.json`) and Markdown under `projects/docs/src/{project}/docs/`.

## Quick reference

| Task                                               | Where                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Add/remove a project, change page list or metadata | `scripts/project-manifest.ts`                                                             |
| Write/edit Japanese documentation                  | `projects/docs/src/{project}/docs/ja/`                                                    |
| Write/edit English for portal-hosted projects      | `projects/docs/src/{project}/docs/` (read via GitHub raw, not local checkout)             |
| Write/edit English for package-hosted projects     | The OSS package repository                                                                |
| Bump a package version                             | `package.json` pin → `npm install` → `npm run docs:generate`                              |
| Regenerate all pages                               | `npm run docs:generate` (output: `projects/docs/src/app/generated/` — never edit by hand) |

## Page roles

| Page                                                                          | Role                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing (`readme.md`, `getting-started.md`, etc.)                             | Overview, install, setup, short usage example, feature explanations, links to guides. Nav titles: `Getting Started` / `はじめに`. For rdlabo Capacitor plugins this file lives in the OSS repository and may include `<docgen-index>` / `<docgen-api>`. |
| Capacitor grouping pages (`code-scanner.md`, `payment-sheet.md`, `banner.md`) | One grouping object per file; kebab-case slug of the object. Related methods are sections on that page. Landing links here; formal signatures stay on `api.md`.                                                                                         |
| Guide pages (`http-auth.md`, `configuration.md`, etc.)                        | Feature or task documentation with examples. May use `!::...::` placeholders for formal signatures.                                                                                                                                                     |
| `api.md`                                                                      | Formal API reference: signatures, parameter tables, interfaces, enums, defaults.                                                                                                                                                                        |
| `code:`-referenced files (`.ts.md`, `.xml.md`, etc.)                          | Code examples and data. Not translated. May use `file:` front matter or ` ```lang:filename ` syntax.                                                                                                                                                    |

## Content ownership

| Content                                             | Source of truth                                      | Edit in                                                                                                          |
| --------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| English guides and landing pages                    | GitHub raw (package repo first, then portal repo)    | Package repo when docs are published there; otherwise `projects/docs/src/{project}/docs/` in this repo on GitHub |
| Japanese guides and landing pages                   | `projects/docs/src/{project}/docs/ja/*.md` only      | This portal                                                                                                      |
| `!::Identifier::` API signatures                    | Installed npm package `dist/docs.json`               | Package repo; release and bump the pin here                                                                      |
| Docgen API page (`<docgen-index>` + `<docgen-api>`) | Package or portal `readme.md` on GitHub              | Same repository as the English landing page                                                                      |
| Code example files (`code:` refs)                   | `projects/docs/src/{project}/docs/` (not translated) | This portal                                                                                                      |

## Generation pipeline

### English resolution

`docs:generate` **always** loads English from GitHub raw — never from the local filesystem. Resolution order:

1. Package repository: `docs/{file}`, `{sourceDirectory}/docs/{file}`, then `README.md` for landings.
2. Portal repository (`rdlabo-dev/website`): `projects/docs/src/{sourceDirectory}/docs/{file}`.

For `@capacitor-community/admob` and rdlabo Capacitor plugins, English lives in the **package repository only** — do not copy those English files into `projects/docs/src/{project}/docs/`.

Optional `englishDocsRef` overrides the Git ref for English guides fetched from the package repository (default: `main`). API signatures always follow the installed npm version, not the Git ref.

### API sources

1. **`dist/docs.json`** — `!::Identifier::` placeholders expand an entry on its own line. In package `docs/*.md` that GitHub renders, wrap as `<!-- !::Identifier:: -->` so it is hidden on GitHub. The generator expands both forms.
2. **`<docgen-index>` + `<docgen-api>`** — rdlabo Capacitor plugin landings in the OSS repository. The generator splits into a README page and an API page.
3. **Hand-authored semantic headings** — for `adapter: 'markdown'` projects without `dist/docs.json`.

### Adapter choice (`project-manifest.ts`)

- **No `adapter` field** (default): requires `dist/docs.json`. Use `!::...::` placeholders in any page.
- **`adapter: 'markdown'`**: hand-author all docs. `!::...::` is still available if `dist/docs.json` happens to exist (e.g. rdlabo Capacitor plugins whose API page comes from docgen blocks).

### Package README omit blocks

Wrap GitHub/npm-only regions in the package README with:

```html
<!-- rdlabo-docs-omit -->
(content)
<!-- /rdlabo-docs-omit -->
```

Typical targets: badges, maintainers, sponsors, demo screenshots, License. For AdMob, also omit `## Index` through the README docgen API, because the portal API page comes from README docgen and `!::` signatures from `dist/docs.json`. Markers inside fenced code blocks are ignored. Unclosed markers fail the generator.

### Semantic API headings

Use a kind tag so `formatApiEntries` wraps each entry in an `api-entry` card. Supported kinds:

`method`, `interface`, `type alias`, `enum`, `class`, `component`, `directive`, `function`, `module`, `command`, `stylesheet`, `rule`

```markdown
#### `method` present(scannerOption: ScannerOption)
```

## Bilingual rules

### File structure

- Every page in `project-manifest.ts` must have an English source on GitHub and a Japanese counterpart at `projects/docs/src/{project}/docs/ja/{file}`.
- Package-hosted English (AdMob, rdlabo Capacitor plugins) must **not** be duplicated under `projects/docs/src/{project}/docs/`.
- Code example files (`code:` refs) are not translated.

### Translation rules

- **Fenced code blocks must be byte-for-byte identical between EN and JA.** Do not translate code comments or examples.
- Translate prose into natural Japanese suitable for developer documentation.
- Technical terms (class names, method names, package names) remain untranslated.
- Localize page titles for guides and narrative pages. Identifiers, product names, rule names, and generic titles (`API`, `CLI API`, `@rdlabo/...`) may remain the same in both locales.

### CI guard

`scripts/bilingual-update-blocker.test.ts` (included in `npm test`) fails when an EN page declared in `project-manifest.ts` is modified in a PR without a corresponding JA change. This prevents English-only updates from merging unintentionally.

## Front matter and headings

- Every page should start with YAML front matter declaring `title`. Front matter is the source of truth; the generator falls back to the manifest title when absent. Pages may also declare `code:` and/or `scrollActiveLine:`.
- Code example files (`code:` refs) do not need `title`; they may declare `file:`.
- For `readme.md`, `using-ion-item-group.md`, and ESLint rule pages (`rules/{rule-name}.md`), the first `# ` heading is removed by `normalizeImportedReadmeHeadings`; the heading comes from front matter.

## Internal and external links

- Same project: `/docs/{page-slug}` (e.g. `/docs/payment-sheet`).
- Cross project: `/{project-id}/docs/{page-slug}` (use `id` from manifest, not public `slug`).
- Project root: `/{project-id}/`.
- The generator rewrites these to localized `/projects/{slug}/docs/{page}` or `/ja/projects/{slug}/docs/{page}` paths.
- Package source links: use the exact pinned version tag (`https://github.com/rdlabo-dev/{project}/blob/vX.Y.Z/...`), never `main`.

## CI (`npm test` / `npm run build`)

The CI pipeline runs:

1. `npm run fmt:check` — Prettier formatting.
2. `npm run lint` — ESLint (`@angular-eslint/prefer-signals`, `@rdlabo/eslint-plugin-rules` recommended).
3. `npm test` — node contract tests (42) + Angular unit tests (37). Includes bilingual update blocker.
4. `npm run build` — Angular build + pagefind search index + `build-output.test.ts` assertions.

All four must pass before a PR is merge-ready. Run them locally in the same order.
