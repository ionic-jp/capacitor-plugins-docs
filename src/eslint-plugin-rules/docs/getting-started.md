---
title: Getting Started
---

Install the plugin as a development dependency:

```sh
npm install --save-dev @rdlabo/eslint-plugin-rules
```

The package root provides Angular and Ionic rules. Install `@angular-eslint/template-parser` and `@ionic/core` when you enable those rules. Framework-independent TypeScript projects can use the `/typescript` entry point without loading Angular or Ionic.

## Requirements

| Package                           | Supported version                 |
| --------------------------------- | --------------------------------- |
| Node.js                           | 20 or later                       |
| ESLint                            | 9 or later                        |
| `@typescript-eslint/utils`        | 8.33 or later, before 9           |
| `@angular-eslint/template-parser` | 21.x when template rules are used |
| `@ionic/core`                     | 8.x when Ionic rules are used     |

## Choose an entry point

- Use `@rdlabo/eslint-plugin-rules` for Angular and Ionic applications.
- Use `@rdlabo/eslint-plugin-rules/typescript` for backend and other framework-independent TypeScript projects.

The recommended preset is designed for ESLint Flat Config. Add it at the top level so its TypeScript and HTML file selectors remain intact.

## Next step

Continue to [Configuration](/eslint-plugin-rules/docs/configuration) to enable the recommended preset or individual rules.
