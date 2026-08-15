---
title: implements-ionic-lifecycle
---

# @rdlabo/rules/implements-ionic-lifecycle

> このプラグインはIonic Lifecycleのimplementsを推奨します。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。
> - ✒️ [コマンドライン](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)の `--fix` オプションで、このルールが報告する問題の一部を自動修正できます。

## ルール詳細

❌ 誤り: interfaceをimplementsせずにIonic Lifecycle methodを使う

```ts
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class SigninPage {
  ionViewWillEnter() {}
}
```

✅ 正しい: 適切なinterfaceのimplementsとともにIonic Lifecycle methodを使う

```ts
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class SigninPage implements ionViewWillEnter {
  ionViewWillEnter() {}
}
```

## オプション

オプションなし。

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/implements-ionic-lifecycle.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/implements-ionic-lifecycle.ts)
