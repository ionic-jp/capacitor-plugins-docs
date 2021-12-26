import {Component, Host, h, Prop, Watch, State} from '@stencil/core';
import { href } from 'stencil-router-v2';

import sideMenu from '../../docs/sidemenu.json'
import {Router} from '../shared/router';

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss',
  shadow: true,
})
export class AppMenu {
  @Prop() path: string;
  @State() _path: string;

  @Watch('path')
  async watchPathHandler() {
    this._path = this.path;
  }

  render() {
    const activePath = Router.activePath;
    return (
      <Host>
        <h2>Guide</h2>
        <ul>
          <li><a {...href('/')} class={'/' === activePath ? 'active' : ''}>Introduction</a></li>
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
