---
title: deny-overlay-create
---

# @rdlabo/rules/deny-overlay-create

> ModalController / PopoverController の `.create()` を禁止し、launcher経由でoverlayを開く。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

Ionicアプリでは、modalとpopoverは共有ヘルパー（`presentModal`）とエクスポートした `launch*` 関数経由で開くべきであり、`ModalController.create()` / `PopoverController.create()` を直接呼んではいけません。

次のルールと併用します。

- `@rdlabo/rules/deny-element` — テンプレート内のインライン `<ion-modal>` / `<ion-popover>` を禁止する
- `@rdlabo/rules/prefer-modal-launcher` — `presentModal` を `launch*` 内に置くことを要求する

`LoadingController`、`AlertController`、`ToastController`、`ActionSheetController` はデフォルトで許可されたままです。`ModalController` の `dismiss()` も許可されます。

## ルール詳細

❌ 誤り: controller経由でmodal / popoverをcreateする

```ts
import { inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

export class ExamplePage {
  readonly #modalCtrl = inject(ModalController);

  async open() {
    await this.#modalCtrl.create({ component: OtherPage }); // error
  }
}
```

次も同様です。

- `this.modalCtrl.create(...)`
- `inject(ModalController).create(...)`
- `ModalController` / `PopoverController` 型のパラメータ

✅ 正しい: launcher経由で開き、`ModalController` はdismiss用にだけ持つ

```ts
export const launchOtherPage = (helper: HelperService, props: OtherProps) => {
  return helper.presentModal(OtherPage, props, { watchKeyboard: false });
};

export class ExamplePage {
  readonly #modalCtrl = inject(ModalController);
  readonly helper = inject(HelperService);

  async open() {
    await launchOtherPage(this.helper, {});
  }

  dismiss() {
    this.#modalCtrl.dismiss();
  }
}
```

✅ 正しい: Loading / Alert / Toast / ActionSheet のcreate

```ts
readonly #loadingCtrl = inject(LoadingController);
await this.#loadingCtrl.create({ message: '...' });
```

## オプション

```ts
{
  // Controllers whose `.create()` is denied.
  // default: ['ModalController', 'PopoverController']
  deny?: string[];
}
```

```js
'@rdlabo/rules/deny-overlay-create': [
  'error',
  { deny: ['ModalController', 'PopoverController'] },
],
```

alertのcreateも禁止するには次のようにします。

```js
{
  deny: ['ModalController', 'PopoverController', 'AlertController'];
}
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/deny-overlay-create.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/deny-overlay-create.ts)
