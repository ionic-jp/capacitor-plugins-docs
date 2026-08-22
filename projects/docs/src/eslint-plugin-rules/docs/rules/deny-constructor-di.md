---
title: deny-constructor-di
---

# @rdlabo/rules/deny-constructor-di

> This plugin disallows Dependency Injection within the constructor.

This rule encourages modern Angular dependency injection practices by using the `inject` function.

## Rule Details

❌ Incorrect: Using constructor-based dependency injection

```ts
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class SigninPage {
  constructor(public platform: Platform) {}
}
```

✅ Correct: Using the `inject` function for dependency injection

```ts
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class SigninPage {
  public platform = inject(Platform);

  constructor() {}
}
```

## Options

No Options.

## Implementation

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/deny-constructor-di.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/deny-costructor-di.ts)
