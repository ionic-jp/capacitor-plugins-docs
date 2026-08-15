---
title: prefer-disable-handler
---

# @rdlabo/rules/prefer-disable-handler

> 設定した要素/イベントバインディングで、非同期処理中の二重タップを防ぐwrapper method（デフォルト: disableHandler($event, work)）を要求する
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

`disableHandler`（`@rdlabo/ionic-angular-kit` 由来）は、非同期操作の実行中にきっかけとなったコントロールを無効化し、Promiseがsettledしたときに復元します。同期処理に使っても害はありません。コントロールは一瞬無効化されて戻され、無効化可能な対象が見つからない場合は何もしません。

要素名・イベント名・wrapper method名はすべて設定可能なので、フリート共通のデフォルトと、リポジトリ固有のバインディング（例: `(ionComplete)`）の両方を同じルールでカバーできます。

`recommended` でこのルールを有効にすると、wrapperなしで非同期処理を呼ぶ既存テンプレートが指摘されます。プラグインを上げるときは移行パスを見込んでください。

## ルール詳細

❌ 誤り（デフォルト）

```html
<ion-button (click)="vm.save()">Save</ion-button>
<form (submit)="vm.save()"></form>
```

次も誤りです。wrapperは `$event` と第2引数の `work` を受け取る必要があります。

```html
<ion-button (click)="vm.disableHandler($event)">Save</ion-button>
<ion-button (click)="vm.disableHandler(vm.save())">Save</ion-button>
```

✅ 正しい（デフォルト）

```html
<ion-button (click)="vm.disableHandler($event, vm.save())">Save</ion-button>
<form (submit)="vm.disableHandler($event, vm.save())"></form>
```

wrapperなしで許可（イベントのみ、デフォルト）:

```html
<ion-button (click)="$event.stopPropagation()"></ion-button>
```

```html
<ion-button (click)="$event.preventDefault()"></ion-button>
```

デフォルトでは対象外（`targets.elements` に未掲載）:

```html
<ion-chip (click)="vm.toggle()"></ion-chip>
```

```html
<ion-item [button]="true" (click)="vm.open()"></ion-item>
```

## オプション

```ts
{
  method?: string; // default: 'disableHandler'
  eventParam?: string; // default: '$event'
  targets?: Array<{
    events: string[]; // e.g. ['click'], ['submit'], ['ionComplete']
    elements?: string[]; // omit / [] = any element for those events
  }>;
  allowEventMethods?: string[]; // default: ['stopPropagation', 'preventDefault']
}
```

**`targets` はデフォルト一覧を完全に置き換えます**（マージしません）。click/submitを維持しつつ追加する場合は、デフォルトを再掲したうえで追加分を足します。

### デフォルト

```ts
{
  method: 'disableHandler',
  eventParam: '$event',
  targets: [
    { events: ['click'], elements: ['ion-button', 'button'] },
    { events: ['submit'] }, // any element
  ],
  allowEventMethods: ['stopPropagation', 'preventDefault'],
}
```

### 例

カスタムwrapper名を要求する:

```js
'@rdlabo/rules/prefer-disable-handler': ['error', { method: 'guardClick' }]
```

`ion-input` の `(ionComplete)` も強制する（デフォルトのtargetsを**再掲**する）:

```js
'@rdlabo/rules/prefer-disable-handler': [
  'error',
  {
    targets: [
      { events: ['click'], elements: ['ion-button', 'button'] },
      { events: ['submit'] },
      { events: ['ionComplete'], elements: ['ion-input'] },
    ],
  },
]
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/prefer-disable-handler.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/prefer-disable-handler.ts)
