import {Component, Host, h, Prop} from '@stencil/core';
import {getArrayFromAny} from '../shared/utils';

@Component({
  tag: 'app-scroll',
  shadow: true,
})
export class AppScroll {
  @Prop() activeLine: string;

  private getActiveLine = (options_list: string): Record<string, number[]> => {
    return getArrayFromAny<Record<string, number[]>>(options_list); //string -> jsonに変換
  };

  render() {
    const activateLine = this.getActiveLine(this.activeLine);
    return (
      <Host>{activateLine}</Host>
    );
  }

}
