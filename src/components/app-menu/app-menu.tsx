import { Component, Host, h } from '@stencil/core';
import { href } from 'stencil-router-v2';

import sideMenu from '../../docs/sidemenu.json'

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss',
  shadow: true,
})
export class AppMenu {

  render() {
    return (
      <Host>
        {Object.keys(sideMenu).map(key =>
          <div>
            <h2>{key}</h2>
            <ul>
              {
                sideMenu[key].map(item =>
                  <li><a {...href('/docs/' + item.path)}>{item.title}</a></li>
                )
              }
            </ul>
          </div>
        )}
      </Host>
    );
  }

}
