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
            <h1>Plugin for earning revenue on mobile app with web technologies</h1>
            <p>
              Is the value of your product that can only be accessed through a browser?
            </p>
            <p>
              People search for mobile apps in app stores just as much as they search for products that suit them in Google search using a browser.
              For those customers, why don't you implement a mobile app and payment function using Stripe? <br />
              If you can build a website, then with Capacitor and this plugin, you can release your app!
            </p>
            <div class="hero-link">
              <a href="https://capacitorjs.jp/" class="btn capacitor">Learn Capacitor</a>
              <a href="https://capacitorjs.jp/" class="btn">Start Plugin</a>
            </div>
          </section>
          <img src="./assets/images/capacitor-image.png" alt="capacitor" decoding="async" />
        </div>
      </div>
    );
  }
}
