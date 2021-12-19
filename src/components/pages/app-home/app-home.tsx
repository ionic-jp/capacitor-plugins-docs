import {Component, h} from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow:  true,
})
export class AppHome {
  render() {
    return (
      <div class="app-home">
        <div class="hero">
          <section>
            <h1>Web技術でアプリ上から収益を得るためのプラグイン</h1>
            <p>
              あなたのプロダクトの価値には、ブラウザからでしかアクセスできないものでしょうか。
            </p>
            <p>
              ブラウザを使ってGoogle検索で自分にあった商品を探すのと同じぐらい、アプリストアでモバイルアプリを探す人はいます。<br />そういったお客様に向けて、モバイルアプリとStripeを使った決済機能を実装してみませんか？？Webサイトをつくることができるなら、Capacitorとこのプラグインを利用すればもうあなたはアプリをリリースすることができます！
            </p>
            <div class="hero-link">
              <a href="https://capacitorjs.jp/" class="btn capacitor">Capacitorを学ぶ</a>
              <a href="https://capacitorjs.jp/" class="btn">プラグインをはじめる</a>
            </div>
          </section>
          <img src="./assets/images/capacitor-image.png" alt="capacitor" decoding="async" />
        </div>
      </div>
    );
  }
}
