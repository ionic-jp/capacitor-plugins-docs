---
title: Rules
---

The package exposes 18 rules. Rules marked “recommended” are enabled by `rdlabo.configs.recommended`; the remaining rules are opt-in.

| Rule                                                                                                           | Purpose                                                                            | Fix | Preset |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | :-: | :----: |
| [`component-property-use-readonly`](/eslint-plugin-rules/docs/rules/component-property-use-readonly)           | Require `readonly` on immutable Angular component properties.                      | Yes |  Yes   |
| [`deny-constructor-di`](/eslint-plugin-rules/docs/rules/deny-constructor-di)                                   | Disallow constructor dependency injection. Deprecated in favor of `inject()`.      | No  |   No   |
| [`deny-element`](/eslint-plugin-rules/docs/rules/deny-element)                                                 | Reject configured HTML elements, such as inline Ionic overlays.                    | No  |  Yes   |
| [`deny-import-from-ionic-module`](/eslint-plugin-rules/docs/rules/deny-import-from-ionic-module)               | Replace accidental `@ionic/angular` imports with standalone imports.               | Yes |  Yes   |
| [`deny-overlay-create`](/eslint-plugin-rules/docs/rules/deny-overlay-create)                                   | Disallow direct `.create()` calls on modal and popover controllers.                | No  |  Yes   |
| [`deny-soft-private-modifier`](/eslint-plugin-rules/docs/rules/deny-soft-private-modifier)                     | Replace TypeScript `private` with hard-private `#` fields.                         | Yes |  Yes   |
| [`implements-ionic-lifecycle`](/eslint-plugin-rules/docs/rules/implements-ionic-lifecycle)                     | Require the matching interface for Angular and Ionic lifecycle methods.            | Yes |  Yes   |
| [`ionic-attr-type-check`](/eslint-plugin-rules/docs/rules/ionic-attr-type-check)                               | Require property binding for non-string Ionic attributes.                          | Yes |  Yes   |
| [`no-component-method-except-lifecycle`](/eslint-plugin-rules/docs/rules/no-component-method-except-lifecycle) | Keep arbitrary methods out of Angular components.                                  | No  |  Yes   |
| [`no-component-writable-signal`](/eslint-plugin-rules/docs/rules/no-component-writable-signal)                 | Keep writable component state in a ViewModel, with a Signal Forms model exception. | No  |   No   |
| [`no-reactive-forms`](/eslint-plugin-rules/docs/rules/no-reactive-forms)                                       | Disallow Reactive Forms in favor of Angular Signal Forms.                          | No  |   No   |
| [`no-template-driven-forms`](/eslint-plugin-rules/docs/rules/no-template-driven-forms)                         | Disallow template-driven forms except configured interoperability elements.        | No  |   No   |
| [`prefer-disable-handler`](/eslint-plugin-rules/docs/rules/prefer-disable-handler)                             | Wrap configured event handlers to prevent duplicate async actions.                 | No  |  Yes   |
| [`prefer-modal-launcher`](/eslint-plugin-rules/docs/rules/prefer-modal-launcher)                               | Restrict `presentModal` calls to `launch*` functions.                              | No  |  Yes   |
| [`require-viewmodel`](/eslint-plugin-rules/docs/rules/require-viewmodel)                                       | Enforce component ownership and the `ViewModelStore` boundary.                     | No  |  Yes   |
| [`restrict-try-block`](/eslint-plugin-rules/docs/rules/restrict-try-block)                                     | Keep `try` blocks small and exclude Promise, RxJS, and Signal contexts by policy.  | No  |  Yes   |
| [`signal-use-as-signal-template`](/eslint-plugin-rules/docs/rules/signal-use-as-signal-template)               | Require `()` when reading Angular Signals in templates.                            | No  |  Yes   |
| [`signal-use-as-signal`](/eslint-plugin-rules/docs/rules/signal-use-as-signal)                                 | Require correct Signal reads and writes in TypeScript.                             | Yes |  Yes   |

## Rule documentation

Each rule page in this documentation contains options and correct/incorrect examples. The table above reflects v21.3.0.

## Typed rules

Enable `parserOptions.projectService` for rules that inspect TypeScript types. Without typed linting, `restrict-try-block` still performs syntax-based checks but skips type-dependent Promise and RxJS detection.
