---
title: require-viewmodel
---

# @rdlabo/rules/require-viewmodel

> Componentの `new ViewModel(this)`、`ViewModelStore<ComponentType, Keys>` 継承を強制し、View APIをViewModelから排除する。
>
> - ⭐️ このルールは `plugin:@rdlabo/rules/recommended` プリセットに含まれます。

Ionic AngularのComponent / ViewModel分割を1つのルールで強制します。同居するクラス名のデフォルトは `ViewModel` です。

| 検査               | 要件                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Component所有      | すべての `@Component` が `new ViewModel(this)` で初期化されたフィールドを持つ                                                                    |
| 構築               | 第1引数は `this` でなければならない                                                                                                              |
| ホスト境界         | ViewModelは `ViewModelStore<ComponentType, Keys>` を継承する。`Keys` は任意で、明示的な非SignalのComponentプロパティを公開する                   |
| Constructor / host | ViewModelはデフォルトで両者を継承する。任意のconstructorは `super(host)` で `host` を転送しなければならない                                      |
| View API           | `viewChild` / `viewChildren` / `contentChild` / `contentChildren` / `effect` / `computed` / 描画lifecycle APIは `ViewModel` 内に現れてはならない |

所有検査では `@Component` 以外のクラスは無視します。`@rdlabo/rules/no-component-method-except-lifecycle` と併用します。

## ルール詳細

✅ Signalとoutputホストのみ

```ts
@Component({ selector: 'app-example', template: '' })
export class ExamplePage {
  readonly vm = new ViewModel(this);
}

class ViewModel extends ViewModelStore<ExamplePage> {
  save(): void {
    this.host.saved.emit();
  }
}
```

`ViewModelStore` がconstructorを所有し、Componentオブジェクトを保持します。公開の `host` は `@rdlabo/ionic-angular-kit` の `ViewModelHost<T, K>` 型を使うため、クラスフィールド初期化時にコピーされるのではなく、ViewModel method実行時に値が読まれます。基底constructorはホストの絞り込みと一度きりの描画フックを、kitの `mountViewModel()` ヘルパーへ委譲します。

✅ 明示的な非Signal依存

```ts
class ViewModel extends ViewModelStore<EntryPage, 'entryForm' | 'inventoryModel'> {
  save(): void {
    this.host.entryForm.save();
  }
}
```

第2型引数は任意です。TypeScriptはそのキーがComponentに属することを検査します。ハードプライベートなComponentフィールドは `Pick` で公開できないため、ViewModelが必要な場合は公開の `readonly` 境界プロパティを使います。

✅ 共有ViewModel基底

```ts
class ViewModel extends MainViewModel<FoodsPage> {}
class ViewModel extends ListViewModel<WineListPage> {}
class ViewModel extends ModelSearch<SearchPage, SearchCondition> {}
```

名前が `ViewModel` で終わる中間基底と、確立された `ModelSearch` 基底は、第1型引数が所有Componentと一致するときに受け入れられます。中間基底自体は `ViewModelStore` を継承している必要があります。

ジェネリックなViewModelはデフォルトのComponentホストを使えます。所有検査にはそのデフォルトが使われます。

```ts
class ViewModel<THost = MainPage> extends ViewModelStore<THost> {}
```

ハードプライベートなViewModel所有も問題ありません。

```ts
readonly #vm = new ViewModel(this);
```

❌ ViewModelなし、または `this` なしのComponent

```ts
@Component({ selector: 'app-example', template: '' })
export class ExamplePage {
  readonly title = 'x'; // error: missingViewModel
}

readonly vm = new ViewModel();
readonly vm = new ViewModel(other);
```

❌ 旧来のViewModelごとのhostパターン

```ts
class ViewModel extends StoreModel {
  readonly host: ReactiveHost<ExamplePage>; // error

  constructor(host: ExamplePage) {
    super();
    this.host = host;
  }
}
```

`extends ViewModelStore<ExamplePage>` を使い、hostメンバーを削除します。ViewModelのconstructorで `host.someProperty` をキャッシュしないでください。`vm` より後に宣言されたComponentクラスフィールドは、まだ初期化されていません。

通常、constructorは不要です。Componentの初期化後に待つ必要があるセットアップには `onMount()` を優先します。既存の即時constructor副作用を残す必要がある場合は、同じ型のhostを転送する必要があります。

```ts
class ViewModel extends ViewModelStore<ExamplePage, 'inventoryModel'> {
  protected override onMount(): void {
    this.host.inventoryModel.initialize();
  }
}
```

互換のために即時constructorも有効です。

```ts
class ViewModel extends ViewModelStore<ExamplePage> {
  constructor(host: ExamplePage) {
    super(host);
    registerCleanup();
  }
}
```

❌ ViewModel上のView API

```ts
class ViewModel extends ViewModelStore<ExamplePage> {
  readonly el = viewChild('host'); // error
  readonly label = computed(() => 'x'); // error
}
```

`viewChild.required(...)` も禁止されます。`afterNextRender` / `afterEveryRender` / `afterRenderEffect` は個別のViewModelではなく、kitの `mountViewModel()` ヘルパーまたはComponentに属します。

## オプション

```ts
{
  // Class name treated as the ViewModel. default: 'ViewModel'
  viewModelClassName?: string;

  // Required base-class name. default: 'ViewModelStore'
  viewModelStoreClassName?: string;

  // Call expressions banned inside ViewModel.
  // default also denies afterNextRender / afterEveryRender / afterRenderEffect
  bannedApis?: string[];
}
```

```js
'@rdlabo/rules/require-viewmodel': 'error';
```

カスタム名:

```js
[
  'error',
  {
    viewModelClassName: 'PageState',
    viewModelStoreClassName: 'HostedStore',
  },
];
```

## 実装

- [Rule source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/src/rules/require-viewmodel.ts)
- [Test source](https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v21.3.0/tests/rules/require-viewmodel.ts)
