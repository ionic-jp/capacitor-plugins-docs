---
title: deny-constructor-di
---

# @rdlabo/rules/deny-constructor-di

> このプラグインはconstructor内のDependency Injectionを禁止します。

このルールは `inject` 関数を使う、現代的なAngularの依存性注入の作法を促します。

## ルール詳細

❌ 誤り: constructorベースの依存性注入を使う

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

✅ 正しい: 依存性注入に `inject` 関数を使う

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

## オプション

オプションなし。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/deny-constructor-di.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/deny-costructor-di.ts)
