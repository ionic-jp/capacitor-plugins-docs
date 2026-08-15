---
title: Storage・Overlay
---

## 型付きStorage

Ionic Storageを一度provideします。`KitStorageService` は遅延初期化し、すべてのpublic操作が完了を待つため、service作成直後のwriteも失われません。

```ts
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(IonicStorageModule.withConfig({ name: '__mydb' }))],
};
```

```ts
const storage = inject(KitStorageService);

await storage.set('token', token);
const saved = await storage.get<string>('token');
await storage.remove('token');
```

存在しないkeyに対して `get<T>()` は `null` を返します。`kitClearStoragePreservingKeys()` はアプリデータをclearしながら、最後に入力した認証emailやthemeなど、指定した値を復元します。

## 型付きOverlay

`provideKitOverlay()` でアプリ所有のlabelを設定し、`KitOverlayController` をinjectします。Kitは翻訳文言をhard-codeしません。

```ts
provideKitOverlay({
  labels: {
    close: $localize`閉じる`,
    cancel: $localize`キャンセル`,
  },
});
```

```ts
export class DetailPage {
  declare static readonly modalReturn: DetailResult;
  readonly item = input.required<Item>();
}

export const launchDetailPage = (
  overlay: KitOverlayController,
  props: { item: Item },
): Promise<DetailResult | undefined> =>
  overlay.presentModal(DetailPage, props, { backdropDismiss: false });
```

Component propsはAngularの `input()`、dismiss dataはcomponentのstatic `modalReturn` 宣言から推論されます。Ionic controllerをinlineで呼ばず、各Modal・Popoverの隣に型付きlauncherを置いてください。

同じcontrollerが `presentPopover()`、`presentToast()`、`alertClose()`、`alertConfirm()` を提供します。Modal optionの `watchKeyboard: true` はNative Keyboard表示中にBottom Sheetを全高へ広げます。
