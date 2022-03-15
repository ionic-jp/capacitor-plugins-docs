import { Component, h } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-stripe',
  styleUrl: 'app-stripe.scss',
  shadow: true,
})
export class AppStripe {
  render() {
    return (
      <div class="app-stripe">
        <div class="hero">
          <section>
            <h1>Web技術でつくったモバイルアプリで稼ぎ出す。</h1>
            <p>あなたのプロダクトは、ブラウザからのアクセスでしか価値はないものでしょうか。</p>
            <p>
              ブラウザを使ったGoogle検索で自分に合った商品を探すのと同じように、人々はアプリストアでモバイルアプリを検索します。そのようなお客様のために
              Stripeを使ったモバイルアプリと決済機能を実装してみませんか？<br />
              もしあなたがウェブサイトを作ることができるなら、Capacitorとこのプラグインで、
              アプリもリリースすることができます！
            </p>
            <div class="hero-link">
              <a {...href('/docs/configuration')} class="btn inside">
                Get Started
              </a>
              <a href="https://capacitorjs.jp/" class="btn" target="_blank">
                Learn Capacitor
              </a>
            </div>
          </section>
          <img src="/assets/stripe/capacitor-image.png" width="1089" height="1220" alt="capacitor" decoding="async" />
        </div>
        <div class="used">
          <h2>Used</h2>
          <div class="used-items">
            <a href="https://www.doctr.ca/" target="_blank"><img src="/assets/stripe/doctr.svg" alt="doctr" decoding="async" /></a>
            <a href="https://www.sunset-palmi.it/" target="_blank"><img src="/assets/stripe/sunset.png" width="200" alt="sunset" decoding="async" /></a>
            <a href="https://www.vegasbuilt.com" target="_blank"><img src="/assets/stripe/vegasbuilt.svg" width="200" alt="sunset" decoding="async" /></a>
          </div>
        </div>
      </div>
    );
  }
}
