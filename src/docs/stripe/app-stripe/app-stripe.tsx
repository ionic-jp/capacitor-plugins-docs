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
      <div class="app-home">
        <div class="hero">
          <section>
            <h1>Earn on mobile app with web tech.</h1>
            <p>Is the value of your product can only be accessed through browser?</p>
            <p>
              People search for mobile apps in app stores just as much as they search for products that suit them in Google search using a browser. For those customers, why don't
              you implement a mobile app and payment function using Stripe? <br />
              If you can build a website, then with Capacitor and this plugin, you can release your app!
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
          </div>
        </div>
      </div>
    );
  }
}
