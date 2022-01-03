import {Component, Host, h, Prop, Watch, State} from '@stencil/core';
import { href } from 'stencil-router-v2';

import {Router} from '../shared/router';
import {usePlugin} from '../shared/utils';

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
    const sideMenu = usePlugin();

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
                  <li><a {...href('/docs/' + item.path)} class={item.path === activePath ? 'active' : ''}>{item.title}</a></li>
                )
              }
            </ul>
          </div>
        )}
      </Host>
    );
  }

}
