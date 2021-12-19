---
title: "[翻訳]Ionic6がやってきた。"
code: []
scrollActiveLine: []
---

![](/images/59278a50a7f0f7/ionic-6-feature-image-1-1536x845.png)

> この記事は [Announcing Ionic6 !](https://ionicframework.com/blog/announcing-ionic-6/) を、翻訳、加筆したものです。英語に抵抗がない方はぜひ原文もご覧ください。

本日、Ionic6 のリリースをお知らせします。このリリースでは、デスクトップサポートの改善、コンポーネントのオーバーホール、iOSとAndroidのデザインの変更など、多くの機能が追加されています。

> Ionic FrameworkはWeb技術でモバイルアプリ（iOS, Android）を制作してストアから配信するためのフレームワークです。アメリカのジェネラルモーターズ（日本でいうSony）やディズニー、世界最大の国民健康サービスであるNHSなどの大手から、フリーランスのWeb制作者まで利用されており、世界中に多くのファンがいます。

Ionic6 でアプリがどう変わるか期待できることを見てみましょう。

## 簡単なアップグレード

今回のリリースでは、Ionicの破壊的変更が含まれていますが、破壊的変更は最小限にとどめるように努めました。 Ionic6 は、以前の Ionic4 と Ionic5 の両方のリリースよりも変更点が少ないのです！

Ionic6 への移行方法については、 [Ionic6  Migration Guide](https://ionicframework.jp/docs/intro/upgrading-to-ionic-6/) をご覧ください。

## より速く、より信頼性の高いリリースサイクル 🚄

Ionic6 のリリースに伴って、iOSやAndroidのソフトウェアリリースに合わせたリリーススケジュールを調整中です。今後、Ionicのメジャーリリースは1年ごとに行われる予定です。

## デザインの変更点 🎨

### iOS

iOS モードの注目すべきデザイン変更には、新しいリフレッシュスタイル、ダークモード用のツールバーとモーダルスタイルの更新が含まれます。また、 `ion-header` と `ion-footer` の両方に新しい折りたたみオプションが追加されました。これにより、開発者は、ユーザーがスクロールを始めるまで、ヘッダーとフッターの背景を隠すことができます。

```html
<ion-header translucent="true" collapse="fade">
  <ion-toolbar>
    <ion-title>Title</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen="true">
...
</ion-content>

<ion-footer translucent="true" collapse="fade">
  <ion-toolbar>
    <ion-title>Footer</ion-title>
  </ion-toolbar>
</ion-footer>
```

![](https://i.gyazo.com/c79a082adae5ed8950e5c7e46c2bd7a5.gif)

![](https://i.gyazo.com/92b6ef23fde2b7d965fc53e2becb6e99.gif)

### Android

Material Designモードのインプットスタイルを刷新し、新たに塗りつぶしとアウトラインののインプットデザインをサポートしました。また、文字カウンターに加え、エラーとヘルパーテキストのための `slot` を追加しました。

![](https://i.gyazo.com/dda4238dff4e0a275ed86355724aad1f.gif)

## Bottom Sheet

Ionic6 の新機能であるボトムシートをリリースできることを大変嬉しく思っています。 `ion-modal` の一部として、開発者はブレークポイントにスナップし、インタラクティブなコンテンツをオーバーレイする動的なシートを作成することができます。

![](https://i.gyazo.com/23ef4afb122bae2fe9a10ba0bfd1778f.gif)

## Datetime

Ionic6 で最も大きなコンポーネントの変更の1つは、 `ion-datetime` コンポーネントです。iOSとAndroidで最新のカレンダーピッカースタイルを使用するためにdatetimeを刷新しました。また、デスクトップデバイスでは、日付の選択時にキーボードとスクリーンリーダーを完全に統合し、機能を向上させました。`ion-datetime` は、デバイスの言語と地域の設定を調べ、各ユーザーに馴染みのあるフォーマットで表示されるようになりました。

![](https://i.gyazo.com/19ef91aeffe8913fb7c281d67d3d085b.gif)

## Select

`ion-select` に追加された新しい Material Design のスタイルに加え、オプションを選択するためのキーボードインタラクションを追加することで、デスクトップサポートも改善されました。 `ion-select` でポップオーバーインターフェースを使用することで、開発者はデスクトップで Select を使うリッチな体験を簡単に作成することができます。

![](https://i.gyazo.com/b132f87278504239ed1bedd79941107b.gif)

## Modal

`ion-modal` は刷新され、アプリケーションのテンプレート内で宣言的に使用できるようになりました。つまり、開発者はテンプレート内に `<ion-modal>` と記述し、表示するコンポーネントを渡すことができます。また、新たに `isOpen` と `trigger` プロパティが追加されました。これらのプロパティにより、開発者はより少ないコードでモーダルの表示と非表示を行うことができます。

React と Vue の開発者にとって、この変更は `ion-modal` への参照を取得すると、プレースホルダ要素ではなく、実際のモーダルコンポーネントが返されることを意味します。

```html
<ion-button id="modal-button">Open Modal</ion-modal>
<ion-modal trigger="modal-button">
  <my-custom-component></my-custom-component>
</ion-modal>

...

<ion-modal is-open="true">
  <my-custom-component></my-custom-component>
</ion-modal>
```

![](https://i.gyazo.com/fed2227be2e545ef87cadc4d52f2d1e5.gif)

## Popover

`ion-popover` は、アプリケーションのテンプレート内で宣言的に使用することもでき、 `ion-modal` が受け取るのと同様に、 `isOpen` と `trigger` プロパティを受け取ることができます。

また、 `side` 、 `alignment` 、 `size` 属性を通じて、ポップオーバーのサイズと位置のオプションが改善されました。これらの新機能により、開発者はアプリ内でポップオーバーがどのように表示されるかをコントロールすることができます。

まだあります! ネストされたポップオーバーの機能がIonicに追加されました。これは、デスクトップアプリケーションでマルチレイヤードロップダウンメニューを構築するための強力な機能です。ネストされたポップオーバーは、新しい宣言的な構文で動作し、トリガープロパティとシームレスに統合されます。

![](https://i.gyazo.com/1a13ba30eadbed0aa67eedf871908514.gif)

## Item

マテリアルデザインの更新の一環として、 `ion-item` に新しいスタイルを追加し、より仕様にマッチするようにしました。さらに、フォームバリデーションを改善するために、新しいヘルパーとエラーの `slot` を追加しました。

```html
<ion-item>
  <ion-label>Email</ion-label>
  <ion-input type="email"></ion-input>
  <ion-note slot="helper">Please enter your email.</ion-note>
  <ion-note slot="error">You must enter a valid email.</ion-note>
</ion-item>
```

## Accordion

Ionic6 で登場する新コンポーネントは、 `ion-accordion` です。アコーディオンは、大量のコンテンツをわかりやすく整理することを可能にします。このコンポーネントには、スムーズなアニメーション、キーボードサポート、モーションを削減するアクセシビリティなどの機能が搭載されています。

```html
<ion-accordion-group>
  <ion-accordion value="colors">
    <ion-item slot="header">
      <ion-label>Colors</ion-label>
    </ion-item>

    <ion-list slot="content">
      <ion-item>
        <ion-label>Red</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Green</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Blue</ion-label>
      </ion-item>
    </ion-list>
  </ion-accordion>
  <ion-accordion value="shapes">
    <ion-item slot="header">
      <ion-label>Shapes</ion-label>
    </ion-item>

    <ion-list slot="content">
      <ion-item>
        <ion-label>Circle</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Triangle</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Square</ion-label>
      </ion-item>
    </ion-list>
  </ion-accordion>
  <ion-accordion value="numbers">
    <ion-item slot="header">
      <ion-label>Numbers</ion-label>
    </ion-item>

    <ion-list slot="content">
      <ion-item>
        <ion-label>1</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>2</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>3</ion-label>
      </ion-item>
    </ion-list>
  </ion-accordion>
</ion-accordion-group>
```

![](https://i.gyazo.com/5c04040de7478dbcc9e6e40b9d469372.gif)

## Breadcrumbs

2つ目の新コンポーネントは、 `ion-breadcrumbs` です。パンくずリストは、ユーザがアプリケーションのどこにいて、どのようにそこにたどり着いたかについて、ユーザにコンテキストを提供します。このコンポーネントは、テーマ化したり、折りたたんだりすることができます。

```html
<ion-breadcrumbs>
  <ion-breadcrumb href="#">
    Home
  </ion-breadcrumb>
  <ion-breadcrumb href="#electronics">
    Electronics
  </ion-breadcrumb>
  <ion-breadcrumb href="#photography">
    Photography
  </ion-breadcrumb>
  <ion-breadcrumb href="#cameras">
    Cameras
  </ion-breadcrumb>
  <ion-breadcrumb href="#film">
    Film
  </ion-breadcrumb>
  <ion-breadcrumb>
    35 mm
  </ion-breadcrumb>
</ion-breadcrumbs>
```

![](https://i.gyazo.com/4f7f482293255b279241a749b539da6f.gif)

# パフォーマンスとツール

Ionicは、最新のWeb APIを使用する高速のコンポーネントのセットとして構築されています。これは、お客様のアプリがネイティブアプリケーションと同じくらい高速になることを意味します。StencilJSの優れた部分を利用して、お客様のIonicアプリのパフォーマンスとバンドリングを改善します。

# カスタム要素
Ionic6 では、Custom Elementsビルドと呼んでいるIonicの新しいビルドでリリースしています。このビルドはStencilJSの遅延読み込みに依存せず、アプリケーションで使用されるコンポーネントのみをバンドルすることを支援します。これにより、アプリケーションの全体的なサイズを小さくすることができます。正確な削減効果はアプリによって異なりますが、この変更により、ほとんどのアプリでバンドルサイズが削減されるものと確信しています。

Custom Elementsビルドは、Ionic ReactおよびIonic Vueで利用可能で、将来のリリースでIonic Angularにも展開される予定です。

# Vite、Rollup、ESBuild - oh my!

さらに、Ionic6 はVite、Rollup、ESBuildなどのツールで使用できるため、開発者はアプリを構築する際の選択肢がさらに広がります。

# Vue Routing 🗺

Vueの開発者は、 `useIonRouter injectable` を使用してIonic Vueでナビゲートする新しい方法を手に入れました。この新機能により、開発者はページ遷移を制御したままVue Routerを使用できます。

```html
import { useIonRouter } from '@ionic/vue';

...

const router = useIonRouter();
router.navigate(
  `/page`,
  'forward',
  'replace',
  customAnimation
);
```

詳しくは [Ionic Vue Router Documentation](https://ionicframework.jp/docs/vue/utility-functions#router) をご覧ください。

# プラットフォーム検出のカスタマイズ 🧶

Ionic6 では、新しいプラットフォーム検出のカスタマイズオプションが追加されました。このオプションは、Ionic が事前に設定したプラットフォーム一覧に必ずしも収まらないデバイスを開発者が考慮できるようにするためのものです。この機能を使用することで、開発者は Ionic のプラットフォームの設定方法をカスタマイズして、他のデバイスを考慮することができます。

```ts
import { IonicConfig } from '@ionic/core';

const config: IonicConfig = {
  platform: {
    /** The default `desktop` function returns false for devices with a touchscreen.
     * This is not always wanted, so this function tests the User Agent instead.
     **/
    'desktop': (win) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
      return !isMobile;
    }
  }
}
```

# TypeScriptの改善 💬💬💬💬

Ionic 5 では、CustomEvent のターゲットでメソッドを呼び出すと、開発者がターゲットを型キャストしない限り、TypeScript エラーが発生することがありました。これは、IonInfiniteScroll コンポーネントで `event.target.complete()` を呼び出す際によく発生しました。Ionic6 では、このターゲットが正しくタイプキャストされたTypeScriptインターフェイスを導入しています。

__Before__
```ts
const onInfinite = (ev: CustomEvent) => {
  ...
  ev.target.complete(); // TypeScript error
}
```

__After__
```ts
const onInfinite = (ev: InfiniteScrollCustomEvent) => {
  ...
  ev.target.complete();
}
```

これらのカスタムイベントインターフェースは、イベントを発信する各Ionicコンポーネントのドキュメントに記載されています。例えば、IonInfiniteScrollのインターフェースは、 [Infinite Scroll Documentation](https://ionicframework.jp/docs/api/infinite-scroll#interfaces) に記載されています。

# 入門編 🤠 はこちら
既存のIonic 5アプリをお持ちの方がIonic6 を使い始めるには、 [Ionic6 マイグレーションガイド](https://ionicframework.jp/docs/intro/upgrading-to-ionic-6) をご覧ください。

新規にIonic6 アプリを開発する場合は、[アプリ作成ウィザード](https://ionicframework.com/start#basics) をお試しください。

Ionic6 はすぐにでも使い始められますが、途中で何かの不具合に遭遇するかもしれません。その際は [GitHubのレポ](https://github.com/ionic-team/ionic-framework/issues/new/choose) にご報告いただければ幸いです。

# 次は何をする？👀

2022年は、Ionicにとって信じられないような年になりそうです。私たちは、Ionicをモダンにし、使いやすくすることに重点を置いています。現在取り組んでいる大きな特徴として、Ionicのドキュメントサイトにコンポーネントプレイグラウンドを設置する予定です。このプレイグラウンドでは、開発者がページ上でコンポーネントの例を見ることができます。また、Ionicアプリケーションを起動しなくても、コンポーネントを操作したり、プロパティを変更したりすることができるようになります。

それ以外にも、Ionic6 で提供した機能をより良いものにするために、さらに強化していく予定です。刷新されたコンポーネントをより良くするためのアイデアがあれば、 [GitHubのレポ](https://github.com/ionic-team/ionic-framework/issues/new/choose) で教えてください。

ご期待ください。

# ありがとうございました💙

Ionicコミュニティーの皆様に心から感謝申し上げます。Ionic6 は、コミュニティの素晴らしいフィードバック、テスト、コードの貢献なしには実現できませんでした。これからも、Ionicをより良いものにするために、コミュニティとの関わりを大切にしていきたいと思います。
