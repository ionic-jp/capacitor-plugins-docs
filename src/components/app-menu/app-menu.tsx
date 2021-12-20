import { Component, Host, h } from '@stencil/core';
import { href } from 'stencil-router-v2';

import sideMenu from '../../docs/sidemenu.json'
import {Router} from '../shared/router';

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss',
  shadow: true,
})
export class AppMenu {

  render() {
    const activePath = Router.activePath;
    return (
      <Host>
        <h2>Guide</h2>
        <ul>
          <li><a {...href('/')} class={'/' === activePath ? 'active' : ''}>はじめに</a></li>
        </ul>
        {Object.keys(sideMenu).map(key =>
          <div>
            <h2>{key}</h2>
            <ul>
              {
                sideMenu[key].map(item =>
                  <li><a {...href('/docs/' + item.path)} class={'/docs/' + item.path === activePath ? 'active' : ''}>{item.title}</a></li>
                )
              }
            </ul>
          </div>
        )}
      </Host>
    );
  }

}
