---
title: API
---

Reference for the public programmatic API exported by `@rdlabo/capacitor-docgen` v0.4.1.

## Generation

#### `function` generate

`(opts: DocsGenerateOptions) => Promise<DocsGenerateResults>`

Parses a TypeScript project or input files and optionally writes README and JSON output.

#### `function` parse

`(opts: DocsParseOptions) => (api: string) => DocsData`

Creates a parser result lookup for a named plugin API.

## Output

#### `function` outputReadme

`(readmeFilePath: string, data: DocsData) => Promise<void>`

Updates the docgen placeholders in a README file.

#### `function` outputJson

`(jsonFilePath: string, data: DocsData) => Promise<void>`

Writes the parsed documentation model as JSON.

#### `function` replaceMarkdownPlaceholders

`(content: string, data: DocsData) => string`

Returns Markdown with `<docgen-index>` and `<docgen-api>` content replaced.

## CLI

#### `function` run

`(config: { cwd: string; args: string[] }) => Promise<void>`

Runs the docgen command with an explicit working directory and argument list.

## Options

#### `interface` DocsParseOptions

| Prop               | Type       | Description                             |
| ------------------ | ---------- | --------------------------------------- |
| **`tsconfigPath`** | `string`   | Optional TypeScript configuration path. |
| **`inputFiles`**   | `string[]` | Optional explicit source files.         |

#### `interface` DocsGenerateOptions

| Prop                   | Type       | Description                             |
| ---------------------- | ---------- | --------------------------------------- |
| **`api`**              | `string`   | Primary plugin interface name.          |
| **`tsconfigPath`**     | `string`   | Optional TypeScript configuration path. |
| **`inputFiles`**       | `string[]` | Optional explicit source files.         |
| **`outputJsonPath`**   | `string`   | Optional JSON output path.              |
| **`outputReadmePath`** | `string`   | Optional README output path.            |

#### `interface` DocsGenerateResults

Extends `DocsGenerateOptions` with the parsed `data: DocsData` result.

## Documentation model

#### `interface` DocsData

| Prop                | Type                    | Description                                |
| ------------------- | ----------------------- | ------------------------------------------ |
| **`api`**           | `DocsInterface \| null` | Primary plugin API.                        |
| **`interfaces`**    | `DocsInterface[]`       | Parsed interfaces.                         |
| **`typeAliases`**   | `DocsTypeAlias[]`       | Parsed type aliases.                       |
| **`enums`**         | `DocsEnum[]`            | Parsed enums.                              |
| **`pluginConfigs`** | `DocsConfigInterface[]` | Parsed Capacitor configuration interfaces. |
