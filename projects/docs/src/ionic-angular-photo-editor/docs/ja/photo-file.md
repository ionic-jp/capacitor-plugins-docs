---
title: 'PhotoFileService'
code: []
scrollActiveLine: []
---

カメラまたはアルバムから写真を読み込みます。[インストール](/docs/readme#インストール) のあとで呼び出します。

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
