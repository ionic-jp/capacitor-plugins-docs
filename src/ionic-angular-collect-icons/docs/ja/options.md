---
title: 'CLI オプション'
code: []
scrollActiveLine: []
---

`npx @rdlabo/ionic-angular-collect-icons` のフラグです。一覧表は [CLI API](/docs/api) にあります。

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
