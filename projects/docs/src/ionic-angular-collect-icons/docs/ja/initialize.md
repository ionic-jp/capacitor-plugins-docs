---
title: '初期化'
code: []
scrollActiveLine: []
---

CLI を入れて `addIcons` を配線します。[使い方](/docs/usage) も見てください。

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
