import {Component, Host, h, Prop, Watch, State, Event, EventEmitter} from '@stencil/core';
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

  @Event({
    eventName: 'changeMenuState',
  }) changeMenuState: EventEmitter<boolean>;

  @Watch('path')
  async watchPathHandler() {
    this._path = this.path;
  }

  hideMenuHandle = (_) => {
    this.changeMenuState.emit(false)
  }

  render() {
    const sideMenu = usePlugin();

    const activePath = Router.activePath;
    return (
      <Host>
        <h2>Guide</h2>
        <ul onClick={this.hideMenuHandle}>
          <li><a {...href('/')} class={'/' === activePath ? 'active' : ''}>Introduction</a></li>
        </ul>
        {Object.keys(sideMenu).map(key =>
          <div>
            <h2>{key}</h2>
            <ul onClick={this.hideMenuHandle}>
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
