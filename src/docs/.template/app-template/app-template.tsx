import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-template',
  styleUrl: 'app-template.scss',
  shadow: true,
})
export class AppTemplate {
  render() {
    return (
      <div>
        Hello World!!
      </div>
    );
  }
}
