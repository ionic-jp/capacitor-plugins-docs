---
title: CLI API
---

Command reference for `@rdlabo/ionic-angular-collect-icons` v3.0.0.

## Command

#### `command` npx @rdlabo/ionic-angular-collect-icons

Scans Angular source and templates, then writes the Ionicons used by the application to `src/use-icons.ts` by default.

| Option               | Type      | Description                                                                   | Default            |
| -------------------- | --------- | ----------------------------------------------------------------------------- | ------------------ |
| **`--dry-run`**      | `boolean` | Reports changes without writing files.                                        | `false`            |
| **`--interactive`**  | `boolean` | Collects all options through prompts and enables result inspection.           | `false`            |
| **`--initialize`**   | `boolean` | Adds the `addIcons` initialization and removes component-level registrations. | `false`            |
| **`--project-path`** | `string`  | Project directory whose `src` tree is scanned.                                | current directory  |
| **`--icon-path`**    | `string`  | Generated icon registration file.                                             | `src/use-icons.ts` |
