import {Component, h, Host, Listen, State} from '@stencil/core';
import {match, Route} from 'stencil-router-v2';
import { Router } from '../../shared/router';
import {InternalRouterState} from 'stencil-router-v2/dist/types';

@Component({
  tag: 'app-root',
  shadow: true,
  styleUrl: 'app-root.scss'
})
export class AppRoot {
  @State() isActiveMenu = false;
  @Listen('changeMenuState')
  changeMenuStateHandler(event: CustomEvent<boolean>) {
    this.isActiveMenu = event.detail;
  }

  render() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    Router.onChange('url', (newValue: InternalRouterState['url'], _oldValue: InternalRouterState['url']) => {
      if (newValue !== _oldValue) {
        window.scrollTo(0, 0);
      }
    });

    return (
      <Host>
        <app-header isBtnActive={this.isActiveMenu}></app-header>
        <div class="wrapper">
          <Router.Switch>
            <Route
              path={(url) => {
                return { path: url }
              }}
              render={({path}) => <app-menu class={this.isActiveMenu ? 'slide-in' : ''} path={path}></app-menu>}
            />
          </Router.Switch>
          <main class={this.isActiveMenu ? 'slide-out' : ''}>
            <Router.Switch>
              <Route path="/">
                <app-home></app-home>
              </Route>
              <Route
                path={match('/docs/:path')}
                render={({path}) => <app-docs path={path}></app-docs>}
              />
            </Router.Switch>
          </main>
        </div>
        <footer><p>©2022 RELATION DESIGN LABO, GENERAL INC. ASSOCIATION. Released under MIT License</p></footer>
      </Host>
    );
  }
}
