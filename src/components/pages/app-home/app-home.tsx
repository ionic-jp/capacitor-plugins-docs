import { Component, h } from '@stencil/core';
import { plugin } from '../../shared/utils';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: true,
})
export class AppHome {
  render() {
    const component: string = plugin['alias'];

    return (
      <div class="app-home" innerHTML={`<app-${component}></app-${component}>`}/>
    );
  }
}
