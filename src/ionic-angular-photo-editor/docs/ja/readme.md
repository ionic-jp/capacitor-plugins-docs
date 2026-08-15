---
title: '@rdlabo/ionic-angular-photo-editor'
---

# @rdlabo/ionic-angular-photo-editor

Capacitor を使う Ionic Angular プロジェクト向けの、モーダルページ用フォトエディター兼ビューアーです。

## インストール

```bash
npm install @rdlabo/ionic-angular-photo-editor
```

Capacitor を使う場合は、次のプラグインをインストールしてください。

```bash
npm install @capacitor/camera swiper tui-image-editor
```

あわせて権限を設定します。詳細はこちら: [Camera](https://capacitorjs.com/docs/apis/camera#android-configuration)

プロジェクトを Web に公開する場合は、次の input タグを index.html に追加してください。

```html
<div style="width: 0; height: 0; overflow: hidden">
  <input id="browserPhotoUploader" type="file" accept="image/*" />
</div>
```

## テーマ

デフォルトの色は設定済みですが、上書きできます: https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/photo-editor/src/lib/pages/core.scss

### 上書き方法

```scss
:root {
  --ion-photo-editor-background: #2a2a2a;
  --ion-photo-editor-background-tint: #414141;

  --ion-photo-editor-color: #f0f0f0;
  --ion-photo-editor-color-tint: #dbdbdb;

  --ion-photo-editor-primary: #4d8dff;
  --ion-photo-editor-danger: #f24c58;
  --ion-photo-editor-success: #2dd55b;
}
```

## 使い方

### PhotoFileService

```typescript
import { PhotoFileService } from '@rdlabo/ionic-angular-photo-editor';

export class AppComponent {
  private photoFileService = inject(PhotoFileService);

  constructor() {
    this.photoFileService.photoMaxSize = 1000;
    this.photoFileService.labels = {
      camera: 'Camera',
      album: 'Album',
      cancel: 'Cancel',
    };
  }

  async upload() {
    const files = await this.photoFileService.loadPhoto(1);
    if (files.length > 0) {
      // upload files
    }
  }
}
```

#### オプション

##### photoMaxSize

写真の最大サイズです。デフォルトは 1000 です。

##### labels

設定すると、ラベルが上書きされます。

### PhotoEditorPage

```typescript
import { PhotoEditorPage, IPhotoEditorDismiss } from '@rdlabo/ionic-angular-photo-editor';

(async () => {
  const modal = await this.modalCtrl.create({
    component: PhotoEditorPage,
    componentProps: {
      requireSquare: false,
      value: 'https://picsum.photos/200/300',
      labels: {
        save: '送信', // change '保存' to '送信'
      },
    },
  });
  await modal.present();
  const { data } = await modal.onWillDismiss<IPhotoEditorDismiss>();
  if (data?.value) {
    console.log(data.value);
  }
})();
```

### オプション

#### requireSquare: boolean

true の場合、最初に画像を正方形に切り抜く必要があります。

#### value: string

画像の URL または base64 文字列です。

#### labels: IDictionaryForEditor

設定すると、ラベルが上書きされます。

一覧は[こちら](https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/photo-editor/src/lib/dictionaries.ts)です。

### PhotoViewerPage

```typescript
import { PhotoViewerPage, IPhotoViewerDismiss } from '@rdlabo/ionic-angular-photo-editor';

(async () => {
  const modal = await this.modalCtrl.create({
    component: PhotoViewerPage,
    componentProps: {
      imageUrls: ['https://picsum.photos/200/300', 'https://picsum.photos/200/300'],
      index: 0,
      isCircle: false,
    },
  });
  await modal.present();
  const { data } = await modal.onWillDismiss<IPhotoViewerDismiss>();
  if (data?.delete) {
    // User delete image
  }
})();
```

### オプション

#### imageUrls: string[]

画像の URL または base64 文字列の配列です。

#### index: number

imageUrls のインデックスです。

#### isCircle: boolean

設定すると、画像が円形で表示されます。

#### enableDelete: boolean

true の場合、削除ボタンが表示されます。

#### enableFooterSafeArea: boolean

true の場合、iOS 向けにフッターのセーフエリアを有効にします。

#### labels: IDictionaryForViewer

設定すると、ラベルが上書きされます。

一覧は[こちら](https://github.com/rdlabo-dev/ionic-angular-library/blob/v21.6.2/projects/photo-editor/src/lib/dictionaries.ts)です。
