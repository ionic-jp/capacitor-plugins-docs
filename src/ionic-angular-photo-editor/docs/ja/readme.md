---
title: 'はじめに'
code: []
scrollActiveLine: []
---

## 概要

Capacitor を使う Ionic Angular プロジェクト向けの、モーダルページ用フォトエディター兼ビューアーです。

## 機能

### 目的から選ぶ

| 目的 | ガイド |
| --- | --- |
| カメラまたはアルバムから写真を読み込む | [PhotoFileService](/docs/photo-file) |
| モーダルで切り抜き・編集する | [Photo Editor](/docs/editor) |
| モーダルで画像を閲覧する | [Photo Viewer](/docs/viewer) |
| エディターの色を上書きする | [テーマ](/docs/theme) |

## クイックスタート

[インストール](#インストール) のあと、写真を読み込みます。

```typescript
import { PhotoFileService } from '@rdlabo/ionic-angular-photo-editor';

const files = await this.photoFileService.loadPhoto(1);
```

その後、エディターまたはビューアーを表示します。詳細は [PhotoFileService](/docs/photo-file)、[Photo Editor](/docs/editor)、[Photo Viewer](/docs/viewer) です。

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


## ドキュメント

上の [インストール](#インストール) から始め、ガイドを選んでください。

- [PhotoFileService](/docs/photo-file) — カメラとアルバム。
- [Photo Editor](/docs/editor) — モーダルでの切り抜きと編集。
- [Photo Viewer](/docs/viewer) — モーダルでの画像閲覧。
- [テーマ](/docs/theme) — CSS 変数。
