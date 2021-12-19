import { Component, h, Host } from '@stencil/core';
import { Route } from 'stencil-router-v2';
import { Router } from '../router';

@Component({
  tag: 'app-root',
  shadow: true,
  styleUrl: 'app-root.scss'
})
export class AppRoot {
  render() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    return (
      <Host>
        <app-header></app-header>
        <div class="wrapper">
          <app-menu></app-menu>
          <main>
            <Router.Switch>
              <Route path="/">
                <app-home></app-home>
              </Route>
            </Router.Switch>
          </main>
        </div>
      </Host>
    );
  }
}
