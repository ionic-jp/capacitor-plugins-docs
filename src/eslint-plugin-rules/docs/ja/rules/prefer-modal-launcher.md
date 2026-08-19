---
title: prefer-modal-launcher
---

# @rdlabo/rules/prefer-modal-launcher

> `presentModal` 呼び出しを `launch*` launcher関数内に置くことを要求する。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

呼び出し側は `helper.presentModal(...)` をインラインで書かず、`await launchXxxPage(helper, props)` を使う必要があります。

各modalページは次をエクスポートするべきです。

- `XxxProps` / `XxxDismiss` 型
- `presentModal` を包む `launchXxxPage(helper, props)`

`@rdlabo/rules/deny-overlay-create` および `@rdlabo/rules/deny-element` と併用します。

## ルール詳細

❌ 誤り: 呼び出し側で `presentModal` をインライン実行する

```ts
export class ExamplePage {
  readonly helper = inject(HelperService);

  async open() {
    await this.helper.presentModal(OtherPage, {}); // error
  }
}
```

次も誤りです。

```ts
export async function openModal(overlay: Helper) {
  await overlay.presentModal(ExamplePage, {}); // error — name does not match /^launch/
}

const show = () => overlay.presentModal(ExamplePage, {}); // error
```

✅ 正しい: `presentModal` はlauncher内だけに置く

```ts
export interface OtherProps {
  id: number;
}
export type OtherDismiss = { saved: boolean } | undefined;

export const launchOtherPage = (helper: HelperService, props: OtherProps): Promise<OtherDismiss> => {
  return helper.presentModal(OtherPage, props, { watchKeyboard: false });
};

export class ExamplePage {
  readonly helper = inject(HelperService);

  async open() {
    const data = await launchOtherPage(this.helper, { id: 1 });
    if (data?.saved) {
      // ...
    }
  }
}
```

launcher内のネストした呼び出しは問題ありません。

```ts
export const launchExamplePage = (overlay: Helper, props: Props) => {
  const run = () => overlay.presentModal(ExamplePage, props);
  return run();
};
```

## オプション

```ts
{
  // Method names treated as overlay presenters.
  // default: ['presentModal']
  presentMethodNames?: string[];

  // RegExp source for allowed enclosing function / method names.
  // default: '^launch'
  launcherNamePattern?: string;
}
```

```js
'@rdlabo/rules/prefer-modal-launcher': [
  'error',
  {
    presentMethodNames: ['presentModal'],
    launcherNamePattern: '^launch',
  },
],
```

プロジェクトが `open*` launcherを使う場合は次のようにします。

```js
{
  launcherNamePattern: '^(launch|open)';
}
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/prefer-modal-launcher.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/prefer-modal-launcher.ts)
