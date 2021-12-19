import {Component, h, State, Listen, Prop, Watch} from '@stencil/core';
import {MarkdownCode, MarkdownContent} from '../../../global/definitions';
import sideMenu from '../../../docs/sidemenu.json'

@Component({
  tag: 'app-docs',
  styleUrl: 'app-docs.scss',
  shadow: true,
})
export class AppDocs {
  @State() markdownContent: MarkdownContent;
  @State() codes: Record<string, string> = {};
  @State() activeLine: Record<string, number[]> = {};
  @Prop() path: string;

  @Listen('changedActiveLine')
  activeLineHandler(event: CustomEvent<Record<string, number[]>>) {
    this.activeLine = event.detail;
  }

  @Watch('path')
  watchPathHandler() {
    this.componentWillLoad();
  }

  async componentWillLoad(): Promise<void> {
    const docs = Object.keys(sideMenu).map(key => sideMenu[key]);
    const doc = docs.flat().find(d => d.path === this.path);

    const data: MarkdownContent = await fetch(doc.filePath)
      .then(response => response.json())
      .catch(e => console.log(e));
    this.markdownContent = data;

    if (data.code?.length === 0) {
      this.codes = {};
      this.activeLine = {};
    }

    const codes: MarkdownCode[] = await Promise.all(
      data.code.map(url => {
          return fetch('/assets/' + url.replace('.md', '.json'))
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
      <div class="app-docs">
        <app-parser markdownContent={this.markdownContent} hideCodeBlock={Object.keys(this.codes).length > 0}></app-parser>
        {Object.keys(this.codes).length > 0 ? <app-codes codes={this.codes} activeLine={this.activeLine}></app-codes> : ''}
      </div>
    );
  }
}
