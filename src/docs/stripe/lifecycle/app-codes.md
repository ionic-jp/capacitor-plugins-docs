---
file: "app-codes.ts"
---
```tsx
import {Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'app-codes',
  styleUrls: ['app-codes.scss', '../app-parser/app-parser.scss'],
  shadow: true,
})
export class AppCodes {
  @Prop() codes: Record<string, string>;
  @Prop() activeLine: Record<string, number[]>
  render() {
    return (
      <Host>
        <div class="znc">
          {Object.keys(this.codes).map(key => {
            <button>{key}</button>
          })}
          {Object.keys(this.codes).map(key => {
            <div class="{key}" innerHTML={this.codes[key]}></div>
          })}
        </div>
      </Host>
    );
  }

}
```