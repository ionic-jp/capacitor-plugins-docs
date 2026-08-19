---
title: 'Photo Viewer'
code: []
scrollActiveLine: []
---

Ionic モーダルで `PhotoViewerPage` を表示します。[インストール](/docs/readme#インストール) のあとで呼び出します。

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
