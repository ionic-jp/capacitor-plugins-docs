import {Component, h, State, Listen, Prop, Watch} from '@stencil/core';
import {MarkdownCode, MarkdownContent} from '../../../global/definitions';
import {usePlugin} from '../../shared/utils';

@Component({
  tag: 'app-docs',
  styleUrl: 'app-docs.scss',
  shadow: true,
})
export class AppDocs {
  @State() activeLine: Record<string, number[]> = {};
  @State() markdownContent: MarkdownContent;
  @State() codes: Record<string, string> = {};
  @Prop() path: string;

  @Listen('changedActiveLine')
  activeLineHandler(event: CustomEvent<Record<string, number[]>>) {
    this.activeLine = event.detail;
  }

  async componentWillLoad(): Promise<void> {
    const { markdownContent, codes, activeLine } = await this.initialize(this.path);
    this.markdownContent = markdownContent;
    this.codes = codes;
    this.activeLine = activeLine;
  }

  @Watch('path')
  async watchPathHandler() {
    const { markdownContent, codes, activeLine } = await this.initialize(this.path);
    this.markdownContent = markdownContent;
    this.codes = codes;
    this.activeLine = activeLine;
  }

  private async initialize(path: string): Promise<{
    markdownContent: MarkdownContent,
    codes: Record<string, string>,
    activeLine: Record<string, number[]>,
  }> {
    const docs = Object.keys(usePlugin()).map(key => usePlugin()[key]);
    const doc = docs.flat().find(d => d.path === path);

    const markdownContent: MarkdownContent = await fetch(doc.filePath)
      .then(response => response.json())
      .catch(e => console.log(e));

    const codes: MarkdownCode[] = await Promise.all(
      markdownContent.code.map(url => {
          return fetch('/assets/' + url.replace('.md', '.json'))
            .then(response => response.json())
            .catch(e => console.log([e, url]))
        }
      ));

    let returnCode = {}
    codes.map(code => returnCode = Object.assign(returnCode, {
      [code.file]: code.hypertext,
    }));

    // idが空の要素があればセット
    const firstSet = markdownContent.scrollActiveLine.find(d => !d.id);

    return {
      markdownContent,
      codes: returnCode,
      activeLine: firstSet?.activeLine || {},
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
