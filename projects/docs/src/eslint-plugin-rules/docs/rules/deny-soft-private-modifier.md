---
title: deny-soft-private-modifier
---

# @rdlabo/rules/deny-soft-private-modifier

> This plugin disallows the use of soft private modifier.
>
> - ⭐️ This rule is included in `plugin:@rdlabo/rules/recommended` preset.
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

❌ Incorrect: Using the `private` modifier for class fields

```ts
@Component({})
export class SigninPage {
  private platform = inject(Platform);
}
```

✅ Correct: Using the hard private field syntax (#)

```ts
@Component({})
export class SigninPage {
  #platform = inject(Platform);
}
```

## Implementation

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/deny-soft-private-modifier.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/deny-soft-private-modifier.ts)
