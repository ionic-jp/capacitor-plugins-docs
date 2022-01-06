import { Component, h } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: true,
})
export class AppHome {
  render() {
    return (
      <div class="app-home">
        <div class="hero">
          <section>
            <h1>Web技術でつくったモバイルアプリで稼ぎ出す。</h1>
            <p>あなたのプロダクトは、ブラウザからのアクセスでしか価値はないものでしょうか。</p>
            <p>
              ブラウザを使ったGoogle検索で自分に合った商品を探すのと同じように、人々はアプリストアでモバイルアプリを検索します。そのようなお客様のために
              Stripeを使ったモバイルアプリと決済機能を実装してみませんか？<br />
              もしあなたがウェブサイトを作ることができるなら、Capacitorとこのプラグインで、アプリもリリースすることができます！
            </p>
            <div class="hero-link">
              <a {...href('/docs/configuration')} class="btn inside">
                はじめる
              </a>
              <a href="https://capacitorjs.jp/" class="btn" target="_blank">
                Capacitorとは
              </a>
            </div>
          </section>
          <img src="/assets/images/capacitor-image.png" alt="capacitor" decoding="async" />
        </div>
      </div>
    );
  }
}
