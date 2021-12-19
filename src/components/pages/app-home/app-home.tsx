import {Component, h, Listen, State} from '@stencil/core';
import {MarkdownCode, MarkdownContent} from '../../../global/definitions';
import sideMenu from '../../../../docs/sidemenu.json'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: false,
})
export class AppHome {
  @State() markdownContent: MarkdownContent;
  @State() codes: Record<string, string> = {};
  @State() activeLine: Record<string, number[]> = {};

  @Listen('changedActiveLine')
  activeLineHandler(event: CustomEvent<Record<string, number[]>>) {
    console.log(event.detail);
    this.activeLine = event.detail;
  }

  async componentWillLoad(): Promise<void> {
    const data: MarkdownContent = await fetch('./assets/docs/stripe/lifecycle.json')
      .then(response => response.json())
      .catch(e => console.log(e));
    this.markdownContent = data;

    const codes: MarkdownCode[] = await Promise.all(
      data.code.map(url => {
        return fetch('./assets/' + url.replace('.md', '.json'))
            .then(response => response.json())
            .catch(e => console.log(e))
        }
      ));
    codes.map(code => this.codes = Object.assign(this.codes, {
      [code.file]: code.hypertext,
    }));

    // idが空の要素があればセット
    const firstSet = data.scrollActiveLine.find(d => !d.id);
    if (firstSet) {
      this.activeLine = firstSet.activeLine;
    }
  }

  render() {
    return (
      <div class="app-home">
        <app-parser markdownContent={this.markdownContent}></app-parser>
        {this.codes !== {} ? <app-codes codes={this.codes} activeLine={this.activeLine}></app-codes> : ''}
      </div>
    );
  }
}
