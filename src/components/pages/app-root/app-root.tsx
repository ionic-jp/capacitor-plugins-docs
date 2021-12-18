import { Component, h, Host } from '@stencil/core';
import { Route } from 'stencil-router-v2';
import { Router } from '../../shared/router';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: true,
})
export class AppRoot {
  render() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <app-home></app-home>
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
