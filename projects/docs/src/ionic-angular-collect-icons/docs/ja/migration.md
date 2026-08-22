---
title: 移行
---

## Ionic Angular 9への移行

このversionはIonic Angular 9を対象とし、[Ionic Framework 9の破壊的変更](https://github.com/ionic-team/ionic-framework/blob/main/BREAKING.md#version-9x)に従います。

### 要件

- Ionic Angular 9以降
- Angular 18以降
- nativeアプリケーションではCapacitor 7以降
- TypeScript 5.4以降
- Ionicons 8以降
- Node.js 22以降

### 公式migratorを実行する

Ionicは公式migration toolの利用を推奨しています。最初にアプリケーションの現在の変更をcommitしてください。migratorはfileを直接編集するため、差分の確認や取り消しにcommitを使えるcleanなGit worktreeが必要です。

Ionicアプリケーションのrootで実行します。

```bash
npx @ionic/migrate
```

migratorはインストール済みのIonic major versionを検出し、依存関係を更新します。安全な自動修正とformat、依存関係の再installを実行し、手動確認が必要な変更をchecklistで表示します。

fileを書き換えず移行内容をpreviewするには次を実行します。

```bash
npx @ionic/migrate --dry-run
```

公式migration完了後にcollectorを更新し、依存packageのversionが上記要件を満たすことを確認します。

```bash
npm install --save-dev @rdlabo/ionic-angular-collect-icons@latest
```

以降では、生成された差分とmigratorの手動確認checklistで検証すべきIonic Angular 9の重要な変更を説明します。

### standalone migrationを完了する

Ionic 9はstandalone Angular componentを `@ionic/angular` からexportします。Ionic 8のstandalone entry pointを置き換えます。

```diff
- import { IonApp, IonIcon, provideIonicAngular } from '@ionic/angular/standalone';
+ import { IonApp, IonIcon, provideIonicAngular } from '@ionic/angular';
```

公式migratorはframework更新中にアプリケーションのarchitectureを維持するため、NgModule importを `@ionic/angular/lazy` へ移す場合があります。これは移行途中の状態であり、standalone migrationの完了形ではありません。Angular standalone migrationを完了してから、各Ionic componentを `@ionic/angular` からimportしてください。NgModule consumerを変換する前に `/lazy` importを機械的に書き換えてはいけません。

### standalone migration後に `IonicModule` を置き換える

`IonicModule` はIonic 9でdeprecatedですが、削除にはアプリケーション単位のarchitecture変更が必要です。アプリケーションをstandalone bootstrapへ変換し、Ionic設定を `provideIonicAngular()` へ移し、各consumerが使うstandalone Ionic componentをimportします。

```diff
- platformBrowserDynamic().bootstrapModule(AppModule);
+ bootstrapApplication(AppComponent, {
+   providers: [provideIonicAngular(config)],
+ });
```

`provideIonicAngular` は `@ionic/angular` からimportします。同じNgModule内で `IonicModule.forRoot()` を1行のprovider変更へ置き換えてはいけません。最初にNgModuleからstandaloneへの移行を完了してください。

### exportsを考慮するmodule resolutionを使う

Ionic 9はpackage subpathを `exports` で公開します。アプリケーションではAngular標準のbundler resolutionを使ってください。

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

`~` を使うwebpack形式のCSS importを置き換えます。

```diff
- @import '~@ionic/angular/css/core.css';
+ @import '@ionic/angular/css/core.css';
```

### icon collectorを実行する

まだ初期化していない場合は、生成されるicon登録を初期化します。

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

[使い方](/docs/usage)の説明に従い、本番build前にcollectorを引き続き実行します。

### Ionic 9のほかの変更を確認する

collectorはAngular templateから `ion-icon` の利用箇所を探し、専用のicon登録fileを更新します。Ionic componentの挙動や内部DOMには依存しないため、それらにcollector固有の変更はありません。ただし、アプリケーション側では公式migration note、特に新しいbrowser・mobile platformのminimum versionと次の変更を確認してください。

- nativeアプリケーションはCapacitor 7以降とiOS 16以降が必要です。
- 対応desktop browserはChrome 89以降、Safari 16以降、Edge 89以降、Firefox 75以降です。
- `ion-input` と `ion-searchbar` の `autocorrect` propertyはbooleanになりました。
- legacy picker componentと `PickerController` は削除されました。
- sheet modal handleのdefaultは `handleBehavior="cycle"` になりました。
- `ion-nav` は `ion-router` と連携しなくなりました。
- `ion-select` はvalueが変わった場合だけ `ionChange` をemitします。
- input、select、textareaの内部DOMとstyling hookが変わりました。
- Angular 21アプリケーションはzoneless change detectionをdefaultで使います。

移行後はアプリケーションのlint、test、本番buildを実行し、customizeしたIonic componentのstyleを目視確認してください。
