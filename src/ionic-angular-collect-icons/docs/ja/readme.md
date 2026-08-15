---
title: 'Ionic Angular Collect Icons'
---

# Ionic Angular Collect Icons

## これは何ですか？

このライブラリは、プロジェクト内の ionIcons を一意にまとめ、エクスポート用の ionIcons ファイルを生成するために使います。小さなプロジェクトでは、毎回 `addIcons()` を管理するのが難しいため、自動化しました。

- 開発時: `addIcons` に全アイコンを追加することで、ストレスのない開発ができます。
- 本番時: ビルド前にテンプレートで使われている ionIcon を自動収集・更新します。

もちろん、バンドルサイズ削減を最大化するには、各コンポーネントの遅延読み込み時に最小限のアイコンだけを読み込むことが重要です。これは開発速度を優先するための妥協案です。

このプロジェクトは [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) を基にしています。

## 要件

- Node.js >= 20
- ionicons >= 6.0.0

## 初期化

```bash
npm install @rdlabo/ionic-angular-collect-icons --save-dev
```

### 🤖 自動設定

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

### 📝 手動設定

#### 1. CLI を実行する

```bash
npx @rdlabo/ionic-angular-collect-icons
```

これで `src/use-icons.ts` が生成されます。

#### 2. 生成されたファイルを `main.ts`（または `app.config.ts`）でインポートする:

```diff
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';
+ import * as useIcons from './use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  addIcons(environment.production ? useIcons : allIcons);
```

#### 3. クラスコンストラクタ内の他の `addIcons` 呼び出しを削除する

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```

## 使い方

```bash
npx @rdlabo/ionic-angular-collect-icons
```

### 実行を自動化する

本番ビルドの前に毎回コマンドを実行するのは非効率なので、npm スクリプトに入れて自動化します。例:

```diff
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
+   "prebuild": "npx @rdlabo/ionic-angular-collect-icons",
```

> [!WARNING]
> この方法は、npm スクリプトを使わない本番ビルドでは利用できません。

## オプション

### --dry-run [boolean]

ファイルに実際に書き込まず、どのような変更が行われるか確認したい場合は `true` を設定します。デフォルトは `false` です。

```bash
npx @rdlabo/ionic-angular-collect-icons --dry-run true
```

### --interactive [boolean]

すべての CLI オプションをプロンプトで設定したい場合は `true` を設定します。Dry run で結果だけを確認する場合にも使えます。
デフォルトは `false` です。

```bash
npx @rdlabo/ionic-angular-collect-icons --interactive true
```

### --initialize [boolean]

`addIcons` を自動で初期化したい場合は、`--initialize` フラグを使えます。デフォルトは `false` です。CLI は次の行を追加します:

```diff
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';
+ import * as useIcons from './use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  addIcons(environment.production ? useIcons : allIcons);
```

CLI は `enableProdMode()` があるファイルに行を追加します。もちろん、手動で設定することもできます。

あわせて、クラスコンストラクタ内の他の `addIcons` 呼び出しも削除します。

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

### --project-path [string]

プロジェクトへのパスを指定したい場合は、`--project-path` フラグを使えます。デフォルトはカレントディレクトリです。

```bash
npx @rdlabo/ionic-angular-collect-icons --project-path /path/to/project
```

対象ファイルは、指定パスからの `src` ディレクトリ配下です。

- path/to/project + `src/**/*.ts`
- path/to/project + `src/**/*.html`

### --icon-path [string]

デフォルトの生成ファイルは（path/to/project +）`src/use-icons.ts` です。ファイル名を指定したい場合は、`--icon-path` フラグを使えます。

```bash
npx @rdlabo/ionic-angular-collect-icons  --icon-path src/other-use-icons.ts
```

## FAQ

- main.ts で addIcons を実行できますか？

はい。この Issue を確認してください: https://github.com/ionic-team/ionic-framework/issues/28445#issuecomment-1789028722

> You're more than welcome to register them in main.ts or app.component.ts. You can then use them anywhere in your application. However, the initial bundle size may increase because the icons need to be loaded up front.

- ユニットテストはサポートしていますか？

ChromeHeadless でのユニットテストは `main.ts` を読みません。そのため、各テストで `addIcons` を追加するか、`src/test.ts` で `addIcons` を追加する必要があります。

- アイコン名のバインディングはサポートしていますか？

いいえ。このプログラムでのサポート予定もありません。例えば、次のようなコードは、表示されるまで追うのが困難です。

```ts
@Component({
  selector: "app-example",
  template: ` <ion-icon [name]="iconName"></ion-icon> `,
})
export class ExampleComponent {
  iconName = "add";

  ionViewWillEnter() {
    setTimeout(() => {
      this.iconName = "remove";
    }, 1000);
  }
}
```

このような複雑な処理をしている場合は、手動でインポートしてください。

あるいは、バインドするアイコン数が限られている場合は、テンプレートに「ヒント」用のブロックを追加できます。

```html
<!-- This is a trick to get ionic-angular-collect-icons
     to include the icons, but it will never render. -->
@if(false) {
<ion-icon name="home"></ion-icon>
<ion-icon name="people"></ion-icon>
}
```

理想的ではありませんが、自動化の維持には役立ちます。

- なぜ各コンポーネントで addIcons しないのですか？

ライブラリによる差分を最小限にするためです。実行のたびにすべてのコンポーネントが変わるのは好ましくありませんでした。差分はできるだけ小さく保ちたかったのです。

## 開発

1. このリポジトリをクローンします。
2. `npm install` を実行して依存関係をインストールします
3. `npm run dev` を実行して開発サーバーを起動します。変更を監視してプロジェクトを再ビルドします
4. `npm run start` を実行して CLI を起動し、コードモッドをテストします

### テスト

このプロジェクトはユニットテストに [Vitest](https://vitest.dev/) を使っています。

| コマンド             | 説明                          |
| -------------------- | ----------------------------- |
| `npm run test`       | すべてのテストを実行する      |
| `npm run test:watch` | ウォッチモードですべて実行する |
| `npm run coverage`   | カバレッジ付きでテストを実行する |

### フォーマット

このプロジェクトはコードフォーマットに [Prettier](https://prettier.io/) を使っています。

プロジェクト内のすべてのファイルをフォーマットするには `npm run fmt` を実行します。

### 追加リソース

- [Typescript AST Explorer](https://ts-ast-viewer.com/)
- [ts-morph API Docs](https://ts-morph.com/)
- [Clack Prompts Docs](https://github.com/natemoo-re/clack/tree/main/packages/prompts#readme)
